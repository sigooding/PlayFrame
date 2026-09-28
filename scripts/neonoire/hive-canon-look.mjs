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
//
// NIGHT UPDATE — 28 September 2026 (additive; nothing above was replaced). The building's
// physical description gained the sixty-year retrofit paragraph (day and night — objects, not
// lighting); hiveCanonDay and hiveCanonNight carry the two lighting states, with the night rules
// beside the night section; hiveCanonNegative gained the sci-fi/corporate terms; the exterior,
// section and passages-and-roof sheets were regenerated with the night look (the counter and
// storeroom sheets, being warm tungsten, were left alone); and the night retakes queue as
// hiveCanonNightRetakes alongside the eight geometry retakes. Never write a film title into a
// prompt.

export const hiveCanonScenes = new Set([
  "s13", "s14", "s15", "s16", "s17", "s25", "s47", "s55", "s56", "s57", "s58", "s59", "s60",
  "s68", "s70", "s84", "s85", "s86", "s87", "s88", "s89", "s90", "s91", "s92", "s97", "s99",
]);

export const hiveCanon = `THE HIVE (canonical): a dense, self-built residential block in Tokyo, grown piece by piece since the 1960s. Two parts: an ELEVEN-STOREY front tower facing a wide modern street, and a FOUR-STOREY rear wing that backs directly onto a concrete elevated railway viaduct; the rear wing's flat roof is level with the viaduct's maintenance walkway and tracks. Facade: stained grey-brown concrete, irregular balconies bolted onto balconies, rusted steel cages, air conditioners and water pipes everywhere, laundry on poles, hand-painted vertical signs in Japanese, tangled power lines, small windows of every size lit warm tungsten or cool TV-blue. Flanked on both sides by clean glass office towers, so the Hive looks like a gap in someone's teeth. A construction hoarding next door carries a KUROSE DEVELOPMENT banner showing a rendering of white towers and a plaza with a fountain. One narrow ground-floor entrance on the street side; a narrow back door onto a wet service road under the viaduct, lined with railway pillars. The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. Old handmade neon signs in vertical Japanese kanji hang all over the facade and passages, belonging to tiny businesses — a noodle counter, a dentist, a radio repair shop, a karaoke bar. Steam vents from pipes and kitchen flues.`;

// DAYTIME — the Hive's day lighting, for day Hive shots only (exterior and interior). The
// daytime look itself is unchanged by the night update: flat grey rainy daylight, exactly as the
// sheets already carry it. Scenes 97 (the ceremony) and 99 (the demolition) are DAY and use this
// section plus the unlit signs; in scene 99 the dead signs still hang from the exposed,
// cut-open floors.
export const hiveCanonDay = `THE HIVE BY DAY: flat grey rainy daylight on the stepped concrete — the day elevation and side elevation of sheets/hive-exterior.jpg and the cutaway of sheets/hive-section.jpg, the daytime lighting exactly as it was before the night update (only the retrofit objects of the physical description were added). Scenes 97 (the ceremony) and 99 (the demolition) are DAY: use the existing daytime look plus the unlit signs. In scene 99 the dead signs still hang from the exposed, cut-open floors. By day the neon signs are switched off: dead glass tubes and bare wiring, no glow, no haze effect.`;

// NIGHT — the Hive's night lighting, used ONLY for night Hive shots (interior and exterior).
// Day shots take hiveCanonDay instead; the building itself is always hiveCanon (day and night).
export const hiveCanonNight = `At night the Hive glows from within: hundreds of small windows in warm tungsten, and the neon signs lit in red, magenta, cyan and green, some tubes flickering or half dead. Steam drifts into the rain; haze hangs in every passage; light cuts through it in visible shafts. Practical lights only, strong backlight through steam, coloured neon spill mixed with warm tungsten bulbs, deep shadows, wet reflective surfaces, 35mm anamorphic film look, fine grain.`;

// The night rules, alongside the night section. (One standing rule lives only here and in the
// pass doc, never inside prompt text: never write "Blade Runner" or any other film title into a
// prompt.)
export const hiveCanonNightRules = `Kaneko's counter and the storeroom stay mostly WARM TUNGSTEN at night — they are home. Only faint neon spill at the edges, from the passage. Entering the Hive at night is a threshold: grey street light straight into haze and colour; leaving, the colour drains behind the characters. Every light is small, handmade and belongs to someone who lives or works there. No advertising, no brands, no screens bigger than an old CRT, nothing futuristic.`;

export const hiveCanonNegative = `glass facade on the Hive, modern clean building, wide corridors, sign on the counter, tiled white walls, more or fewer than six stools, shelving units in the storeroom, cyberpunk neon, holograms, text errors, watermark, extra floors, the railway above the eleven-storey tower's roof, holograms, flying cars, video billboards, LED screens, futuristic technology, robots, glossy chrome, sci-fi skyline, cyberpunk clothing, advertising, brand logos`;

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
Night panels (1 and 4) follow the NIGHT section: ${hiveCanonNight} ${hiveCanonNightRules}
Day panels (2 and 3) follow the DAYTIME section: ${hiveCanonDay}
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
All four panels are NIGHT: ${hiveCanonNight} ${hiveCanonNightRules}
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

// Frames that predate the NIGHT look (28 September 2026) and queue on top of the eight geometry
// retakes above as part of the same next generation pass. These are the Hive night shots where
// the new night lighting is visible: exteriors, passages and the roof. s85/119 and s92/135 are
// already queued above and are regenerated with the night look as part of their retake, so they
// are not repeated here. Deliberately absent: Kaneko's counter and the storeroom (they stay
// mostly warm tungsten at night — they are home), the radio repair shop (his own small tungsten
// practicals), scenes 88 and 89 (the main switch is out; the stairwell is dark by story), and
// every day shot (those take hiveCanonDay and the unlit signs when their own retake comes).
export const hiveCanonNightRetakes = [
  { image: "s75/79-the-hive-shut.jpg", problem: "the shut Hive at night lit only by its faint sign; the night facade now glows from within — warm tungsten windows, neon in red/magenta/cyan/green, steam and haze in the rain" },
  { image: "s16/186-everybody-sees-him.jpg", problem: "passage lit by bare bulbs with clear air; the night look hangs haze in every passage and cuts the bulb light through it in visible shafts" },
  { image: "s69/236-vera-would-love-this.jpg", problem: "passage at night without the haze or the neon spill at the doorways; needs the night section's shafts and coloured spill" },
  { image: "s71/238-everyones-awake.jpg", problem: "the waking windows read as plain lit glass; the night look makes the building glow from within, hundreds of small warm-tungsten windows through haze" },
  { image: "s85/120-the-hive-is-watching.jpg", problem: "raid passage without the night haze; regenerate against the regenerated passages sheet, shafts of light through the air" },
  { image: "s67/234-a-different-clock.jpg", problem: "rear service road at night with one lamp only; the back of the Hive should glow through the haze, steam drifting, wet reflective ground" },
  { image: "s70/237-position.jpg", problem: "rear service road night without the Hive's glow or the threshold colour; grey street light at the edge, haze and colour toward the back door" },
  { image: "s90/130-the-roof.jpg", problem: "rooftop over a dark city; the night look brings haze in the air and the building's warm glow and neon spill rising from below" },
];

export const hiveCanonLook = `16:9 full-bleed (1920×1080), no letterbox. THE HIVE CANON (28 September 2026, scripts/neonoire/hive-canon-look.mjs): a stepped self-built block — an eleven-storey front tower on a wide modern street between glass office towers, and a four-storey rear wing backing onto the elevated railway viaduct, its roof level with the tracks; the noodle counter and storeroom at ground level under the viaduct. Canon sheets in sheets/: hive-exterior, hive-section, hive-counter, hive-storeroom, hive-passages-roof; every Hive shot generated against them after 28 September 2026. The 金子 sign hangs on the wall above the counter, never on it; six stools; passages shoulder-wide, single file; the storeroom is a plywood box with flour sacks and a noren, no shelving, no teal doors. Frames predating the sheets are queued in hiveCanonRetakes. NIGHT UPDATE (28 September 2026): the retrofit paragraph lives in the physical description (day and night — objects, not lighting); day Hive shots embed hiveCanonDay (unlit neon: dead glass tubes, no glow, no haze; scenes 97 and 99 are DAY with the dead signs hanging in scene 99's cut-open floors), night Hive shots embed hiveCanonNight plus hiveCanonNightRules (the glow from within, haze and shafts; Kaneko's counter and the storeroom stay mostly warm tungsten — only faint neon spill at the edges; entering the Hive at night is a threshold — grey street light into haze and colour, leaving, the colour drains behind; every light small, handmade, someone's own — no advertising, no brands, no screens bigger than an old CRT, nothing futuristic; and never a film title in a prompt). The night retake queue is hiveCanonNightRetakes. AI-generated draft studies, not approved coverage.`;
