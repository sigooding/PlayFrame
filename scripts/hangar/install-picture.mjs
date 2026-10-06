// Install a generation as a cold-open picture: centre-crop the raw generation to exact 16:9 and
// resize to 1920x1080 — the workspace's shape (never stretch, never letterbox, never crop a file
// that is already installed).
//
//   node scripts/hangar/install-picture.mjs <raw.jpg> <public/images/hangar/.../file.jpg> [...pairs]
//
// A pair whose destination already exists is refused: the standing rule is that a retake gets a new
// filename, or its predecessor is archived first (see scripts/hangar/frame-registry.mjs).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.error("usage: install-picture.mjs <raw.jpg> <dest.jpg> [...pairs]");
  process.exit(1);
}
for (let i = 0; i < args.length; i += 2) {
  const [raw, dest] = [args[i], args[i + 1]];
  if (!existsSync(join(root, raw))) throw new Error(`missing raw: ${raw}`);
  if (existsSync(join(root, dest))) throw new Error(`refusing to overwrite an installed picture: ${dest} (retakes get a new filename, or archive the old file first)`);
  const [w, h] = execFileSync("identify", ["-format", "%w %h", join(root, raw)]).toString().split(" ").map(Number);
  const cropW = Math.min(w, Math.round((h * 16) / 9));
  const cropH = Math.min(h, Math.round((w * 9) / 16));
  const x = Math.round((w - cropW) / 2);
  const y = Math.round((h - cropH) / 2);
  mkdirSync(dirname(join(root, dest)), { recursive: true });
  execFileSync("convert", [join(root, raw), "-crop", `${cropW}x${cropH}+${x}+${y}`, "+repage", "-resize", "1920x1080!", "-quality", "92", join(root, dest)]);
  console.log(`installed ${dest} from ${raw} (${w}x${h} -> crop ${cropW}x${cropH} -> 1920x1080)`);
}
