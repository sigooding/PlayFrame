# NEONOIRE — keyframe pass 31

5 shots still to generate: shots 303–307, from scene 96 (INT. POLICE STATION, DETECTIVES' ROOM) and scene 97 (EXT. THE HIVE) and scene 82 (INT. TOTO SHIMBUN NEWSROOM, CORRIDOR) and scene 99 (EXT. THE PLAZA, WHERE THE HIVE WAS).

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

### Shot 303 — He left a statement

**Scene 96 · INT. POLICE STATION, DETECTIVES' ROOM — MORNING**

- **File**: `public/images/neonoire/s96/303-he-left-a-statement.jpg` — write it exactly here, 303-he-left-a-statement.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-303`; displayed board number 303. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Overcast soft. Working duration 12s (not a locked time).
- **Continuity references to attach**: 
- The Young Detective — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The young detective at Ishida's cleared desk, the cardboard box open beside him, the desk phone's receiver at his ear. He listens. His face does not change until it does. He puts the phone down very slowly and looks at the empty chair. STORY PASS 2, 29 September 2026 — the phone call the rewrite added to the scene. It holds the whole call: "Where?" / "In his own car. Under the expressway. Sitting up, engine off. No marks." / "He left a statement." The young detective follows `sheets/young-detective.jpg`; the room, the box and the drawer are shots 145–146's; the empty chair is Ishida's. The clock (147) closes the scene. In the draft this plays between 146 and 147; its number sits in the story-pass-2 coverage block after 302. Placeholder study — the keyframe is still to generate.










FRAMING — Medium, 50mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "He left a statement."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 24mm room, 50mm on the empty drawer and on the desk phone, and scene 7's clock camera by day.

---

### Shot 304 — The crawl

**Scene 97 · EXT. THE HIVE — MORNING**

- **File**: `public/images/neonoire/s97/304-the-crawl.jpg` — write it exactly here, 304-the-crawl.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-304`; displayed board number 304. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, Eye level. Lighting: Overcast soft. Working duration 6s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Close on the shop window's screens: Kurose's photograph on the morning news, the smaller photograph beside it — Ishida — and beneath them a line of text crawling slowly: POLICE DETECTIVE FOUND DEAD. STATEMENT LEFT. The picture is never static: a newsroom moves behind the anchor, someone hands over a page. STORY PASS 2, 29 September 2026 — the Ishida crawl, its own legible-text insert. The crawl reads exactly POLICE DETECTIVE FOUND DEAD. STATEMENT LEFT. and the smaller photograph is Ishida, held to `sheets/ishida.jpg`; Kurose's photograph follows the scene 83 master. The screens are never static: a real programme moves behind the news, per the standing rule. Intercut with shot 149's window; the dialogue over it is Harada's ("He left a statement. He acted alone." / "That is what the police say it says."). Placeholder study — the keyframe is still to generate.










FRAMING — Insert, 85mm, Static, Eye level, lit by overcast soft.
DRAFT — the draft's own words for this shot: "A line of text crawls beneath it: POLICE DETECTIVE FOUND DEAD. STATEMENT LEFT."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 24mm on the tent, 35mm at the shop window and the car, 50mm for the twenty metres, 85mm on Vera and Jack, and one insert on the screens.

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

### Shot 306 — The hoarding

**Scene 99 · EXT. THE PLAZA, WHERE THE HIVE WAS — DAY**

- **File**: `public/images/neonoire/s99a/306-the-hoarding.jpg` — write it exactly here, 306-the-hoarding.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-306`; displayed board number 306. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 35mm, Static, Eye level. Lighting: Natural daylight. Working duration 8s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — At the plaza's edge, the construction hoarding stands over empty pale paving: KUROSE DEVELOPMENT. TOMORROW'S TOKYO. The fountain runs out of focus behind it. The glass towers reflect each other and nobody. Legible-text frame: the hoarding reads exactly KUROSE DEVELOPMENT. TOMORROW'S TOKYO. — the same company banner as the ground-breaking's rendering in scene 97, now flat board beside a finished plaza. Read every letter at full size before install, per the house rule (a clean prop master may join `props/`). The company name on the finished plaza is the film's only comment on what happened to Kurose; nothing else is explained. Placeholder study — the keyframe is still to generate.










FRAMING — Medium, 35mm, Static, Eye level, lit by natural daylight.
DRAFT — the draft's own words for this shot: "At the edge, a hoarding: KUROSE DEVELOPMENT. TOMORROW'S TOKYO."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Months later. Winter light, thin and clear; no rain. The model from Kurose's office built: pale paving, a running fountain, small white trees, glass on three sides, and a gardener straightening a tree that didn't need it. Overhead the same railway, and nothing trembles.

---

### Shot 307 — The gardener

**Scene 99 · EXT. THE PLAZA, WHERE THE HIVE WAS — DAY**

- **File**: `public/images/neonoire/s99a/307-the-gardener.jpg` — write it exactly here, 307-the-gardener.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-307`; displayed board number 307. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Low, level. Lighting: Natural daylight. Working duration 12s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A gardener in a company jacket crosses to one of the little white trees and straightens it with the tip of his finger. It didn't need it. Overhead, the rails begin to sing and a commuter train passes along the viaduct; below, nothing trembles. The film's last grace note: "It didn't need it." The gardener is unnamed and unremarkable, seen at middle distance in a plain company jacket — no face study. The train overhead rhymes with every train that shook the Hive (the bulb swinging in 84, the fire ladder under one train in 91); here the same train passes and nothing answers. Generated against 305 as the plaza's second view. STORY PASS 2, 29 September 2026.










FRAMING — Medium, 50mm, Static, Low, level, lit by natural daylight.
DRAFT — the draft's own words for this shot: "Overhead, an elevated train passes. Nothing trembles."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Months later. Winter light, thin and clear; no rain. The model from Kurose's office built: pale paving, a running fountain, small white trees, glass on three sides, and a gardener straightening a tree that didn't need it. Overhead the same railway, and nothing trembles.

---
