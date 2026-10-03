# NEONOIRE — the rewrite slots, pass two: the refusal, the sedan at the lane mouth, and scene 14A's first six (3 October 2026)

**Ten generations spent, nine frames finished and one of them a retake, nothing renumbered.** The instruction was
**"continue"**, and the head of the queue was scene 1's last three and scene 14A's first six. The delivered boundary
is `scripts/neonoire/rewrite-slots.mjs` → `rewriteSlotsDelivered` (**321–339**, nineteen frames); **340–343 are
still honest placeholders**, briefed in [pass 34](pass-34.md) (340) and [pass 35](pass-35.md) (341–343).

| # | file | frame | pass |
| --- | --- | --- | --- |
| 331 | `s1/331-he-refuses.jpg` | He refuses | 2 |
| 332 | `s1/332-the-sedan-blocks-the-lane.jpg` | The sedan blocks the lane | 2 |
| 333 | `s1/333-the-white-light.jpg` | The old man in the white light | 2 |
| 334 | `s14a/334-the-mirror.jpg` | The mirror | 2 |
| 335 | `s14a/335-the-lane-mouth.jpg` | The lane mouth | 2 |
| 336 | `s14a/336-the-lighter.jpg` | The lighter | 2 (retake in session) |
| 337 | `s14a/337-engine-off.jpg` | Engine off (the scene's master) | 2 |
| 338 | `s14a/338-the-rice-ball.jpg` | The rice ball | 2 |
| 339 | `s14a/339-not-running-from-you.jpg` | Not running from you | 2 |

Still queued, in screenplay order: **340** (the watcher's hand on the bar's shuttered handle) and **341–343** (the
arm across her, the plate written on the bag, forty metres back). `public/images/neonoire/s14a/` was created this
pass.

## Budget, honestly

Ten calls went out; **one was thrown away**: 336's first study came back **portrait** — a framing failure, and a
regenerate, not a caveat — so its landscape retake is the frame on the board. The other nine are first studies. That
is why the queue stops at 339 rather than 341: two scene-14A frames are the head of the next pass, and they are the
two that need the **delivered 337 master** as their reference.

## References attached

**Scene 1 (331–333):** `sheets/sakai.jpg` and, at 333, `sheets/masked-man.jpg`, plus the scene's own masters —
`kanda-alley-layout.jpg`, `s1/01-backstreet.jpg`, `s1/08-sedan-arrives.jpg` — since the studio's standing rule for
the layout and the sedan is explicit. **Scene 14A (334–339):** `sheets/vera.jpg`, `sheets/jack.jpg` and (336)
`jack-face.jpg`, plus this scene's own locks: the scene-31 car `s31/169-the-only-car.jpg`, and the delivered
**334** as the reference for the master 337 and the insert 338 so the mirror, the clip and the car carry by
construction.

## Review, frame by frame, at full size

Nine-frame sheet: [reviews/rewrite-slots-2-2026-10-03.jpg](../../public/images/neonoire/reviews/rewrite-slots-2-2026-10-03.jpg).
Every frame was opened at 1920×1080 before install; the sheet is the index, not the review. What passed: 331's refusal
reads exactly as the page asks (one head shake, eyes already averted, the shoulder turning to the road); 332 holds the
layout canon — the sedan **broadside across** the mouth, high beams straight down the lane, rain in white columns, the
scooter and beer crates on the recess side, the old man small and from behind with his shadow thrown toward camera;
333 gives the two masked men as unreadable silhouettes against the glare with the old man stock still between them and
the recess; 334's clip swings from the mirror on its string with one pair of patient headlights inside the glass;
335's car sits at the lane's mouth dark, with the follower's lamps going out behind; 336 reads the joke at a glance —
an open, unlit lighter in an open palm; 337 puts both faces readable through the windscreen with the clip in frame;
338 leaves the rice ball uneaten; 339 holds Jack's unblinking profile with Vera close to the lens.

**Unclosed caveats, carried into the boards, none of them hidden** — the five that need a decision before print:

1. **331** — a **second elderly man** stands in the lane's middle distance behind the subject (same wardrobe: the
   master-era echo). He must leave the frame. The first study of this frame was refused by the image service and
   re-composed with the street master attached.
2. **332** — the barber's pole is **lit** in the recess (the master keeps it unlit), and the car's plate is faintly
   legible.
3. **333** — the old man's raincoat now reads **light beige** rather than the sheets' translucent cream; the masks
   sit **higher on the head** than the sheet's nose-and-mouth line; a **second light column and a vehicle shape** sit
   deep in the lane between the walkers; a small illuminated **EXIT バー** sign hangs near that end (the pole should be
   the only sign there); and the scooter the note names is not in frame.
4. **14A's car** — the delivered interiors (**334**, **337**, **339**) read **newer** than the scene-31 silver-grey
   1980s sedan they belong to: roof lining and sun visors are modern, and 336's hatchback reads as a **small SUV**
   where this scene locks a boxy maroon hatchback. This is the scene's one structural mismatch and it is
   material for the next 14A pass; **337 is the master every further interior frame should copy, with that car
   corrected**.
5. **339** — **Vera does not look at Jack**: the board has her turning to him for the first time since she sat down,
   and the frame leaves her gaze on the lane, so the beat reads from his side only. **First candidate for a retake.**

Smaller, all logged in the board notes: 335 reads horizontal rather than low and cannot judge the dim-headlight lock;
336's lighter is silver and larger than life where scene 89 locks worn steel; 337's umbrella lies on the seat with its
crook up rather than dripping on the floor, and the windscreen is too clear for the board's smeared lane; 338's rice
ball is open but **still in its wrapper** where the board says unwrapped, and its coat reads lighter than the sheet.

## Release semantics

The nine frames are **`Draft`** — delivered studies awaiting production approval. The four slots still without
pictures stay **`Needs review`** placeholders naming the file they await. Nothing was pinned and nothing released: no
`RETAKE PENDING` frame is involved in this pass, and the older replay pins stand exactly where
[rewrite-pending.mjs](../../scripts/neonoire/rewrite-pending.mjs) puts them.

## The checks

`npm run build:neonoire` (**318/322 keyframes on disk, 4 placeholders**), `npm run verify:neonoire`,
`npm run verify:shot-order`, `npm run verify:revision:neonoire`, `npm run check:assets`, `npm run typecheck` and the
production build all pass. `verify:neonoire` now also holds 14A's own boundary — the four owed slots are placeholders,
the six delivered are 16:9 `Draft` frames, and **nineteen slots are delivered, in the order the queue asks for them**.
`npm run passes:neonoire` regenerates [pass 34](pass-34.md) (shot 340) and [pass 35](pass-35.md) (341–343).

**A saved workspace** left on a 2 October default receives these nine pictures on its untouched placeholder cards
through the digests added to `pendingNotesHashes` in `src/lib/bundle-refresh.ts` (image, title, status and note only;
a card the director has written on keeps its words and gains only the image). `src/lib/neonoire-scene6-sync.json`
needed no regeneration: the *current* bundle already contains scene 14A, and carrying it as an intermediate would
re-insert a scene a workspace may have deliberately deleted (which `verify:revision:neonoire` catches).
