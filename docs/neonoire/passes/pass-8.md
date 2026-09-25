# NEONOIRE — keyframe pass 8

> **COMPLETED — 25 September 2026.** Every shot briefed here is on disk. Session two delivered the
> remaining replacements (and regenerated the lost-heel and twenty-metre keyframes for continuity);
> this file is kept as a historical record of the briefs, not a request to regenerate anything.
> See [tokyo-streets-revision.md](tokyo-streets-revision.md).

3 shots still to generate: shots 71–78, from scene 73 (EXT. TOKYO STREETS) and scene 74 (EXT. EMPTY STREET UNDER THE TRACKS).

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

### Shot 71 — Vera runs

**Scene 73 · EXT. TOKYO STREETS — NIGHT**

- **File**: `public/images/neonoire/s73/69-vera-runs.jpg` — write it exactly here, 69-vera-runs.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-69`; displayed board number 71. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 50mm, Static, Low, level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s72/69-the-wait.jpg`, `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A low level locked camera at 75cm watches Vera leave the old hotel's warm doorway and begin running into cold rain. Small full figure, wine-red silk calf-length dress, both red court shoes, no coat and no umbrella. Hair is only beginning to wet; the carefully applied makeup is still mostly intact at the threshold, not already ruined. Amber interior gives way to ordinary cold machine light on black asphalt. REPLACEMENT PENDING — generate from the NEW hotel master s72/69-the-wait.jpg and sheets/vera-face.jpg, not the discarded street study. The pale-blue umbrella stays inside the hotel; no bag or coat appears on Vera. Camera stays low and level, not an upward hero angle. No score.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Wide, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "Vera comes out of the hotel into the rain and starts to run."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Tokyo Story in colour: low, level, static 50mm. Rain undoes makeup; right shoe lost, left shoe stays. No tracking or score.

---

### Shot 73 — The machine glows

**Scene 73 · EXT. TOKYO STREETS — NIGHT**

- **File**: `public/images/neonoire/s73/71-the-machine-glows.jpg` — write it exactly here, 71-the-machine-glows.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-71`; displayed board number 73. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 50mm, Static, Low, level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s72/69-the-wait.jpg`, `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A low level static camera at 70cm holds the ivory vending machine and the shuttered street as Vera passes left to right. Same wet wine-red silk dress, both shoes, increasingly rain-plastered hair and thin washed mascara tracks. She leaves the composition; the machine continues lighting the rain without following her. No other person on the street. REPLACEMENT PENDING — use NEW s73/70-not-elegantly-badly.jpg for machine geometry and sheets/vera-face.jpg for identity, never the old image or an old style key. No tracking. Hold the architecture after she passes; this sets up the empty-machine pillow shot 82.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Wide, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "She runs past a vending machine. It glows, indifferent."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Tokyo Story in colour: low, level, static 50mm. Rain undoes makeup; right shoe lost, left shoe stays. No tracking or score.

---

### Shot 78 — The reflection

**Scene 74 · EXT. EMPTY STREET UNDER THE TRACKS — NIGHT**

- **File**: `public/images/neonoire/s74/76-the-reflection.jpg` — write it exactly here, 76-the-reflection.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-76`; displayed board number 78. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 50mm, Static, Low, level. Lighting: Practical night. Working duration 4s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s74/74-twenty-metres-apart.jpg`, `public/images/neonoire/s74/73-two-small-figures.jpg`, `public/images/neonoire/s72/69-the-wait.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A low level camera at 15cm looks across black rainwater beside Vera, not down from a dramatic high angle. Only reflected fragments of the wine-red dress and street occupy the puddle. Within the reflection, a shutter is almost open, a dark window almost warm and a tiny figure under a pale-blue umbrella might be present. No directly visible person under an umbrella and no resolved face or ghost. REPLACEMENT PENDING — ignore the old reflection study. Use only the new street and umbrella masters; face deliberately unreadable. The altered reflection lasts less than one second WITHIN this four-second working insert, never four seconds of a visible ghost. Return to shot 77's locked camera for the train and the late score. This is uncertainty, not an explained supernatural event.


CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. New design follows sheets/jack.jpg and jack-face.jpg: Japanese casting choice, tall lean build, angular handsome tired face, hooded dark eyes, swept-back black hair with silver temples, two-day stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.





FRAMING — Insert, 50mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "In the black water beside Vera, her reflection. And in the reflection, for less than a second, the street is slightly different: a shutter open that is closed, a warm light in a window that is dark, and a figure under a pale blue umbrella who could be Mara, or could be no one."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Tokyo Story in colour: static 50mm; approach, blows, collapse, rejection. 35mm aftermath wide; ambiguous reflection. Late score.

---
