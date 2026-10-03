# NEONOIRE — keyframe pass 34

7 shots still to generate: shots 334–340, from scene 14 (INT./EXT. JACK'S CAR, KANDA).

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

### Shot 334 — The mirror

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/334-the-mirror.jpg` — write it exactly here, 334-the-mirror.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-334`; displayed board number 334. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The rear-view mirror of an old car at night in the rain. From it, on a loop of string, the red bird clip swings with the turn; in the glass behind the clip, one pair of headlights, dipped and patient. Placeholder slot for the 2 October 2026 insertion of scene 14A. The clip is the small red enamel bird of scenes 9 and 14, hung by a short loop of string, caught mid-swing. The headlights in the mirror are single and steady: the same distance every turn, never closer, never farther. No people in frame.










FRAMING — Insert, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "From the rear-view mirror, on a loop of string, the red bird clip swings with each turn."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 335 — The lane mouth

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/335-the-lane-mouth.jpg` — write it exactly here, 335-the-lane-mouth.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-335`; displayed board number 335. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 35mm, Static, Low, level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: 
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Kanda's backstreet at night, seen from behind and low: Jack's old grey sedan stopped at the mouth of the lane, engine and lights dead, exactly where the black sedan stopped in the cold open. Forty metres back along the wet road a pair of headlights slows, stops and goes out. Placeholder slot. The car is `s31/169-the-only-car.jpg`, one headlight dimmer than the other, and the lane is the cold-open street: the vending machine's white at the corner, the amber bar sign at the far end. The following car is only a dark shape and two lamps going out.










FRAMING — Wide, 35mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "He stops at the mouth of the lane, exactly where the sedan stopped, and kills the engine and lights."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 336 — The lighter

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/336-the-lighter.jpg` — write it exactly here, 336-the-lighter.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-336`; displayed board number 336. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: 
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A maroon hatchback's side window, steamed and wound halfway down. Vera at the wheel, both hands on it, looking up. Outside in the rain Jack holds out his open palm: the old steel lighter, open, unlit. Placeholder slot. The joke is that what looked like a hand going for a gun was a lighter: it must read at a glance, with no flame, and nothing else in his hand. Vera follows `sheets/vera.jpg`, no clip. Rental sticker in the windscreen.










FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He takes his hand from his pocket. The old steel lighter, open, unlit."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 337 — Engine off

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/337-engine-off.jpg` — write it exactly here, 337-engine-off.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-337`; displayed board number 337. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Two-shot, 35mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: 
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Through the streaked windscreen, from the bonnet: Jack and Vera side by side in the dark car, engine off, the rain turning the lane into smears of light. At the far end, small and amber, the bar sign. The red bird clip hangs in the mirror above them and the blue umbrella drips on the floor. Placeholder slot. The scene's master: both faces readable through the glass, both looking forward at the lane, a hand's width of seat between them. The clip must be in frame. Keep the interior bare and old: no phone, no brands.










FRAMING — Two-shot, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Engine off. Rain on the windscreen, no wipers; the glass turns the lane into smears of light."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 338 — The rice ball

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/338-the-rice-ball.jpg` — write it exactly here, 338-the-rice-ball.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-338`; displayed board number 338. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, High angle. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: 
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Vera's lap: a convenience-store rice ball, unwrapped and uneaten, her hands lying beside it. At the edge of the frame the paper bag, and the hem of the charcoal coat. Placeholder slot. The seed of the breakfast in 25A: she feeds other people and forgets to eat. Her hands do not hold it; no bite out of it.










FRAMING — Insert, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "A long silence. The rice ball in her lap, unwrapped, uneaten."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 339 — Not running from you

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/339-not-running-from-you.jpg` — write it exactly here, 339-not-running-from-you.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-339`; displayed board number 339. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: 
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Jack in profile, eyes on the lane, saying it to the windscreen. Vera in the foreground, half out of focus, has turned to look at him for the first time since she sat down. He does not look back. Placeholder slot. The scene's one close-up, and rare on purpose: the warmth is entirely in her face and entirely withheld in his. Light from the lane's amber and the dashboard; no tears, no smile.










FRAMING — Medium close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Whatever happened to her, she wasn't running from you."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---

### Shot 340 — The shuttered door

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/340-the-shuttered-door.jpg` — write it exactly here, 340-the-shuttered-door.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-340`; displayed board number 340. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The lane from the car's position through the glass: a man under a black umbrella tilted low, face lost beneath it, standing at the bar's shuttered door under the amber sign, one hand on the handle. Placeholder slot. The watcher is a silhouette with no face and no card: dark raincoat, black umbrella, nothing that says whose man he is. The street is the cold-open lane: shutters, the vending machine's cold white at the corner, the amber sign over a door that is shut.










FRAMING — Wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He goes to the bar's shuttered door. Tries the handle. Stands under the amber sign, looking up and down the lane."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---
