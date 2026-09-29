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
// THE LOOK PASS, 28 September 2026: the director has replaced the Hive's lighting and atmosphere
// wording, day and night, with the three sections below. The geometry above is untouched. The
// building is retrofitted in layers and steams; by NIGHT it is mostly darkness with small pools
// of amber against steel-blue haze and sparse, dim, faded neon; by DAY it never gets real
// daylight — a pale grey-ochre murk with thin cold shafts, the neon off but one faint sign. The
// counter and the storeroom stay the warmest places in the Hive, day and night: one bulb, amber
// tungsten, steam. Every light is small, old and belongs to someone who lives or works there.
// See hiveCanonRules. The old four-panel hive-exterior.jpg is superseded by two sheets,
// hive-exterior-night.jpg and hive-exterior-day.jpg, and is removed from sheets/.
//
// Six canon sheets are generated in order from the prompts below, each finished sheet used as a
// reference for the next and for every later Hive shot; they live in public/images/neonoire/sheets/.
// The frames listed in hiveCanonRetakes and hiveLookRetakes predate or no longer match the sheets
// and queue as the next generation pass.

export const hiveCanonScenes = new Set([
  "s13", "s15", "s16", "s17", "s19", "s20", "s25", "s55", "s56", "s57", "s58", "s59", "s60",
  "s67", "s68", "s69", "s70", "s71", "s84", "s85", "s86", "s87", "s88", "s89", "s90", "s92",
  "s97", "s99",
]);
// Not the Hive, and never touched by this canon: s14 (Mara's apartment), s22 and s100 (the brick
// arch counters — the draft itself calls scene 22 "a different place"), s91 (the railway
// maintenance walkway is railway ground, outside the Hive).

export const hiveCanon = `THE HIVE (canonical): a dense, self-built residential block in Tokyo, grown piece by piece since the 1960s. Two parts: an ELEVEN-STOREY front tower facing a wide modern street, and a FOUR-STOREY rear wing that backs directly onto a concrete elevated railway viaduct; the rear wing's flat roof is level with the viaduct's maintenance walkway and tracks. Facade: stained grey-brown concrete, irregular balconies bolted onto balconies, rusted steel cages, air conditioners and water pipes everywhere, laundry on poles, hand-painted vertical signs in Japanese, tangled power lines, small windows of every size. The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. A few old handmade neon signs in vertical Japanese kanji hang on the facade and in the passages, small and faded, belonging to tiny businesses. Steam vents from pipes and kitchen flues. Flanked on both sides by clean glass office towers, so the Hive looks like a gap in someone's teeth. A construction hoarding next door carries a KUROSE DEVELOPMENT banner showing a rendering of white towers and a plaza with a fountain. One narrow ground-floor entrance on the street side; a narrow back door onto a wet service road under the viaduct, lined with railway pillars.`;

export const hiveCanonNight = `Mostly darkness. Light comes in small pools: warm amber tungsten windows and bulbs against cold steel-blue haze. Steam and haze hang in every passage and catch the light in soft shafts. The neon is sparse, dim and faded — at most one or two signs visible in any frame, in muted red or pale teal, never bright. The colour comes from haze, rain and wet reflections, not from saturated light. Overall palette desaturated, near-monochrome: black, amber, steel blue. Practical lights only, strong backlight through steam, deep shadows, 35mm anamorphic film look, fine grain.`;

export const hiveCanonDay = `The Hive never gets real daylight. It stands in the shadow of the glass towers and the viaduct, wrapped in its own haze of steam and kitchen smoke, as if it has its own weather. By day the light is flat, milky and dim: a pale grey-ochre murk, the sky a white smear above. Inside the passages daylight arrives only as thin cold shafts through gaps overhead, full of drifting steam and dust. The neon is switched off except one old sign left burning faintly. Low contrast, desaturated, like a faded photograph. The street outside the Hive is ordinary grey daylight — the murk begins at the Hive's edge.`;

export const hiveCanonRules = `HIVE RULES: Kaneko's counter and the storeroom stay the warmest places in the Hive, day and night: one bulb, amber tungsten, steam. Almost no neon reaches them. Scene 97: the white ceremony tent, the silver shovel and the sterile rendering banner look sharp, clean and cold against the Hive's murk behind them. Scene 99: day look; the dead neon signs still hang from the exposed, cut-open floors in the dust. Entering the Hive is a threshold, day or night: the light changes the moment characters step through the entrance. Every light is small, old and belongs to someone who lives or works there. No advertising, no brands, no screens bigger than an old CRT, nothing futuristic. Never write a film title in a prompt.`;

export const hiveCanonNegative = `glass facade on the Hive, modern clean building, wide corridors, sign on the counter, tiled white walls, more or fewer than six stools, shelving units in the storeroom, cyberpunk neon, holograms, text errors, watermark, extra floors, the railway above the eleven-storey tower's roof, vivid colours, saturated neon, bright neon, many neon signs, rainbow lighting, colourful, holograms, flying cars, video billboards, LED screens, futuristic technology, glossy chrome, sci-fi skyline, cyberpunk, advertising, brand logos, bright sunny daylight, blue sky`;

export const hiveCanonSheets = [
  {
    key: "hive-exterior-night",
    path: "/images/neonoire/sheets/hive-exterior-night.jpg",
    references: [],
    prompt: `Location reference sheet, 16:9, 1920x1080, clean neutral layout on dark grey with four labelled panels with small printed captions, photoreal film still quality, 35mm film grain, desaturated near-monochrome palette of black, amber and steel blue.
${hiveCanon}
${hiveCanonNight}
${hiveCanonRules}
Panel 1 (large, left): three-quarter street view at NIGHT in steady rain, the eleven-storey front tower between two clean glass office towers, mostly darkness, only small pools of warm amber tungsten in scattered windows and bare bulbs, steam and haze catching soft shafts, one or two dim faded neon signs in muted red or pale teal on the facade, wet black asphalt with soft reflections, the KUROSE DEVELOPMENT hoarding beside it, one tiny figure at the entrance for scale.
Panel 2: the entrance at NIGHT — the one narrow ground-floor entrance, one small bare bulb over the door, haze and steam, a figure stepping through into the changed light, the street dark behind.
Panel 3: side elevation at NIGHT showing the tower stepping down to the four-storey rear wing and the concrete railway viaduct running along the rear wing's roofline, a commuter train passing as a band of small lit windows, haze between.
Panel 4: the rear service road at NIGHT: shuttered garages, railway pillars, one small old lamp making one pool of amber, the Hive's narrow back door, wet asphalt, one small faded sign.
Consistent architecture across all panels, same building, same window pattern, same few small signs.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-exterior-day",
    path: "/images/neonoire/sheets/hive-exterior-day.jpg",
    references: ["/images/neonoire/sheets/hive-exterior-night.jpg"],
    prompt: `Location reference sheet, 16:9, 1920x1080, clean neutral layout on dark grey with four labelled panels with small printed captions, photoreal film still quality, 35mm film grain, low contrast desaturated palette like a faded photograph, pale grey-ochre murk.
${hiveCanon}
${hiveCanonDay}
${hiveCanonRules}
Panel 1 (large, left): the same front elevation as the night sheet, straight on, in flat milky dim daylight — the pale grey-ochre murk of the Hive, the sky a white smear above, steam and kitchen smoke wrapping the building, the neon signs switched off and dead except one old sign burning faintly, the street in front in ordinary grey daylight.
Panel 2: three-quarter street view by DAY, the eleven-storey front tower between the two clean glass office towers — the glass towers in ordinary grey daylight, the Hive a dark murk-edged gap in someone's teeth, the KUROSE DEVELOPMENT hoarding sharp and clean beside it.
Panel 3: side elevation by DAY showing the tower stepping down to the four-storey rear wing and the concrete railway viaduct at the rear wing's roofline with a commuter train on it, everything in flat grey-ochre murk.
Panel 4: the entrance by DAY — the narrow ground-floor entrance where the ordinary grey street light ends and the murk begins, thin cold shafts of daylight through gaps overhead falling into drifting steam and dust at the door.
Consistent architecture with the night sheet, same building, same window pattern, same dead signs.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-section",
    path: "/images/neonoire/sheets/hive-section.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior-night.jpg",
      "/images/neonoire/sheets/hive-exterior-day.jpg",
    ],
    prompt: `Architectural cutaway cross-section illustration of THE HIVE, 16:9, 1920x1080, detailed hand-painted technical illustration in the style of a 1990s Japanese large-format illustrated reference book, muted warm colours, every room visible with small figures living in it, thin labels in English.
${hiveCanon}
${hiveCanonRules}
Show the eleven-storey front tower and the four-storey rear wing in section. Ground floor rear wing, directly beneath the railway viaduct: a tiny noodle counter with six stools and behind it a curtained plywood storeroom with flour sacks and a single amber bulb. Narrow shoulder-width passages lit by small bare bulbs making small pools of warm amber, steam drifting, a thin line of water on the floor. Label: radio repair shop with a dozen radios, a family eating at a low table with a TV, an old woman asleep, a dentist's chair behind a curtain, the electrical main switch box. A narrow concrete stairwell rising from the rear passage to the rear wing's roof: water tanks, aerials, laundry poles, pigeon cages, a one-metre gap and low fence to the railway maintenance walkway beside the tracks. A train on the viaduct. Outside the building the daylight is a flat pale grey-ochre murk; inside, the counter and storeroom glow the warmest of all.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-counter",
    path: "/images/neonoire/sheets/hive-counter.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior-day.jpg",
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/props/kaneko-sign-board.jpg",
    ],
    prompt: `Interior set reference sheet, 16:9, 1920x1080, four labelled panels with small printed captions, photoreal film still quality, 35mm grain, warm amber tungsten and steam, deep shadow, desaturated apart from the amber.
${hiveCanon}
${hiveCanonRules}
KANEKO'S NOODLE COUNTER, ground floor of a dense old Tokyo block, directly under a railway viaduct. A single straight wooden counter, worn dark, with exactly SIX round-topped wooden stools; behind the counter a large steel stock pot on a gas ring, ladles, stacked bowls, chopstick holders; the back wall is ribbed green-painted corrugated metal; ONE bare amber tungsten bulb is the light (the old fluorescent tube hangs overhead, unlit), steam drifting through its pool; a faded indigo noren curtain at the right end leading to a storeroom; a roll-down steel shutter at the front; yellowed paper menus pinned on the side walls. The hand-painted wooden sign board 金子 hangs on the wall ABOVE the counter, never on the counter. The counter is the warmest place in the Hive, day and night; almost no neon reaches it.
Panel 1: customer-side frontal view, all six stools, sign above. Panel 2: reverse view from behind the counter toward the passage outside. Panel 3: overhead floor plan with the six stools numbered 1 to 6 from the left, stool 3 marked. Panel 4: night, shutter half down, one bulb only, steam.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-storeroom",
    path: "/images/neonoire/sheets/hive-storeroom.jpg",
    references: [
      "/images/neonoire/sheets/hive-section.jpg",
      "/images/neonoire/sheets/hive-counter.jpg",
    ],
    prompt: `Interior set reference sheet, 16:9, 1920x1080, four labelled panels with small printed captions, photoreal, warm single amber tungsten bulb, steam, deep shadow, 35mm grain.
${hiveCanon}
${hiveCanonRules}
THE STOREROOM behind Kaneko's noodle counter: a tiny room about 2.5 by 3 metres, bare plywood and plaster walls stained with age, low ceiling with the underside of a railway viaduct beam visible, a single bare amber tungsten bulb on a flex. Stacked paper flour sacks against the right wall, a crate of green onions, a thin futon on the floor on the left, pencil sketches taped to the back wall, a faded indigo noren curtain as the only door, leading to the counter. The storeroom is the warmest place in the Hive, day and night; almost no neon reaches it.
Panel 1: wide from the curtain. Panel 2: reverse toward the curtain, the counter beyond lit by its single amber bulb, the unlit fluorescent tube overhead. Panel 3: the futon wall. Panel 4: overhead plan. No shelving units, no teal doors.
Negative: ${hiveCanonNegative}`,
  },
  {
    key: "hive-passages-roof",
    path: "/images/neonoire/sheets/hive-passages-roof.jpg",
    references: [
      "/images/neonoire/sheets/hive-exterior-night.jpg",
      "/images/neonoire/sheets/hive-section.jpg",
    ],
    prompt: `Location reference sheet, 16:9, 1920x1080, four labelled panels with small printed captions, photoreal NIGHT, 35mm grain, mostly darkness, small pools of warm amber against cold steel-blue haze, desaturated near-monochrome: black, amber, steel blue.
${hiveCanon}
${hiveCanonNight}
${hiveCanonRules}
THE HIVE PASSAGES AND ROOF: interior corridors barely shoulder-wide, one person at a time, concrete and patched plywood walls, pipes and wiring overhead, small bare bulbs every few metres making small pools of amber, steam and haze hanging in the passage and catching the light in soft shafts, a thin line of water along the floor, doors open onto small lived-in rooms. At most one or two dim faded neon signs in muted red or pale teal anywhere in frame, never bright.
Panel 1: a typical passage looking down its length, one man walking, single file, haze shafts. Panel 2: the radio repairman's open doorway, a dozen old radios on shelves, his one small bench lamp. Panel 3: the narrow concrete back stairwell, dark, rising. Panel 4: the four-storey rear wing's rooftop at night in rain: water tanks, TV aerials, laundry poles, pigeon cages, and at its edge a one-metre gap and a low fence onto the steel maintenance walkway beside the elevated tracks, the city beyond only small distant pools of light in the haze.
Negative: ${hiveCanonNegative}`,
  },
];

// Frames that predate the canon sheets — or were drawn before the NIGHT/DAY look pass — queue as
// the next generation pass, one retake each, generated against the sheets above (exteriors against
// the matching night or day sheet and hive-section, interiors against their set sheets). The s97
// wides are checked against the canon at retake time; 146 is listed as the known wide.
// Tiers follow the director's 29 September 2026 breakdown: wrong building and wrong look (the
// Hive seen from outside) / wrong set and wrong look (interior geometry) / wrong look only.
//
// hiveRetakenExteriors: tier 1, the seven "wrong building and wrong look" frames — retaken
// 29 September 2026 against the canon sheets (edit of the original frame with the matching
// exterior sheet as the architecture reference; staging, cast and props held to the base frame).
export const hiveRetakenExteriors = [
  { image: "s15/184-a-gap-in-someones-teeth.jpg", shot: 186, look: "day", problem: "wide squat 6-7-storey block on an open plaza; canon is the eleven-storey tower between glass towers", lookProblem: "blue-grey rainy daylight; the day look is flat milky pale grey-ochre murk, the sky a white smear" },
  { image: "s59/226-at-the-edge-of-a-high-place.jpg", shot: 228, look: "day", problem: "tall narrow tower on a tight street with parked cars; canon street is wide and modern", lookProblem: "bright wet street light; the day look is dim grey-ochre murk with the street outside in ordinary grey daylight" },
  { image: "s92/135-below-the-viaduct.jpg", shot: 137, look: "night", problem: "nine-storey slab beside a viaduct pillar; canon keeps the viaduct at the four-storey rear wing's roofline", lookProblem: "the Hive glows with hundreds of bright windows and green city light; the night look is mostly darkness, small pools of amber" },
  { image: "s97/146-tomorrows-tokyo.jpg", shot: 148, look: "day", problem: "five-storey block with the railway at height behind; canon ceremony sits before the front tower, viaduct only at the rear wing", lookProblem: "the ceremony reads cold blue pre-dawn; the day look is pale grey-ochre murk, and the tent, shovel and banner must look sharp, clean and cold against it" },
  { image: "s97/148-four-men.jpg", shot: 150, look: "day", problem: "the wrong block stands behind the ceremony; canon is the eleven-storey front tower behind the tent", lookProblem: "the ceremony reads cold blue-grey; day look is pale grey-ochre murk, with the tent and the officials sharp, clean and cold against it" },
  { image: "s97/149-twenty-metres.jpg", shot: 151, look: "day", problem: "the wrong facade stands behind the tent; canon is the eleven-storey front tower behind the ceremony", lookProblem: "the wide reads dark blue pre-dawn; carry the day murk" },
  { image: "s99/156-cut-open.jpg", shot: 158, look: "day", problem: "an ordinary five-storey apartment block, not the Hive; the demolition must cut open the canon tower", lookProblem: "plain overcast daylight; the day look is grey-ochre murk like a faded photograph, with the dead neon signs still hanging from the exposed, cut-open floors in the dust" },
];

// hiveCanonRetakes: the interior set/geometry failures (wrong set and wrong look) — the counter,
// storeroom and passage sets themselves, each also carrying the new look.
export const hiveCanonRetakes = [
  { image: "s55/221-they-match.jpg", look: "day", problem: "white-tiled corridor room with the 金子 sign standing on the counter; canon is the plywood-and-corrugated counter, sign on the wall above", lookProblem: "even modern light; day passages carry thin cold shafts through gaps overhead, full of drifting steam and dust" },
  { image: "s68/235-rice-balls-for-the-car.jpg", look: "night", problem: "storeroom with shelving and a teal doorway; canon is the plywood box, flour sacks, noren only", lookProblem: "cool green grade; the storeroom is one amber bulb, steam — the warmest place in the Hive" },
  { image: "s85/119-single-file.jpg", look: "night", problem: "passage wide enough for three abreast; canon is shoulder-wide, single file", lookProblem: "strung with lit lamps and green signage; the night look is small amber pools against steel-blue haze, haze shafts, one or two dim signs at most" },
];

// hiveLookRetakes: frames whose geometry is right but whose light predates the NIGHT/DAY look pass.
export const hiveLookRetakes = [
  // DAY — scene 97, the ceremony
  { image: "s97/147-the-same-morning-news.jpg", shot: 149, look: "day", problem: "the shop window at the Hive's edge reads blue pre-dawn; the street outside is ordinary grey daylight and the murk begins at the Hive's edge. Props unchanged: the old CRTs and flat screens showing Kurose's photograph and the Toto Shimbun front page" },
  { image: "s97/150-she-does-not-look-away.jpg", shot: 152, look: "day", problem: "Vera's close-up is lit blue-grey; the day look is flat, milky and dim pale grey-ochre murk" },
  { image: "s97/151-collar-up.jpg", shot: 153, look: "day", problem: "Jack on the street reads blue-grey pre-dawn; the day look is flat milky dim murk, ordinary grey daylight on the street" },
  { image: "s97/152-the-ribbon.jpg", shot: 154, look: "day", problem: "the shovel insert reads against dark rain; scene 97 rule: the silver shovel looks sharp, clean and cold against the Hive's murk behind it" },
  // DAY — scene 99, the demolition
  { image: "s99/157-the-sign.jpg", shot: 159, look: "day", problem: "the crowd reads plain overcast daylight; the day look is grey-ochre murk like a faded photograph, and the dead neon signs still hang from the exposed, cut-open floors in the dust behind them" },
  // DAY — the Hive first seen (15–17) and the day returns (55–59)
  { image: "s15/185-then-he-goes-in.jpg", shot: 187, look: "day", problem: "the entrance stair is packed with bright lit signs; day look switches the neon off but one faint sign, and entering is a threshold — the light changes the moment he steps through" },
  { image: "s16/186-everybody-sees-him.jpg", shot: 188, look: "day", problem: "the passages are lit like a market with warm lamps and green signage; day passages carry only thin cold shafts through gaps overhead, full of drifting steam and dust" },
  { image: "s17/187-you-got-old.jpg", shot: 189, look: "day", problem: "the counter carries a lit fluorescent tube and a green cast; the counter is one amber bulb, steam — the warmest place in the Hive" },
  { image: "s17/188-something-moves.jpg", shot: 190, look: "day", problem: "fluorescent tube and cool grade over the counter; the counter is one amber bulb, steam" },
  { image: "s56/223-the-third-stool.jpg", shot: 225, look: "day", problem: "lit fluorescent tube over the counter; the counter is one amber bulb, steam. Keep the locked staging: Vera on the third of six stools, two empty stools to her left, the 金子 board on the wall above the counter" },
  { image: "s56/224-stool-three.jpg", shot: 266, look: "day", problem: "fluorescent and cool green grade at the counter; the counter is one amber bulb, steam. Keep Vera third from the left" },
  { image: "s58/225-bring-her.jpg", shot: 227, look: "day", problem: "fluorescent tube and cool grade; the counter is one amber bulb, steam. Keep the charcoal-coat third-stool motif" },
  { image: "s16/248-exactly-the-drawing.jpg", shot: 250, look: "day", problem: "the passage glows with warm lamps and shop signs by day; day passages are thin cold shafts and drifting steam, the neon off but one faint sign" },
  { image: "s16/249-the-chair.jpg", shot: 253, look: "day", problem: "the dentist's chair passage is lit warm by rows of lamps; the day look is flat milky dim murk with thin cold shafts overhead" },
  // NIGHT — the raid and the escape (85–92)
  { image: "s85/120-the-hive-is-watching.jpg", shot: 122, look: "night", problem: "the passage is strung with lit lamps and door lights and reads green; the night look is mostly darkness, small amber pools against steel-blue haze, haze shafts, one or two dim signs at most" },
  { image: "s86/121-the-shutter.jpg", shot: 123, look: "night", problem: "a bright fluorescent tube lights the counter; the counter is one amber bulb, steam. Keep Kaneko's staging at the shutter" },
  { image: "s87/124-the-repairman.jpg", shot: 126, look: "night", problem: "the repair shop is graded saturated teal with blue smoke; the night look is desaturated near-monochrome, small pools. Keep the repairman exactly as sheets/repairman.jpg holds him" },
  { image: "s90/130-the-roof.jpg", shot: 132, look: "night", problem: "the roof looks over a saturated green city; the night look is cold steel-blue haze, the city only small distant pools" },
  { image: "s90/131-she-jumps.jpg", shot: 133, look: "night", problem: "saturated green city behind the jump; the night look is steel-blue haze and deep shadows" },
  { image: "s90/132-the-gap.jpg", shot: 267, look: "night", problem: "saturated green city behind the gap; the night look is steel-blue haze, near-monochrome" },
  { image: "s92/136-until-us.jpg", shot: 138, look: "night", problem: "the Hive stands with hundreds of bright lit windows; the night look is mostly darkness with small pools of warm amber" },
  // NIGHT — the Hive passages again (69, 71)
  { image: "s69/236-vera-would-love-this.jpg", shot: 238, look: "night", problem: "the passage reads green-lit around a lit CRT shopfront; the night look is amber pools against steel-blue haze, near-monochrome, one or two dim signs at most" },
  { image: "s71/238-everyones-awake.jpg", shot: 240, look: "night", problem: "the passage is strung with warm lanterns and green signage; the night look is small pools, haze shafts, sparse dim faded neon" },
  { image: "s69/279-her-sisters-smile.jpg", shot: 279, look: "night", problem: "the passage glows green behind Vera; the night look is desaturated black, amber and steel blue" },
];

// The next generation pass, in run order: the three interior set frames first (they also carry the
// look), then the look-only retakes — day frames against hive-exterior-day / the day canon, night
// frames against hive-exterior-night / the night canon. One call each. The seven tier-1 exterior
// retakes live in hiveRetakenExteriors and are done (29 September 2026).
export const hiveNextPassPlan = [
  ...hiveCanonRetakes.map(({ image, look, problem, lookProblem }) => ({ image, look, problem: `${problem}; ${lookProblem}`, geometry: true })),
  ...hiveLookRetakes.map(({ image, shot, look, problem }) => ({ image, shot, look, problem, geometry: false })),
];

export const hiveCanonLook = `16:9 full-bleed (1920×1080), no letterbox. THE HIVE CANON (28 September 2026, scripts/neonoire/hive-canon-look.mjs): a stepped self-built block — an eleven-storey front tower on a wide modern street between glass office towers, and a four-storey rear wing backing onto the elevated railway viaduct, its roof level with the tracks; the noodle counter and storeroom at ground level under the viaduct. Retrofitted for sixty years in bolted layers — pipes, ducts, cables, cages, air conditioners, water tanks, extra rooms — until the architecture has almost disappeared; a few old handmade neon signs in vertical kanji, small and faded; steam vents from pipes and kitchen flues. LOOK (this file's hiveCanonNight / hiveCanonDay): NIGHT is mostly darkness — small pools of warm amber tungsten against cold steel-blue haze, steam and haze catching soft shafts, neon sparse, dim and faded (at most one or two signs in frame, muted red or pale teal, never bright), palette desaturated near-monochrome (black, amber, steel blue), practical lights only, deep shadows, 35mm anamorphic. DAY never gets real daylight — flat, milky, dim pale grey-ochre murk with a white-smear sky, thin cold shafts through gaps overhead in the passages full of steam and dust, the neon off but one faint sign, low contrast like a faded photograph; the street outside is ordinary grey daylight and the murk begins at the Hive's edge. RULES (hiveCanonRules): the counter and storeroom are the warmest places, day and night — one bulb, amber tungsten, steam, almost no neon; entering the Hive is a threshold; every light is small, old and belongs to someone who lives or works there — no advertising, no brands, no screens bigger than an old CRT, nothing futuristic; scene 97's tent, shovel and banner stay sharp, clean and cold against the murk; scene 99's dead neon signs still hang from the cut-open floors in the dust; never write a film title in a prompt. Canon sheets in sheets/: hive-exterior-night, hive-exterior-day, hive-section, hive-counter, hive-storeroom, hive-passages-roof; every Hive shot generated against them after 28 September 2026. The 金子 sign hangs on the wall above the counter, never on it; six stools; passages shoulder-wide, single file; the storeroom is a plywood box with flour sacks and a noren, no shelving, no teal doors. Frames predating or missing the look are queued in hiveCanonRetakes (interior set failures) and hiveLookRetakes (look only), plan in hiveNextPassPlan; the seven exteriors retaken on 29 September 2026 are listed in hiveRetakenExteriors. AI-generated draft studies, not approved coverage.`;
