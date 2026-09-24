# NEONOIRE — keyframe pass 1

10 shots in this pass (shots 1–10, scene 1 (EXT. BACKSTREET, KANDA)). Every keyframe is already on disk — this brief is for regeneration and review, not missing coverage.

**Before you start**

- Every frame is **2.39:1 anamorphic**: generate widescreen, then normalise exactly with
  ```bash
  convert FILE.jpg -resize "1912x800^" -gravity center -extent 1912x800 -quality 92 -strip FILE.jpg
  ```
- Attach the continuity sheet (or its face crop) for every named character in the shot, and the studio keys listed for the scene — they are the look the film is already being generated in.
- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.
- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.
- British/American spelling is irrelevant here; **no text at all** unless the board quotes a super.
- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.

### Shot 1 — Backstreet

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/01-backstreet.jpg` — write it exactly here, 01-backstreet.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Establishing, 24mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A narrow street of shuttered shops that could belong to any year of the last forty. Hand-painted signs, tangled wires overhead, wet black asphalt, and at the corner the old vending machine throwing cold white light across the road with rain falling through it in columns. Nobody in frame. Hold the empty street long enough that the audience notices they are alone in it. The vending machine is the brightest thing in the film's first minute; no other light source competes.
FRAMING — Establishing, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "A narrow street of shuttered shops that could belong to any year of the last forty."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 2 — Vending

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/02-vending.jpg` — write it exactly here, 02-vending.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Rain falls through the machine's cold white face in visible columns. Its hum is the loudest thing here. Chipped paint, a grid of glowing cans behind rain-streaked glass, water running off the metal onto the asphalt. This is the sound of the film's opening and its recurring return. Leave room in the frame for the hum — no people, no traffic, no music.
FRAMING — Insert, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Its HUM is the loudest thing here."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 3 — Mara walks

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/03-mara-walks.jpg` — write it exactly here, 03-mara-walks.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium wide, 35mm, Tracking, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — MARA VOSS walks fast, crossing the frame, arms folded, no umbrella, hair soaked flat. She has been crying, or she is about to. The street opens around her: shutters, puddles, sodium orange above, green fluorescent spill beyond. Track with her at her own pace and keep the wide framing — she is inside the city, not apart from it. Wardrobe locked to the Mara continuity sheet: indigo denim jacket, grey tee, black jeans, white trainers, black cord necklace, the red bird enamel clip in her hair.
FRAMING — Medium wide, 35mm, Tracking, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "MARA VOSS (24), American, walks fast, arms folded, no umbrella. Hair soaked flat, held back by a cheap enamel clip shaped like a small red bird. She has been crying, or she is about to."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 4 — The red bird

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/04-the-red-bird.jpg` — write it exactly here, 04-the-red-bird.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Extreme close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Her soaked hair, held back by a cheap enamel clip shaped like a small red bird. Rain beads on the wet strands; the vending machine's cold white light and the sodium orange cross her temple. A small point of enamel red in a street that has none. A plant for scene 2, where the clip drops between the crates unseen. The film's close-ups are rare so they count, and this one is small and ordinary — never held like a clue. Keep the bird legible and the enamel cheap: chipped red paint, a dime-store clasp. The clip is too small to read in the wider shots around it, which is the point.
FRAMING — Extreme close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Hair soaked flat, held back by a cheap enamel clip shaped like a small red bird."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 5 — Mara phone

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/05-mara-phone.jpg` — write it exactly here, 05-mara-phone.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Her phone buzzes; the screen shows the caller, too small and softly blurred to read. Rain on the glass and on her hands. She looks at it. Lets it ring. Screen light does the work. Keep her face in three-quarter and let the street fall to sodium and green out of focus behind her.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Her phone BUZZES. The screen: VERA."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 6 — Phone off

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/06-phone-off.jpg` — write it exactly here, 06-phone-off.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium close-up, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She answers nobody: "Not tonight." Then she switches the phone off and shoves it down into her purse, her eyes already back on the empty street. Play the line to the dead phone, flatly, as a decision rather than a plea. Her sister's name is established here by the phone and nowhere else.
FRAMING — Medium close-up, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "She switches it off and shoves it into her purse."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 7 — Barbershop doorway

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/07-barbershop-doorway.jpg` — write it exactly here, 07-barbershop-doorway.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The rain thickens. She ducks into the recessed doorway of a closed barbershop — the striped pole dark and still beside her — and presses back into the shadow. Going nowhere. The empty wet street holds the rest of the frame. The doorway has to read as a place she could stay for the whole scene. The barbershop pole returns in shot 18 — keep its position and colour consistent.
FRAMING — Wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "She ducks into the recessed doorway of a closed barbershop, its striped pole dark and still, and presses back into the shadow. Going nowhere."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 8 — Old man

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/08-old-man.jpg` — write it exactly here, 08-old-man.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Full, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — An OLD MAN in a cheap raincoat, one hand pressed to his side as if something is hidden there, walks hurriedly across the street, glancing back over his shoulder. He passes Mara's doorway without seeing her. He must pass within a metre of her and still not see her. No reaction from her in this shot — the doorway stays in shadow.
FRAMING — Full, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "An OLD MAN (70s) in a cheap raincoat, one hand pressed to his side as if something is hidden there. He keeps looking back."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 9 — Sedan arrives

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/09-sedan-arrives.jpg` — write it exactly here, 09-sedan-arrives.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Headlights sweep the wet street. A black sedan rolls in and stops without hurry; two men in black clothes and plain masks step out. They don't run. The car and the men fill the frame at car height, rain lit across the beams. No urgency anywhere in this shot. If the sedan looks like a chase car the scene is wrong; it is a car that has done this before.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Headlights sweep the wet street. A black sedan rolls in and stops without hurry."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 10 — Old man stops

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/10-old-man-stops.jpg` — write it exactly here, 10-old-man-stops.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He has stopped in the middle of the wet street, seen from behind: he doesn't turn around. He seems to know there is no point. Keep the headlights as a soft glow on the wet road, never a white beam in frame — the film never shows where the light comes from.
FRAMING — Medium close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "The old man stops. He doesn't turn around. He seems to know there is no point."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---
