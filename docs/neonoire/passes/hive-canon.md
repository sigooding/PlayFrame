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
