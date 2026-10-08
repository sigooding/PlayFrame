// Ingests the recorded takes of episodes two to five (the plan is docs/rapture/voice/elevenlabs-plan-scenes.json, from scenes-plan.mjs):
// moves each raw take public/audio/rapture/scenes/raw/S###.mp3 to its final path public/audio/rapture/scenes/<board>/NN-<speaker>-<words>.mp3,
// measures it, screens it for a repeated word (voice-screen.mjs), lays every board out on its own timeline from the plan's gaps and writes
// docs/rapture/voice/manifest-scenes.json (the same shape as manifest.json, plus `shot`: the board shot the line is written in).
//
//   FFMPEG=/path/to/ffmpeg node scripts/rapture/scenes-batch.mjs [--dry]
//
// Raw takes are committed first (the recording sessions did), then moved with `git mv` so nothing is stored twice. Re-running only adds
// takes that are new and lays the boards out again, so a replaced take (see voice-rerecord.mjs) moves the lines after it.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { root } from "./voice-script.mjs";
import { layout, measure } from "./voice-batch.mjs";
import { screenTake } from "./voice-screen.mjs";

export const MANIFEST_SCENES = "docs/rapture/voice/manifest-scenes.json";
const dry = process.argv.includes("--dry");
const plan = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/elevenlabs-plan-scenes.json"), "utf8"));
const meta = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/scenes-raw-meta.json"), "utf8"));
const manifestPath = resolve(root, MANIFEST_SCENES);
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { project: "Let the Raptures Commence", episode: plan.episode, model: plan.model, lines: [] };
const entries = new Map(manifest.lines.map(l => [l.id, l]));
let added = 0, missing = 0, flagged = [];
for (const row of plan.lines) {
  if (entries.has(row.id)) continue;
  const raw = resolve(root, `public/audio/rapture/scenes/raw/${row.key}.mp3`);
  if (!existsSync(raw)) { missing++; continue; }
  const speaker = row.speaker.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const words = row.id.slice(`${row.page}-${speaker}-`.length);
  const file = `/audio/rapture/scenes/${row.page}/${String(row.n).padStart(2, "0")}-${speaker}-${words}.mp3`;
  const m = measure(raw), screen = screenTake(raw, row.text.replace(/\*/g, ""));
  if (!dry) {
    mkdirSync(dirname(resolve(root, "public" + file)), { recursive: true });
    // git mv keeps the take's history; outside a checkout (or when untracked) a plain rename does the same job
    if (spawnSync("git", ["mv", raw, resolve(root, "public" + file)], { cwd: root }).status !== 0) renameSync(raw, resolve(root, "public" + file));
  }
  const g = meta[row.key];
  entries.set(row.id, {
    id: row.id, key: row.key, page: row.page, n: row.n, shot: row.shot, speaker: row.speaker, voice: row.voice, voiceId: row.voiceId, text: row.text,
    prompt: g?.prompt ?? row.prompt, tag: row.tag, file, duration: m.duration, rmsdb: m.rmsdb, model: plan.model, ...screen,
    ...(g ? { generation: { flow: g.flow, session: g.session, id: g.generation } } : {}),
    ...(g?.rerecorded ? { rerecorded: g.rerecorded } : {}),
  });
  if (screen.phrases > screen.expected) flagged.push(row.key);
  added++;
}
const out = layout(plan.lines, entries);
manifest.lines = out;
manifest.recorded = out.length;
manifest.planned = plan.lines.length;
manifest.boards = plan.boards.map(b => b.id);
if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
console.log(`${added} takes added, ${out.length} of ${plan.lines.length} lines in the manifest${missing ? `, ${missing} without a take yet` : ""}${flagged.length ? `; screen flags: ${flagged.join(" ")}` : ""}${dry ? " (dry run: nothing written)" : ""}`);
