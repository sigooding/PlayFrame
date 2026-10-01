# NEONOIRE — the cold-open and storeroom retake round (1 October 2026)

Director's note, verbatim: *"also fill in some of the missing shots"*.

Nothing was missing in the sense the app means: `npm run build:neonoire` reported **299/299 keyframes on disk, 0
placeholder cards**, 102 scenes, no scene without a frame. What was outstanding were the **16 frames the 30 September
rewrite left at `RETAKE PENDING`** — frames whose pixels still show a beat the screenplay no longer contains. Those
are the "missing shots" a director means: coverage that exists and is wrong. This pass worked seven of them off the
front of the queue, in screenplay order, and left the remaining nine queued with their own notes.

## What "filled in" meant here

Seven frames, one per beat the revision retired, generated from the **current** Fountain text with the same rule the
fresh pass was run under — screenplay text plus character sheets, no earlier frame attached to any generation:

| frame | beat the old pixels showed | what the rewrite says | installed over |
| --- | --- | --- | --- |
| 1/03 | Mara walking fast across the frame | *"MARA VOSS (24) stands in the dark doorway of a closed barber's, soaked, no umbrella."* — she is already there; the phone lights up and she watches it ring | `s1/03-mara-walks.jpg` |
| 1/06 | her ducking into the doorway | *"An OLD MAN (70s) comes slowly up the street in a good coat gone thin at the cuffs."* — the wide is what she looks at from inside the recess | `s1/06-barbershop-doorway.jpg` |
| 1/17 | purse strap snagging the pole, torn loop | *"The dark car pulls away and takes the long way round the block."* — the bag slid off her shoulder and is **left** in the road, open, contents spilled | `s1/17-she-runs.jpg` |
| 1/18 | a man searching the body, torch beam ending on the purse | *"Behind her, on the street: her purse, open in the rain."* — no search, no torch, he walks back unhurried and never looks at the doorway | `s1/18-the-flashlight.jpg` |
| 2/27 | the notebook taken off the floor | *"He takes one step toward the counter. A voice in his earpiece: one word. He turns and goes."* — **nobody takes the notebook**; her red clip works loose in the gap behind the counter | `s2/27-the-notebook.jpg` |
| 20/193 | Mara standing, kitchen knife in both hands | *"Jack is in the doorway. She scrambles back against the wall."* — no knife exists anywhere in scene 20; her hands are empty, his are open | `s20/191-prove-it.jpg` |
| 20/194 | the clip in Jack's steady open palm | *"Jack sets her sketchbook on a flour sack between them, with the hair clip on top."* — the clip lies on the closed book, no hand in frame | `s20/192-the-red-bird-clip.jpg` |

Filenames keep their first-boarding vintage (`03-mara-walks`, `18-the-flashlight`, `191-prove-it` under shot number
193) because **stable paths are the contract**: never renumber, never rename, never delete. Two of the board
*headings* did change, because a dash title that names a retired beat is a lie on the card: 1/18 is now *"the purse,
and the man walking away"* and 2/27 is *"the notebook left"*.

## Budget: nine of ten

The session cap is ten generations. Seven went to the seven frames and two more to shot 27, whose first two attempts
were thrown away: the first drew the masked man standing in full figure, which breaks the framing rule shot 25 sets
as the law of the rest of scene 2 (*"this framing is the law of the rest of the scene: shoes, ankles, and what the
floor sees"*), and the second put Mara's face in the shot with dark hair — a cast-match failure against
`sheets/mara.jpg`, which the studio rules say is a regenerate, not a caveat. The third attempt is the frame on the
board. One call is unspent and is **not** spent on anything else: it is the margin the next session needs if it
rejects one of these seven.

## Release semantics, said plainly

Releasing a pin here follows the house precedent set by **305–307**: a pass that regenerates a frame *and reviews it
at full size* also drops its `RETAKE PENDING` marker, because the marker's whole meaning is "this study still shows a
beat the rewrite retired". Keeping it on a frame that no longer shows that beat would leave the board asserting a
fault that has been fixed.

Two mechanical consequences worth stating rather than burying:

- **The five cold-open frames read `Ready`, not `Draft`.** They are members of `coldOpenFreshCompleted` and of the
  director-approved main set, and `build-project.mjs` derives a released cold-open frame's status from that list. So
  the flip from `Needs review` to `Ready` is a rule, not a claim of approval. The 30 September sign-off covers the
  composition and the pass; **approval of 1 October pixels is the director's**, and one line added to
  `scripts/neonoire/rewrite-pending.mjs` re-pins any of them.
- **193 and 194 go back to `Draft`**, which is where scene 20's studies live. The count moved accordingly:
  `Ready` 39 → 44, `Draft` 244 → 246, `Needs review` 16 → **9**.

Both boards and the shared brief now carry that qualification in their own words; `n01-backstreet.md` and
`n02-small-bar.md` no longer call the pass complete-and-approved without saying which pixels the approval covers.

## What changed in the sources

- `scripts/neonoire/cold-open-fresh-look.mjs` — the retake prompts for 3, 6, 17, 18 and 27 rewritten to the current
  text, the `RETAKE ROUND, 1 October 2026` header note recording the round and the two thrown-away attempts at 27,
  shot 18's references moved from `sheets/sakai.jpg` (the old man is no longer in that frame) to `sheets/mara.jpg`
  (she is, small, in the doorway), and the shared brief's closing sentence qualified so it no longer implies the
  director approved the replacement pixels. The other twenty-one prompts are untouched: they are the record of what
  their installed images were drawn from.
- `scripts/neonoire/rewrite-pending.mjs` — 16 → **9**; the header records what was generated, reviewed and released,
  what was thrown away, and what each of the nine still queued needs.
- `docs/neonoire/scenes/n01-backstreet.md`, `n02-small-bar.md`, `n20-storeroom-prove-it.md` — descriptions, one
  `SCRIPT:` quote (193 now quotes the doorway line the frame actually plays, not the earlier futon line — both are
  verbatim in the Fountain). **That quote is the beat the display order follows**, so scene 20 now plays 309 → 193 →
  194 → 284: the voicemail replay comes *before* Jack is in the doorway, which is the order the page gives (990, 998,
  1000, 1056) rather than the order the old anchor produced. `verify-shot-order` was updated to the page, with the
  reason in a comment — no shot number, ID or asset path moved, `CAST:` for 18 (the old man is out of frame, Mara is in it), 27 (the clip and the
  journalist's hand are in frame) and 194 (nothing human is in frame), and every `RETAKE PENDING` sentence deleted
  from the released notes — the marker is asserted to match the Set, so a stale sentence is a failing build.
- `scripts/verify-neonoire.mjs` — the three hard-coded pin assertions flipped to assert the *release* (with the
  pin-note absence asserted too), a new check that the generation brief no longer asks for the retired beats, the
  layout-pass note check narrowed to the three frames that keep it, and `rewritePending.size === 9`.

## Caveats on the new pixels, kept rather than regenerated

- **1/17 is the one frame whose camera is reversed from its own board line**: the board says the bar glow is at the
  near end, and the frame looks back along the lane at her face with the car behind her. It is self-consistent — the
  bag and its spilled contents hold the near foreground, the pole is in shot in the position and colours shot 6
  fixed — but the direction of her run is told by the cut, not the frame. The generation was 3:2, so the installer's
  centre-crop to 16:9 is a 1.5× upscale; the same as every other frame in this pass.
- **2/27** keeps the floor-level law but tells the departure only through shoes and a gloved hand on the counter
  edge; the figure slumped mid-frame reads as the journalist, and the red clip sits at her cheek rather than fully
  under the shelf. Dress it in the edit if it plays too exposed.
- **20/193** puts Jack just inside the entrance at the right of the bulb's pool rather than behind the curtain, and
  Mara on the futon rather than standing against the wall — both are the rewrite's own blocking, but neither is
  word-for-word what the line says.
- **20/194**'s sack reads woven hessian where 193's reads printed paper with the same FLOUR stencil, and the clip
  reads slightly oversized at 85mm. Prop, not generation.

## The standing queue, nine frames

113 (scene 83, Vera's "just a face"), 131 (89, the hand in the dark), 132 (90, the old woman holds the door — already
retaken once, its caveat is the hair), 141/142/143 (94, the sedan interior: only *It's only tea* survives, 51 is
wordless), 160 (100, the third stool), and 186 with 228 (the Hive entrance pair, both rebuilt to the canon
eleven-storey Hive on 29 September — what keeps them pinned is the **unlettered banner**, not a retired beat). Two
sessions of ten calls clears the queue if nothing is thrown away; one session if the corrections hold.

## Checks

`npm run build:neonoire` → `299/299 keyframes on disk; 0 placeholder cards hold their slots`.
`node scripts/verify-neonoire.mjs` → `All NEONOIRE checks passed.`, including
`cold-open: all 26 surviving frames of scenes 1–2 are 1920×1080 fresh-pass images … the retake round of 1 October 2026
regenerated 3, 6, 17, 18 and 27 onto the rewritten text and released their pins` and
`scene 1 after the revision: sixteen frames, the four re-pinned retakes delivered and released on 1 October 2026`.
`npm run verify:shot-order` → `All shot-order checks passed.` (its scene-20 expectation moved with the re-anchored
quote, as recorded above). `npm run check:assets` → `Checked 905 asset references — 905 present, 0 missing.`
`npx tsc --noEmit` clean, `npm run lint` 0 errors / 21 pre-existing warnings, `npm run build` clean.
The two `*:browser` verifiers could **not** be run in this sandbox: Playwright's browser download is blocked here
(`npx playwright install` fails), and `.cache/ms-playwright` is not part of the workspace snapshot. Nothing about this
pass was verified only in a browser.
Review sheets: [before/after, seven rows](../../public/images/neonoire/reviews/cold-open-retake-before-after-2026-10-01.jpg)
and [the nine still queued](../../public/images/neonoire/reviews/cold-open-retake-queue-2026-10-01.jpg).
