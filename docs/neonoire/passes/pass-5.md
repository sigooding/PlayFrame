# NEONOIRE — keyframe pass 5

10 shots still to generate: shots 41–50, from scene 4 (INT. VERA'S APARTMENT) and scene 5 (INT. POLICE STATION, FRONT COUNTER).

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

### Shot 41 — Three looks

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/41-three-looks.jpg` — write it exactly here, 41-three-looks.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — The umbrella by the door. The clean empty cup. The photograph. She looks at them in that order. One insert carrying all three objects in depth — umbrella sharp by the door, cups mid-ground, photograph soft on the shelf — so the shot does the looking for her.
FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "She looks at the umbrella by the door. At the clean, empty cup. At the photograph."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 42 — Takes the umbrella

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/42-takes-the-umbrella.jpg` — write it exactly here, 42-takes-the-umbrella.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 35mm, Static, Eye level. Lighting: Overcast soft. Working duration 11s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She stands. Puts on her coat. Hesitates at the door. Then she takes the blue umbrella — Mara's umbrella — and goes. The hesitation is the last beat of Vera's indecision in the film; after this she is looking for her sister and she never stops. Cut on the empty stand.
FRAMING — Medium, 35mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Then she takes the blue umbrella. Mara's umbrella."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 43 — The front counter

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/43-the-front-counter.jpg` — write it exactly here, 43-the-front-counter.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Establishing, 24mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Fluorescent tubes, one of them flickering. A long counter. Faded posters about pickpockets and traffic safety. An old fax machine beside a new flat monitor. A wall clock that runs a minute fast. Nothing in this room has been replaced since the nineties except the monitor, and the monitor is the only thing that matters. The clock is in frame from the first shot of the scene and again in the last of scene 7.
FRAMING — Establishing, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Fluorescent tubes, one of them flickering. A long counter."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 44 — Dripping umbrella

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/44-dripping-umbrella.jpg` — write it exactly here, 44-dripping-umbrella.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She stands at the counter with the closed blue umbrella dripping onto the linoleum. A small puddle is already forming at her feet. The umbrella she took from the stand in scene 4 is in every shot of the police station. It is the only thing she brought with her.
FRAMING — Medium wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Vera stands at the counter, the closed blue umbrella dripping onto the linoleum."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 45 — The young officer

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/45-the-young-officer.jpg` — write it exactly here, 45-the-young-officer.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- The Young Officer — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Polite boredom. He asks for her sister's age; she says twenty-four, in careful, formal Japanese, learned as a child and relearned as an adult. Nothing about him is sinister yet; he is a young man at the end of a shift. The change in him arrives only after the monitor shows him the name.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "A YOUNG OFFICER takes her details with polite boredom."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 46 — Mara voss on screen

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/46-mara-voss-on-screen.jpg` — write it exactly here, 46-mara-voss-on-screen.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- The Young Officer — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He types the name. ON THE MONITOR: MARA VOSS. The name is the film's hinge and the only text on a screen anywhere in the opening. Legible, unglamorous, an ordinary records system.
FRAMING — Insert, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He types the name. ON THE MONITOR: MARA VOSS."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 47 — He stops typing

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/47-he-stops-typing.jpg` — write it exactly here, 47-he-stops-typing.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- The Young Officer — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He stops typing. He looks at the screen a moment too long. The pause is the whole performance. The audience must see the second thought arrive before he does anything about it.
FRAMING — Medium close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He looks at the screen a moment too long."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 48 — The quiet phone call

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/48-the-quiet-phone-call.jpg` — write it exactly here, 48-the-quiet-phone-call.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- The Young Officer — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He picks up the desk phone and turns away from her, quietly: "Yes. That name. Yes — the sister is here now." He hangs up, and his manner has changed. Politer. Turned away from her, three-quarter to camera, the words half-audible in the mix — the audience gets exactly as much as Vera does.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Yes. That name. Yes -- the sister is here now."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 49 — She watches him

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/49-she-watches-him.jpg` — write it exactly here, 49-she-watches-him.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- The Young Officer — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She looks at him. He doesn't meet her eyes. Hold on her, not on him. The flickering tube does the unease; no score, no zoom.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Vera looks at him. He doesn't meet her eyes."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---

### Shot 50 — Someone will be right with you

**Scene 5 · INT. POLICE STATION, FRONT COUNTER — NIGHT**

- **File**: `public/images/neonoire/s5/50-someone-will-be-right-with-you.jpg` — write it exactly here, 50-someone-will-be-right-with-you.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 35mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — "Someone will be right with you." She waits, both hands on the wet handle of the umbrella. End the scene on her waiting and the clock above her — a minute fast, and nobody in the film ever mentions it.
FRAMING — Medium, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Someone will be right with you."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Institutional green-white fluorescent with one tube flickering. Everything in the room is a decade out of step — faded posters, an old fax machine beside a new flat monitor, a wall clock that runs a minute fast. Vera speaks Japanese: fluent, careful, slightly formal.

---
