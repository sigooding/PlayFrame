# NEONOIRE — the rewrite slots, pass three: the frames decided by the scene's logic (3 October 2026)

**Ten generations, eight frames installed, two studies thrown away and one slot deliberately left open — and the
seven places where a brief did not read as a picture were settled by the scene's own logic, not by the words of the
study.** The director's instruction for this pass: *"if the shot description doesn't make complete visual sense go by
the scene's logic and leave note in handoff."*

**The board now reads 321/322 keyframes on disk. One placeholder is left: the film's last frame, 343.**

## Installed

| # | file | what the study is now | why it went back |
| --- | --- | --- | --- |
| 331 | `s1/331-he-refuses.jpg` | one man, sharp, mid-turn from the doorway | 1st refused by the image service; 2nd carried a **second elderly man** down the lane; 3rd (installed) is a single figure |
| 336 | `s14a/336-the-lighter.jpg` | the open, **unlit** lighter at the window of the **boxy maroon hatchback** | 1st came back portrait; 2nd (installed) is the maroon car the script gives Vera |
| 338 | `s14a/338-the-rice-ball.jpg` | the **wrapper peeled back**, rice bare, **no bite** | 1st left the rice ball sealed in its wrapper |
| 339 | `s14a/339-not-running-from-you.jpg` | Jack forward, **Vera turned to him** | 1st left her gaze on the lane, which flattened the scene's one close-up |
| 340 | `s14a/340-the-shuttered-door.jpg` | the watcher's hand on the bar's shuttered handle | new |
| 341 | `s14a/341-reflex.jpg` | the arm as a bar; the umbrella turned toward the car | new |
| 342 | `s14a/342-the-plate.jpg` | the pencil digits **56-19** on the flattened paper bag | new |

## Thrown away, with the reason (nothing wrong was installed)

- **337, retake** — it strung **red paper lanterns** down the lane and hung a red BAR sign. The canon lane (scenes 1
  and 14A) has **no lanterns** and the bar's sign is the small amber glow of 329; the darker grade also lost the red
  bird clip the shot exists for. **The pass-2 master stands**, and the rule — *no lanterns, ever, in this lane; the
  clip is the frame's one warm point* — is written into the board note and asserted by `verify:neonoire`.
- **343, first study** — it put the following **silver-grey sedan nose-on to the camera** while the maroon hatchback
  ahead showed its tail lights. A car that faces us cannot be following a car that is driving away: the frame
  contradicted the scene's whole geometry. **Not installed**; the slot stays an honest placeholder and the board now
  spells the geometry out for the next generation: *the camera is behind both cars, so the sedan shows its REAR — its
  dim nearside headlight throwing light up the road, not at us — forty metres of shining asphalt separate it from the
  hatchback's tail lights, and nothing else is on the road.*
- **331, second study** — softness/motion blur across the subject's face; a still frame that is not sharp is not a
  still frame.

## The decisions made by scene logic (the director's instruction, applied)

1. **Vera's car is the small boxy maroon hatchback.** 336's first landscape study drew an SUV; the scene locks the
   hatchback because the car is how Jack identifies her. Replaced.
2. **339 shows Vera turning to Jack.** The page's beat is *"She looks at him for the first time since she sat down. He
   is looking at the lane. He doesn't look back."* — the look is hers, the withholding is his, and nothing else in the
   scene carries it. Replaced.
3. **331 is a single figure.** The lane is a three-hander (Mara hidden, the old man, the killers): a twin in the
   middle distance is a cast error. Replaced.
4. **338 is genuinely unwrapped.** "Unwrapped, uneaten" is the prop beat that pays off in 25A breakfast. Replaced.
5. **337 keeps the clip and no lanterns.** Rejected study, master retained.
6. **341's arm is a bar, not a hold.** Jack's forearm flat across Vera, hand braced at her far shoulder, his eyes
   forward; Vera looking down at the arm. As boarded.
7. **343's follower must stay behind.** Left unfilled rather than fudged.

## Unclosed caveats, carried (all in the board notes)

331 the doorway he refuses is off-frame, so the six metres read from the turn alone, and the barber's pole reads
vividly striped where the master keeps it unlit · 336 the lighter is cleanly silver rather than the worn steel of
scene 89, the lane behind opens onto brick low-rises rather than the cold-open shutters, and the rental sticker sits
as the board asks · 337 the master's umbrella lies on the seat with its crook up instead of dripping on the floor, the
windscreen is nearly clear where the board wants the lane smeared into streaks, and the interior reads newer than the
s31 car · 338 the peeled wrapper is too clean and her hands read a little younger than 29 · 339 her face is softer
than the sheet's Vera · 340 the amber sign prints the word **Bar** in Latin letters (the scene's sign is a wordless
amber glow, as 329 has it) and the lane is street-wide where the cold open's is a narrow backstreet · 341 his hand
reads as resting on her shoulder rather than gripping the seat · 342 the digits are only half a plate (the film never
reads the number back) and the sheet lies across both knees.

## Release semantics

The eight installed frames are **`Draft`**; **343 stays `Needs review`** as an honest placeholder naming its file.
Nothing was pinned or released — no `RETAKE PENDING` frame is involved in this pass.

## The checks

`npm run build:neonoire` (**321/322 keyframes on disk, 1 placeholder**), `npm run verify:neonoire`,
`npm run verify:shot-order`, `npm run verify:revision:neonoire`, `npm run check:assets`, `npm run typecheck` and the
production build all pass. `verify:neonoire` now also asserts that the lane rule survives in the bundle (337 "no
lanterns, ever") and that 343's board keeps the direction rule (a follower cannot face the camera);
`rewrite-slots.mjs` reads **delivered = 321–342, queued = [343]**.

**Saved workspaces:** the placeholder notes that were still awaiting their pictures at 340, 341 and 342 entered
`pendingNotesHashes` in `src/lib/bundle-refresh.ts`, so a workspace left on the 2 October default receives those
three pictures, their titles, statuses and notes on its untouched cards — nothing else changes, and an edited card
keeps its words. `src/lib/neonoire-scene6-sync.json` was **not** regenerated: the current bundle already contains
scene 14A and must never be shipped as an intermediate.
