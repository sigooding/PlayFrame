# Scenes 77–79 — the envelope and the notebook, first boarding

**25 September 2026 · recast: Jack becomes a white American · 13 generation calls across two turns, 10 assets delivered**

The user asked for the next scenes' shot images with scene and character consistency. The board
continues straight on from scene 76: **scene 77** (Jack's office), **scene 78** (Vera's corridor at
dawn) and **scene 79** (Vera's apartment, continuous). Mid-session the user changed Jack's casting:
**Jack is now a white American.** The screenplay is unchanged, byte for byte.

## Delivered — all 1920×1080 JPEG, full-bleed 16:9

| Board | ID | Scene | Image under `public/images/neonoire/` | Type / lens | Notes |
| --- | --- | --- | --- | --- | --- |
| — | — | — | `sheets/jack.jpg`, `sheets/jack-face.jpg` | sheet | **Recast** identity sheet; face is a crop of the same generation |
| 87 | `neonoire-shot-87` | 77 | `s77/85-the-desk-lamp.jpg` | Wide, 35mm | Jack's office master (first appearance on the board) |
| 88 | `neonoire-shot-88` | 77 | `s77/86-the-clean-envelope.jpg` | Insert, 50mm, high | Hands only; notebook into envelope |
| 89 | `neonoire-shot-89` | 77 | `s77/87-he-writes-nothing.jpg` | MCU, 85mm | Pen over the blank envelope |
| 90 | `neonoire-shot-90` | 78 | `s78/88-the-walkway.jpg` | Wide, 35mm | Corridor master, grey dawn |
| 91 | `neonoire-shot-91` | 78 | `s78/89-no-name.jpg` | Insert, 50mm, high | Envelope on the mat, bare feet |
| 92 | `neonoire-shot-92` | 78 | `s78/90-daniel-voss.jpg` | ECU, 85mm, high | DANIEL VOSS inside the cover |
| 93 | `neonoire-shot-93` | 79 | `s79/91-grey-light.jpg` | Wide, 35mm, low level | Scene 4 master at dawn, two empty cups |
| 94 | `neonoire-shot-94` | 79 | `s79/92-underlined-twice.jpg` | Insert, 85mm, high | Illegible handwriting, one line underlined twice |
| 95 | `neonoire-shot-95` | 79 | `s79/93-against-her-chest.jpg` | Medium, 50mm, low level | Notebook held to her chest |

Stable IDs 87–95 continue after scene 72's 85–86. Asset prefixes 85–93 are their own series, as
elsewhere; neither is a running-order counter. Review: `public/images/neonoire/reviews/scenes-77-79-pass-1.jpg`.

**Rejected, not delivered** (raw files in ignored `artifacts/s77-79/`): the first office wide,
generated with the superseded Japanese Jack before the recast (its room was kept as the layout
reference for the delivered master); and the first scene 79 wide, which put Vera sitting *on* the
table.

## Locks

- **Jack:** see [characters/jack.md](../characters/jack.md). Soaked charcoal overcoat, wet hair, hands unwashed through scene 77. Distinct from Daniel Voss in the photograph.
- **Jack's office** (`s77/85-the-desk-lamp.jpg`): frosted door lettered JACK at left, slept-on brown sofa, worn desk, green-shaded brass lamp, black rotary phone, grey filing cabinets with a small CRT at right, blinds, elevated railway. Master for scenes 10, 11, 18, 21 and every later office scene when they are boarded. The draft's katakana lettering on the door is still a prop check.
- **The notebook:** small, worn, faded dark-green cloth cover; cream pages; neat slanted blue-ink hand; DANIEL VOSS inside the cover. The envelope is plain white and carries no name.
- **Vera:** `sheets/vera.jpg` face and hair; the scene 72 wine-red dress, creased and dried stiff; hair dried tangled; faint dried mascara, no fresh tears; **barefoot** from scene 78.
- **Corridor** (`s78/88-the-walkway.jpg`): third-floor open-air walkway of scene 3's block, doors left, dripping rusted railing right, elevated line beyond.
- **Apartment:** `s4/33-the-apartment.jpg` camera and `apartment-look.mjs` props at dawn, with the lamp and CRT off, NO paper pendant, the umbrella stand **empty** and exactly two empty cups.

## Review caveats

- Board 89: the nib sits very close to the paper, so the take must keep it above the envelope. At that size the coat also reads shorter than knee length.
- Board 90: the envelope lies just past the mat in the wide; the insert puts it on the mat, as scripted.
- Board 95 is framed as a Medium, not a close-up; the second cup is just out of frame.
- Scene 76's existing images disagree with each other on the dress (sleeves and tears) and on the number of shoes. Scenes 77–79 follow the scene 72 dress, not scene 76's drift. Scene 76 should be reviewed.

## Follow-up turn — recast applied to scene 74, scene 80 boarded (10 generation calls)

- **Scene 74 recast (3 calls):** boards 75, 76 and 77 are regenerated as edits of their own keyframes with the new `sheets/jack.jpg`. Composition, street, Vera, shoes and blocking are unchanged; only Jack was replaced. They are **Draft** again, with the JACK RECAST APPLIED note. `jackRecastPending` is now empty.
- **Scene 80 — the detectives' room, day (7 calls, 6 shots, boards 96–101, IDs `neonoire-shot-96`–`101`, assets `s80/94`–`99`):**

| Board | Image | Type / lens | Notes |
| --- | --- | --- | --- |
| 96 | `s80/94-the-long-room.jpg` | Wide, 24mm | Room master: scene 7's room by day; Jack walks in and Ishida writes |
| 97 | `s80/95-ishida-doesnt-look-up.jpg` | Medium, 50mm | Two-shot at the desk |
| 98 | `s80/96-hands-close.jpg` | Insert, 85mm | Fist with dried blood in the knuckle creases (the coat reads lighter than the sheet) |
| 99 | `s80/97-where-to-find-them.jpg` | Close-up, 85mm | Ishida looks up |
| 100 | `s80/98-past-the-clock.jpg` | Wide, 24mm | Same camera as 96; Jack walks away. **Two calls:** the first put a second clock on the wall and was edited down to the single clock |
| 101 | `s80/99-afraid.jpg` | MCU, 50mm | Ishida afraid for the first time |

Continuity brief: `policeDayLook` in `scripts/neonoire/dawn-look.mjs`. Review: `public/images/neonoire/reviews/jack-recast-and-scene-80.jpg`.

**Next:** scene 81 (the small bar, Kanda, by day), which can reuse scene 2's bar geometry. Before approving anything, also review scene 76's dress and shoe drift.

```bash
npm run build:neonoire && npm run verify:neonoire && npm run check:assets && npm run typecheck
```
