# NEONOIRE — keyframe pass 2

10 shots in this pass (shots 11–20, scene 1 (EXT. BACKSTREET, KANDA) and scene 2 (INT. SMALL BAR, KANDA)). Every keyframe is already on disk — this brief is for regeneration and review, not missing coverage.

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

### Shot 11 — The shot

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/11-the-shot.jpg` — write it exactly here, 11-the-shot.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Flat and ordinary, like a door closing. The old man folds to his knees, then onto his side in the black water. Nobody else in shot; the street carries on around him. No muzzle flash in frame, no blood spray, no sound other than the suppressed shot and the rain. The camera keeps operating as though he has merely walked out of frame.
FRAMING — Wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "A suppressed SHOT. Flat and ordinary, like a door closing."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 12 — Mara hands over mouth

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/12-mara-hands-over-mouth.jpg` — write it exactly here, 12-mara-hands-over-mouth.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Both hands over her mouth, pressed back into the shadow, staring out past camera. Her breath held. The first of the film's few close-ups, so it has to count. Wet hair, cold skin, no glamour.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "In the doorway, Mara has both hands over her mouth."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 13 — Masked man radio

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/13-masked-man-radio.jpg` — write it exactly here, 13-masked-man-radio.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — One of the masked men touches his earpiece and speaks quietly into it. Only his eyes are visible above the mask: flat, unhurried, bored. He is a man doing a job on a shift. Mundane, never menacing in performance; the voice on the radio does the work.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "One of the masked men touches his earpiece."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 14 — Taillights gone

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/14-taillights-gone.jpg` — write it exactly here, 14-taillights-gone.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — They get back in the car. It pulls away, unhurried, taillights smearing red across the wet road and gone. Rain, the vending machine hum, the crossing melody still playing for no one. Mara doesn't move. A pedestrian crossing chimes somewhere off camera for an empty intersection, over and over. The street is emptier after they leave than it was before they came.
FRAMING — Wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "It pulls away, unhurried. Taillights smear red across the road and are gone."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 15 — She kneels

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/15-she-kneels.jpg` — write it exactly here, 15-she-kneels.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 11s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She steps out into the rain and kneels beside him: "It's okay — I'll get someone. Ambulance. I'll call. Ambulance." Her phone is off, and her hands shake too hard to turn it on. The halting Japanese is written as her second language — she is not fluent and the script never pretends she is. Play the fumbling for the phone as shaking hands, not as technology failing.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Every instinct says run. She doesn't. She steps out into the rain and kneels beside him."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 16 — The grip

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/16-the-grip.jpg` — write it exactly here, 16-the-grip.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The old man grips her wrist, stronger than he should be, and presses something small and cold into her palm, folding her fingers around it: "Don't let them have it." The strength in the hand is the only unnatural thing in the scene and it is never explained. Hold on the two hands, not the faces.
FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "The old man grips her wrist, stronger than he should be."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 17 — The key

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/17-the-key.jpg` — write it exactly here, 17-the-key.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A small numbered key on a worn plastic tag. A coin-locker key, held in the palm of her hand, rain falling on it. The film's first prop and the engine of everything after. The tag is worn, the number is legible, and no other handbag contents are shown. Nothing here is explained to the audience.
FRAMING — Insert, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "A small numbered key on a worn plastic tag. A coin-locker key."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 18 — She runs

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/18-she-runs.jpg` — write it exactly here, 18-she-runs.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Headlights, coming back. Mara runs. Her purse strap snags on the barbershop pole and tears; the purse drops into a puddle behind her. She doesn't stop. The torn strap stays looped on the pole for one beat. The purse in the water is the scene's last piece of evidence and the detectives' room's first. Keep the puddle and the purse both in frame at the end of the shot.
FRAMING — Wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Her purse strap snags on the barbershop pole and tears. The purse drops into a puddle behind her."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 19 — The flashlight

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/19-the-flashlight.jpg` — write it exactly here, 19-the-flashlight.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- The Old Man — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The sedan pulls up beside the body. One masked man searches the old man's coat, methodically: nothing. His flashlight drifts across the street — and stops on the purse lying in the water. The search is thorough and ordinary. End on the torch beam on the purse, then cut — no reaction shot of the masked man, no music.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "His flashlight drifts across the street -- and stops on the purse lying in the water."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut; the title card lands on an empty street lit orange.

---

### Shot 20 — The bar

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/20-the-bar.jpg` — write it exactly here, 20-the-bar.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Six stools and a counter. Shelves of bottles glowing amber. On a high shelf an old CRT television plays a late-night variety show with the sound low. Rain drums on the roof. No one behind the counter; the door to the back stands half open. Someone is moving crates in the back room and is never seen. The bar must feel like it has other lives in it: a radio through a wall, laundry upstairs, a lit window across the street.
FRAMING — Medium wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Six stools and a counter. Shelves of bottles glowing amber."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---
