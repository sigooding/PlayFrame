# NEONOIRE — keyframe pass 30

3 shots still to generate: shots 298–300, from scene 53 (INT. TOTO SHIMBUN NEWSROOM) and scene 82 (INT. TOTO SHIMBUN NEWSROOM, CORRIDOR).

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

### Shot 298 — There was no car

**Scene 53 · INT. TOTO SHIMBUN NEWSROOM — DAY**

- **File**: `public/images/neonoire/s53a/298-there-was-no-car.jpg` — write it exactly here, 298-there-was-no-car.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-298`; displayed board number 298. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 30s (not a locked time).
- **Continuity references to attach**: 
- Harada — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Across Harada's cluttered desk: Harada at right, sleeves rolled, Vera at the edge of left frame in her charcoal coat. Between them at the desk's corner, the framed photograph of the laughing journalist. The take holds the whole exchange and ends on the line. Holds from "We have had a letter from lawyers already" through "The police say what they are told" and "He told two people. Me. And a detective" to "He said the detective had promised to keep a car nearby. (beat) There was no car." — and Vera sitting very still. The journalist is present only as the photograph (`s2/20-the-journalist.jpg`). Harada held to `sheets/harada.jpg`; in the scene 82 studies her bob once read longer and silverer than the master — hold her to the master's grey bob. The frame is the meeting's whole point: two women, one photograph, and a car that was never there. Placeholder study — the keyframe is still to generate.










FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "There was no car."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The scene 82 newsroom by day, three channels at once, and two women across a desk with a photograph between them. Ordinary volume, static camera; the only stillness is Vera hearing that a car was promised and never came.

---

### Shot 299 — The card on the desk

**Scene 53 · INT. TOTO SHIMBUN NEWSROOM — DAY**

- **File**: `public/images/neonoire/s53a/299-the-card-on-the-desk.jpg` — write it exactly here, 299-the-card-on-the-desk.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-299`; displayed board number 299. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, High angle. Lighting: Overcast soft. Working duration 6s (not a locked time).
- **Continuity references to attach**: 
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Kondo's card lies on the cluttered desk beside the framed photograph, Vera's telephone number written across its back in ballpoint. Her hand has just let it go and is leaving the frame. The scene's button. The card reads TOTO SHIMBUN with KONDO in katakana, as Okada handed it over in 27A; the number on its back is written, not printed, and need not be legible. The photograph stays face up beside it — the same photograph as scene 82's. Holds "Will you print it?" / "Print what? A dead man's diary? (beat) Bring me something with a name on it." Placeholder study — the keyframe is still to generate.










FRAMING — Insert, 85mm, Static, High angle, lit by overcast soft.
DRAFT — the draft's own words for this shot: "Vera writes her number on the back of Kondo's card and leaves it on the desk, beside the photograph."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The scene 82 newsroom by day, three channels at once, and two women across a desk with a photograph between them. Ordinary volume, static camera; the only stillness is Vera hearing that a car was promised and never came.

---

### Shot 300 — At the edge of the newsroom

**Scene 82 · INT. TOTO SHIMBUN NEWSROOM, CORRIDOR — LATER**

- **File**: `public/images/neonoire/s82a/300-at-the-edge-of-the-newsroom.jpg` — write it exactly here, 300-at-the-edge-of-the-newsroom.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-300`; displayed board number 300. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Overcast soft. Working duration 12s (not a locked time).
- **Continuity references to attach**: 
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Vera stands alone at the edge of the busy newsroom, a plain folder under her arm and her father's cloth-covered notebook in both hands. Through the glass wall of the office at the back, Jack talks. She cannot hear him. Rhymes with scene 82's locked camera (`s82/104-the-newsroom.jpg`), from the aisle's other end: shot 110 watched Jack through the glass from inside; this watches him from where Vera stands. She holds the notebook in both hands like something she is about to give away. Jack is a figure behind venetian blinds and rain-grey glass, out of focus. The televisions go on with their three channels, never static. Placeholder study — the keyframe is still to generate.










FRAMING — Wide, 24mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "She has never seen him say anything true in that voice."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Jack talking behind the glass where Vera cannot hear him, and a photocopier making her father's handwriting flash white. The evidence chain starts here: every page copied, the original into the safe, and the folder that will go to Kurose.

---
