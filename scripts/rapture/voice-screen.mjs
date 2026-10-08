// Screens the recorded takes for the fault eleven_v4 showed on episode one: a short line said twice (or five times) instead of once.
//
//   FFMPEG=... node scripts/rapture/voice-screen.mjs            lists the takes whose speech has more phrases than the line has
//   FFMPEG=... node scripts/rapture/voice-screen.mjs --fill     also writes `phrases` and `expected` into every manifest entry
//   node scripts/rapture/voice-screen.mjs --heard <file.json>   merges {"<line id>": "what a speech-to-text pass heard"} into the manifest
//
// Why. 19 of the 166 first takes repeated themselves ("Rules. Rules", "They're gone. They're gone", "Us, us, us, us, us"; one read "Kath."
// as "Ca- calf"). A speech-to-text pass on a plain copy of each take found them; this screen finds the same takes without it. It splits
// the take at silences (a gap of 0.22 s or more, 32 dB under the take's peak) and counts the phrases against the chunks the line is
// written in (split at . ? ! , ; : and the dash). On the 53 lines transcribed it flagged all 8 faulty takes and one good one; on the other
// 113 it flagged 13, of which 11 were faulty. A flag is a suspicion: a take stays in the game only if it passes or its `heard` matches.
//
// The finding behind the re-records: a direction longer than the line invites the repeat. "[Dry, after a long pause] Kath." came back as
// "Kath. Kath"; a bare "Rules." and "[Serious] Rules." came back clean, "[Low, steady, serious, said once] Rules." did not. So a line of
// a few words takes a one-word direction (voice-plan.mjs lists the lines that still carry more).
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { root } from "./voice-script.mjs";

const MANIFEST = "docs/rapture/voice/manifest.json";
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1] ?? true; };

/** 24 kHz mono samples of a take. */
export function decode(file) {
  const raw = spawnSync(ffmpeg, ["-v", "error", "-i", file, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"], { maxBuffer: 1 << 28 });
  if (raw.status !== 0) throw new Error(`ffmpeg could not read ${file}: ${raw.stderr}`);
  return new Int16Array(raw.stdout.buffer, raw.stdout.byteOffset, Math.floor(raw.stdout.length / 2));
}

/** [start, end] seconds of each phrase: runs of frames within `below` dB of the peak, joined when closer than `gap` seconds. */
export function phrases(samples, { step = 0.02, below = 32, gap = 0.22 } = {}) {
  const n = Math.round(24000 * step);
  const db = [];
  for (let i = 0; i + n <= samples.length; i += n) {
    let sum = 0;
    for (let j = i; j < i + n; j++) sum += (samples[j] / 32768) ** 2;
    db.push(sum ? 10 * Math.log10(sum / n) : -120);
  }
  const peak = Math.max(...db);
  const on = db.map(d => d > peak - below && d > -62);
  const runs = [];
  for (let i = 0; i < on.length;) {
    if (!on[i]) { i++; continue; }
    let j = i;
    while (j < on.length && on[j]) j++;
    runs.push([i * step, j * step]);
    i = j;
  }
  const merged = [];
  for (const run of runs) {
    if (merged.length && run[0] - merged[merged.length - 1][1] < gap) merged[merged.length - 1][1] = run[1];
    else merged.push([...run]);
  }
  return merged;
}

/** The chunks a line is written in: at least one. */
export const expectedPhrases = text => Math.max(1, text.replace(/[—–]/g, ",").split(/[.?!,;:]+/).filter(chunk => /[A-Za-z]/.test(chunk)).length);

export function screenTake(file, text) {
  return { phrases: phrases(decode(file)).length, expected: expectedPhrases(text) };
}

/** Words of a line as a speech-to-text pass would write them: lower case, no punctuation, the usual contractions opened up. */
export function words(text) {
  return text.toLowerCase().replace(/[’]/g, "'").replace(/[—–-]/g, " ")
    .replace(/\bd'you\b/g, "do you").replace(/\b(\w+)'ve\b/g, "$1 have").replace(/\bbannister\b/g, "banister").replace(/\bdefence\b/g, "defense")
    .replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean).join(" ");
}
/** A transcript counts as the line when the words agree (a trailing "no" for a stammer or a repeat does not). */
export const sameWords = (text, heard) => words(text) === words(heard);

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const manifestPath = resolve(root, MANIFEST);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const heardFile = arg("--heard");
  if (heardFile) {
    const heard = JSON.parse(readFileSync(resolve(heardFile), "utf8"));
    let merged = 0, differ = 0;
    for (const line of manifest.lines) {
      if (!(line.id in heard)) continue;
      line.heard = heard[line.id];
      merged++;
      if (!sameWords(line.text, line.heard)) { differ++; console.log(`  DIFFERS  ${line.page} #${line.n} ${line.speaker}: wanted ${JSON.stringify(line.text)}, heard ${JSON.stringify(line.heard)}`); }
    }
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
    console.log(`${merged} transcripts merged, ${differ} differ from the line`);
  } else {
    const fill = process.argv.includes("--fill");
    let flagged = 0, unresolved = 0;
    for (const line of manifest.lines) {
      const screen = screenTake(resolve(root, "public" + line.file), line.text);
      if (fill) Object.assign(line, screen);
      if (screen.phrases > screen.expected) {
        flagged++;
        const cleared = line.heard && sameWords(line.text, line.heard);
        if (!cleared) unresolved++;
        console.log(`  ${cleared ? "cleared " : "SUSPECT "} ${line.page} #${String(line.n).padStart(2)} ${line.speaker.padEnd(8)} phrases ${screen.phrases} of ${screen.expected} | ${line.text.slice(0, 50)}${line.heard ? ` | heard: ${line.heard.slice(0, 40)}` : ""}`);
      }
    }
    if (fill) writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
    console.log(`${manifest.lines.length} takes screened: ${flagged} flagged, ${unresolved} not cleared by a transcript${fill ? " (phrases and expected written to the manifest)" : ""}`);
    if (unresolved && !fill) process.exitCode = 1;
  }
}
