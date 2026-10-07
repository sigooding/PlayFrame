// Puts one of the alternate takes into the game in place of the take that is in it.
//
//   node scripts/neonoire/voice-swap.mjs --key N071 --take takes/N071--earnestly--test.mp3 [--set 2026-10-07] [--dry]
//   node scripts/neonoire/voice-swap.mjs --list [--key N071]
//
// The alternates live in public/audio/neonoire/alternates/<set>/ (index.json lists every take with its tag, level and
// ElevenLabs ids; index.html plays them). A swap is a re-record of the same line: voice-ingest --replace keeps the line's
// id and file path, copies the take being replaced to docs/neonoire/voice/archive/ and lists it in the line's `history`,
// so nothing is lost and a swap can be undone by swapping the archived copy back in the same way.
// The new take can be longer or shorter than the old one: the frame's later lines are pushed along if they would overlap.
// Needs FFMPEG for the duration. After it: npm run build:neonoire && npm run verify:neonoire.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFEST, readManifest } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]] : out), []));
const base = resolve(root, "public/audio/neonoire/alternates");
const set = args.set && args.set !== true ? args.set : readdirSync(base).filter(n => /^\d{4}-\d{2}-\d{2}$/.test(n)).sort().pop();
const index = JSON.parse(readFileSync(join(base, set, "index.json"), "utf8"));

if (args.list) {
  for (const [key, line] of Object.entries(index.lines)) {
    if (args.key && args.key !== true && args.key !== key) continue;
    console.log(`${key} ${line.who} (scene ${line.scene}, ${line.frame}) "${line.text.slice(0, 70)}"`);
    console.log(`   in the game  ${String(line.final.rmsdb).padStart(6)} dB  ${line.final.prompt.slice(0, 60)}`);
    for (const alt of line.alternates) console.log(`   ${alt.file.padEnd(40)} ${String(alt.rmsdb).padStart(6)} dB  ${alt.round.padEnd(8)} ${alt.prompt.slice(0, 50)}`);
  }
  process.exit(0);
}
for (const need of ["key", "take"]) if (!args[need] || args[need] === true) { console.error(`Missing --${need} (or use --list)`); process.exit(1); }
const line = index.lines[args.key];
if (!line) { console.error(`No line ${args.key} in the ${set} alternates`); process.exit(1); }
const alt = line.alternates.find(a => a.file === args.take || basename(a.file) === basename(args.take));
if (!alt) { console.error(`${args.take} is not an alternate of ${args.key}. Try: node scripts/neonoire/voice-swap.mjs --list --key ${args.key}`); process.exit(1); }
const file = join(base, set, alt.file);
if (!existsSync(file)) { console.error(`Missing ${file}`); process.exit(1); }
const entry = readManifest(root).lines.find(l => l.id === line.id);
if (!entry) { console.error(`${line.id} is not in the manifest any more`); process.exit(1); }

const cmd = ["scripts/neonoire/voice-ingest.mjs", "--replace", "1", "--id", line.id, "--frame", entry.frameId, "--character", line.who, "--text", alt.prompt,
  "--file", file, "--offset", String(entry.offset), "--model", index.model || "eleven_v4", "--voice", alt.voice, "--gen", `${alt.generation.flow}/${alt.generation.session}/${alt.generation.id}`];
if (entry.fx) cmd.push("--fx", entry.fx);
console.log(`${line.id}: ${entry.prompt || entry.text}  ->  ${alt.prompt}  (${entry.duration}s at ${entry.offset}s on ${entry.frameId}; the new take is ${alt.duration}s, ${alt.rmsdb} dB)`);
if (args.dry) process.exit(0);
execFileSync("node", cmd, { cwd: root, stdio: ["ignore", "inherit", "inherit"], env: process.env });

// Later lines on the frame are pushed along if the new take runs into them.
const manifest = readManifest(root);
const lines = manifest.lines.filter(l => l.frameId === entry.frameId).sort((a, b) => a.offset - b.offset);
let end = null;
for (const l of lines) {
  if (end !== null && l.offset < end + 0.1) { console.log(`  pushed ${l.id} ${l.offset} -> ${Math.round((end + 0.65) * 100) / 100}`); l.offset = Math.round((end + 0.65) * 100) / 100; }
  end = l.offset + (l.duration || 0);
}
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
console.log("Swapped. Now run: npm run build:neonoire && npm run verify:neonoire");
