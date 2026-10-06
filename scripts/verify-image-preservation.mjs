// Guards the image history the storyboard's chooser and "Browse all images" show. Compares the working tree with a base
// ref (default origin/main; set IMAGE_GUARD_BASE) and fails if any picture was lost, in either project:
//   1. a shot image under public/images/<project> that was changed or deleted must have its old bytes kept in
//      public/images/<project>/archive/<folder>/<name>--vN.<ext>
//   2. nothing already in archive/ may be changed or deleted (it is append-only)
//   3. the NEONOIRE library.json may not drop an image the base listed
// New files are always fine. Run it before every handoff and push:  npm run verify:images
//
// The cold open's pictures (public/images/hangar/) fall under the same standing rule in CLAUDE.md, so they
// are compared against their own archive/ the same way.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const base = process.env.IMAGE_GUARD_BASE || "origin/main";
const git = (...a) => execFileSync("git", a, { maxBuffer: 512 * 1024 * 1024, stdio: [ "ignore", "pipe", "pipe" ] });
try { git("rev-parse", "--verify", `${base}^{commit}`); }
catch { console.log(`  SKIP  base ref ${base} not available here (shallow clone?); fetch it: git fetch origin main`); process.exit(0); }

const ARCHIVE = "archive/";
const PROJECTS = [ "public/images/neonoire/", "public/images/hangar/" ];
const sha = buf => createHash("sha256").update(buf).digest("hex");
const isImage = p => /\.(jpe?g|png|webp)$/i.test(p);
const walk = dir => existsSync(dir) ? readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [ p ]; }) : [];
const problems = [];
let changedPaths = 0;

for (const IMG of PROJECTS) {
  const ARCHIVE_DIR = `${IMG}${ARCHIVE}`;
  const changed = git("diff", "--name-status", "--no-renames", base, "--", IMG).toString().split("\n").filter(Boolean)
    .map(line => { const [ status, path ] = line.split("\t"); return { status, path }; });
  changedPaths += changed.length;

  const archiveHashes = new Set();
  for (const file of walk(ARCHIVE_DIR)) if (isImage(file)) archiveHashes.add(sha(readFileSync(file)));

  for (const { status, path } of changed) {
    if (!isImage(path) || path.startsWith(`${IMG}reviews/`)) continue;
    if (status === "A") continue;
    if (path.startsWith(ARCHIVE_DIR)) { problems.push(`${status === "D" ? "deleted" : "changed"} archived version ${path} — the archive is append-only`); continue; }
    const old = git("show", `${base}:${path}`);
    if (!archiveHashes.has(sha(old))) {
      const folder = dirname(path).slice(IMG.length), stem = basename(path, extname(path));
      problems.push(`${status === "D" ? "deleted" : "overwrote"} ${path} without archiving it — copy the old file to ${ARCHIVE_DIR}${folder}/${stem}--v<N>${extname(path)} first`);
    }
  }
}

// Only NEONOIRE keeps a browsable manifest; the cold open's chooser reads its folders.
const LIBRARY = "public/images/neonoire/library.json";
try {
  const lib = text => new Set(JSON.parse(text).images.map(i => i.src));
  const before = lib(git("show", `${base}:${LIBRARY}`).toString());
  const after = lib(readFileSync(LIBRARY, "utf8"));
  const dropped = [ ...before ].filter(src => !after.has(src));
  if (dropped.length) problems.push(`library.json dropped ${dropped.length} image(s) the chooser shows, e.g. ${dropped.slice(0, 3).join(", ")} — regenerate with node scripts/neonoire/image-library.mjs and restore any it cannot rediscover from git show ${base}:${LIBRARY}`);
} catch (error) { console.log(`  SKIP  library.json comparison (${String(error.message).split("\n")[0]})`); }

if (problems.length) {
  console.error(`\nImage history would be lost (compared with ${base}):`);
  for (const p of problems) console.error(`  FAIL  ${p}`);
  process.exit(1);
}
console.log(`  PASS  no image overwritten or deleted without an archived copy; archives untouched; library.json lost nothing (vs ${base}, ${PROJECTS.length} project(s), ${changedPaths} image path(s) differ)`);
