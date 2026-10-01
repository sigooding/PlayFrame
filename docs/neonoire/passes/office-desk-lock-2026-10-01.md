# NEONOIRE — Jack's office desk lock, and the scene 6 card (1 October 2026)

Director's note, verbatim: *"in scene 6 the card is in the coffe puddle, in scene 11 jacks office he pulls a
box off of nothing. maybe it can be in the cupboard in his office instead. also jacks office desk keeps
changing sizes. redo the shots to keep consistancy."*

Two named frames were wrong and one fault was systemic. All three are fixed here, and the systemic one now
has a guard, because a note nobody can run is a note that gets re-broken next session.

## Why the desk kept changing

Jack's office is boarded in five scenes — 10, 11, 18, 21 and 77 — and it was generated **as a chain**. Each
board told its frames to follow the last picture that happened to exist: scene 10 followed `s77/85`, scene
11's wide followed `s10/164`, scene 11's phone call followed `s11/243`, scene 21's coverage followed
`s21/194`. Every link re-drew the room from a photograph of a picture of the room, so the desk shrank a
little at each step (1.6 m → 1.2 m → 0.9 m), the wood went walnut → honey → red-brown, and one study
(`s77/85`) mirrored the whole room, sofa to the wrong wall. Nothing was "wrong" alone; the chain was wrong.

The fix is not a new master image, it is one **prose lock that every office frame carries** — the look
`scripts/neonoire/office-layout-look.mjs` — and one room master: `s10/164-depends-whos-calling.jpg`.
`s77/85` has been retaken to agree with it and no longer leads anything. The lock, in brief:

> **DESK — LOCKED.** One room, never mirrored, one table only. The desk is free-standing in the middle of the
> room, long side parallel to the window wall, **1.60 m × 0.75 m × 0.73 m**, worn **dark walnut**, satin lacquer
> scarred by cup rings, square legs, modesty panel, two shallow drawers at the right end. Never
> honey-blond, never narrow, never against a wall, never a second table. Banker's lamp permanently at the
> **left** end; **exactly one** black rotary telephone at the **right back corner**. Grey steel cupboard under
> the window, **nothing on top of it**; filing cabinet with the small CRT on the right wall, samurai film
> playing and never static, sofa beyond it; the door at the left of the window hand-lettered the whole word
> **JACK**.

## What was regenerated — 10 generation calls, and the ten is the budget

Installed in place at stable paths, 1920×1080 full-bleed through `scripts/neonoire/fresh-install.mjs`. No
shot renumbered, no file renamed, no image added or removed: the board stays at 299 frames / 102 scenes.

| Scene / shot | Frame | Was | Now |
| --- | --- | --- | --- |
| 6 · 62 | `s6/62-the-card.jpg` | Ishida laying the card **into the spilled tea** — a card in a puddle would pulp, and the audience reads a stain instead of a name | The spill is one pool around the crushed cup at Vera's side, exactly where 60 and 61 leave it; the card travels on **dry laminate**, crisp, his fingers on its edge |
| 11 · 245 | `s11/243-the-box.jpg` | Jack on a chair, arms up, taking a box off **thin air** — there was nothing above him but ceiling | He is on one knee at the **open grey steel cupboard** under the window, drawing the dusty box out from the shelf behind the binders |
| 11 · 251 | `s11/249-the-line.jpg` | A narrow honey table that matched no other office frame | The locked 1.60 m walnut desk, broadside, lamp left, one phone right |
| 10 · 166 | `s10/164-depends-whos-calling.jpg` | 1.2 m honey desk; the door lettered only **JAC**; a second phone appeared on the first retake | The locked desk as the **room master**; the door spells **JACK**; one telephone, after a corrective pass |
| 10 · 167 | `s10/165-face-up.jpg` | Overhead of a small rounded honey table | Overhead of the same wide walnut top, ring marks, straight near edge, drawers at the right end |
| 18 · 191 | `s18/189-after-the-last-train.jpg` | No banker's lamp in the room at all, narrow desk, unlettered door | Lamp present **and unlit**, locked desk, door reads JACK |
| 77 · 87 | `s77/85-the-desk-lamp.jpg` | **Mirrored room** — sofa on the left wall, desk end-on and narrow | Retaken to agree with the master: door left of the window, cupboard under it, cabinet + CRT and sofa on the right, wide walnut desk |

Two generations were thrown away rather than installed: the first `s10/164` (a second table grew beside the
sofa, and the banker's lamp moved onto it) and the first `s11/243` (the cleanest box-from-the-cupboard
staging in the set, but still the old narrow honey desk). The doubled telephone in the master's second pass
was corrected by a third call. The alternates stay in the session scratch directory, not in the repo.

## The one screenplay line that moved (director-authorised)

Scene 11 read: *"Jack stands on a chair and takes down a cardboard box from the top of a cupboard."* A box
on top of a cupboard is what the frame could not show honestly: the cupboard under the window is waist-high,
so "standing on a chair to reach the top of it" was a stage direction the room does not have. The director
chose the cupboard, so the action line now reads:

> *"Jack crouches at the grey steel cupboard under the window, pulls its door open and takes out a cardboard
> box he has kept behind the files. Dust on the lid. He hasn't opened it in years."*

That is the whole change: **one action line in scene 11**. No dialogue, no voice line, no scene added,
removed or renumbered, and nothing else in the Fountain touched — `npm run split:neonoire` rebuilds all 102
pages from the draft byte for byte and the builder still refuses any board quote that is not in the script.
The scene 11 contents are unchanged (notebook, old ID card, clipping), and scene 14 already said the box
lived *in* the cupboard — "Once in a box in his own cupboard" — so this makes the film agree with itself.
Recorded dialogue is untouched: 333 takes still line up, and none of them speak the line that moved.

Scene 6 needed no script change at all. The draft's *slides his card across the wet table* stands: a wet
table is a sheen, not a pool, and the card is what Vera takes away, so it must come off dry.

## What this pass deliberately did not finish

The house rule is ten generations a session and the budget is spent. Six office frames still disagree with
the lock; they are named in `officeLayoutQueued` and each says **QUEUED** in its own board note, so the next
session inherits a list instead of an archaeology:

- **11 · 252** `s11/250-the-lighter.jpg` — the wood inside the lamp pool is still old honey. Hands-only
  insert: the desk's edge is out of frame, so it cannot contradict the size, only the colour.
- **77 · 88** `s77/86-the-clean-envelope.jpg` — the opened drawer must be one of the desk's own two shallow
  drawers, not a cabinet drawer.
- **77 · 89** `s77/87-he-writes-nothing.jpg` — same desktop, closer; redraw the lamp and the wood on the master.
- **18 · 283** `s18/283-the-letter.jpg` — the letter insert reads redder and wider than the master.
- **21 · 196 and 21 · 271** `s21/194-…jpg`, `s21/271-not-yet.jpg` — the big red-brown table this scene invented.
  These two are **already** pinned `RETAKE PENDING` for the 30 September rewrite, so they retake once, onto
  the lock, with their rewrite fix — not before it, and not twice.

`verify:neonoire` now fails if any of the 17 office frames loses the lock in its notes, if the lock stops
naming one telephone, if the master stops declaring itself the master, if `s77/85` claims to lead the room,
if shot 62's card is allowed back into the puddle in either the brief or the note, or if a queued frame
stops saying it is queued. That is what "keep consistency" costs, and it is now cheap.

## Honest caveats

- These remain **AI-generated draft studies at status Draft — storyboard continuity, not production
  approval**. Nothing here is a finished frame; nothing here was approved by this pass.
- In 245 the desk's near edge crosses Jack's knees: on set, raise the camera ~20 cm or pull two feet right
  so the cupboard and the box read clear of the desktop. The blocked action is right; the lens height is a
  note for the take.
- 245's first retake in September chased a chair-footing problem that the new blocking dissolves — there is
  no chair in the business any more, which is why the old `on the chair seat` verifier line is gone.
- Jack's hands in 196 still read older than 48 (the 29 September caveat stands); a hand double is a
  production fix, not an image fix.
- The lamp in 191 is present and off per the director's rule of 26 September; at small sizes its green
  glass reads faintly luminous. Judge it at full size before waving it through.
- Every image kept its exact filename, path and ID, so saved workspaces, prompts, CSV, the player and the
  animatic all still resolve; the animatic will now render the corrected frames with no other change.

[Review sheet: before / after, seven pairs](../../../public/images/neonoire/reviews/office-desk-lock-2026-10-01.jpg)
