// THE HIVE CANON — geometry locked 28 September 2026; NIGHT LOOK added 28 September 2026 (this pass).
//
// Part one, unchanged and not open to negotiation: the GEOMETRY. The Hive was boarded across five
// sessions from five look files (hive-first-look, hive-look, hive-morning-look, escape-look,
// ending-look), and each described the building a little differently: a squat six-storey block on a
// plaza (s15/184), a tall narrow tower on a tight street (s59/226), a nine-storey slab by a viaduct
// pillar (s92/135), a five-storey block with the railway at height behind it (s97), and an ordinary
// apartment block for the demolition (s99/156). Inside, s55/221 drew Kaneko's counter as a
// white-tiled corridor with the 金子 sign standing ON the counter, s68/235 gave the storeroom
// shelving and a teal doorway, and s85/119 drew the passage three men abreast where the draft says
// single file.
//
// The director's fix, recorded here as the single source of truth: the Hive is STEPPED. An
// eleven-storey tower fronts the main street; behind it a four-storey rear wing backs directly
// onto the elevated railway viaduct, its flat roof level with the viaduct's maintenance walkway
// and tracks. The noodle counter and the storeroom sit at ground level in the rear wing, directly
// under the viaduct — which is why trains shake them. That keeps every scene working: the tall
// facade on the street (scene 15), trains overhead inside (scenes 13 and 17), the service road
// behind (scene 70), the roof-to-track jump (scene 90), and a demolition that cuts open the
// tower (scene 99). It also resolves the draft's own contradiction — "eleven storeys" and a
// roof level with the railway — because the eleven storeys are the FRONT tower only.
//
// Part two, new this pass: the NIGHT LOOK. The Hive has been retrofitted for sixty years until the
// architecture has almost disappeared under pipes, ducts, cages, tanks and extra rooms, and at
// night it glows from within — hundreds of small tungsten windows and clusters of old handmade
// vertical-kanji neon belonging to the tiny businesses inside it, with steam, haze and light
// shafts in every space. The look changes the building's SURFACE and LIGHT only; every room,
// every count and every dimension above is untouched.
//
// Standing rules for the night look, in the director's words:
//   1. Every light in the Hive is small, handmade and belongs to someone who lives or works there.
//      No advertising, no brand names, no screens bigger than an old CRT, nothing futuristic.
//   2. Kaneko's counter and the storeroom stay MOSTLY WARM TUNGSTEN — they are home. Only faint
//      neon spill at the edges, coming in from the passage.
//   3. DAY (scene 97, the ceremony, and every daylight Hive scene): the same building with the
//      neon switched off — dead tubes, bare wiring, grey rain light, no haze glow.
//   4. DEMOLITION (scene 99): dead neon signs still hang from the exposed, cut-open floors.
//   5. Entrances are a threshold: stepping into the Hive goes from grey street light straight into
//      haze and colour; leaving, the colour drains behind the characters.
//   6. Never write a film title in a prompt. Describe the ingredients only.
//
// Scope note: this is the HIVE file. Vera's apartment, Jack's office, the police station, Kanda,
// the roadside inn, the hotel lounge and Kurose's office keep their own quiet, restrained look
// files (apartment-look, kanda-return-look, front-counter-look, interview-look, detectives-look,
// cold-open-look, streets-look, inn-look, confrontation-look, dawn-look, ishida-end-look,
// witness-look, ending-look for the non-Hive scenes). Nothing in this file is copied into them;
// scripts/verify-neonoire.mjs asserts the new wording appears in no other look file.
//
// Six canon sheets. hive-exterior, hive-section and hive-passages-roof were regenerated this pass
// against the new night look (in that order, each a reference for the next); hive-exterior-day was
// then generated from the night master as its daylight counterpart, because grey rain light shows
// the retrofit, the window pattern and the eleven storeys far more legibly than a night render, and
// because the day scenes (15–17, 55–59, 97, 99) need a master of their own. hive-counter and
// hive-storeroom were MEASURED, not regenerated: 95% and 100% of their lit pixels are warm, so they
// already read as warm tungsten and rule 2 holds them as they are.

/** Every scene of the draft that is set in the Hive, including the three still unboarded (67, 69, 71). */
export const hiveCanonScenes = new Set([
  "s13", "s15", "s16", "s17", "s25", "s55", "s56", "s57", "s58", "s59", "s60",
  "s67", "s68", "s69", "s70", "s71", "s84", "s85", "s86", "s87", "s88", "s89",
  "s90", "s91", "s92", "s97", "s99",
]);

/** The daylight Hive scenes: scenes 15–17 and 55–59 (continuous from day) and 97 (morning). */
export const hiveDayScenes = new Set(["s15", "s16", "s17", "s55", "s56", "s57", "s58", "s59", "s97"]);

/** The night Hive scenes, from the draft's own sluglines. */
export const hiveNightScenes = new Set([
  "s13", "s25", "s60", "s67", "s68", "s69", "s70", "s71", "s84", "s85", "s86",
  "s87", "s88", "s89", "s90", "s91", "s92",
]);

// ---------------------------------------------------------------- the surface and the light

/** The building's surface and light at night — replaces the old facade/lighting wording. */
export const hiveNightSurface = `The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. At night it glows from within: hundreds of small windows in warm tungsten, and clusters of old handmade neon signs in vertical Japanese kanji (red, magenta, cyan, green) belonging to tiny businesses — a noodle counter, a dentist, a radio repair shop, a karaoke bar — some tubes flickering or half dead. Steam vents from pipes and kitchens into the rain; haze hangs in every passage; light cuts through it in visible shafts. Rain runs down everything.`;

/** Added to every NIGHT Hive shot, interior and exterior. */
export const hiveNightLight = `Atmospheric haze in every space, practical lights only, strong backlight through steam, visible light shafts, coloured neon spill (magenta and cyan) mixed with warm tungsten bulbs, deep shadows, wet reflective surfaces, 35mm anamorphic film look, fine grain.`;

/** Rule 1 — every light belongs to somebody. */
export const hiveLightRule = `Every light in the Hive is small, handmade and belongs to someone who lives or works there: bare bulbs on flexes, one fluorescent tube, a green-shaded bench lamp, a hand-painted neon tube over a doorway the width of a shoulder. No advertising, no brand names, no screens bigger than an old CRT, nothing futuristic.`;

/** Rule 2 — the two warm rooms. */
export const hiveWarmRoomsLook = `Kaneko's counter and the storeroom stay MOSTLY WARM TUNGSTEN — they are home. Only faint neon spill at the edges, coming in from the passage: magenta and cyan rimming the noren curtain and the shutter gap, never washing the room.`;

/** Rule 3 — day, and the ceremony in scene 97. */
export const hiveDayLook = `DAY: the same building with the neon switched off — dead tubes, bare wiring, grey rain light, no haze glow. The retrofit is all still there — pipes, ducts, cages, water tanks, extra rooms bolted on in layers — but it reads as grey concrete, rust and wet dust in flat rain light, not as colour. Inside, the bare bulbs and the one fluorescent tube still burn, because the passages have no windows; nothing glows from the facade and there is no colour spill.`;

/** Rule 4 — the demolition. */
export const hiveDemolitionLook = `DEMOLITION: the floors are cut open and exposed to the sky, room stacked above empty room, and the dead neon signs still hang from them — unlit tubes, bare wiring, rusted brackets on the torn wall faces, dust in the air instead of steam.`;

/** Rule 5 — the entrances. */
export const hiveThresholdLook = `Entrances are a threshold: stepping into the Hive goes from grey street light straight into haze and colour, in one step, with no gradient; leaving it, the colour drains behind the characters and the street is grey again.`;

/** The light line a Hive shot carries, by scene. */
export function hiveShotLight(scene) {
  if (scene === "s99") return `${hiveDayLook} ${hiveDemolitionLook}`;
  if (hiveDayScenes.has(scene)) return hiveDayLook;
  return `${hiveNightSurface} ${hiveNightLight} ${hiveThresholdLook}`;
}

// ---------------------------------------------------------------- the canon and its negative

export const hiveCanon = `THE HIVE (canonical): a dense, self-built residential block in Tokyo, grown piece by piece since the 1960s. Two parts: an ELEVEN-STOREY front tower facing a wide modern street, and a FOUR-STOREY rear wing that backs directly onto a concrete elevated railway viaduct; the rear wing's flat roof is level with the viaduct's maintenance walkway and tracks. ${hiveNightSurface} Flanked on both sides by clean glass office towers, so the Hive looks like a gap in someone's teeth. A construction hoarding next door carries a KUROSE DEVELOPMENT banner showing a rendering of white towers and a plaza with a fountain. One narrow ground-floor entrance on the street side; a narrow back door onto a wet service road under the viaduct, lined with railway pillars.`;

/** Added to the Hive negative prompt by the night pass, 28 September 2026. */
export const hiveNightNegative = `holograms, flying cars, video billboards, LED screens, futuristic technology, robots, glossy chrome, sci-fi skyline, cyberpunk clothing, advertising, brand logos`;

export const hiveCanonNegative = `glass facade on the Hive, modern clean building, wide corridors, sign on the counter, tiled white walls, more or fewer than six stools, shelving units in the storeroom, cyberpunk neon, text errors, watermark, extra floors, the railway above the eleven-storey tower's roof, ${hiveNightNegative}`;

// ---------------------------------------------------------------- the five canon sheets

export const hiveCanonSheets = [
  {
    key: "hive-exterior",
    path: "/images/neonoire/sheets/hive-exterior.jpg",
    references: [],
    generated: "28 September 2026 — regenerated for the night look",
    prompt: `Location reference sheet, 16:9, 1920x1080, clean four-panel layout on dark grey, photoreal film-still quality, 35mm anamorphic, fine grain.
${hiveCanon}
${hiveNightLight}
${hiveLightRule}
PANEL 1 (large, left): the eleven-storey front tower at night in steady rain, three-quarter view, squeezed between two clean glass office towers, its surface buried under sixty years of bolted-on pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms; hundreds of small windows glowing warm tungsten; clusters of old handmade neon signs in vertical Japanese kanji — red, magenta, cyan and green — for a noodle counter, a dentist, a radio repair shop and a karaoke bar, some tubes flickering or half dead; steam venting from pipes and kitchens into the rain; haze hanging in the street; wet black asphalt reflecting every colour; the KUROSE DEVELOPMENT hoarding beside it; one tiny figure at the entrance for scale.
PANEL 2: the same front elevation, straight on, grey rainy DAYLIGHT — every neon tube dead and dark, bare wiring visible on the brackets, no glow, no colour.
PANEL 3: side elevation at night, showing the tower stepping down to the four-storey rear wing, the concrete railway viaduct running along the rear wing's roofline with a commuter train on it, the rear wing carrying the same tangle of pipes, ducts, cages and tanks, its lower floors in neon spill.
PANEL 4: the rear service road at night: the Hive's narrow back door under the viaduct, shuttered garages, railway pillars, steam from a kitchen vent, wet ground holding magenta and cyan reflections, one dim lamp.
Consistent architecture across all four panels: the same building, the same window pattern, the same handmade signs.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-section",
    path: "/images/neonoire/sheets/hive-section.jpg",
    references: ["/images/neonoire/sheets/hive-exterior.jpg"],
    generated: "28 September 2026 — regenerated for the night look",
    prompt: `Architectural cutaway cross-section illustration of THE HIVE AT NIGHT, 16:9, 1920x1080, detailed hand-painted technical illustration in the style of a 1990s Japanese large-format illustrated reference book, muted colours, every room visible with small figures living in it, thin legible labels in English, no garbled lettering.
${hiveCanon}
Section both masses: the eleven-storey front tower and the four-storey rear wing, with the concrete elevated railway viaduct running along the rear wing's roofline and a train on it. The outside of the building is buried under bolted-on pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms; clusters of old handmade vertical-kanji neon signs hang on the street face — a noodle counter, a dentist, a radio repair shop, a karaoke bar, some tubes flickering or half dead; every small window glows warm tungsten; steam vents from pipes and kitchens into the rain; haze hangs in the passages with light cutting through it in visible shafts.
Ground floor of the rear wing, directly beneath the viaduct: a tiny noodle counter with six stools, and behind it a curtained plywood storeroom with flour sacks and a single bulb. Narrow shoulder-width passages, single file. Label legibly: radio repair shop with a dozen radios, a family eating at a low table with a TV, an old woman asleep, a dentist's chair behind a curtain, the electrical main switch box, and FLOORS 1-11 on the tower. A narrow concrete stairwell rising from the rear passage to the rear wing's roof: water tanks, aerials, laundry poles, pigeon cages, a one-metre gap and a low fence onto the railway maintenance walkway beside the tracks.
Negative: ${hiveCanonNegative}`,
  },
  {
    // The daylight counterpart, 28 September 2026: the same building with the neon switched off.
    // Generated from the night master so the architecture is one building, and added because a grey
    // daylight sheet shows the retrofit, the window pattern and the storey count far more legibly
    // than a night render can — it is the sheet the day scenes (15–17, 55–59, 97, 99) generate from.
    key: "hive-exterior-day",
    path: "/images/neonoire/sheets/hive-exterior-day.jpg",
    references: ["/images/neonoire/sheets/hive-exterior.jpg"],
    generated: "28 September 2026 — the day look, neon switched off",
    prompt: `Location reference sheet, 16:9, 1920x1080, four separate rectangular photographs arranged two across and two down, thin black gutters between them, a small white caption line under each, on a flat dark grey background, photoreal 35mm film-still photography, anamorphic, fine grain.
${hiveCanon}
${hiveDayLook}
PANEL 1 (top left): three-quarter street view in steady rain, the eleven-storey face between the two clean glass office towers, dead unlit neon tubes and bare wiring on their brackets, laundry on the balconies, the KUROSE DEVELOPMENT construction hoarding beside it, one tiny figure at the entrance for scale.
PANEL 2 (top right): the same front elevation, straight on, frontal and level, grey rainy daylight, every sign dead and dark.
PANEL 3 (bottom left): side elevation, the tower stepping down to the four-storey rear wing, the concrete railway viaduct running along the rear wing's roofline with a commuter train on it, the same tangle of pipes, ducts, cages and water tanks.
PANEL 4 (bottom right): the rear service road, the Hive's narrow back door under the viaduct, shuttered garages, railway pillars, wet ground and puddles, one unlit lamp.
Flat overcast light, muted desaturated palette, deep grey shadows, wet reflective surfaces, rain running down everything, 35mm anamorphic film look, fine grain. Ordinary, worn, 1990s Japan, documentary realism. The same building, the same window pattern and the same dead signs in every panel.
Negative: ${hiveCanonNegative}, neon glow, lit signs, warm window light, amber or magenta or cyan cast, green cast, night sky`,
  },
  {
    // HELD, not regenerated: 95% of its lit pixels are warm, so it already reads warm tungsten.
    key: "hive-counter",
    path: "/images/neonoire/sheets/hive-counter.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior.jpg",
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/props/kaneko-sign-board.jpg",
    ],
    generated: "28 September 2026 — held; measured warm tungsten, rule 2",
    prompt: `Interior set reference sheet, 16:9, 1920x1080, four labelled panels, photoreal film still quality, 35mm grain, warm tungsten and green fluorescent, steam.
KANEKO'S NOODLE COUNTER, ground floor of a dense old Tokyo block, directly under a railway viaduct. A single straight wooden counter, worn dark, with exactly SIX round-topped wooden stools; behind the counter a large steel stock pot on a gas ring, ladles, stacked bowls, chopstick holders; the back wall is ribbed green-painted corrugated metal; one fluorescent tube overhead plus one bare bulb; a faded indigo noren curtain at the right end leading to a storeroom; a roll-down steel shutter at the front; yellowed paper menus pinned on the side walls. The hand-painted wooden sign board 金子 hangs on the wall ABOVE the counter, never on the counter.
Panel 1: customer-side frontal view, all six stools, sign above. Panel 2: reverse view from behind the counter toward the passage outside. Panel 3: overhead floor plan with the six stools numbered 1 to 6 from the left, stool 3 marked. Panel 4: night, shutter half down, one bulb only.
Negative: ${hiveCanonNegative}`,
  },
  {
    // HELD, not regenerated: 100% of its lit pixels are warm, so it already reads warm tungsten.
    key: "hive-storeroom",
    path: "/images/neonoire/sheets/hive-storeroom.jpg",
    references: [
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/sheets/hive-counter.jpg",
    ],
    generated: "28 September 2026 — held; measured warm tungsten, rule 2",
    prompt: `Interior set reference sheet, 16:9, 1920x1080, four labelled panels, photoreal, warm single-bulb light, deep shadow, 35mm grain.
THE STOREROOM behind Kaneko's noodle counter: a tiny room about 2.5 by 3 metres, bare plywood and plaster walls stained with age, low ceiling with the underside of a railway viaduct beam visible, a single bare bulb on a flex. Stacked paper flour sacks against the right wall, a crate of green onions, a thin futon on the floor on the left, pencil sketches taped to the back wall, a faded indigo noren curtain as the only door, leading to the counter.
Panel 1: wide from the curtain. Panel 2: reverse toward the curtain. Panel 3: the futon wall. Panel 4: overhead plan. No shelving units, no teal doors.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-passages-roof",
    path: "/images/neonoire/sheets/hive-passages-roof.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior.jpg",
      "/images/neonoire/sheets/hive-section.jpg",
    ],
    generated: "28 September 2026 — regenerated for the night look",
    prompt: `Location reference sheet, 16:9, 1920x1080, four labelled panels, photoreal night, 35mm anamorphic, fine grain.
THE HIVE PASSAGES AND ROOF AT NIGHT: interior corridors barely shoulder-wide, one person at a time, concrete and patched plywood walls, pipes, ducts and cables overhead, bare bulbs every few metres, a thin line of water along the wet floor, doors open onto small lived-in rooms.
${hiveNightSurface}
${hiveNightLight}
${hiveLightRule}
Panel 1: a typical passage looking down its length, one man walking, single file — steam and haze in the air, light cutting through it in visible shafts, magenta and cyan spill from a handmade vertical-kanji neon sign at the far end, wet floor holding the colour.
Panel 2: the radio repairman's open doorway, a dozen old radios on shelves, his green-shaded bench lamp, one small handmade neon tube in the window behind him, haze at the threshold where the passage meets the shop.
Panel 3: the narrow concrete back stairwell, dark, rising, one bare bulb and one flickering tube, steam drifting up the flight, backlit from a landing.
Panel 4: the four-storey rear wing's rooftop at night in rain: water tanks, TV aerials, laundry poles, pigeon cages, steam venting from the floors below, the city's magenta and cyan glow on the wet felt, and at its edge a one-metre gap and a low fence onto the steel maintenance walkway beside the elevated tracks, the neon-lit face of the tower rising behind.
Negative: ${hiveCanonNegative}`,
  },
];

// ---------------------------------------------------------------- the retake queues

// Frames that predate the canon sheets and queue as the next generation pass, one retake each,
// generated against the sheets above. Three of the eight are night frames and are carried by
// hiveNightRetakes below (s92/135, s85/119, s68/235) — one retake covers both problems.
export const hiveCanonRetakes = [
  { image: "s15/184-a-gap-in-someones-teeth.jpg", problem: "wide squat 6-7-storey block on an open plaza; canon is the eleven-storey tower between glass towers" },
  { image: "s59/226-at-the-edge-of-a-high-place.jpg", problem: "tall narrow tower on a tight street with parked cars; canon street is wide and modern" },
  { image: "s92/135-below-the-viaduct.jpg", problem: "nine-storey slab beside a viaduct pillar; canon keeps the viaduct at the four-storey rear wing's roofline" },
  { image: "s97/146-tomorrows-tokyo.jpg", problem: "five-storey block with the railway at height behind; canon ceremony sits before the front tower, viaduct only at the rear wing" },
  { image: "s99/156-cut-open.jpg", problem: "an ordinary five-storey apartment block, not the Hive; the demolition must cut open the canon tower" },
  { image: "s55/221-they-match.jpg", problem: "white-tiled corridor room with the 金子 sign standing on the counter; canon is the plywood-and-corrugated counter, sign on the wall above" },
  { image: "s68/235-rice-balls-for-the-car.jpg", problem: "storeroom with shelving and a teal doorway; canon is the plywood box, flour sacks, noren only" },
  { image: "s85/119-single-file.jpg", problem: "passage wide enough for three abreast; canon is shoulder-wide, single file" },
];

// The night-look queue, 28 September 2026. Every one of these was generated BEFORE the night look
// existed, so each shows the Hive's concrete without the sixty-year retrofit, the neon, the steam,
// the haze or the light shafts. Wave one: the building's surface and light — the exterior, the
// passages, the stair, the roof, the walkway, the service road and the street below the viaduct.
// Scene 88 and 89 are inside the blackout (the repairman has pulled the main switch), so there the
// line reads as flashlight beams cutting haze and neon spill only from the street outside: no warm
// bulbs, no lit windows, no colour from the building itself.
export const hiveNightRetakes = [
  { image: "s70/237-position.jpg", problem: "the back door onto the service road under the viaduct before the night look: no bolted-on pipes and tanks, no neon, no steam, no colour in the wet ground" },
  { image: "s85/119-single-file.jpg", problem: "passage without haze, shafts or neon spill; also the geometry retake (shoulder-wide, single file)" },
  { image: "s85/120-the-hive-is-watching.jpg", problem: "the closing doors and the passage read dry and bare; the night look wants haze in the bulb light and magenta/cyan spill down the corridor" },
  { image: "s87/124-the-repairman.jpg", problem: "the shop needs its own small handmade neon tube in the window, haze at the half-open door and spill from the passage; bench lamp stays practical" },
  { image: "s87/125-the-main-switch.jpg", problem: "the fuse box and the dying lamp need haze and the passage's neon spill behind him; nothing else lit" },
  { image: "s88/126-dark.jpg", problem: "the blackout: flashlight beams must cut visible shafts through haze, with neon spill only from the street outside; no bulb, no lit window, no colour from the building" },
  { image: "s88/127-faces-vanish.jpg", problem: "the beam on the hung laundry needs haze to catch it; the only colour is the city's neon through the window behind the curtain" },
  { image: "s89/128-by-touch.jpg", problem: "the pitch-black stair needs haze in the beam and a rim of magenta/cyan from the street at a landing; no lit bulbs" },
  { image: "s89/129-she-lets-him.jpg", problem: "the two hands in the dark need haze and one faint coloured rim from outside; the stair stays unlit" },
  { image: "s90/130-the-roof.jpg", problem: "the roof is lit by green city glow only; the night look wants steam from the floors below, haze, and the tower's own neon and tungsten windows rising behind the tanks" },
  { image: "s90/131-she-jumps.jpg", problem: "the jump across the gap needs haze, steam and the neon-lit face of the building behind, wet surfaces holding the colour" },
  { image: "s90/132-the-gap.jpg", problem: "the gap frame needs steam and haze between the roof and the walkway, with magenta and cyan on the wet roof felt" },
  { image: "s91/132-the-rails-sing.jpg", problem: "the walkway needs haze, the train's headlight cutting a shaft through steam, and the Hive's neon-lit face behind the sweeping beams" },
  { image: "s91/133-inches-apart.jpg", problem: "the strobing train windows need haze to catch them and the Hive's neon behind; rain and wet steel throughout" },
  { image: "s91/134-the-walkway-is-empty.jpg", problem: "the empty walkway needs shafts of beam light through haze and the building's neon on the wet steel" },
  { image: "s92/135-below-the-viaduct.jpg", problem: "the Hive behind them needs the full night look — every window warm, neon clusters, steam, haze; also the geometry retake (viaduct at the rear wing's roofline, not a slab by a pillar)" },
  { image: "s92/136-until-us.jpg", problem: "the building full of light: the draft gives her 'the building full of light', and the night look is that light — tungsten windows, neon clusters, steam, haze, warm colour on her wet face" },
];

// Wave two, and a hold rather than a queue. These are the two warm rooms of rule 2: their sheets
// were measured, not regenerated (95% and 100% of lit pixels warm), so the room, the counter, the
// six stools, the 金子 sign and the bulb all stay as they are. What the new canon adds to them is
// only atmospheric haze in the bulb light and a faint magenta/cyan rim at the curtain or the
// shutter gap, coming in from the passage. Retake them after wave one, or leave them: the rooms
// are correct, only the air in them has changed.
export const hiveNightWarmRooms = [
  { image: "s13/179-eat.jpg", problem: "warm tungsten already; the night look adds haze in the bulb light and faint neon spill at the curtain edge only" },
  { image: "s13/180-under-the-cover.jpg", problem: "warm tungsten already; haze under the blanket of light, faint spill at the curtain edge" },
  { image: "s13/181-the-bulb-comes-to-rest.jpg", problem: "warm tungsten already; haze in the swinging bulb's light, faint spill from the passage" },
  { image: "s13/247-thirty-one.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s25/200-the-number-114.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s25/201-the-stamp.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s60/227-i-want-my-sister.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s68/235-rice-balls-for-the-car.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge; also the geometry retake (no shelving, no teal door)" },
  { image: "s84/115-the-storeroom.jpg", problem: "the storeroom master: warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s84/116-thats-me.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s84/117-both-wrong.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s84/118-position.jpg", problem: "warm tungsten already; haze in the bulb light, faint spill at the curtain edge" },
  { image: "s86/121-the-shutter.jpg", problem: "warm tungsten already; haze and steam at the shutter gap, faint neon spill coming in under the shutter" },
  { image: "s86/122-through-the-back.jpg", problem: "warm tungsten already; gas-flame glow and haze, faint spill through the curtain from the passage" },
  { image: "s86/123-fifty-years.jpg", problem: "warm tungsten already; haze in the flame light, faint spill at the passage edge" },
];

// ---------------------------------------------------------------- the note every retake embeds

export const hiveCanonLook = `16:9 full-bleed (1920×1080), no letterbox. THE HIVE CANON (geometry 28 September 2026, night look 28 September 2026, scripts/neonoire/hive-canon-look.mjs): a stepped self-built block — an eleven-storey front tower on a wide modern street between glass office towers, and a four-storey rear wing backing onto the elevated railway viaduct, its roof level with the tracks; the noodle counter and storeroom at ground level under the viaduct. Canon sheets in sheets/: hive-exterior, hive-section, hive-counter, hive-storeroom, hive-passages-roof and hive-exterior-day; the exterior, the section and the passages-and-roof sheets carry the night look, hive-exterior-day carries the same building by grey daylight with every tube dead, and the counter and the storeroom are held as warm tungsten. Every Hive shot generated against them after 28 September 2026. NIGHT: ${hiveNightSurface} ${hiveNightLight} ${hiveLightRule} ${hiveWarmRoomsLook} ${hiveThresholdLook} DAY (scene 97 and every daylight Hive scene 15–17, 55–59): ${hiveDayLook} DEMOLITION (scene 99): ${hiveDemolitionLook} The 金子 sign hangs on the wall above the counter, never on it; six stools; passages shoulder-wide, single file; the storeroom is a plywood box with flour sacks and a noren, no shelving, no teal doors. Negative: ${hiveNightNegative}. AI-generated draft studies, not approved coverage.`;
