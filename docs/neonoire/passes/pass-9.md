# NEONOIRE — keyframe pass 9

3 shots still to generate: shots 81–83, from scene 75 (INT./EXT. VARIOUS).

**Before you start**

- **Every image in the film is 16:9 full-bleed, 1920×1080** — the final screenplay's frame rule (September 2026), covering scenes 1–100 as the board reaches them. Follow apartment-look.mjs (no paper pendant), front-counter-look.mjs, interview-look.mjs and detectives-look.mjs for the revised scenes, and cold-open-look.mjs for the pre-title shots: 1–10 are rebuilt in 16:9, while 11–28 and scene 3 still hold legacy 2.39:1 studies awaiting the same revision — regenerate them at the new shape, never crop them to scope. Normalise every fresh frame with:
  ```bash
  convert FILE.jpg -resize "1920x1080^" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg
  ```
- Attach the continuity sheet (or its face crop) for every named character in the shot, and the studio keys listed for the scene — they are the look the film is already being generated in.
- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.
- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.
- British/American spelling is irrelevant here; **no added captions**; only include readable text explicitly required by the board (for example MARA VOSS on the monitor).
- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.

### Shot 81 — The hive shut

**Scene 75 · INT./EXT. VARIOUS — NIGHT - SERIES OF SHOTS**

- **File**: `public/images/neonoire/s75/79-the-hive-shut.jpg` — write it exactly here, 79-the-hive-shut.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-79`; displayed board number 81. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 50mm, Static, Low, level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`, `public/images/neonoire/s75/77-the-red-shoe.jpg`, `public/images/neonoire/s72/69-the-wait.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Low level locked camera at 70cm, normal 50mm lens, square to the intact Hive's old noodle-shop shutter. Its hand-painted sign glows faint amber beneath an ordinary dark glass tower. Rain and quiet architectural layers, no people or silhouettes, no burning wreckage, no demolition. REPLACEMENT PENDING — do not use the discarded image or invent a ruined building. Draw the night from the new street master, but do not transplant the hotel's architecture. Keep the old sign dim and unreadable; the script has three more days before demolition.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Wide, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "The Hive at night, the noodle shop shutter down, its old sign still faintly glowing."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Five static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. Then black.

---

### Shot 82 — The machine waits

**Scene 75 · INT./EXT. VARIOUS — NIGHT - SERIES OF SHOTS**

- **File**: `public/images/neonoire/s75/80-the-machine-waits.jpg` — write it exactly here, 80-the-machine-waits.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-80`; displayed board number 82. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Full, 50mm, Static, Low, level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`, `public/images/neonoire/s75/77-the-red-shoe.jpg`, `public/images/neonoire/s72/69-the-wait.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A low level static 50mm camera at 70cm holds the SAME scuffed ivory vending machine from the run, full height, with its muted red side strip, cold drinks display, payment panel on the right, green shutter and shallow gutter. The machine is lit, rain falls through it, and no one passes or appears in reflection. REPLACEMENT PENDING — attach NEW s73/70-not-elegantly-badly.jpg and s75/77-the-red-shoe.jpg, not a legacy style key. Match machine proportions, panels, kerb and cold light. No red shoe relocated to a new puddle or inserted unnecessarily; this is the machine, not a repeat of shot 79.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Full, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "The vending machine on the empty street, humming, lit, waiting for no one."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Five static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. Then black.

---

### Shot 83 — Static in a window

**Scene 75 · INT./EXT. VARIOUS — NIGHT - SERIES OF SHOTS**

- **File**: `public/images/neonoire/s75/81-static-in-a-window.jpg` — write it exactly here, 81-static-in-a-window.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-81`; displayed board number 83. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 50mm, Static, Low, level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`, `public/images/neonoire/s75/77-the-red-shoe.jpg`, `public/images/neonoire/s72/69-the-wait.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — From a low level locked camera at 70cm, a small old boxy CRT sits inside a dark shop window showing only grey static. Wet glass reflects indistinct empty street architecture, not a person. Enough window frame remains around the television to read as a place, not a floating screen. Restrained muted colour surrounds the grey snow. REPLACEMENT PENDING — ignore the old study. Same practical-light colour grammar, no programme, face, news ticker or readable overlay. Then CUT TO BLACK as the screenplay specifies; do not generate a title card or a sixth montage image.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Insert, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "A small television in a shop window, showing only static."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Five static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. Then black.

---
