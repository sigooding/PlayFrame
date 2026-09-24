# NEONOIRE — keyframe pass 3

8 shots still to generate: shots 23–30, from scene 2 (INT. SMALL BAR, KANDA) and scene 3 (EXT. VERA'S APARTMENT BUILDING).

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

### Shot 23 — Behind the counter

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/23-behind-the-counter.jpg` — write it exactly here, 23-behind-the-counter.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Full, 35mm, Static, Low angle. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She stands dripping, looking for somewhere to go. There is nowhere. She slips behind the far end of the counter and crouches out of sight of the door, her back against the shelves. She opens her hand: the key. She closes it again. The key returns here for a beat only, then goes back into her fist. Do not light it specially — it is not yet a magic object.
FRAMING — Full, 35mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "She slips behind the far end of the counter and crouches out of sight of the door, her back against the shelves."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 24 — From the floor

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/24-from-the-floor.jpg` — write it exactly here, 24-from-the-floor.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: POV, 24mm, Static, Low angle. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — We see only what she sees: the underside of the counter, a crate of empty bottles, the journalist's shoes beneath his stool, and the TV's flickering blue glow on the ceiling. This framing is the law of the rest of the scene: shoes, ankles, and what the floor sees. The audience knows exactly as much as she does and no more.
FRAMING — POV, 24mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "FROM THE FLOOR, we see only what she sees: the underside of the counter, a crate of empty bottles, the journalist's shoes beneath his stool, and the TV's flickering blue glow on the ceiling."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 25 — Two pairs of shoes

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/25-two-pairs-of-shoes.jpg` — write it exactly here, 25-two-pairs-of-shoes.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Full, 35mm, Static, Low angle. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — The door opens again. Softly, this time. Two pairs of black shoes step inside, wet and silent. The journalist's shoes shift; he stands. No faces, no full figures — shoes and the bottom of the frame only. The softness of the door is the whole threat.
FRAMING — Full, 35mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Two pairs of black shoes step inside. Wet. Silent."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 26 — The variety show

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/26-the-variety-show.jpg` — write it exactly here, 26-the-variety-show.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — No answer. Two suppressed shots. The stool tips over; the journalist hits the floor on the far side of the counter. We see only his hand. On the TV, the studio audience laughs. The TV is in the frame and the murder is not. The laugh track lands on the cut and holds — this is the film's coldest joke and it is never underlined.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Two suppressed SHOTS."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 27 — The notebook

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/27-the-notebook.jpg` — write it exactly here, 27-the-notebook.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — One pair of shoes crosses to the body. Pages rustle. The notebook, taken. In the back room, the crate-moving stops. A pair of shoes turns toward the half-open door and waits. Nothing moves. The notebook leaving is the scene's real information: they knew what he had. Someone in the back room is now in the film whether they know it or not.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "One pair of shoes crosses to the body. Pages rustle. The notebook, taken."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 28 — The blue glow

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/28-the-blue-glow.jpg` — write it exactly here, 28-the-blue-glow.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 11s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She stays exactly where she is, shaking so hard the bottles in the crate beside her begin to clink; she presses her hand flat against them to make them stop. The TV audience laughs again. Hold on her face in the blue glow: a young woman who has just understood that this was not random. The hand flat on the bottles is the performance. Every light in the frame is a practical: the TV is blue, the bottles are amber, and she is in the middle of them.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "HOLD on her face in the blue TV glow: a young woman who has just understood that this was not random."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 29 — Apartment block

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/29-apartment-block.jpg` — write it exactly here, 29-apartment-block.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Establishing, 24mm, Static, Eye level. Lighting: Blue hour. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — An old four-story apartment block squeezed between newer buildings, seen from across the road in the rain. Windows, balconies, an external stair, bicycles at the foot of the wall. SUPER: "THREE DAYS LATER". The block belongs to no single decade: a modern tower behind it, laundry that has not been brought in, a hand-painted sign at street level. The super is the only text in the frame.
FRAMING — Establishing, 24mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "An old four-story apartment block squeezed between newer buildings."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---

### Shot 30 — The elevated line

**Scene 3 · EXT. VERA'S APARTMENT BUILDING — DUSK**

- **File**: `public/images/neonoire/s3/30-the-elevated-line.jpg` — write it exactly here, 30-the-elevated-line.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Blue hour. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/06-the-block.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — A train slides past on the elevated line behind the block, its windows lit, and the whole building trembles faintly. Rain on everything. The tremble is the point — this is the film's other-lives rule, thousands of people moving past one lit window. Shoot the train's blur, not its detail.
FRAMING — Wide, 35mm, Static, Eye level, lit by blue hour.
DRAFT — the draft's own words for this shot: "A train slides past on the elevated line behind it, windows lit, and the whole building trembles faintly."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Dusk, going blue, and the first time the film has been out in any kind of daylight. The city still lights the frame: one lit window on the third floor, a train's windows sliding past on the elevated line, sodium starting up at street level. SUPER: THREE DAYS LATER.

---
