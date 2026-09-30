# NEONOIRE — keyframe pass 31

2 shots still to generate: shots 310–302, from scene 51 (INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT) and scene 82 (INT. TOTO SHIMBUN NEWSROOM, CORRIDOR).

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

### Shot 310 — The model at dawn

**Scene 51 · INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT — DAWN**

- **File**: `public/images/neonoire/s51/310-the-model-at-dawn.jpg` — write it exactly here, 310-the-model-at-dawn.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-310`; displayed board number 310. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Low key. Working duration 8s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The fortieth floor, grey with dawn, nobody in the leather chairs. On the long table the model of the redevelopment: glass towers, sponge trees, a broad white plaza — and at the plaza's edge one small, dark, patched block, out of place among the towers. The Hive. Same model stock as the scene 83 master (`s83/113-very-clean.jpg`): the little plaza, the patched block, the towers. The camera is at a standing height — nobody is seated, nobody has arrived. Placeholder slot.










FRAMING — Wide, 35mm, Static, Eye level, lit by low key.
DRAFT — the draft's own words for this shot: "At the plaza's edge sits one small, dark, patched block, out of place among the towers. The Hive."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 35mm static, square to the table; 85mm only for the hand and the watch. The only move in the scene is a hand lifting a neighbourhood off a plaza.

---

### Shot 302 — The copies

**Scene 82 · INT. TOTO SHIMBUN NEWSROOM, CORRIDOR — LATER**

- **File**: `public/images/neonoire/s82a/302-the-copies.jpg` — write it exactly here, 302-the-copies.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-302`; displayed board number 302. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 20s (not a locked time).
- **Continuity references to attach**: 
- Harada — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — At the office door, Harada hands Vera the folder: a stack of photocopies, warm from the machine. Vera takes it in both hands. Behind them the copier's lid is still up and the clerk is closing the notebook. Holds the hook: "Kondo's files were in his desk. Six months of redevelopment money, and Kurose's name in most of it. And the grey car that left the Hive last night was found burnt out in Adachi at dawn. Registered to a security company. The company belongs to Kurose Development." — and "Tomorrow we put it to them for comment. They will refuse to see a reporter." / "I'll go." / "That is not your job." / "It isn't yours either. He'll see me. (beat) He'll want to look at me." The folder is plain, untitled, and it is what Vera carries into scene 83. Placeholder study — the keyframe is still to generate.










FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "The copies. Not the original."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Jack talking behind the glass where Vera cannot hear him, and a photocopier making her father's handwriting flash white. The evidence chain starts here: every page copied, the original into the safe, and the folder that will go to Kurose.

---
