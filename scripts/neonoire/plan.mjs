// Hand-authored production metadata for NEONOIRE — the final feature screenplay.
//
// The draft itself lives at the repository root (Neonoire (3).fountain) and is never edited
// here. This module knows only three things: who is in the film, how the draft is split into the
// Screenplay tab's pages — one per numbered scene — and how a numbered shot board in
// docs/neonoire/scenes/ is read. The revised final screenplay carries 102 scenes — 96 numbered (13, 24, 97 and 99 were
// cut on 30 September 2026 and their numbers stay retired; scene numbers never move) and six
// inserted — and every scene arrives in the workspace verbatim, whether or not a board has
// reached it. Dialogue and action are always quoted from the fountain, never retyped.
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
  ["vera", "Vera Voss", "Co-lead", "29", "American. Twenty-nine, Mara's older sister, three days behind her and always one step behind the police. Her Japanese is fluent, careful and slightly formal — learned as a child, relearned as an adult. She sets two cups on a table for one and takes her sister's blue umbrella to a police station counter. Wardrobe: charcoal coat (sheets/vera.jpg), the red dress in 72–79, then a new coat per look: ink-navy Look C in 83–92, a short oatmeal car coat (Look E, sheets/vera-look-e.jpg) in 98, a teal peacoat in 100; the red bird clip (Look F) returns to her from 98 on. The olive Look D she was boarded in for the ground-breaking (97) was retired with the scene.", ["Careful", "Steady", "Alone"], "sand", "vera"],
  ["jack", "Jack", "Private investigator / former detective", "48", "A Tokyo private investigator and former police detective; the screenplay gives no surname. Visual casting choice (recast 25 September 2026): a white American, tall and lean, long angular face, hollow cheeks, deep-set tired grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble. Quietly cool, not an action hero. A good but badly kept charcoal knee-length overcoat, off-white open-collar shirt, black trousers, worn black shoes; no tie, hat or cigarette. After the Hive he stays soaked, hands unwashed, through scene 77. Not the sisters' father: that is Daniel Voss.", ["Understated", "Guarded", "Compromised"], "clay", "jack"],
  ["daniel", "Daniel Voss", "The father / family photograph", "41, twenty years ago", "American insurance investigator, Vera and Mara's father. The scene 11 newspaper clipping identifies him as Daniel Voss, 41; the man in the warm faded photograph on Vera's shelf is Daniel, not Jack. A rumpled grey suit, a smile, both small daughters' hands in his and a Tokyo noodle-shop sign behind them, twenty years ago. Jack appears with him in a separate older photograph and was his friend, not a member of the Voss family.", ["Warm", "Principled", "Absent"], "sand", undefined],
  ["old-man", "The Old Man", "Cold open", "70s", "Japanese. Seventies, cheap raincoat, one hand pressed to his side as if something is hidden there. He keeps looking back, stops without turning round, says twenty years to himself, and gives a stranger a key with his last strength. Unnamed in the opening.", ["Hunted", "Resigned", "Deliberate"], "sand", undefined],
  ["masked-men", "The Masked Men", "Cold open", "30s to 40s", "Two men in black clothes and plain masks who do not run. They touch earpieces and report positions: first position done, moving to second. Their work is ordinary to them, and the film never shows a face under the masks — only eyes, and shoes, and a torch beam finding a purse in a puddle.", ["Methodical", "Unhurried", "Bored"], "rose", undefined],
  ["journalist", "The Journalist", "Cold open", "40s", "An untouched beer, a closed notebook, a watched door — and one question asked off camera: where is he. He is killed four shots later and his notebook leaves with the men who did it. Unnamed in the opening; he speaks Japanese.", ["Waiting", "Private", "Unlucky"], "clay", undefined],
  ["young-officer", "The Young Officer", "Front counter", "20s", "Takes a missing-person report with polite boredom until the name Mara Voss comes up on the monitor. Then he turns away from her and makes a quiet phone call, and comes back politer than he was. Unnamed in the opening.", ["Polite", "Bored", "Changed"], "sand", "young-officer"],
  ["ishida", "Detective Ishida", "Police", "50s", "Gentle, unhurried, tired in a way that looks like decency, with excellent English he offers as a courtesy. He asks about Kanda, gives Vera his card and tells her to call at any hour — then opens a drawer with her sister's purse in it and closes it again.", ["Kind", "Unhurried", "Deciding"], "sage", "ishida"],
  ["mrs-sakai", "Mrs. Sakai", "Sakai's widow", "70s", "Japanese. Seventies, small and hard, fifteen years alone with a kotatsu and a television with no sound. She pours tea she does not want to pour, then tells the truth about her husband's last year: the temple, the doctor, being glad. No identity sheet yet: held to the scene 29 master.", ["Hard", "Grieving", "Plain-spoken"], "clay", undefined],
  ["mrs-noda", "Mrs. Noda", "Innkeeper, roadside inn", "60s", "Japanese. Sixties, broad and unbothered, sleeves rolled, an apron over a cardigan. She runs the roadside inn with Mr. Noda: the sticking back door, the steamy window, the truck parked crooked with the keys in it. She smokes on the step under the eave, and crouches behind the steel counter when the boots come. No identity sheet yet: held to the scene 33 master.", ["Unbothered", "Kind", "Steady"], "clay", undefined],
  ["mr-noda", "Mr. Noda", "Innkeeper, roadside inn", "70s", "Japanese. Seventies, thin and slow-moving, a cardigan over his shirt, asleep in front of the night baseball with the game still on. He parks the old pickup crooked across the path, and has promised to fix the back door since the Olympics. No identity sheet yet: held to the scene 35 master.", ["Slow", "Gentle", "Asleep"], "sage", undefined],
  ["okada", "Okada", "Bar owner", "60s", "Japanese. Sixties, the owner of the small Kanda bar where the journalist died. Gaunt, close-cropped white hair, a lined tired face, a white shirt with the sleeves rolled and a dark navy apron. He kept Sakai's cassette in the tray of his cash drawer. When he sees Jack's face and hands he doesn't ask; he pours two glasses instead. No identity sheet yet: held to the scene 81 master.", ["Discreet", "Loyal", "Weary"], "sand", undefined],
  ["harada", "Harada", "Editor, Toto Shimbun", "50s", "Japanese. Fifties, the editor of the Toto Shimbun; the dead journalist was her reporter. Grey hair in a short bob, reading glasses, a white blouse with the sleeves rolled. She presses PLAY, names Kurose, warns Jack he will be named, and opens a notebook to a clean page. No identity sheet yet: held to the scene 82 master.", ["Exacting", "Grieving", "Resolute"], "sage", undefined],
  ["kurose", "Kurose", "Chairman, Kurose Development", "70s", "Japanese. Seventies, the chairman of Kurose Development, whose redevelopment model puts a fountain where the Hive stands. Silver hair combed back, a beautiful dark navy suit, the stillness of a man who has never had to hurry. His English is perfect and old-fashioned. Courteous and curious, he pours the tea himself. Good men are very expensive. No identity sheet yet: held to the scene 83 master.", ["Courteous", "Patient", "Ruthless"], "rose", undefined],
  ["kaneko", "Kaneko", "Noodle counter, the Hive", "70s", "Japanese. Seventies, tiny and sharp-eyed, grey hair in a small bun, a faded indigo apron over a brown cardigan. She runs the six-seat noodle counter in the Hive, hid Mara in her storeroom and then Jack, and brings Vera to see where Mara was. When the masked men come she pulls down the shutter, sends them up to the roof, and stays: I have lived here fifty years. No identity sheet yet: held to the scene 86 master.", ["Sharp", "Stubborn", "Protective"], "clay", undefined],
  ["radio-repairman", "The Radio Repairman", "The Hive", "70s", "Japanese. Seventies, thin, round glasses, a grey cardigan, a loupe pushed up on his forehead. He hears boots in the corridor, looks at the fuse box on his wall, and pulls the main switch, and the whole Hive goes dark. Unnamed; no identity sheet.", ["Watchful", "Quiet", "Decisive"], "sage", undefined],
  ["young-detective", "The Young Detective", "Police", "20s", "Japanese. Late twenties, neat short black hair, white shirt and dark tie, sleeves rolled. The morning after Ishida gets into the black car, he clears Ishida's desk into a cardboard box and opens the bottom drawer: empty. Unnamed; no identity sheet.", ["Neat", "Incurious", "New"], "sand", undefined],
  ["mother", "Vera’s Mother", "Voice on a telephone", "60s", "American. Far away, in another morning, answering the phone twice for a daughter who cannot speak: “Vera? Honey?” She is never seen; the film does not say what she was to Mara, or whether she will ever call back. No identity sheet; there is nothing to draw.", ["Warm", "Unknowing", "Far"], "sand", undefined],
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
characters.find(c => c.id === characterId("mrs-sakai")).image = "/images/neonoire/s29/204-the-tea-she-does-not-want-to-pour.jpg";
characters.find(c => c.id === characterId("mrs-noda")).image = "/images/neonoire/s33/206-the-window-swollen-shut.jpg";
characters.find(c => c.id === characterId("mr-noda")).image = "/images/neonoire/s35/207-the-pink-payphone.jpg";
characters.find(c => c.id === characterId("kaneko")).image = "/images/neonoire/s86/123-fifty-years.jpg";
characters.find(c => c.id === characterId("radio-repairman")).image = "/images/neonoire/s87/124-the-repairman.jpg";
characters.find(c => c.id === characterId("young-detective")).image = "/images/neonoire/s96/143-the-box.jpg";

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
link("ishida", "kurose", "Ally", "Twenty years of doing everything he asked; it ends with a cup of tea in the back of a black car.");
link("vera", "kurose", "Enemy", "Her father wrote his name on every page; she goes to his office to see his face.");
link("kaneko", "jack", "Ally", "She hides him in her storeroom and sends him up to the roof while she stays.");
link("kaneko", "mara", "Ally", "She hid Mara behind the curtain of her noodle counter.");
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
    grammar: "Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound design tricks, no score, no reaction cut; the killing is two flat sounds in rain and the scene leaves the street the way the car does.",
    description: "Cold open, as rewritten on 30 September 2026 to half its length. Rain in a Kanda backstreet: Mara in a dead barber's doorway declines her sister's call; an old man with twenty years behind his eyes is shot in two flat sounds; a small brass key on a number tag is pressed into her palm and closed in her fingers. She runs; behind her the purse lies open in the rain. Nobody explains anything. BOARDED — 16 shots (1–18, less 8 and 11 — the alley-blocking frames the rewrite cut); the letter-rewrite coverage 280–282 was retired the same day with the 1:00-address beat, and the frames of vanished blocking are held RETAKE PENDING.",
    lightingNotes: "The vending machine is the brightest source in the film's first minute. Sodium orange street lamps, one cold white vending machine, green fluorescent spill at the corner. No white beams in frame, ever.",
  },
  {
    key: "s2", id: "neonoire-s2", n: 2, partId: "neonoire-part-1",
    title: "The small bar", location: "INT. SMALL BAR, KANDA", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. SMALL BAR, KANDA - CONTINUOUS #2#",
    page: "n02-small-bar.md", board: "n02-small-bar.md",
    cast: ["Mara Voss", "The Journalist", "The Masked Men"],
    grammar: "The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.",
    description: "Continuous. Mara comes in with the key in her fist; the journalist knows her name. The same polite words at the door; two shots; on the high shelf the television audience laughs. Her hair clip slides out of her wet hair and skitters under the shelf — the film's first close-up. A word in an earpiece, one step toward the counter, and the men go. Black, rain, title card. BOARDED — 11 shots (19–28, and 308, the clip, the first of the seven named close-ups); the floor-level cut is the 30 September 2026 rewrite.",
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
    description: "Moments later. Detective Ishida sets a paper cup of tea in front of Vera and offers her English. She answers in Japanese. She answers in Japanese and asks twice what is on the screen. He asks his own questions instead — where she grew up, when she last saw her sister, how she seemed — and the too-quick “Normal,” and her eyes going to the frosted window before she answers, tell him what the answers don't, until she asks whether her sister is dead. He has no reason to believe she is. The cup crumples in her fist; he offers a tissue, answers her in Japanese for the first time, and tells her the safest thing she can do is nothing. Then his card, across a wet table. BOARDED — 12 shots.",
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
    description: "Vera leaves the hotel and runs badly through cold rain, no coat or umbrella, in a wine-red silk calf-length dress. Her hair plasters to her face and her carefully applied mascara begins to run. An ivory vending machine lights the street without caring. At the red crossing she loses her RIGHT red court shoe and continues with the LEFT shoe on. BOARDED — 4 shots (71–74); main shots now follow a continuous left-to-right route: approaching, then unmistakably past the machine, then onward to the crossing.",
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
    grammar: "Six static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. The sixth is the empty crossing from 27 and 62 — the melody runs all the way to the end of the frame, and as it ends the score enters for the first time in the film. Then black.",
    description: "Six still frames, no people — the only sequence in the film from which every other life is removed: Vera's single red shoe in its puddle; the same hotel lounge empty, chairs up, the pale-blue umbrella by the stool; the intact closed Hive; the same vending machine waiting for nobody; a television showing static; and, added on 30 September 2026, the pedestrian crossing from 27 and 62, empty, the signal turning green for no one, the old melody playing all the way to the end. BOARDED — 6 shots (77–81, and 314, the empty crossing — the frame after which, per the 30 September 2026 revision, the score enters); the five pillow shots are generated, the crossing and selected machine/shoe returns are director-approved main shots as of 1 October 2026. No runner appears in the empty returns. No black-and-white treatment and no early demolition.",
    lightingNotes: "Each still keeps its own ordinary practical: machine-white puddle light, the lounge's one amber lamp, a dim old sign, the grey CRT. Muted natural colour, no spotlit product look; no person or reflected silhouette.",
  },
  {
    key: "s76", id: "neonoire-s76", n: 76, partId: "neonoire-part-feature",
    title: "The lighter", location: "INT. VERA'S APARTMENT", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. VERA'S APARTMENT - NIGHT #76#",
    page: "n76-vera-s-apartment-night.md", board: "n76-vera-apartment.md",
    cast: ["Vera Voss", "Vera’s Mother"],
    grammar: "The same room as scene 4, now dark: rain on the glass, one street-lit plane of the window, nothing switched on. The room's geography and the removed paper pendant stay as in the apartment revision. The lighter is the only object the scene owns; it must look handled, not precious.",
    description: "Night, later, as revised 30 September 2026. In the dark apartment Vera sits on the floor against the bed — ruined red dress, dried mascara, one shoe. The phone lights her face: a contact, MOM. She presses it. Far away, in another morning, it is answered — Vera? Honey? — and nothing comes; she ends the call, and the screen goes dark. In her hand, Jack's old steel lighter: it opens, closes, opens; she should throw it away, and holds it against her chest instead, crying without a sound. She still loves him; she hates herself for it. BOARDED — 4 shots (82–84, and 315, the number pressed), the call scene 4's unanswered voicemail was pointed at.",
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
    description: "Dawn, as revised 30 September 2026. Jack comes to the corridor, does not knock, sets Daniel's notebook on the mat, squares it to the door, and goes. Vera opens her door onto the open-air walkway, still in the red dress, unslept. On the doormat, a plain envelope with no name. Inside, the cloth-covered notebook — and inside its cover, DANIEL VOSS. BOARDED — 4 shots (90–92, and 316, the notebook squared to the door).",
    lightingNotes: "Flat grey-blue dawn, no sun; one fluorescent fitting still on over a door. Wet concrete, rusted railing, the elevated line beyond.",
  },
  {
    key: "s79", id: "neonoire-s79", n: 79, partId: "neonoire-part-feature",
    title: "Her father's handwriting", location: "INT. VERA'S APARTMENT", time: "CONTINUOUS",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. VERA'S APARTMENT - CONTINUOUS #79#",
    page: "n79-vera-s-apartment-continuous.md", board: "n79-veras-apartment-dawn.md",
    cast: ["Vera Voss"],
    grammar: "The scene 4 room in grey dawn, nothing switched on, two empty cups. Daniel's voice-over carries the pages; the images never illustrate them.",
    description: "Continuous. At the low table in the dawn light, beside the two cups from the beginning of the film, both empty now, Vera reads her father's notebook: Shiohama, Kurose, and the young detective they called Jack who signed the report. She closes it and holds it against her chest. BOARDED — 3 shots (93–95); coverage 286 (the letter returned, smoothed flat beside the two cups) appended 28 September 2026.",
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
    grammar: "The fortieth floor by rainy day: 24mm room, 85mm faces, 50mm when she stands and when he reaches for the phone. The revision's rule for this scene: the “He sat where you're sitting” line and “It's just a face” play wide — no close-ups on the accusations.",
    description: "Day. The fortieth floor, rain on the glass. Vera, in a plain dark coat with a folder of photocopies on her lap, sits across from Kurose, who pours her tea himself. He sat where you're sitting; he looked at me the way you are, as if I'd done something. Did you? Good men are very expensive. What is it you want? — and a plain envelope, thick with cash, laid on the glass she doesn't look at. I wanted to see your face — it's just a face. On her way out she stops at the model: where the Hive stood there is only the white plaza, and tiny painted people cross it. It's very clean. Kurose presses a button: follow her. BOARDED — 7 shots (111–116, and 317, the envelope; 113 re-quoted and RETAKE PENDING — the patched block is gone from the model now, and the accusations play wide).",
    lightingNotes: "Flat grey rain light through glass on three sides; no practicals. The white model is the brightest thing in the room.",
  },
  {
    key: "s84", id: "neonoire-s84", n: 84, partId: "neonoire-part-feature",
    title: "Three feet away", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - NIGHT #84#",
    page: "n84-the-hive-noodle-shop-storeroom-night.md", board: "n84-hive-storeroom-night.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "One bare bulb. 24mm room, 50mm at the drawing, 35mm for the two of them, 85mm when the voice comes. Neither crosses the floor.",
    description: "Night. Jack, grey with exhaustion, hiding in the storeroom since the newspaper. Kaneko brings Vera, with Mara's cloth bag and its folded pages; on the folded futon, a neat stack of the rest of them, dried flat, edges rippled from the wet floor. On the wall, Mara's sketches: the counter from behind the curtain, the back of a head on the third stool. That's me. Three feet away. Jack owns it — where she'd be, and when — and Vera refuses to absolve him. She smooths one of Mara's floor drawings flat on the flour sack and takes the pages to Harada. He didn't blame you. A train passes; the bulb swings; in the passage outside a man murmurs into his sleeve: position. BOARDED — 5 shots (117–120, and 318, the dried stack).",
    lightingNotes: "A single bare tungsten bulb, swinging when the train passes; everything else falls to black.",
  },
  {
    key: "s85", id: "neonoire-s85", n: 85, partId: "neonoire-part-feature",
    title: "The Hive is watching", location: "INT. THE HIVE, PASSAGES", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, PASSAGES - CONTINUOUS #85#",
    page: "n85-the-hive-passages-continuous.md", board: "n85-hive-passages.md",
    cast: ["The Masked Men"],
    grammar: "24mm down a passage too narrow for anything but single file; 35mm for the doors closing. Static.",
    description: "Continuous. Four masked men move through the Hive's narrow corridors in single file, weapons up. Doors that stood open close softly, one after another, as they pass. The Hive is watching them. BOARDED — 2 shots (121–122).",
    lightingNotes: "Bare bulbs and warm open doorways against cold green spill; the doors closing take the warm light away strip by strip.",
  },
  {
    key: "s86", id: "neonoire-s86", n: 86, partId: "neonoire-part-feature",
    title: "Fifty years", location: "INT. KANEKO'S NOODLE COUNTER", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. KANEKO'S NOODLE COUNTER - CONTINUOUS #86#",
    page: "n86-kaneko-s-noodle-counter-continuous.md", board: "n86-kaneko-counter.md",
    cast: ["Kaneko", "Jack", "Vera Voss"],
    grammar: "24mm counter, 50mm three-shot, 85mm for Kaneko's refusal. The shutter crashes, the tube goes off, and the gas flame is all that's left.",
    description: "Continuous. Kaneko pulls the shutter down with a crash and turns off the tube. Up, through the back, the stairs by the dentist, then through the neighbours — I know them, Vera says, and Jack looks at her: she has learned the building's kindness. Come with us. I have lived here fifty years; they can come and find me. She pushes them toward the back. BOARDED — 3 shots (123–125).",
    lightingNotes: "One fluorescent tube, then only the blue-orange gas flames under the stock pots and the glow through the storeroom curtain.",
  },
  {
    key: "s87", id: "neonoire-s87", n: 87, partId: "neonoire-part-feature",
    title: "The main switch", location: "INT. THE HIVE, RADIO REPAIR SHOP", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, RADIO REPAIR SHOP - CONTINUOUS #87#",
    page: "n87-the-hive-radio-repair-shop-continuous.md", board: "n87-radio-repair-shop.md",
    cast: ["The Radio Repairman"],
    grammar: "35mm on the old man at his bench, 85mm on the switch. One pull.",
    description: "Continuous. The radio repairman looks up from his bench at the sound of boots in the corridor, looks at the old fuse box on his wall, reaches up and pulls the main switch. BOARDED — 2 shots (126–127).",
    lightingNotes: "A green-shaded bench lamp and a magnifier lamp, warm amber, dying on the pull.",
  },
  {
    key: "s88", id: "neonoire-s88", n: 88, partId: "neonoire-part-feature",
    title: "Its own dark", location: "INT. THE HIVE, PASSAGES", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. THE HIVE, PASSAGES - CONTINUOUS #88#",
    page: "n88-the-hive-passages-continuous.md", board: "n88-hive-dark.md",
    cast: ["The Masked Men"],
    grammar: "Scene 85's camera with every bulb out; 50mm over a masked shoulder. Flashlight beams are the only light.",
    description: "Continuous. DARK. In the black Vera's hand finds the wall, low, where a child's hand would reach, and she starts to move; Jack follows the sound of her. Then every bulb in the building goes out at once. The masked men stop; flashlights snap on, catching dripping pipes, closed doors, laundry, faces at windows that vanish the moment the light touches them. The Hive knows its own dark. The men don't. BOARDED — 2 shots (128–129).",
    lightingNotes: "Black, and tight hard white flashlight beams with haze in them. Nothing else.",
  },
  {
    key: "s89", id: "neonoire-s89", n: 89, partId: "neonoire-part-feature",
    title: "The unlit lighter", location: "INT. THE HIVE, STAIRWELL", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. THE HIVE, STAIRWELL - CONTINUOUS #89#",
    page: "n89-the-hive-stairwell-continuous.md", board: "n89-hive-stairwell.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "24mm up the stair in the dark; 85mm on the hands, and on the thumb on the wheel. The building's noise is sound, not picture; no dialogue in the scene, none on the frames.",
    description: "Continuous, rewritten wordless on 30 September 2026. Pitch black, a narrow concrete stair. Vera climbs by touch, one hand on the wall; her other hand finds Jack's and pulls him up after her. Halfway up she stops and takes the lighter out of her pocket, her thumb on the wheel — below them boots, a flashlight crawling up the wall and falling away. She puts the lighter back unlit, and climbs. BOARDED — 3 shots (130–131, re-quoted; 131 RETAKE PENDING — the hand that finds the other now runs the other way; and 319, the thumb on the wheel: the seventh and last of the named close-ups).",
    lightingNotes: "Near-total dark; one hard white flashlight beam at the bottom of the stair.",
  },
  {
    key: "s90", id: "neonoire-s90", n: 90, partId: "neonoire-part-feature",
    title: "Through the rooms", location: "INT. THE HIVE, THROUGH THE ROOMS", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, THROUGH THE ROOMS - CONTINUOUS #90#",
    page: "n90-the-hive-through-the-rooms-continuous.md", board: "n90-through-the-rooms.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "35mm at doorway height; the rooms are seen from where Vera and Jack pass through them, one door after another.",
    description: "Continuous. A door with a sumo match murmuring behind it opens before Vera can knock — the old woman from 55, holding the way through; beyond it a candlelit kitchen, the dentist with a finger to his lips, the girl with the violin, the inside of a wardrobe. Every door has someone at it, nobody speaks or looks, and each closes softly behind them while a flashlight beam finds it and stops. The last room, in the rear wing, is empty, with an iron fire ladder outside its window. REWRITTEN again 30 September 2026 to open on the sumo door; 132 is re-quoted and held RETAKE PENDING against the new opening, and 133 and 267, regenerated on 29 September, still match.",
    lightingNotes: "Single candle or a torch turned low in each room; a flashlight beam finding each door as it closes.",
  },
  {
    key: "s91", id: "neonoire-s91", n: 91, partId: "neonoire-part-feature",
    title: "The ladder under the train", location: "EXT. THE HIVE, REAR WALL BY THE VIADUCT", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. THE HIVE, REAR WALL BY THE VIADUCT - CONTINUOUS #91#",
    page: "n91-the-hive-rear-wall-by-the-viaduct-continuous.md", board: "n91-the-fire-ladder.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "24mm on the iron ladder against the viaduct wall; 50mm on her hand in his as the train covers the descent.",
    description: "Continuous. Down an iron fire ladder on the rear wall while a flashlight sweeps the closed shutter above. A train arrives overhead, a roaring wall of lit windows, and under it they descend unheard. Her hand is in his; at the bottom she doesn't take it back. When the last carriage has passed, the ladder is empty. REWRITTEN 29 September 2026 (the walkway is cut); the boarded frames (134–136) still show the retired walkway and are RETAKE PENDING.",
    lightingNotes: "Rain; the train's headlight, then strobing window light overhead; a flashlight beam at the window above.",
  },
  {
    key: "s92", id: "neonoire-s92", n: 92, partId: "neonoire-part-feature",
    title: "Until us", location: "EXT. STREET BELOW THE VIADUCT", time: "MOMENTS LATER",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. STREET BELOW THE VIADUCT - MOMENTS LATER #92#",
    page: "n92-street-below-the-viaduct-moments-later.md", board: "n92-below-the-viaduct.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "35mm on the empty street with the Hive lit behind; 50mm on Vera looking up.",
    description: "Moments later. Down the fire ladder into an empty street, soaked. Behind them the Hive, every window lit again; sirens far off. Vera steps one step away. Is Kaneko -- The Hive looks after its own. Mara was safe here. Until us. BOARDED — 2 shots (137–138).",
    lightingNotes: "Hundreds of warm windows on the Hive, sodium streetlight, wet asphalt, distant siren glow.",
  },
  {
    key: "s93", id: "neonoire-s93", n: 93, partId: "neonoire-part-feature",
    title: "He knows this car", location: "EXT. POLICE STATION", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. POLICE STATION - NIGHT #93#",
    page: "n93-police-station-night.md", board: "n93-police-station-night.md",
    cast: ["Detective Ishida"],
    grammar: "35mm across the wet street, 50mm at the open door. Rain, no umbrella.",
    description: "Night. Rain. Ishida comes down the front steps without an umbrella. At the kerb, a black sedan, engine running, wipers beating slowly. He stops; he knows this car. A long moment, then the rear door opens from inside. BOARDED — 2 shots (139–140).",
    lightingNotes: "Sodium streetlight, the station's cold glass entrance and red lamp, then warm amber from the open car door.",
  },
  {
    key: "s94", id: "neonoire-s94", n: 94, partId: "neonoire-part-feature",
    title: "The lit window", location: "EXT. POLICE STATION / INT. BLACK SEDAN", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "EXT. POLICE STATION / INT. BLACK SEDAN - CONTINUOUS #94#",
    page: "n94-police-station-black-sedan-continuous.md", board: "n94-black-sedan.md",
    cast: ["Kurose", "Detective Ishida"],
    grammar: "24mm for the steps and the rain; 50mm at the open door; 85mm on the cup and the watch. No dialogue, no score, no explanation of the choice; the lit window is the last word the scene gets.",
    description: "Continuous, rewritten wordless on 30 September 2026. At the foot of the steps a black sedan waits at the kerb, engine running, wipers going. The rear door opens from inside: warm amber, leather. Ishida stops in the rain and looks back up at the station — one lit window on the second floor where somebody is still working. From inside the car a man's clean hand holds out a cup of tea; on the wrist, the watch from the model. Ishida gets in. The door closes; the rain is suddenly very far away. BOARDED — 3 shots (141–143, all re-quoted the same day and all held RETAKE PENDING: the old cut showed Vera and a spoken invitation).",
    lightingNotes: "Warm amber interior light on cream leather; rain and smeared sodium beyond the glass. The car never moves.",
  },
  {
    key: "s95", id: "neonoire-s95", n: 95, partId: "neonoire-part-feature",
    title: "Taillights", location: "EXT. TOKYO STREET", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. TOKYO STREET - CONTINUOUS #95#",
    page: "n95-tokyo-street-continuous.md", board: "n95-tokyo-street.md",
    cast: [],
    grammar: "35mm, static and low, rhyming with shot 13.",
    description: "Continuous. The black car recedes down a long wet road, its taillights smearing red, exactly like the car in the first scene of the film. It turns a corner. Gone. BOARDED — 1 shot (144).",
    lightingNotes: "Sodium orange and sick fluorescent green, red taillight streaks on black asphalt.",
  },
  {
    key: "s96", id: "neonoire-s96", n: 96, partId: "neonoire-part-feature",
    title: "A minute fast", location: "INT. POLICE STATION, DETECTIVES' ROOM", time: "MORNING",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. POLICE STATION, DETECTIVES' ROOM - MORNING #96#",
    page: "n96-police-station-detectives-room-morning.md", board: "n96-detectives-room-morning.md",
    cast: ["The Young Detective"],
    grammar: "24mm room, 50mm on the empty drawer and on the desk phone, and scene 7's clock camera by day.",
    description: "Morning. Grey daylight. A cardboard box on Ishida's desk; a young detective is clearing it. He opens the bottom drawer: empty. Then the desk phone rings: Ishida is in his own car under the expressway, no marks — he left a statement. On the wall, the clock still runs a minute fast. BOARDED — 4 shots (145–147, and 303 the call).",
    lightingNotes: "Flat grey morning daylight through the windows at right, the green-white tubes half on.",
  },

  {
    key: "s98", id: "neonoire-s98", n: 98, partId: "neonoire-part-feature",
    title: "The rain has stopped", location: "EXT. ROOFTOP OF JACK'S BUILDING", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. ROOFTOP OF JACK'S BUILDING - DAY #98#",
    page: "n98-rooftop-of-jack-s-building-day.md", board: "n98-rooftop.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "24mm for the roof and the trains, 85mm on the clip, 50mm at the railing.",
    description: "Days later. The rain has stopped for the first time in the film. A small flat roof, trains passing at eye level. Ishida left a statement — that's what the police say it says, Vera says, and Jack only asks if that is what it says. Jack gives Vera the red bird clip, and tells her Mara was sorry; she keeps his lighter and does not give it back. She cries at the railing; he stands beside her, close enough, not closer. Kaneko opens at six. BOARDED — 4 shots (155–157, and 241, the train window). Vera in costume Look E.",
    lightingNotes: "Pale washed daylight under an enormous sky, no sodium, no rain, the concrete drying.",
  },

  {
    key: "s100", id: "neonoire-s100", n: 100, partId: "neonoire-part-feature",
    title: "The city goes on", location: "INT. KANEKO'S NEW COUNTER", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. KANEKO'S NEW COUNTER - NIGHT #100#",
    page: "n100-kaneko-s-new-counter-night.md", board: "n100-kaneko-new-counter.md",
    cast: ["Vera Voss", "Kaneko", "Jack"],
    grammar: "35mm for the arch and the six stools; 50mm on the sound-down television, read and unregarded; 50mm from behind Vera for the hold. The curtain stays a fourth wall until it doesn't: the last frame is the lit window behind it.",
    description: "Rewritten 30 September 2026. A tiny new counter in a brick railway arch near the station: six new stools, the same height as the old ones. Steam; a train over the line, the bottles ticking and settling — the film's last echo of every train that shook the Hive. On the shelf above the door a small old television plays the evening news nobody watches: Kurose walking into a building between his lawyers, cameras flashing; a photograph of Ishida in uniform; then the weather. Nobody looks up. Kaneko ladles; Jack sits on the second stool, and the third is empty. Vera counts the stools and sits on the third, eats all of it, and pays too much — Kaneko looks at the money, then at her, and leaves it where it is. Past the curtain, a lit window and a radio through a wall: the city going on. HOLD on the three of them in the steam. FADE OUT. BOARDED — 5 shots (160–161, 260, and 265, the count — all re-quoted, 160 RETAKE PENDING — and 320, the news nobody watches).",
    lightingNotes: "One warm bulb and steam in a brick vault, the television's grey flicker above the door, cool blue street light through it.",
  },
  {
    key: "s8", id: "neonoire-s8", n: 8, partId: "neonoire-part-feature",
    title: "We're closed", location: "INT. SMALL BAR, KANDA", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. SMALL BAR, KANDA - DAY #8#",
    page: "n08-small-bar-kanda-day.md", board: "n08-small-bar-day.md",
    cast: ["Okada", "Vera Voss"],
    grammar: "35mm down the bar, 50mm on the umbrella.",
    description: "The same bar in flat grey daylight: chairs up, the CRT dark, a new rubber mat where the journalist fell. Okada says Mara was never here, and his eyes go once to the far end of the counter. Vera leaves the blue umbrella against a stool. BOARDED — 3 shots (162–163, and 242, the glance), numbered in boarding order.",
    lightingNotes: "Flat grey daylight through the street window, the bottle shelves dim.",
  },
  {
    key: "s9", id: "neonoire-s9", n: 9, partId: "neonoire-part-feature",
    title: "Behind the counter", location: "EXT. KANDA STREET", time: "CONTINUOUS",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. KANDA STREET - CONTINUOUS #9#",
    page: "n09-kanda-street-continuous.md", board: "n09-kanda-street-day.md",
    cast: ["Vera Voss", "Okada"],
    grammar: "35mm for the street, 85mm on the clip.",
    description: "Rain. Okada runs after Vera with the umbrella and, in his other hand, the red bird clip: behind the counter, after. Not the police. Him. A card: JACK. INVESTIGATIONS. BOARDED — 3 shots (164–165, and 243, the card).",
    lightingNotes: "Grey rainy daylight on a narrow wet street.",
  },
  {
    key: "s10", id: "neonoire-s10", n: 10, partId: "neonoire-part-feature",
    title: "Who calls me that?", location: "INT. JACK'S OFFICE", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. JACK'S OFFICE - NIGHT #10#",
    page: "n10-jack-s-office-night.md", board: "n10-jacks-office-night.md",
    cast: ["Jack", "Vera Voss", "Daniel Voss"],
    grammar: "24mm for the room, 50mm on the desk, 85mm on Jack and the photograph.",
    description: "One room against the railway: a rice ball, a lighter with no cigarettes, a silent samurai film. Vera sets the red bird clip on the desk, and her family photograph slides out face up. Jack holds it by its edges like evidence. The call knows a name nobody has used in years: Who calls me that? Ten thousand yen a day. BOARDED — 4 shots (166–168, and 244, down the stairs).",
    lightingNotes: "The green desk lamp, grey CRT flicker, train light through the blinds.",
  },
  {
    key: "s11", id: "neonoire-s11", n: 11, partId: "neonoire-part-feature",
    title: "Two men laughing", location: "INT. JACK'S OFFICE", time: "LATER",
    kind: "Standard", lighting: "Practical night", slugline: "INT. JACK'S OFFICE - LATER #11#",
    page: "n11-jack-s-office-later.md", board: "n11-jacks-office-later.md",
    cast: ["Jack", "Daniel Voss"],
    grammar: "85mm on the photograph.",
    description: "Past midnight. A box he hasn't opened in years: a police notebook, a clipping — DANIEL VOSS, 41 — and a photograph of Daniel and a young Jack laughing under the noodle-shop sign. A call to Ishida: you found enough twenty years ago. BOARDED — 5 shots (169, 245–246, and 251–252, the call and the lighter).",
    lightingNotes: "Only the desk lamp and TV static.",
  },
  {
    key: "s12", id: "neonoire-s12", n: 12, partId: "neonoire-part-feature",
    title: "The strap", location: "EXT. BACKSTREET, KANDA", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. BACKSTREET, KANDA - NIGHT #12#",
    page: "n12-backstreet-kanda-night.md", board: "n12-backstreet-night.md",
    cast: ["Jack"],
    grammar: "35mm from the cold open's own position.",
    description: "The cold open's street, four days on. Jack stands where Mara stood, finds a torn strap at knee height; the barber asks why come back, shrugs and pulls the shutter — nothing was found here, and neither of them says it aloud. BOARDED — 3 shots (170, and 247–248, the barber and the can).",
    lightingNotes: "Sodium orange and fluorescent green, the vending machine's white light, steady rain.",
  },
  {
    key: "s31", id: "neonoire-s31", n: 31, partId: "neonoire-part-feature",
    title: "The only car", location: "EXT. ROADSIDE INN", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. ROADSIDE INN - NIGHT #31#",
    page: "n31-roadside-inn-night.md", board: "n31-roadside-inn.md",
    cast: ["Jack"],
    grammar: "35mm, low and level, square to the building.",
    description: "Two storeys of weathered wood and a tin roof behind a gravel lot, modern once, in about 1975. Jack pulls in: the only car. BOARDED — 1 shot (171). The warm half of the inn's colour change.",
    lightingNotes: "Warm refuge: tungsten amber, ivory paper, tobacco wood.",
  },
  {
    key: "s32", id: "neonoire-s32", n: 32, partId: "neonoire-part-feature",
    title: "Just one night", location: "INT. ROADSIDE INN, LOBBY", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, LOBBY - CONTINUOUS #32#",
    page: "n32-roadside-inn-lobby-continuous.md", board: "n32-roadside-inn-lobby.md",
    cast: ["Jack"],
    grammar: "50mm at seated height and at the foot of the stairs.",
    description: "A small, warm, faded lobby: a pink payphone, a souvenir case, night baseball. Mrs. Noda hands Jack a heavy key and leads him upstairs. BOARDED — 2 shots (172–173), including the stair frame.",
    lightingNotes: "Warm refuge: tungsten amber, ivory paper, tobacco wood.",
  },
  {
    key: "s34", id: "neonoire-s34", n: 34, partId: "neonoire-part-feature",
    title: "Twenty years of Januaries", location: "INT. ROADSIDE INN, JACK'S ROOM", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, JACK'S ROOM - NIGHT #34#",
    page: "n34-roadside-inn-jack-s-room-night.md", board: "n34-roadside-inn-jacks-room.md",
    cast: ["Jack"],
    grammar: "50mm at tatami height.",
    description: "Tatami, a thin futon, rain on the tin roof. Sakai's receipts under the lamp: Kato Rental Lockers, Ueno, No. 114. No signal. BOARDED — 2 shots (174, and 255, the locker number).",
    lightingNotes: "Warm refuge: tungsten amber, ivory paper, tobacco wood.",
  },
  {
    key: "s38", id: "neonoire-s38", n: 38, partId: "neonoire-part-feature",
    title: "Four black sedans", location: "EXT. ROADSIDE INN", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "EXT. ROADSIDE INN - NIGHT #38#",
    page: "n38-roadside-inn-night.md", board: "n38-roadside-inn-night.md",
    cast: [],
    grammar: "35mm from the same low position as shot 171.",
    description: "2 a.m. Rain. One car. Two. Three. Four. Black sedans turn in. THE COLOUR CHANGES. BOARDED — 1 shot (175).",
    lightingNotes: "The cold: steel blue and blue-black, xenon-white headlight beams, the warm lights dead.",
  },
  {
    key: "s39", id: "neonoire-s39", n: 39, partId: "neonoire-part-feature",
    title: "The curtain gap", location: "INT. ROADSIDE INN, JACK'S ROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, JACK'S ROOM - CONTINUOUS #39#",
    page: "n39-roadside-inn-jack-s-room-continuous.md", board: "n39-roadside-inn-jacks-room.md",
    cast: ["Jack", "The Masked Men"],
    grammar: "50mm from shot 174's position; his POV through the curtain.",
    description: "Jack has heard the gravel. Through the curtain gap: four black cars in an arc, eight masked men with submachine guns, splitting up without a word. BOARDED — 2 shots (176–177).",
    lightingNotes: "The cold: steel blue and blue-black, xenon-white headlight beams, the warm lights dead.",
  },
  {
    key: "s40", id: "neonoire-s40", n: 40, partId: "neonoire-part-feature",
    title: "Plaster rains down", location: "INT. ROADSIDE INN, LOBBY", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, LOBBY - CONTINUOUS #40#",
    page: "n40-roadside-inn-lobby-continuous.md", board: "n40-roadside-inn-lobby.md",
    cast: ["The Masked Men"],
    grammar: "50mm from shot 172's position.",
    description: "Two masked men come through the door. A burst into the ceiling; the souvenir case shatters; the CRT keeps playing baseball. BOARDED — 3 shots (178, 262, and 269, the staff side).",
    lightingNotes: "The cold: steel blue and blue-black, xenon-white headlight beams, the warm lights dead.",
  },
  {
    key: "s41", id: "neonoire-s41", n: 41, partId: "neonoire-part-feature",
    title: "Boots below", location: "INT. ROADSIDE INN, UPSTAIRS CORRIDOR", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, UPSTAIRS CORRIDOR - CONTINUOUS #41#",
    page: "n41-roadside-inn-upstairs-corridor-continuous.md", board: "n41-roadside-inn-upstairs-corridor.md",
    cast: ["Jack", "The Masked Men"],
    grammar: "50mm from the identical position to shot 173.",
    description: "Jack at the top of the stairs hears boots below and goes the other way. The stair frame repeated in the cold: the refuge becomes a trap. BOARDED — 3 shots (179, 261, and 268, the wood).",
    lightingNotes: "The cold: steel blue and blue-black, xenon-white headlight beams, the warm lights dead.",
  },
  {
    key: "s45", id: "neonoire-s45", n: 45, partId: "neonoire-part-feature",
    title: "The lobby goes dark", location: "INT. ROADSIDE INN, LOBBY", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, LOBBY - CONTINUOUS #45#",
    page: "n45-roadside-inn-lobby-continuous.md", board: "n45-roadside-inn-lobby-dark.md",
    cast: ["The Masked Men"],
    grammar: "50mm from shot 172's position.",
    description: "Jack flips the light switch. Dark. The gunman fires; the vending machine lights up and says thank you very much. The payphone rings and rings. BOARDED — 3 shots (180, 254, and 256, Jack getting Mr. Noda out, no weapons in frame).",
    lightingNotes: "The cold: steel blue and blue-black, xenon-white headlight beams, the warm lights dead.",
  },

  {
    key: "s14", id: "neonoire-s14", n: 14, partId: "neonoire-part-feature",
    title: "Someone who meant to come back", location: "INT. MARA'S APARTMENT", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. MARA'S APARTMENT - DAY #14#",
    page: "n14-mara-s-apartment-day.md", board: "n14-maras-apartment-day.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "35mm for the room, 50mm on the sketchbook.",
    description: "A tiny studio of sketches and clothes, a packed suitcase, a flight booked for next month. The last things Vera said. A sketchbook full of the same noodle counter, every stroke of the kanji correct. Vera sets the red bird clip on top of the sketchbook — Take this too. It's mine. She stole it. — and Jack takes both. BOARDED — 2 shots (184–185).",
    lightingNotes: "Grey daylight through one window.",
  },
  {
    key: "s15", id: "neonoire-s15", n: 15, partId: "neonoire-part-feature",
    title: "Forgotten by the city", location: "EXT. THE HIVE", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. THE HIVE - DAY #15#",
    page: "n15-the-hive-day.md", board: "n15-the-hive-day.md",
    cast: ["Jack"],
    grammar: "24mm for the street, 50mm square to the stair.",
    description: "Rain. The Hive between two new glass towers like a gap behind a shutters-up street, the white hoarding and its painted smiling plaza beside it. Jack looks up as if at someone he used to know, then climbs in: the stairway motif, going up into the past. BOARDED — 2 shots (186–187).",
    lightingNotes: "Flat grey rainy daylight.",
  },
  {
    key: "s16", id: "neonoire-s16", n: 16, partId: "neonoire-part-feature",
    title: "Everybody sees him", location: "INT. THE HIVE, PASSAGES", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, PASSAGES - CONTINUOUS #16#",
    page: "n16-the-hive-passages-continuous.md", board: "n16-hive-passages.md",
    cast: ["Jack", "The Radio Repairman"],
    grammar: "35mm down the passage.",
    description: "Shoulder-wide passages, doors open on other lives: radios, a family at dinner, an old woman at the sumo. Nobody stops him. Everybody sees him. BOARDED — 3 shots (188, 250, and 253, the dentist's chair).",
    lightingNotes: "Bare bulbs, pipes and wires, dust in the light.",
  },
  {
    key: "s17", id: "neonoire-s17", n: 17, partId: "neonoire-part-feature",
    title: "You got old", location: "INT. KANEKO'S NOODLE COUNTER", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. KANEKO'S NOODLE COUNTER - CONTINUOUS #17#",
    page: "n17-kaneko-s-noodle-counter-continuous.md", board: "n17-kaneko-counter-first.md",
    cast: ["Jack", "Kaneko", "Mara Voss"],
    grammar: "35mm, frontal to the counter.",
    description: "Kaneko knows him: a boy in a cheap suit who came with the American. Jack sits on the fourth stool, beside the third, and neither of them says whose the third is. Everything is going. We are just slower. Eat. Then go. He pays far too much and leaves his card. Behind the curtain, something moves. BOARDED — 2 shots (189–190).",
    lightingNotes: "One fluorescent tube and steam.",
  },
  {
    key: "s18", id: "neonoire-s18", n: 18, partId: "neonoire-part-feature",
    title: "After the last train", location: "INT. JACK'S OFFICE", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. JACK'S OFFICE - NIGHT #18#",
    page: "n18-jack-s-office-night.md", board: "n18-office-after-the-last-train.md",
    cast: ["Jack", "Kaneko"],
    grammar: "35mm static in the dark; the television is the only lamp.",
    description: "Static on the old television, rain on the blinds, the sketchbook open on the desk. Kaneko's voice through the black rotary: come back, alone, after the last train. BOARDED — 1 shot (191); coverage 283 (Sakai's letter insert under the lamp) appended 28 September 2026.",
    lightingNotes: "TV static flicker and train light through the blinds; every practical off.",
  },
  {
    key: "s19", id: "neonoire-s19", n: 19, partId: "neonoire-part-feature",
    title: "Past midnight", location: "INT. KANEKO'S NOODLE COUNTER", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. KANEKO'S NOODLE COUNTER - NIGHT #19#",
    page: "n19-kaneko-s-noodle-counter-night.md", board: "n19-counter-past-midnight.md",
    cast: ["Kaneko", "Jack"],
    grammar: "35mm frontal to the counter, as shot 189, an hour deeper.",
    description: "The shutter half down, the fluorescent tube off, one bulb left. Kaneko lifts the storeroom curtain and stands aside. BOARDED — 1 shot (192).",
    lightingNotes: "One bare bulb over a dark counter.",
  },
  {
    key: "s20", id: "neonoire-s20", n: 20, partId: "neonoire-part-feature",
    title: "Prove it", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - CONTINUOUS #20#",
    page: "n20-the-hive-noodle-shop-storeroom-continuous.md", board: "n20-storeroom-prove-it.md",
    cast: ["Jack", "Mara Voss"],
    grammar: "35mm for the storeroom and the doorway; 85mm on the replayed voicemail and on the clip resting on the sketchbook. Nothing longer, and no knife.",
    description: "Night, after the last train, as rewritten 30 September 2026. On the futon, Mara plays her sister's voicemail, and plays it again — the two lines lifted from the cut scene 13. Jack in the doorway; her sketchbook and the red bird clip go between them on a flour sack — no knife in the room — and the promise costs him: Is she okay? — does she know... They have my purse. My passport. BOARDED — 4 shots (193–194, re-quoted and held RETAKE PENDING — the knife and the open palm are out of the scene; 284, the coward line, still true), and 309, the voicemail replay: the second of the seven named close-ups.",
    lightingNotes: "One bare bulb, flour dust, the railway humming overhead.",
  },
  {
    key: "s21", id: "neonoire-s21", n: 21, partId: "neonoire-part-feature",
    title: "Footsteps on the stairs", location: "INT. JACK'S OFFICE", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. JACK'S OFFICE - DAY #21#",
    page: "n21-jack-s-office-day.md", board: "n21-office-footsteps-on-the-stairs.md",
    cast: ["Jack", "Vera Voss"],
    grammar: "50mm square to the stair, 85mm on the cup.",
    description: "Grey light, yesterday's shirt, two coffees and a lie he lets her believe. She hesitates at the door and doesn't say it; he holds the cup without drinking. BOARDED — 2 shots (195–196).",
    lightingNotes: "Rain-grey daylight through one window; no practicals.",
  },
  {
    key: "s22", id: "neonoire-s22", n: 22, partId: "neonoire-part-feature",
    title: "Somewhere like this", location: "INT. ALL-NIGHT NOODLE COUNTER, UNDER THE TRACKS", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ALL-NIGHT NOODLE COUNTER, UNDER THE TRACKS - NIGHT #22#",
    page: "n22-all-night-noodle-counter-under-the-tracks-night.md", board: "n22-counter-under-the-tracks.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "35mm for the arch, 50mm along the counter.",
    description: "A brick arch counter where the cups tremble every time a train goes over. A man wrote to her last week — Dad didn't do it; the police knew — and she told Jack all of it, of her father, Tokyo, the man who made the noodles; then she sleeps, and he moves her cup back from the edge. BOARDED — 2 shots (197–198); coverage 285 (Jack's hand over the inside pocket) appended 28 September 2026.",
    lightingNotes: "Fluorescent tube in a green-tiled arch, warm bulb at the far end.",
  },
  {
    key: "s23", id: "neonoire-s23", n: 23, partId: "neonoire-part-feature",
    title: "You never call", location: "EXT. YAKITORI STALL, UNDER THE TRACKS", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. YAKITORI STALL, UNDER THE TRACKS - NIGHT #23#",
    page: "n23-yakitori-stall-under-the-tracks-night.md", board: "n23-yakitori-under-the-bridge.md",
    cast: ["Detective Ishida", "Jack"],
    grammar: "35mm across the table, lanterns behind.",
    description: "Smoke, red lanterns, salarymen talking too loud. Ishida names what Sakai was, and the Shiohama fire among others; bring what you find to me, not to the department. BOARDED — 1 shot (199).",
    lightingNotes: "Red lantern glow and sodium orange under the steel bridge.",
  },

  {
    key: "s25", id: "neonoire-s25", n: 25, partId: "neonoire-part-feature",
    title: "The number 114", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - NIGHT #25#",
    page: "n25-the-hive-noodle-shop-storeroom-night.md", board: "n25-storeroom-the-number-114.md",
    cast: ["Jack", "Mara Voss"],
    grammar: "35mm across three feet of dark.",
    description: "A cold bowl of rice and a whispered timeline: twenty years, the bar, the meeting that was supposed to happen. The key's number is 114, and Jack leaves it with her because nobody knows where she is. BOARDED — 1 shot (202).",
    lightingNotes: "One bare bulb, lower and darker than scene 20: warmth turned conspiratorial.",
  },
  {
    key: "s26", id: "neonoire-s26", n: 26, partId: "neonoire-part-feature",
    title: "The second hand", location: "INT. YAMANOTE LINE TRAIN", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. YAMANOTE LINE TRAIN - DAY #26#",
    page: "n26-yamanote-line-train-day.md", board: "n26-yamanote-loop.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "50mm at seated height; the city circles past.",
    description: "Riding the loop because there is nowhere to go: her father's clock, the lighter he still carries, and her head coming to rest on his shoulder as if it has always belonged there. BOARDED — 1 shot (203).",
    lightingNotes: "Institutional green moquette, grey soft afternoon rain light.",
  },
  {
    key: "s27", id: "neonoire-s27", n: 27, partId: "neonoire-part-feature",
    title: "The old song", location: "EXT. PEDESTRIAN CROSSING", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. PEDESTRIAN CROSSING - DAY #27#",
    page: "n27-pedestrian-crossing-day.md", board: "n27-pedestrian-crossing.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "35mm wide and low; the only romantic frame in the film.",
    description: "One cheap plastic umbrella too small for two, a green signal and the city's old melody: the only frame in the film that lets them be happy in the open. BOARDED — 2 shots (204, and 263, the laugh).",
    lightingNotes: "Wet black asphalt, signal green, the only warmed midtones before the inn.",
  },
  {
    key: "s28", id: "neonoire-s28", n: 28, partId: "neonoire-part-feature",
    title: "The sea wall steps", location: "EXT. FISHING TOWN, BOSO COAST", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. FISHING TOWN, BOSO COAST - DAY #28#",
    page: "n28-fishing-town-boso-coast-day.md", board: "n28-boso-sea-wall-steps.md",
    cast: ["Jack"],
    grammar: "35mm square to the steps, low and level; the stairway motif going down.",
    description: "Rain on the slipway. Grey sea lost in grey weather, salt-scoured paint — wet, like everything before 98. Jack's car on the sea wall and the stone steps going down to the slipway — the stairway motif, descending, into a dead man's past. BOARDED — 1 shot (205).",
    lightingNotes: "Salt slate and sea green; the coldest daylight in the film.",
  },
  {
    key: "s29", id: "neonoire-s29", n: 29, partId: "neonoire-part-feature",
    title: "The tea she does not want to pour", location: "INT. MRS. SAKAI'S HOUSE", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. MRS. SAKAI'S HOUSE - DAY #29#",
    page: "n29-mrs-sakai-s-house-day.md", board: "n29-mrs-sakai-house-day.md",
    cast: ["Jack", "Mrs. Sakai"],
    grammar: "35mm across the kotatsu; the altar keeps the only smile.",
    description: "Fifteen years apart and the police already came. Mrs Sakai pours tea she doesn't want to pour, then tells him about the temple, the doctor, and a man glad he could stop being afraid of the wrong thing. Every January, cash in an envelope — even after he left, the receipts kept coming here: KATO RENTAL LOCKERS, UENO, No. 114, paid in full. Rent paid on something, somewhere. BOARDED — 1 shot (206).",
    lightingNotes: "Tatami beige, altar gold, television blue-grey; grief draining the warmth.",
  },
  {
    key: "s30", id: "neonoire-s30", n: 30, partId: "neonoire-part-feature",
    title: "A light ahead", location: "EXT. COUNTRY HIGHWAY", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. COUNTRY HIGHWAY - NIGHT #30#",
    page: "n30-country-highway-night.md", board: "n30-country-highway-night.md",
    cast: ["Jack"],
    grammar: "35mm from the black field; the sign is the only warmth.",
    description: "Rain, black fields, one headlight dimmer than the other — and ahead the roadside inn's sign with half its bulbs dead: the beacon that opens the warm inn. BOARDED — 1 shot (207).",
    lightingNotes: "Black fields, wet road, tungsten only at the sign.",
  },
  {
    key: "s33", id: "neonoire-s33", n: 33, partId: "neonoire-part-feature",
    title: "The window swollen shut", location: "INT. ROADSIDE INN, CORRIDOR AND BATH", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, CORRIDOR AND BATH - CONTINUOUS #33#",
    page: "n33-roadside-inn-corridor-and-bath-continuous.md", board: "n33-inn-corridor-and-bath.md",
    cast: ["Jack", "Mrs. Noda"],
    grammar: "35mm down the corridor; the window is the scene.",
    description: "The sticking back door, the kitchen, and the small tiled bath with its deep tub and one high window, fogged and swollen shut. Jack notices the window. He notices everything; nobody in the scene knows it. BOARDED — 1 shot (208).",
    lightingNotes: "Warm tungsten and steam haze; the inn still refuge.",
  },
  {
    key: "s35", id: "neonoire-s35", n: 35, partId: "neonoire-part-feature",
    title: "The pink payphone", location: "INT. ROADSIDE INN, LOBBY", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, LOBBY - NIGHT #35#",
    page: "n35-roadside-inn-lobby-night.md", board: "n35-inn-lobby-payphone.md",
    cast: ["Jack", "Mr. Noda"],
    grammar: "35mm frontal; intercut with scene 36.",
    description: "Mr Noda asleep in front of the baseball while Jack feeds the pink payphone coins, receipts in his fist: maybe, I'll know tomorrow. Neither of them hangs up until the coins run out. BOARDED — 1 shot (209).",
    lightingNotes: "Warm lobby tungsten against the baseball's cold green.",
  },
  {
    key: "s36", id: "neonoire-s36", n: 36, partId: "neonoire-part-feature",
    title: "Come back safe anyway", location: "INT. VERA'S APARTMENT", time: "NIGHT",
    kind: "Standard", lighting: "Low key", slugline: "INT. VERA'S APARTMENT - NIGHT #36#",
    page: "n36-vera-s-apartment-night.md", board: "n36-vera-apartment-night.md",
    cast: ["Vera Voss"],
    grammar: "50mm at floor height; the phone light is the only lamp.",
    description: "Mara? — no: it's me. Vera on the floor in the dark with the phone's small warm light, come back safe, come back safe anyway, and both of them holding on a moment longer than they need to. The coast. An inn off the highway — that much he says; that much only. BOARDED — 1 shot (210).",
    lightingNotes: "A warm pool of phone light in a cold dark room.",
  },
  {
    key: "s37", id: "neonoire-s37", n: 37, partId: "neonoire-part-feature",
    title: "The keys are always in it", location: "INT. ROADSIDE INN, KITCHEN DOORWAY", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, KITCHEN DOORWAY - NIGHT #37#",
    page: "n37-roadside-inn-kitchen-doorway-night.md", board: "n37-inn-kitchen-doorway.md",
    cast: ["Jack", "Mrs. Noda"],
    grammar: "35mm from inside the doorway; the last warm night.",
    description: "Jack can't sleep; the back door stands open to the rain and Mrs Noda sits on the step under the eave smoking. Don't tell my husband. The muddy yard, the gate, and the pickup parked crooked with the keys always in it. BOARDED — 1 shot (211).",
    lightingNotes: "Doorway tungsten behind, blue rain beyond; warmth with an omen.",
  },
  {
    key: "s42", id: "neonoire-s42", n: 42, partId: "neonoire-part-feature",
    title: "The third time", location: "INT. ROADSIDE INN, BATHROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, BATHROOM - CONTINUOUS #42#",
    page: "n42-roadside-inn-bathroom-continuous.md", board: "n42-inn-bathroom-escape.md",
    cast: ["Jack"],
    grammar: "35mm from the doorway; the warm room gone steel blue.",
    description: "Dark, steam still hanging: Jack on the tub's edge hits the swollen frame until it cracks and rain pours in — boots in the corridor. He hauls himself through. BOARDED — 1 shot (212).",
    lightingNotes: "Steel blue and blue-black; rain white through the cracked frame.",
  },
  {
    key: "s43", id: "neonoire-s43", n: 43, partId: "neonoire-part-feature",
    title: "Wet tin", location: "EXT. ROADSIDE INN, KITCHEN ROOF", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. ROADSIDE INN, KITCHEN ROOF - CONTINUOUS #43#",
    page: "n43-roadside-inn-kitchen-roof-continuous.md", board: "n43-inn-kitchen-roof.md",
    cast: ["Jack"],
    grammar: "35mm from the yard; one warm spill above.",
    description: "A low slope of wet tin below the bathroom window: Jack drops onto it, slides, catches the gutter, swings down. BOARDED — 1 shot (213).",
    lightingNotes: "Steel blue rain, one warm spill from the cracked bathroom window.",
  },
  {
    key: "s44", id: "neonoire-s44", n: 44, partId: "neonoire-part-feature",
    title: "Stay whatever you hear", location: "INT. ROADSIDE INN, KITCHEN", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ROADSIDE INN, KITCHEN - CONTINUOUS #44#",
    page: "n44-roadside-inn-kitchen-continuous.md", board: "n44-inn-kitchen-pantry.md",
    cast: ["Jack", "Mrs. Noda"],
    grammar: "35mm along the counter; whispered, low, level.",
    description: "Through the back door into the kitchen where Mrs Noda crouches rigid behind the steel counter: stay, whatever you hear; I'll get him. Then low along the wall towards the lobby. BOARDED — 1 shot (214).",
    lightingNotes: "Cold steel blue with one tungsten bulb over the counter.",
  },
  {
    key: "s46", id: "neonoire-s46", n: 46, partId: "neonoire-part-feature",
    title: "Clutch each other", location: "INT. ROADSIDE INN, KITCHEN", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. ROADSIDE INN, KITCHEN - CONTINUOUS #46#",
    page: "n46-roadside-inn-kitchen-continuous.md", board: "n46-inn-kitchen-pantry-door.md",
    cast: ["Jack", "Mr. Noda", "Mrs. Noda"],
    grammar: "35mm at the pantry door; whispers only.",
    description: "Jack shuts the pantry door on the clutching old couple with an apology, and goes out the back into the rain. BOARDED — 1 shot (215).",
    lightingNotes: "One work lamp; the pantry dark behind the door.",
  },
  {
    key: "s48", id: "neonoire-s48", n: 48, partId: "neonoire-part-feature",
    title: "Come on come on", location: "INT. PICKUP TRUCK", time: "CONTINUOUS",
    kind: "Standard", lighting: "Low key", slugline: "INT. PICKUP TRUCK - CONTINUOUS #48#",
    page: "n48-pickup-truck-continuous.md", board: "n48-pickup-cab.md",
    cast: ["Jack"],
    grammar: "50mm from the passenger side; the key is the whole scene.",
    description: "The keys are in the ignition exactly where she said; the engine coughs, dies, catches, roars, and the windscreen cracks as a round goes through it. BOARDED — 1 shot (216).",
    lightingNotes: "One dim dash light; rain on glass.",
  },
  {
    key: "s49", id: "neonoire-s49", n: 49, partId: "neonoire-part-feature",
    title: "No need to chase", location: "EXT. ROADSIDE INN, BACK YARD", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. ROADSIDE INN, BACK YARD - CONTINUOUS #49#",
    page: "n49-roadside-inn-back-yard-continuous.md", board: "n49-eight-in-the-headlights.md",
    cast: ["The Masked Men"],
    grammar: "35mm wide and low; the taillight is the period.",
    description: "Eight masked men stand in eight headlight beams watching one red taillight shrink into the rain; they don't chase him, they don't need to. BOARDED — 1 shot (217).",
    lightingNotes: "Headlight cones in rain; one red taillight far away.",
  },
  {
    key: "s50", id: "neonoire-s50", n: 50, partId: "neonoire-part-feature",
    title: "Hand starts to shake", location: "INT. PICKUP TRUCK", time: "MOVING - DAWN",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. PICKUP TRUCK - MOVING - DAWN #50#",
    page: "n50-pickup-truck-moving-dawn.md", board: "n50-drained-dawn.md",
    cast: ["Jack"],
    grammar: "50mm from the passenger seat; the mirror tells him nothing.",
    description: "The drained dawn: blood, a shattered windscreen, soaked receipts, and two names he counts and doesn't want to count. BOARDED — 1 shot (218).",
    lightingNotes: "Grey-green desaturation; no warmth anywhere.",
  },
  {
    key: "s51", id: "neonoire-s51", n: 51, partId: "neonoire-part-feature",
    title: "The model, corrected", location: "INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT", time: "DAWN",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT - DAWN #51#",
    page: "n51-chairman-s-office-kurose-development-dawn.md", board: "n51-hat-in-hand.md",
    cast: [],
    grammar: "35mm static, square to the table; 85mm only for the hand and the watch. The only move in the scene is a hand lifting a neighbourhood off a plaza.",
    description: "Dawn, as rewritten 30 September 2026 — wordless. The fortieth floor, nobody in the leather chairs. On its long table the model of the redevelopment: glass towers, sponge trees, a broad white plaza, and at the plaza's edge one small, dark, patched block out of place among the towers — the Hive. A man's clean hand, expensive watch, lifts the Hive out of the model and sets it on a tray beside a cup of tea. The plaza underneath is already finished; tiny painted people cross it. BOARDED — 2 shots (310–311, the 30 September revision boards); the old pair (219, 274) was retired with the two-man scene it boarded.",
    lightingNotes: "Dawn grey glass, the room unlit; one warm note, the cup of tea on the tray.",
  },
  {
    key: "s52", id: "neonoire-s52", n: 52, partId: "neonoire-part-feature",
    title: "She pulls him in", location: "INT. VERA'S APARTMENT", time: "DAWN",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. VERA'S APARTMENT - DAWN #52#",
    page: "n52-vera-s-apartment-dawn.md", board: "n52-she-pulls-him-in.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "50mm in the doorway; two words and a pulled arm.",
    description: "A knock at dawn: Jack soaked with blood dried on his face, and Vera pulling him in out of the grey hall light. BOARDED — 1 shot (220).",
    lightingNotes: "Dawn grey hall against warm apartment dark.",
  },
  {
    key: "s53", id: "neonoire-s53", n: 53, partId: "neonoire-part-feature",
    title: "Pink water", location: "INT. VERA'S APARTMENT, BATHROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. VERA'S APARTMENT, BATHROOM - CONTINUOUS #53#",
    page: "n53-vera-s-apartment-bathroom-continuous.md", board: "n53-pink-water.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "50mm low and close; the cloth, the water, the face.",
    description: "She cleans the cut while he measures her face; pink water, a plaster, a hand stayed on his face, and a kiss that changes everything. She asks twice — the second answer she gives herself; then the phone rings and she turns it face-down before whatever that is, and it stays face-down: it is another promise. BOARDED — 2 shots (221, and 275, the face-down phone).",
    lightingNotes: "One warm bulb on white tile; the first warmth since the inn.",
  },
  {
    key: "s54", id: "neonoire-s54", n: 54, partId: "neonoire-part-feature",
    title: "Everything is still there", location: "EXT. OLD TOBACCO KIOSK", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. OLD TOBACCO KIOSK - DAY #54#",
    page: "n54-old-tobacco-kiosk-day.md", board: "n54-old-tobacco-kiosk.md",
    cast: ["Vera Voss"],
    grammar: "50mm at the window; a photograph held up to glass.",
    description: "The old photograph meets the old tobacconist: Kaneko's. Of course. In the Hive. Not for long, though. BOARDED — 1 shot (222).",
    lightingNotes: "Arcade fluorescents, faded reds and creams.",
  },
  {
    key: "s55", id: "neonoire-s55", n: 55, partId: "neonoire-part-feature",
    title: "They match", location: "INT. THE HIVE, PASSAGES", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. THE HIVE, PASSAGES - DAY #55#",
    page: "n55-the-hive-passages-day.md", board: "n55-they-match.md",
    cast: ["Vera Voss"],
    grammar: "35mm down the passage; photograph and reality in one frame.",
    description: "Vera walks the Hive by day with the photograph, and the counter and its 金子 sign match it exactly. BOARDED — 1 shot (223).",
    lightingNotes: "Bare bulbs and grey day light; dust in the beams.",
  },
  {
    key: "s47", id: "neonoire-s47", n: 47, partId: "neonoire-part-feature",
    title: "Mud and impacts", location: "EXT. ROADSIDE INN, BACK YARD", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. ROADSIDE INN, BACK YARD - CONTINUOUS #47#",
    page: "n47-roadside-inn-back-yard-continuous.md", board: "n47-inn-back-yard.md",
    cast: ["Jack", "The Masked Men"],
    grammar: "35mm low in the mud; impacts, not weapons.",
    description: "A masked man rounds the building; Jack runs, dives behind the pickup as its wheel collapses, and yanks the door open flat along the seat. BOARDED — 1 shot (224).",
    lightingNotes: "Weaponless rain: impacts, mud, one collapsed wheel.",
  },
  {
    key: "s56", id: "neonoire-s56", n: 56, partId: "neonoire-part-feature",
    title: "The third stool", location: "INT. KANEKO'S NOODLE COUNTER", time: "CONTINUOUS",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. KANEKO'S NOODLE COUNTER - CONTINUOUS #56#",
    page: "n56-kaneko-s-noodle-counter-continuous.md", board: "n56-vera-on-the-third-stool.md",
    cast: ["Vera Voss", "Kaneko"],
    grammar: "35mm frontal to the counter, as always.",
    description: "Vera on the third stool: I was here when I was a child. Kaneko freezes for just a second at the pot — he always paid too much. BOARDED — 2 shots (225, and 266, the count).",
    lightingNotes: "Lunchtime steam and grey daylight.",
  },
  {
    key: "s57", id: "neonoire-s57", n: 57, partId: "neonoire-part-feature",
    title: "Three feet away", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - CONTINUOUS #57#",
    page: "n57-the-hive-noodle-shop-storeroom-continuous.md", board: "n57-three-feet-of-curtain.md",
    cast: ["Mara Voss"],
    grammar: "50mm on Mara; the gap does the rest.",
    description: "Both hands over her mouth at her sister's voice; through the curtain gap, three feet away, the back of Vera's head. Her hand lifts, and drops. BOARDED — 1 shot (226).",
    lightingNotes: "One bare bulb; the counter's steam light through the gap.",
  },
  {
    key: "s58", id: "neonoire-s58", n: 58, partId: "neonoire-part-feature",
    title: "Bring her", location: "INT. KANEKO'S NOODLE COUNTER", time: "CONTINUOUS",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. KANEKO'S NOODLE COUNTER - CONTINUOUS #58#",
    page: "n58-kaneko-s-noodle-counter-continuous.md", board: "n58-bring-her.md",
    cast: ["Vera Voss", "Kaneko"],
    grammar: "35mm frontal; the money on the counter is the rhyme.",
    description: "She eats all of it and pays too much, her father's habit inherited; when I find her I'll bring her here — yes, bring her. BOARDED — 1 shot (227).",
    lightingNotes: "Steam, warm tube light.",
  },
  {
    key: "s59", id: "neonoire-s59", n: 59, partId: "neonoire-part-feature",
    title: "It rings. Nobody answers.", location: "EXT. THE HIVE", time: "CONTINUOUS",
    kind: "Standard", lighting: "Overcast soft", slugline: "EXT. THE HIVE - CONTINUOUS #59#",
    page: "n59-the-hive-continuous.md", board: "n59-glowing-in-the-rain.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "50mm in the wet street; 35mm across the INTERCUT to the silent house. Her glow, his scan, and a dial tone in a room where nobody is left to hear it.",
    description: "Continuous, as rewritten 30 September 2026. At the payphone under the tin awning Jack holds the ringing receiver; INTERCUT, the kotatsu, the altar, the teacup on its side — the phone rings in Mrs. Sakai's empty room. Vera comes out of the Hive glowing: the shop is real, the woman remembered them, and a newspaper editor and a promised car are in her mouth in the same breath. It rings; nobody answers; he hangs up. BOARDED — 1 shot (228, re-quoted the same day and held RETAKE PENDING: the embrace the image shows is out of the scene).",
    lightingNotes: "Grey rain; the Hive's dark mouth.",
  },
  {
    key: "s60", id: "neonoire-s60", n: 60, partId: "neonoire-part-feature",
    title: "I want my sister", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - NIGHT #60#",
    page: "n60-the-hive-noodle-shop-storeroom-night.md", board: "n60-i-want-my-sister.md",
    cast: ["Jack", "Mara Voss"],
    grammar: "35mm across the futon; the key changes hands for the last time.",
    description: "Find what it opens and then this ends: the key, on its shoelace round her neck, passes into his hand, its worn tag reading 114, and with it the trap Ishida will set. BOARDED — 1 shot (229).",
    lightingNotes: "One bare bulb, flour dust.",
  },
  {
    key: "s61", id: "neonoire-s61", n: 61, partId: "neonoire-part-feature",
    title: "Nine o'clock", location: "INT. ISHIDA'S CAR", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. ISHIDA'S CAR - NIGHT #61#",
    page: "n61-ishida-s-car-night.md", board: "n61-nine-oclock.md",
    cast: ["Jack", "Detective Ishida"],
    grammar: "50mm from the back seat; two profiles and a dash glow.",
    description: "Neither looks at the other: a safe car, a safe house, no paperwork — and Sakai's thing? Where else would the Voss girl go — you took me there yourself, twenty years ago. Jack looks at the hands on the wheel and does not ask. You've done well, Jack. BOARDED — 1 shot (230).",
    lightingNotes: "Dash glow inside, sodium orange under the expressway.",
  },
  {
    key: "s62", id: "neonoire-s62", n: 62, partId: "neonoire-part-feature",
    title: "Like a date", location: "EXT. PEDESTRIAN CROSSING", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. PEDESTRIAN CROSSING - NIGHT #62#",
    page: "n62-pedestrian-crossing-night.md", board: "n62-like-a-date.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "35mm wide and low, as shot 204, now at night.",
    description: "Ten o'clock, the old hotel by the station: the signal green, the melody, and her arm in his. BOARDED — 1 shot (231).",
    lightingNotes: "Signal green on wet stripes; one warm sign far down.",
  },
  {
    key: "s63", id: "neonoire-s63", n: 63, partId: "neonoire-part-feature",
    title: "No questions", location: "INT. KATO RENTAL LOCKERS, UENO", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. KATO RENTAL LOCKERS, UENO - NIGHT #63#",
    page: "n63-kato-rental-lockers-ueno-night.md", board: "n63-kato-rental-lockers.md",
    cast: ["Jack"],
    grammar: "35mm down the rows; 85mm on the flyleaf and on the cassette; the lockers rattle like doors being tried.",
    description: "Night, under the arch. The key opens 114: a padded envelope, taped shut, and under it a small water-stained notebook. In the envelope, a cassette labelled in a shaking hand: SHIOHAMA. On the flyleaf: DANIEL VOSS. A page near the end carries a line underlined twice; he reads it, and we see his face, not the page. The lockers rattle in their rows like a room full of doors being tried. BOARDED — 3 shots (232, the rows, re-quoted; 259, the cassette; and 312, the flyleaf — the third of the seven named close-ups).",
    lightingNotes: "One fluorescent tube in grey steel; dust in the light.",
  },
  {
    key: "s64", id: "neonoire-s64", n: 64, partId: "neonoire-part-feature",
    title: "Behind the counter", location: "INT. SMALL BAR, KANDA", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. SMALL BAR, KANDA - NIGHT #64#",
    page: "n64-small-bar-kanda-night.md", board: "n64-behind-the-counter.md",
    cast: ["Jack", "Okada"],
    grammar: "35mm across the counter; a cassette under the cash tray.",
    description: "Keep this for me; not the police, not me if I ask with someone behind me. Behind the counter, like the girl's clip. BOARDED — 2 shots (233, and 264, the cassette).",
    lightingNotes: "One warm bulb behind the bottles; the CRT dark.",
  },
  {
    key: "s65", id: "neonoire-s65", n: 65, partId: "neonoire-part-feature",
    title: "The wine-red dress", location: "INT. VERA'S APARTMENT", time: "EVENING",
    kind: "Standard", lighting: "Blue hour", slugline: "INT. VERA'S APARTMENT - EVENING #65#",
    page: "n65-vera-s-apartment-evening.md", board: "n65-the-wine-red-dress.md",
    cast: ["Vera Voss"],
    grammar: "Wide and patient; the dress is the only saturated colour in the room.",
    description: "Rain on the window, the last grey light, a box marked TOKYO. BOARDED — 1 shot (234).",
    lightingNotes: "Cold blue at the glass, one warm bedside lamp; the wine-red silk carries the frame.",
  },
  {
    key: "s66", id: "neonoire-s66", n: 66, partId: "neonoire-part-feature",
    title: "Waiting for someone", location: "INT. HOTEL LOUNGE", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. HOTEL LOUNGE - NIGHT #66#",
    page: "n66-hotel-lounge-night.md", board: "n66-waiting-for-someone.md",
    cast: ["Vera Voss"],
    grammar: "Amber and olive, brass and bottles; the warmest room in the film.",
    description: "A gin and tonic, a pianist in white, and the blue umbrella on the next stool. BOARDED — 1 shot (235).",
    lightingNotes: "Amber and olive warmth; the cold night only in window reflections.",
  },
  {
    key: "s67", id: "neonoire-s67", n: 67, partId: "neonoire-part-feature",
    title: "A different clock", location: "EXT. SERVICE ROAD BEHIND THE HIVE", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. SERVICE ROAD BEHIND THE HIVE - NIGHT #67#",
    page: "n67-service-road-behind-the-hive-night.md", board: "n67-a-different-clock.md",
    cast: [],
    grammar: "One sodium lamp, a row of pillars, and a car that is waiting.",
    description: "8:52 on a lit sign; the grey sedan waits with the engine running. BOARDED — 1 shot (236).",
    lightingNotes: "Sodium orange against blue-black; rain pooling on the asphalt.",
  },
  {
    key: "s68", id: "neonoire-s68", n: 68, partId: "neonoire-part-feature",
    title: "Rice balls for the car", location: "INT. THE HIVE, NOODLE SHOP STOREROOM", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, NOODLE SHOP STOREROOM - CONTINUOUS #68#",
    page: "n68-the-hive-noodle-shop-storeroom-continuous.md", board: "n68-rice-balls-for-the-car.md",
    cast: ["Mara Voss", "Kaneko"],
    grammar: "The warmest light in the Hive, on two faces and a parcel.",
    description: "A parcel in newspaper, a bow too deep, and a hand on the head like a grandmother. BOARDED — 1 shot (237).",
    lightingNotes: "Tungsten amber with green fluorescent spill beyond the curtain.",
  },
  {
    key: "s69", id: "neonoire-s69", n: 69, partId: "neonoire-part-feature",
    title: "Vera would love this", location: "INT. THE HIVE, PASSAGES", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, PASSAGES - NIGHT #69#",
    page: "n69-the-hive-passages-night.md", board: "n69-vera-would-love-this.md",
    cast: ["Jack", "Mara Voss", "The Radio Repairman"],
    grammar: "Bare bulbs and open doors; the Hive's other lives, seen once.",
    description: "Doors open onto other lives, and Mara memorises them; Jack is meeting Vera at ten. BOARDED — 1 shot (238).",
    lightingNotes: "Sodium amber bulbs against sick fluorescent green; warm rectangles at every open door.",
  },
  {
    key: "s70", id: "neonoire-s70", n: 70, partId: "neonoire-part-feature",
    title: "Position", location: "EXT. SERVICE ROAD BEHIND THE HIVE", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. SERVICE ROAD BEHIND THE HIVE - CONTINUOUS #70#",
    page: "n70-service-road-behind-the-hive-continuous.md", board: "n70-position.md",
    cast: ["Jack", "Mara Voss"],
    grammar: "Twenty metres of wet asphalt; the dread is posture and distance.",
    description: "A wrist at a sleeve, one word in Japanese, and two men understanding each other. BOARDED — 1 shot (239).",
    lightingNotes: "One sodium lamp pooling on wet asphalt; the pillars black against it.",
  },
  {
    key: "s71", id: "neonoire-s71", n: 71, partId: "neonoire-part-feature",
    title: "Everyone's awake", location: "INT. THE HIVE, PASSAGE", time: "CONTINUOUS",
    kind: "Standard", lighting: "Practical night", slugline: "INT. THE HIVE, PASSAGE - CONTINUOUS #71#",
    page: "n71-the-hive-passage-continuous.md", board: "n71-everyones-awake.md",
    cast: ["Jack", "Mara Voss", "Kaneko", "The Radio Repairman"],
    grammar: "The floor of the passage, and a thousand windows waking above it.",
    description: "The stairwell door. Jack bolts it; shots splinter the wood. Mara dies against the wall, hand dark and wet, under a thousand waking windows, with one thing left to say: Tell her. At her feet the split bag — rice balls, a toothbrush, the cardigan, and pages of drawings soaking in the thin stream that runs along the floor, which Kaneko and the old woman kneel to gather, page by page, while Jack holds on. The apron folded under her head; the bulbs swing; nothing is explained. BOARDED — 2 shots (240, and 313, the drawings in the water — the fourth of the seven named close-ups).",
    lightingNotes: "Cold corridor green at floor level; warm tungsten rectangles multiplying above.",
  },
  {
    key: "s25a", id: "neonoire-s25a", n: 25, partId: "neonoire-part-feature",
    title: "Breakfast", location: "INT. TINY BREAKFAST COUNTER, NEAR THE STATION", time: "MORNING",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. TINY BREAKFAST COUNTER, NEAR THE STATION - MORNING #25A#",
    page: "n25a-tiny-breakfast-counter-near-the-station-morning.md", board: "n25a-breakfast-counter.md",
    cast: ["Vera Voss", "Jack"],
    grammar: "Fogged glass, a siphon flame, and a plate she didn't ask for.",
    description: "Mara's line paid in full: thick toast, a boiled egg, cabbage nobody asked for. You sound like my sister — and his hand stops on the cup. BOARDED — 3 shots (287–289).",
    lightingNotes: "Grey morning through fogged glass; siphon flame and a cooking-show CRT doing the warmth.",
  },
  {
    key: "s27a", id: "neonoire-s27a", n: 27, partId: "neonoire-part-feature",
    title: "She was here", location: "INT. SMALL BAR, KANDA", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. SMALL BAR, KANDA - DAY #27A#",
    page: "n27a-small-bar-kanda-day.md", board: "n27a-she-was-here.md",
    cast: ["Okada", "Vera Voss"],
    grammar: "Daylight in a bar where someone died, and a woman crouching where her sister hid.",
    description: "Vera on her own: Okada on Jack carrying things by himself; then Vera asks Show me where, and stands on the floor behind the counter, exactly where Mara crouched, while the man of the house flaps at the memory he cannot put down. BOARDED — 3 shots (290–292).",
    lightingNotes: "Flat grey daylight as scene 8; the CRT stays dark.",
  },
  {
    key: "s63a", id: "neonoire-s63a", n: 63, partId: "neonoire-part-feature",
    title: "Not another day", location: "EXT. UENO, UNDER THE RAILWAY ARCHES", time: "NIGHT",
    kind: "Standard", lighting: "Practical night", slugline: "EXT. UENO, UNDER THE RAILWAY ARCHES - NIGHT #63A#",
    page: "n63a-ueno-under-the-railway-arches-night.md", board: "n63a-ueno-arches.md",
    cast: ["Jack"],
    grammar: "A sedan at walking pace, a wall of steel balls, and a tape he cannot carry another day.",
    description: "The hit team tails him from the lockers; he loses them through a pachinko parlour. Why the tape goes to Okada's. BOARDED — 4 shots (293–296).",
    lightingNotes: "Sodium and rain on brick arches; pachinko light; vending-machine white on the cassette.",
  },
  {
    key: "s53a", id: "neonoire-s53a", n: 53, partId: "neonoire-part-feature",
    title: "There was no car", location: "INT. TOTO SHIMBUN NEWSROOM", time: "DAY",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. TOTO SHIMBUN NEWSROOM - DAY #53A#",
    page: "n53a-toto-shimbun-newsroom-day.md", board: "n53a-vera-at-the-toto-shimbun.md",
    cast: ["Vera Voss", "Harada", "The Journalist"],
    grammar: "The scene 82 newsroom by day, three channels at once, and two women across a desk with a photograph between them. Ordinary volume, static camera; the only stillness is Vera hearing that a car was promised and never came.",
    description: "Story pass 2, 29 September 2026. Vera goes to the Toto Shimbun alone with Kondo's card and learns he told two people about the one o'clock: Harada, and a detective who promised to keep a car nearby — there was no car. She leaves her number on the card beside his photograph. BOARDED — 3 shots (297–299).",
    lightingNotes: "Fluorescent office grey with rain on the high windows; the three TVs do the colour.",
  },
  {
    key: "s82a", id: "neonoire-s82a", n: 82, partId: "neonoire-part-feature",
    title: "The notebook photocopied", location: "INT. TOTO SHIMBUN NEWSROOM, CORRIDOR", time: "LATER",
    kind: "Standard", lighting: "Overcast soft", slugline: "INT. TOTO SHIMBUN NEWSROOM, CORRIDOR - LATER #82A#",
    page: "n82a-toto-shimbun-newsroom-corridor-later.md", board: "n82a-the-notebook-photocopied.md",
    cast: ["Vera Voss", "Harada", "Jack"],
    grammar: "Jack talking behind the glass where Vera cannot hear him, and a photocopier making her father's handwriting flash white. The evidence chain starts here: every page copied, the original into the safe, and the folder that will go to Kurose.",
    description: "Story pass 2, 29 September 2026. Harada photocopies every page of Daniel's notebook — the original goes in the paper's safe — and hands Vera the copies with the hook: Kondo's redevelopment files, and the grey car from the Hive registered to a Kurose company. She will carry the folder into Kurose's office. BOARDED — 3 shots (300–302).",
    lightingNotes: "Office grey; the copier's bar of light is the only moving light in the scene.",
  },
  {
    key: "s99a", id: "neonoire-s99a", n: 99, partId: "neonoire-part-feature",
    title: "The finished plaza", location: "EXT. THE PLAZA, WHERE THE HIVE WAS", time: "DAY",
    kind: "Standard", lighting: "Natural daylight", slugline: "EXT. THE PLAZA, WHERE THE HIVE WAS - DAY #99A#",
    page: "n99a-the-plaza-where-the-hive-was-day.md", board: "n99a-the-finished-plaza.md",
    cast: [],
    grammar: "Months later. Winter light, thin and clear; no rain. The model built and the patch erased: pale paving, a strip of new grass, a bench nobody sits on, glass towers on three sides, and real people crossing exactly like the painted ones. No fountain, no hoarding, no gardener, no train — the last sequence is stripped back to the revision's one sentence: nothing marks where anything was.",
    description: "Rewritten 30 September 2026: the finished plaza, stripped of the story pass's fountain, hoarding and gardener. Months later, thin winter light, no rain. The white plaza from the model, built; real people cross it now, exactly like the painted ones. A strip of new grass. A bench nobody sits on. Nothing marks where anything was. BOARDED — 3 shots (305–307), re-quoted the same day and all three held RETAKE PENDING: their images show the fountain, the hoarding and the gardener the draft no longer contains.",
    lightingNotes: "Pale clear winter daylight; no sodium, no murk — the Hive's weather is gone with it.",
  },
];

/**
 * Every scene of the final screenplay. The draft marks each of its scenes with a trailing
 * ` #n#` marker; those markers are read straight off the fountain, so a scene the board has
 * not reached yet still exists in the workspace as *written, not boarded*. The seven opening
 * scenes keep their hand-authored board metadata; everyone else is derived, mechanically and
 * honestly, from the slugline itself.
 */
const MARKED_SLUG = /^(INT|EXT)[. ][A-Z0-9'’ /&().,-]+ - [A-Z][A-Z0-9'’ .,-]*#\d+[A-Z]?#$/;

export const sceneMarkers = fountain => {
  const found = [];
  fountain.split("\n").forEach((line, i) => {
    const m = MARKED_SLUG.exec(line.trim());
    if (m) {
      const [, n, suffix] = / #(\d+)([A-Z]?)#$/.exec(line.trim());
      found.push({ n: Number(n), suffix, line: i, text: line.trim() });
    }
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

/**
 * Scene numbers never move. The 30 September 2026 revision cut four scenes; their numbers stay
 * retired in the draft (like stable frame ids and asset filenames) rather than shifting every
 * scene, board and image after them. A skip is legal only where the ledger below says a scene
 * was cut; everything else must still run in order.
 */
export const CUT_SCENES = new Set([13, 24, 97, 99]);

export function featureScenes(fountain) {
  const lines = fountain.split("\n");
  const marks = sceneMarkers(fountain);
  if (!marks.length) throw new Error(`${FOUNTAIN} carries no numbered scenes — every scene heading must end with its " #n#" marker.`);
  // The numbered scenes run 1..N in order. A scene added after the numbering was fixed carries its
  // neighbour's number plus a letter (`#25A#`) and sits directly after that neighbour, so nothing
  // already boarded is renumbered. Cut scenes retire their number (CUT_SCENES); they never move.
  let base = 0;
  let lastSuffix = "";
  marks.forEach(mark => {
    if (!mark.suffix) {
      let expected = base + 1;
      while (CUT_SCENES.has(expected)) expected += 1;
      if (mark.n !== expected) throw new Error(`${FOUNTAIN} scene markers must run 1..N in order; after scene ${base} comes #${mark.n}#`);
      base = mark.n;
      lastSuffix = "";
    } else {
      // An inserted scene follows its base scene; a base that was itself cut (99A after 99) is allowed too.
      const cutBase = mark.n === base + 1 && CUT_SCENES.has(mark.n);
      if ((mark.n !== base && !cutBase) || (mark.n === base && mark.suffix <= lastSuffix)) throw new Error(`${FOUNTAIN} inserted scene #${mark.n}${mark.suffix}# must follow scene ${mark.n} in letter order`);
      lastSuffix = mark.suffix;
    }
  });
  const straySlug = lines.findIndex((line, i) => /^(INT|EXT)[. ].* - /.test(line.trim()) && !/ #\d+[A-Z]?#$/.test(line.trim())
    // an intercut mini-slug belongs to the scene above it, not to its own page
    && !(lines.slice(0, i).map(l => l.trim()).filter(Boolean).pop() === "INTERCUT WITH:"));
  if (straySlug >= 0) throw new Error(`${FOUNTAIN} line ${straySlug + 1} reads like a scene heading but carries no " #n#" marker — mark it, or the Screenplay tab loses a scene.`);
  return marks.map((mark, i) => {
    const bare = mark.text.replace(/ #\d+[A-Z]?#$/, "");
    const label = `${mark.n}${mark.suffix}`;
    const tag = label.toLowerCase();
    const at = bare.indexOf(" - ");
    const derived = { n: mark.n, label, location: bare.slice(0, at), time: bare.slice(at + 3), slugline: mark.text, line: mark.line };
    const hand = SCENES.find(scene => scene.key === `s${tag}`);
    if (hand) {
      if (hand.location !== derived.location || hand.time !== derived.time) throw new Error(`The boarded scene ${hand.n} no longer matches ${FOUNTAIN}: the draft says "${derived.location} - ${derived.time}", the board says "${hand.location} - ${hand.time}".`);
      return { ...hand, ...derived, boarded: true };
    }
    const opener = (lines.slice(mark.line + 1).find(line => line.trim()) || "").trim().replace(/\s+/g, " ");
    const quote = opener.length > 180 ? `${opener.slice(0, 177).trimEnd()}…` : opener;
    return {
      ...derived,
      boarded: false,
      key: `s${tag}`, id: `neonoire-s${tag}`, partId: "neonoire-part-feature",
      title: humanTitle(derived.location),
      kind: "Standard",
      ...(lightingForTime(derived.time) ? { lighting: lightingForTime(derived.time) } : {}),
      page: `n${String(mark.n).padStart(2, "0")}${mark.suffix.toLowerCase()}-${pageSlug(bare)}.md`,
      board: null, cast: [],
      grammar: grammar,
      description: `WRITTEN, NOT BOARDED — no numbered shot board yet. Scene ${label} of the final screenplay${mark.suffix ? " (added after the numbering was fixed, so it carries its neighbour's number and a letter)" : ""}; the Screenplay tab carries its page, and the board covers selected scenes elsewhere. ${quote ? `The draft opens it: "${quote}".` : ""}`.trim(),
      lightingNotes: undefined,
    };
  });
}

export const ORDER = SCENES.map(scene => scene.page);
export const sceneById = key => SCENES.find(scene => scene.key === key || scene.id === key);

export const ACT = {
  id: actId,
  title: "The screenplay — Kanda to the new counter",
  description: "The final feature draft, scene by scene: the opening in Kanda and the police station, then the film proper. 307 numbered shots cover every scene — 100 numbered plus the six inserted scenes (25A, 27A, 53A, 63A, 82A, 99A); nothing is left written, not boarded.",
  parts: [
    { id: "neonoire-part-1", title: "Kanda, night", description: "The cold open and the bar: the killing, the key, and the notebook that leaves with them." },
    { id: "neonoire-part-2", title: "Three days later", description: "Vera's apartment: two cups, one photograph, an answerphone message, and a blue umbrella that is still bone dry." },
    { id: "neonoire-part-3", title: "The police station", description: "A missing-person report, an interview in Japanese, and a drawer that closes on a wet purse." },
    { id: "neonoire-part-feature", title: "The film proper", description: "Scenes 8–100 of the final screenplay — the key's price, the Hive, Kurose, the roadside inn, the long collapse, and a new counter under the railway. Scenes 8–17, the roadside inn (31, 32, 34, 38–41, 45) and 72–100 are boarded; the rest are written, not yet boarded." },
  ],
};

// ---------------------------------------------------------------------------------------------
// Reading the draft, and splitting it into the Screenplay tab's pages
// ---------------------------------------------------------------------------------------------

export const readFountain = root => readFileSync(resolve(root, FOUNTAIN), "utf8");

/** The `#1#` … `#7#` markers are the draft's scene numbering, not screenplay text. */
export const cleanScript = text => text.replace(/ #\d+[A-Z]?#(?=\n|$)/g, "");

export const countMarkers = text => (text.match(/ #\d+[A-Z]?#(?=\n|$)/g) || []).length;

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
    "NOBODY'S WITNESS",
    `${scene.boarded && scene.n <= 7 ? "OPENING" : "SCREENPLAY"} — SCENE ${scene.label ?? scene.n} — ${scene.location}`,
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
  // The first boarding runs 1..240 in SCENES order and is never renumbered. Coverage shots
  // (241+) follow that block in the file. A later pass may add 251+ to a scene that already
  // holds earlier coverage, so those numbers need not be contiguous; the builder sorts by number.
  const PRIMARY_CEILING = 240;
  const primary = shots.filter(shot => shot.n <= PRIMARY_CEILING);
  let seenCoverage = false;
  for (const shot of shots) {
    if (shot.n > PRIMARY_CEILING) seenCoverage = true;
    else if (seenCoverage) throw new Error(`Scene ${scene.n} puts a primary shot after a coverage shot`);
  }
  for (const [i, shot] of primary.entries()) {
    // 30 September 2026: the revision retires individual frames inside a scene, so the run may
    // skip numbers (retired numbers stay retired, like the cut scenes in featureScenes) — but
    // it must still ascend by one-or-more, never repeat and never reorder.
    if (i && shot.n <= primary[i - 1].n) throw new Error(`Scene ${scene.n} shot numbers must ascend (found ${shot.n} at position ${i + 1})`);
  }
  if (new Set(shots.map(shot => shot.n)).size !== shots.length) throw new Error(`Scene ${scene.n} repeats a shot number`);
  for (const shot of shots) {
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
    content: "A small key on a worn numbered tag \u2014 a coin-locker key, pressed into Mara's palm by a dying man with the words don't let them have it. Never explained in the opening, and the reason she is running.",
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
