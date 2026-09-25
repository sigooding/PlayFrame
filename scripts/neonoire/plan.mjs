// Hand-authored production metadata for NEONOIRE — the final feature screenplay.
//
// The draft itself lives at the repository root (Neonoire (3).fountain) and is never edited
// here. This module knows only three things: who is in the film, how the draft is split into the
// Screenplay tab's pages — one per numbered scene — and how a numbered shot board in
// docs/neonoire/scenes/ is read. The final screenplay carries 100 scenes; scenes 1–7 and 72–84 are
// boarded, and every scene arrives in the workspace verbatim, whether or not a board has reached
// it. Dialogue and action are always quoted from the fountain, never retyped.
//
//   npm run build:neonoire     rebuild public/projects/neonoire-opening.json
//   node scripts/neonoire/split-opening.mjs   regenerate the screenplay pages
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const projectId = "74a9cb34-9e80-4a04-a614-000000000065";
export const actId = "neonoire-opening";
export const createdAt = "2026-09-24T00:00:00.000Z";
export const FOUNTAIN = "Neonoire (3).fountain";

export const characterId = key => `neonoire-${key}`;

/**
 * The look of the film, in the film's own words. Every frame's notes carry this, so the prompt
 * studio and any later AI pass starts from the draft rather than from a mood.
 */
export const grammar =
  "Tokyo as a memory that is still happening. The city lights the characters, not the sky: vending machines, shop signs, train windows, fluorescent tubes. Sodium orange against a sick fluorescent green. Soft halation around every light, blacks slightly crushed. It should look like film, and feel like something remembered. Rain is never glamorous — no lightning, no storms, cold, steady, patient rain that turns the streets black and reflective. Wide and patient; close-ups are rare, so they count. Nothing is explained.";

const cast = [
  ["mara", "Mara Voss", "Protagonist", "24", "American. Twenty-four, in Kanda by chance on the wrong night: she declines her sister's call, watches a man shot in the rain, takes a coin-locker key out of his hand and the killers' attention with it. Hair soaked flat, held back by a cheap enamel clip shaped like a small red bird; arms folded, no umbrella. Speaks halting Japanese. Has been crying, or is about to.", ["Guarded", "Quick", "Unready"], "sage", "mara"],
  ["vera", "Vera Voss", "Co-lead", "29", "American. Twenty-nine, Mara's older sister, three days behind her and always one step behind the police. Her Japanese is fluent, careful and slightly formal — learned as a child, relearned as an adult. She sets two cups on a table for one and takes her sister's blue umbrella to a police station counter.", ["Careful", "Steady", "Alone"], "sand", "vera"],
  ["jack", "Jack", "Private investigator / former detective", "48", "A Tokyo private investigator and former police detective; the screenplay gives no surname. Visual casting choice (recast 25 September 2026): a white American, tall and lean, long angular face, hollow cheeks, deep-set tired grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble. Quietly cool, not an action hero. A good but badly kept charcoal knee-length overcoat, off-white open-collar shirt, black trousers, worn black shoes; no tie, hat or cigarette. After the Hive he stays soaked, hands unwashed, through scene 77. Not the sisters' father: that is Daniel Voss.", ["Understated", "Guarded", "Compromised"], "clay", "jack"],
  ["daniel", "Daniel Voss", "The father / family photograph", "41, twenty years ago", "American insurance investigator, Vera and Mara's father. The scene 11 newspaper clipping identifies him as Daniel Voss, 41; the man in the warm faded photograph on Vera's shelf is Daniel, not Jack. A rumpled grey suit, a smile, both small daughters' hands in his and a Tokyo noodle-shop sign behind them, twenty years ago. Jack appears with him in a separate older photograph and was his friend, not a member of the Voss family.", ["Warm", "Principled", "Absent"], "sand", undefined],
  ["old-man", "The Old Man", "Cold open", "70s", "Japanese. Seventies, cheap raincoat, one hand pressed to his side as if something is hidden there. He keeps looking back, stops without turning round, says twenty years to himself, and gives a stranger a key with his last strength. Unnamed in the opening.", ["Hunted", "Resigned", "Deliberate"], "sand", undefined],
  ["masked-men", "The Masked Men", "Cold open", "30s to 40s", "Two men in black clothes and plain masks who do not run. They touch earpieces and report positions: first position done, moving to second. Their work is ordinary to them, and the film never shows a face under the masks — only eyes, and shoes, and a torch beam finding a purse in a puddle.", ["Methodical", "Unhurried", "Bored"], "rose", undefined],
  ["journalist", "The Journalist", "Cold open", "40s", "An untouched beer, a closed notebook, a watched door — and one question asked off camera: where is he. He is killed four shots later and his notebook leaves with the men who did it. Unnamed in the opening; he speaks Japanese.", ["Waiting", "Private", "Unlucky"], "clay", undefined],
  ["young-officer", "The Young Officer", "Front counter", "20s", "Takes a missing-person report with polite boredom until the name Mara Voss comes up on the monitor. Then he turns away from her and makes a quiet phone call, and comes back politer than he was. Unnamed in the opening.", ["Polite", "Bored", "Changed"], "sand", "young-officer"],
  ["ishida", "Detective Ishida", "Police", "50s", "Gentle, unhurried, tired in a way that looks like decency, with excellent English he offers as a courtesy. He asks about Kanda, gives Vera his card and tells her to call at any hour — then opens a drawer with her sister's purse in it and closes it again.", ["Kind", "Unhurried", "Deciding"], "sage", "ishida"],
  ["okada", "Okada", "Bar owner", "60s", "Japanese. Sixties, the owner of the small Kanda bar where the journalist died. Gaunt, close-cropped white hair, a lined tired face, a white shirt with the sleeves rolled and a dark navy apron. He kept Sakai's cassette in the tray of his cash drawer. When he sees Jack's face and hands he doesn't ask; he pours two glasses instead. No identity sheet yet: held to the scene 81 master.", ["Discreet", "Loyal", "Weary"], "sand", undefined],
  ["harada", "Harada", "Editor, Toto Shimbun", "50s", "Japanese. Fifties, the editor of the Toto Shimbun; the dead journalist was her reporter. Grey hair in a short bob, reading glasses, a white blouse with the sleeves rolled. She presses PLAY, names Kurose, warns Jack he will be named, and opens a notebook to a clean page. No identity sheet yet: held to the scene 82 master.", ["Exacting", "Grieving", "Resolute"], "sage", undefined],
  ["kurose", "Kurose", "Chairman, Kurose Development", "70s", "Japanese. Seventies, the chairman of Kurose Development, whose redevelopment model puts a fountain where the Hive stands. Silver hair combed back, a beautiful dark navy suit, the stillness of a man who has never had to hurry. His English is perfect and old-fashioned. Courteous and curious, he pours the tea himself. Good men are very expensive. No identity sheet yet: held to the scene 83 master.", ["Courteous", "Patient", "Ruthless"], "rose", undefined],
];

export const characters = cast.map(([key, name, role, age, description, traits, color, sheet]) => ({
  id: characterId(key), name, role, age, description, traits, color, createdAt,
  ...(sheet ? { image: `/images/neonoire/sheets/${sheet}.jpg` } : {}),
  relations: [],
}));
characters.find(c => c.id === characterId("daniel")).image = "/images/neonoire/s4/35-the-photograph.jpg";
characters.find(c => c.id === characterId("okada")).image = "/images/neonoire/s81/100-the-bar-in-daylight.jpg";
characters.find(c => c.id === characterId("harada")).image = "/images/neonoire/s82/104-the-newsroom.jpg";
characters.find(c => c.id === characterId("kurose")).image = "/images/neonoire/s83/110-very-expensive.jpg";

const link = (a, b, kind, note) => {
  characters.find(c => c.id === characterId(a)).relations.push({ id: `neonoire-link-${a}-${b}`, targetId: characterId(b), kind, note });
  characters.find(c => c.id === characterId(b)).relations.push({ id: `neonoire-link-${b}-${a}`, targetId: characterId(a), kind: ({ Parent: "Child", Child: "Parent" })[kind] || kind, note });
};
link("vera", "mara", "Sibling", "Three days of unanswered calls, and an umbrella left in a stand.");
link("mara", "daniel", "Parent", "Daniel Voss is her father; the warm family photograph is twenty years old.");
link("vera", "daniel", "Parent", "Daniel Voss is her father, identified by the scene 11 clipping, not Jack.");
link("jack", "daniel", "Friend", "The investigator and the younger police detective at Kaneko's counter, twenty years ago.");
link("vera", "jack", "Ally", "Client and investigator, drawn to each other; his silence makes the promised dinner a betrayal. Not family.");
link("mara", "jack", "Ally", "He hides her in the Hive and carries a promise he cannot explain to Vera.");
link("jack", "ishida", "Colleague", "Former police colleagues; old loyalties and the case divide them.");
link("jack", "okada", "Ally", "He kept Sakai's cassette in his cash drawer, and hands it over without asking what happened.");
link("harada", "journalist", "Colleague", "Her reporter, killed in Okada's bar; his photograph stays on her desk.");
link("vera", "kurose", "Enemy", "Her father wrote his name on every page; she goes to his office to see his face.");
link("jack", "harada", "Ally", "He brings her the tape and offers himself as the witness: start with my part.");

// ---------------------------------------------------------------------------------------------
// The boarded scenes, in the draft's own running order — the opening seven, and the first
// scenes of the film proper (the hotel and Tokyo streets, 72–76, the envelope and the notebook, 77–79, and Jack and Ishida, 80). Boarded metadata is hand-authored here;
// location, time and slugline are re-derived from the draft at build time and must match.
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
    description: "Cold open. Rain in a Kanda backstreet. Mara declines her sister's call, ducks into the doorway of a closed barbershop, and watches two masked men shoot an old man without hurrying — then kneels beside him and takes a coin-locker key out of his hand. BOARDED — 18 shots. The draft's own scene 1; nothing is explained, and nobody names the key.",
    lightingNotes: "The vending machine is the brightest source in the film's first minute. Sodium orange street lamps, one cold white vending machine, green fluorescent spill at the corner. No white beams in frame, ever.",
  },
  {
    key: "s2", id: "neonoire-s2", n: 2, partId: "neonoire-part-1",
    title: "The small bar", location: "INT. SMALL BAR, KANDA", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. SMALL BAR, KANDA - CONTINUOUS #2#",
    page: "n02-small-bar.md", board: "n02-small-bar.md",
    cast: ["Mara Voss", "The Journalist", "The Masked Men"],
    grammar: "The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.",
    description: "Continuous. Mara hides behind the far end of the counter with the key in her fist. Two pairs of wet black shoes come in softly, ask where is he, and shoot the journalist on the far side of the counter while the television audience laughs. The notebook leaves with them. BOARDED — 10 shots, ending on the blue TV glow and the title card.",
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
    cast: ["Vera Voss", "Daniel Voss", "Mara Voss"],
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
    description: "Moments later. Detective Ishida sets a paper cup of tea in front of Vera and offers her English. She answers in Japanese. She answers in Japanese and asks twice what is on the screen. He asks his own questions instead — where she grew up, when she last saw her sister, whether the name Kanda means anything — until the news arrives in her face and she asks whether her sister is dead. He has no reason to believe she is. The cup crumples in her fist; he offers a tissue, answers her in Japanese for the first time, and tells her the safest thing she can do is nothing. Then his card, across a wet table. BOARDED — 12 shots.",
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
  {
    key: "s72", id: "neonoire-s72", n: 72, partId: "neonoire-part-feature",
    title: "The call", location: "INT. HOTEL LOUNGE", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. HOTEL LOUNGE - NIGHT #72#",
    page: "n72-hotel-lounge-night.md", board: "n72-hotel-lounge.md",
    cast: ["Vera Voss"],
    grammar: "Tokyo Story in colour: low, level, static 50mm. Vera pretty, dry and intact until rain. No push-in; piano plays; umbrella stays.",
    description: "Late in the Showa hotel lounge, Vera waits in her mother's wine-red silk dress, groomed and dry with intact makeup. Ishida calls: Mara has died and Jack had been hiding her. The phone lowers. She walks out carefully, leaving the pale-blue umbrella at the next stool. BOARDED — 2 shots (69–70), both generated in the Tokyo Story colour revision.",
    lightingNotes: "Amber table lamp and bottle-shelf practicals, muted olive walls, brass and walnut. Rain stays outside the window. No cold street light or wet makeup on Vera inside; no glamour fill or spotlight.",
  },
  {
    key: "s73", id: "neonoire-s73", n: 73, partId: "neonoire-part-feature",
    title: "Vera runs", location: "EXT. TOKYO STREETS", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. TOKYO STREETS - NIGHT #73#",
    page: "n73-tokyo-streets-night.md", board: "n73-tokyo-streets.md",
    cast: ["Vera Voss"],
    grammar: "Tokyo Story in colour: low, level, static 50mm. Rain undoes makeup; right shoe lost, left shoe stays. No tracking or score.",
    description: "Vera leaves the hotel and runs badly through cold rain, no coat or umbrella, in a wine-red silk calf-length dress. Her hair plasters to her face and her carefully applied mascara begins to run. An ivory vending machine lights the street without caring. At the red crossing she loses her RIGHT red court shoe and continues with the LEFT shoe on. BOARDED — 4 shots (71–74); all four regenerated in the Tokyo Story colour revision.",
    lightingNotes: "Warm hotel doorway falls away; cold-white ivory vending machine, faint distant sodium amber and a small red crossing signal. Fine steady rain, black asphalt, muted olive shutters. No moonlight, sky fill, glossy neon or rain glamour.",
  },
  {
    key: "s74", id: "neonoire-s74", n: 74, partId: "neonoire-part-feature",
    title: "The empty street", location: "EXT. EMPTY STREET UNDER THE TRACKS", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. EMPTY STREET UNDER THE TRACKS - NIGHT #74#",
    page: "n74-empty-street-under-the-tracks-night.md", board: "n74-empty-street-under-the-tracks.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "Tokyo Story in colour: static 50mm; approach, blows, collapse, rejection. 35mm aftermath wide; ambiguous reflection. Late score.",
    description: "Under the railway, Vera meets Jack, the 48-year-old former detective, not her father. His charcoal coat is soaked, hands dark and unwashed. She approaches, hits his chest, folds to her knees, briefly grasps his coat and pushes him away. She sits; he kneels a few feet apart, not touching. A reflection almost suggests a pale-blue umbrella. BOARDED — 4 shots (75–78), reordered to follow the dramatic action; all four generated, the twenty-metre stop now staged at distance in the keyframe.",
    lightingNotes: "Same two cold ivory vending machines on the left, shallow corrugated awning on the right and grey shutters under riveted railway beams. Machine-white columns of steady rain, faint distant amber, a ribbon of train windows. No overhead film light, sky fill, monochrome grade or heroic rim light.",
  },
  {
    key: "s75", id: "neonoire-s75", n: 75, partId: "neonoire-part-feature",
    title: "Still frames — what the night left", location: "INT./EXT. VARIOUS", time: "NIGHT - SERIES OF SHOTS",
    kind: "Montage", lighting: "Practical night", slugline: "INT./EXT. VARIOUS - NIGHT - SERIES OF SHOTS #75#",
    page: "n75-ext-various-night-series-of-shots.md", board: "n75-still-frames.md",
    cast: [],
    grammar: "Five static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. Then black.",
    description: "Five still frames, no people: Vera's single red shoe in its puddle; the same hotel lounge empty, chairs up, the pale-blue umbrella by the stool; the intact closed Hive; the same vending machine waiting for nobody; a television showing static. BOARDED — 5 shots (79–83); all five generated. No black-and-white treatment and no early demolition.",
    lightingNotes: "Each still keeps its own ordinary practical: machine-white puddle light, the lounge's one amber lamp, a dim old sign, the grey CRT. Muted natural colour, no spotlit product look; no person or reflected silhouette.",
  },
  {
    key: "s76", id: "neonoire-s76", n: 76, partId: "neonoire-part-feature",
    title: "The lighter", location: "INT. VERA'S APARTMENT", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. VERA'S APARTMENT - NIGHT #76#",
    page: "n76-vera-s-apartment-night.md", board: "n76-vera-apartment.md",
    cast: ["Vera Voss"],
    grammar: "The same room as scene 4, now dark: rain on the glass, one street-lit plane of the window, nothing switched on. The room's geography and the removed paper pendant stay as in the apartment revision. The lighter is the only object the scene owns; it must look handled, not precious.",
    description: "Night, later. In the dark apartment, Vera sits on the floor with her back against the bed — still in the ruined red dress, mascara dried, one shoe — with Jack's old steel lighter in her hand. She opens it, closes it, opens it. She should throw it away; she holds it against her chest instead, and bends over it, and cries without making a sound. She still loves him; she hates herself for it. BOARDED — 3 shots (84–86), existing images unchanged; the scene the opening's answerphone was pointed at.",
    lightingNotes: "No practicals on: cold window light and the landing's spill under the door only. The lighter's small flame is the one warm note, briefly, and then the dark takes it back.",
  },
  {
    key: "s77", id: "neonoire-s77", n: 77, partId: "neonoire-part-feature",
    title: "The envelope", location: "INT. JACK'S OFFICE", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. JACK'S OFFICE - NIGHT #77#",
    page: "n77-jack-s-office-night.md", board: "n77-jacks-office.md",
    cast: ["Jack"],
    grammar: "One room, one lamp, CRT static. Static, level cameras: 35mm room, 50mm desk insert, 85mm pen. Jack still soaked, hands unwashed. The envelope gets no name.",
    description: "Night. Jack sits in his wet coat at the desk under the lamp, the TV playing static, hands still unwashed. Vera's voice from the noodle counter replays. He puts Daniel Voss's notebook into a clean envelope, holds a pen over it for a long time, and writes nothing. BOARDED — 3 shots (87–89); Jack's office established here as the master, with Jack recast as a white American.",
    lightingNotes: "Green-shaded brass desk lamp is the only warm source; the CRT's grey static flickers on the filing cabinets; rain and the elevated line's lit windows through the blinds. No overhead light.",
  },
  {
    key: "s78", id: "neonoire-s78", n: 78, partId: "neonoire-part-feature",
    title: "No name", location: "EXT. VERA'S APARTMENT BUILDING, CORRIDOR", time: "DAWN",
    kind: "Standard", lighting: "Blue hour", slugline: "EXT. VERA'S APARTMENT BUILDING, CORRIDOR - DAWN #78#",
    page: "n78-vera-s-apartment-building-corridor-dawn.md", board: "n78-veras-corridor.md",
    cast: ["Vera Voss"],
    grammar: "Grey dawn on the third-floor walkway, rain dripping from the railing. 35mm wide, 50mm doormat, 85mm name. Vera barefoot, still in the red dress, unslept.",
    description: "Dawn. Vera opens her door onto the open-air walkway, still in the red dress, unslept. On the doormat, a plain envelope with no name. Inside, the cloth-covered notebook — and inside its cover, DANIEL VOSS. BOARDED — 3 shots (90–92).",
    lightingNotes: "Flat grey-blue dawn, no sun; one fluorescent fitting still on over a door. Wet concrete, rusted railing, the elevated line beyond.",
  },
  {
    key: "s79", id: "neonoire-s79", n: 79, partId: "neonoire-part-feature",
    title: "Her father's handwriting", location: "INT. VERA'S APARTMENT", time: "CONTINUOUS",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. VERA'S APARTMENT - CONTINUOUS #79#",
    page: "n79-vera-s-apartment-continuous.md", board: "n79-veras-apartment-dawn.md",
    cast: ["Vera Voss"],
    grammar: "The scene 4 room in grey dawn, nothing switched on, two empty cups. Daniel's voice-over carries the pages; the images never illustrate them.",
    description: "Continuous. At the low table in the dawn light, beside the two cups from the beginning of the film, both empty now, Vera reads her father's notebook: Shiohama, Kurose, and the young detective they called Jack who signed the report. She closes it and holds it against her chest. BOARDED — 3 shots (93–95).",
    lightingNotes: "Window light only, grey-blue; lamp and CRT off; the umbrella stand empty. The red dress is the only warm colour.",
  },
  {
    key: "s80", id: "neonoire-s80", n: 80, partId: "neonoire-part-feature",
    title: "Where to find them", location: "INT. POLICE STATION, DETECTIVES' ROOM", time: "DAY",
    kind: "Standard", lighting: "Natural daylight", slugline: "INT. POLICE STATION, DETECTIVES' ROOM - DAY #80#",
    page: "n80-police-station-detectives-room-day.md", board: "n80-detectives-room-day.md",
    cast: ["Jack", "Detective Ishida"],
    grammar: "Scene 7's room by day, full of watching detectives. 24mm in and out on one locked aisle camera; 50mm two-shot; 85mm hands and Ishida. He doesn't hit him.",
    description: "Day. Jack, unshaven, dried blood in his knuckles, walks the length of the detectives' room to Ishida's desk. Nine o'clock, a grey car, your driver: only you knew. Ishida: you always tell the wrong person; he never killed anyone, he only told people where to find them. The room waits for Jack to hit him. He doesn't. He walks away past the clock, and for the first time Ishida looks afraid. BOARDED — 6 shots (96–101).",
    lightingNotes: "Flat grey daylight through rain-streaked windows at right, mixed with the green-white fluorescent tubes. The same single black-rim clock above the rear door; the same green-dial radio on Ishida's desk.",
  },
  {
    key: "s81", id: "neonoire-s81", n: 81, partId: "neonoire-part-feature",
    title: "Without a toast", location: "INT. SMALL BAR, KANDA", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. SMALL BAR, KANDA - DAY #81#",
    page: "n81-small-bar-kanda-day.md", board: "n81-small-bar-day.md",
    cast: ["Jack", "Okada"],
    grammar: "Scene 2's bar by grey daylight, chairs up and the CRT dark. 35mm master, 50mm across the counter, 85mm on the tape. Nobody asks and nobody answers.",
    description: "Day. The bar with its chairs on the tables. Okada sees Jack's face and hands and doesn't ask; he lifts the tray out of the cash drawer and hands him the cassette. The girl? Jack can't answer. Two small glasses, drunk together without a toast. BOARDED — 4 shots (102–105).",
    lightingNotes: "Flat grey daylight from the street window at right; no practicals on, the CRT off. Amber only in the bottles.",
  },
  {
    key: "s82", id: "neonoire-s82", n: 82, partId: "neonoire-part-feature",
    title: "Start with my part", location: "INT. TOTO SHIMBUN NEWSROOM", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. TOTO SHIMBUN NEWSROOM - DAY #82#",
    page: "n82-toto-shimbun-newsroom-day.md", board: "n82-newsroom-day.md",
    cast: ["Jack", "Harada", "The Journalist"],
    grammar: "An old paper office through one locked 24mm camera that opens and closes the scene; 50mm at the desk, 85mm for PLAY and for Harada. We don't hear his testimony.",
    description: "Day. The Toto Shimbun newsroom; in the glass office, Harada, the dead journalist's photograph on her desk. She plays the tape: Sakai, and Kurose, twenty years younger — then it will be empty in a different way. Jack offers himself as the witness: start with my part. She opens a notebook. Through the glass, a man for the first time in twenty years not silent. BOARDED — 5 shots (106–110).",
    lightingNotes: "Green-white fluorescent tubes and grey window light, rain on the glass; three TVs flicker on the walls.",
  },
  {
    key: "s83", id: "neonoire-s83", n: 83, partId: "neonoire-part-feature",
    title: "It's just a face", location: "INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT - DAY #83#",
    page: "n83-chairman-s-office-kurose-development-day.md", board: "n83-kurose-office-day.md",
    cast: ["Vera Voss", "Kurose"],
    grammar: "The fortieth floor by rainy day: 24mm room, 85mm faces, 50mm when she stands and when he reaches for the phone. She never touches the tea.",
    description: "Day. The fortieth floor, rain on the glass. Vera, in a plain dark coat with her father's notebook on her lap, sits across from Kurose, who pours her tea himself. Good men are very expensive. What is it you want? I wanted to see your face. It's just a face. She shows him the notebook, looks down at the model of the redevelopment, the fountain where the Hive is — it's very clean — and goes. Kurose presses a button: follow her. BOARDED — 6 shots (111–116).",
    lightingNotes: "Flat grey rain light through glass on three sides; no practicals. The white model is the brightest thing in the room.",
  },
  {
    key: "s84", id: "neonoire-s84", n: 84, partId: "neonoire-part-feature",
    title: "Three feet away", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - NIGHT #84#",
    page: "n84-the-hive-noodle-shop-storeroom-night.md", board: "n84-hive-storeroom-night.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "One bare bulb. 24mm room, 50mm at the drawing, 35mm for the two of them, 85mm when the voice comes. Neither crosses the floor.",
    description: "Night. Jack, grey with exhaustion, hiding in the storeroom since the newspaper. Kaneko brings Vera. On the wall, Mara's sketches: the counter from behind the curtain, the back of a head on the third stool. That's me. Three feet away. We were both wrong. He didn't blame you. A train passes; the bulb swings; in the passage outside a man murmurs into his sleeve: position. BOARDED — 4 shots (117–120).",
    lightingNotes: "A single bare tungsten bulb, swinging when the train passes; everything else falls to black.",
  },
];

/**
 * Every scene of the final screenplay. The draft marks each of its scenes with a trailing
 * ` #n#` marker; those markers are read straight off the fountain, so a scene the board has
 * not reached yet still exists in the workspace as *written, not boarded*. The seven opening
 * scenes keep their hand-authored board metadata; everyone else is derived, mechanically and
 * honestly, from the slugline itself.
 */
const MARKED_SLUG = /^(INT|EXT)[. ][A-Z0-9'’ /&().,-]+ - [A-Z][A-Z0-9'’ .,-]*#\d+#$/;

export const sceneMarkers = fountain => {
  const found = [];
  fountain.split("\n").forEach((line, i) => {
    const m = MARKED_SLUG.exec(line.trim());
    if (m) found.push({ n: Number(/ #(\d+)#$/.exec(line.trim())[1]), line: i, text: line.trim() });
  });
  return found;
};

/** "INT. SMALL BAR, KANDA" → "Small bar, Kanda" — capitalised after the comma and for possessives. */
export const humanTitle = location => {
  const core = location.replace(/^(?:INT|EXT)\.?\s*\/?\s*(?:INT|EXT)\.?\s*/i, "");
  let capNext = true;
  return core.toLowerCase().split(/([ ,.;-]+)/).filter(Boolean).map(word => {
    if (/^[ ,.;-]+$/.test(word)) { if (word.startsWith(",")) capNext = true; return word; }
    const out = (capNext || /^\w+'s?$/.test(word)) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    if (capNext) capNext = false;
    return out;
  }).join("");
};

const pageSlug = text => text.replace(/^(?:INT|EXT)\.?\s*/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const lightingForTime = time => (/NIGHT/.test(time) ? "Practical night" : /DAY/.test(time) ? "Natural daylight" : /DUSK|DAWN/.test(time) ? "Blue hour" : undefined);

export function featureScenes(fountain) {
  const lines = fountain.split("\n");
  const marks = sceneMarkers(fountain);
  if (!marks.length) throw new Error(`${FOUNTAIN} carries no numbered scenes — every scene heading must end with its " #n#" marker.`);
  marks.forEach((mark, i) => {
    if (mark.n !== i + 1) throw new Error(`${FOUNTAIN} scene markers must run 1..N in order; scene ${i + 1} is marked #${mark.n}#`);
  });
  const straySlug = lines.findIndex(line => /^(INT|EXT)[. ].* - /.test(line.trim()) && !/ #\d+#$/.test(line.trim()));
  if (straySlug >= 0) throw new Error(`${FOUNTAIN} line ${straySlug + 1} reads like a scene heading but carries no " #n#" marker — mark it, or the Screenplay tab loses a scene.`);
  return marks.map((mark, i) => {
    const bare = mark.text.replace(/ #\d+#$/, "");
    const at = bare.indexOf(" - ");
    const derived = { n: mark.n, location: bare.slice(0, at), time: bare.slice(at + 3), slugline: mark.text, line: mark.line };
    const hand = SCENES.find(scene => scene.n === mark.n);
    if (hand) {
      if (hand.location !== derived.location || hand.time !== derived.time) throw new Error(`The boarded scene ${hand.n} no longer matches ${FOUNTAIN}: the draft says "${derived.location} - ${derived.time}", the board says "${hand.location} - ${hand.time}".`);
      return { ...hand, ...derived, boarded: true };
    }
    const opener = (lines.slice(mark.line + 1).find(line => line.trim()) || "").trim().replace(/\s+/g, " ");
    const quote = opener.length > 180 ? `${opener.slice(0, 177).trimEnd()}…` : opener;
    return {
      ...derived,
      boarded: false,
      key: `s${mark.n}`, id: `neonoire-s${mark.n}`, partId: "neonoire-part-feature",
      title: humanTitle(derived.location),
      kind: "Standard",
      ...(lightingForTime(derived.time) ? { lighting: lightingForTime(derived.time) } : {}),
      page: `n${String(mark.n).padStart(2, "0")}-${pageSlug(bare)}.md`,
      board: null, cast: [],
      grammar: grammar,
      description: `WRITTEN, NOT BOARDED — no numbered shot board yet. Scene ${mark.n} of the final screenplay; the Screenplay tab carries its page, and the board covers selected scenes elsewhere. ${quote ? `The draft opens it: "${quote}".` : ""}`.trim(),
      lightingNotes: undefined,
    };
  });
}

export const ORDER = SCENES.map(scene => scene.page);
export const sceneById = key => SCENES.find(scene => scene.key === key || scene.id === key);

export const ACT = {
  id: actId,
  title: "The screenplay — Kanda to the new counter",
  description: "The final feature draft, scene by scene: the opening in Kanda and the police station, then the film proper. 120 numbered shots cover scenes 1–7 and 72–84; the other 80 scenes arrive written, not boarded.",
  parts: [
    { id: "neonoire-part-1", title: "Kanda, night", description: "The cold open and the bar: the killing, the key, and the notebook that leaves with them." },
    { id: "neonoire-part-2", title: "Three days later", description: "Vera's apartment: two cups, one photograph, an answerphone message, and a blue umbrella that is still bone dry." },
    { id: "neonoire-part-3", title: "The police station", description: "A missing-person report, an interview in Japanese, and a drawer that closes on a wet purse." },
    { id: "neonoire-part-feature", title: "The film proper", description: "Scenes 8–100 of the final screenplay — the key's price, the Hive, Kurose, the roadside inn, the long collapse, and a new counter under the railway. Scenes 72–84 are boarded; the rest are written, not yet boarded." },
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
 * The draft's lines, split into one slice per numbered scene. Scene 1 carries the title page,
 * THE LOOK and FADE IN as well as its own scene; every other slice begins at its own slugline
 * and runs to the line before the next one, so the slices partition the draft exactly and the
 * pages can rebuild it byte for byte.
 */
export function pages(fountain) {
  const lines = fountain.split("\n");
  const starts = sceneMarkers(fountain).map(mark => mark.line);
  if (!starts.length) throw new Error(`${FOUNTAIN} carries no numbered scene headings`);
  for (let i = 1; i < starts.length; i++) if (starts[i] <= starts[i - 1]) throw new Error("The draft's scenes are out of order");
  // Scene 1's page also carries the title page, THE LOOK and FADE IN — everything the draft puts
  // above its first slugline belongs to the scene that follows it.
  return starts.map((from, i) => lines.slice(i === 0 ? 0 : from, starts[i + 1] ?? lines.length));
}

/** The production header a page adds above the draft's own words. */
export function pageHeader(scene) {
  const grammarLines = scene.grammar.match(/.{1,150}(\s|$)/g) || [scene.grammar];
  return [
    "NEONOIRE",
    `${scene.boarded && scene.n <= 7 ? "OPENING" : "SCREENPLAY"} — SCENE ${scene.n} — ${scene.location}`,
    "",
    `${scene.location} - ${scene.time}`,
    `Source: the final screenplay (${FOUNTAIN}, September 2026), reproduced verbatim below its own heading.${scene.boarded ? "" : " Written, not boarded: the numbered shot board covers the opening scenes only."}`,
    `Cast: ${scene.cast.length ? scene.cast.join(", ") : scene.boarded ? "— (no people)" : "— (not boarded; the draft names its own cast)"}.`,
    `Grammar: ${grammarLines.join("\n")}`,
    "",
  ].join("\n");
}

export function pageText(scene, lines) {
  return `${pageHeader(scene)}\n${lines.join("\n")}\n`;
}

/**
 * What is left once a page's header is removed — the draft's own bytes, trailing blank lines
 * and all, so joining the page bodies with a single newline rebuilds the fountain exactly.
 */
export function pageBody(text) {
  const lines = text.split("\n");
  const end = lines.findIndex((line, i) => i >= 4 && line.trim() === "");
  return lines.slice(end + 1).join("\n").replace(/\n$/, "");
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
  "eye level": "Eye level", "low level": "Low, level", "low angle": "Low angle", "high angle": "High angle",
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
  const fields = ["SCRIPT", "CAST", "LIGHT", "TIME", "IMAGE", "NOTE", "ID"];
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
      n: current.n, id: field("ID") || `neonoire-shot-${String(current.n).padStart(2, "0")}`, scene, shotType: current.shotType, lens: current.lens, movement: current.movement,
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
  // Shot numbers run 1..68 straight through the opening, so a scene's board starts wherever the
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
    content: "Twenty-four, American, soaked flat, a cheap enamel red-bird clip holding her hair back, no umbrella, arms folded, halting Japanese. She declines a call, chooses not to run when every instinct says to, and takes the key anyway.",
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
