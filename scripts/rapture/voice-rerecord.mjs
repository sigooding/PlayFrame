// Replaces recorded takes that came back wrong with clean re-recordings, and keeps what it replaces.
//
//   FFMPEG=... node scripts/rapture/voice-rerecord.mjs --dir <staging> --archive    1. copies each take about to go to the archive (commit this first)
//   FFMPEG=... node scripts/rapture/voice-rerecord.mjs --dir <staging> --install    2. puts the new takes in their place, updates the manifest
//
// <staging> holds the new takes as R119.mp3 ... and the other clean takes of the same lines as alt/R119-alt1.mp3 ...; the record,
// docs/rapture/voice/rerecords-2026-10-08.json (override with --record), says which line each is, what was wrong with the old take
// (and what a speech-to-text pass heard), the prompt and the ElevenLabs generation of every take.
//
// The replaced take keeps its name in the archive: public/audio/rapture/archive/ep1/<page>/<name>--v<N>.mp3 (next free N), never overwritten.
// The new take goes over the old take's own path, so the page and the frames still point at the right file. The other clean takes
// are kept as alternates (public/audio/rapture/alternates/<date>/ with an index.json) in case one reads better. The manifest entry
// takes the new prompt, tag, level and generation and a `rerecorded` object with the old take's; every page is laid out again.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { root } from "./voice-script.mjs";
import { layout, measure, MANIFEST } from "./voice-batch.mjs";
import { screenTake } from "./voice-screen.mjs";

const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1] ?? true; };
const dir = arg("--dir");
const archive = process.argv.includes("--archive"), install = process.argv.includes("--install");
if (!dir || archive === install) { console.error("Usage: FFMPEG=... node scripts/rapture/voice-rerecord.mjs --dir <staging> (--archive | --install) [--record file.json]"); process.exit(1); }
const same = (a, b) => existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b));
const pub = file => resolve(root, "public" + file);

const record = JSON.parse(readFileSync(resolve(root, arg("--record") || "docs/rapture/voice/rerecords-2026-10-08.json"), "utf8"));
const manifestPath = resolve(root, MANIFEST);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const entries = new Map(manifest.lines.map(l => [l.id, l]));

/** The archive copy of a take: the highest --vN byte-identical to it, else null; and the name the next one would get. */
function archivedCopy(file) {
  const base = file.replace(/^\/audio\/rapture\/ep1\//, "/audio/rapture/archive/ep1/").replace(/\.mp3$/, "");
  let found = null, next = 1;
  while (existsSync(pub(`${base}--v${next}.mp3`))) { if (same(pub(file), pub(`${base}--v${next}.mp3`))) found = `${base}--v${next}.mp3`; next++; }
  return { found, next: `${base}--v${next}.mp3` };
}

let done = 0;
for (const rec of record.lines) {
  const entry = entries.get(rec.id);
  if (!entry) throw new Error(`${rec.id} is not in the manifest`);
  if (entry.rerecorded?.date === record.date) { console.log(`  ${rec.key} already re-recorded on ${record.date}, left alone`); continue; }
  const { found, next } = archivedCopy(entry.file);
  if (archive) {
    if (found) { console.log(`  ${rec.key} already archived as ${found}`); continue; }
    mkdirSync(dirname(pub(next)), { recursive: true });
    copyFileSync(pub(entry.file), pub(next));
    console.log(`  ${rec.key} ${entry.file} -> ${next}`);
    done++;
    continue;
  }
  if (!found) throw new Error(`${rec.key}: ${entry.file} is not in the archive yet (run --archive first and commit it)`);
  const take = resolve(dir, `${rec.key}.mp3`);
  if (!existsSync(take)) throw new Error(`no staged take ${take}`);
  const m = measure(take), screen = screenTake(take, entry.text);
  if (screen.phrases > screen.expected) throw new Error(`${rec.key}: the new take has ${screen.phrases} phrases for a line of ${screen.expected}`);
  copyFileSync(take, pub(entry.file));
  const { heard: oldHeard, ...oldTake } = rec.old;
  const next_ = { ...entry, tag: rec.new.tag, prompt: rec.new.prompt, duration: m.duration, rmsdb: m.rmsdb, ...screen, generation: rec.new.generation };
  delete next_.heard;
  next_.rerecorded = { date: record.date, defect: rec.defect, archived: found, tag: oldTake.tag, prompt: oldTake.prompt, duration: oldTake.duration, rmsdb: oldTake.rmsdb, generation: oldTake.generation, ...(oldHeard ? { heard: oldHeard } : {}) };
  entries.set(rec.id, next_);
  done++;
  console.log(`  ${rec.key} ${basename(entry.file)}: ${entry.duration}s -> ${m.duration}s, ${entry.rmsdb} -> ${m.rmsdb} dB (${rec.defect})`);
}

if (install) {
  const plan = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/elevenlabs-plan-ep1.json"), "utf8"));
  manifest.lines = layout(plan.lines, entries);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
  const altDir = `/audio/rapture/alternates/${record.date}`;
  mkdirSync(pub(altDir), { recursive: true });
  const index = [], repeats = [];
  for (const rec of record.lines) {
    for (const alt of rec.alternates) {
      const from = resolve(dir, "alt", alt.take);
      if (!existsSync(from)) throw new Error(`no staged alternate ${from}`);
      copyFileSync(from, pub(`${altDir}/${alt.take}`));
      index.push({ id: rec.id, key: rec.key, file: `${altDir}/${alt.take}`, prompt: alt.prompt, duration: alt.duration, ...screenTake(from, rec.text), generation: alt.generation });
    }
    // The re-recordings that repeated themselves again are kept too, in repeats/, so nothing generated lives only on ElevenLabs.
    for (const rep of rec.repeats || []) {
      const from = resolve(dir, "repeats", rep.take);
      if (!existsSync(from)) throw new Error(`no staged repeat ${from}`);
      mkdirSync(pub(`${altDir}/repeats`), { recursive: true });
      copyFileSync(from, pub(`${altDir}/repeats/${rep.take}`));
      repeats.push({ id: rec.id, key: rec.key, file: `${altDir}/repeats/${rep.take}`, prompt: rep.prompt, duration: rep.duration, ...screenTake(from, rec.text), generation: rep.generation });
    }
  }
  writeFileSync(pub(`${altDir}/index.json`), JSON.stringify({
    date: record.date,
    note: "Clean re-recordings of lines whose first take repeated itself that were not used (takes), and re-recordings that repeated themselves again (repeats, kept as evidence of which directions invite it). Nothing here is in the episode. To use one, name it in a record for voice-rerecord.mjs.",
    takes: index, repeats,
  }, null, 1) + "\n");
  console.log(`${index.length} alternates and ${repeats.length} repeats kept in ${altDir}`);
}
console.log(`${done} takes ${archive ? "archived" : "replaced"}`);
