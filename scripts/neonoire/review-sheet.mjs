// Build a pass review sheet: node scripts/neonoire/review-sheet.mjs <out.jpg> <scene-key> [<scene-key>...]
// Example: node scripts/neonoire/review-sheet.mjs public/images/neonoire/reviews/scenes-24-28.jpg s24 s25 s26 s27 s28
// Uses ImageMagick's montage; tiles run three across at 640x360 on near-black, in scene then shot order.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const [out, ...keys] = process.argv.slice(2);
if (!out || !keys.length) {
  console.error("usage: review-sheet.mjs <out.jpg> <scene-key> [...]");
  process.exit(1);
}
const files = keys.flatMap(key => {
  const dir = join(root, "public", "images", "neonoire", key);
  return readdirSync(dir).filter(f => f.endsWith(".jpg")).sort((a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0])).map(f => join(dir, f));
});
const cols = files.length > 9 ? 4 : 3;
const rows = Math.ceil(files.length / cols);
execFileSync("montage", [...files, "-tile", `${cols}x${rows}`, "-geometry", "640x360+3+3", "-background", "#111", join(root, out)], { stdio: "inherit" });
console.log(`review sheet: ${out} (${files.length} frames)`);
