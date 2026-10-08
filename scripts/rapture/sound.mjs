// Lays the shared sound-effect library (public/audio/sfx/, docs/sfx/README.md) on the Rapture's frames: the four re-boarded episode-one
// scenes (the mugging, St Jude's, the first cops scene, the washing-up) and the cops' second beat. Each entry is [effect, seconds after the
// cut, gain]; the gain sets the effect under the speech (beds 0.15-0.4, hits 0.6-0.9) and the file is as made.
//
// Effects have no text (the animatic would burn a subtitle for any entry that has some) and an id that starts `sfx-` (bundledAudioUpdates
// gives a saved workspace the effects once, on a frame that already has dialogue). They never lengthen a frame. Loops play once.
// Left without sound on purpose: the interiors in the police car (the dashboard is silent; the scene is its pauses), the rapture itself ("no
// flash, no sound"), the washing-up's kitchen and the open road (nothing in the library fits), the storage unit (its board is not written).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const SOUND = {
  // THE MUGGING (dry: no rain): "a cashpoint glowing to itself. Traffic somewhere else." The traffic carries on after he is gone.
  "rapture-ep1mug-01": [["cashpoint-hum", 0, 0.3], ["traffic-distant", 0, 0.3]],
  "rapture-ep1mug-09": [["traffic-distant", 0, 0.35]],
  "rapture-ep1mug-10": [["knife-ring", 0.4, 0.9]],
  "rapture-ep1mug-14": [["traffic-distant", 0, 0.2]],
  "rapture-ep1mug-15": [["cashpoint-hum", 0, 0.25], ["traffic-distant", 0, 0.25]],
  // ST JUDE'S: the fax that has no business existing, the ledger, the tap that coughs, the radio that carries on, the knife, the cup
  "rapture-ep1stj-07": [["fax-machine", 0.4, 0.45]],
  "rapture-ep1stj-08": [["pen-clipboard", 0.3, 0.7]],
  "rapture-ep1stj-12": [["tap-cough", 0, 0.9]],
  "rapture-ep1stj-13": [["radio-jingle", 0, 0.2]],
  "rapture-ep1stj-17": [["radio-jingle", 0, 0.3]],
  "rapture-ep1stj-18": [["knife-ring", 0.2, 0.5]],
  "rapture-ep1stj-20": [["cup-rattle", 0.2, 0.8]],
  // THE COPS (first beat): the trolley nobody looks at, the smashed doors, the water, the doors, the trolley that will not stop, the taser
  "rapture-ep1c1-02": [["traffic-distant", 0, 0.2]],
  "rapture-ep1c1-06": [["trolley-roll", 0.3, 0.6]],
  "rapture-ep1c1-08": [["glass-crunch-steps", 1.5, 0.5]],
  "rapture-ep1c1-10": [["hangar-room-tone", 0, 0.3]],
  "rapture-ep1c1-12": [["car-doors-open", 0.1, 0.7]],
  "rapture-ep1c1-13": [["trolley-roll", 0, 0.7]],
  "rapture-ep1c1-14": [["taser-zap", 0.4, 0.9], ["body-fall", 2.3, 0.6], ["water-bottles-burst", 2.5, 0.9]],
  // THE COPS (second beat): the car alone in an empty street
  "rapture-ep1c2-02": [["traffic-distant", 0, 0.2]],
  // WASHING UP: the dead line, the bus that catches, the front door tried twice, the bus down the lane
  "rapture-ep1wu-09": [["landline-dead", 0.2, 0.7]],
  "rapture-ep1wu-13": [["engine-start-old", 0.3, 0.8]],
  "rapture-ep1wu-21": [["door-lock-handle", 3.0, 0.7]],
  "rapture-ep1wu-22": [["gravel-tyres", 0.3, 0.6]],
};

export function attachSound(frames, root) {
  const library = JSON.parse(readFileSync(resolve(root, "docs/sfx/library.json"), "utf8"));
  const effects = new Map(library.effects.filter(e => e.file).map(e => [e.id, e]));
  const byId = new Map(frames.map(f => [f.id, f]));
  let count = 0;
  for (const [frameId, list] of Object.entries(SOUND)) {
    const frame = byId.get(frameId);
    assert(frame, `sound plan: no frame ${frameId}`);
    const seen = {}, entries = [];
    for (const [effect, at, gain] of list) {
      const e = effects.get(effect);
      assert(e, `${frameId}: effect ${effect} is not in docs/sfx/library.json`);
      assert(e.projects.rapture, `${frameId}: ${effect} is not tagged for the Rapture in docs/sfx/library-source.json`);
      assert(at >= 0 && at < frame.duration, `${frameId}: ${effect} starts after the frame ends`);
      const k = (seen[effect] = (seen[effect] || 0) + 1);
      entries.push({ id: `sfx-${frameId.replace(/^rapture-/, "")}-${effect}${k > 1 ? `-${k}` : ""}`, character: "SFX", text: "", src: e.file, offset: at, duration: e.duration, gain, ...(e.source === "new" ? { model: "eleven_text_to_sound_v2" } : {}) });
    }
    frame.audio = [...(frame.audio || []).filter(a => !a.id.startsWith("sfx-")), ...entries].sort((a, b) => a.offset - b.offset || (a.character === "SFX") - (b.character === "SFX"));
    count += entries.length;
  }
  return { frames: Object.keys(SOUND).length, effects: count };
}
