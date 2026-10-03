# NEONOIRE — the rewrite slots, pass one: the interview's seven and the cold open's first three (3 October 2026)

**Ten generations, ten frames installed, no retakes and nothing renumbered.** The director's instruction was
**"continue next shots"**, and the next shots on the board are the slots the 2 October 2026 rewrites opened:
scene 6's 321–327 (the interview room's new beats), scene 1's 328–333 (the restored walk and lane) and scene 14A's
334–343. They run as one unbroken block, 321–343, and the delivered boundary is
`scripts/neonoire/rewrite-slots.mjs` → `rewriteSlotsDelivered`.

**Delivered** — all at their stable asset paths, 16:9 full-bleed 1920×1080, normalised by
`fresh-install.mjs` (never stretched, never cropped from another study):

| # | file | frame |
| --- | --- | --- |
| 321 | `s6/321-the-form.jpg` | The form |
| 322 | `s6/322-her-handwriting.jpg` | Her handwriting |
| 323 | `s6/323-the-pen-stops.jpg` | The pen stops |
| 324 | `s6/324-the-passport-photo.jpg` | The passport photograph |
| 325 | `s6/325-squared-to-the-corner.jpg` | Squared to the corner |
| 326 | `s6/326-no-trace.jpg` | No trace |
| 327 | `s6/327-the-inside-pocket.jpg` | The inside pocket |
| 328 | `s1/328-the-scrap.jpg` | The scrap |
| 329 | `s1/329-the-lane-the-watch.jpg` | The lane, and her watch |
| 330 | `s1/330-the-red-clip.jpg` | The red clip catches the light |

**Still queued**, in screenplay order: **331–333** (he refuses, the sedan blocks the lane, the old man in the white
light) and **334–343** (scene 14A's ten). Their briefs are [pass 34](pass-34.md) and [pass 35](pass-35.md); the
queued order is `rewriteSlotsQueued` in the same module.

## Order and budget, honestly

Ten calls, ten frames. Seven went to the interview room because its rewrite is a closed circle — the form is filled,
the pen stops, the photograph is produced, squared and pocketed, the tea is wiped — and a half-delivered circle would
have read as a hole in the film's most exposed two-hander. Three went to scene 1 in screenplay order: the insert that
starts it (328), the look down the lane (329), and the beat the scene turns on (330, the clip catching the light).
**331–333 are cold-open beats the next pass can take first**, and they are the reason this pass stopped at 330: the
ten-call budget is the house rule, and the sedan frame (332) is the one that must agree with the layout canon.

## References attached

**Interview (321–327):** the room master `s6/51-the-interview-room.jpg`, the blocking master `s6/56-three-days-ago.jpg`,
the retaken `s6/62-the-card.jpg`, and the `vera.jpg`, `vera-face.jpg`, `ishida.jpg`, `ishida-face.jpg` sheets; 324–327
also attach `mara.jpg` / `mara-face.jpg` for the photograph of Mara — **the same portrait in all three frames**.
The interview lock travelled in every prompt: Vera left, Ishida right, the one centred frosted rainy window, the grey
laminate, the tan tissue box on the sill, **no tie**, one cream-white paper cup, the spill confined to the crushed
cup's pool and the card's dry laminate.

**Cold open (328–330):** **character sheets only** — `sheets/mara.jpg` and `sheets/mara-face.jpg` — under the
30 September 2026 fresh-pass rule. **No scene master, no layout sheet, no earlier frame was attached to any of the
three.** The street is described in the same words the fresh pass uses (`freshStreet` in
`scripts/neonoire/cold-open-fresh-look.mjs`): the recessed barber's doorway with its one unlit pole, the vending
machine at the corner, one lit window high up, the amber bar at the near end, sodium orange against the green spill.

## Review, frame by frame, at full size

Every frame was opened at 1920×1080 before install; [the ten-frame sheet](../../public/images/neonoire/reviews/rewrite-slots-1-2026-10-03.jpg)
is the index, not the review. What was checked: the room and the blocking against 51/56, Vera's coat and Ishida's
collar against their sheets in every frame they are in, the cup's state (intact, then crushed), the table dry in 325
and wet-then-drying in 326, the portrait of Mara consistent across 324, 325 and 327, and — for the cold open —
Mara's wardrobe, the soaked hair, the clip above her **right** temple, and the street's screen direction against
scene 1's master.

**Unclosed caveats, carried and not hidden** (also written into each board note):

- **321** — a second printed sheet reads at the table's near edge in front of Ishida, where the board asks for the
  one form and the pen.
- **322** — the handwriting is block capitals rather than the script's "fast and square" hand; the form is drawn as
  a real Japanese missing-person sheet with its printed boxes. Both are production choices to confirm.
- **323** — the sheet enters only at the bottom edge, so the stop reads from the face and the raised pen rather than
  from contact with the paper.
- **324** — a suggestion of a thin necklace at the print's collarbone; the wallet's embossed lettering is faintly
  readable at full size.
- **325** — **the sheet under the photograph prints as a differently headed official form**, not the missing-person
  sheet of 322. This is the one caveat a next pass should close if the director wants it closed.
- **326** — the frame is the middle of the wipe: a trace of tea still pools at the tissue. The shot plays out to dry.
- **327** — the print is caught at the pocket's mouth rather than fully inside, and reads a size larger than 324–325.
- **328** — the first line closes with a pen mark that reads as a semicolon; the scrap's tear is clean rather than
  frayed.
- **329** — the watch hands read as an approximation rather than a legible 12:45; the striped pole and the vending
  machine fall on the same side of the lane as this camera sees it (the scene's own master keeps them opposite each
  other); two shutters carry painted kanji and a phone number.
- **330** — at full size the enamel clip reads as a plain red clip rather than a legible bird.

None of these was worth a call out of a ten-call budget whose other seven frames carry the scene the rewrite exists
for; all of them are named here so the next session can spend its margin where the director wants it.

## Release semantics

The ten frames are **`Draft`** — delivered studies awaiting production approval, exactly as the remaining-boards pass
left its own deliveries — and the thirteen slots still without pictures stay **`Needs review`** placeholders naming
the file they await. Nothing was pinned: no `RETAKE PENDING` frame is involved in this pass, and the film's
unresolved pins stand exactly where [rewrite-pending.mjs](../../scripts/neonoire/rewrite-pending.mjs) puts them.

## The checks

`npm run build:neonoire` (**309/322 keyframes on disk, 13 placeholders**), `npm run verify:neonoire`,
`npm run verify:shot-order`, `npm run verify:revision:neonoire`, `npm run check:assets` (916 references, 0 missing),
`npm run typecheck` and the production build all pass. `verify:neonoire` now asserts the boundary itself: a frame in
321–343 with an image that is not in `rewriteSlotsDelivered` fails, a delivered frame is 16:9 and carries the pass's
provenance, the interview's seven stay on the room master and Ishida's wardrobe, and the queue is exactly
`[331 … 343]`.

**A saved workspace left on the 2 October default** receives the ten pictures on its untouched placeholder cards —
image, title, status and note, and nothing else — through the digests added to `pendingNotesHashes` in
`src/lib/bundle-refresh.ts`; a card the director has written on keeps its words and only gains the image.
`src/lib/neonoire-scene6-sync.json` was regenerated with the 2 October bundle as the intermediate, so workspaces on
any earlier default still receive the script, the slot text and scene 14A whole.
