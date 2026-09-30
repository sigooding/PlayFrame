# NEONOIRE — keyframe pass 31

7 shots still to generate: shots 308–307, from scene 2 (INT. SMALL BAR, KANDA) and scene 96 (INT. POLICE STATION, DETECTIVES' ROOM) and scene 20 (INT. THE HIVE, NOODLE SHOP STOREROOM) and scene 51 (INT. CHAIRMAN'S OFFICE, KUROSE DEVELOPMENT) and scene 82 (INT. TOTO SHIMBUN NEWSROOM, CORRIDOR) and scene 99 (EXT. THE PLAZA, WHERE THE HIVE WAS).

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

### Shot 308 — Clip under the shelf

**Scene 2 · INT. SMALL BAR, KANDA — CONTINUOUS**

- **File**: `public/images/neonoire/s2/308-clip-under-the-shelf.jpg` — write it exactly here, 308-clip-under-the-shelf.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-308`; displayed board number 308. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Insert, 85mm, Static, Low angle. Lighting: Practical night. Working duration 5s (not a locked time).
- **Continuity references to attach**: `public/images/neonoire/keys/03-the-bar.jpg`, `public/images/neonoire/sheets/kanda-bar.jpg`, `public/images/neonoire/s1/01-backstreet.jpg`, `public/images/neonoire/s1/03-mara-walks.jpg`, `public/images/neonoire/s1/07-old-man.jpg`, `public/images/neonoire/s1/08-sedan-arrives.jpg`
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — A hair clip slides out of her wet hair and skitters under the shelf; the dark gap between crates and ice bin swallows it. Behind it, her hand stays pressed flat to the bottles to stop them clinking. THE FIRST OF THE SEVEN NAMED CLOSE-UPS of the 30 September 2026 revision — the list is fixed on the page: 2, 20, 63, 71, 77, 79, 89, and no others. The red enamel bird clip as pinned in scene 1; `sheets/mara-face.jpg` for the wet look. Placeholder slot — to be generated under the cold-open fresh pass's rules: screenplay text and character sheets only.
CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward.
CONTINUITY — Target: 16:9 full-bleed (1920×1080), no letterbox. Street master s1/01-backstreet.jpg: LEFT foreground closed brown wooden barbershop door in dark brick recess, faded navy awning, grey shutter to its left, ONE unlit red-white-blue barber pole immediately RIGHT of recess; ONE battered off-white vending machine opposite on RIGHT, three cold-white drink rows/red payment panel. Fixed narrow wet road, distant amber lamp/T-junction, faint green spill down right, overhead wires and steady ordinary rain, restrained desaturated 35mm grain/halation, never glossy cyberpunk. Mara matches sheets/mara.jpg and s1/03-mara-walks.jpg: American, 24, pale blue eyes, long ash-blonde hair soaked flat, small red enamel bird clip, indigo denim jacket over grey tee, black jeans, white trainers and thin black cord necklace. No Vera-like fringe, wool coat, cream knit or umbrella. One dark-brown structured leather handbag, rounded short handles and long brown strap from right shoulder to left hip; match s1/05-phone-off.jpg and the later evidence in s7/65-the-evidence-bag.jpg. Phone call reads VERA; phone is switched off and put away in shot 5. Strap intact through 16, tears at the same barber pole in 17; purse drops and is NOT carried into the bar. Old man master s1/07-old-man.jpg: slight elderly Japanese man, grey-white hair, cheap translucent beige-clear raincoat with hood down over cream shirt/brown cardigan, dark trousers and black shoes. Same wardrobe when stopped, fallen, and searched. Sedan/men master s1/08-sedan-arrives.jpg: ONE ordinary black four-door 1990s sedan with rectangular lights, EXACTLY TWO men in black jackets/trousers/gloves/shoes, dark knit caps and black nose-and-mouth masks. No new car model, white masks or visible full faces. The old man falls just outside the doorway; violence remains distant/non-graphic, no muzzle flash or blood spray. Follow established wet surfaces, faces and eyelines. Scene 2 INSIDE the bar follows the night panels of sheets/kanda-bar.jpg (not the hotel lounge): shelves and counter left, street window right, variety-show CRT ON above the rear doorway; no cleanup mat yet. Upcoming shots must keep Mara’s coin-locker key; the screenplay reveals 114 on its worn tag in scene 25 (the older s1/16-the-key.jpg shows a waived 87-tag art discrepancy), the same red-bird clip and soaked outfit into the bar, and the handbag left outside. No added captions, subtitles or watermarks. Alley layout (canonical, 29 September 2026): the lane is too narrow for cars. The sedan stops across the alley mouth at the car end with its high beams straight down the lane, and the men walk in and out on foot. Barbershop doorway and vending machine halfway along, the small lit bar sign at the far end; the old man falls just outside the barbershop doorway; Mara runs away from the car, toward the bar. Reference sheet sheets/kanda-alley-layout.jpg.
LOCATION — OKADA'S SMALL KANDA BAR — location style sheet sheets/kanda-bar.jpg (four panels from the boarded masters, NOT the hotel lounge). Same narrow room in every visit: from the customer aisle, dark worn counter and amber bottle shelves with handwritten menu strips on the LEFT, six red-brown round stools along it, rain-streaked street window and door on the RIGHT, small CRT high above the rear doorway, crates at the far end and the tight hiding space behind the counter. Low, static, level camera; do not mirror the layout, widen the room or replace the wood with a modern cocktail bar. NIGHT (scene 2): only shelf amber, door light and blue CRT variety show; stools down, wet floor. After the journalist is killed one stool tips; no glamorised violence. DAY (scenes 8, 27A, 81): flat grey window daylight, shelf practicals still amber, stools up, CRT switched OFF (not static), chairs up by the window, a new black rubber mat where the journalist fell. Scene 64 NIGHT is later, after the cleanup: keep the mat, CRT OFF and cash drawer beneath the same counter, not the scene 2 variety show. Okada follows sheets/okada.jpg, white rolled sleeves and navy apron. Preserve the shot-specific screenplay actions and props; use the sheet for architecture and lighting, not as a new shot to substitute for a boarded frame. AI-generated draft studies, not approved coverage.







FRAMING — Insert, 85mm, Static, Low angle, lit by practical night.
DRAFT — the draft's own words for this shot: "A hair clip slides out of her wet hair and skitters under the shelf. She doesn't breathe."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: The room lights itself: amber bottles, the blue flicker of a CRT on a high shelf, one door light behind the counter. The camera never moves and stays where a customer would stand. The film's law for the scene is the floor: shoes, ankles, and what the counter hides. The variety show's laugh track is the only score.

---

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

### Shot 309 — The voicemail

**Scene 20 · INT. THE HIVE, NOODLE SHOP STOREROOM — CONTINUOUS**

- **File**: `public/images/neonoire/s20/309-the-voicemail.jpg` — write it exactly here, 309-the-voicemail.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-309`; displayed board number 309. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Extreme close-up, 85mm, Static, Eye level. Lighting: Practical night. Working duration 6s (not a locked time).
- **Continuity references to attach**: 
- Mara Voss — public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — The phone in Mara's hand, her face lit small by its screen in the dark of the storeroom; the message ends, and her thumb presses replay. SECOND OF THE SEVEN NAMED CLOSE-UPS (2, 20, 63, 71, 77, 79, 89 — fixed on the page, and no others). Carries the two recorded lines lifted from the cut scene 13: the manifest's voicemail now plays over this frame. `sheets/mara-face.jpg`, no clip — by the end of the scene the clip is on the sketchbook. Placeholder slot.
CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward.









FRAMING — Extreme close-up, 85mm, Static, Eye level, lit by practical night.
DRAFT — the draft's own words for this shot: "The message ends. She plays it again."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: 35mm for the storeroom and the doorway; 85mm on the replayed voicemail and on the clip resting on the sketchbook. Nothing longer, and no knife.

---

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

### Shot 306 — The hoarding

**Scene 99 · EXT. THE PLAZA, WHERE THE HIVE WAS — DAY**

- **File**: `public/images/neonoire/s99a/306-the-hoarding.jpg` — write it exactly here, 306-the-hoarding.jpg, JPEG, 16:9 full-bleed (1920×1080), no embedded text or watermark.
- **Stable frame ID**: `neonoire-shot-306`; displayed board number 306. Asset prefixes predate the added scene 72; do not derive the board order from filenames.
- **Framing**: Medium, 35mm, Static, Eye level. Lighting: Natural daylight. Working duration 8s (not a locked time).
- **Continuity references to attach**:  — none, the city carries the shot

**Prompt**

```
cinematic film still, 16:9 full-bleed widescreen (1920×1080), shot on 35mm Kodak Vision3 500T, visible fine grain, soft halation around every light source, slightly crushed blacks, muted desaturated palette, romantic melancholy in a Tokyo that feels remembered rather than documented, a dark dangerous place made warm by human tenderness, longing, regret, and the ache of something beautiful already slipping into the past. The city belongs to no single year: Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, payphones and older televisions beside smartphones, never explained, never a period piece, never sci-fi. Cold steady rain, wet black asphalt with long mirror reflections, practical light only — cold vending-machine white, sodium orange, sick fluorescent green, one warm window, a distant train full of strangers. Wide, patient, observational compositions with figures small and separated by the city, quiet as the default; sudden flat unglamorous violence is rare and punctures the stillness rather than becoming action spectacle. Crowded streets and rooms full of lives the characters cannot quite reach, foreigners half-belonging, romance and missed chances carried by ordinary objects, no moonlight, no theatrical emotion, no explanatory imagery, a world that exists only in memory.

SUBJECT — At the plaza's edge, the construction hoarding stands over empty pale paving: KUROSE DEVELOPMENT. TOMORROW'S TOKYO. The fountain runs out of focus behind it. The glass towers reflect each other and nobody. RETAKE PENDING (30 September 2026 revision) — the hoarding is out of the film: the banner that read KUROSE DEVELOPMENT. TOMORROW'S TOKYO. retires with the cut scene 97, and "real people cross it now, exactly like the painted ones" is the frame's whole content. The company name on the finished plaza had been the film's only comment on what happened to Kurose; the revision withholds even that. Regenerate from the re-pinned text alone. Placeholder study — the keyframe is still to generate.










FRAMING — Medium, 35mm, Static, Eye level, lit by natural daylight.
DRAFT — the draft's own words for this shot: "Real people cross it now, exactly like the painted ones. A strip of new grass. A bench nobody sits on."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Months later. Winter light, thin and clear; no rain. The model built and the patch erased: pale paving, a strip of new grass, a bench nobody sits on, glass towers on three sides, and real people crossing exactly like the painted ones. No fountain, no hoarding, no gardener, no train — the last sequence is stripped back to the revision's one sentence: nothing marks where anything was.

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

SUBJECT — A gardener in a company jacket crosses to one of the little white trees and straightens it with the tip of his finger. It didn't need it. Overhead, the rails begin to sing and a commuter train passes along the viaduct; below, nothing trembles. RETAKE PENDING (30 September 2026 revision) — the film's last grace note is the absence itself: the train passes and nothing answers — no gardener, no straightened tree (that was 272's beat, retired with scene 51's rewrite). The train overhead rhymes with every train that shook the Hive (the bulb swinging in 84, the fire ladder under one train in 91); here the same train passes and nothing below it moves. Generated against 305 as the plaza's second view; regenerate to the re-pinned text. STORY PASS 2, 29 September 2026; re-pinned 30 September 2026.










FRAMING — Medium, 50mm, Static, Low, level, lit by natural daylight.
DRAFT — the draft's own words for this shot: "Nothing marks where anything was."

AVOID — lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait, fashion pose, smiling, anime style
```

Scene grammar: Months later. Winter light, thin and clear; no rain. The model built and the patch erased: pale paving, a strip of new grass, a bench nobody sits on, glass towers on three sides, and real people crossing exactly like the painted ones. No fountain, no hoarding, no gardener, no train — the last sequence is stripped back to the revision's one sentence: nothing marks where anything was.

---
