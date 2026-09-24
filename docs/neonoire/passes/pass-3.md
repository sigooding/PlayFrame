# NEONOIRE — keyframe pass 3

10 shots in this pass (shots 21–30, scene 2 (INT. SMALL BAR, KANDA)). Every keyframe is already on disk — this brief is for regeneration and review, not missing coverage.

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

### Shot 21 — The journalist

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/21-the-journalist.jpg` — write it exactly here, 21-the-journalist.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — In the corner: a JOURNALIST in his forties, an untouched beer in front of him, a notebook closed beside it. He checks his watch. Checks the door. He is not waiting for the person he says he is waiting for. He is killed in four shots' time and the film gives him no backstory here. Play the waiting as habit, not nerves.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "In the corner, a JOURNALIST (40s), an untouched beer in front of him, a notebook closed beside it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 22 — Mara bursts in

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/22-mara-bursts-in.jpg` — write it exactly here, 22-mara-bursts-in.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Mara, soaked, too out of breath to speak, stands in the doorway with the rain behind her. She brings the street's weather in with her. Keep her soaked hair and jacket exactly as in scene 1 — this is the same night, minutes later.
FRAMING — Wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "The door BANGS open. Mara, soaked, too out of breath to speak."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 23 — Not his business

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/23-not-his-business.jpg` — write it exactly here, 23-not-his-business.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He glances up, startled, then away. Not his business. His decision not to help is the last decision he makes. No emphasis, no irony, no push-in.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "The journalist glances up, startled. Then away. Not his business."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 24 — Behind the counter

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/24-behind-the-counter.jpg` — write it exactly here, 24-behind-the-counter.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Full, 35mm, Static, Low angle. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She stands dripping, looking for somewhere to go. There is nowhere. She slips behind the far end of the counter and crouches out of sight of the door, her back against the shelves. She opens her hand: the key. She closes it again. The key returns here for a beat only, then goes back into her fist. Do not light it specially — it is not yet a magic object.
FRAMING — Full, 35mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "She slips behind the far end of the counter and crouches out of sight of the door, her back against the shelves."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 25 — From the floor

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/25-from-the-floor.jpg` — write it exactly here, 25-from-the-floor.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: POV, 24mm, Static, Low angle. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — We see only what she sees: the underside of the counter, a crate of empty bottles, the journalist's shoes beneath his stool, and the TV's flickering blue glow on the ceiling. This framing is the law of the rest of the scene: shoes, ankles, and what the floor sees. The audience knows exactly as much as she does and no more.
FRAMING — POV, 24mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "FROM THE FLOOR, we see only what she sees: the underside of the counter, a crate of empty bottles, the journalist's shoes beneath his stool, and the TV's flickering blue glow on the ceiling."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 26 — Two pairs of shoes

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/26-two-pairs-of-shoes.jpg` — write it exactly here, 26-two-pairs-of-shoes.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Full, 35mm, Static, Low angle. Lighting: Practical night. Working duration 9s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The door opens again. Softly, this time. Two pairs of black shoes step inside, wet and silent. The journalist's shoes shift; he stands. No faces, no full figures — shoes and the bottom of the frame only. The softness of the door is the whole threat.
FRAMING — Full, 35mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Two pairs of black shoes step inside. Wet. Silent."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 27 — The variety show

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/27-the-variety-show.jpg` — write it exactly here, 27-the-variety-show.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Journalist — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — No answer. Two suppressed shots. The stool tips over; the journalist hits the floor on the far side of the counter. We see only his hand. On the TV, the studio audience laughs. The TV is in the frame and the murder is not. The laugh track lands on the cut and holds — this is the film's coldest joke and it is never underlined.
FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Two suppressed SHOTS."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 28 — The notebook

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/28-the-notebook.jpg` — write it exactly here, 28-the-notebook.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Medium, 50mm, Static, Low angle. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- The Masked Men — no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — One pair of shoes crosses to the body. Pages rustle. The notebook, taken. In the back room, the crate-moving stops. A pair of shoes turns toward the half-open door and waits. Nothing moves. The notebook leaving is the scene's real information: they knew what he had. Someone in the back room is now in the film whether they know it or not.
FRAMING — Medium, 50mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "One pair of shoes crosses to the body. Pages rustle. The notebook, taken."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 29 — The red bird drops

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/29-the-red-bird-drops.jpg` — write it exactly here, 29-the-red-bird-drops.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Insert, 85mm, Static, Low angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She stays exactly where she is, shaking so hard the bottles in the crate beside her begin to clink; she presses her hand flat against them to make them stop. Her red bird hair clip slides loose and drops silently between the crates, out of sight. She doesn't notice. The plant from shot 4 pays off with nobody watching — not Mara, not the room, and the audience only if they are quick. The shaking hand flat on the bottles is the performance; the clip leaves her without her permission, like everything else tonight. Same prop as scene 1: cheap enamel, chipped red, a small bird, falling between the crates into the dark.
FRAMING — Insert, 85mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "Her red bird hair clip slides loose and drops silently between the crates. She doesn't notice."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

### Shot 30 — The blue glow

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/30-the-blue-glow.jpg` — write it exactly here, 30-the-blue-glow.jpg, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)

**Prompt**

```
cinematic film still, anamorphic widescreen, shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The TV audience laughs again. Hold on her face in the blue glow: a young woman who has just understood that this was not random. Her hair hangs looser than it did an hour ago, and she does not know why. Every light in the frame is a practical: the TV is blue, the bottles are amber, and she is in the middle of them. The clip is already gone by this shot — the audience is allowed to have missed it, exactly as she did.
FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "HOLD on her face in the blue TV glow: a young woman who has just understood that this was not random."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---
