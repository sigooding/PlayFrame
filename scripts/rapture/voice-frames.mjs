// Lays episode one's recorded dialogue over the frames of the two boards that carry the draft verbatim:
// Danny and Jodie (screenplay page ep1-07, 21 shots) and the cops' second beat (ep1-08, 6 shots).
//
// The board is walked in shot order and its dialogue lines (the indented `SPEAKER: text` lines) are matched, in order, to the manifest's
// lines for the page (docs/rapture/voice/manifest.json). The speakers have to agree and so do the words, except for the trims the
// board's own header declares (TRIMS); anything else stops the build, so a reworded board or a re-recorded line cannot quietly end up
// on the wrong frame.
//
// Inside a frame each line keeps the spacing the page's own timeline gives it (the pauses the draft writes out, the table-read
// estimates between speakers). The first line comes a beat (LEAD) after the cut, or after the hold the draft writes before it
// ("Hold. Four seconds."). A frame is lengthened, never shortened, so the last word has TAIL seconds of air before the cut: the board's
// durations are working estimates and the recorded lines are the first thing that is not.

/** Air left after the last spoken word before the frame cuts (the NEONOIRE convention). */
export const TAIL = 0.6;
/** A beat before a frame's first word, unless the draft writes a hold before the line. */
export const LEAD = 0.6;
/** Lines where the board and the draft differ on purpose: the board's header says the draft trims it. */
export const TRIMS = {
  "ep1-07-jodie-nothing-off-anyone-who-s-still": "the draft says \"anyone who's still alive\", the board \"anyone still alive\"",
};

const words = text => text.toLowerCase().replace(/[’]/g, "'").replace(/\([^)]*\)/g, " ").replace(/[—–-]/g, " ").replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean).join(" ");

/**
 * @param page      the screenplay page the board follows ("ep1-07")
 * @param bodies    the board's shot bodies, in shot order
 * @param manifest  docs/rapture/voice/manifest.json
 * @returns one { audio, needed } per shot: the frame's audio entries and the seconds the frame needs to hold them (0 for a silent shot)
 */
export function dialogueFor(page, bodies, manifest) {
  const lines = manifest.lines.filter(line => line.page === page);
  let next = 0;
  const claimed = bodies.map((body, shot) => [...body.matchAll(/^\s{2,}([A-Z][A-Z' ]*[A-Z]):\s*(.*)$/gm)].map(([, speaker, text]) => {
    const line = lines[next++];
    if (!line) throw new Error(`${page} shot ${shot + 1}: the board has more dialogue than the ${lines.length} recorded lines`);
    if (line.speaker !== speaker) throw new Error(`${page} shot ${shot + 1}: the board has ${speaker} where line ${line.n} is ${line.speaker}'s (${line.id})`);
    if (words(line.text) !== words(text) && !(line.id in TRIMS)) throw new Error(`${page} shot ${shot + 1}: the board says ${JSON.stringify(text)} but the draft's line ${line.n} is ${JSON.stringify(line.text)}; declare the trim in voice-frames.mjs or fix the board`);
    return line;
  }));
  if (next !== lines.length) throw new Error(`${page}: the board holds ${next} lines of dialogue but ${lines.length} are recorded`);
  return claimed.map(shot => {
    if (!shot.length) return { audio: [], needed: 0 };
    const first = shot[0];
    const lead = first.gapKind === "written" ? first.gap : LEAD;
    const audio = shot.map(line => ({
      id: line.id, character: line.speaker, text: line.text, src: line.file,
      offset: Math.round((lead + line.offset - first.offset) * 100) / 100, duration: line.duration, voice: line.voiceId, model: line.model,
    }));
    const last = audio[audio.length - 1];
    return { audio, needed: Math.ceil(last.offset + last.duration + TAIL) };
  });
}
