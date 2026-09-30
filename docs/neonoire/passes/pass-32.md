# NEONOIRE — keyframe pass 32

5 shots still to generate: shots 314–313, from scene 75 (INT./EXT. VARIOUS) and scene 100 (INT. KANEKO'S NEW COUNTER) and scene 51 (INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT) and scene 63 (INT. KATO RENTAL LOCKERS, UENO) and scene 71 (INT. THE HIVE, PASSAGE).

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

### Shot 314 — The empty crossing

**Scene 75 · INT./EXT. VARIOUS — NIGHT - SERIES OF SHOTS**

- **File**: `public/images/neonoire/s75/314-the-empty-crossing.jpg` — write it exactly here, 314-the-empty-crossing.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-314`; displayed board number 314. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 50mm, Static, Eye level. Lighting: Blue hour. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/s73/70-not-elegantly-badly.jpg`, `public/images/neonoire/s73/72-the-lost-heel.jpg`, `public/images/neonoire/s75/77-the-red-shoe.jpg`, `public/images/neonoire/s72/69-the-wait.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The pedestrian crossing from 27 and 62. Empty. The signal turns green for no one and the old melody CHIMES across the wet street, all the way to the end. No people, no lit windows, no radio through a wall — the one still that breaks the film's rule on purpose. THE RULE BREAK, named on the page: scene 75 is the only time in the film the city holds no other lives, and the score enters exactly as this melody ends. Same crossing as scene 27, wet like everything before 98. Placeholder slot — the last pillow shot to be generated, and the only one with sound.



CONTINUITY — TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. RECAST 25 September 2026 as a white American — follow the regenerated sheets/jack.jpg and jack-face.jpg: tall lean build, long angular face, hollow cheeks, deep-set tired grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.






FRAMING — Wide, 50mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "The signal turns green for no one, and the old melody CHIMES across the wet street, all the way to the end."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Six static low-level 50mm colour pillow shots. No people, even in reflections. Same props and locations; Hive whole. The sixth is the empty crossing from 27 and 62 — the melody runs all the way to the end of the frame, and as it ends the score enters for the first time in the film. Then black.

---

### Shot 320 — The news nobody watches

**Scene 100 · INT. KANEKO'S NEW COUNTER — NIGHT**

- **File**: `public/images/neonoire/s100/320-the-news-nobody-watches.jpg` — write it exactly here, 320-the-news-nobody-watches.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-320`; displayed board number 320. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 35mm, Static, Low angle. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — On a shelf above the door, a small old television with the sound down: a man walking into a building between lawyers, cameras flashing, his face composed; a photograph of a detective in uniform; then the weather. Nobody looks up. The chyron stays unread; the faces are legible, the verdict is not. Vera walks past this frame to her stool — the counter's last wide holds both. Placeholder slot.










FRAMING — Medium, 35mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "KUROSE walking into a building between lawyers, cameras flashing, his face composed."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 35mm for the arch and the six stools; 50mm on the sound-down television, read and unregarded; 50mm from behind Vera for the hold. The curtain stays a fourth wall until it doesn't: the last frame is the lit window behind it.

---

### Shot 311 — The hand on the model

**Scene 51 · INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT — DAWN**

- **File**: `public/images/neonoire/s51/311-the-hand-on-the-model.jpg` — write it exactly here, 311-the-hand-on-the-model.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-311`; displayed board number 311. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, Low angle. Lighting: Low key. Working duration 10s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A man's hand, clean, an expensive watch, lifts the Hive out of the model and sets it on a tray beside a cup of tea. Underneath, the plaza is already finished: tiny painted people crossing it. The watch is the one Vera sees again in scene 94 ("The watch from the model") — same prop, same cuff. The painted people rhyme with the hoarding renderings of scene 15 and the crossing of scene 75; this is their first. The Hive block resting on the tray beside the tea: the film's most violent gesture is a hand tidying. Placeholder slot.










FRAMING — Insert, 85mm, Static, Low angle, lit by low key.
DRAFT — the draft's own words for this shot: "The plaza underneath is already finished. Tiny painted people cross it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 35mm static, square to the table; 85mm only for the hand and the watch. The only move in the scene is a hand lifting a neighbourhood off a plaza.

---

### Shot 312 — Daniel voss flyleaf

**Scene 63 · INT. KATO RENTAL LOCKERS, UENO — NIGHT**

- **File**: `public/images/neonoire/s63/312-daniel-voss-flyleaf.jpg` — write it exactly here, 312-daniel-voss-flyleaf.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-312`; displayed board number 312. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Extreme close-up, 85mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: 
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The small notebook opened under the tube: English handwriting across a page gone soft — and on the flyleaf, in a steady hand, the name. THIRD OF THE SEVEN NAMED CLOSE-UPS. LEGIBLE-TEXT FRAME: the flyleaf reads exactly DANIEL VOSS — read every letter at full size before install, per the house rule. Same cloth cover, same handwriting as the notebook of scenes 77–79 and the envelope of 22. Placeholder slot.










FRAMING — Extreme close-up, 85mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "He opens the notebook. English handwriting. On the flyleaf: DANIEL VOSS."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 35mm down the rows; 85mm on the flyleaf and on the cassette; the lockers rattle like doors being tried.

---

### Shot 313 — Drawings in the water

**Scene 71 · INT. THE HIVE, PASSAGE — CONTINUOUS**

- **File**: `public/images/neonoire/s71/313-drawings-in-the-water.jpg` — write it exactly here, 313-drawings-in-the-water.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-313`; displayed board number 313. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 50mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Pages from a sketchbook soaking in the thin shining stream that runs along the floor of the passage: pencil counters, a rail viaduct, the back of a woman's head — the ink beginning to lift off the paper. FOURTH OF THE SEVEN NAMED CLOSE-UPS, and the last look at Mara's work before Kaneko and the old woman kneel to gather it, page by page. The pencil hand matches the scene 14 wall and the dried stack of scene 84 — same stock, later. Placeholder slot.










FRAMING — Insert, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Pages of drawings, soaking in the thin shining stream that runs along the floor."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The floor of the passage, and a thousand windows waking above it.

---
