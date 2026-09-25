# NEONOIRE — keyframe pass 6

1 shot still to generate: shots 57–57, from scene 6 (INT. POLICE STATION, INTERVIEW ROOM).

**Before you start**

- **Interview revision:** shots 51–62 are **16:9 full-bleed, 1920×1080**. Attach the revised room/two-shot masters plus Vera and Ishida’s sheets, and follow `scripts/neonoire/interview-look.mjs`. One paper cup only; preserve the crushed cup and spill after 60. Shots 63–68 are also revised to 16:9; see `detectives-look.mjs`. Use the correct dimensions for each scene; the command below is for this interview pass:
  ```bash
  convert FILE.jpg -resize "1920x1080^" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg
  ```
- Attach the continuity sheet (or its face crop) for every named character in the shot, and the studio keys listed for the scene — they are the look the film is already being generated in.
- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.
- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.
- British/American spelling is irrelevant here; **no text at all** unless the board quotes a super.
- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.

### Shot 57 — He waits

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/57-he-waits.jpg` — write it exactly here, 57-he-waits.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Revision references:** `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`. Follow `scripts/neonoire/interview-look.mjs` for fixed window-sill tissue box, no tie, single paper cup and post-spill continuity.

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Ishida waits, kindly, as if he knows there is more. She doesn't give it. The longest silence of the scene and the only one the film lets him win. No cutaway — the audience sits in it with Vera.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Ishida waits, kindly, as if he knows there is more. She doesn't give it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---
