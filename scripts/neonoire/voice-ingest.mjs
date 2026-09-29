// Adds one recorded line to the project: copies (or downloads) the take into public/audio/neonoire/<scene>/,
// measures it, and records it in docs/neonoire/voice/manifest.json. Then run `npm run build:neonoire`.
//
//   node scripts/neonoire/voice-ingest.mjs --frame neonoire-shot-156 --character JACK \
//     --text "[quietly] She said to tell you she was sorry." --file /path/take.mp3 --offset 0.4 \
//     --voice MZhx7pKflsc0sAwciDEy --model eleven_v4
//
// --file may also be an https URL: download it at once, generation links expire after two hours.
// Needs ffmpeg for the duration (FFMPEG=/path/to/ffmpeg, or `pip install imageio-ffmpeg`).
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFEST, readManifest, readVoices } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1]]] : out), []));
for (const need of ["frame", "character", "text", "file"]) if (!args[need]) { console.error(`Missing --${need}`); process.exit(1); }

const bundle = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const frame = bundle.frames.find(f => f.id === args.frame);
if (!frame) { console.error(`No frame ${args.frame} in the bundle`); process.exit(1); }
const number = args.frame.replace(/^neonoire-shot-/, "");
const sceneKey = frame.sceneId.replace(/^neonoire-/, "");
const slug = String(args.slug || args.text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 6).join("-");
const ext = (String(args.file).match(/\.(mp3|wav|m4a|ogg)(?:\?|$)/i)?.[1] || "mp3").toLowerCase();
const rel = `/audio/neonoire/${sceneKey}/${number}-${args.character.toLowerCase().replace(/[^a-z]+/g, "")}-${slug}.${ext}`;
const dest = resolve(root, "public" + rel);
mkdirSync(dirname(dest), { recursive: true });

if (/^https?:\/\//.test(args.file)) {
  // curl, not fetch: it honors the proxy settings of a sandboxed or corporate environment.
  execFileSync("curl", ["-fsSL", "--max-time", "60", "-o", dest, args.file], { stdio: "inherit" });
}
else copyFileSync(resolve(args.file), dest);

let duration;
try {
  const ff = process.env.FFMPEG || "ffmpeg";
  const out = (() => { try { return execFileSync(ff, ["-i", dest], { stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return e.stderr; } })().toString();
  const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(out);
  if (m) duration = Math.round((Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) * 100) / 100;
} catch { /* duration stays unknown; the builder then cannot stretch the frame */ }

// `text` is the script line as spoken; `prompt` keeps the tagged text that was sent to ElevenLabs.
const plain = args.text.replace(/\[[^\]]*\]\s*/g, "").trim();
const manifest = readManifest(root);
const voices = readVoices(root);
const id = args.id || `${sceneKey}-${args.character.toLowerCase().replace(/[^a-z]+/g, "")}-${slug}`;
if (manifest.lines.some(l => l.id === id)) { console.error(`Line id ${id} already exists; pass --id`); process.exit(1); }
manifest.lines.push({
  id, frameId: args.frame, character: args.character.toUpperCase(), text: plain, ...(plain !== args.text ? { prompt: args.text } : {}), file: rel,
  offset: Number(args.offset ?? 0.4), ...(duration ? { duration } : {}),
  voice: args.voice || voices.characters[args.character.toUpperCase()]?.voiceId || undefined,
  model: args.model || voices.speechModel, status: args.status || "take",
});
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Recorded ${id}: public${rel}${duration ? ` (${duration}s)` : ""} on ${args.frame} at ${args.offset ?? 0.4}s. Now run: npm run build:neonoire`);
