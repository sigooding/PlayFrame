# NEONOIRE — keyframe pass 6

1 shot still to generate: shots 57–57, from scene 6 (INT. POLICE STATION, INTERVIEW ROOM).

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

### Shot 57 — He waits

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/57-he-waits.jpg` — write it exactly here, 57-he-waits.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, neo-noir Tokyo at night that feels like a memory rather than a specific year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, televisions beside modern details, cold steady rain, wet black asphalt with long mirror reflections, lit almost entirely by practical sources — cold white vending machine glow, sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight, wide patient composition with the figure small in the frame and lots of negative space, quiet, melancholic, nostalgic, restrained, lonely, ordinary city life hinted at in the background: one lit apartment window, laundry on a balcony, a distant train

SUBJECT — Ishida waits, kindly, as if he knows there is more. She doesn't give it. The longest silence of the scene and the only one the film lets him win. No cutaway — the audience sits in it with Vera.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Ishida waits, kindly, as if he knows there is more. She doesn't give it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---
