# NEONOIRE — keyframe pass 4

Revised keyframe briefs, 8 shots: shots 33–40, from scene 4 (INT. VERA'S APARTMENT).

**Before you start**

- **Revision, 25 September 2026:** all shots in this pass are **16:9 full-bleed, 1920×1080**. Apartment shots follow `../scenes/n04-vera-apartment.md` and `scripts/neonoire/apartment-look.mjs`: NO paper pendant, cord or reflection; preserve the corrected room master, cups, speakerphone and family photo. Police-station shots follow `../scenes/n05-front-counter.md` and `scripts/neonoire/front-counter-look.mjs`.
  ```bash
  convert FILE.jpg -resize "1920x1080^" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg
  ```
- Attach the continuity sheet (or its face crop) for every named character in the shot, and the studio keys listed for the scene — they are the look the film is already being generated in.
- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.
- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.
- British/American spelling is irrelevant here; **no text at all** unless the board quotes a super.
- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.

### Shot 33 — The apartment

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/33-the-apartment.jpg` — write it exactly here, 33-the-apartment.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Medium wide, 24mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Small and tidy. Grey light through rain-streaked glass. A smartphone on the table; an old boxy television in the corner. Nothing here quite belongs to one decade. Vera's whole life in one frame: the low table, two cups, a shelf with one photograph, an umbrella stand by the door. Keep the room clean enough that the two cups read as an arrangement, not as clutter.
FRAMING — Medium wide, 24mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Small and tidy. Grey light through rain-streaked glass."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 34 — The pale blue umbrella

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/34-the-pale-blue-umbrella.jpg` — write it exactly here, 34-the-pale-blue-umbrella.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — By the door: a pale blue umbrella. Bone dry. Bone dry is the whole story of the sisters in one prop: Mara went out without it three days ago and it has not moved since. It travels with Vera for the rest of the opening.
FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "By the door, in the umbrella stand: a pale blue umbrella. Bone dry."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 35 — The photograph

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/35-the-photograph.jpg` — write it exactly here, 35-the-photograph.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Jack Voss, Vera (9), Mara (4) — `public/images/neonoire/s4/35-the-photograph.jpg`; use the childhood photo, not the adult hair/wardrobe sheets.

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — One framed photograph, its colors gone warm and faded: a Tokyo street twenty years ago. An American man in a rumpled suit, smiling, holding the hands of two small girls — VERA, nine and serious, and MARA, four and mid-laugh. Behind them, the sign of a noodle shop. Three American faces, twenty years ago: Jack Voss in the middle with his daughters. The only warm, saturated colour in the film so far; hold long enough to read the family before the plot takes it away.
FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "On a shelf, one framed photograph, its colors gone warm and faded."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 36 — Vera at the table

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/36-vera-at-the-table.jpg` — write it exactly here, 36-vera-at-the-table.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — VERA VOSS sits at the low table. Two cups: hers holds cold tea, the other is empty and clean, set out as though someone is expected. Her phone lies face up in front of her. She calls. Waits. Wardrobe locked to the Vera continuity sheet: charcoal wool coat not yet on, cream high-neck knit. The second cup is never explained and never emptied.
FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Two cups. Hers holds cold tea. The other is empty and clean, set out as though someone is expected."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 37 — The answerphone

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/37-the-answerphone.jpg` — write it exactly here, 37-the-answerphone.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Mara's recorded voice, bright: "It's Mara. You know what to do." Then the beep, and Vera's face listening to it. The greeting is cheerful — recorded in a better week. Play Vera hearing the difference between that voice and the last three days.
FRAMING — Close-up, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "It's Mara. You know what to do."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 38 — Nothing yet

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/38-nothing-yet.jpg` — write it exactly here, 38-nothing-yet.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Vera opens her mouth. For a moment, nothing. The longest held silence in the opening. No music under it; the old television's murmur is the only sound.
FRAMING — Close-up, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Vera opens her mouth. For a moment, nothing."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 39 — The message

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/39-the-message.jpg` — write it exactly here, 39-the-message.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Medium close-up, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 14s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — "It's me again. I'm not angry anymore. I wasn't really angry then, either. I just —" She stops herself. "You left your umbrella. You'll get soaked. Just call me. You don't have to say anything. Just call, so I know." The apology is the scene's engine: the first of the film's two sisters is asking, the second is running from a doorway in Kanda. Keep the performance small and unsentimental.
FRAMING — Medium close-up, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "You left your umbrella. You'll get soaked."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---

### Shot 40 — The television

**Scene 4 · INT. VERA'S APARTMENT — CONTINUOUS**

- **File**: `public/images/neonoire/s4/40-the-television.jpg` — write it exactly here, 40-the-television.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/04-veras-apartment.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — She hangs up. The old television murmurs to itself: the weather announcer, in Japanese, with rain continuing through the rest of the week. The television is the film's chorus: it explains nothing and is always on. Its light is the room's second source, on the ceiling, exactly as the bar's CRT was.
FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "...rain continuing through the rest of the week..."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Apartment revision overrides older room lighting: no paper pendant; muted amber table-lamp light against cool rain-grey glass.

Scene grammar: Grey rain light through the window and the corner of a CRT; nothing here belongs to one decade — a smartphone on the table beside a boxy television. The camera stays in the room as a guest would: no push-ins, no score. The photograph is the only warm colour in the scene.

---
