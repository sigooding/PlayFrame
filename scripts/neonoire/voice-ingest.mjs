// Adds one recorded line to the project: copies (or downloads) the take into public/audio/neonoire/<scene>/,
// measures it, and records it in docs/neonoire/voice/manifest.json. Then run `npm run build:neonoire`.
//
//   node scripts/neonoire/voice-ingest.mjs --frame neonoire-shot-156 --character JACK \
//     --text "[quietly] She said to tell you she was sorry." --file /path/take.mp3 --offset 0.4 \
//     --voice MZhx7pKflsc0sAwciDEy --model eleven_v4
//
// --replace       re-record an existing --id: the old take is archived (docs/neonoire/voice/archive/), never deleted,
//                  and the line keeps its id and file path so nothing that points at it breaks.
// --fx phone|tv|tape   a filter the animatic applies to the clean take (a phone line, a television, an old cassette).
// --gen flow/session/generation   the ElevenLabs ids of the take, kept for provenance.
// --file may also be an https URL: download it at once, generation links expire after two hours.
// Needs ffmpeg for the duration (FFMPEG=/path/to/ffmpeg, or `pip install imageio-ffmpeg`).
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const manifest0 = readManifest(root);
const existing = args.replace !== undefined ? manifest0.lines.find(l => l.id === args.id) : undefined;
if (args.replace !== undefined && !existing) { console.error(`--replace needs an existing --id; ${args.id} is not in the manifest`); process.exit(1); }
// A re-recorded or edited take may be a different format (an Adobe export as .wav, say): the line keeps its
// id and its path, apart from the extension, and the previous file is archived below before it goes.
const finalRel = existing ? existing.file.replace(/\.[^.]+$/, `.${ext}`) : rel;
const dest = resolve(root, "public" + finalRel);
mkdirSync(dirname(dest), { recursive: true });
if (existing) {
  // Keep the take being replaced: archive it before the new file overwrites it.
  const n = (existing.history?.length || 0) + 1;
  const archiveRel = `docs/neonoire/voice/archive/${basename(existing.file).replace(/\.[^.]+$/, "")}-v${n}.${existing.file.split(".").pop()}`;
  mkdirSync(dirname(resolve(root, archiveRel)), { recursive: true });
  copyFileSync(resolve(root, "public" + existing.file), resolve(root, archiveRel));
  existing.history = [...(existing.history || []), { file: archiveRel, ...(existing.prompt ? { prompt: existing.prompt } : { prompt: existing.text }), model: existing.model, ...(existing.generation ? { generation: existing.generation } : {}), archivedAt: new Date().toISOString().slice(0, 10) }];
  writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest0, null, 2) + "\n");
  if (finalRel !== existing.file) rmSync(resolve(root, "public" + existing.file), { force: true });
}

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
const generation = args.gen ? (([flow, session, gen]) => ({ flow, session, id: gen }))(args.gen.split("/")) : undefined;
const entry = {
  id, frameId: args.frame, character: args.character.toUpperCase(), text: plain, ...(plain !== args.text ? { prompt: args.text } : {}), file: finalRel,
  offset: Number(args.offset ?? existing?.offset ?? 0.4), ...(duration ? { duration } : {}),
  voice: args.voice || voices.characters[args.character.toUpperCase()]?.voiceId || undefined,
  model: args.model || voices.speechModel, ...(args.fx ? { fx: args.fx } : existing?.fx ? { fx: existing.fx } : {}), ...(generation ? { generation } : {}), status: args.status || "take",
};
if (existing) {
  // Same id, same file path: the new take replaces the old one in place; the old take stays in `history`.
  const at = manifest.lines.findIndex(l => l.id === id);
  manifest.lines[at] = { ...entry, history: manifest.lines[at].history };
} else {
  if (manifest.lines.some(l => l.id === id)) { console.error(`Line id ${id} already exists; pass --id, or --replace to re-record it`); process.exit(1); }
  manifest.lines.push(entry);
}
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
console.log(`${existing ? "Replaced" : "Recorded"} ${id}: public${finalRel}${duration ? ` (${duration}s)` : ""} on ${args.frame} at ${entry.offset}s. Now run: npm run build:neonoire`);
