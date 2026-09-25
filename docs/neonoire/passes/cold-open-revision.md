# Cold open — 16:9 continuity revision

Scope: **shots 1–28**, scenes 1–2, before the main titles. Preserve the verbatim screenplay, numbering and story beats. This is a revision of existing images, not missing coverage.

## Delivery status

- [x] **1–10** — installed as 1920×1080 JPEGs at the existing asset paths; AI-generated draft studies, awaiting production approval.
- [ ] **11–20** — next batch; existing legacy 2.39:1 images are still on disk, marked Needs review.
- [ ] **21–28** — final cold-open batch; existing legacy 2.39:1 images are still on disk, marked Needs review.
- [ ] **29–32 (scene 3)** — joins the revision list: from the final screenplay the whole film is 16:9, so scene 3's four legacy 2.39:1 studies are regenerated at 1920×1080, not cropped. The bundle builder marks each of them **16:9 REVISION PENDING**.

The image service allows ten generations in a turn. Do not silently crop the remaining old images or label them as rebuilt. The generation limit was reached after batch 1; no shots after 10 were regenerated.

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
13. Same sedan departs unhurriedly, red taillights; no chase.
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
