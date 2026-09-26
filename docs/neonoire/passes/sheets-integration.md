# NEONOIRE — sheets-integration pass: the cards point at the sheets (26 September 2026)

**Scope:** one generation plus the workspace integration that makes the cast-sheet pass load-bearing. No shot was regenerated; no numbering moved; the cast count stays 18.

**Merge note — a parallel pass recovered.** While this session's sandbox sat reset, a parallel session pushed **[looks, masks and paper props](looks-masks-props.md)** (`08d5c5a`): three sheets and six prop masters. This pass's recovery commit, built from the stale pre-reset tree, silently dropped them; the divergence was caught at push time and every one of their files is restored here — the six `props/` masters, `sheets/masked-man.jpg`, `sheets/vera-look-b.jpg`, their review sheet and ledger — and their board notes, handoff bullets and verify locks are merged into this tree rather than overwritten. **The hiding sheet on disk is their generation**, reviewed again here against `s13/179-eat.jpg` and `mara-face.jpg` (same face, borrowed oatmeal cardigan, no clip, scuffed sneakers) and kept per the house rule that pushed work wins; this pass's own call for the same sheet is logged below as redundant, not installed.

## What changed

- **`scripts/neonoire/plan.mjs`:** the eight recurring cast entries take their `sheet` parameter — `kaneko`, `okada`, `kurose`, `mr-noda`, `mrs-noda`, `repairman`, `harada`, `young-detective` — so their cast cards carry `/images/neonoire/sheets/<name>.jpg`. The eight `characters.find(...).image = "<scene frame>"` overrides are deleted. Daniel keeps the family photograph and Mrs. Sakai her scene-29 frame by design; the old man, the masked men and the journalist stay unnamed and imageless.
- **Descriptions** that said "No identity sheet yet: held to the scene NN master" now say "Sheeted 26 September 2026; the scene NN master still carries the room" — the division of labour is stated on the card itself: sheets carry faces and garments, masters carry rooms, light and staging.
- **The continuity board** `neonoire-look-cast` is retitled **"Continuity — the cast and their looks"** and gains ten items: Vera's Look F, Mara's hiding look, and the eight cast sheets, each captioned with its garment line and its master. The Look E caption no longer says Look F awaits a master.
- **`sheets/mara-hiding.jpg`:** Mara 24 in the hiding look of scenes 13–17 — an old oatmeal-brown cardigan that isn't hers over the grey tee, black jeans, sneakers, **no bird clip** — three views on mid-grey plus a face crop. Two sessions generated this sheet in parallel; the parallel pass's file is the one on disk (see the merge note), and this pass's generation, reviewed and passing, was not installed. Board paragraphs in n13 and n68 name the sheet; her default look remains `sheets/mara.jpg`.
- **The continuity board also carries the parallel pass's looks** — `vera-look-b.jpg` (the wine-red dress of scenes 72–79) and `masked-man.jpg` (the raid costume over `s1/12`) — so every sheet in the house now sits on the board the app shows.

## Locks

- Verify asserts, by id, that the eight cast cards' `image` equals their sheet path — a future pass that points a card back at a scene frame fails the build.
- Verify asserts the continuity board carries `vera-look-f`, `mara-hiding`, `kaneko` and `repairman`, and that all ten new sheet JPEGs are 1920×1080.
- `check:assets` picks the sheets up through the bundle's character images and board items.

## Honest caveats carried

- The masked men, the barber, the prosecutors, the family and the violin girl still have no sheets; a mask or a crowd fixes what a sheet would.
- Face crops remain leads-only (Mara, Vera, Jack); the recurring cast carry their face inset inside the sheet.
- The repairman's forehead loupe stays a bench prop of `s87/124`, not part of his sheet.
