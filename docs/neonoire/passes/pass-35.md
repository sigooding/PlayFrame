# NEONOIRE — keyframe pass 35

> **DELIVERED 3 October 2026 — historical brief, not a request to regenerate.** Shot 343 was generated from the
> corrected geometry below (camera behind both cars; the follower showing its rear), installed at
> `public/images/neonoire/s14a/343-forty-metres-back.jpg`, and with it the board reads 322/322 with no placeholder
> left. The first study's refusal and the rule it produced are recorded in
> [rewrite-slots-3-2026-10-03.md](rewrite-slots-3-2026-10-03.md) and
> [rewrite-slots-4-2026-10-03.md](rewrite-slots-4-2026-10-03.md); read those before touching 343.

1 shot still to generate: shots 343–343, from scene 14 (INT./EXT. JACK'S CAR, KANDA).

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

### Shot 343 — Forty metres back

**Scene 14 · INT./EXT. JACK'S CAR, KANDA — NIGHT**

- **File**: `public/images/neonoire/s14a/343-forty-metres-back.jpg` — write it exactly here, 343-forty-metres-back.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-343`; displayed board number 343. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 35mm, Static, Low, level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: 
- Jack — public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The wet road at night from behind: a small maroon hatchback's taillights ahead, and forty metres behind them one old silver-grey sedan with one headlight dimmer than the other, following. The red bird clip is a speck in its mirror. STILL OWED, 3 OCTOBER 2026. A study was generated and **not installed**: it put the following silver-grey sedan NOSE-ON to the camera while the maroon hatchback ahead showed its tail lights — a car that faces us cannot be following a car that is driving away, so the frame contradicted the scene's whole geometry. The scene's logic, fixed here for the next generation: the camera is behind BOTH cars, so the grey sedan shows its REAR (its dim-nearside headlight throwing light forward up the road, not at us), forty metres of shining wet asphalt separate it from the maroon hatchback's tail lights, and nothing else is on the road. The study is recorded in the ledger, not installed on the board.










FRAMING — Wide, 35mm, Static, Low, level, lit by practical night.
DRAFT — the draft's own words for this shot: "Jack counts ten. Then he pulls out after them, forty metres back. Never closer. Never farther."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Through the windscreen and the mirror: two people in a car in the rain, looking at the same lane.

---
