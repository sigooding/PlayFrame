// Install a generation as a cold-open picture: centre-crop the raw generation to exact 16:9 and
// resize to 1920x1080 — the workspace's shape (never stretch, never letterbox, never crop a file
// that is already installed).
//
//   node scripts/hangar/install-picture.mjs <raw.jpg> <public/images/hangar/.../file.jpg> [...pairs]
//   node scripts/hangar/install-picture.mjs --replace <raw.jpg> <same-file-again> [...pairs]
//
// A pair whose destination already exists is refused unless --replace is given, and --replace only
// works when the destination's predecessor is already archived at
// public/images/hangar/archive/<scene>/<name>--v<N>.jpg. That is the standing rule in CLAUDE.md
// made mechanical: archive and commit the old file BEFORE the new one goes over it. Retakes that
// get a new filename need neither.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const argv = process.argv.slice(2);
const replace = argv.includes("--replace");
const args = argv.filter(a => a !== "--replace");
if (args.length < 2 || args.length % 2) {
  console.error("usage: install-picture.mjs [--replace] <raw.jpg> <dest.jpg> [...pairs]");
  process.exit(1);
}

/** The archived predecessors of an installed picture, if any: archive/<scene>/<name>--v<N>.jpg. */
const archivedVersions = dest => {
  const dir = join(root, "public/images/hangar/archive", basename(dirname(dest)));
  if (!existsSync(dir)) return [];
  const stem = basename(dest, extname(dest));
  return readdirSync(dir).filter(f => new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}--v\\d+\\.\\w+$`).test(f));
};

for (let i = 0; i < args.length; i += 2) {
  const [raw, dest] = [args[i], args[i + 1]];
  if (!existsSync(join(root, raw))) throw new Error(`missing raw: ${raw}`);
  if (existsSync(join(root, dest))) {
    if (!replace) throw new Error(`refusing to overwrite an installed picture: ${dest} (retakes get a new filename, or pass --replace with the old file archived first)`);
    const versions = archivedVersions(dest);
    if (!versions.length) throw new Error(`refusing to replace ${dest}: no archived predecessor at public/images/hangar/archive/${basename(dirname(dest))}/<name>--v<N>.jpg — archive and commit the old file first`);
    console.log(`replacing ${dest} with ${versions.join(", ")} archived`);
  }
  const [w, h] = execFileSync("identify", ["-format", "%w %h", join(root, raw)]).toString().split(" ").map(Number);
  const cropW = Math.min(w, Math.round((h * 16) / 9));
  const cropH = Math.min(h, Math.round((w * 9) / 16));
  const x = Math.round((w - cropW) / 2);
  const y = Math.round((h - cropH) / 2);
  mkdirSync(dirname(join(root, dest)), { recursive: true });
  execFileSync("convert", [join(root, raw), "-crop", `${cropW}x${cropH}+${x}+${y}`, "+repage", "-resize", "1920x1080!", "-quality", "92", join(root, dest)]);
  console.log(`installed ${dest} from ${raw} (${w}x${h} -> crop ${cropW}x${cropH} -> 1920x1080)`);
}
