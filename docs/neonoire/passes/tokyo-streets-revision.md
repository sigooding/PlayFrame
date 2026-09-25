# Scenes 72–75 — Tokyo Story in colour, revision session 2

**25 September 2026 · 8 generation calls used · 6 needed shots + 2 continuity replacements**

Session one left six empty slots and two keyframes that did not hold up under review. This session
completes the sequence. The user asked for the needed shots, replacements for anything that did not
seem right, character and scene consistency, pretty makeup until the rain, 16:9, and a *Tokyo Story*
style (in colour) carried through the lens selection: static, low and **level**, normal 50mm — 35mm
only for the aftermath extreme wide. The screenplay remains byte-for-byte unchanged.

## Delivered

All eight generated masters are delivered as full-bleed **1920×1080 JPEG**; two generation slots were
deliberately unused. No new cast sheets were needed.

| Board shot | Scene | Image under `public/images/neonoire/` | Notes / continuity |
| --- | --- | --- | --- |
| 71 | 73 | `s73/69-vera-runs.jpg` | Hotel threshold; makeup still pretty and intact, both shoes; amber doorway vs cold street |
| 73 | 73 | `s73/71-the-machine-glows.jpg` | Static machine frame from the run master; Vera passes L→R; both shoes; thin washed mascara |
| 74 | 73 | `s73/72-the-lost-heel.jpg` | **Continuity replacement** — regenerated so puddle, drain, kerb and shoe orientation match `s75/77-the-red-shoe.jpg`; genuine stumble, RIGHT bare / LEFT shod |
| 75 | 74 | `s74/74-twenty-metres-apart.jpg` | **Continuity replacement** — the scripted twenty-metre stop now actually pictured at distance; the old study staged ~5m and carried a stray red smear on the asphalt |
| 78 | 74 | `s74/76-the-reflection.jpg` | Water-level insert; inverted street with warm anomalies and an unreadable pale-blue umbrella figure; no person directly visible |
| 81 | 75 | `s75/79-the-hive-shut.jpg` | Intact closed Hive; dim unreadable sign; no people, no demolition |
| 82 | 75 | `s75/80-the-machine-waits.jpg` | Same ivory machine, matched panels; nobody, no relocated shoe |
| 83 | 75 | `s75/81-static-in-a-window.jpg` | Grey CRT static in a colour night; no face, no programme; then CUT TO BLACK |

Review: `public/images/neonoire/reviews/tokyo-story-72-75-pass-2.jpg` — all fifteen scenes 72–75
frames plus Jack's face sheet.

## Superseded images

The session-one `s73/72-the-lost-heel.jpg` (calm walk, barely raining, shoe adrift mid-road away from
the drain its own pillow shot had locked) and `s74/74-twenty-metres-apart.jpg` (~5m separation, red
smear) are **replaced on disk**; the old files no longer exist anywhere in the tree and must not be
restored or referenced.

## State after this session

Every scene 72–75 keyframe is on disk — **86 of 86 active keyframes board-wide, no placeholders**.
Remaining revision work elsewhere is unchanged: cold-open shots 11–28 and scene 3 are still legacy
2.39:1 studies awaiting their own 16:9 pass.

## Locks (unchanged)

- **Vera:** canonical face; wine-red silk broad-strap cowl-neck calf-length dress; makeup dry and
  pretty through scene 72, washed by rain into thin mascara trails only outdoors; RIGHT foot bare /
  LEFT shoe retained from the skid onward; no coat or umbrella on the street.
- **Jack:** `sheets/jack.jpg`; 48, Japanese casting, charcoal knee-length coat, dark unwashed hands;
  screen-right of Vera; never retaliates.
- **Geography:** run machine (muted red side panel, right payment panel, dull-green shutter, drain,
  shallow gutter) and confrontation street (two machines left, awning right) as locked in session one.
- **Camera:** all static, low and level; 50mm except `neonoire-shot-73` at 35mm. No tracking, no
  hero angles, no black-and-white, no glossy neon.

## Integration

Stable frame IDs and asset names are unchanged; the two replaced files keep their names. The builder
marks the eight session-two images in each frame's notes, and the mood board now carries all fifteen
studies. `streetsPassTwoImages` in `scripts/neonoire/streets-look.mjs` is the session-two audit list.

```bash
npm run build:neonoire
npm run verify:neonoire
npm run check:assets
```


## Session one archive — delivered

All ten generated masters were delivered as full-bleed **1920×1080 JPEG**. Jack's face crop and the review contact sheet are derived from those masters, not additional generation calls.

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

## Session one archive — the six slots (all delivered in session two)

At the end of session one all six superseded files had been removed; their cards were empty, labelled **keyframe missing**, **Needs review**. Session two generated every one of them at the exact paths below — none was restored or borrowed from an older image.

| Board shot | Stable frame ID | Scene | Required image | Brief |
| --- | --- | --- | --- | --- |
| 71 | `neonoire-shot-69` | 73 | `s73/69-vera-runs.jpg` | Hotel threshold: makeup mostly intact; both shoes, no umbrella |
| 73 | `neonoire-shot-71` | 73 | `s73/71-the-machine-glows.jpg` | Fixed machine frame, Vera passes; still both shoes |
| 78 | `neonoire-shot-76` | 74 | `s74/76-the-reflection.jpg` | Ambiguous umbrella in water only, unreadable face; return to wide |
| 81 | `neonoire-shot-79` | 75 | `s75/79-the-hive-shut.jpg` | Whole closed Hive, no people, no early demolition |
| 82 | `neonoire-shot-80` | 75 | `s75/80-the-machine-waits.jpg` | Same ivory machine from new run master, nobody |
| 83 | `neonoire-shot-81` | 75 | `s75/81-static-in-a-window.jpg` | Grey CRT static, no human reflection, then black |

Self-contained generation briefs: [pass 8](pass-8.md), [pass 9](pass-9.md) — both now historical, marked completed. These were **board-index groups**, not a claim that the first revision session generated sequential shots. The six were finished in session two alongside the two continuity replacements; Jack was not regenerated.

## Session one archive — locks

- **Vera:** canonical ash-blonde face/fringe/blue eyes. The new wine-red silk dress has broad straps, a modest cowl neck, calf-length bias-cut skirt, no slit. Low wine-red closed-toe court heels. No change of face or neckline between dry/wet states.
- **Makeup:** dry, groomed, pretty and intact in 72. Only outdoor rain undoes it in 73; thin washed mascara, not a horror mask. Keep the same face beneath it.
- **Shoes:** both until the skid; **RIGHT foot bare / LEFT shoe retained** afterwards. This is a visual casting/continuity decision; the script leaves the side unspecified.
- **Jack:** `sheets/jack.jpg` and `jack-face.jpg`. Japanese appearance is the new casting choice. Age 48 and former police work are script facts. No surname is given. See [profile](../characters/jack.md).
- **Father:** Daniel Voss, not Jack. Existing family-photo image unchanged; cast label and relationship directions corrected.
- **Geography:** run machine has muted red side panel, right payment controls, dull-green shutter, drain and shallow gutter. Confrontation has two machines left, awning right, Vera screen-left of Jack; both end on the pavement, apart. Hotel umbrella stays at its original stool.
- **Camera:** all static, low **and level**. `Low, level` is now an actual app angle, not the old low-angle prompt that tilts up and makes a subject powerful. 50mm except 35mm for the distant aftermath. One earned frontal face shot in the lounge; no camera chases or comforts Vera.
- **Colour:** muted olive, tobacco amber, ivory practical light, black rainwater and wine red. No black-and-white or glossy neon treatment.

## Session one archive — review caveats

These are AI-generated draft studies, not approved coverage. Shot 75's image studies the approach at a closer distance, not the scripted initial twenty-metre stop. Stage that opening distance explicitly. Shot 76's keyframe samples the blow, while its take must also cover folding and rejection. Shot 77 samples the distant aftermath; the reflection insert returns to that same camera for the train and late score. Precise clock hands remain a prop/compositing check.

The generated call image invented a second counter at the bottom; the delivered image is a chest-up reframe excluding it. Use **the waiting master**, not the uncropped call generation, as the hotel layout reference. No extra generation was used to make the crop.

## Session one archive — integration

Scene 72 adds two board positions. Global display numbers are now **1–86**, but all existing frame IDs and asset names stay stable, including scene 76's unchanged IDs 82–84. Never infer the running order from a filename prefix or a frame ID. The board's `ID:` field makes this explicit.

The builder carries the new cameras, cast, statuses, notes and look into the portable project. It preserves the full screenplay. Existing separately saved workspaces are not overwritten automatically; import the updated bundle for a separate revision copy if needed. Reopening still fills untouched missing-keyframe slots when subsequent images arrive.

```bash
npm run build:neonoire
npm run verify:neonoire
npm run check:assets
```
