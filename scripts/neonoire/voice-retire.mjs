// Retires recorded lines whose words are no longer in the screenplay: each take is copied to
// docs/neonoire/voice/archive/<file>-cut-<date>.<ext> and the line leaves the manifest and public/audio. Nothing is deleted:
// the archived copy keeps the take, and the retired id is printed so the commit message can name it.
//
//   node scripts/neonoire/voice-retire.mjs --id s12-jack-quietly-because-they-didn-t-find [--id …] [--date 2026-10-07]
//
// After it: npm run build:neonoire && npm run verify:neonoire.
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFEST, readManifest } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const argv = process.argv.slice(2);
const ids = argv.flatMap((a, i) => (a === "--id" && argv[i + 1] ? [argv[i + 1]] : []));
const date = argv.includes("--date") ? argv[argv.indexOf("--date") + 1] : new Date().toISOString().slice(0, 10);
if (!ids.length) { console.error("Usage: node scripts/neonoire/voice-retire.mjs --id <line id> [--id …] [--date YYYY-MM-DD]"); process.exit(1); }

const manifest = readManifest(root);
for (const id of ids) {
  const at = manifest.lines.findIndex(l => l.id === id);
  if (at < 0) { console.error(`${id} is not in the manifest`); process.exit(1); }
  const line = manifest.lines[at];
  const archiveRel = `docs/neonoire/voice/archive/${basename(line.file).replace(/\.[^.]+$/, "")}-cut-${date}.${line.file.split(".").pop()}`;
  mkdirSync(dirname(resolve(root, archiveRel)), { recursive: true });
  copyFileSync(resolve(root, "public" + line.file), resolve(root, archiveRel));
  rmSync(resolve(root, "public" + line.file), { force: true });
  manifest.lines.splice(at, 1);
  console.log(`Retired ${id} ("${line.text}", ${line.frameId} at ${line.offset}s) -> ${archiveRel}`);
}
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
console.log("Now run: npm run build:neonoire && npm run verify:neonoire");
