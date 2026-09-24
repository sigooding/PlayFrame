# NEONOIRE — keyframe pass 7

5 shots still to generate: shots 61–65, from scene 7 (INT. POLICE STATION, DETECTIVES' ROOM).

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

### Shot 61 — The bottom drawer

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/61-the-bottom-drawer.jpg` — write it exactly here, 61-the-bottom-drawer.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Ishida sits at his desk and opens the bottom drawer. He does not look around first. He has already decided what he is going to do and the audience is allowed to see that he made the decision before this scene began.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Ishida sits at his desk and opens the bottom drawer."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 62 — The evidence bag

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/62-the-evidence-bag.jpg` — write it exactly here, 62-the-evidence-bag.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, High angle. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Sealed in a clear evidence bag: Mara's purse. The torn strap coiled beside it. Still damp. Continuity with scene 1: the same purse, the same torn strap that snagged the barbershop pole, still wet, and the contents are never shown. Do not re-light it as a horror prop — it is an exhibit in a bag on a desk.
FRAMING — Insert, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Sealed in a clear evidence bag: Mara's purse. The torn strap coiled beside it. Still damp."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 63 — He looks at it

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/63-he-looks-at-it.jpg` — write it exactly here, 63-he-looks-at-it.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He looks at it a long moment. The film holds with him and gives him nothing to say. The film's last look at a person in the opening, and it is on a man who has chosen his side quietly. No reaction shot of anyone else; the room is empty.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He looks at it a long moment."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 64 — Drawer closed

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/64-drawer-closed.jpg` — write it exactly here, 64-drawer-closed.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He closes the drawer. One action, no emphasis, and the case goes back out of the record. Sound it plainly, like a filing cabinet in an empty building.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Closes the drawer."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 65 — The clock

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/65-the-clock.jpg` — write it exactly here, 65-the-clock.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — On the wall, the clock runs a minute fast. Cut to black. The same clock as scene 5, the same minute it has always been fast by, and the last shot of the opening. Hold it a beat past comfortable, then cut on the radio.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "On the wall, the clock runs a minute fast."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---
