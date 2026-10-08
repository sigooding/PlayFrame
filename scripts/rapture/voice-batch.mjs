// Ingests recorded takes of a plan into the repo: copies each take to public/audio/rapture/ep1/<page>/NN-<speaker>-<words>.mp3,
// measures it, lays the page out on its own timeline (the plan's gaps) and writes docs/rapture/voice/manifest.json.
//
//   FFMPEG=/path/to/ffmpeg node scripts/rapture/voice-batch.mjs --dir <folder of R001.mp3 ...> [--generations <meta.json>] [--dry]
//
// A take is <dir>/<key>.mp3 for the plan's key (R001...). --generations is a JSON object keyed the same way with the ElevenLabs
// {flow, session, id} of each take, recorded in the manifest so any take can be traced back. Lines with no take yet are left out of the
// manifest (the plan still lists them) and the timeline of the lines after them is not shifted: a page is laid out in order, so only
// the lines after a missing one wait for it. Re-running keeps what is already in the manifest and only adds takes that are new, and lays
// every page out again (so a replaced take, see voice-rerecord.mjs, moves the lines after it). Each new take is screened for a repeated
// word (voice-screen.mjs); a flagged take needs a look before it goes on a frame.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { root } from "./voice-script.mjs";
import { screenTake } from "./voice-screen.mjs";

export const MANIFEST = "docs/rapture/voice/manifest.json";
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1] ?? true; };
const ffmpeg = process.env.FFMPEG || "ffmpeg";

/** Seconds, and the mean frame level (dBFS) over the frames within 30 dB of the peak: the recipe the NEONOIRE level checks use. */
export function measure(file) {
  const raw = spawnSync(ffmpeg, ["-v", "error", "-i", file, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"], { maxBuffer: 1 << 28 });
  if (raw.status !== 0) throw new Error(`ffmpeg could not read ${file}: ${raw.stderr}`);
  const samples = new Int16Array(raw.stdout.buffer, raw.stdout.byteOffset, Math.floor(raw.stdout.length / 2));
  const frame = 480; // 20 ms
  const db = [];
  for (let i = 0; i + frame <= samples.length; i += frame) {
    let sum = 0;
    for (let j = i; j < i + frame; j++) sum += (samples[j] / 32768) ** 2;
    db.push(sum ? 10 * Math.log10(sum / frame) : -120);
  }
  const peak = Math.max(...db);
  const active = db.filter(x => x > peak - 30 && x > -50);
  return { duration: Math.round(samples.length / 24000 * 100) / 100, rmsdb: active.length ? Math.round(active.reduce((a, b) => a + b, 0) / active.length * 10) / 10 : -99 };
}

/** Lays the plan's lines out on each page's own timeline: a line starts `gap` seconds after the previous recorded one on its page ended. */
export function layout(planLines, entries) {
  const out = [];
  const end = new Map(); // page -> end of the previous line on that page's timeline
  for (const row of planLines) {
    const entry = entries.get(row.id);
    if (!entry) continue;
    const offset = Math.round(((end.get(row.page) ?? 0) + row.gap) * 100) / 100;
    out.push({ ...entry, gap: row.gap, gapKind: row.gapKind, ...(row.gapNote ? { gapNote: row.gapNote } : {}), offset });
    end.set(row.page, offset + entry.duration);
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const dir = arg("--dir");
  if (!dir) { console.error("Usage: FFMPEG=... node scripts/rapture/voice-batch.mjs --dir <folder of R001.mp3 ...> [--generations meta.json] [--dry]"); process.exit(1); }
  const dry = process.argv.includes("--dry");
  const plan = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/elevenlabs-plan-ep1.json"), "utf8"));
  const generations = arg("--generations") ? JSON.parse(readFileSync(resolve(arg("--generations")), "utf8")) : {};
  const manifestPath = resolve(root, MANIFEST);
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { project: "Let the Raptures Commence", episode: "ep1", model: plan.model, lines: [] };
  const entries = new Map(manifest.lines.map(l => [l.id, l]));
  let added = 0, missing = 0;
  for (const row of plan.lines) {
    if (entries.has(row.id)) continue;
    const take = resolve(dir, `${row.key}.mp3`);
    if (!existsSync(take)) { missing++; continue; }
    const speaker = row.speaker.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const words = row.id.slice(`${row.page}-${speaker}-`.length);
    const file = `/audio/rapture/ep1/${row.page}/${String(row.n).padStart(2, "0")}-${speaker}-${words}.mp3`;
    const m = measure(take);
    if (!dry) { mkdirSync(dirname(resolve(root, "public" + file)), { recursive: true }); copyFileSync(take, resolve(root, "public" + file)); }
    entries.set(row.id, {
      id: row.id, key: row.key, page: row.page, n: row.n, speaker: row.speaker, voice: row.voice, voiceId: row.voiceId, text: row.text,
      prompt: row.prompt, tag: row.tag, file, duration: m.duration, rmsdb: m.rmsdb, model: plan.model,
      ...screenTake(take, row.text), // a flagged take (phrases > expected) is a suspicion: see voice-screen.mjs
      ...(generations[row.key] ? { generation: generations[row.key].generation } : {}),
    });
    added++;
  }
  const out = layout(plan.lines, entries);
  manifest.lines = out;
  manifest.recorded = out.length;
  manifest.planned = plan.lines.length;
  if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
  console.log(`${added} takes added, ${out.length} of ${plan.lines.length} lines in the manifest${missing ? `, ${missing} without a take yet` : ""}${dry ? " (dry run: nothing written)" : ""}`);
}
