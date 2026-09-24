// Hand-authored production metadata for NEONOIRE — the opening scenes.
//
// The draft itself lives at the repository root (Neonoire_Opening.fountain) and is never edited
// here. This module knows only three things: who is in the film, how the draft is split into the
// Screenplay tab's seven pages, and how a numbered shot board in docs/neonoire/scenes/ is read.
// Dialogue and action are always quoted from the fountain, never retyped.
//
//   npm run build:neonoire     rebuild public/projects/neonoire-opening.json
//   node scripts/neonoire/split-opening.mjs   regenerate the seven screenplay pages
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const projectId = "74a9cb34-9e80-4a04-a614-000000000065";
export const actId = "neonoire-opening";
export const createdAt = "2026-09-24T00:00:00.000Z";
export const FOUNTAIN = "Neonoire_Opening.fountain";

export const characterId = key => `neonoire-${key}`;

/**
 * The look of the film, in the film's own words. Every frame's notes carry this, so the prompt
 * studio and any later AI pass starts from the draft rather than from a mood.
 */
export const grammar =
  "Tokyo as a memory that is still happening. The city lights the characters, not the sky: vending machines, shop signs, train windows, fluorescent tubes. Sodium orange against a sick fluorescent green. Soft halation around every light, blacks slightly crushed. It should look like film, and feel like something remembered. Rain is never glamorous — no lightning, no storms, cold, steady, patient rain that turns the streets black and reflective. Wide and patient; close-ups are rare, so they count. Nothing is explained.";

const cast = [
  ["mara", "Mara Voss", "Protagonist", "24", "American. Twenty-four, in Kanda by chance on the wrong night: she declines her sister's call, watches a man shot in the rain, takes a coin-locker key out of his hand and the killers' attention with it. Hair soaked flat, held back by a cheap enamel clip shaped like a small red bird, arms folded, no umbrella. The clip drops between the crates of the bar and she never notices. Speaks halting Japanese. Has been crying, or is about to.", ["Guarded", "Quick", "Unready"], "sage", "mara"],
  ["vera", "Vera Voss", "Co-lead", "29", "American. Twenty-nine, Mara's older sister, three days behind her and always one step behind the police. Her Japanese is fluent, careful and slightly formal — learned as a child, relearned as an adult. She sets two cups on a table for one and takes her sister's blue umbrella to a police station counter.", ["Careful", "Steady", "Alone"], "sand", "vera"],
  ["jack", "Jack Voss", "The photograph", "40s, twenty years ago", "American. The girls' father, and the only warm-coloured thing in Vera's apartment: a rumpled suit, both daughters' hands in his, a smile, a noodle-shop sign behind them. Twenty years ago, in a frame on a shelf. He appears nowhere else in the opening and is never spoken about.", ["Warm", "In one frame only"], "clay", undefined],
  ["old-man", "The Old Man", "Cold open", "70s", "Japanese. Seventies, cheap raincoat, one hand pressed to his side as if something is hidden there. He keeps looking back, stops without turning round, says twenty years to himself, and gives a stranger a key with his last strength. Unnamed in the opening.", ["Hunted", "Resigned", "Deliberate"], "sand", undefined],
  ["masked-men", "The Masked Men", "Cold open", "30s to 40s", "Two men in black clothes and plain masks who do not run. They touch earpieces and report positions: first position done, moving to second. Their work is ordinary to them, and the film never shows a face under the masks — only eyes, and shoes, and a torch beam finding a purse in a puddle.", ["Methodical", "Unhurried", "Bored"], "rose", undefined],
  ["journalist", "The Journalist", "Cold open", "40s", "An untouched beer, a closed notebook, a watched door — and one question asked off camera: where is he. He is killed four shots later and his notebook leaves with the men who did it. Unnamed in the opening; he speaks Japanese.", ["Waiting", "Private", "Unlucky"], "clay", undefined],
  ["young-officer", "The Young Officer", "Front counter", "20s", "Takes a missing-person report with polite boredom until the name Mara Voss comes up on the monitor. Then he turns away from her and makes a quiet phone call, and comes back politer than he was. Unnamed in the opening.", ["Polite", "Bored", "Changed"], "sand", "young-officer"],
  ["ishida", "Detective Ishida", "Police", "50s", "Gentle, unhurried, tired in a way that looks like decency, with excellent English he offers as a courtesy. He asks about Kanda, gives Vera his card and tells her to call at any hour — then opens a drawer with her sister's purse in it and closes it again.", ["Kind", "Unhurried", "Deciding"], "sage", "ishida"],
];

export const characters = cast.map(([key, name, role, age, description, traits, color, sheet]) => ({
  id: characterId(key), name, role, age, description, traits, color, createdAt,
  ...(sheet ? { image: `/images/neonoire/sheets/${sheet}.jpg` } : {}),
  relations: [],
}));
const link = (a, b, kind, note) => {
  characters.find(c => c.id === characterId(a)).relations.push({ id: `neonoire-link-${a}-${b}`, targetId: characterId(b), kind, note });
  characters.find(c => c.id === characterId(b)).relations.push({ id: `neonoire-link-${b}-${a}`, targetId: characterId(a), kind: kind === "Parent" ? "Child" : "Sibling", note });
};
link("vera", "mara", "Sibling", "Three days of unanswered calls, and an umbrella left in a stand.");
link("jack", "mara", "Parent", "The photograph on Vera's shelf: a Tokyo street twenty years ago.");
link("jack", "vera", "Parent", "The photograph on Vera's shelf: a Tokyo street twenty years ago.");

// ---------------------------------------------------------------------------------------------
// The seven scenes, in the draft's own running order
// ---------------------------------------------------------------------------------------------

/** A scene's slugline as the draft writes it, so a page can prove it opens on its own scene. */
export const SCENES = [
  {
    key: "s1", id: "neonoire-s1", n: 1, partId: "neonoire-part-1",
    title: "The backstreet", location: "EXT. BACKSTREET, KANDA", time: "NIGHT",
    kind: "Cold open", lighting: "Practical night", slugline: "EXT. BACKSTREET, KANDA - NIGHT #1#",
    page: "n01-backstreet.md", board: "n01-backstreet.md",
    cast: ["Mara Voss", "The Old Man", "The Masked Men"],
    grammar: "Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.",
    description: "Cold open. Rain in a Kanda backstreet. Mara declines her sister's call, ducks into the doorway of a closed barbershop, and watches two masked men shoot an old man without hurrying — then kneels beside him and takes a coin-locker key out of his hand. BOARDED — 19 shots. The draft's own scene 1; nothing is explained, and nobody names the key.",
    lightingNotes: "The vending machine is the brightest source in the film's first minute. Sodium orange street lamps, one cold white vending machine, green fluorescent spill at the corner. No white beams in frame, ever.",
  },
  {
    key: "s2", id: "neonoire-s2", n: 2, partId: "neonoire-part-1",
    title: "The small bar", location: "INT. SMALL BAR, KANDA", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. SMALL BAR, KANDA - CONTINUOUS #2#",
    page: "n02-small-bar.md", board: "n02-small-bar.md",
    cast: ["Mara Voss", "The Journalist", "The Masked Men"],
    grammar: "The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.",
    description: "Continuous. Mara hides behind the far end of the counter with the key in her fist. Two pairs of wet black shoes come in softly, ask where is he, and shoot the journalist on the far side of the counter while the television audience laughs. The notebook leaves with them — and Mara's red bird hair clip drops between the crates, unnoticed. BOARDED — 11 shots, ending on the blue TV glow and the title card.",
    lightingNotes: "Amber bottle shelves, the CRT's blue flicker on the ceiling, and the open back door's pale light. No overhead light is ever switched on.",
  },
  {
    key: "s3", id: "neonoire-s3", n: 3, partId: "neonoire-part-2",
    title: "Three days later", location: "EXT. VERA'S APARTMENT BUILDING", time: "DUSK",
    kind: "Standard", lighting: "Blue hour", slugline: "EXT. VERA'S APARTMENT BUILDING - DUSK #3#",
    page: "n03-apartment-building.md", board: "n03-apartment-building.md",
    cast: [],
    grammar: "Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.",
    description: "SUPER: THREE DAYS LATER. An old four-story block squeezed between newer buildings, laundry left out and getting rained on, a train sliding past behind it — and one window on the third floor lit. BOARDED — 4 shots.",
    lightingNotes: "Blue hour with practical sodium beginning at street level and the single warm window on the third floor. Rain in the air; no direct sun, no golden hour.",
  },
  {
    key: "s4", id: "neonoire-s4", n: 4, partId: "neonoire-part-2",
    title: "Vera's apartment", location: "INT. VERA'S APARTMENT", time: "CONTINUOUS",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. VERA'S APARTMENT - CONTINUOUS #4#",
    page: "n04-vera-apartment.md", board: "n04-vera-apartment.md",
    cast: ["Vera Voss", "Jack Voss", "Mara Voss"],
    grammar: "Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.",
    description: "Continuous. Vera calls her sister and gets the recording: I'm not angry anymore, you left your umbrella, you'll get soaked, just call me. The television murmurs rain for the rest of the week, two cups sit on the table for one person and the photograph of Jack and his two small daughters holds the room — then she takes Mara's bone-dry blue umbrella and goes out. BOARDED — 10 shots.",
    lightingNotes: "Flat grey rain light from the window, the CRT's cold glow on the ceiling, one lamp. The framed photograph is the only saturated warm colour in the frame.",
  },
  {
    key: "s5", id: "neonoire-s5", n: 5, partId: "neonoire-part-3",
    title: "The front counter", location: "INT. POLICE STATION, FRONT COUNTER", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. POLICE STATION, FRONT COUNTER - NIGHT #5#",
    page: "n05-front-counter.md", board: "n05-front-counter.md",
    cast: ["Vera Voss", "The Young Officer"],
    grammar: "Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.",
    description: "Night. Vera reports her sister missing, umbrella dripping on the linoleum. A young officer takes her details with polite boredom until the name Mara Voss reaches his monitor; he looks at it a moment too long, turns away, and makes a quiet phone call. He comes back politer. BOARDED — 8 shots.",
    lightingNotes: "Ceiling fluorescent tubes, one visibly flickering, plus the flat monitor's glow on his face. No sodium in here; the station is its own climate.",
  },
  {
    key: "s6", id: "neonoire-s6", n: 6, partId: "neonoire-part-3",
    title: "The interview room", location: "INT. POLICE STATION, INTERVIEW ROOM", time: "MOMENTS LATER",
    kind: "Standard", lighting: "Practical night", slugline: "INT. POLICE STATION, INTERVIEW ROOM - MOMENTS LATER #6#",
    page: "n06-interview-room.md", board: "n06-interview-room.md",
    cast: ["Vera Voss", "Detective Ishida"],
    grammar: "One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.",
    description: "Moments later. Detective Ishida sets a paper cup of tea in front of Vera and offers her English. She answers in Japanese. He asks where she grew up, when she last saw her sister, whether the name Kanda means anything — and gets: three days ago, we had dinner, normal. He gives her his card and tells her to call at any hour. BOARDED — 9 shots.",
    lightingNotes: "One ceiling fixture and the frosted window's blue-grey rain light; the paper cup is the only warm note. No flicker in this room.",
  },
  {
    key: "s7", id: "neonoire-s7", n: 7, partId: "neonoire-part-3",
    title: "The detectives' room", location: "INT. POLICE STATION, DETECTIVES' ROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. POLICE STATION, DETECTIVES' ROOM - CONTINUOUS #7#",
    page: "n07-detectives-room.md", board: "n07-detectives-room.md",
    cast: ["Detective Ishida"],
    grammar: "Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.",
    description: "Continuous. Alone in the detectives' room, Ishida opens his bottom drawer: sealed in an evidence bag, Mara's purse — the torn strap coiled beside it, still damp. He looks at it a long moment. Closes the drawer. On the wall, the clock runs a minute fast. BOARDED — 6 shots.",
    lightingNotes: "Humming fluorescent rows, the desk lamp over the drawer, the radio's green dial. The evidence bag is lit plainly, like an exhibit.",
  },
];

export const ORDER = SCENES.map(scene => scene.page);
export const sceneById = key => SCENES.find(scene => scene.key === key || scene.id === key);

export const ACT = {
  id: actId,
  title: "The opening — Kanda to the detectives' room",
  description: "Seven scenes from the first draft's opening: a backstreet in Kanda at night, a small bar, Vera's apartment three days later, and a police station that already knows Mara's name. 67 numbered shots; every frame is a draft study, not approved coverage.",
  parts: [
    { id: "neonoire-part-1", title: "Kanda, night", description: "The cold open and the bar: the killing, the key, and the notebook that leaves with them." },
    { id: "neonoire-part-2", title: "Three days later", description: "Vera's apartment: two cups, one photograph, an answerphone message, and a blue umbrella that is still bone dry." },
    { id: "neonoire-part-3", title: "The police station", description: "A missing-person report, an interview in Japanese, and a drawer that closes on a wet purse." },
  ],
};

// ---------------------------------------------------------------------------------------------
// Reading the draft, and splitting it into the Screenplay tab's pages
// ---------------------------------------------------------------------------------------------

export const readFountain = root => readFileSync(resolve(root, FOUNTAIN), "utf8");

/** The `#1#` … `#7#` markers are the draft's scene numbering, not screenplay text. */
export const cleanScript = text => text.replace(/ #\d+#(?=\n|$)/g, "");

export const countMarkers = text => (text.match(/ #\d+#(?=\n|$)/g) || []).length;

/**
 * The draft's lines, split into one slice per scene. Scene 1 carries the title page, THE LOOK
 * and FADE IN as well as its own scene; every other slice begins at its own slugline.
 */
export function pages(fountain) {
  const lines = fountain.split("\n");
  const starts = SCENES.map(scene => {
    const at = lines.findIndex(line => line.trim() === scene.slugline);
    if (at < 0) throw new Error(`Neonoire_Opening.fountain no longer carries the slugline "${scene.slugline}"`);
    return at;
  });
  for (let i = 1; i < starts.length; i++) if (starts[i] <= starts[i - 1]) throw new Error("The draft's scenes are out of order");
  if (starts[0] < 0) throw new Error("The draft must open with a scene");
  // Scene 1's page also carries the title page, THE LOOK and FADE IN — everything the draft puts
  // above its first slugline belongs to the scene that follows it.
  return starts.map((from, i) => lines.slice(i === 0 ? 0 : from, starts[i + 1] ?? lines.length));
}

/** The production header a page adds above the draft's own words. */
export function pageHeader(scene) {
  const grammarLines = scene.grammar.match(/.{1,150}(\s|$)/g) || [scene.grammar];
  return [
    "NEONOIRE",
    `OPENING — SCENE ${scene.n} — ${scene.location}`,
    "",
    `${scene.location} - ${scene.time}`,
    `Source: the first draft's opening scenes (${FOUNTAIN}, September 2026), reproduced verbatim below its own heading.`,
    `Cast: ${scene.cast.length ? scene.cast.join(", ") : "— (no actors; the city carries the scene)"}.`,
    `Grammar: ${grammarLines.join("\n")}`,
    "",
  ].join("\n");
}

export function pageText(scene, lines) {
  return `${pageHeader(scene)}\n${lines.join("\n")}\n`;
}

/** What is left once a page's header is removed — the draft's own bytes. */
export function pageBody(text) {
  const lines = text.split("\n");
  const end = lines.findIndex((line, i) => i >= 4 && line.trim() === "");
  return lines.slice(end + 1).join("\n").trim();
}

// ---------------------------------------------------------------------------------------------
// The numbered shot boards
// ---------------------------------------------------------------------------------------------

const SHOT_TYPE_TOKEN = {
  "ESTABLISHING": "Establishing", "EXTREME WIDE": "Extreme wide", "WIDE": "Wide", "FULL": "Full",
  "MEDIUM WIDE": "Medium wide", "MEDIUM": "Medium", "MEDIUM CLOSE-UP": "Medium close-up",
  "CLOSE-UP": "Close-up", "EXTREME CLOSE-UP": "Extreme close-up", "OVER THE SHOULDER": "Over the shoulder",
  "TWO-SHOT": "Two-shot", "POV": "POV", "INSERT": "Insert", "AERIAL": "Aerial",
};
const MOVEMENT_TOKEN = {
  "static": "Static", "pan": "Pan", "tilt": "Tilt", "tracking": "Tracking", "dolly in": "Dolly in",
  "dolly out": "Dolly out", "crane up": "Crane up", "crane down": "Crane down", "handheld": "Handheld",
  "steadicam": "Steadicam", "orbit": "Orbit", "zoom in": "Zoom in", "zoom out": "Zoom out",
};
const ANGLE_TOKEN = {
  "eye level": "Eye level", "low angle": "Low angle", "high angle": "High angle",
  "dutch angle": "Dutch angle", "bird's eye": "Bird's eye", "worm's eye": "Worm's eye",
};
const LENS_TOKEN = ["14mm", "24mm", "35mm", "50mm", "85mm", "135mm", "Anamorphic"];
const LIGHT_TOKEN = ["Natural daylight", "Golden hour", "Blue hour", "Overcast soft", "Low key", "High key", "Practical night", "Backlit silhouette"];

const SHOT_HEADING = /^(\d+)\. ([A-Z][A-Z0-9' /-]*?) — (\d+mm|Anamorphic), ([a-z][a-z ]*?), ([a-z' ]+?) — (.+)$/;

/** The human name of a shot, taken from its keyframe filename: "14-she-kneels" → "She kneels". */
export const shotTitle = image => {
  const words = image.replace(/\.jpg$/, "").replace(/^\d+-/, "").replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * Reads one scene's numbered board. Everything the storyboard needs is in the document itself —
 * framing, lens, cast, light, duration, keyframe filename and the notes — so a shot cannot exist
 * in the app without its production direction travelling with it.
 */
export function parseBoard(markdown, scene) {
  const fields = ["SCRIPT", "CAST", "LIGHT", "TIME", "IMAGE", "NOTE"];
  const shots = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    const field = name => (current.fields[name] || "").trim();
    const image = field("IMAGE");
    const duration = Number(field("TIME"));
    if (!image) throw new Error(`Scene ${scene.n} shot ${current.n} has no IMAGE`);
    if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Scene ${scene.n} shot ${current.n} needs a positive TIME`);
    const prose = current.prose.map(line => line.trim()).filter(Boolean);
    if (!prose.length) throw new Error(`Scene ${scene.n} shot ${current.n} has no description`);
    shots.push({
      n: current.n, scene, shotType: current.shotType, lens: current.lens, movement: current.movement,
      angle: current.angle, image, title: shotTitle(image), duration,
      description: prose[0],
      script: field("SCRIPT").replace(/^"|"$/g, ""),
      cast: field("CAST") === "—" || !field("CAST") ? [] : field("CAST").split(",").map(name => name.trim()),
      lighting: field("LIGHT"),
      note: [field("NOTE"), ...prose.slice(1)].filter(Boolean).join("\n\n"),
    });
    current = null;
  };
  for (const line of markdown.split("\n")) {
    const heading = SHOT_HEADING.exec(line);
    if (heading) {
      flush();
      const [, n, type, lens, movement, angle] = heading;
      if (!SHOT_TYPE_TOKEN[type]) throw new Error(`Unknown shot type "${type}" in scene ${scene.n} shot ${n}`);
      if (!MOVEMENT_TOKEN[movement]) throw new Error(`Unknown movement "${movement}" in scene ${scene.n} shot ${n}`);
      if (!ANGLE_TOKEN[angle]) throw new Error(`Unknown angle "${angle}" in scene ${scene.n} shot ${n}`);
      if (!LENS_TOKEN.includes(lens)) throw new Error(`Unknown lens "${lens}" in scene ${scene.n} shot ${n}`);
      current = { n: Number(n), shotType: SHOT_TYPE_TOKEN[type], lens, movement: MOVEMENT_TOKEN[movement], angle: ANGLE_TOKEN[angle], fields: {}, prose: [] };
      continue;
    }
    if (!current) continue;
    const field = /^([A-Z]+): (.*)$/.exec(line);
    if (field && fields.includes(field[1])) { current.fields[field[1]] = field[2]; continue; }
    if (line.trim() === "---" || line.startsWith("|") || line.startsWith("## ")) { flush(); continue; }
    if (line.trim()) current.prose.push(line.trim());
  }
  flush();
  if (!shots.length) throw new Error(`Scene ${scene.n} has no numbered shots`);
  // Shot numbers run 1..67 straight through the opening, so a scene's board starts wherever the
  // scene before it stopped; the builder checks the run is unbroken across all seven.
  for (const [i, shot] of shots.entries()) {
    if (shot.n !== shots[0].n + i) throw new Error(`Scene ${scene.n} shot numbers must run contiguously from ${shots[0].n} (found ${shot.n} at position ${i + 1})`);
    if (!LIGHT_TOKEN.includes(shot.lighting)) throw new Error(`Scene ${scene.n} shot ${shot.n} has lighting "${shot.lighting}" outside the lighting library`);
    for (const name of shot.cast) if (!characters.some(c => c.name === name)) throw new Error(`Scene ${scene.n} shot ${shot.n} casts an unknown name: ${name}`);
  }
  return shots;
}

export const readBoard = (root, scene) => readFileSync(resolve(root, "docs", "neonoire", "scenes", scene.board), "utf8");
/** Whitespace-insensitive comparison, for quoting dialogue that the draft writes across lines. */
export const sameText = (a, b) => a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();
export const containsText = (haystack, needle) => haystack.replace(/\s+/g, " ").includes(needle.replace(/\s+/g, " ").trim());
export const imagePath = (scene, shot) => `/images/neonoire/${scene.key}/${shot.image}`;

/** The six ideas the workspace's brainstorm map starts from. */
export const brainstorm = [
  {
    id: "neonoire-brain-1", x: 60, y: 40, title: "The key",
    content: "A small numbered key on a worn plastic tag \u2014 a coin-locker key, pressed into Mara's palm by a dying man with the words don't let them have it. Never explained in the opening, and the reason she is running.",
    color: "rose", tags: ["Prop", "Engine"], connections: ["neonoire-brain-2", "neonoire-brain-4"], createdAt,
  },
  {
    id: "neonoire-brain-2", x: 430, y: 30, title: "Two positions",
    content: "First position done. Moving to second. Second position done. The men work to a list and the film never shows who writes it; the journalist in the bar was already on it, and he had a notebook.",
    color: "ink", tags: ["Antagonist", "Structure"], connections: ["neonoire-brain-1", "neonoire-brain-5"], createdAt,
  },
  {
    id: "neonoire-brain-3", x: 250, y: 210, title: "The city that lights them",
    content: "Sodium orange against sick fluorescent green: vending machines, shop signs, train windows, a CRT's blue flicker. The sky never does the work, and the rain turns everything black and reflective.",
    color: "sand", tags: ["Look", "Light"], connections: ["neonoire-brain-6"], createdAt,
  },
  {
    id: "neonoire-brain-4", x: 620, y: 190, title: "Mara, running",
    content: "Twenty-four, American, soaked flat, no umbrella, arms folded, halting Japanese. She declines a call, chooses not to run when every instinct says to, and takes the key anyway.",
    color: "sage", tags: ["Character", "Act one"], connections: ["neonoire-brain-1"], createdAt,
  },
  {
    id: "neonoire-brain-5", x: 60, y: 330, title: "Vera's two cups",
    content: "Three days later: one cup of cold tea, one empty and clean, set out as though someone is expected. The answerphone message is an apology, and the umbrella in the stand has never been wet.",
    color: "clay", tags: ["Character", "Sound"], connections: ["neonoire-brain-2"], createdAt,
  },
  {
    id: "neonoire-brain-6", x: 470, y: 350, title: "A clock a minute fast",
    content: "The station is a decade out of step: faded posters, a fax machine beside a flat monitor, and a clock that runs a minute fast. Ishida gives Vera his card at any hour and then closes a drawer on her sister's purse.",
    color: "ink", tags: ["Police", "Institution"], connections: ["neonoire-brain-3", "neonoire-brain-2"], createdAt,
  },
];
