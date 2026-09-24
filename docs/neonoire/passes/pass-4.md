# NEONOIRE — keyframe pass 4

10 shots in this pass (shots 31–40, scene 3 (EXT. VERA'S APARTMENT BUILDING) and scene 4 (INT. VERA'S APARTMENT)). Every keyframe is already on disk — this brief is for regeneration and review, not missing coverage.

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

### Shot 31 — Apartment block

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/31-apartment-block.jpg` — write it exactly here, 31-apartment-block.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Establishing, 24mm, Static, Eye level. Lighting: Blue hour. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — An old four-story apartment block squeezed between newer buildings, seen from across the road in the rain. Windows, balconies, an external stair, bicycles at the foot of the wall. SUPER: "THREE DAYS LATER". The block belongs to no single decade: a modern tower behind it, laundry that has not been brought in, a hand-painted sign at street level. The super is the only text in the frame.
FRAMING — Establishing, 24mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "An old four-story apartment block squeezed between newer buildings."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---

### Shot 32 — The elevated line

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/32-the-elevated-line.jpg` — write it exactly here, 32-the-elevated-line.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Blue hour. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A train slides past on the elevated line behind the block, its windows lit, and the whole building trembles faintly. Rain on everything. The tremble is the point — this is the film's other-lives rule, thousands of people moving past one lit window. Shoot the train's blur, not its detail.
FRAMING — Wide, 35mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "A train slides past on the elevated line behind it, windows lit, and the whole building trembles faintly."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---

### Shot 33 — The lit window

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/33-the-lit-window.jpg` — write it exactly here, 33-the-lit-window.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 85mm, Static, Eye level. Lighting: Blue hour. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — One window on the third floor is lit. Rain-streaked glass, a curtain not quite closed, and the shape of a room behind it that the audience will not enter for another eight shots. The only warm light in the frame. Hold it — the audience has just come out of a bar at night in Kanda with a dead man in it.
FRAMING — Medium, 85mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "One window on the third floor is lit."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---

### Shot 34 — Laundry in the rain

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/34-laundry-in-the-rain.jpg` — write it exactly here, 34-laundry-in-the-rain.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Low angle. Lighting: Blue hour. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Laundry left out on a balcony, getting rained on: a shirt, a towel, two pegs. It has been there since before the rain started. Nobody in this film is coming back for the washing. No movement in frame except the rain and, at the very end, the train's light crossing it.
FRAMING — Insert, 85mm, Static, Low angle, lit by blue hour.
DRAFT — the draft's own words for this shot: "Laundry left out on a balcony, getting rained on."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---

### Shot 35 — The apartment

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/35-the-apartment.jpg` — write it exactly here, 35-the-apartment.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium wide, 24mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Small and tidy. Grey light through rain-streaked glass. A smartphone on the table; an old boxy television in the corner. Nothing here quite belongs to one decade. Vera's whole life in one frame: the low table, two cups, a shelf with one photograph, an umbrella stand by the door. Keep the room clean enough that the two cups read as an arrangement, not as clutter.
FRAMING — Medium wide, 24mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Small and tidy. Grey light through rain-streaked glass."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 36 — The pale blue umbrella

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/36-the-pale-blue-umbrella.jpg` — write it exactly here, 36-the-pale-blue-umbrella.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — By the door: a pale blue umbrella. Bone dry. Bone dry is the whole story of the sisters in one prop: Mara went out without it three days ago and it has not moved since. It travels with Vera for the rest of the opening.
FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "By the door, in the umbrella stand: a pale blue umbrella. Bone dry."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 37 — The photograph

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/37-the-photograph.jpg` — write it exactly here, 37-the-photograph.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Jack Voss — public/images/neonoire/sheets/vera.jpg  (he is in the photograph in scene 4; no sheet of his own yet)
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — One framed photograph, its colors gone warm and faded: a Tokyo street twenty years ago. An American man in a rumpled suit, smiling, holding the hands of two small girls — VERA, nine and serious, and MARA, four and mid-laugh. Behind them, the sign of a noodle shop. Three American faces, twenty years ago: Jack Voss in the middle with his daughters. The only warm, saturated colour in the film so far; hold long enough to read the family before the plot takes it away.
FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "On a shelf, one framed photograph, its colors gone warm and faded."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 38 — Vera at the table

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/38-vera-at-the-table.jpg` — write it exactly here, 38-vera-at-the-table.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — VERA VOSS sits at the low table. Two cups: hers holds cold tea, the other is empty and clean, set out as though someone is expected. Her phone lies face up in front of her. She calls. Waits. Wardrobe locked to the Vera continuity sheet: charcoal wool coat not yet on, cream high-neck knit. The second cup is never explained and never emptied.
FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Two cups. Hers holds cold tea. The other is empty and clean, set out as though someone is expected."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 39 — The answerphone

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/39-the-answerphone.jpg` — write it exactly here, 39-the-answerphone.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Mara's recorded voice, bright: "It's Mara. You know what to do." Then the beep, and Vera's face listening to it. The greeting is cheerful — recorded in a better week. Play Vera hearing the difference between that voice and the last three days.
FRAMING — Close-up, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "It's Mara. You know what to do."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 40 — Nothing yet

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/40-nothing-yet.jpg` — write it exactly here, 40-nothing-yet.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Vera opens her mouth. For a moment, nothing. The longest held silence in the opening. No music under it; the old television's murmur is the only sound.
FRAMING — Close-up, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Vera opens her mouth. For a moment, nothing."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---
