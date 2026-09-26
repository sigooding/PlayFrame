# NEONOIRE — final coverage pass: the packed suitcase, the lie, the tiny tree, the receipts, the bow, the kiss, the wall, the umbrella, the clock at ten and her sister's smile (26 September 2026)

**Scope:** ten new shots, IDs `neonoire-shot-270` … `279`. Nothing in 1–269 is renumbered, no existing image was regenerated. Ten generations were spent, one per shot — every frame installed.

Review sheet: [coverage-270-279.jpg](../../../public/images/neonoire/reviews/coverage-270-279.jpg).

| Shot | ID | Image | Held to |
| --- | --- | --- | --- |
| 270 INSERT 50mm — packed and zipped | neonoire-shot-270 | `s14/270-packed-and-zipped.jpg` | `s14/182`, `sheets/jack.jpg` |
| 271 MEDIUM 50mm — not yet | neonoire-shot-271 | `s21/271-not-yet.jpg` | `s21/194`, `sheets/vera.jpg`, `sheets/jack.jpg` |
| 272 INSERT 85mm — one tiny white tree | neonoire-shot-272 | `s24/272-one-tiny-white-tree.jpg` | `s24/199`, `sheets/kurose.jpg` |
| 273 MEDIUM 50mm — the receipts | neonoire-shot-273 | `s29/273-the-receipts.jpg` | `s29/204`, `s34/173`, `sheets/jack.jpg` |
| 274 MEDIUM WIDE 35mm — holds the bow | neonoire-shot-274 | `s51/274-holds-the-bow.jpg` | `s51/217`, `sheets/ishida.jpg`, `sheets/kurose.jpg` |
| 275 MEDIUM CLOSE-UP 50mm — the kiss | neonoire-shot-275 | `s53/275-the-kiss.jpg` | `s53/219`, `sheets/vera-face.jpg`, `sheets/jack-face.jpg` |
| 276 MEDIUM 50mm — slides down the wall | neonoire-shot-276 | `s58/276-slides-down-the-wall.jpg` | `s57/224`, `sheets/mara-hiding.jpg` |
| 277 MEDIUM 50mm — borrowing it | neonoire-shot-277 | `s65/277-borrowing-it.jpg` | `s4/34`, `s65/232`, `sheets/vera-look-b.jpg` |
| 278 INSERT 85mm — the clock reads ten | neonoire-shot-278 | `s66/278-the-clock-reads-ten.jpg` | `s66/233` |
| 279 MEDIUM CLOSE-UP 85mm — her sister's smile | neonoire-shot-279 | `s69/279-her-sisters-smile.jpg` | `s69/236`, `sheets/mara-hiding.jpg` |

## Locks and caveats

- **270** the room follows `182`: same tatami, same low bed, same wall of pencil and watercolour sketches, same grey overcast daylight; Jack keeps his face out of frame, charcoal coat over the off-white collar. **Caveat:** the case sits on the mattress reading mid-closing with its contents visible, not zipped shut beneath a lifted futon corner — the beat to hold on set.
- **271** the office follows `194`: desk, two paper coffees, green banker's lamp unlit, rain window, the closed sketchbook under his hand; Vera's ash-blonde fringe, cream turtleneck and charcoal coat from `vera.jpg`, and she watches his face while he keeps his eyes on the book. **Caveat:** the view through the window shows lit vending machines across the street where the master reads a plain grey building.
- **272** the model, glass case and night window follow `199`: white towers, fountain plaza, the brown woven block, blossom rows; Kurose's navy cuff only, no face, no leader, one white pool of light in a blue-black room. **Caveat:** the model reads from the case's far side relative to the master (towers left rather than back); on set, shoot from the master's side of the case.
- **273** the room follows `204`: quilted kotatsu, brown teapot and two poured cups, the altar with the framed photograph, Mrs. Sakai in navy indigo; the bundle follows `s34/173` — tied, whole, nothing decipherable at full size, no text invented. **Caveat:** her eyeline rests on the bundle where the draft has her watch him read it.
- **274** the office follows `217`: model case left, brass lamp lit, rain-grey city beyond the glass; Kurose in the beautiful dark navy suit, still, tea in reach; Ishida in the wet raincoat bowing from standing, hat in both hands — the bow held a moment too long. **Caveat:** the teacup reads on a side table beside the chair where the board puts it on the chair's arm.
- **275** the bathroom follows `219`: white tile, frosted window, warm bare bulb, pink bowl and dropped washcloth; the hairline cut and the dark shoulder stain are unchanged; both faces held to `vera-face.jpg` and `jack-face.jpg`, eyes closed, unglamorous. **Caveat:** her hand rests at her knee rather than at his jaw.
- **276** the storeroom follows `224`: plywood walls, taped figure sketch, flour sacks with the same green stamp and the word FLOUR as the master, bare bulb, curtain gap; Mara in the borrowed brown cardigan over the grey tee, no clip, sliding down the wall, eyes shut. **Caveat:** her trailing hand touches the flour sacks rather than the plywood wall, and the floor reads flagstone rather than poured concrete.
- **277** the entrance follows `s4/34`: louvered cabinet, framed family photograph, lace and sheer curtains, the white cylinder stand; Look B from `vera-look-b.jpg` — wine-red silk cowl-neck, hair done up, muted rose lip; the umbrella is `s4/34`'s, furled and bone dry, curved wood handle, in her hand as she faces the door. **Caveat:** her eyeline reads into the room rather than at the door; the red court shoes fall below the frame.
- **278** **clean, crop-read at full size:** hour hand exactly on 10, minute hand exactly on 12 — 10:00, following `233`'s 9:58; numerals 1–12 in order, no date, no wording, no people; same dial family, dark vertical panelling, the lit bottle shelf's brass edge at frame right.
- **279** the corridor follows `236`: open doors, bare bulbs, the radio repairman at his bench lamp, the family room warm behind; Mara's face, hair and clothes held to `mara-hiding.jpg` — no clip, no wound, no jewellery — and the smile kept small, her sister's, not a grin. **Caveat:** her eyeline lands near the lens rather than distinctly off-frame at Vera, and an unlettered green panel glows at the corridor's end.

## Also in this pass

- `EXPECTED_SHOTS` moved 269 → 279 in `scripts/verify-neonoire.mjs`, with note-lock assertions for all ten new shots.
- The scene-group id asserts for 18–23, 29–44, 46–55 and 65–71 now filter coverage (`shotNo ≤ …`) exactly as the earlier groups already did; `hiveFirstImages` carries `s14/270-packed-and-zipped.jpg`.
- The stale `awaitingAspect` flag in `scripts/neonoire/build-project.mjs` was replaced by a dimension test that reads each JPEG's own bytes. All 269 pre-existing frames were scanned first: every one is exactly 1920×1080, so shots 29–32 flipped to Draft for a real reason, not a stale scene key. No image was touched.
