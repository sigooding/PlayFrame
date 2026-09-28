// THE HIVE CANON — 28 September 2026. The Hive was boarded across five sessions from five look
// files (hive-first-look, hive-look, hive-morning-look, escape-look, ending-look), and each
// described the building a little differently: a squat six-storey block on a plaza (s15/184), a
// tall narrow tower on a tight street (s59/226), a nine-storey slab by a viaduct pillar (s92/135),
// a five-storey block with the railway at height behind it (s97), and an ordinary apartment block
// for the demolition (s99/156). Inside, s55/221 drew Kaneko's counter as a white-tiled corridor
// with the 金子 sign standing ON the counter, s68/235 gave the storeroom shelving and a teal
// doorway, and s85/119 drew the passage three men abreast where the draft says single file.
//
// The director's fix, recorded here as the single source of truth: the Hive is STEPPED. An
// eleven-storey tower fronts the main street; behind it a four-storey rear wing backs directly
// onto the elevated railway viaduct, its flat roof level with the tracks and the maintenance
// walkway. The noodle counter and the storeroom sit at ground level in the rear wing, directly
// under the viaduct — which is why trains shake them. That keeps every scene working: the tall
// facade on the street (scene 15), trains overhead inside (scenes 13 and 17), the service road
// behind (scene 70), the roof-to-track jump (scene 90), and a demolition that cuts open the
// tower (scene 99). It also resolves the draft's own contradiction — "eleven storeys" and a
// roof level with the railway — because the eleven storeys are the FRONT tower only.
//
// Five canon sheets are generated in order from the prompts below, each finished sheet used as a
// reference for the next and for every later Hive shot; they live in public/images/neonoire/sheets/.
// The frames listed in hiveCanonRetakes predate the sheets and queue as the next generation pass.

export const hiveCanonScenes = new Set([
  "s13", "s14", "s15", "s16", "s17", "s25", "s47", "s55", "s56", "s57", "s58", "s59", "s60",
  "s68", "s70", "s84", "s85", "s86", "s87", "s88", "s89", "s90", "s91", "s92", "s97", "s99",
]);

export const hiveCanon = `THE HIVE (canonical): a dense, self-built residential block in Tokyo, grown piece by piece since the 1960s. Two parts: an ELEVEN-STOREY front tower facing a wide modern street, and a FOUR-STOREY rear wing that backs directly onto a concrete elevated railway viaduct; the rear wing's flat roof is level with the viaduct's maintenance walkway and tracks. Facade: stained grey-brown concrete, irregular balconies bolted onto balconies, rusted steel cages, air conditioners and water pipes everywhere, laundry on poles, hand-painted vertical signs in Japanese, tangled power lines, small windows of every size lit warm tungsten or cool TV-blue. Flanked on both sides by clean glass office towers, so the Hive looks like a gap in someone's teeth. A construction hoarding next door carries a KUROSE DEVELOPMENT banner showing a rendering of white towers and a plaza with a fountain. One narrow ground-floor entrance on the street side; a narrow back door onto a wet service road under the viaduct, lined with railway pillars.`;

export const hiveCanonNegative = `glass facade on the Hive, modern clean building, wide corridors, sign on the counter, tiled white walls, more or fewer than six stools, shelving units in the storeroom, cyberpunk neon, holograms, text errors, watermark, extra floors, the railway above the eleven-storey tower's roof`;

export const hiveCanonSheets = [
  {
    key: "hive-exterior",
    path: "/images/neonoire/sheets/hive-exterior.jpg",
    references: [],
    prompt: `Location reference sheet, 16:9, 1920x1080, clean neutral layout on dark grey with four labelled panels, photoreal film still quality, 35mm film grain, muted desaturated palette.
${hiveCanon}
Panel 1 (large, left): three-quarter street view at night in steady rain, the eleven-storey front tower between two glass office towers, hundreds of small lit windows, wet black asphalt reflecting them, the KUROSE DEVELOPMENT hoarding beside it, one tiny figure at the entrance for scale.
Panel 2: the same front elevation, straight on, grey rainy daylight.
Panel 3: side elevation showing the tower stepping down to the four-storey rear wing and the concrete railway viaduct running along the rear wing's roofline, a commuter train on it.
Panel 4: the rear service road at night: shuttered garages, railway pillars, one sodium lamp, the Hive's narrow back door.
Consistent architecture across all panels, same building, same window pattern, same signs.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-section",
    path: "/images/neonoire/sheets/hive-section.jpg",
    references: ["/images/neonoire/sheets/hive-exterior.jpg"],
    prompt: `Architectural cutaway cross-section illustration of THE HIVE, 16:9, 1920x1080, detailed hand-painted technical illustration in the style of a 1990s Japanese large-format illustrated reference book, muted warm colours, every room visible with small figures living in it, thin labels in English.
${hiveCanon}
Show the eleven-storey front tower and the four-storey rear wing in section. Ground floor rear wing, directly beneath the railway viaduct: a tiny noodle counter with six stools and behind it a curtained plywood storeroom with flour sacks and a single bulb. Narrow shoulder-width passages lit by bare bulbs with a thin line of water on the floor. Label: radio repair shop with a dozen radios, a family eating at a low table with a TV, an old woman asleep, a dentist's chair behind a curtain, the electrical main switch box. A narrow concrete stairwell rising from the rear passage to the rear wing's roof: water tanks, aerials, laundry poles, pigeon cages, a one-metre gap and low fence to the railway maintenance walkway beside the tracks. A train on the viaduct.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-counter",
    path: "/images/neonoire/sheets/hive-counter.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior.jpg",
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/props/kaneko-sign-board.jpg",
    ],
    prompt: `Interior set reference sheet, 16:9, 1920x1080, four labelled panels, photoreal film still quality, 35mm grain, warm tungsten and green fluorescent, steam.
KANEKO'S NOODLE COUNTER, ground floor of a dense old Tokyo block, directly under a railway viaduct. A single straight wooden counter, worn dark, with exactly SIX round-topped wooden stools; behind the counter a large steel stock pot on a gas ring, ladles, stacked bowls, chopstick holders; the back wall is ribbed green-painted corrugated metal; one fluorescent tube overhead plus one bare bulb; a faded indigo noren curtain at the right end leading to a storeroom; a roll-down steel shutter at the front; yellowed paper menus pinned on the side walls. The hand-painted wooden sign board 金子 hangs on the wall ABOVE the counter, never on the counter.
Panel 1: customer-side frontal view, all six stools, sign above. Panel 2: reverse view from behind the counter toward the passage outside. Panel 3: overhead floor plan with the six stools numbered 1 to 6 from the left, stool 3 marked. Panel 4: night, shutter half down, one bulb only.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-storeroom",
    path: "/images/neonoire/sheets/hive-storeroom.jpg",
    references: [
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/sheets/hive-counter.jpg",
    ],
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
    prompt: `Location reference sheet, 16:9, 1920x1080, four labelled panels, photoreal night, 35mm grain, bare-bulb tungsten with faint green fluorescent spill.
THE HIVE PASSAGES AND ROOF: interior corridors barely shoulder-wide, one person at a time, concrete and patched plywood walls, pipes and wiring overhead, bare bulbs every few metres, a thin line of water along the floor, doors open onto small lived-in rooms.
Panel 1: a typical passage looking down its length, one man walking, single file. Panel 2: the radio repairman's open doorway, a dozen old radios on shelves. Panel 3: the narrow concrete back stairwell, dark, rising. Panel 4: the four-storey rear wing's rooftop at night in rain: water tanks, TV aerials, laundry poles, pigeon cages, and at its edge a one-metre gap and a low fence onto the steel maintenance walkway beside the elevated tracks, city lights beyond.
Negative: ${hiveCanonNegative}`,
  },
];

// Frames that predate the canon sheets and queue as the next generation pass, one retake each,
// generated against the sheets above (exteriors against hive-exterior and hive-section, interiors
// against their set sheets). The s97 wides are checked against the canon at retake time; 146 is
// listed as the known wide.
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

export const hiveCanonLook = `16:9 full-bleed (1920×1080), no letterbox. THE HIVE CANON (28 September 2026, scripts/neonoire/hive-canon-look.mjs): a stepped self-built block — an eleven-storey front tower on a wide modern street between glass office towers, and a four-storey rear wing backing onto the elevated railway viaduct, its roof level with the tracks; the noodle counter and storeroom at ground level under the viaduct. Canon sheets in sheets/: hive-exterior, hive-section, hive-counter, hive-storeroom, hive-passages-roof; every Hive shot generated against them after 28 September 2026. The 金子 sign hangs on the wall above the counter, never on it; six stools; passages shoulder-wide, single file; the storeroom is a plywood box with flour sacks and a noren, no shelving, no teal doors. Frames predating the sheets are queued in hiveCanonRetakes. AI-generated draft studies, not approved coverage.`;
