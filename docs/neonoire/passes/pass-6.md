# NEONOIRE — keyframe pass 6

10 shots still to generate: shots 51–60, from scene 6 (INT. POLICE STATION, INTERVIEW ROOM) and scene 7 (INT. POLICE STATION, DETECTIVES' ROOM).

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

### Shot 51 — The interview room

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/51-the-interview-room.jpg` — write it exactly here, 51-the-interview-room.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Small. A table, two chairs, a box of tissues nobody has touched in years. Rain on a frosted window. The room is the same institution as the counter, one door further in: the same flicker on the edge of frame, the same tired paint. No mirror, no camera, no observer — this is not an interrogation room and the film never says whether that is good.
FRAMING — Wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Small. A table, two chairs, a box of tissues nobody has touched in years. Rain on a frosted window."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 52 — The paper cup of tea

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/52-the-paper-cup-of-tea.jpg` — write it exactly here, 52-the-paper-cup-of-tea.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — DETECTIVE ISHIDA sets a paper cup of tea in front of Vera. Gentle. Unhurried. Tired, in a way that looks like decency. His first act in the film is a kindness. Everything he does afterwards has to be able to be read either way.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "DETECTIVE ISHIDA (50s) sets a paper cup of tea in front of Vera. Gentle. Unhurried. Tired, in a way that looks like decency."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 53 — The untouched tea

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/53-the-untouched-tea.jpg` — write it exactly here, 53-the-untouched-tea.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — The paper cup going cold between them, a thin curl of steam at the start of the shot and none of it by the end. The cup is still full at the end of the scene, three shots and one room later. Its steam is the clock of this scene the way the wall clock is the clock of the last one.
FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Is something wrong? He looked at the screen, and then --"

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 54 — You must be cold

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/54-you-must-be-cold.jpg` — write it exactly here, 54-you-must-be-cold.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Ishida, seated: "You must be cold." His English is excellent, and it is a test of something. American-accented English from a Japanese detective in his fifties — cast for warmth, not menace. No push-in, no music.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "You must be cold."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 55 — I speak japanese

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/55-i-speak-japanese.jpg` — write it exactly here, 55-i-speak-japanese.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Vera answers in Japanese: "I speak Japanese." A small beat. He accepts it with a mild smile: of course, but this is a difficult thing, it is easier in your own language. She lets it go. Her Japanese is fluent and slightly formal — the language of a child who grew up here and an adult who came back. The subtitles carry what she gains by refusing the English.
FRAMING — Medium close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "I speak Japanese."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 56 — Three days ago

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/56-three-days-ago.jpg` — write it exactly here, 56-three-days-ago.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Two-shot, 35mm, Static, Eye level. Lighting: Practical night. Working duration 16s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — "When did you last see your sister?" — "Three days ago. At my apartment. We had dinner." — "And how did she seem?" Vera hesitates. "Normal." The scene's one true lie by omission, and the audience already knows what Vera does not: her sister is alive, hiding behind a bar counter in Kanda. Play the hesitation as embarrassment, not guilt.
FRAMING — Two-shot, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Three days ago. At my apartment. We had dinner."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 57 — He waits

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/57-he-waits.jpg` — write it exactly here, 57-he-waits.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Ishida waits, kindly, as if he knows there is more. She doesn't give it. The longest silence of the scene and the only one the film lets him win. No cutaway — the audience sits in it with Vera.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Ishida waits, kindly, as if he knows there is more. She doesn't give it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 58 — Why kanda

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/58-why-kanda.jpg` — write it exactly here, 58-why-kanda.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 14s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — "Did she ever mention Kanda? Friends there? Work?" — "Kanda? No. Why Kanda?" — "We ask about many places." — "You asked about one." Her third line in a row is a cornering, and he enjoys it: the only light moment in the room. Kanda is the street the audience has just been in, and nobody in the film will say why.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Kanda? No. Why Kanda?"

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 59 — The card

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/59-the-card.jpg` — write it exactly here, 59-the-card.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 15s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — He slides his card across the table. She takes it, stands, picks up the blue umbrella: "She will call." — "I'm sure she will." She goes; the door closes. Ishida sits alone a moment, looking at the untouched tea. End on Ishida and the full cup he is left with: he knows what she does not, and the film gives the audience exactly one look at it. No music into the cut.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He slides his card across the table. She takes it. Stands. Picks up the blue umbrella."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 60 — The detectives room

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/60-the-detectives-room.jpg` — write it exactly here, 60-the-detectives-room.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Rows of cluttered desks under humming fluorescent light. Most are empty at this hour. A radio plays low somewhere. The same building as the counter and the interview room, one floor further in, and it is the emptiest frame in the opening. The radio is the room's only human sound.
FRAMING — Wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Rows of cluttered desks under humming fluorescent light. Most are empty at this hour. A radio plays low somewhere."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---
