# NEONOIRE — keyframe pass 7

7 shots in this pass (shots 61–67, scene 6 (INT. POLICE STATION, INTERVIEW ROOM) and scene 7 (INT. POLICE STATION, DETECTIVES' ROOM)). Every keyframe is already on disk — this brief is for regeneration and review, not missing coverage.

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

### Shot 61 — The card

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/61-the-card.jpg` — write it exactly here, 61-the-card.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 15s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He slides his card across the table. She takes it, stands, picks up the blue umbrella: "She will call." — "I'm sure she will." She goes; the door closes. Ishida sits alone a moment, looking at the untouched tea. End on Ishida and the full cup he is left with: he knows what she does not, and the film gives the audience exactly one look at it. No music into the cut.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He slides his card across the table. She takes it. Stands. Picks up the blue umbrella."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 62 — The detectives room

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/62-the-detectives-room.jpg` — write it exactly here, 62-the-detectives-room.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 24mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Rows of cluttered desks under humming fluorescent light. Most are empty at this hour. A radio plays low somewhere. The same building as the counter and the interview room, one floor further in, and it is the emptiest frame in the opening. The radio is the room's only human sound.
FRAMING — Wide, 24mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Rows of cluttered desks under humming fluorescent light. Most are empty at this hour. A radio plays low somewhere."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 63 — The bottom drawer

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/63-the-bottom-drawer.jpg` — write it exactly here, 63-the-bottom-drawer.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Ishida sits at his desk and opens the bottom drawer. He does not look around first. He has already decided what he is going to do and the audience is allowed to see that he made the decision before this scene began.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Ishida sits at his desk and opens the bottom drawer."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 64 — The evidence bag

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/64-the-evidence-bag.jpg` — write it exactly here, 64-the-evidence-bag.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, High angle. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Sealed in a clear evidence bag: Mara's purse. The torn strap coiled beside it. Still damp. Continuity with scene 1: the same purse, the same torn strap that snagged the barbershop pole, still wet, and the contents are never shown. Do not re-light it as a horror prop — it is an exhibit in a bag on a desk.
FRAMING — Insert, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Sealed in a clear evidence bag: Mara's purse. The torn strap coiled beside it. Still damp."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 65 — He looks at it

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/65-he-looks-at-it.jpg` — write it exactly here, 65-he-looks-at-it.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He looks at it a long moment. The film holds with him and gives him nothing to say. The film's last look at a person in the opening, and it is on a man who has chosen his side quietly. No reaction shot of anyone else; the room is empty.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He looks at it a long moment."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 66 — Drawer closed

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/66-drawer-closed.jpg` — write it exactly here, 66-drawer-closed.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He closes the drawer. One action, no emphasis, and the case goes back out of the record. Sound it plainly, like a filing cabinet in an empty building.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Closes the drawer."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---

### Shot 67 — The clock

**Scene 7 · INT. POLICE STATION, DETECTIVES' ROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s7/67-the-clock.jpg` — write it exactly here, 67-the-clock.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg` — none, the city carries the shot

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — On the wall, the clock runs a minute fast. Cut to black. The same clock as scene 5, the same minute it has always been fast by, and the last shot of the opening. Hold it a beat past comfortable, then cut on the radio.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "On the wall, the clock runs a minute fast."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Rows of cluttered desks under humming fluorescent light, most of them empty at this hour, a radio playing low somewhere. No dialogue at all. Four shots of a man deciding not to tell anyone, and one shot of a clock that runs a minute fast.

---
