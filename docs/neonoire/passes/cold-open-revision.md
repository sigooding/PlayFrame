# Cold open — 16:9 continuity revision

Scope: **shots 1–28**, scenes 1–2, before the main titles. Preserve the verbatim screenplay, numbering and story beats. This is a revision of existing images, not missing coverage.

## Delivery status

- [x] **1–10** — installed as 1920×1080 JPEGs at the existing asset paths; AI-generated draft studies, awaiting production approval.
- [x] **11–13** — rebuilt 16:9 on 26 September 2026 at the existing asset paths, from the same street masters and beats; the boards in `scenes/n01-backstreet.md` are unchanged.
- [x] **14–18** — rebuilt 16:9 later on 26 September 2026 (batch two): the kneel, the grip, the key 87 insert, the torn strap and the puddle, the torch on the purse. Shot 18 keeps the moderation-safe composition — the beam on the purse in the water is the subject; the searching man stands by the sedan and no body is in frame.
- [x] **19–21** — rebuilt 16:9 in the same session: the six-stool bar established empty, the journalist's face and beer and closed notebook locked, Mara bringing the street's weather in. Caveat: in 21 the rain behind her reads through the bar's front window rather than through the open door.
- [x] **22–28** — final cold-open batch, rebuilt 16:9 later on 26 September 2026 (batch three): the journalist's glance, Mara behind the counter with the key, the floor's law (shoes, crates, ceiling glow), the two pairs of shoes, the tipped stool and the hand and the laughing TV, the notebook taken, and Mara's hand flat on the rattling bottles. **The cold open, shots 1–28, is now wholly 16:9.** Carried caveat: the notebook cover reads pale grey in 27 against the darker cover on the counter in 20 — logged in `scenes/n02-small-bar.md`, not spent a generation on.
- [x] **29–31 (scene 3)** — rebuilt 16:9 in the same session from the legacy studies' own geometry: the block between towers with its external stair, the train's blur on the elevated line, the one lit window. The `THREE DAYS LATER` super is a title added in the grade, never baked; the lit window's geometry between 29 and 31 is a production-review check. **Retaken 29 September 2026 (shots 29 and 30):** the earlier 29 and 30 had been generated from `keys/06-the-block.jpg` (the Hive key) and looked like the Hive between glass office towers, with the lit window jumping from the third floor to the fourth. Vera lives in an **ordinary old four-storey apartment building** somewhere else in Tokyo, beside the elevated railway — the story depends on her *not* knowing the Hive until scene 55. Shots 29 (`s3/29-apartment-block.jpg`, 24mm establishing) and 30 (`s3/30-the-elevated-line.jpg`, 35mm wide with the blurred train on the elevated viaduct) are retaken against `s3/31-the-lit-window.jpg` and `s78/88-the-walkway.jpg`: a plain four-storey grey precast-concrete residential block squeezed between two ordinary newer five-storey beige tiled residential manshon buildings, external steel stair on the left, balconies on the right, bicycles at the foot of the wall, and **only the single window on the third floor lit** warm amber across 29, 30 and 31 (`scripts/neonoire/apartment-look.mjs`, `apartmentBuildingLook`; review sheet `reviews/scene-3-revision.jpg`).
- [x] **32 (scene 3)** — the laundry insert, rebuilt 16:9 later on 26 September 2026 (batch four): shirt and towel on the line, two pegs, rain since before, the train's light crossing at the end. **No legacy 2.39:1 frame remains anywhere in the numbered board.**
- [x] **Batch four detail fixes (same session)** — shot 235's lounge clock now reads 9:58 as scripted; shot 234's box now reads TOKYO in legible marker; shot 27's notebook now matches shot 20's brown leather wrap; shot 21's rain now falls through the open door behind Mara; shot 31's lit window now matches 29's geometry. Two prop masters added under `public/images/neonoire/props/`: the SHIOHAMA cassette label and the DANIEL VOSS green-cloth notebook cover.
- [x] **29–32 (scene 3) closed** — the last line above was stale: scene 3 is rebuilt, and the bundle builder no longer marks any frame **16:9 REVISION PENDING**. The old `awaitingAspect` scene-key flag was replaced by a dimension test that reads each JPEG's own bytes; all 269 frames that predate the final coverage pass were scanned and every one is exactly 1920×1080.

The image service allows ten generations in a turn. Never silently crop a legacy image or label it as rebuilt: every revision above was regenerated at 1920×1080 from the scene masters.

## Consistency audit — 26 September 2026 (asked by the director)

**Is the cold open consistent? Not yet — deliberately, and here is why.** Shots 1–10 were rebuilt 16:9 in the original revision pass; on 26 September 2026 shots **11–13** were rebuilt 16:9 at their existing asset paths from the same street masters and beats (Mara's two hands over her mouth in the doorway shadow; the masked man's earpiece, only eyes above the mask; the sedan pulling away unhurried with taillights on the wet road). Reviewed frame by frame at full size, **1–13 now read as one continuous street**: same recess, pole and vending machine, same soaked Mara with the red-bird clip and intact bag strap, same black sedan and exactly two masked men, same rain and sodium-against-green palette.

**Audit closed, 26 September 2026 (batch four): the cold open (1–28) and scene 3 (29–32) are wholly 16:9 — one street, one bar, one dusk; no aspect seam and no legacy frame remains anywhere in the numbered board** (the older style keys stay 2.39:1 references by design). The inconsistency the director first asked about existed because every turn's ten generations went to finishing the numbered board in screenplay order on the no-gap-filling instruction, and legacy frames were never cropped; it was closed in four labelled batches, each logged here: the ten-generations-a-turn budget was spent, on the director's instruction, finishing the numbered board in screenplay order before any more gap-filling, and the board only closed on 26 September 2026 with scenes 65–71. The repo rule forbids cropping the legacy frames to fake 16:9, so they remain on disk marked **Needs review / REVISION PENDING**, driven by `coldOpenCompletedThrough` (now 13). With the feature fully boarded and batches two, three and four landed on 26 September 2026, the standing queue is empty: every numbered frame is revised 16:9 and the prop inserts exist as masters. Remaining image work is director-ordered retakes only.

## Reference priority

The revised numbered frames below take priority over the older style keys for geometry, props and cast. The old keys still inform the overall film texture, not a competing street layout. See `scripts/neonoire/cold-open-look.mjs` for the shared prompt brief and the explicit completed-through boundary used by the bundle builder.

| Reference | Lock |
| --- | --- |
| `s1/01-backstreet.jpg` | Left foreground: closed brown door in dark-brick barbershop recess; navy awning; grey shutter left; one dark red-white-blue pole on the recess’s right edge. One off-white three-row vending machine across the road on the right. Distant amber lamp/T-junction, faint green shop spill down right. |
| `sheets/mara.jpg`, `s1/03-mara-walks.jpg`, `s1/04-mara-phone.jpg` | Same Mara, soaked ash-blonde hair/red enamel bird clip, indigo denim jacket/grey tee/black jeans/white trainers/thin black cord. Never Vera’s fringe, coat or cream knit. |
| `s1/05-phone-off.jpg`, `s7/65-the-evidence-bag.jpg` | Dark-brown structured leather handbag, short rounded handles, intact long strap from right shoulder to left hip through 16. No evidence wrapper on the street. One black smartphone, switched off in 5. |
| `s1/06-barbershop-doorway.jpg` | Mara inside the closed doorway’s shadow, pole fixed at right edge. |
| `s1/07-old-man.jpg`, `s1/09-old-man-stops.jpg`, `s1/10-the-shot.jpg` | Same elderly Japanese man; thin grey-white hair, clear/beige cheap plastic raincoat with hood down, cream shirt/brown cardigan, dark trousers, black shoes. Falls just outside doorway. |
| `s1/08-sedan-arrives.jpg` | Ordinary black 1990s four-door sedan, rectangular lamps; exactly two men, black jackets/trousers/gloves/shoes, dark knit caps and black nose-and-mouth masks. |
| Legacy `s1/16-the-key.jpg` | Worn pale oval tag **87** and small locker key. Keep the number; do not invent its meaning. |

All revised files are full-bleed **1920×1080**, fine 35mm grain, muted practical-lit cold white/green with distant sodium amber, ordinary steady rain, no glossy cyberpunk/storm. No added captions or subtitles. Shot 2 is a deliberate vending insert cropped from the shot-1 master (864×486 source region, x512/y160) to retain the identical machine and street geometry; its alternate generation was rejected for background drift. Other installed frames use their own generation, normalized to 16:9. Raw generations/contact sheets stay under ignored `artifacts/cold-open/`.

## Next batch: exact beats

11. Mara covers her mouth with both hands, still hidden in the same recess.
12. Same masked man listens to earpiece; only eyes exposed.
13. Same sedan departs unhurriedly, red taillights; no chase. Retake 27 September 2026: it backs out, it does not turn — the alley is one car wide. See [taillights-backs-out.md](taillights-backs-out.md).
14. Mara kneels next to the fallen man, fumbling her switched-off phone; handbag still present.
15. His hand catches her wrist and transfers the key; keep bodies/coat positions, not a newly seated man.
16. Worn numbered locker-key tag 87, no invented exposition.
17. Returning headlights; her long purse strap catches the same pole and tears. Bag drops into the puddle; Mara runs.
18. Men return/search the coat; flashlight finds the same abandoned brown bag/torn strap. This must connect to the sealed later evidence.
19. Establish one small six-stool bar; amber bottles, blue CRT, half-open back door. Establish geography before close-ups.
20. Journalist in his forties, ordinary, beer and closed notebook. Lock appearance for 22.

## Final batch

21–28: follow `scenes/n02-small-bar.md` verbatim. Same soaked Mara and red-bird clip; **no handbag after 17**. Key remains in her hand at 23. Preserve the six-stool bar/counter, amber bottles, CRT glow and half-open back door; never reveal its occupant. Keep the journalist’s face, clothes, beer and closed notebook consistent; the notebook is taken in 27. Floor POV/shoes in 24–25, off-frame violence in 26 (tipped stool/hand/TV), Mara silences rattling bottles in 28. The titles follow; do not invent another numbered frame.

## Verification / handoff

Update `coldOpenCompletedThrough` only when the corresponding JPEGs have actually been replaced. Update this checklist and the scene notes at the same time. Run:

```sh
npm run build:neonoire
npm run verify:neonoire
npm run check:assets
npm run typecheck
git diff --check
```

Scenes 3–7 and their completed apartment/police work are not part of this batch. Do not alter the screenplay. `passes:neonoire` is missing-only; existing pending-revision images do not trigger its generator. Use this checklist and the original shot boards to redo them.
