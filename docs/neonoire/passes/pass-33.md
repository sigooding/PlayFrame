# NEONOIRE — keyframe pass 33

10 shots still to generate: shots 328–327, from scene 1 (EXT. BACKSTREET, KANDA) and scene 6 (INT. POLICE STATION, INTERVIEW ROOM).

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

### Shot 328 — The scrap

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/328-the-scrap.jpg` — write it exactly here, 328-the-scrap.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-328`; displayed board number 328. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, High angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`, `public/images/neonoire/s1/01-backstreet.jpg`, `public/images/neonoire/s1/03-mara-walks.jpg`, `public/images/neonoire/s1/07-old-man.jpg`, `public/images/neonoire/s1/08-sedan-arrives.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The note in her hands. Her handwriting, in biro: 1.00 Sakai. Underneath is an address. Beneath that, underlined twice: "just listen." Placeholder slot for the 2 October 2026 cold-open rewrite. A torn scrap of paper in a wet hand, biro, her fast square-ish handwriting: 1.00 Sakai, an address beneath it (the old retired coverage 280 read Kanda 2-3-1 — keep that address), and under that, underlined twice, "just listen." Rain on the paper; her cuff and the denim jacket only.
CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward.
CONTINUITY — Target: 16:9 full-bleed (1920×1080), no letterbox. Street master s1/01-backstreet.jpg: LEFT foreground closed brown wooden barbershop door in dark brick recess, faded navy awning, grey shutter to its left, ONE unlit red-white-blue barber pole immediately RIGHT of recess; ONE battered off-white vending machine opposite on RIGHT, three cold-white drink rows/red payment panel. Fixed narrow wet road, distant amber lamp/T-junction, faint green spill down right, overhead wires and steady ordinary rain, restrained desaturated 35mm grain/halation, never glossy cyberpunk. Mara matches sheets/mara.jpg and s1/03-mara-walks.jpg: American, 24, pale blue eyes, long ash-blonde hair soaked flat, small red enamel bird clip, indigo denim jacket over grey tee, black jeans, white trainers and thin black cord necklace. No Vera-like fringe, wool coat, cream knit or umbrella. One dark-brown structured leather handbag, rounded short handles and long brown strap from right shoulder to left hip; match s1/05-phone-off.jpg and the later evidence in s7/65-the-evidence-bag.jpg. Phone call reads VERA; phone is switched off and put away in shot 5. Strap intact through 16, tears at the same barber pole in 17; purse drops and is NOT carried into the bar. Old man master s1/07-old-man.jpg: slight elderly Japanese man, grey-white hair, cheap translucent beige-clear raincoat with hood down over cream shirt/brown cardigan, dark trousers and black shoes. Same wardrobe when stopped, fallen, and searched. Sedan/men master s1/08-sedan-arrives.jpg: ONE ordinary black four-door 1990s sedan with rectangular lights, EXACTLY TWO men in black jackets/trousers/gloves/shoes, dark knit caps and black nose-and-mouth masks. No new car model, white masks or visible full faces. The old man falls just outside the doorway; violence remains distant/non-graphic, no muzzle flash or blood spray. Follow established wet surfaces, faces and eyelines. Scene 2 INSIDE the bar follows the night panels of sheets/kanda-bar.jpg (not the hotel lounge): shelves and counter left, street window right, variety-show CRT ON above the rear doorway; no cleanup mat yet. Upcoming shots must keep Mara’s coin-locker key; the screenplay reveals 114 on its worn tag in scene 25 (the older s1/16-the-key.jpg shows a waived 87-tag art discrepancy), the same red-bird clip and soaked outfit into the bar, and the handbag left outside. No added captions, subtitles or watermarks. Alley layout (canonical, 29 September 2026): the lane is too narrow for cars. The sedan stops across the alley mouth at the car end with its high beams straight down the lane, and the men walk in and out on foot. Barbershop doorway and vending machine halfway along, the small lit bar sign at the far end; the old man falls just outside the barbershop doorway; Mara runs away from the car, toward the bar. Reference sheet sheets/kanda-alley-layout.jpg.








FRAMING — Insert, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "The note in her hands. Her handwriting, in biro: 1.00 Sakai."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound design tricks, no score, no reaction cut; the killing is two flat sounds in rain and the scene leaves the street the way the car does.

---

### Shot 329 — The lane the watch

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/329-the-lane-the-watch.jpg` — write it exactly here, 329-the-lane-the-watch.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-329`; displayed board number 329. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Wide, 35mm, Static, Eye level. Lighting: Practical night. Working duration 7s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`, `public/images/neonoire/s1/01-backstreet.jpg`, `public/images/neonoire/s1/03-mara-walks.jpg`, `public/images/neonoire/s1/07-old-man.jpg`, `public/images/neonoire/s1/08-sedan-arrives.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She looks down the lane. At the far end, the bar sign. She checks her watch (12.45). Early. Placeholder slot. Over her shoulder or from the side: the length of the wet lane to the amber bar sign at the far end, her wrist and a cheap watch showing 12:45. Same street masters as shot 1 are not to be attached: screenplay text and character sheets only.
CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward.
CONTINUITY — Target: 16:9 full-bleed (1920×1080), no letterbox. Street master s1/01-backstreet.jpg: LEFT foreground closed brown wooden barbershop door in dark brick recess, faded navy awning, grey shutter to its left, ONE unlit red-white-blue barber pole immediately RIGHT of recess; ONE battered off-white vending machine opposite on RIGHT, three cold-white drink rows/red payment panel. Fixed narrow wet road, distant amber lamp/T-junction, faint green spill down right, overhead wires and steady ordinary rain, restrained desaturated 35mm grain/halation, never glossy cyberpunk. Mara matches sheets/mara.jpg and s1/03-mara-walks.jpg: American, 24, pale blue eyes, long ash-blonde hair soaked flat, small red enamel bird clip, indigo denim jacket over grey tee, black jeans, white trainers and thin black cord necklace. No Vera-like fringe, wool coat, cream knit or umbrella. One dark-brown structured leather handbag, rounded short handles and long brown strap from right shoulder to left hip; match s1/05-phone-off.jpg and the later evidence in s7/65-the-evidence-bag.jpg. Phone call reads VERA; phone is switched off and put away in shot 5. Strap intact through 16, tears at the same barber pole in 17; purse drops and is NOT carried into the bar. Old man master s1/07-old-man.jpg: slight elderly Japanese man, grey-white hair, cheap translucent beige-clear raincoat with hood down over cream shirt/brown cardigan, dark trousers and black shoes. Same wardrobe when stopped, fallen, and searched. Sedan/men master s1/08-sedan-arrives.jpg: ONE ordinary black four-door 1990s sedan with rectangular lights, EXACTLY TWO men in black jackets/trousers/gloves/shoes, dark knit caps and black nose-and-mouth masks. No new car model, white masks or visible full faces. The old man falls just outside the doorway; violence remains distant/non-graphic, no muzzle flash or blood spray. Follow established wet surfaces, faces and eyelines. Scene 2 INSIDE the bar follows the night panels of sheets/kanda-bar.jpg (not the hotel lounge): shelves and counter left, street window right, variety-show CRT ON above the rear doorway; no cleanup mat yet. Upcoming shots must keep Mara’s coin-locker key; the screenplay reveals 114 on its worn tag in scene 25 (the older s1/16-the-key.jpg shows a waived 87-tag art discrepancy), the same red-bird clip and soaked outfit into the bar, and the handbag left outside. No added captions, subtitles or watermarks. Alley layout (canonical, 29 September 2026): the lane is too narrow for cars. The sedan stops across the alley mouth at the car end with its high beams straight down the lane, and the men walk in and out on foot. Barbershop doorway and vending machine halfway along, the small lit bar sign at the far end; the old man falls just outside the barbershop doorway; Mara runs away from the car, toward the bar. Reference sheet sheets/kanda-alley-layout.jpg.








FRAMING — Wide, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "She looks down the lane. At the far end, the bar sign. She checks her watch (12.45). Early."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound design tricks, no score, no reaction cut; the killing is two flat sounds in rain and the scene leaves the street the way the car does.

---

### Shot 330 — The red clip

**Scene 1 · EXT. BACKSTREET, KANDA — NIGHT**

- **File**: `public/images/neonoire/s1/330-the-red-clip.jpg` — write it exactly here, 330-the-red-clip.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-330`; displayed board number 330. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 50mm, Static, Eye level. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/01-the-doorway.jpg`, `public/images/neonoire/keys/07-the-rain-scene.jpg`, `public/images/neonoire/keys/08-ozu-cutaway.jpg`, `public/images/neonoire/s1/01-backstreet.jpg`, `public/images/neonoire/s1/03-mara-walks.jpg`, `public/images/neonoire/s1/07-old-man.jpg`, `public/images/neonoire/s1/08-sedan-arrives.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She leans out of the shadow. The red bird clip catches the street light. Placeholder slot. Half her face leaving the recess's shadow, the small red enamel bird clip above her right temple lit by the street light — the single warm point in the frame.
CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward.
CONTINUITY — Target: 16:9 full-bleed (1920×1080), no letterbox. Street master s1/01-backstreet.jpg: LEFT foreground closed brown wooden barbershop door in dark brick recess, faded navy awning, grey shutter to its left, ONE unlit red-white-blue barber pole immediately RIGHT of recess; ONE battered off-white vending machine opposite on RIGHT, three cold-white drink rows/red payment panel. Fixed narrow wet road, distant amber lamp/T-junction, faint green spill down right, overhead wires and steady ordinary rain, restrained desaturated 35mm grain/halation, never glossy cyberpunk. Mara matches sheets/mara.jpg and s1/03-mara-walks.jpg: American, 24, pale blue eyes, long ash-blonde hair soaked flat, small red enamel bird clip, indigo denim jacket over grey tee, black jeans, white trainers and thin black cord necklace. No Vera-like fringe, wool coat, cream knit or umbrella. One dark-brown structured leather handbag, rounded short handles and long brown strap from right shoulder to left hip; match s1/05-phone-off.jpg and the later evidence in s7/65-the-evidence-bag.jpg. Phone call reads VERA; phone is switched off and put away in shot 5. Strap intact through 16, tears at the same barber pole in 17; purse drops and is NOT carried into the bar. Old man master s1/07-old-man.jpg: slight elderly Japanese man, grey-white hair, cheap translucent beige-clear raincoat with hood down over cream shirt/brown cardigan, dark trousers and black shoes. Same wardrobe when stopped, fallen, and searched. Sedan/men master s1/08-sedan-arrives.jpg: ONE ordinary black four-door 1990s sedan with rectangular lights, EXACTLY TWO men in black jackets/trousers/gloves/shoes, dark knit caps and black nose-and-mouth masks. No new car model, white masks or visible full faces. The old man falls just outside the doorway; violence remains distant/non-graphic, no muzzle flash or blood spray. Follow established wet surfaces, faces and eyelines. Scene 2 INSIDE the bar follows the night panels of sheets/kanda-bar.jpg (not the hotel lounge): shelves and counter left, street window right, variety-show CRT ON above the rear doorway; no cleanup mat yet. Upcoming shots must keep Mara’s coin-locker key; the screenplay reveals 114 on its worn tag in scene 25 (the older s1/16-the-key.jpg shows a waived 87-tag art discrepancy), the same red-bird clip and soaked outfit into the bar, and the handbag left outside. No added captions, subtitles or watermarks. Alley layout (canonical, 29 September 2026): the lane is too narrow for cars. The sedan stops across the alley mouth at the car end with its high beams straight down the lane, and the men walk in and out on foot. Barbershop doorway and vending machine halfway along, the small lit bar sign at the far end; the old man falls just outside the barbershop doorway; Mara runs away from the car, toward the bar. Reference sheet sheets/kanda-alley-layout.jpg.








FRAMING — Medium, 50mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "She leans out of the shadow. The red bird clip catches the street light."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Wide and patient, sodium orange against sick fluorescent green, cold steady rain and blacks slightly crushed. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound design tricks, no score, no reaction cut; the killing is two flat sounds in rain and the scene leaves the street the way the car does.

---

### Shot 321 — The form

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/321-the-form.jpg` — write it exactly here, 321-the-form.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-321`; displayed board number 321. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 35mm, Static, Eye level. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He slides a form across the table, and a pen. MISSING PERSON, in Japanese, with an English line beneath. Vera looks at it; she has already decided to fill it in. Placeholder slot for the 2 October 2026 rewrite. One cream-white paper cup only, intact; the form is a plain printed sheet, Japanese heading with an English line beneath, a cheap ballpoint beside it. Table and window follow the room master (51) and the interview lock; nothing on the table that the scene has not introduced.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Medium, 35mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "He slides a form across the table, and a pen. MISSING PERSON, in Japanese, with an English line beneath."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 322 — Her handwriting

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/322-her-handwriting.jpg` — write it exactly here, 322-her-handwriting.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-322`; displayed board number 322. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 12s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — She fills it in. Her handwriting is fast and square. Ishida reads it upside down as she writes, without seeming to. Placeholder slot. Her hand and the pen on the form, square capitals; at the top of the frame Ishida's eyes, level on the page, upside down to him and perfectly legible. He never looks at her face while she writes. This shot carries the questions about where she grew up and her father.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "She fills it in. Her handwriting is fast and square. Ishida reads it upside down as she writes, without seeming to."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 323 — The pen stops

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/323-the-pen-stops.jpg` — write it exactly here, 323-the-pen-stops.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-323`; displayed board number 323. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The pen stops. "She was four. She doesn't remember him." It is not quite an answer. Ishida lets it be one. Placeholder slot. Vera only: the pen has stopped a hair above the paper, her eyes still down. No face-to-camera; she answers the form, not him.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Medium close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "The pen stops."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 324 — The passport photo

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/324-the-passport-photo.jpg` — write it exactly here, 324-the-passport-photo.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-324`; displayed board number 324. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Vera Voss — public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Vera takes her wallet from her bag. From behind her card, a small square passport photo: Mara, unsmiling for once, a strand of hair across her eyes. "She gave me two when she renewed. In case." — "In case." Placeholder slot. The photograph must read as Mara (ash-blonde, pale blue eyes, the red bird clip NOT in frame: a passport photo does not allow it), plain background, a strand of hair across her eyes, unsmiling. Vera's wallet and the brown bag only as far as the hand needs.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "From behind her card, a small square passport photo: MARA, unsmiling for once, a strand of hair across her eyes."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 325 — Squared to the corner

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/325-squared-to-the-corner.jpg` — write it exactly here, 325-squared-to-the-corner.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-325`; displayed board number 325. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — He takes it by the edges. Looks at it a moment. Sets it on the form, squares it to the corner. Placeholder slot. Only his hands and the photograph on the form, set exactly to its corner; this is the corner the tea will later reach (60), so keep it clear of the cup.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "He takes it by the edges. Looks at it a moment. Sets it on the form, squares it to the corner."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 326 — No trace

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/326-no-trace.jpg` — write it exactly here, 326-no-trace.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-326`; displayed board number 326. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Close-up, 85mm, Static, High angle. Lighting: Practical night. Working duration 8s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Ishida sits alone a moment. He wipes the spilled tea from the table with the tissue, slowly, carefully, until there is no trace of it. Placeholder slot. Alone in the frame now: the crushed paper cup, the tissue, the table going dry under his hand. The form and photograph stay out of this shot so that 327 can reveal what he leaves.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Close-up, 85mm, Static, High angle, lit by practical night.
DRAFT — the draft's own words for this shot: "He wipes the spilled tea from the table with the tissue, slowly, carefully, until there is no trace of it."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---

### Shot 327 — The inside pocket

**Scene 6 · INT. POLICE STATION, INTERVIEW ROOM — MOMENTS LATER**

- **File**: `public/images/neonoire/s6/327-the-inside-pocket.jpg` — write it exactly here, 327-the-inside-pocket.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-327`; displayed board number 327. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 10s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/05-the-police-station.jpg`, `public/images/neonoire/s6/51-the-interview-room.jpg`, `public/images/neonoire/s6/56-three-days-ago.jpg`
- Detective Ishida — public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — Then he picks up the passport photo, dry at the edges, looks at Mara's face, and slides it into his inside pocket. The form he leaves where it is. Placeholder slot. The photograph is dry at its edges and stained only where the tea reached the form; his charcoal jacket, no tie. The form stays on the table, the last thing in the room.






CONTINUITY — 16:9 full-bleed (1920×1080), no letterbox. Same institution as the revised front counter, with the room fixed to s6/51-the-interview-room.jpg and blocking to s6/56-three-days-ago.jpg: small worn grey-green room, one centred aluminium-framed frosted rainy window, grey laminate table, two beige vinyl chairs, grey linoleum, one steady green-white fluorescent ceiling fixture. No flicker, mirror, camera, paper pendant, monitor or new furniture. Tan tissue box stays on the window sill; Ishida reaches back for one tissue after the spill. Vera sits LEFT and Ishida RIGHT in the master two-shot. Vera matches sheets/vera.jpg and scene 5: dry ash-blonde shoulder-length hair and soft fringe, pale blue eyes, charcoal wool coat over cream high-neck knit, navy trousers, brown boots, black watch on LEFT wrist, gold ring on RIGHT hand. One closed pale-blue umbrella with one curved brown wooden handle leans outside the left of Vera's chair, wet tip on linoleum. Ishida matches sheets/ishida.jpg: Japanese, fifties, short salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE or police uniform. Exactly ONE plain cream-white PAPER cup, no glass, handle, saucer, lid or logo. Ishida brings it in shot 52; it is then on Vera's side of the table. The cup is intact and the table dry through shot 59. Shot 60: Vera's RIGHT hand crushes the cup and amber tea spills. Shots 61–62 MUST retain the crushed cup and wet table, with ONE offered white tissue beside her hand. Shot 62 adds one business card sliding from Ishida toward Vera; no invented readable phone number. In shot 62 the spill is ONE small pool confined around the crushed cup at Vera's side and the card travels on the DRY laminate — it never lies in, floats on or soaks up liquid: the wet table is a sheen on the laminate, not a puddle the card is dropped into, and the card stays crisp, flat and dry-edged under his fingers. Maintain the same faces, eyelines, room, wardrobe, prop states and restrained fluorescent 35mm grade. No embedded subtitles, captions or watermarks.



FRAMING — Close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "Then he picks up the passport photo, dry at the edges, looks at Mara's face, and slides it into his inside pocket. The form he leaves where it is."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: One table, two chairs, a box of tissues nobody has touched in years, rain on a frosted window. A two-hander watched from a third chair. Ishida's English is excellent and Vera refuses it, answering in Japanese with the subtitles carrying the scene. Nobody is violent; a man is deciding how much to say.

---
