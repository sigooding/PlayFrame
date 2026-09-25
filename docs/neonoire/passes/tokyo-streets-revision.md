# Scenes 72–75 — Tokyo Story in colour, revision session 1

**25 September 2026 · 10 generation calls used · 9 shot images + 1 Jack identity sheet**

The user requested replacement images, character/location continuity, pretty makeup until the rain, 16:9, and camera changes toward *Tokyo Story* without black and white. The previous street images and old rain/cutaway style keys were **not** generation references. The screenplay remains byte-for-byte unchanged.

## Delivered

All ten generated masters are delivered as full-bleed **1920×1080 JPEG**. Jack's face crop and the review contact sheet are derived from those masters, not additional generation calls.

| Board shot | Scene | Image under `public/images/neonoire/` | References / continuity |
| --- | --- | --- | --- |
| — | Cast | `sheets/jack.jpg` | Original design, 48-year-old former detective; new canonical reference, not the father |
| 69 | 72 | `s72/69-the-wait.jpg` | Vera face/sheet; new hotel and wine-red dress master; makeup intact |
| 70 | 72 | `s72/70-the-call.jpg` | New hotel master + Vera face; dry makeup; restrained frontal MCU |
| 72 | 73 | `s73/70-not-elegantly-badly.jpg` | Vera face + new hotel wardrobe; new street master; both shoes, first washed mascara |
| 74 | 73 | `s73/72-the-lost-heel.jpg` | New run master + Vera face/dress; right shoe lost, left shoe on |
| 75 | 74 | `s74/74-twenty-metres-apart.jpg` | New run + Jack sheet + Vera face; approach keyframe, not the opening 20m blocking |
| 76 | 74 | `s74/75-one-desperate-blow.jpg` | New confrontation master + both identities; same screen sides and clothes |
| 77 | 74 | `s74/73-two-small-figures.jpg` | New confrontation master + Jack sheet; extreme-wide separated aftermath, train overhead |
| 79 | 75 | `s75/77-the-red-shoe.jpg` | New lost-heel master; same shoe, puddle, drain, kerb and light; no person |
| 80 | 75 | `s75/78-the-empty-lounge.jpg` | New waiting master; same camera, umbrella and room, no pianist or Vera |

Review: `public/images/neonoire/reviews/tokyo-story-72-75-pass-1.jpg`.

## Next session — six replacements, not six finished images

All six superseded files have been removed; their cards are empty, labelled **keyframe missing**, **Needs review**. Do not restore or borrow an older image to satisfy an asset check.

| Board shot | Stable frame ID | Scene | Required image | Brief |
| --- | --- | --- | --- | --- |
| 71 | `neonoire-shot-69` | 73 | `s73/69-vera-runs.jpg` | Hotel threshold: makeup mostly intact; both shoes, no umbrella |
| 73 | `neonoire-shot-71` | 73 | `s73/71-the-machine-glows.jpg` | Fixed machine frame, Vera passes; still both shoes |
| 78 | `neonoire-shot-76` | 74 | `s74/76-the-reflection.jpg` | Ambiguous umbrella in water only, unreadable face; return to wide |
| 81 | `neonoire-shot-79` | 75 | `s75/79-the-hive-shut.jpg` | Whole closed Hive, no people, no early demolition |
| 82 | `neonoire-shot-80` | 75 | `s75/80-the-machine-waits.jpg` | Same ivory machine from new run master, nobody |
| 83 | `neonoire-shot-81` | 75 | `s75/81-static-in-a-window.jpg` | Grey CRT static, no human reflection, then black |

Self-contained generation briefs: [pass 8](pass-8.md), [pass 9](pass-9.md). These are **board-index groups**, not a claim that the first revision session generated sequential shots. Finish all six within one later ten-image session; Jack need not be regenerated.

## Locks

- **Vera:** canonical ash-blonde face/fringe/blue eyes. The new wine-red silk dress has broad straps, a modest cowl neck, calf-length bias-cut skirt, no slit. Low wine-red closed-toe court heels. No change of face or neckline between dry/wet states.
- **Makeup:** dry, groomed, pretty and intact in 72. Only outdoor rain undoes it in 73; thin washed mascara, not a horror mask. Keep the same face beneath it.
- **Shoes:** both until the skid; **RIGHT foot bare / LEFT shoe retained** afterwards. This is a visual casting/continuity decision; the script leaves the side unspecified.
- **Jack:** `sheets/jack.jpg` and `jack-face.jpg`. Japanese appearance is the new casting choice. Age 48 and former police work are script facts. No surname is given. See [profile](../characters/jack.md).
- **Father:** Daniel Voss, not Jack. Existing family-photo image unchanged; cast label and relationship directions corrected.
- **Geography:** run machine has muted red side panel, right payment controls, dull-green shutter, drain and shallow gutter. Confrontation has two machines left, awning right, Vera screen-left of Jack; both end on the pavement, apart. Hotel umbrella stays at its original stool.
- **Camera:** all static, low **and level**. `Low, level` is now an actual app angle, not the old low-angle prompt that tilts up and makes a subject powerful. 50mm except 35mm for the distant aftermath. One earned frontal face shot in the lounge; no camera chases or comforts Vera.
- **Colour:** muted olive, tobacco amber, ivory practical light, black rainwater and wine red. No black-and-white or glossy neon treatment.

## Review caveats

These are AI-generated draft studies, not approved coverage. Shot 75's image studies the approach at a closer distance, not the scripted initial twenty-metre stop. Stage that opening distance explicitly. Shot 76's keyframe samples the blow, while its take must also cover folding and rejection. Shot 77 samples the distant aftermath; the reflection insert returns to that same camera for the train and late score. Precise clock hands remain a prop/compositing check.

The generated call image invented a second counter at the bottom; the delivered image is a chest-up reframe excluding it. Use **the waiting master**, not the uncropped call generation, as the hotel layout reference. No extra generation was used to make the crop.

## Integration

Scene 72 adds two board positions. Global display numbers are now **1–86**, but all existing frame IDs and asset names stay stable, including scene 76's unchanged IDs 82–84. Never infer the running order from a filename prefix or a frame ID. The board's `ID:` field makes this explicit.

The builder carries the new cameras, cast, statuses, notes and look into the portable project. It preserves the full screenplay. Existing separately saved workspaces are not overwritten automatically; import the updated bundle for a separate revision copy if needed. Reopening still fills untouched missing-keyframe slots when subsequent images arrive.

```bash
npm run build:neonoire
npm run verify:neonoire
npm run check:assets
```
