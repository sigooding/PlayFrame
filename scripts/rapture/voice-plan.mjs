// Episode one's recording plan: every spoken line of docs/rapture/ep1-screenplay.md with the direction it is recorded with.
//
//   node scripts/rapture/voice-plan.mjs            writes docs/rapture/voice/elevenlabs-plan-ep1.json and elevenlabs-script-ep1.md
//   node scripts/rapture/voice-plan.mjs --check    fails if either file is out of date with the screenplay or this table
//
// Directions are written the way ElevenLabs' v4 best practices describe them: short natural-language directions in square
// brackets in front of the line, the voice and the emotion together ("[Dry, after a long pause]"), no whispering (the NEONOIRE
// finding: `quietly`, `softly` and `weakly` read about 10 dB under speaking level). The writer's own parentheticals in the
// screenplay are honoured: (not stopping), (flat), (hissing)... The screenplay is the authority for the words and the pauses;
// this table only adds how each line is said. The register of the series is one dry comedy throughout ("no pathos beats"), so
// most lines are plain.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readEpisode, root } from "./voice-script.mjs";

/** The direction for every spoken line, page by page, in the order the lines are said (voice-script.mjs --list shows them). */
export const DIRECTIONS = {
  "ep1-01": [
    "Tight, frightened, trying to sound hard",
    "Rushed, wired, voice cracking",
    "Desperate, breathless, cut off",
  ],
  "ep1-02": [
    "Aggrieved, plaintive",
    "Scornful, matter-of-fact",
    "Aggrieved, insistent",
    "Dismissive",
    "Baffled, accusing",
    "Brisk, not stopping, flat",
    "Petulant",
    "Flat, final",
    "Pleased with himself, a little proud",
    "Flat, unimpressed",
    "Hopeful, smooth, working up to it",
    "Flat, immediate",
    "Wounded, protesting",
    "Flat, knowing, final",
    "Pleasant, fluent, on the phone, lying without effort",
    "Keen, helpful",
    "Flat",
    "Keen, trying again",
    "Flat",
    "Calling after her, eager",
    "Flat, not turning",
    "Flat, aggrieved",
    "Flat, patient",
    "Aggrieved certainty",
    "Flat",
    "Aggrieved, precise",
    "Flat, deadpan",
    "Innocent, polite, hopeful",
    "Dry, wary",
    "Innocent, reasonable, putting a hypothetical",
    "Flat",
    "Hurt, surprised",
    "Dry, firm",
    "Considering it, slowly, as if it were a new idea",
    "Flat, firm",
    "Innocent, defensive",
    "Flat, final",
    "Mid-anecdote, pleased with himself, cut off",
    "Genuinely aggrieved, plain, cut off",
  ],
  "ep1-03": [
    "Flat, sincere", "Dry, patient", "Earnest", "Dry, mild grievance", "Earnest, a little defensive", "Dry, flat", "Earnest, patient",
    "Dry, flat, after a long pause", "Earnest, genuinely asking", "Dry, flat, final", "Earnest, reasoning it out", "Dry, grudging",
    "Earnest, logical", "Dry, patient", "Earnest, deadpan, perfectly serious", "Dry, flat, after a long pause", "Earnest, with conviction",
    "Dry, noncommittal", "Earnest, sincere", "Dry, curious", "Flat, matter-of-fact", "Dry, after a pause", "Earnest, hopeful",
    "Dry, noncommittal", "Earnest, satisfied", "Dry, not unkindly", "Earnest, noticing", "Dry, flat", "Earnest, puzzled",
    "Dry, mild grievance", "Earnest, genuinely asking", "Dry, flat", "Earnest, after a pause", "Dry, flat", "Earnest, deadpan, triumphant",
    "Dictating aloud, meticulous, official", "Dry, correcting", "Dictating, stubborn", "Dry, insisting", "Dictating, meticulous",
    "Dry, correcting", "Earnest, patient, explaining", "Dry, after a pause, firm", "Earnest, noticing", "Dry, flat", "Earnest, certain",
    "Dry, genuinely curious", "Earnest, asking", "Dry, flat, procedural", "Earnest, accepting", "Dry, matter-of-fact",
    "Entirely official, loud, formal", "Dry, reproachful", "Earnest, defending herself", "Dry, flat", "Earnest, firm",
    "Dry, patient, matter-of-fact", "Earnest, after a pause, genuinely asking", "Reciting from memory, absolutely sincere, deadpan",
    "Barely audible, exhausted, flat", "Earnest, matter-of-fact", "Dry, flat, after a long silence", "Earnest, puzzled", "Dry, patient",
    "Earnest, pointing it out", "Dry, flat, after a long pause",
  ],
  "ep1-04": [
    "Flat, to the dog",
    "Almost fond, dry",
    "Flat warning, to the tap",
    "Flat, to the ceiling, composing herself",
  ],
  "ep1-06": [
    "Resigned, aggrieved, to nobody",
  ],
  "ep1-07": [
    "Matter-of-fact, bored", "Defensive", "Bored, certain", "Caught out, embarrassed, trailing off", "Dry, noncommittal",
    "Low, steady, serious", "Recited, bored, in a flat sing-song", "Expectant", "Bored, sing-song", "Matter-of-fact, noticing",
    "Dismissive", "Patient, pointing it out", "Uneasy, convincing himself", "Flat", "Insistent", "Flat", "Calling, not loud, idle",
    "Distracted, flat", "Idle curiosity", "Distracted", "Idle, working it out", "Firm, tired", "Urgent, tense", "Calm, bored",
    "Urgent, tense", "Calm, bored", "Hissing through his teeth, tense", "Flat, vindicated", "Out of breath, defensive",
    "Matter-of-fact, pleased with herself", "Blank, genuinely asking", "Genuinely pleased", "Gruff, trying to keep some dignity",
  ],
  "ep1-08": [
    "Earnest, hopeful", "Dry, flat", "Earnest", "Dry, flat", "Earnest, a little defensive", "Dry, flat",
    "Earnest, uncertain, after a long pause", "Dry, flat", "Earnest, reasoning it out", "Dry, flat", "Dry, flat, mild grievance",
    "Earnest, warning", "Dry, defensive", "Earnest, testing him", "Immediate, flat", "Earnest, settled", "Dry, after a long pause",
    "Earnest, absent", "Dry, genuinely wondering", "No hesitation whatsoever, completely sincere",
  ],
  "ep1-09": [],
};

export const MODEL = "eleven_v4";
export const PLAN = "docs/rapture/voice/elevenlabs-plan-ep1.json";
export const SCRIPT = "docs/rapture/voice/elevenlabs-script-ep1.md";

export function buildPlan(rootDir = root) {
  const pages = readEpisode(rootDir);
  const voices = JSON.parse(readFileSync(resolve(rootDir, "docs/rapture/voice/voices.json"), "utf8"));
  const lines = [];
  for (const page of pages) {
    const tags = DIRECTIONS[page.id];
    if (!tags) throw new Error(`no directions for ${page.id}`);
    if (tags.length !== page.lines.length) throw new Error(`${page.id}: ${page.lines.length} spoken lines but ${tags.length} directions`);
    page.lines.forEach((line, i) => {
      const voice = voices.speakers[line.speaker];
      if (!voice) throw new Error(`${line.speaker} has no voice in voices.json`);
      const tag = tags[i];
      if (/\b(quiet(ly)?|soft(ly)?|weak(ly)?|whisper(s|ing|ed)?|murmur(s|ing|ed)?|mumbl(e|es|ing))\b/i.test(tag)) throw new Error(`${line.id}: "${tag}" asks for a hushed reading (see the voice README: they read about 10 dB under speaking level)`);
      lines.push({
        key: `R${String(lines.length + 1).padStart(3, "0")}`, id: line.id, page: page.id, n: line.n, speaker: line.speaker, voice, voiceId: voices.voices[voice].id,
        text: line.text, ...(line.paren.length ? { screenplayDirection: line.paren.join("; ") } : {}), tag, prompt: `[${tag}] ${line.text}`,
        gap: line.gap, gapKind: line.gapKind, ...(line.gapNote ? { gapNote: line.gapNote } : {}),
      });
    });
  }
  return {
    episode: "ep1", title: "Let the Raptures Commence, episode one (draft of 21 September 2026)", model: MODEL, flow: null,
    note: "One take per line. `prompt` is what is sent to ElevenLabs; `text` is the screenplay line as spoken (the manifest keeps both). `gap` is the silence before the line, from the previous line's end: gapKind 'written' = a pause the screenplay spells out (locked), 'estimated' = a table-read estimate for the action in between.",
    lines,
  };
}

export function buildScript(plan) {
  const out = ["# Let the Raptures Commence, episode one: recording script", "",
    "Generated by `node scripts/rapture/voice-plan.mjs` from the screenplay draft (docs/rapture/ep1-screenplay.md) and the directions table in that script. Words and pauses are the screenplay's; the direction column is how each line is said.", ""];
  let page = null;
  for (const line of plan.lines) {
    if (line.page !== page) { page = line.page; out.push("", `## ${page}`, "", "| # | Speaker (voice) | Gap | Direction | Line |", "| --- | --- | --- | --- | --- |"); }
    out.push(`| ${line.key} | ${line.speaker} (${line.voice}) | ${line.gap}s ${line.gapKind === "written" ? "locked" : ""} | ${line.tag} | ${line.text.replace(/\|/g, "\\|")} |`);
  }
  return out.join("\n") + "\n";
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const plan = buildPlan();
  const keep = process.argv.includes("--check") ? JSON.parse(readFileSync(resolve(root, PLAN), "utf8")) : null;
  if (keep) {
    // The plan on disk may carry the flow and session ids recorded after the run; compare the rest.
    const fresh = JSON.stringify(plan.lines.map(l => ({ ...l })));
    const onDisk = JSON.stringify(keep.lines.map(l => { const { flow, session, generation, ...rest } = l; return rest; }));
    if (fresh !== onDisk) { console.error("docs/rapture/voice/elevenlabs-plan-ep1.json is out of date: run node scripts/rapture/voice-plan.mjs"); process.exit(1); }
    console.log(`plan is current: ${plan.lines.length} lines`);
  } else {
    writeFileSync(resolve(root, PLAN), JSON.stringify(plan, null, 1) + "\n");
    writeFileSync(resolve(root, SCRIPT), buildScript(plan));
    const credits = plan.lines.reduce((n, l) => n + l.prompt.length, 0);
    console.log(`${plan.lines.length} lines, ${credits} characters (about ${credits} credits at one take each) -> ${PLAN}`);
  }
}
