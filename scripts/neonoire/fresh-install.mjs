// Install a fresh-pass generation as a board frame: centre-crop the raw generation to exact 16:9
// and resize to 1920x1080 (never stretch, never crop a legacy frame). Usage:
//   node scripts/neonoire/fresh-install.mjs <raw.jpg> <public/images/neonoire/.../file.jpg> [...pairs]
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.error("usage: fresh-install.mjs <raw.jpg> <dest.jpg> [...pairs]");
  process.exit(1);
}
for (let i = 0; i < args.length; i += 2) {
  const [raw, dest] = [args[i], args[i + 1]];
  if (!existsSync(join(root, raw))) throw new Error(`missing raw: ${raw}`);
  const size = execFileSync("identify", ["-format", "%w %h", join(root, raw)]).toString().split(" ").map(Number);
  const [w, h] = size;
  const cropW = Math.min(w, Math.round((h * 16) / 9));
  const cropH = Math.min(h, Math.round((w * 9) / 16));
  const x = Math.round((w - cropW) / 2);
  const y = Math.round((h - cropH) / 2);
  execFileSync("convert", [join(root, raw), "-crop", `${cropW}x${cropH}+${x}+${y}`, "+repage", "-resize", "1920x1080!", "-quality", "92", join(root, dest)]);
  console.log(`installed ${dest} from ${raw} (${w}x${h} -> crop ${cropW}x${cropH} -> 1920x1080)`);
}
