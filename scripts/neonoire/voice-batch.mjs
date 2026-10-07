// Ingests a whole plan of takes at once and lays their gaps out.
//
//   node scripts/neonoire/voice-batch.mjs --plan docs/neonoire/voice/elevenlabs-plan-14A.json --dir <folder of L01.mp3 …> [--dry] [--sessions sessions.txt] [--flow <flow id>]
//
// plan.lines[]: { key, frame, who, prompt (tagged, as sent to ElevenLabs), gap, … }. The take for a line is <dir>/<key>.mp3.
//   gap     = seconds of silence after the previous line on the same frame; the first line of a frame uses it as an absolute offset.
//   scene   = the line's scene (defaults to plan.scene); the id defaults to s<scene>-<key>-<who>, or set `id`.
//   voice, fx, generation {flow, session, id}: passed on to voice-ingest as --voice, --fx and --gen.
//   replace = the id of an older take of the same moment, re-recorded in place (voice-ingest --replace): same id and file path, the old take
//             goes to docs/neonoire/voice/archive/ and into the line's `history`.
//   retire  = the id of an older take that is archived (docs/neonoire/voice/archive/<file>-cut-<date>.<ext>) and dropped from the manifest,
//             for a take that was recorded under the wrong speaker; the new line takes its offset.
// plan.frameOrder { frameId: [line ids …] }: the playing order of a frame that mixes new takes with older ones. Older takes keep their offsets
//   unless a new take would overlap or crowd them, in which case they are pushed along. Every older take on such a frame must be listed.
// --sessions: optional file of "<key> <elevenlabs session id>" lines, kept as provenance with --flow (a line's own `generation` wins).
// Needs FFMPEG for durations. After it: npm run build:neonoire && npm run verify:neonoire.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
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
const round = n => Math.round(n * 100) / 100;
const when = plan.generated || new Date().toISOString().slice(0, 10);
const sceneOf = line => String(line.scene ?? plan.scene);
const idOf = line => line.id || `s${sceneOf(line).toLowerCase()}-${line.key.toLowerCase()}-${line.who.toLowerCase().replace(/[^a-z]+/g, "")}`;
// voice-ingest names the file after the first six words of the tagged prompt; a second line with the same words on a frame must not overwrite it.
const slugOf = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 6).join("-");
const takeOf = line => resolve(dir, `${line.key}.mp3`);
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const measure = file => {
  const out = (() => { try { return execFileSync(ffmpeg, ["-i", file], { stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return e.stderr; } })().toString();
  const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(out);
  return m ? round(Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) : undefined;
};

const byId0 = new Map(manifest0.lines.map(l => [l.id, l]));
const frameIds = new Set(plan.lines.map(l => l.frame));
const problems = [];
const claimed = new Set();
const paths = new Set(manifest0.lines.map(l => l.file));
const slugs = new Map();
const goneIds = new Set(plan.lines.flatMap(l => [l.replace, l.retire]).filter(Boolean));
for (const line of plan.lines) {
  const id = idOf(line);
  if (!existsSync(takeOf(line))) problems.push(`missing take ${line.key}.mp3`);
  if (!line.voice && !voices.characters[line.who]?.voiceId) problems.push(`${line.key}: no voice for ${line.who} in voices.json`);
  if (!voices.characters[line.who]) problems.push(`${line.key}: ${line.who} has no entry in voices.json`);
  if (claimed.has(id)) problems.push(`${line.key}: id ${id} is used twice in the plan`);
  claimed.add(id);
  for (const old of [line.replace, line.retire].filter(Boolean)) if (!byId0.has(old)) problems.push(`${line.key}: ${old} is not in the manifest, so it cannot be ${line.replace ? "replaced" : "retired"}`);
  if (line.replace && line.replace !== id) problems.push(`${line.key}: a replaced line keeps its id (${line.replace}), the plan says ${id}`);
  if (!line.replace && byId0.has(id)) problems.push(`${line.key}: ${id} is already in the manifest (use "replace" to re-record it)`);
  if (!line.replace) {
    const number = line.frame.replace(/^neonoire-shot-/, "");
    const base = `/audio/neonoire/${sceneOf(line).toLowerCase()}/${number}-${line.who.toLowerCase().replace(/[^a-z]+/g, "")}-`;
    let slug = slugOf(line.prompt), n = 1;
    while (paths.has(`${base}${slug}.mp3`)) slug = `${slugOf(line.prompt)}-${++n}`;
    paths.add(`${base}${slug}.mp3`);
    slugs.set(line.key, slug);
  }
}
// Every older take on a frame that gets new ones must have a place in that frame's order.
for (const frame of frameIds) {
  const older = manifest0.lines.filter(l => l.frameId === frame && !goneIds.has(l.id));
  const order = plan.frameOrder?.[frame];
  const news = plan.lines.filter(l => l.frame === frame).map(idOf);
  if (older.length && !order) problems.push(`${frame} carries older takes (${older.map(l => l.id).join(", ")}) but the plan has no frameOrder for it`);
  if (order) {
    for (const l of older) if (!order.includes(l.id)) problems.push(`frameOrder for ${frame} leaves out ${l.id}`);
    for (const id of news) if (!order.includes(id)) problems.push(`frameOrder for ${frame} leaves out ${id}`);
    for (const id of order) if (!news.includes(id) && !byId0.has(id)) problems.push(`frameOrder for ${frame} names ${id}, which is neither in the plan nor in the manifest`);
    if (new Set(order).size !== order.length) problems.push(`frameOrder for ${frame} lists a line twice`);
  }
}
if (problems.length) { console.error(problems.map(p => `  PROBLEM  ${p}`).join("\n")); process.exit(1); }
console.log(`  OK  ${plan.lines.length} takes found, voices known, ids free (${dry ? "dry run" : "ingesting"})`);

const oldAt = new Map(plan.lines.filter(l => l.replace || l.retire).map(l => { const old = byId0.get(l.replace || l.retire); return [idOf(l), { frameId: old.frameId, offset: old.offset }]; }));

/** Offsets for every frame the plan touches: older takes stay put unless a new take pushes them; new takes follow their gap. */
function layOut(entries) {
  const moved = [];
  const newIds = new Set(plan.lines.map(idOf));
  for (const frame of frameIds) {
    const order = plan.frameOrder?.[frame] || plan.lines.filter(l => l.frame === frame).map(idOf);
    let end = null;
    for (const id of order) {
      const entry = entries.get(id);
      const line = plan.lines.find(l => idOf(l) === id);
      const before = entry.offset;
      let at;
      if (!line) {
        // An older take keeps its offset; it is pushed along if it would overlap or crowd the take before it, and re-spaced if the order moves it ahead of a take that used to precede it.
        const movedUp = order.slice(order.indexOf(id) + 1).some(later => !newIds.has(later) && entries.get(later).offset < entry.offset);
        at = end !== null && (movedUp || entry.offset < end + 0.1) ? end + 0.65 : entry.offset;
      }
      else {
        const old = oldAt.get(id);
        at = old && old.frameId === frame && (end === null || old.offset >= end + 0.1) ? old.offset : end === null ? line.gap : end + line.gap;
      }
      entry.offset = round(at);
      end = entry.offset + entry.duration;
      if (!line && entry.offset !== before) moved.push(`${id} ${before} -> ${entry.offset}`);
    }
  }
  return moved;
}

if (dry) {
  const entries = new Map();
  for (const line of plan.lines) entries.set(idOf(line), { offset: 0, duration: measure(takeOf(line)) || 0, frameId: line.frame });
  for (const l of manifest0.lines) if (!entries.has(l.id) && frameIds.has(l.frameId) && !goneIds.has(l.id)) entries.set(l.id, { offset: l.offset, duration: l.duration || 0, frameId: l.frameId });
  const moved = layOut(entries);
  for (const l of plan.lines) console.log(`  ${l.key} ${l.frame} ${l.who.padEnd(15)} at ${String(entries.get(idOf(l)).offset).padStart(6)}  ${l.replace ? "(replaces) " : l.retire ? "(retires) " : ""}${l.prompt}`);
  if (moved.length) console.log(`  ${moved.length} older take(s) pushed along:\n    ${moved.join("\n    ")}`);
  process.exit(0);
}

for (const line of plan.lines) {
  const id = idOf(line);
  const gen = line.generation ? `${line.generation.flow}/${line.generation.session}/${line.generation.id || ""}` : args.flow && sessions[line.key] ? `${args.flow}/${sessions[line.key]}/` : undefined;
  const a = ["scripts/neonoire/voice-ingest.mjs", "--frame", line.frame, "--character", line.who, "--text", line.prompt, "--file", takeOf(line),
    "--offset", "0.5", "--id", id, "--model", plan.model || "eleven_v4"];
  if (line.replace) a.push("--replace", "1");
  else a.push("--slug", `${slugs.get(line.key) ?? slugOf(line.prompt)}`);
  if (line.voice) a.push("--voice", line.voice);
  if (line.fx) a.push("--fx", line.fx);
  if (gen) a.push("--gen", gen);
  execFileSync("node", a, { cwd: root, stdio: ["ignore", "pipe", "inherit"], env: process.env });
}

const manifest = readManifest(root);
const entries = new Map(manifest.lines.map(l => [l.id, l]));
for (const line of plan.lines) {
  const entry = entries.get(idOf(line));
  if (!entry?.duration) throw new Error(`${idOf(line)} has no measured duration: is FFMPEG set?`);
}
const moved = layOut(entries);
for (const line of plan.lines) {
  if (!line.retire) continue;
  const old = entries.get(line.retire);
  const base = basename(old.file).replace(/\.[^.]+$/, "");
  const archiveRel = `docs/neonoire/voice/archive/${base}-cut-${when}.${old.file.split(".").pop()}`;
  mkdirSync(dirname(resolve(root, archiveRel)), { recursive: true });
  copyFileSync(resolve(root, "public" + old.file), resolve(root, archiveRel));
  rmSync(resolve(root, "public" + old.file), { force: true });
  manifest.lines.splice(manifest.lines.findIndex(l => l.id === line.retire), 1);
  console.log(`  retired ${line.retire} -> ${archiveRel}`);
}
writeFileSync(resolve(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
if (moved.length) console.log(`  ${moved.length} older take(s) pushed along:\n    ${moved.join("\n    ")}`);
console.log(`  DONE  ${plan.lines.length} lines ingested and laid out. Now: npm run build:neonoire && npm run verify:neonoire`);
