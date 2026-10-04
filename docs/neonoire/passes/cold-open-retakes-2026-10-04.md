# NEONOIRE — the cold open's five: the pins the 2 October rewrite left (4 October 2026)

**Five generations, five frames installed, nothing thrown away — and the `RETAKE PENDING` queue drops from
fourteen to nine.** The five frames the 2 October cold-open rewrite pinned in scene 1 — **3, 6, 7, 9 and 10** —
were regenerated onto the restored walk and lane, installed over their own filenames at their stable asset paths,
reviewed at full size, and released. Every frame is 16:9 full-bleed 1920×1080, normalised by
`scripts/neonoire/fresh-install.mjs`; nothing was renumbered and no other number moved.

## What the 2 October rewrite had left owed

Each of the five boards carried the same sentence: *the image on file shows a beat the rewrite retired, and awaits
a retake.* The beats, and what the retakes deliver:

| # | file | was showing (retired) | is now |
| --- | --- | --- | --- |
| 3 | `s1/03-mara-walks.jpg` | standing still in the doorway, phone ringing unanswered | **mid-walk** down the lane, phone lit in hand, the call she will not answer |
| 6 | `s1/06-barbershop-doorway.jpg` | the old man approaching her, no scooter, no crates | Mara **in the recess**, pressing back into shadow, **the scooter and the stacked beer crates** in front of her |
| 7 | `s1/07-old-man.jpg` | a good coat gone thin, no cap, walking up the street | the **cheap translucent raincoat and the grey flat cap**, arriving from the road, hand pressed to his side, glancing back |
| 9 | `s1/09-old-man-stops.jpg` | the man seen from behind, refusing | **stopped dead mid-lane, face fully readable** in the sodium light — the clip seen, the refusal still to come |
| 10 | `s1/10-the-shot.jpg` | falling alone in the lane | the **black car broadside across the lane mouth** with its high beams down the lane, **two men walking in**, the old man folded on the asphalt, the woman a silhouette in the recess |

**9 is 331's beat from the other side.** 331 (installed 3 October) is *he refuses* — the turn away from the
doorway. 9 is *he stops* — the same moment one beat earlier, with the face readable and the doorway off frame.
The two now read as one event from two angles: in 9 he has just seen the clip and is not yet refusing; in 331 he
has refused and is turning for the road. Any future frame of either must keep the other in view.

## The reference rule, and its one recorded exception

The 30 September fresh-pass rule stands — **character sheets are the only character references and no scene master
is attached for figures or wardrobe**. This round attaches the character sheets **plus the street master
`s1/01-backstreet.jpg` as the lane's geography reference**, because the lane the 2 October rewrite restored is the
same lane the fresh pass already delivered: 7 and 9 also attach the installed **331** (Sakai's wardrobe and the
refusal's turn) and 10 attaches the installed **332 and 333** (the sedan's position across the mouth, and the white
light). No earlier frame is attached for anything but that geography, and the prompts in
`scripts/neonoire/cold-open-fresh-look.mjs` record it. This is the round's precedent, written into the module so the
next agent inherits it rather than guesses it.

## Unclosed caveats, carried (all in the board notes too)

- **3** — the small red enamel bird clip is not readable at this distance (her hair is flat and dark); the lane
  runs **two** vividly striped barber poles where the canon keeps **one**, unlit; the far sign prints **BAR** in
  Latin letters where the cold open's sign is a wordless amber glow; the grade leans cooler than the
  sodium-and-green master.
- **6** — the beer crates' moulded lettering reads as garbled pseudo-text (letter the crate stock on set if it is
  ever approved); the far sign again prints BAR; again two poles.
- **7** — the flicker of recognition does not read at full size, so the beat plays as a cautious man hurrying
  rather than a man who knows her face; the lane behind him shows the vending machine and mixed shop signage where
  the master's lane is plain and closed.
- **9** — what he has seen (the clip catching the light in the doorway) is not in frame, so the stop reads from the
  face alone — 331's installed loss seen from the other side; the diffused headlights older notes asked for behind
  him are absent rather than wrong.
- **10** — **the two men read as full face coverings rather than the locked costume** (knit cap with a black
  lower-face mask, the eyes showing): any further frame of them must correct it, and this study should be retaken if
  the director wants the masks right; **the blocking car reads larger and van-like** rather than the film's ordinary
  black 1990s sedan. Both are carried rather than hidden because the frame's own beat — the sedan blocking the lane,
  the men walking in, the old man down — is the one the rewrite asked for and the one the previous image did not have.

## Release semantics

The pins are dropped on the 305–307 and 1 October precedent: the five frames are **`Ready` by rule**
(`coldOpenFreshCompleted` drives the cold-open status), `rewritePending` reads **nine** — 113, 131, 132, 141–143,
160, 186 and 228 — and the verifier asserts both. Approval of these pixels is the director's; one line in
`scripts/neonoire/rewrite-pending.mjs` re-pins any of them.

## The checks

`npm run build:neonoire` (**322/322 keyframes on disk, 0 placeholders**), `npm run verify:neonoire`,
`npm run verify:shot-order`, `npm run check:assets`, `npm run typecheck` and the production build all pass.
`verify:neonoire` gained this round's assertions: the five are released and carry `RETAKE LANDED 4 OCTOBER 2026`,
their frames are `Ready`, the standing queue is nine, and — correcting a stale expectation the 2 October rewrite
had invalidated — shot 3's brief must now **ask for the walk** instead of the retired "she stands in the recess"
quiet, while the two beats the rewrite kept cut (the pole snag in 17, the flashlight drift in 18) stay prohibited.

**Saved workspaces:** no new placeholder-note digests are needed — no card changes state from "awaiting a picture"
(these five already had images; only their rehearsal notes and pixels advanced), so `pendingNotesHashes` in
`src/lib/bundle-refresh.ts` is untouched. `src/lib/neonoire-scene6-sync.json` was **not** regenerated: the current
bundle already contains scene 14A and must never be shipped as an intermediate.

## Still queued, in the order the boards ask for them

**113** (the sedan interior's "just a face"), **131** (the hand in the dark), **132** (the old woman holds the
door), **141–143** (scene 94's replaced sedan interior), **160** (the third stool, on the rewritten scene 100) and
the Hive-entrance pair **186** and **228**. Each has its own board note saying what the pass must fix, and — this
round's find — **three of them carry board wording the rewrites have since superseded** (228 still describes the
embrace and the parked cars scene 59 no longer has; scene 89's board still promises the noise barrage the rewrite
cut; 186 still names a separate TOMORROW'S TOKYO banner where the new text letters KUROSE DEVELOPMENT on the
hoarding). Fix the wording with the frames, on the scene's logic, as the director's standing instruction says.
