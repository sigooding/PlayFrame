// Lays the cold open's recorded voices and its sound effects on the frames (build-project.mjs calls this after the shots exist).
//
//   voices   docs/hangar/voice/manifest.json (voice-batch.mjs), at the `at` seconds in voice-data.mjs
//   effects  public/audio/sfx/ via docs/sfx/library.json (the shared library, docs/sfx/README.md), at the SOUND table's seconds and gains
//
// A frame is lengthened, never shortened, so the last word has 0.6 s of air; effects never lengthen a frame. Effect entries have no text
// (the animatic would burn a subtitle for any entry that has some) and an id that starts `sfx-` (bundledAudioUpdates tells them apart).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LINES, SOUND, VOICES } from "./voice-data.mjs";

export const TAIL = 0.6;
const NAME = { "RED TWO": "Red Two", "RED LEADER": "Red Leader", TV: "TV", AIRMAN: "Airman", TRUCKER: "Trucker", MOM: "Mom", AGENT: "Agent" };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pad = n => String(n).padStart(2, "0");
const round1 = x => Math.round(x * 10) / 10;

/** The `NAME: (delivery) words` cues in the build and the recorded lines must be the same lines, in the same order. */
export function checkCues(cues) {
  const flat = Object.keys(cues).map(Number).sort((a, b) => a - b).flatMap(shot => cues[shot].map(cue => ({ shot, cue })));
  assert.equal(flat.length, LINES.length, `the build has ${flat.length} dialogue cues and ${LINES.length} lines were recorded`);
  flat.forEach(({ shot, cue }, i) => {
    const m = /^([A-Z][A-Z ]*): (?:\([^)]*\) )?(.*)$/.exec(cue), line = LINES[i];
    assert(m, `cue ${i + 1} is not NAME: words`);
    assert.equal(line.shot, shot, `line ${line.id} is on shot ${line.shot}, its cue is on shot ${shot}`);
    assert.equal(m[1], line.speaker, `line ${line.id}: speaker ${line.speaker} was recorded, the cue says ${m[1]}`);
    assert.equal(m[2], line.shown ?? line.text, `line ${line.id} was reworded since it was recorded: re-record it (scripts/hangar/voice-data.mjs)`);
  });
}

export function attachSound(shots, root) {
  const manifest = JSON.parse(readFileSync(resolve(root, "docs/hangar/voice/manifest.json"), "utf8"));
  const library = JSON.parse(readFileSync(resolve(root, "docs/sfx/library.json"), "utf8"));
  const byLine = new Map(manifest.lines.map(l => [l.id, l]));
  const effects = new Map(library.effects.filter(e => e.file).map(e => [e.id, e]));
  assert.equal(manifest.lines.length, LINES.length, "every line has a take in the manifest (node scripts/hangar/voice-batch.mjs)");
  for (const shot of shots) {
    const n = shot.shotNumber, audio = [];
    let speechEnd = 0, lastEnd = -1;
    for (const line of LINES.filter(l => l.shot === n)) {
      const m = byLine.get(line.id);
      assert(m && existsSync(resolve(root, "public" + m.file)), `${line.id}: take on disk`);
      assert(line.at >= lastEnd + 0.2, `shot ${n}: ${line.id} starts before the line before it has ended`);
      lastEnd = line.at + m.duration;
      speechEnd = Math.max(speechEnd, lastEnd);
      audio.push({ id: `hangar-${pad(n)}-${line.id.toLowerCase()}-${slug(line.speaker)}`, character: NAME[line.speaker], text: line.shown ?? line.text, src: m.file, offset: line.at, duration: m.duration, voice: VOICES[line.speaker].name, model: "eleven_v4" });
    }
    const seen = {};
    for (const [effect, at, gain] of SOUND[n] || []) {
      const e = effects.get(effect);
      assert(e, `shot ${n}: effect ${effect} is not in docs/sfx/library.json`);
      assert(e.projects.hangar, `shot ${n}: ${effect} is not tagged for the Hangar in docs/sfx/library-source.json`);
      assert(at >= 0 && at < shot.duration, `shot ${n}: ${effect} starts after the frame ends`);
      const k = (seen[effect] = (seen[effect] || 0) + 1);
      audio.push({ id: `sfx-hangar-${pad(n)}-${effect}${k > 1 ? `-${k}` : ""}`, character: "SFX", text: "", src: e.file, offset: at, duration: e.duration, gain, ...(e.source === "new" ? { model: "eleven_text_to_sound_v2" } : {}) });
    }
    if (!audio.length) continue;
    audio.sort((a, b) => a.offset - b.offset || (a.character === "SFX") - (b.character === "SFX"));
    shot.audio = audio;
    if (speechEnd) shot.duration = Math.max(shot.duration, round1(speechEnd + TAIL));
  }
  return { lines: LINES.length, framesWithSound: shots.filter(s => s.audio).length, effects: shots.reduce((n, s) => n + (s.audio || []).filter(a => a.character === "SFX").length, 0) };
}
