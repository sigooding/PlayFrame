// Install a retake generation over an existing cold-open board, under the never-overwrite rule:
//   1. the raw generation is trimmed of any black bar the model added, centred to exact 16:9 and
//      resized to the folder's 1376×768;
//   2. the board already on disk is copied to public/images/hangar/archive/<scene>/<name>--v<N>.jpg
//      at the next free N — commit that before the new bytes land (CLAUDE.md);
//   3. the new board is written to the shot's own stable path.
//
//   node scripts/hangar/retake-install.mjs <raw.png> <public/images/hangar/sN/name.jpg> [...pairs]
//   node scripts/hangar/retake-install.mjs --check <dest.jpg> ...   report sizes and bars only
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const W = 1376, H = 768, QUALITY = "85";
const args = process.argv.slice(2);
const check = args[0] === "--check";
const pairs = check ? null : args;
if (!check && (pairs.length < 2 || pairs.length % 2)) {
  console.error("usage: retake-install.mjs <raw.png> <public/images/hangar/sN/name.jpg> [...pairs]");
  process.exit(1);
}

const identify = (file, format) => execFileSync("identify", ["-format", format, file]).toString().trim();

/** A run of near-black rows at an edge is the model's own letterbox, not picture. */
function bars(file, height) {
  const rowMean = y => Number(execFileSync("convert", [file, "-crop", `1x1+0+${y}`, "+repage", "-format", "%[fx:int(mean*255)]", "info:"]).toString());
  const width = Number(identify(file, "%w"));
  const mean = y => Number(execFileSync("convert", [file, "-crop", `${width}x1+0+${y}`, "+repage", "-format", "%[fx:int(mean*255)]", "info:"]).toString());
  void rowMean;
  let top = 0, bottom = 0;
  while (top < height / 4 && mean(top) <= 2) top++;
  while (bottom < height / 4 && mean(height - 1 - bottom) <= 2) bottom++;
  return { top, bottom };
}

if (check) {
  for (const file of args.slice(1)) {
    if (!existsSync(join(root, file))) { console.log(`${file}: MISSING`); continue; }
    const path = join(root, file);
    const [w, h] = identify(path, "%w %h").split(" ").map(Number);
    const { top, bottom } = bars(path, h);
    console.log(`${file}: ${w}x${h} bars top=${top} bottom=${bottom}`);
  }
  process.exit(0);
}

for (let i = 0; i < pairs.length; i += 2) {
  const raw = pairs[i], dest = pairs[i + 1];
  if (!existsSync(join(root, raw))) throw new Error(`missing raw generation: ${raw}`);
  const destPath = join(root, dest);
  const folder = dirname(dest);
  const stem = basename(dest, extname(dest));

  // 1. trim the model's bars, centre-crop to 16:9, resize to the folder's size.
  const [w, h] = identify(join(root, raw), "%w %h").split(" ").map(Number);
  const { top, bottom } = bars(join(root, raw), h);
  const trimmedH = h - top - bottom;
  const cropW = Math.min(w, Math.round((trimmedH * 16) / 9));
  const x = Math.round((w - cropW) / 2);
  const temp = join(root, "artifacts/hangar/retakes", `${stem}-final.png`);
  execFileSync("convert", [join(root, raw), "-crop", `${cropW}x${trimmedH}+${x}+${top}`, "+repage", "-resize", `${W}x${H}!`, temp]);

  // 2. archive the board being replaced, at the next free version number.
  let archived = null;
  if (existsSync(destPath)) {
    const archiveDir = join(root, "public/images/hangar/archive", basename(folder));
    mkdirSync(archiveDir, { recursive: true });
    const taken = readdirSync(archiveDir)
      .map(name => new RegExp(`^${stem}--v(\\d+)\\.jpg$`).exec(name))
      .filter(Boolean)
      .map(match => Number(match[1]));
    const next = (taken.length ? Math.max(...taken) : 0) + 1;
    archived = `public/images/hangar/archive/${basename(folder)}/${stem}--v${next}.jpg`;
    copyFileSync(destPath, join(root, archived));
    console.log(`archived ${dest} -> ${archived} (${statSync(destPath).size} bytes kept)`);
  }

  // 3. write the retake to the shot's own path.
  execFileSync("convert", [temp, "-quality", QUALITY, "-strip", destPath]);
  console.log(`installed ${dest} <- ${raw} (${w}x${h} trim ${top}/${bottom} -> ${cropW}x${trimmedH} -> ${W}x${H})`);
}
