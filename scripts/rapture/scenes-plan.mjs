// The recording plan for the spoken lines of the series' shot boards (episodes two to five): every line of docs/rapture/scenes/*.md that
// scripts/rapture/board-script.mjs reads, with the voice it is spoken in and the direction it is recorded with.
//
//   node scripts/rapture/scenes-plan.mjs            writes docs/rapture/voice/elevenlabs-plan-scenes.json and elevenlabs-script-scenes.md
//   node scripts/rapture/scenes-plan.mjs --check    fails if either file is out of date with the boards or this table
//   node scripts/rapture/scenes-plan.mjs --risky    lists the short lines that carry a direction as long as the line
//
// Directions follow episode one's (voice-plan.mjs): short natural-language directions in square brackets in front of the line, the voice and
// the emotion together, and never a hush word (`quietly`, `softly`, `weakly`, `whisper`, `murmur`: they read about 10 dB under speaking
// level). The board's own parenthetical is honoured where it is an emotion ("(warmly)", "(defensive)"); where it is something the camera
// sees ("(writing it down)", "(o.s.)", "(points)") or a pause (the layout already holds those) the character's default direction is used.
// The finding behind the one-word rule: eleven_v4 repeats a short line when the direction is longer than the line, so a line of three
// words or fewer, or one no longer than its own direction, takes a single word (voice-screen.mjs finds the ones that repeat anyway).
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BOARDS, readBoards } from "./board-script.mjs";
import { root } from "./voice-script.mjs";

export const MODEL = "eleven_v4";
export const PLAN = "docs/rapture/voice/elevenlabs-plan-scenes.json";
export const SCRIPT = "docs/rapture/voice/elevenlabs-script-scenes.md";

/** How each character is said when the board gives no emotion: [for a line of some length, for a short line]. The series is one dry comedy. */
const DEFAULTS = {
  NINA: ["Dry, flat", "Flat"], MARTIN: ["Aggrieved, pedantic", "Aggrieved"], JODIE: ["Bored, precise", "Flat"], DANNY: ["Tired, rueful", "Tired"],
  PAT: ["Sweet, warm", "Sweet"], MALCOLM: ["Courteous, dry", "Dry"], GRAHAM: ["Mild, helpful", "Mild"], ALAN: ["Cheerful, vague", "Cheerful"],
  NEIL: ["Pleasant, steady", "Pleasant"], RAY: ["Dry, patient", "Dry"], KATH: ["Earnest, literal", "Earnest"], HARIEL: ["Smooth, unbothered", "Calm"],
  SOQED: ["Mild, unsure", "Mild"], REEK: ["Flat, weary", "Flat"], TAMSIN: ["Keen, eager", "Keen"], "THE WOMAN": ["Brisk, clipped", "Clipped"],
  WOMAN: ["Practical, kind", "Practical"], SUE: ["Indignant, clipped", "Indignant"], CARL: ["Guarded, flat", "Flat"], PAULINE: ["Earnest, reasonable", "Earnest"],
  DEREK: ["Resonant, certain", "Certain"], "HI-VIS": ["Brisk, upbeat", "Brisk"],
  // The cue MAN is three different people: the lockup's Alan, the scout hut's hi-vis man and the therapy class's sweating man.
  "ep2-lockup:MAN": ["Cheerful, vague", "Cheerful"], "ep4-scout-hut:MAN": ["Brisk, official", "Brisk"], "ep5-therapy-class:MAN": ["Nervous, rushing", "Nervous"],
};

/** What a board's parenthetical becomes: a direction, or null when it is something the picture shows or a pause (the default is used). */
const PAREN = {
  // pauses and things the camera sees
  "a beat": null, pause: null, "a longer pause": null, "a long pause": null, "long pause": null, "no pause at all": null, "no pause whatsoever": null,
  "no hesitation at all": null, "finding it as he says it": "Making it up, warming to it",  "a genuine pause, thinking hard": "Thinking hard", "a beat, same volume": null, "after a genuine pause": null, "a beat too long": null, "writing it down": null, "o.s.": null,
  "to the windscreen": null, "starting the engine": null, looking: null, "looking at him": null, points: null, "a shrug": null, "already going downstairs": null,
  "not looking at him": null, "already leaving": null, "to ray": null, "still drinking": null, "not looking up": null, "to the door": null, "taking one": null,
  "looking at the bag": null, "already opening the gate": null, "already turning it": null, "nodding slowly": null,
  // emotions
  warmly: "Warm", cheerfully: "Cheerful", carefully: "Careful", flatly: "Flat", "entirely unbothered": "Unbothered", "with total confidence": "Total confidence",
  brightening: "Brightening", "leaning in, doing something demonic and enormous with his face and voice": "Booming, demonic",
  "considering it properly, for a long time": "Considering it properly", "a long pause, then, helpfully": "Helpful", "the most animated he has been": "Animated, earnest",
  defensive: "Defensive", "genuinely thrown": "Thrown", thrown: "Thrown", "behind her, defensive already": "Defensive", "a beat, reconsidering": "Reconsidering",
  "entirely satisfied": "Satisfied", honestly: "Honest, plain", "defensive, immediately": "Defensive", "too fast": "Too fast", "too quickly": "Too fast",
  eventually: "Giving in", "getting in with it": "Stubborn", "genuinely interested for the first time": "Genuinely interested", "warm, apologetic": "Warm, apologetic",
  delighted: "Delighted", "o.s., from the front room, entirely pleasant": "Pleasant, calling", "entirely practical": "Practical, kind", "sharper than he means": "Sharp",
  "thinking about it": "Thinking it over", hissing: "Hissing, tense", helpfully: "Helpful", "helpfully; a beat, same volume": "Helpful", "lowering it, annoyed": "Annoyed",
  desperate: "Desperate", "carrying on, sincerely": "Sincere, reciting", "kindly, to a child": "Kind, patient", "o.s., warmly": "Warm, calling", "flatly, to kath": "Flat",
  "calling, pleasantly": "Pleasant, calling", "considering it": "Considering", "pleasantly, to everyone": "Pleasant, bright", instantly: "Indignant", cautiously: "Cautious",
  relieved: "Relieved", sincere: "Sincere", tightly: "Tight, brisk", evenly: "Even", "immediately, warmly": "Warm", "entirely official": "Official, loud",
  "with total authority": "Total authority", "writing, genuinely impressed": "Genuinely impressed", "upward, conversational": "Conversational", "upward, flatly": "Flat",
  "to the ceiling, sharply": "Sharp", "to jodie, over his shoulder": "Firm", "normal speaking volume, in a silent house": "Cheerful, plain",
  "under her breath": "Put-upon, dry", whispering: "Urgent, tense", "quietly furious": "Furious, controlled", "a beat, quietly furious": "Furious, controlled",
  "quietly, to himself": "Private, puzzled", "quietly, to the pendant": "Private, to herself",
};
/** "(quietly)" is four different things in four mouths (the hush word itself is never sent). */
const QUIETLY = { SOQED: "Private, puzzled", MARTIN: "Sheepish", JODIE: "Flat, matter-of-fact", SUE: "Thoughtful, dawning" };
const HUSH = /\b(quiet(ly)?|soft(ly)?|weak(ly)?|whisper(s|ing|ed)?|murmur(s|ing|ed)?|mumbl(e|es|ing))\b/i;

const wordsOf = text => text.replace(/[*—–]/g, " ").split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w));
const oneWord = tag => tag.split(/[\s,]+/)[0];

/** The direction for a line: [tag, where it came from]. */
export function directionFor(line) {
  const key = line.paren.map(p => p.toLowerCase()).join("; ");
  const lead = line.paren[0]?.toLowerCase();
  let tag = null;
  if (line.paren.length) {
    if (lead === "quietly") tag = QUIETLY[line.speaker] ?? (() => { throw new Error(`${line.id}: "(quietly)" has no reading for ${line.speaker}`); })();
    else if (key in PAREN) tag = PAREN[key];
    else if (lead in PAREN && line.paren.length === 1) tag = PAREN[lead];
    else {
      const each = line.paren.map(p => PAREN[p.toLowerCase()]);
      if (each.some(t => t === undefined)) throw new Error(`${line.id}: no reading for the parenthetical (${line.paren.join("; ")})`);
      tag = each.find(Boolean) ?? null;
    }
  }
  const base = DEFAULTS[`${line.page}:${line.speaker}`] ?? DEFAULTS[line.speaker];
  if (!base) throw new Error(`${line.id}: no default direction for ${line.speaker}`);
  const n = wordsOf(line.text).length;
  const short = n <= 3;
  let out = tag ?? (short ? base[1] : base[0]);
  const source = tag ? "board" : "default";
  if (short || wordsOf(out).length >= n) out = oneWord(out);
  if (HUSH.test(out)) throw new Error(`${line.id}: "${out}" asks for a hushed reading`);
  return [out, source];
}

/** What is sent: the direction, then the line with the board's emphasis marks and a leading dash (a cut-off line resumed) taken off. */
const promptFor = (tag, text) => `[${tag}] ${text.replace(/\*/g, "").replace(/^[—–-]\s*/, "")}`;

export function buildPlan(rootDir = root) {
  const voices = JSON.parse(readFileSync(resolve(rootDir, "docs/rapture/voice/voices.json"), "utf8"));
  const lines = [];
  for (const board of readBoards(rootDir)) {
    const map = voices.boardSpeakers?.[board.id];
    if (!map) throw new Error(`voices.json has no boardSpeakers for ${board.id}`);
    for (const line of board.lines) {
      const voice = map[line.speaker];
      if (!voice || !voices.voices[voice]) throw new Error(`${board.id}: ${line.speaker} has no voice (boardSpeakers)`);
      const [tag, tagFrom] = directionFor(line);
      lines.push({
        key: `S${String(lines.length + 1).padStart(3, "0")}`, id: line.id, page: board.id, n: line.n, shot: line.shot, speaker: line.speaker, voice, voiceId: voices.voices[voice].id,
        text: line.text, ...(line.paren.length ? { screenplayDirection: line.paren.join("; ") } : {}), tag, tagFrom, prompt: promptFor(tag, line.text),
        gap: line.gap, gapKind: line.gapKind, ...(line.gapNote ? { gapNote: line.gapNote } : {}),
      });
    }
  }
  return {
    episode: "eps2-5", title: "Let the Raptures Commence, episodes two to five (the shot boards in docs/rapture/scenes)", model: MODEL, flow: null,
    note: "One take per line. `prompt` is what is sent to ElevenLabs; `text` is the board's line. `shot` is the board shot the line is written in (the frame for that shot carries it). `gap` is the silence before the line, from the previous line's end on its board: gapKind 'written' = a pause the board spells out (locked), 'estimated' = a table-read estimate for the action in between.",
    boards: BOARDS.map(b => ({ id: b.id, title: b.title, sceneId: b.sceneId, file: b.file })),
    lines,
  };
}

export function buildScript(plan) {
  const out = ["# Let the Raptures Commence, episodes two to five: recording script", "",
    "Generated by `node scripts/rapture/scenes-plan.mjs` from the shot boards (docs/rapture/scenes/*.md) and the directions table in that script. Words and pauses are the boards'; the direction column is how each line is said (`board` = the board's own parenthetical, `default` = the character's usual reading).", ""];
  let page = null;
  for (const line of plan.lines) {
    if (line.page !== page) {
      page = line.page;
      const board = plan.boards.find(b => b.id === page);
      out.push("", `## ${board.title}`, "", "| key | shot | speaker | voice | direction | line | wait |", "|---|---|---|---|---|---|---|");
    }
    out.push(`| ${line.key} | ${line.shot} | ${line.speaker} | ${line.voice} | ${line.tag}${line.tagFrom === "board" ? " *(board)*" : ""} | ${line.text.replace(/\|/g, "\\|")} | ${line.gap}s ${line.gapKind} |`);
  }
  return out.join("\n") + "\n";
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const plan = buildPlan();
  const script = buildScript(plan);
  if (process.argv.includes("--risky")) {
    for (const l of plan.lines) {
      const n = wordsOf(l.text).length, t = wordsOf(l.tag).length;
      if (n <= 3 && t > 1 || t >= n) console.log(`${l.key} ${l.page} [${l.tag}] ${l.text}`);
    }
  } else if (process.argv.includes("--check")) {
    const fresh = JSON.stringify(plan, null, 1) + "\n";
    const stale = [];
    if (readFileSync(resolve(root, PLAN), "utf8") !== fresh) stale.push(PLAN);
    if (readFileSync(resolve(root, SCRIPT), "utf8") !== script) stale.push(SCRIPT);
    if (stale.length) { console.error(`out of date: ${stale.join(", ")} (run node scripts/rapture/scenes-plan.mjs)`); process.exit(1); }
    console.log(`plan is current: ${plan.lines.length} lines in ${plan.boards.length} boards`);
  } else {
    writeFileSync(resolve(root, PLAN), JSON.stringify(plan, null, 1) + "\n");
    writeFileSync(resolve(root, SCRIPT), script);
    const byVoice = new Map();
    for (const l of plan.lines) byVoice.set(l.voice, (byVoice.get(l.voice) || 0) + 1);
    console.log(`${plan.lines.length} lines in ${plan.boards.length} boards -> ${PLAN}, ${SCRIPT}`);
    console.log([...byVoice].sort((a, b) => b[1] - a[1]).map(([v, n]) => `${v} ${n}`).join(", "));
  }
}
