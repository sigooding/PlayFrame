# NEONOIRE — the Hive night look: the surface and the light (28 September 2026)

**Scope:** eleven generation calls, four sheets installed — three for the night look and, on the director's note, a **daylight counterpart** of the exterior master. The Hive's GEOMETRY — locked earlier the same day in [`hive-canon.md`](hive-canon.md) — is untouched: the eleven-storey front tower on the street, the four-storey rear wing backing onto the elevated viaduct, the roof level with the tracks, the noodle counter and storeroom at ground level under the viaduct, the back door onto the service road, six stools, the 金子 sign on the wall above the counter, the green corrugated back wall, one fluorescent tube plus one bare bulb, the roller shutter, the indigo noren, the plywood storeroom with flour sacks right and futon left, shoulder-wide passages, and the roof with its tanks, aerials, laundry, pigeon cages and one-metre gap. So are the two glass office towers and the KUROSE DEVELOPMENT hoarding.

What changed is the **surface and the light**, in [`scripts/neonoire/hive-canon-look.mjs`](../../../scripts/neonoire/hive-canon-look.mjs):

> The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. At night it glows from within: hundreds of small windows in warm tungsten, and clusters of old handmade neon signs in vertical Japanese kanji (red, magenta, cyan, green) belonging to tiny businesses — a noodle counter, a dentist, a radio repair shop, a karaoke bar — some tubes flickering or half dead. Steam vents from pipes and kitchens into the rain; haze hangs in every passage; light cuts through it in visible shafts. Rain runs down everything.

And the line every NIGHT Hive shot carries, interior and exterior:

> Atmospheric haze in every space, practical lights only, strong backlight through steam, visible light shafts, coloured neon spill (magenta and cyan) mixed with warm tungsten bulbs, deep shadows, wet reflective surfaces, 35mm anamorphic film look, fine grain.

The Hive negative prompt gained: `holograms, flying cars, video billboards, LED screens, futuristic technology, robots, glossy chrome, sci-fi skyline, cyberpunk clothing, advertising, brand logos`.

Review sheet: [hive-night-look.jpg](../../../public/images/neonoire/reviews/hive-night-look.jpg) — the three new sheets across the top, the three they replace underneath.

## The six standing rules, as exported from the look file

| | Rule | Export |
| --- | --- | --- |
| 1 | Every light is small, handmade and belongs to someone who lives or works there. No advertising, no brand names, no screens bigger than an old CRT, nothing futuristic. | `hiveLightRule` |
| 2 | Kaneko's counter and the storeroom stay **mostly warm tungsten** — they are home. Only faint neon spill at the edges, coming in from the passage. | `hiveWarmRoomsLook` |
| 3 | DAY (scene 97, and every daylight Hive scene — 15–17, 55–59): the same building with the neon switched off — dead tubes, bare wiring, grey rain light, no haze glow. | `hiveDayLook` |
| 4 | DEMOLITION (scene 99): dead neon signs still hang from the exposed, cut-open floors. | `hiveDemolitionLook` |
| 5 | Entrances are a threshold: grey street light, then one step into haze and colour; leaving, the colour drains behind the characters. | `hiveThresholdLook` |
| 6 | No prompt anywhere names another film. Ingredients only. | asserted in `verify-neonoire.mjs` |

`hiveShotLight(scene)` returns the right one per scene, so a retake prompt cannot pick up the night line by accident in scene 97 or the day line in scene 88.

## The five sheets: three regenerated, two held

| Sheet | This pass | Why |
| --- | --- | --- |
| `sheets/hive-exterior.jpg` | **Regenerated** | It shows the facade at night — the surface and the light are the change. Four panels: night three-quarter between the glass towers, the same elevation by grey daylight with every tube dead, the side elevation stepping down to the rear wing with the viaduct at its roofline, and the service road at night. |
| `sheets/hive-section.jpg` | **Regenerated** | The geometry master shows the exterior face, so it had to carry the retrofit and the night light; kept on pale paper in the 1990s illustrated-book style, with the building's interior burning warm. |
| `sheets/hive-passages-roof.jpg` | **Regenerated** | The passages at night are where the haze, the shafts and the neon spill live. |
| `sheets/hive-counter.jpg` | **Held** | Already reads warm tungsten. |
| `sheets/hive-storeroom.jpg` | **Held** | Already reads warm tungsten. |
| `sheets/hive-exterior-day.jpg` | **New** | The same building by grey rainy daylight — every tube dead, bare wiring, no glow. Generated *from* the night master, so it is one building seen twice. It is the master for the day scenes (15–17, 55–59, 97, 99) and the legibility check on the night sheet: the retrofit, the window pattern and the eleven storeys read far more clearly without the neon. |

Measured: the daylight sheet is **0% amber, 66% cool, saturation 0.08 and chroma 0.05** — the flattest, greyest sheet in the bible, which is exactly what rule 3 asks for. The night exterior beside it is 12% amber, 46% cool, saturation 0.15. Same building, two temperatures, one stop apart (mean brightness 0.34 against 0.29).

**Why the two were held, measured rather than guessed.** Each sheet was downsampled and every pixel counted: a pixel is *lit* above 18% brightness, *warm* when R−B > 12, *cool* when B−R > 12.

| Sheet | Lit pixels | Warm / cool among them | Mean saturation | Result |
| --- | --- | --- | --- | --- |
| counter | 51% | 3137 / 135 — **95% warm** | 0.253 | held |
| storeroom | 81% | 16648 / 0 — **100% warm** | 0.459 | held |
| exterior (old) | 53% | 1720 / 4169 — 29% warm | 0.186 | regenerated |
| passages (old) | 50% | 5970 / 466 — 92% warm | 0.244 | regenerated (warm, but no neon, no haze, no shafts) |

The installed sheets now measure: exterior — night three-quarter 48% warm, day panel 0% (it should be grey), side elevation 82%, service road 32%; passages — passage 95%, radio shop 73%, stairwell 95%, roof 23% with the magenta and cyan city glow.

## How the eleven calls went

1. **Exterior A** — came back as one continuous photograph, not four panels. Discarded.
2. **Exterior B** — four clean panels with gutters and captions; the night panel measured 20% warm. Installed as the working master.
3. **Exterior C** — pushed the neon harder and went colder and glossier (9% warm, a cyan wash). Discarded.
4. **Cutaway A** — returned as a dark night illustration, not the pale 1990s reference-book page the house uses. Discarded.
5. **Cutaway B** — pale paper, warm interiors; installed, then superseded when the exterior was re-taken.
6. **Exterior D** — the warm windows and the neon read against a cold rainy street: night panels 48% and 82% warm, day panel still flat grey. **Installed** as the exterior master.
7. **Cutaway C** — redrawn from the installed exterior, pale paper, 94% warm, using the full width for the rear wing and the roof. **Installed.**
8. **Passages A** — good panels, but generated against an exterior that had since been discarded; superseded for the sake of the reference chain.
9. **Passages B** — clean chain, but its stairwell came back as a cyan wash (3% warm, saturation 0.417 — the glossy cyberpunk the keys warn against). Discarded.
10. **Passages C** — the stairwell warm again (95%), the roof the coldest panel with the city's magenta and cyan on the wet felt. **Installed.**
11. **Daylight exterior** — generated from the installed night master at the director's note: four panels in grey rain light, dead tubes, bare wiring. Measures 0% amber and saturation 0.08. **Installed** as `hive-exterior-day`.

Four installed sheets, seven discarded or superseded. Nothing outside the Hive was touched; `verify-neonoire.mjs` now asserts that no other look file contains the new wording and that no prompt in `scripts/neonoire/` names another film.

## Are the sheets consistent with each other?

Asked after the pass closed, and answered by measurement rather than by eye — with one honest gap at the end.

**They agree on:**

| | lit % | mean brightness | saturation | hue | amber | cool |
| --- | --- | --- | --- | --- | --- | --- |
| exterior (night) | 64 | 0.29 | 0.15 | — | 12% | 46% |
| exterior (day) | 76 | 0.34 | 0.08 | — | 0% | 66% |
| cutaway | 100 | 0.66 | 0.39 | 46° | 76% | 8% |
| passages + roof | 58 | 0.27 | 0.19 | 32° | 34% | 24% |
| counter (held) | 51 | 0.47 | 0.12 | 44° | 26% | 5% |
| storeroom (held) | 82 | 0.45 | 0.42 | 33° | 98% | 0% |

- **Exposure:** the three photographic night sheets sit at 0.27–0.31 mean brightness and 58–64% lit. One stop.
- **Interiors:** passage 80% amber at 25°, stairwell 72% at 37°, radio shop 45% at 54°, storeroom 98% at 33°, counter 26% amber plus 31% red-magenta and 22% green (the corrugated wall) at 44°. The warm rooms fall inside a 25–46° band — one tungsten temperature across the bible.
- **Day:** the day panels are colourless (0% amber, 95% cool in the exterior's panel 2; 0% amber across the daylight sheet). Rule 3 reads clean.
- **Cold exteriors:** roof panel 70% cool, service road 60%, street 42% against 22% amber.
- **Chain:** the cutaway was generated from the installed exterior, the passages from both, the daylight sheet from the night master. Every sheet is derived, none is described from memory.

**They drift on:**

1. **The night exterior's facade panels carry a green cast** — the night three-quarter measures hue 126° (16% green against 22% amber), the side elevation 78° (24% green). Nothing else in the bible is green except the counter's corrugated wall. The daylight sheet, generated from that same master, shows 13% green at chroma 0.05, i.e. grey pixels with a slight cast rather than a wash — so the green is a property of the *night* render, not of the building. **This is the one to watch, and it is on the master everything else derives from.**
2. **Saturation:** the passages sheet is richer than its master — passage panel 0.38 against the street's 0.24. The interior is more colourful than the facade it sits behind.
3. **The neon is thin.** Red/magenta is 10–12% on both night sheets, and most of the cyan is rain and sky rather than tubes. The brief asks for red, magenta, cyan and green clusters; what is on the sheets is red accents plus the unwanted green.
4. **The cutaway is another medium** — pale paper at 0.66 brightness against photographic 0.27. Deliberate (it is the house 1990s-book style), but it means the cutaway's 76% amber and the exterior's 12% amber are the same building at two temperatures and cannot be compared pixel for pixel.

**The gap:** none of this says whether the same window pattern, the same handmade signs, the same eleven storeys and the same bolted-on furniture actually repeat from sheet to sheet. That is architecture, not colour, and measuring it is beyond what a pixel count can do. The daylight sheet was made to make that check possible by eye — it is the panel to put beside the night master when the director looks.

## The retake queue, re-listed

Every existing Hive night frame predates this look, so every one of them is now out of date. They are listed in two waves, in `hiveNightRetakes` (17) and `hiveNightWarmRooms` (15).

### Wave one — the surface and the light (17 frames, retake first)

Generated against the new exterior, section and passages sheets.

| Frame | What is wrong with it now |
| --- | --- |
| `s70/237-position.jpg` | the back door onto the service road: no bolted-on pipes and tanks, no neon, no steam, no colour in the wet ground |
| `s85/119-single-file.jpg` | no haze, shafts or neon spill (also the geometry retake: shoulder-wide, single file) |
| `s85/120-the-hive-is-watching.jpg` | the closing doors and the passage read dry and bare |
| `s87/124-the-repairman.jpg` | the shop needs its own small handmade neon tube, haze at the half-open door, spill from the passage |
| `s87/125-the-main-switch.jpg` | the fuse box needs haze and the passage's neon spill behind him |
| `s88/126-dark.jpg` | **the blackout** — the beams must cut visible shafts through haze, with neon only from the street outside; no bulb, no lit window |
| `s88/127-faces-vanish.jpg` | the beam on the hung laundry needs haze to catch it |
| `s89/128-by-touch.jpg` | the dark stair needs haze in the beam and one faint coloured rim from the street |
| `s89/129-she-lets-him.jpg` | same: haze and a rim, nothing lit |
| `s90/130-the-roof.jpg` | the roof is green city glow only: needs steam from below, haze, and the tower's own windows and neon behind the tanks |
| `s90/131-she-jumps.jpg` | the jump across the gap needs haze, steam and the neon-lit face behind |
| `s90/132-the-gap.jpg` | needs steam and haze between roof and walkway, colour on the wet felt |
| `s91/132-the-rails-sing.jpg` | the headlight needs a shaft through steam, the Hive's neon behind the beams |
| `s91/133-inches-apart.jpg` | the strobing train windows need haze to catch them |
| `s91/134-the-walkway-is-empty.jpg` | the empty walkway needs shafts through haze, neon on the wet steel |
| `s92/135-below-the-viaduct.jpg` | the Hive behind them needs the full night look — every window warm, neon clusters, steam, haze (also the geometry retake) |
| `s92/136-until-us.jpg` | the draft gives her "the building full of light"; the night look *is* that light |

### Wave two — the two warm rooms (15 frames, held)

`hiveNightWarmRooms`. Their sheets were measured, not regenerated, so the room, the counter, the six stools, the 金子 sign and the bulb are all still right. What the new canon adds to them is only atmospheric haze in the bulb light and a faint magenta/cyan rim at the curtain or the shutter gap, coming in from the passage. Retake them after wave one, or leave them: the rooms are correct, only the air in them has changed.

`s13/179-eat`, `s13/180-under-the-cover`, `s13/181-the-bulb-comes-to-rest`, `s13/247-thirty-one`, `s25/200-the-number-114`, `s25/201-the-stamp`, `s60/227-i-want-my-sister`, `s68/235-rice-balls-for-the-car`, `s84/115-the-storeroom`, `s84/116-thats-me`, `s84/117-both-wrong`, `s84/118-position`, `s86/121-the-shutter`, `s86/122-through-the-back`, `s86/123-fifty-years`.

### The geometry queue still open

`hiveCanonRetakes` (8) is unchanged and still the first call on those frames: `s15/184`, `s59/226`, `s92/135`, `s97/146`, `s99/156`, `s55/221`, `s68/235`, `s85/119`. Three of the eight are night frames and appear in the waves above — `s92/135` and `s85/119` in wave one, `s68/235` in wave two. **One retake covers both problems**; do not spend two calls on the same frame.

## Next pass plan

0. **Look at the daylight sheet beside the night master** and settle the two questions only eyes can answer: is it the same building — window pattern, signs, storey count — and is the night panels' green cast a wash to fix or legitimate spill off wet concrete. If it is a wash, re-take the exterior master (one call) and re-derive the cutaway, the passages and the daylight sheet from it before spending anything on shots.
1. **The five remaining geometry retakes** — `s15/184`, `s59/226`, `s97/146`, `s99/156`, `s55/221`. Day frames: they carry the day look (dead tubes, grey rain light), not the night one, and they now generate against `sheets/hive-exterior-day.jpg` rather than the night master.
2. **Wave one, in scene order** — s70, s85, s87, s88, s89, s90, s91, s92. Ten calls to a session; this is one and a bit sessions.
3. **Wave two** — after wave one, and only if the director wants the haze and the edge spill on screen in the storeroom and at the counter.
4. **The unboarded Hive scenes** — 67 (service road), 69 (passages) and 71 (passage) still have no frames. They are in `hiveCanonScenes` now; board them against the new sheets.

## Honest caveats carried

- **The agent that ran this pass has no eyes.** Every judgement above about what a sheet "reads" as is a pixel measurement — warm/cool counts, saturation, quadrant structure — not a look at the picture. The director should open [the review sheet](../../../public/images/neonoire/reviews/hive-night-look.jpg) before the retake pass spends a call.
- **Label legibility in the new cutaway is unverified** for the same reason. The old cutaway garbled small labels ("BALCXINIES"); the new one was prompted for thin legible English labels and was generated against a "no garbled lettering" negative, but nobody has read them at full size yet. `FLOORS 1-11`, the one-metre gap and the storeroom are the load-bearing ones.
- **The exterior's night three-quarter panel is the compromise.** Two candidates were rejected for being too cold and too cyan; the installed one measures 48% warm against a cold wet street. If the director wants the building to dominate the frame with tungsten, that is the panel to push.
- **Scene 88 and 89 are inside the blackout** — the repairman has pulled the main switch, so the night line cannot mean lit bulbs there. It is applied as: flashlight shafts in the haze, colour only from the street outside, nothing lit by the building. That reading is recorded in the queue entries and in the look file's header.
- **`s47` was removed from `hiveCanonScenes`.** It is the roadside inn's back yard, not the Hive, and it keeps the inn's look. `s14` (Mara's apartment) went with it. Both removals are asserted in verify.
