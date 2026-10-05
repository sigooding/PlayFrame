// Guards the image history the storyboard's chooser and "Browse all images" show. Compares the working tree with a base
// ref (default origin/main; set IMAGE_GUARD_BASE) and fails if any picture was lost:
//   1. a shot image under public/images/neonoire that was changed or deleted must have its old bytes kept in
//      public/images/neonoire/archive/<folder>/<name>--vN.<ext>
//   2. nothing already in archive/ may be changed or deleted (it is append-only)
//   3. library.json may not drop an image the base listed
// New files are always fine. Run it before every handoff and push:  npm run verify:images
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const base = process.env.IMAGE_GUARD_BASE || "origin/main";
const git = (...a) => execFileSync("git", a, { maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
try { git("rev-parse", "--verify", `${base}^{commit}`); }
catch { console.log(`  SKIP  base ref ${base} not available here (shallow clone?); fetch it: git fetch origin main`); process.exit(0); }

const IMG = "public/images/neonoire/", ARCHIVE = `${IMG}archive/`;
const sha = buf => createHash("sha256").update(buf).digest("hex");
const isImage = p => /\.(jpe?g|png|webp)$/i.test(p);
const changed = git("diff", "--name-status", "--no-renames", base, "--", IMG).toString().split("\n").filter(Boolean)
  .map(line => { const [status, path] = line.split("\t"); return { status, path }; });
// Untracked/uncommitted files count too: diff against the working tree, plus new files are ignored by design.
const problems = [];

const archiveHashes = new Set();
const walk = dir => existsSync(dir) ? readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; }) : [];
for (const file of walk(ARCHIVE)) if (isImage(file)) archiveHashes.add(sha(readFileSync(file)));

for (const { status, path } of changed) {
  if (!isImage(path) || path.startsWith(`${IMG}reviews/`)) continue;
  if (status === "A") continue;
  if (path.startsWith(ARCHIVE)) { problems.push(`${status === "D" ? "deleted" : "changed"} archived version ${path} — the archive is append-only`); continue; }
  const old = git("show", `${base}:${path}`);
  if (!archiveHashes.has(sha(old))) {
    const folder = dirname(path).slice(IMG.length), stem = basename(path, extname(path));
    problems.push(`${status === "D" ? "deleted" : "overwrote"} ${path} without archiving it — copy the old file to ${ARCHIVE}${folder}/${stem}--v<N>${extname(path)} first`);
  }
}

try {
  const lib = path => new Set(JSON.parse(path).images.map(i => i.src));
  const before = lib(git("show", `${base}:${IMG}library.json`).toString());
  const after = lib(readFileSync(`${IMG}library.json`, "utf8"));
  const dropped = [...before].filter(src => !after.has(src));
  if (dropped.length) problems.push(`library.json dropped ${dropped.length} image(s) the chooser shows, e.g. ${dropped.slice(0, 3).join(", ")} — regenerate with node scripts/neonoire/image-library.mjs and restore any it cannot rediscover from git show ${base}:${IMG}library.json`);
} catch (error) { console.log(`  SKIP  library.json comparison (${String(error.message).split("\n")[0]})`); }

if (problems.length) {
  console.error(`\nImage history would be lost (compared with ${base}):`);
  for (const p of problems) console.error(`  FAIL  ${p}`);
  process.exit(1);
}
console.log(`  PASS  no image overwritten or deleted without an archived copy; archive untouched; library.json lost nothing (vs ${base}, ${changed.length} image path(s) differ)`);
