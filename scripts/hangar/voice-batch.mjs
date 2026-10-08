// Ingests the cold open's recorded takes (docs/hangar/voice/raw-meta.json describes every ElevenLabs generation; the raw files are
// public/audio/hangar/raw/H##--s1.mp3 and --s2.mp3, committed first because ElevenLabs does not keep audio): moves the picked sample of each
// line to public/audio/hangar/shot-NN/NN-<speaker>-<words>.mp3, the other to public/audio/hangar/alternates/, measures and repeat-screens it
// and writes docs/hangar/voice/manifest.json.
//
//   FFMPEG=/path/to/ffmpeg node scripts/hangar/voice-batch.mjs [--dry]
//
// Re-running changes nothing for a line already in the manifest. To use the other sample of a line, put it in PICK (voice-data.mjs),
// `git mv` the two files by hand and delete the line from the manifest.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { measure } from "../rapture/voice-batch.mjs";
import { screenTake } from "../rapture/voice-screen.mjs";
import { LINES, PICK, VOICES } from "./voice-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const MANIFEST = "docs/hangar/voice/manifest.json";
const dry = process.argv.includes("--dry");
const meta = JSON.parse(readFileSync(resolve(root, "docs/hangar/voice/raw-meta.json"), "utf8"));
const manifestPath = resolve(root, MANIFEST);
const old = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { lines: [] };
const entries = new Map(old.lines.map(l => [l.id, l]));
const slug = s => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const move = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  if (spawnSync("git", ["mv", from, to], { cwd: root }).status !== 0) renameSync(from, to);
};
let added = 0;
const shotCount = {};
for (const line of LINES) {
  const n = (shotCount[line.shot] = (shotCount[line.shot] || 0) + 1);
  if (entries.has(line.id)) continue;
  const pick = PICK[line.id] || "s1", other = pick === "s1" ? "s2" : "s1";
  const raw = resolve(root, `public/audio/hangar/raw/${line.id}--${pick}.mp3`);
  if (!existsSync(raw)) throw new Error(`${line.id}: no raw take at ${raw}`);
  const words = slug(line.text).split("-").slice(0, 5).join("-");
  const file = `/audio/hangar/shot-${String(line.shot).padStart(2, "0")}/${String(n).padStart(2, "0")}-${slug(line.speaker)}-${words}.mp3`;
  const m = measure(raw), screen = screenTake(raw, line.text);
  const g = meta[`${line.id}--${pick}`];
  const alt = resolve(root, `public/audio/hangar/raw/${line.id}--${other}.mp3`), hasAlt = existsSync(alt);
  if (!dry) {
    move(raw, resolve(root, "public" + file));
    if (existsSync(alt)) move(alt, resolve(root, `public/audio/hangar/alternates/${line.id}--${other}.mp3`));
  }
  const v = VOICES[line.speaker];
  entries.set(line.id, {
    id: line.id, shot: line.shot, n, speaker: line.speaker, voice: v.name, voiceId: v.voiceId, text: line.text, ...(line.shown ? { shown: line.shown } : {}),
    direction: line.direction, prompt: g?.prompt ?? `[${line.direction}] ${line.text}`, file, duration: m.duration, rmsdb: m.rmsdb, model: "eleven_v4", ...screen,
    ...(v.fx ? { fx: v.fx } : {}),
    ...(g ? { generation: { flow: g.flow, session: g.session, id: g.generation } } : {}),
    ...(hasAlt ? { alternate: `/audio/hangar/alternates/${line.id}--${other}.mp3` } : {}),
  });
  added++;
}
const lines = LINES.map(l => entries.get(l.id)).filter(Boolean);
const manifest = {
  project: "Untitled (working title): the cold open", model: "eleven_v4", recorded: lines.length, planned: LINES.length,
  note: "17 spoken lines, American voices: NEONOIRE's Jack, Vera and Daniel (saved voices) and four stock voices found with the character use-case filter. Nobody has listened: the picks are by measurement and the first sample of each line, directions are unheard. Radio and TV lines carry an fx name (the take on disk is clean; the animatic and the scarlett-witness reel apply it).",
  voices: VOICES, lines,
};
if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
const flagged = lines.filter(l => l.phrases > l.expected).map(l => l.id);
console.log(`${added} lines added, ${lines.length} of ${LINES.length} in the manifest${flagged.length ? `; screen flags: ${flagged.join(" ")}` : ""}${dry ? " (dry run)" : ""}`);
