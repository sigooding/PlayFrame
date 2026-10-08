// The spoken lines of an episode, read from its screenplay draft (docs/rapture/ep1-screenplay.md: the episode's authority) in
// the order they are said, with the direction the writer gave each one and the pauses the page asks for.
//
//   node scripts/rapture/voice-script.mjs            summary per page and speaker
//   node scripts/rapture/voice-script.mjs --list     every line
//
// Pages are the draft's own sections (the same eight the Screenplay tab carries: docs/rapture/screenplay/ep1-0N-*.md).
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const DRAFT = "docs/rapture/ep1-screenplay.md";

/** The eight sections of the draft, in running order. `id` is the page number in the Screenplay tab (there is no ep1-05). */
export const PAGES = [
  { id: "ep1-01", sceneId: "rapture-ep1-mugging", title: "The mugging (cold open)", heading: "# COLD OPEN" },
  { id: "ep1-02", sceneId: "rapture-ep1-st-judes", title: "St Jude's and the rapture", heading: "# ST JUDE'S" },
  { id: "ep1-03", sceneId: "rapture-ep1-cops", title: "The cops, first beat", heading: "# THE COPS" },
  { id: "ep1-04", sceneId: "rapture-ep1-washing-up", title: "St Jude's, after", heading: "# ST JUDE'S - AFTER" },
  { id: "ep1-06", sceneId: "rapture-ep1-storage", title: "Martin at the storage facility", heading: "# MARTIN" },
  { id: "ep1-07", sceneId: "rapture-ep1-danny-jodie", title: "Danny and Jodie", heading: "# DANNY AND JODIE" },
  { id: "ep1-08", sceneId: "rapture-ep1-cops-second", title: "The cops, second beat", heading: "# THE COPS - NIGHT" },
  { id: "ep1-09", sceneId: "rapture-ep1-no", title: "Tag: 1980", heading: "# TAG - 1980" },
];

/** Everyone who speaks in the draft. An unknown all-capitals cue is an error, not a guess. */
export const SPEAKERS = ["NINA", "KATH", "RAY", "JODIE", "DANNY", "MAUREEN", "BRIAN", "TERRY", "COL", "VOLUNTEER", "DEBORAH", "MUGGER", "MAN IN BLUE COAT", "MARTIN"];
/** All-capitals lines that are not speakers: on-screen text, inserts, transitions. */
const NOT_SPEAKERS = /^(USER PARAMETERS|SONG PARAMETERS|ON SCREEN:|END MONTAGE|BACK TO SCENE|CUT TO BLACK\.|INSERT\b.*|SUPER:.*|MONTAGE\b.*|FLASHES\b.*|NO)$/;

/** How long a pause the writer left open lasts on a table read. Written-out numbers are locked; the rest are estimates. */
export const PAUSE = { parenthetical: 1.2, beat: 0.7, longPause: 4, speakerChange: 0.5, sameSpeaker: 0.8, immediately: 0.1, actionBase: 0.6, actionPerWord: 0.06, actionMax: 6 };
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };

const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").slice(0, 6).join("-");
const speakerSlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** A spelled-out pause in an action paragraph ("Four seconds of nothing.", "An eight-second pause."): seconds, or 0. */
export function writtenPause(text) {
  let seconds = 0;
  for (const m of text.matchAll(/\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|\d+)[- ]seconds?\b/gi)) {
    const word = m[1].toLowerCase();
    seconds = Math.max(seconds, NUMBER_WORDS[word] ?? Number(word));
  }
  if (!seconds && /\blong pause\b/i.test(text)) seconds = PAUSE.longPause;
  return seconds;
}

/** Splits a draft into its pages and reads each page's dialogue. */
export function readEpisode(rootDir = root) {
  const draft = readFileSync(resolve(rootDir, DRAFT), "utf8");
  const parts = draft.split("\n===\n");
  if (parts.length !== PAGES.length + 1) throw new Error(`expected ${PAGES.length + 1} sections in ${DRAFT}, got ${parts.length}`);
  return PAGES.map((page, index) => {
    const body = parts[index + 1].replace(/^\n+/, "").replace(/\n+$/, "");
    if (!body.startsWith(page.heading)) throw new Error(`${page.id}: expected the section to open with ${page.heading}`);
    return { ...page, lines: readPage(page, body) };
  });
}

function readPage(page, body) {
  const blocks = body.split(/\n{2,}/).map(block => block.split("\n").map(line => line.trim()).filter(Boolean)).filter(block => block.length);
  const lines = [];
  const used = new Map();
  let pending = { written: 0, words: 0, note: "" };
  for (const block of blocks) {
    const cue = /^([A-Z][A-Z' ]*[A-Z])(?: \((?:CONT'D|O\.S\.|V\.O\.)\))?$/.exec(block[0]);
    const speaker = cue && SPEAKERS.includes(cue[1]) ? cue[1] : null;
    if (cue && !speaker && !NOT_SPEAKERS.test(block[0]) && !/^(EXT|INT)\b/.test(block[0]) && block.length > 1 && !/^[A-Z'.:\- ]+$/.test(block[1])) {
      throw new Error(`${page.id}: "${cue[1]}" looks like a speaker but is not in SPEAKERS (${block.slice(0, 2).join(" / ")})`);
    }
    if (!speaker) {
      // Action, slugline, insert or on-screen text: it takes time on a table read, and may lock a pause.
      const text = block.join(" ");
      if (/^(EXT|INT)\b|^#|^>|^SUPER:|^INSERT\b|^ON SCREEN:|^MONTAGE|^END MONTAGE|^BACK TO|^CUT TO|^FLASHES/.test(block[0]) && !writtenPause(text)) continue;
      const written = writtenPause(text);
      if (written) { pending.written = Math.max(pending.written, written); pending.note = (pending.note ? pending.note + " " : "") + text.match(/[^.]*\b(?:seconds?|long pause)\b[^.]*\./i)?.[0].trim(); }
      else pending.words += text.split(/\s+/).length;
      continue;
    }
    // Dialogue: parentheticals are directions, the rest is what is said.
    const segments = [];
    for (const row of block.slice(1)) {
      if (/^\(.*\)$/.test(row)) segments.push({ paren: row.slice(1, -1), text: "" });
      else if (segments.length && !segments.at(-1).text) segments.at(-1).text = row;
      else if (segments.length) segments.at(-1).text += " " + row;
      else segments.push({ paren: "", text: row });
    }
    const text = segments.map(s => s.text).join(" ").trim();
    if (!text) throw new Error(`${page.id}: ${speaker} has a cue with nothing to say`);
    const paren = segments.map(s => s.paren).filter(Boolean);
    const previous = lines.at(-1);
    const sameSpeaker = previous && previous.speaker === speaker && pending.written === 0 && !pending.words;
    let gap, gapKind, gapNote = "";
    // The first line of a page starts the page; only a pause the writer spelled out ("Four seconds of nothing.") holds it back.
    if (!previous && !pending.written) { gap = 0; gapKind = "start"; }
    else if (pending.written) { gap = pending.written; gapKind = "written"; gapNote = pending.note; }
    else {
      gap = previous && previous.speaker === speaker ? PAUSE.sameSpeaker : PAUSE.speakerChange; gapKind = "estimated";
      // Action between two lines takes time, more the more is described (a table read has no picture: capped).
      if (pending.words) { gap = Math.max(gap, Math.min(PAUSE.actionMax, PAUSE.actionBase + PAUSE.actionPerWord * pending.words)); gapNote = `action between the lines (${pending.words} words)`; }
    }
    // A pause the character takes inside the line ("(pause)", "(a beat)") comes before the words; "(immediately)" cuts the wait.
    const lead = segments[0].paren;
    if (previous) {
      if (/^pause$/i.test(lead)) { gap += PAUSE.parenthetical; gapNote = (gapNote ? gapNote + "; " : "") + "(pause)"; }
      else if (/^(a )?beat$/i.test(lead)) { gap += PAUSE.beat; gapNote = (gapNote ? gapNote + "; " : "") + "(a beat)"; }
      else if (/^(immediately|no hesitation whatsoever)$/i.test(lead) && gapKind === "estimated") { gap = PAUSE.immediately; gapNote = `(${lead})`; }
    }
    const words = slug(text);
    const stem = `${page.id}-${speakerSlug(speaker)}-${words}`;
    const seen = (used.get(stem) || 0) + 1;
    used.set(stem, seen);
    lines.push({
      id: seen > 1 ? `${stem}-${seen}` : stem, page: page.id, n: lines.length + 1, speaker, text, paren,
      gap: Math.round(gap * 100) / 100, gapKind, ...(gapNote ? { gapNote } : {}), continued: sameSpeaker || undefined,
    });
    pending = { written: 0, words: 0, note: "" };
  }
  return lines;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = readEpisode();
  const list = process.argv.includes("--list");
  const totals = new Map();
  for (const page of pages) {
    console.log(`${page.id}  ${page.title}: ${page.lines.length} lines`);
    for (const line of page.lines) {
      totals.set(line.speaker, (totals.get(line.speaker) || 0) + 1);
      if (list) console.log(`  ${String(line.n).padStart(3)} +${String(line.gap).padStart(5)}s ${line.gapKind.padEnd(9)} ${line.speaker.padEnd(16)} ${line.paren.length ? `(${line.paren.join("; ")}) ` : ""}${line.text}${line.gapNote ? `   [${line.gapNote}]` : ""}`);
    }
  }
  console.log([...totals].sort((a, b) => b[1] - a[1]).map(([name, n]) => `${name} ${n}`).join(", "));
  console.log(`${[...totals.values()].reduce((a, b) => a + b, 0)} spoken lines in ${pages.length} pages`);
}
