// The cold open's voices and sound, as data (8 October 2026). Everything here is an authoring decision; build-project.mjs reads it with
// the manifest (docs/hangar/voice/manifest.json, written by voice-batch.mjs) and lays it on the frames (sound.mjs).
//
// The 17 spoken lines are the `NAME: (delivery) words` cues in build-project.mjs (the video prompts read them too); voice-batch.mjs
// stops if a cue has been reworded since it was recorded. American voices only: the Hangar's cast is 1944 and 1975 Ohio.

/** speaker (as the cue spells it) → who voices it. `saved` voices are in the project's ElevenLabs workspace already (NEONOIRE's Jack, Vera,
 *  Daniel); `stock` voices are ElevenLabs library voices found with the use-case filter `characters_animation` (character type). */
export const VOICES = {
  "RED TWO":    { name: "Cavendish", voiceId: "Cx1u6YPIa1SPiAbYj3gJ", kind: "stock (characters_animation)", fx: "radio", why: "The young pilot: a dry, quietly exhausted young-adult American male, deadpan, little pitch movement, so the awe in the lines comes from the words and the direction, not the voice." },
  "RED LEADER": { name: "Daniel - NEONOIRE", voiceId: "oOJyrMKhBUCGET6PTTAu", kind: "saved (NEONOIRE)", fx: "radio", why: "The older officer: NEONOIRE's Daniel, a neat, careful 41-year-old American man; clipped and dismissive with a one-word direction. Never in a scene with the Agent." },
  "TV":         { name: "Clyde - Vintage Male Radio Announcer", voiceId: "QMJTqaMXmGnG8TCm8WQG", kind: "stock (characters_animation)", fx: "tv", why: "The Senate hearing on the guard-booth set: a mid-low American announcer voice (library label Use: Character), through the television treatment." },
  "AIRMAN":     { name: "Rick - Calm & Basic", voiceId: "PoqlHoqJoAfdQ0g8bLK3", kind: "stock (characters_animation)", fx: null, why: "The young airman of 1975: a plain, ordinary young American male voice that does not announce itself; the counting is under his breath, so two of his lines are deliberately far quieter (-34 dB against -22)." },
  "TRUCKER":    { name: "Jack (Narrator Lead)", voiceId: "MZhx7pKflsc0sAwciDEy", kind: "saved (NEONOIRE's Jack)", fx: null, why: "The civilian driver: NEONOIRE's Jack, a world-weary male voice in his 40s-50s; dry and flat. The same voice as Jack by the director's call (reuse across stories)." },
  "MOM":        { name: "Vera", voiceId: "4Rn2L1CRjYh93G56jNXI", kind: "saved (NEONOIRE's Vera)", fx: null, why: "The nurse coming off a double shift: NEONOIRE's Vera, a plain American rust-belt voice in her early-to-mid 30s, which is Ohio." },
  "AGENT":      { name: "Callum - Husky Trickster", voiceId: "N2lVS1w4EtoT3dr4eOWO", kind: "stock (characters_animation, premade)", fx: null, why: "The agent in the suit: a premade ElevenLabs character voice, middle-aged American, gravelly with a faint unsettling edge; kept apart from the Trucker's voice (Jack) because they share the roadside scene." },
};

/** id, shot, speaker, text spoken, direction (v4, in brackets; one word on a line of three words or fewer, no hush words), `at` seconds after the cut. */
export const LINES = [
  { id: "H01", shot: 1,  speaker: "RED TWO",    text: "Red Leader, I've got something on my right wing.",                       direction: "Tense, steady",          at: 2.0 },
  { id: "H02", shot: 1,  speaker: "RED LEADER", text: "Say again, Red Two.",                                                    direction: "Clipped",                at: 6.2 },
  { id: "H03", shot: 1,  speaker: "RED TWO",    text: "No markings. It's glowing. I bank, it banks. It's copying me.",           direction: "Tense, incredulous",     at: 8.9 },
  { id: "H04", shot: 2,  speaker: "RED LEADER", text: "Could be a Jerry trick. Take it down.",                                  direction: "Clipped, dismissive",    at: 4.0 },
  { id: "H05", shot: 2,  speaker: "RED TWO",    text: "It's not doing anything. It's just flying with me.",                     direction: "Uneasy, puzzled",        at: 7.0 },
  { id: "H06", shot: 2,  speaker: "RED LEADER", text: "That's an order.",                                                       direction: "Cold",                   at: 11.6 },
  { id: "H07", shot: 5,  speaker: "TV",         text: "The question before this committee is what else has been kept from the American people.", direction: "Formal, measured", at: 0.8, shown: "...the question before this committee is what else has been kept from the American people." },
  { id: "H08", shot: 9,  speaker: "AIRMAN",     text: "Don't you want to know what's in it?",                                   direction: "Curious, earnest",       at: 1.2 },
  { id: "H09", shot: 9,  speaker: "TRUCKER",    text: "Nope.",                                                                  direction: "Flat",                   at: 4.0 },
  { id: "H10", shot: 12, speaker: "TRUCKER",    text: "Thirty years driving. First time anybody paid me to skip a scale.",      direction: "Dry, wry",               at: 1.0 },
  { id: "H11", shot: 13, speaker: "TRUCKER",    text: "Load's shifting.",                                                       direction: "Flat",                   at: 3.8 },
  { id: "H12", shot: 14, speaker: "AIRMAN",     text: "One-two-three... four. One-two-three... four.",                          direction: "Absent, rhythmic",       at: 1.2 },
  { id: "H13", shot: 15, speaker: "TRUCKER",    text: "There. Settled.",                                                        direction: "Dry",                    at: 5.0 },
  { id: "H14", shot: 17, speaker: "MOM",        text: "Come on. Two more miles.",                                               direction: "Drowsy, determined",     at: 1.0 },
  { id: "H15", shot: 29, speaker: "AGENT",      text: "Where is it?",                                                           direction: "Flat",                   at: 1.0 },
  { id: "H16", shot: 29, speaker: "TRUCKER",    text: "Down there. Some lady in a wagon, she just came right at me.",           direction: "Shaken, breathless",     at: 3.2 },
  { id: "H17", shot: 38, speaker: "AIRMAN",     text: "One-two-three... four.",                                                 direction: "Distant",                at: 1.2 },
];

/** Which of a line's two samples is on the frame: the first unless noted (both are kept; the other goes to public/audio/hangar/alternates/). */
export const PICK = {};

/**
 * Sound effects from the shared library (public/audio/sfx/, docs/sfx/README.md) on the shots, [effect, seconds after the cut, gain]. Gains put
 * beds at 0.2-0.5 under speech and hits at 0.7-1; the file is as made, the gain is the frame's. Loops play once (the animatic and the player
 * do not loop a clip), so a bed longer than its file restarts with the next entry, and a bed longer than its frame is cut at the cut.
 * Left without sound on purpose: 10 (diesel and air brakes: nothing in the library), 22 (wood on metal), 26 (her engine fading), 35 (silence; hold).
 */
export const SOUND = {
  1:  [["cockpit-drone", 0, 0.4], ["cockpit-drone", 20, 0.4]],
  2:  [["cockpit-drone", 0, 0.4], ["click-pattern", 0.8, 0.7]],
  3:  [["gunfire-bursts", 3.0, 0.9]],
  4:  [["forklift-yard", 0, 0.4]],
  5:  [["hangar-room-tone", 0, 0.3]],
  6:  [["hangar-room-tone", 0, 0.5]],
  7:  [["hangar-room-tone", 0, 0.3], ["cup-rattle", 1.2, 0.5]],
  8:  [["hangar-room-tone", 0, 0.35]],
  9:  [["pen-clipboard", 0.4, 0.7]],
  11: [["crickets-night", 0, 0.35]],
  12: [["crickets-night", 0, 0.25]],
  13: [["crate-knock", 0.7, 0.8], ["crate-knock", 2.3, 0.8]],
  14: [["knock-three-quick", 0.4, 0.8]],
  15: [["knock-three-quick", 0.6, 0.8]],
  16: [["gravel-tyres", 0, 0.5]],
  18: [["truck-horn", 0.2, 0.7], ["gravel-tyres", 1.2, 0.4]],
  19: [["mirror-snap-cap", 0.3, 0.9]],
  20: [["tyre-howl-chains", 0, 0.7]],
  21: [["crate-knock", 0.3, 1.0]],
  23: [["car-tumble-trees", 0.2, 0.9]],
  24: [["crate-knock", 0.8, 0.3], ["crate-knock", 2.6, 0.3], ["crate-knock", 4.2, 0.3]],
  25: [["crickets-night", 3.0, 0.35], ["creek-night", 6.0, 0.35]],
  27: [["flare-hiss", 0, 0.4], ["gravel-tyres", 0.3, 0.4], ["car-doors-open", 3.6, 0.6]],
  28: [["flare-hiss", 0, 0.4]],
  29: [["flare-hiss", 0, 0.3]],
  30: [["flare-hiss", 0, 0.35], ["creek-night", 0, 0.2]],
  31: [["creek-night", 0, 0.4], ["flare-hiss", 0, 0.2]],
  32: [["flare-hiss", 0, 0.3]],
  33: [["creek-night", 0, 0.5]],
  34: [["flare-hiss", 0, 0.4]],
  36: [["creek-night", 0, 0.3], ["flare-hiss", 0, 0.2]],
  37: [["crickets-night", 0, 0.25], ["click-pattern", 1.0, 0.35]],
  38: [["click-pattern", 0.4, 0.15]],
  39: [["flare-hiss", 0, 0.3]],
};
