// Ingests a whole plan of takes at once and lays their gaps out.
//
//   node scripts/neonoire/voice-batch.mjs --plan docs/neonoire/voice/elevenlabs-plan-14A.json --dir <folder of L01.mp3 …> [--dry] [--sessions sessions.txt] [--flow <flow id>]
//
// plan.lines[]: { key, frame, who, prompt (tagged, as sent to ElevenLabs), text, gap }. The take for a line is <dir>/<key>.mp3.
// gap = silence after the previous line on the same frame; the first line of a frame uses it as an absolute offset.
// --sessions: optional file of "<key> <elevenlabs session id>" lines, kept as provenance with --flow.
// Needs FFMPEG for durations. After it: npm run build:neonoire && npm run verify:neonoire.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFEST, readManifest, readVoices } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]] : out), []));
for (const need of ["plan", "dir"]) if (!args[need] || args[need] === true) { console.error(`Missing --${need}`); process.exit(1); }
const plan = JSON.parse(readFileSync(resolve(args.plan), "utf8"));
const dir = resolve(args.dir), dry = args.dry === true;
const sessions = args.sessions ? Object.fromEntries(readFileSync(resolve(args.sessions), "utf8").split("\n").filter(Boolean).map(l => l.trim().split(/\s+/))) : {};
const voices = readVoices(root);
const manifest0 = readManifest(root);
const idOf = line => `s${plan.scene.toLowerCase()}-${line.key.toLowerCase()}-${line.who.toLowerCase()}`;

const problems = [];
for (const line of plan.lines) {
  if (!existsSync(resolve(dir, `${line.key}.mp3`))) problems.push(`missing take ${line.key}.mp3`);
  if (!voices.characters[line.who]?.voiceId) problems.push(`${line.key}: no voice for ${line.who} in voices.json`);
  if (manifest0.lines.some(l => l.id === idOf(line))) problems.push(`${line.key}: ${idOf(line)} is already in the manifest (use voice-ingest --replace to re-record)`);
}
if (problems.length) { console.error(problems.map(p => `  PROBLEM  ${p}`).join("\n")); process.exit(1); }
console.log(`  OK  ${plan.lines.length} takes found, voices known, ids free (${dry ? "dry run" : "ingesting"})`);
if (dry) { for (const l of plan.lines) console.log(`  ${l.key} ${l.frame} ${l.who.padEnd(5)} gap ${l.gap}  ${l.prompt}`); process.exit(0); }

for (const line of plan.lines) {
  const a = ["scripts/neonoire/voice-ingest.mjs", "--frame", line.frame, "--character", line.who, "--text", line.prompt, "--file", resolve(dir, `${line.key}.mp3`),
    "--offset", "0.5", "--id", idOf(line), "--model", plan.model || "eleven_v4"];
  if (args.flow && sessions[line.key]) a.push("--gen", `${args.flow}/${sessions[line.key]}/`);
  execFileSync("node", a, { cwd: root, stdio: ["ignore", "pipe", "inherit"] });
}
// Lay the gaps out: first line of a frame at its gap, each next line after the previous one ends.
const manifest = readManifest(root);
let prev = null;
for (const line of plan.lines) {
  const entry = manifest.lines.find(l => l.id === idOf(line));
  if (!entry?.duration) throw new Error(`${idOf(line)} has no measured duration — is FFMPEG set?`);
  const first = !prev || prev.frameId !== entry.frameId;
  entry.offset = Math.round((first ? line.gap : prev.offset + prev.duration + line.gap) * 100) / 100;
  prev = entry;
}
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
console.log(`  DONE  ${plan.lines.length} lines ingested and laid out. Now: npm run build:neonoire && npm run verify:neonoire`);
