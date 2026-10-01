# NEONOIRE — Jack's office desk lock, and the scene 6 card (1 October 2026)

Director's note, verbatim: *"in scene 6 the card is in the coffe puddle, in scene 11 jacks office he pulls a
box off of nothing. maybe it can be in the cupboard in his office instead. also jacks office desk keeps
changing sizes. redo the shots to keep consistancy."*

Two named frames were wrong and one fault was systemic. All three are fixed here, and the systemic one now
has a guard, because a note nobody can run is a note that gets re-broken next session. The office queue this
ledger opened was worked off in a second session the same day — **15 frames rebuilt in twenty-two calls**, ten per
session — and its own closure is recorded under "What pass 1 left open" below, together with a correction of a
claim this file made wrongly.

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

## What pass 1 regenerated — 10 generation calls, and the ten is the budget

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

## What pass 1 left open, and pass 2 closed the same day

The house rule is ten generations a session, and pass 1 spent them. Six office frames still disagreed with the
lock, so they were named in `officeLayoutQueued` and each said **QUEUED** in its own board note — the next
session inherits a list, not an archaeology. That next session ran the same day: **ten further calls** (two of
them corrective) closed all six, and `officeLayoutQueued` is now empty.

| Scene / shot | Frame | Was | Now |
| --- | --- | --- | --- |
| 11 · 252 | `s11/250-the-lighter.jpg` | honey wood inside the lamp pool | the locked worn dark-walnut top, pale cup rings under the light |
| 77 · 88 | `s77/86-the-clean-envelope.jpg` | a rounded-corner honey table, and the open drawer read as a cabinet drawer | the locked walnut desktop, the open drawer one of the desk's own two shallow ones at the **right** end of the riding rail, envelopes inside |
| 77 · 89 | `s77/87-he-writes-nothing.jpg` | **mirrored room** — sofa and filing cabinet on the left, CRT showing snow | the master's geography left to right, and the CRT carrying the muted samurai film, never static |
| 18 · 283 | `s18/283-the-letter.jpg` | a redder, wider-than-the-master top | the locked top from overhead; the letter, its envelope and the hands unchanged |
| 21 · 196 | `s21/194-he-holds-it-without-drinking.jpg` | cabinet and chair on the wrong side of the window; the first retake also put a second pair of hands in a "man alone" frame | un-mirrored room, lamp unlit at the desk's left end, Jack alone, two cups and no more |
| 21 · 271 | `s21/271-not-yet.jpg` | lamp at the wrong end of the desk, red-brown wood; the first retake grew a **third** coffee cup | lamp at the desk's left end, locked walnut, exactly two cups, one before each of them |

Two calls went to corrections rather than to new frames — the invented second pair of hands in 196, and the
extra cup in 271 — because a prop count is a continuity error too, and this film already has a standing
perspective check for exactly that.

### Correction to this ledger's first draft

Pass 1 claimed scene 21's 196 and 271 were "already pinned `RETAKE PENDING` for the 30 September rewrite, so
they retake once, onto the lock, with their rewrite fix". **That was wrong.** The 30 September pin list holds
scene **20**'s shots 193 and 194 (`s20/191-prove-it.jpg`, `s20/192-the-red-bird-clip.jpg`) among sixteen
others; `scripts/neonoire/rewrite-pending.mjs` never named scene 21, and 196 and 271 were plain `Draft`. There
was no "retake twice, in the right order" problem to solve — and the two scenes' names are easy to confuse,
which is presumably how I wrote it. `verify:neonoire` now asserts the fact in both directions (scene 21 not
pinned, scene 20's pair pinned), so the ledger cannot quietly repeat the mistake.

### What the queue closing bought

`verify:neonoire` fails if any of the 17 office frames loses the lock in its notes, if the lock stops naming
one telephone, if the master stops declaring itself the master, if `s77/85` claims to lead the room, if shot
62's card is allowed back into the puddle in either the brief or the note, if a frame says `QUEUED for the
desk lock` without being named on the list, or if a frame named on the list stops saying so. The list being
empty is itself asserted: reopening it means editing `office-layout-look.mjs` *and* the note, in the open.

One more guard came out of the corrections, because both of them lived where the guards could not see them: a
board's **header prose**, everything above its first `---`, never reaches `frame.notes`, so scene 77 went on
promising that 88 and 89 were queued, and scene 11 went on calling 252 held-and-queued, a full day after those
frames were installed. `verify:neonoire` now reads the six office board *files* — while the module's queue is empty
no office board may describe an open one, and a board that owns a queued frame must still carry the marker — and it
was tested by putting the stale sentence back, which fails with the file named. Header prose is where notes go to
rot; now it is checked at the file level too.
That is what "keep consistency" costs, and it is now cheap.

[Queue review sheet: six pairs, before / after](../../../public/images/neonoire/reviews/office-desk-lock-queue-2026-10-01.jpg)

## Pass 3 — the five frames the lock never touched (same day, two calls)

The queue guard can only see the frames that were *listed*. Every check `verify:neonoire` runs on the office reads
**notes**, and a frame that was never queued never needed a note changed, so its pixels were never re-examined. An
audit of the five office frames the lock had not retouched is the difference between "the queue is closed" and
"the room is locked", and it found:

| Frame | Verdict on inspection |
| --- | --- |
| `s10/242-down-the-stairs.jpg` (10/244) | stairwell landing, **no desk in frame** — nothing to fix |
| `s21/193-footsteps-on-the-stairs.jpg` (21/195) | stairwell with the frosted door, **no desk** — nothing to fix |
| `s10/166-by-its-edges.jpg` (10/168) | **compliant**: walnut top with cup rings, lamp at the left end, phone on the back edge right of it, binders on the cupboard, CRT showing the film at right |
| `s11/244-daniel-voss-41.jpg` (11/246) | **off-lock**: light honey-oak top, no cup rings — retaken |
| `s11/167-two-men-laughing.jpg` (11/169) | **off-lock**: warm reddish wood, scratch field instead of ring marks — retaken |

Both inserts were edited for the wood and nothing else, which is also how their legibility survived: 246's headline
and its `DANIEL VOSS, 41` caption were re-read at full size after the edit. They are a matched pair — the
photograph lies on the same clipping in 169 that *is* the frame in 246, and 246's note has always said "the black
notebook matches shot 169" — so retaking one without the other would have moved the fault rather than closed it.

### And the lock itself was wrong twice, about its own master

While reading the frames against `s10/164`, two clauses in `officeLayoutLook` turned out to over-specify the
picture they claim to describe: it pinned the telephone to the desk's **right back corner** when the master has it
on the **back edge right of the lamp**, and it said the steel cupboard has binders and a folder stack at its right
end *and* "NOTHING on top of it" — which contradicts itself, since the binders are on top. Twelve frames had been
drawn to the words and none to the master, which is the same chain-of-copies fault the lock exists to end. The
wording moved to match the master rather than fourteen frames moving to match the wording; the rule that actually
bites is unchanged (`exactly ONE black rotary telephone`, and never anything on the cupboard that a scene has to
reach up for, which is the scene 11 box). Recorded in `b983379`.

### The near-miss worth repeating

While pass 3 was being patched, a single missing `+` at a line break in the look module let automatic semicolon
insertion **end the constant mid-sentence**. Six hundred and sixty-four characters — the entire RIGHT WALL, the door
lettering, the room master — silently dropped out of every office note and every generation prompt, and every
`frame.notes.includes(detail)` assertion in the verifier kept passing, because they all check *substrings of the
surviving prefix*. One unrelated assertion caught it by accident. `verify:neonoire` now pins the lock's ending and
length, not only its phrases, and was tested by deleting the `+` again:

```
AssertionError: the office lock ends mid-sentence — a line break in office-layout-look.mjs lost its + (ASI truncates the constant)
```

[Insert review sheet: two pairs, before / after](../../../public/images/neonoire/reviews/office-desk-lock-inserts-2026-10-01.jpg)

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
- From pass 2, **and a second correction to this ledger**: it first recorded that 21/196's retake "dropped
  Jack's coat from the chair back" and justified restoring it by claiming the coat is a scene-21 story object
  with a put-it-on-before-he-goes-up beat. **No such action line exists** — scene 21 gives Jack's coat no
  business at all (its only coat line is Vera keeping hers on), and the inside-pocket line I half-remembered
  is scene 22 at the noodle counter. Opening both frames at full size settled it: the coat was not dropped, it
  **moved from the chair back onto his shoulders**, worn over the creased shirt, and 21/196 and 21/271 agree
  with each other. The defect was in the notes — 271 promised the chair back "as it does" in 194 — and the
  notes are now corrected. That is two invented justifications in one task, both caught by reading the file
  instead of trusting the memory of writing it, and both now guarded: quote the script, never the recollection.
- From pass 2: in 77/89 the pen nib still sits very near the paper. The board's performance note ("he writes
  nothing") is the fix; on set it is a hand position, not a redraw.
- From pass 2: in 11/252 the desktop fills the frame, so that insert can no longer be used to *check* the
  desk's width — only its colour and its ring marks. The size lives in 10/164, 11/251, 18/191 and 21/196.
- Every image kept its exact filename, path and ID, so saved workspaces, prompts, CSV, the player and the
  animatic all still resolve; the animatic will now render the corrected frames with no other change.

[Review sheet: before / after, seven pairs](../../../public/images/neonoire/reviews/office-desk-lock-2026-10-01.jpg)
