// The spoken lines of the series' shot boards (docs/rapture/scenes/*.md) for the scenes that have no screenplay draft yet: episodes two to
// five. Episode one's draft is read by voice-script.mjs; these boards are their own authority, so a line belongs to the shot it is
// written in and the frame for that shot can carry it directly.
//
//   node scripts/rapture/board-script.mjs            summary per board and speaker
//   node scripts/rapture/board-script.mjs --list     every line
//
// A board line is `SPEAKER: (direction) words`, indented or not. Everything else in a shot (the camera line, the action) is not spoken:
// it takes time on a table read, and a spelled-out pause in it ("Hold. Five seconds.", "A six-second pause") is a locked gap.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PAUSE, root, writtenPause } from "./voice-script.mjs";

/** The boards, in the series' running order. `id` is the page id the manifest uses, `sceneId` the workspace scene its frames belong to. */
export const BOARDS = [
  { id: "ep2-lockup", file: "ep2-first-wrong-lockup.md", sceneId: "rapture-ep2-alan", title: "Episode 2: the first wrong lockup", speakers: ["NINA", "MAN", "ALAN"] },
  { id: "ep3-cold-open", file: "ep3-cold-open.md", sceneId: "rapture-ep3-cold-open", title: "Episode 3: cold open (the recovery pair)", speakers: ["HARIEL", "SOQED"] },
  { id: "ep4-cold-open", file: "ep4-cold-open.md", sceneId: "rapture-ep3-interview", title: "Episode 4: cold open (Graham's front room)", speakers: ["REEK", "GRAHAM", "TAMSIN"] },
  { id: "ep4-doorstep", file: "ep4-doorstep.md", sceneId: "rapture-ep4-doorstep", title: "Episode 4: the doorstep", speakers: ["MARTIN", "NINA"] },
  { id: "ep4-housing-estate", file: "ep4-housing-estate.md", sceneId: "rapture-ep4-estate", title: "Episode 4: the housing estate", speakers: ["ALAN", "NINA"] },
  { id: "ep4-kitchen", file: "ep4-kitchen.md", sceneId: "rapture-ep4-kitchen", title: "Episode 4: the kitchen", speakers: ["MARTIN", "NINA"] },
  { id: "ep4-number-fourteen", file: "ep4-number-fourteen.md", sceneId: "rapture-ep4-number-fourteen", title: "Episode 4: Number Fourteen", speakers: ["DANNY", "JODIE", "THE WOMAN"] },
  { id: "ep4-pat-cold-open", file: "ep4-pat-cold-open.md", sceneId: "rapture-ep4-pat-cold-open", title: "Episode 4: Pat's house, cold open", speakers: ["PAT", "MALCOLM", "GRAHAM"] },
  { id: "ep4-pat-house", file: "ep4-pat-house.md", sceneId: "rapture-ep4-pat", title: "Episode 4: Pat's house", speakers: ["PAT", "JODIE", "DANNY", "MALCOLM"] },
  { id: "ep4-scout-hut", file: "ep4-scout-hut.md", sceneId: "rapture-ep4-scout-hut", title: "Episode 4: the scout hut", speakers: ["MAN", "JODIE", "DANNY", "WOMAN"] },
  { id: "ep5-pats-night", file: "ep5-pats-night.md", sceneId: "rapture-ep5-pats-night", title: "Episode 5: the night at Pat's", speakers: ["KATH", "RAY", "DANNY", "JODIE", "PAT", "MALCOLM", "NEIL"] },
  { id: "ep5-therapy-class", file: "ep5-therapy-class.md", sceneId: "rapture-ep5-therapy", title: "Episode 5: the therapy class", speakers: ["HI-VIS", "SUE", "CARL", "PAULINE", "DEREK", "DANNY", "JODIE", "MAN"] },
];

const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").slice(0, 6).join("-");
const speakerSlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** `SPEAKER: rest`; the cue is capitals (with spaces, hyphens, apostrophes) and the colon is followed by a space. */
const CUE = /^\s*([A-Z][A-Z0-9' -]*[A-Z0-9]):\s+(.*)$/;

export function readBoard(board, rootDir = root) {
  const source = readFileSync(resolve(rootDir, "docs/rapture/scenes", board.file), "utf8");
  const rows = source.split("\n");
  const lines = [];
  const used = new Map();
  let shot = null, pending = { written: 0, words: 0, note: "" }, headingSeen = false;
  for (const raw of rows) {
    const row = raw.trim();
    if (!row) continue;
    const header = /^(\d+[a-z]?)\. /.exec(row);
    if (header) { shot = header[1]; headingSeen = false; pending.words += 0; continue; }
    if (shot === null) continue; // the board's preamble (scene, cast, grammar, notes)
    const cue = CUE.exec(row);
    if (cue && board.speakers.includes(cue[1])) {
      const speaker = cue[1];
      // Leading parentheticals are directions; any in the middle are stripped from what is said and kept as directions too.
      let rest = cue[2], paren = [];
      for (let m; (m = /^\(([^)]*)\)\s*(.*)$/.exec(rest));) { paren.push(m[1]); rest = m[2]; }
      const inner = [...rest.matchAll(/\(([^)]*)\)/g)].map(m => m[1]);
      if (inner.length) { paren.push(...inner); rest = rest.replace(/\s*\([^)]*\)\s*/g, " ").trim(); }
      const text = rest.trim();
      if (!text) throw new Error(`${board.id} shot ${shot}: ${speaker} has a cue with nothing to say`);
      const previous = lines.at(-1);
      let gap, gapKind, gapNote = "";
      if (!previous && !pending.written) { gap = 0; gapKind = "start"; }
      else if (pending.written) { gap = pending.written; gapKind = "written"; gapNote = pending.note; }
      else {
        gap = previous && previous.speaker === speaker ? PAUSE.sameSpeaker : PAUSE.speakerChange; gapKind = "estimated";
        if (pending.words) { gap = Math.max(gap, Math.min(PAUSE.actionMax, PAUSE.actionBase + PAUSE.actionPerWord * pending.words)); gapNote = `action between the lines (${pending.words} words)`; }
      }
      const lead = paren[0] || "";
      if (previous) {
        if (/^pause$/i.test(lead)) { gap += PAUSE.parenthetical; gapNote = (gapNote ? gapNote + "; " : "") + "(pause)"; }
        else if (/^(a )?beat$/i.test(lead)) { gap += PAUSE.beat; gapNote = (gapNote ? gapNote + "; " : "") + "(a beat)"; }
        else if (/^(immediately|no hesitation whatsoever)$/i.test(lead) && gapKind === "estimated") { gap = PAUSE.immediately; gapNote = `(${lead})`; }
      }
      const stem = `${board.id}-${speakerSlug(speaker)}-${slug(text)}`;
      const seen = (used.get(stem) || 0) + 1;
      used.set(stem, seen);
      lines.push({
        id: seen > 1 ? `${stem}-${seen}` : stem, page: board.id, n: lines.length + 1, shot, speaker, text, paren,
        gap: Math.round(gap * 100) / 100, gapKind, ...(gapNote ? { gapNote } : {}),
      });
      pending = { written: 0, words: 0, note: "" };
      continue;
    }
    if (cue && /^[A-Z][A-Z' -]+$/.test(cue[1]) && !board.speakers.includes(cue[1]) && !/^(NOTE|CUT|SUPER|INSERT|FIX|SCENE|CAST|GRAMMAR|TIMECODE|TEXT|ON SCREEN)$/.test(cue[1]) && cue[2].length > 1) {
      throw new Error(`${board.id} shot ${shot}: "${cue[1]}" looks like a speaker but is not in the board's speakers (${row.slice(0, 80)})`);
    }
    // Camera line, action, on-screen text: it takes time, and may lock a pause.
    if (!headingSeen) { headingSeen = true; continue; } // the line after the shot number is the camera line
    const written = writtenPause(row);
    if (written) { pending.written = Math.max(pending.written, written); pending.note = (pending.note ? pending.note + " " : "") + (row.match(/[^.]*\b(?:seconds?|long pause)\b[^.]*\.?/i)?.[0].trim() || row); }
    else pending.words += row.split(/\s+/).length;
  }
  return lines;
}

export function readBoards(rootDir = root) {
  return BOARDS.map(board => ({ ...board, lines: readBoard(board, rootDir) }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const boards = readBoards();
  const list = process.argv.includes("--list");
  const totals = new Map();
  for (const board of boards) {
    console.log(`${board.id}  ${board.title}: ${board.lines.length} lines`);
    for (const line of board.lines) {
      totals.set(`${board.id}:${line.speaker}`, (totals.get(`${board.id}:${line.speaker}`) || 0) + 1);
      if (list) console.log(`  ${String(line.n).padStart(3)} s${String(line.shot).padEnd(3)} +${String(line.gap).padStart(5)}s ${line.gapKind.padEnd(9)} ${line.speaker.padEnd(10)} ${line.paren.length ? `(${line.paren.join("; ")}) ` : ""}${line.text}${line.gapNote ? `   [${line.gapNote}]` : ""}`);
    }
  }
  const speakers = new Map();
  for (const [key, n] of totals) { const who = key.split(":")[1]; speakers.set(who, (speakers.get(who) || 0) + n); }
  console.log([...speakers].sort((a, b) => b[1] - a[1]).map(([name, n]) => `${name} ${n}`).join(", "));
  console.log(`${[...totals.values()].reduce((a, b) => a + b, 0)} spoken lines in ${boards.length} boards`);
}
