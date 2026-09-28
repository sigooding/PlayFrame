# NEONOIRE — the Hive canon: one building, one look file (28 September 2026)

**Scope:** no shots generated this pass beyond the five canon sheets; the retakes queue as the next generation pass (eight frames, one call each). The deliverable is [`scripts/neonoire/hive-canon-look.mjs`](../../../scripts/neonoire/hive-canon-look.mjs): the canonical geometry, the five sheet prompts with their reference chain, the shared negative prompt, and the retake queue.

**The problem.** The Hive was boarded across five sessions from five look files, and each described the building differently: s15/184 a squat 6–7-storey block on a plaza; s59/226 a tall narrow tower on a tight street; s92/135 a nine-storey slab by a viaduct pillar; s97 a five-storey block with the railway at height; s99/156 an ordinary apartment block. Inside, s55/221 drew the counter as a white-tiled corridor with the 金子 sign ON the counter, s68/235 gave the storeroom shelving and a teal doorway, and s85/119 drew the passage three abreast where the draft says single file. The draft itself contradicts itself: "eleven storeys", yet scene 90 jumps from the roof onto the railway walkway.

**The fix.** The Hive is **stepped**: an **eleven-storey front tower** on a wide modern street between glass office towers, and a **four-storey rear wing** backing directly onto the elevated railway viaduct, its flat roof level with the tracks. The noodle counter and storeroom sit at ground level in the rear wing, directly under the viaduct — which is why trains shake them. That keeps the tall facade (15), the trains overhead inside (13, 17), the service road (70), the roof-to-track jump (90) and the demolition cutting open the tower (99), and it resolves the draft's eleven-storeys-versus-railway contradiction: eleven storeys are the front tower only.

## The five canon sheets

Generated in this order, each finished sheet a reference for the next; installed 1920×1080 in `public/images/neonoire/sheets/`.

| Sheet | Path | Locks |
| --- | --- | --- |
| Exterior master | `sheets/hive-exterior.jpg` | Four panels: night three-quarter between glass towers with the KUROSE DEVELOPMENT hoarding; day elevation; side elevation stepping down to the rear wing with the viaduct at its roofline and a train on it; the rear service road under the viaduct. |
| Cutaway | `sheets/hive-section.jpg` | 1990s illustrated-book cutaway: both masses in section, counter with six stools and the storeroom under the viaduct, shoulder-wide passages, radio shop, dentist's curtain, main switch box, rear stair to the roof with water tanks, aerials, laundry, pigeons, the one-metre gap and low fence to the walkway. |
| Counter | `sheets/hive-counter.jpg` | Six round-topped stools, worn dark counter, stock pot, ribbed green corrugated back wall, fluorescent tube plus bare bulb, indigo noren at the right end, shutter front, yellowed menus; the 金子 board **on the wall above the counter**; floor plan numbers the stools with 3 marked; night half-shutter. |
| Storeroom | `sheets/hive-storeroom.jpg` | Plywood box 2.5 × 3 m, viaduct beam in the low ceiling, one bulb on a flex, flour sacks right, onion crate, futon left, sketches taped up, noren the only door; reverse sees through to the counter sign. No shelving, no teal doors. |
| Passages and roof | `sheets/hive-passages-roof.jpg` | Shoulder-wide passage, single file, water line, bare bulbs, pipes overhead; the repairman's doorway with a dozen radios; the dark rear stair; the rear wing roof in rain with the gap and fence onto the walkway beside the tracks. |

## Caveats

- **Cutaway:** small labels garble in places ("BALCXINIES", "SCALE: TRCK FOOK", the dentist label prints twice). It is a geometry reference that never appears on screen; the load-bearing labels (six stools, storeroom, viaduct level with rear roof, one-metre gap) read clean.
- **Counter:** the floor plan's stool numbers print 1, 2, M, 4, 6 — the marked stool reads M and 5 is missing. Panel 1 counts six stools; the mark is what matters. Footer placeholders ([Name], [Project Title]) are cosmetic.
- **Storeroom:** the floor plan's top caption line is garbled; the room labels read clean. The sacks print FLOUR / KANEKO'S 25KG, consistent with the master's FLOUR print.
- **Exterior:** the tower reads a storey tall or short between panels at this size; the count is locked by the cutaway's "FLOORS 1–11".

## The retake queue (next generation pass, one call each)

Against the sheets above, in the order the pass runs them:

| Frame | Problem |
| --- | --- |
| `s15/184-a-gap-in-someones-teeth.jpg` | squat block on a plaza; canon tower between glass towers |
| `s59/226-at-the-edge-of-a-high-place.jpg` | narrow tower on a tight street; canon street is wide and modern |
| `s92/135-below-the-viaduct.jpg` | nine-storey slab by a pillar; viaduct belongs at the rear wing's roofline |
| `s97/146-tomorrows-tokyo.jpg` | railway at height behind a five-storey block; ceremony sits before the front tower |
| `s99/156-cut-open.jpg` | an ordinary apartment block; the demolition must cut open the canon tower |
| `s55/221-they-match.jpg` | white-tiled corridor, sign on the counter; canon counter, sign on the wall |
| `s68/235-rice-balls-for-the-car.jpg` | shelving and a teal doorway; canon plywood box |
| `s85/119-single-file.jpg` | three abreast; canon is shoulder-wide, single file |

## Also in this pass

- `scripts/neonoire/hive-canon-look.mjs` exports `hiveCanon`, `hiveCanonNegative`, the ordered `hiveCanonSheets` (prompts, install paths, reference chains), `hiveCanonRetakes`, `hiveCanonScenes` and the `hiveCanonLook` note for the retake pass to embed.
- `scripts/verify-neonoire.mjs` checks the five sheets are 1920×1080 and that all eight queued frames exist.

## The NIGHT update — 28 September 2026 (added; the Hive only)

**Scope:** the Hive and nothing else. Every other location keeps its current look and its look files were not touched. **Nothing above was replaced** — the geometry, the rooms, the existing daytime description and lighting and every existing word stand exactly as written; only the three sections below were added, all inside [`scripts/neonoire/hive-canon-look.mjs`](../../../scripts/neonoire/hive-canon-look.mjs).

### 1. Physical description — appended to `hiveCanon` (applies day AND night; these are objects, not lighting)

> The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. Old handmade neon signs in vertical Japanese kanji hang all over the facade and passages, belonging to tiny businesses — a noodle counter, a dentist, a radio repair shop, a karaoke bar. Steam vents from pipes and kitchen flues.

### 2. DAYTIME — `hiveCanonDay`, for day Hive shots

The existing daytime look is unchanged (flat grey rainy daylight, exactly the day panels and cutaway the sheets already carry). To it:

> By day the neon signs are switched off: dead glass tubes and bare wiring, no glow, no haze effect.

### 3. NIGHT — `hiveCanonNight`, used ONLY for night Hive shots (interior and exterior)

> At night the Hive glows from within: hundreds of small windows in warm tungsten, and the neon signs lit in red, magenta, cyan and green, some tubes flickering or half dead. Steam drifts into the rain; haze hangs in every passage; light cuts through it in visible shafts. Practical lights only, strong backlight through steam, coloured neon spill mixed with warm tungsten bulbs, deep shadows, wet reflective surfaces, 35mm anamorphic film look, fine grain.

### The rules (carried by `hiveCanonDay`, `hiveCanonNightRules`, and this list)

1. **Kaneko's counter and the storeroom stay mostly WARM TUNGSTEN at night — they are home.** Only faint neon spill at the edges, from the passage.
2. **Scene 97 (the ceremony) and scene 99 (the demolition) are DAY:** use the existing daytime look plus the unlit signs. In scene 99 the dead signs still hang from the exposed, cut-open floors.
3. **Entering the Hive at night is a threshold:** grey street light straight into haze and colour; leaving, the colour drains behind the characters.
4. **Every light is small, handmade and belongs to someone who lives or works there.** No advertising, no brands, no screens bigger than an old CRT, nothing futuristic.
5. **Never write "Blade Runner" or any film title in a prompt.**

**Negative prompt:** `hiveCanonNegative` keeps every existing term and gains "holograms, flying cars, video billboards, LED screens, futuristic technology, robots, glossy chrome, sci-fi skyline, cyberpunk clothing, advertising, brand logos".

### Sheets regenerated for the night look

Only the sheets that show night (and the section, which must carry the retrofit) were regenerated; each was installed back at 1920×1080 with its layout, captions and geometry intact.

| Sheet | What changed |
| --- | --- |
| `sheets/hive-exterior.jpg` | Night panels (1, the three-quarter street view, and 4, the rear service road) relit per the night section: glow from within, neon in red/magenta/cyan/green, steam, haze, visible shafts. Day panels (2, 3) keep their grey rainy daylight and now carry the retrofit layers with the signs dead. |
| `sheets/hive-section.jpg` | Regenerated so the cutaway shows the retrofit — bolted-on rooms, pipes, ducts, cages, tanks over the original concrete, unlit vertical neon signs, steam vents. Rooms and geometry as canon. |
| `sheets/hive-passages-roof.jpg` | Regenerated with the night look: haze hanging in the passages with the bulb light cutting visible shafts through it, faint coloured neon spill at the passage ends, warm tungsten bulbs; the rear roof in rain as canon. |
| `sheets/hive-counter.jpg`, `sheets/hive-storeroom.jpg` | **Not regenerated.** They stay mostly warm tungsten at night — they are home (rule 1) — and still match the canon. |

The recorded sheet prompts were extended additively: the exterior prompt now carries the NIGHT section for panels 1 and 4 and the DAYTIME section for panels 2 and 3, and the passages-and-roof prompt carries the NIGHT section for all four panels. The counter and storeroom prompts were not touched.

### The night retake queue — added to the next pass (`hiveCanonNightRetakes`)

Existing Hive NIGHT shots whose frames predate the night look, queued **on top of** the eight geometry retakes above for the same next generation pass. Against the regenerated sheets, in the order the pass runs them:

| Frame | Problem |
| --- | --- |
| `s75/79-the-hive-shut.jpg` | the shut Hive at night lit only by its faint sign; the facade now glows from within through steam and haze |
| `s16/186-everybody-sees-him.jpg` | passage with clear air; the night look hangs haze in every passage and cuts the bulbs through it in visible shafts |
| `s69/236-vera-would-love-this.jpg` | passage at night without haze or the neon spill at the doorways |
| `s71/238-everyones-awake.jpg` | the waking windows read as plain lit glass; the building should glow from within through haze |
| `s85/120-the-hive-is-watching.jpg` | raid passage without the night haze and shafts |
| `s67/234-a-different-clock.jpg` | rear service road with one lamp only; the Hive's back should glow through haze onto wet ground |
| `s70/237-position.jpg` | rear service road without the threshold: grey street light at the edge, haze and colour toward the back door |
| `s90/130-the-roof.jpg` | rooftop over a dark city; haze in the air and the building's warm glow and neon spill rising from below |

- **Already queued above, regenerated with the night look as part of their retake:** `s85/119-single-file.jpg` (passages) and `s92/135-below-the-viaduct.jpg` (night street) — not repeated in the night queue.
- **Day shots are not in the night queue.** `s15/184`, `s59/226`, `s97/146` and `s99/156` keep their places in the queue above and take `hiveCanonDay` — the existing daytime look plus the unlit signs — when their retake runs; in scene 99's `s99/156` the dead signs hang from the exposed, cut-open floors.
- **Deliberately not queued:** Kaneko's counter and the storeroom (`s13`, `s17`, `s19`, `s20`, `s25`, `s57`, `s60`, `s68`, `s84`, `s86`) and the radio repair shop (`s87`) — warm tungsten practicals that still match rule 1; and scenes 88–89 (`s88/126`, `s88/127`, `s89/128`, `s89/129`) — the main switch is out and the stairwell is dark by story, so the glow must not be there.

### Also in this update

- `hiveCanonNightRetakes` (the eight night frames above) exported beside `hiveCanonRetakes`; the `hiveCanonLook` note now carries the day/night sections, the rules and both queues for the retake pass to embed.
- `scripts/verify-neonoire.mjs` checks the night text, the day line, the retrofit paragraph, the negative terms, and that all eight night-retake frames exist — on top of the existing five-sheet and eight-frame checks, which stand unchanged.
