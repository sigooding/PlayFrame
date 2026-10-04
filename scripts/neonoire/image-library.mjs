// Builds the image library the frame dialog's "Browse all images" reads.
//
//   node scripts/neonoire/image-library.mjs
//
// 1. Shot images were retaken in place, so earlier versions live in the archive and/or git history. Register the
//    checked-in archive first, then pull any missing git-history versions to <name>--v<N>.jpg, v1 = oldest.
// 2. Writes public/images/neonoire/library.json: every picture the film owns (current shots, earlier versions, alternates
//    no shot uses, cast/location sheets, props) with where it came from. Contact sheets under reviews/ are left out.
// Re-running is safe: files are only written when missing, and the JSON is rebuilt from what is on disk.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";

const root = process.cwd(), base = join(root, "public/images/neonoire"), archive = join(base, "archive");
const git = (...a) => execFileSync("git", a, { cwd: root, maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
const bundle = JSON.parse(readFileSync(join(root, "public/projects/neonoire-opening.json"), "utf8"));
const used = new Set(bundle.frames.map(f => f.image));
const web = p => "/" + relative(join(root, "public"), p).split("\\").join("/");

const walk = dir => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? (p === archive || n === "reviews" ? [] : walk(p)) : /\.(jpe?g|png|webp)$/i.test(n) ? [p] : []; });
const current = walk(base);
const archived = existsSync(archive) ? walk(archive) : [];

const entries = [];
const earlierBySource = new Map();
let extracted = 0;
// Archives were created by earlier storyboard passes before this generator was made. Keep them in the library
// even when a shallow checkout has no Git history from which to rediscover them.
const archivedByReplacement = new Map();
for (const file of archived) {
  const rel = relative(archive, file).split("\\").join("/");
  const match = /^(.*)--v(\d+)(\.[^.]+)$/i.exec(basename(file));
  if (!match) continue;
  const replaces = web(join(base, dirname(rel), `${match[1]}${match[3]}`));
  const folder = rel.split("/")[0];
  const item = {
    src: web(file), group: "earlier", scene: /^s\d+[a-z]?$/i.test(folder) ? folder.slice(1).toUpperCase() : undefined,
    name: basename(file), bytes: statSync(file).size, replaces, version: Number(match[2]), of: 0,
  };
  if (!archivedByReplacement.has(replaces)) archivedByReplacement.set(replaces, []);
  archivedByReplacement.get(replaces).push(item);
}
for (const versions of archivedByReplacement.values()) {
  versions.sort((a, b) => a.version - b.version);
  for (const item of versions) {
    entries.push(item);
    earlierBySource.set(item.src, item);
  }
}
for (const file of current) {
  const src = web(file), rel = relative(base, file).split("\\").join("/"), folder = rel.split("/")[0];
  const group = /^s\d+[a-z]?$/i.test(folder) ? (used.has(src) ? "shots" : "alternates") : folder === "sheets" ? "sheets" : folder === "props" ? "props" : folder === "keys" ? "keys" : "other";
  entries.push({ src, group, scene: /^s\d+[a-z]?$/i.test(folder) ? folder.slice(1).toUpperCase() : undefined, name: basename(file), bytes: statSync(file).size, current: used.has(src) });
  if (group !== "shots") continue;
  // earlier versions of this exact path, newest first from git
  const log = git("log", "--format=%H%x09%cs%x09%s", "--", file).toString().trim().split("\n").filter(Boolean).map(l => { const [h, d, ...s] = l.split("\t"); return { h, d, s: s.join("\t") }; });
  if (log.length < 2) continue;
  let head;
  try { head = git("hash-object", file).toString().trim(); } catch { continue; }
  const seen = new Set([head]), versions = [];
  for (const c of log) {
    let blob;
    try { blob = git("rev-parse", `${c.h}:${relative(root, file)}`).toString().trim(); } catch { continue; } // deleted in that commit
    if (seen.has(blob)) continue;
    seen.add(blob); versions.push({ ...c, blob });
  }
  versions.reverse().forEach((v, i) => {
    const dest = join(archive, dirname(rel), `${basename(file).replace(/\.[^.]+$/, "")}--v${i + 1}${/\.[^.]+$/.exec(file)[0]}`);
    if (!existsSync(dest)) { mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, git("cat-file", "blob", v.blob)); extracted++; }
    const versionSrc = web(dest);
    const saved = earlierBySource.get(versionSrc);
    if (saved) {
      saved.date ||= v.d;
      saved.note ||= v.s.slice(0, 120);
      return;
    }
    const entry = { src: versionSrc, group: "earlier", scene: entries.at(-1)?.scene, name: basename(dest), bytes: statSync(dest).size, replaces: src, version: i + 1, of: versions.length, date: v.d, note: v.s.slice(0, 120) };
    entries.push(entry);
    earlierBySource.set(versionSrc, entry);
  });
}
const earlierByReplacement = new Map();
for (const image of entries) if (image.group === "earlier" && image.replaces) {
  if (!earlierByReplacement.has(image.replaces)) earlierByReplacement.set(image.replaces, []);
  earlierByReplacement.get(image.replaces).push(image);
}
for (const versions of earlierByReplacement.values()) for (const image of versions) image.of = versions.length;
entries.sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));
writeFileSync(join(base, "library.json"), JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), count: entries.length, images: entries }));
const by = {}; entries.forEach(e => (by[e.group] = (by[e.group] || 0) + 1));
console.log(`library.json: ${entries.length} images`, by, `| ${extracted} earlier versions newly extracted`);
