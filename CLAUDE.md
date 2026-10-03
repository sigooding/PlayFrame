# PlayFrame

For any NEONOIRE screenplay or storyboard work, read `docs/neonoire/story-bible.md` first (story bible and decision log), then `docs/neonoire/handoff.md`.

`docs/neonoire/baseline/Neonoire_Draft1_2026-09-25.fountain` is Draft 1 as originally written. Diff it against `Neonoire (3).fountain`: any difference not listed in the bible's Part 9 was changed in PlayFrame.

Recorded dialogue and voices: `docs/neonoire/voice/README.md` (voices file, manifest, ingest and animatic scripts). Keep the script unchanged for voice work.

## Latest session — 3 October 2026 (night): the rewrite slots, pass four — 322/322, the board is complete

**One generation, one frame installed: 343 *Forty metres back*, and the film's last placeholder is gone — 322 of 322
keyframes on disk, zero placeholder cards.** The study is the camera behind both cars, the old silver-grey sedan seen
from its **rear** in the near right foreground with its lamps throwing light forward up the wet asphalt, the small
boxy maroon hatchback far ahead as two red points, nobody else on the road. Pass three had thrown the first study away
for taking the follower nose-on to the camera while the followed car showed tail lights, and had written the geometry
down as a rule; the corrected study satisfies it. **`verify:neonoire` now reads owed = `[]`, queued = `[]`, delivered =
321–343 and asserts no placeholder card is left**; `rewrite-slots.mjs` carries the empty queue, `plan.mjs` reads 14A as
all ten on disk, `passes:README.md` reads 322 of 322, and the 343 placeholder-note digest joined `pendingNotesHashes`
(23 digests, 321–343). **343's caveats:** the gap reads long rather than exactly forty metres, both cars' plates show as
small blanks, and the dim nearside-headlight lock can't be judged from behind. Read
[the pass-4 ledger](docs/neonoire/passes/rewrite-slots-4-2026-10-03.md) and the pass-4 section of the handoff.
**The session branch is merged into `main` in this session** — the finished board is on `main`, no history rewritten.

## Previous session — 3 October 2026 (evening): the rewrite slots, pass three

**"If the shot description doesn't make complete visual sense go by the scene's logic and leave note in handoff."**
Ten generations, eight frames installed, two studies thrown away, one slot left open: **321/322 keyframes on disk, the
film's only placeholder is 343.** Delivered: 331 (retaken: single sharp figure — the earlier study carried a second
elderly man, the one after it was blurred), 336 (retaken: the light at the window of the **maroon boxy hatchback** the
script gives Vera, not the SUV the study drew), 338 (retaken: wrapper peeled back, rice bare, no bite), 339 (retaken:
**Vera turns to Jack** — the page's beat is hers), plus new **340** (the watcher's hand on the bar's shuttered handle),
**341** (the arm across her, the umbrella turning to the car) and **342** (the pencil plate **56-19** on the flattened
bag). **337's retake was thrown away for stringing red lanterns down a lane whose canon has none and hiding the clip**
— the pass-2 master stands and `verify:neonoire` asserts "no lanterns, ever". **343's study was not installed**: it
took the following grey sedan nose-on to the camera while the hatchback ahead showed its tail lights, so the board now
fixes the geometry — camera behind both cars, the follower showing its **rear**, forty metres back — and the slot
waits. Read [the pass-3 ledger](docs/neonoire/passes/rewrite-slots-3-2026-10-03.md) and the handoff's seven permanent
scene-logic decisions before regenerating anything in scenes 1 or 14A.

## Previous session — 3 October 2026 (later): the rewrite slots, pass two

**"Continue"** took the head of the queue: scene 1's last three (**331** he refuses, **332** the sedan broadside across
the lane mouth, **333** the old man in the white light) and **scene 14A's first six** (**334–339** — the mirror, the
lane mouth, the lighter, **337 the scene's master**, the rice ball, not running from you). Ten generations, one thrown
away (336's first study came back portrait), everything 16:9 at its stable path; **318/322 on disk, four placeholders
left: 340 and 341–343**. Read [the ledger](docs/neonoire/passes/rewrite-slots-2-2026-10-03.md) before touching scene
14A: the interiors read newer than the scene-31 car (337 is the master to copy, corrected), 336's car reads SUV rather
than the locked maroon hatchback, and **339 leaves Vera looking at the lane instead of turning to Jack** — the retake
candidate. Scene 1's caveats: 331 has a second elderly man in frame, 332 lights the pole, 333 invents a sign and loses
the scooter. The delivered boundary is `scripts/neonoire/rewrite-slots.mjs`; `verify:neonoire` now also gates 14A's
delivered/owed split.

## Previous session — 3 October 2026: the rewrite slots, pass one ("continue next shots")

**Ten generations, ten frames installed, nothing renumbered: the interview room's 321–327** (the form, her
handwriting, the pen that stops, the passport photograph, squared to the corner, no trace, the inside pocket) **and
scene 1's 328–330** (the scrap, the lane and her watch, the red clip), all 16:9 at their stable paths.
**309/322 keyframes on disk, 13 placeholders left** — 331–333 plus scene 14A's 334–343, briefed in
`docs/neonoire/passes/pass-34.md` and `pass-35.md`. The delivered boundary lives in
`scripts/neonoire/rewrite-slots.mjs` and both the builder and `verify:neonoire` read it; the interview frames attach
the room masters (51, 56, the retaken 62) and the cast sheets, the cold-open frames character sheets only. Read
[the ledger](docs/neonoire/passes/rewrite-slots-1-2026-10-03.md) for the ten unclosed caveats (325's wrongly headed
form is the one to close) before regenerating anything in those scenes. **Do not add the current bundle to
`sync-scene6.mjs`'s intermediates** — it already contains scene 14A, and a workspace that deleted the scene would get
it back (that fails `verify:revision:neonoire`).

## Previous session — 2 October 2026 (night): scene 14A, Vera and Jack in the car

The director added **14A** (INT./EXT. JACK'S CAR, KANDA - NIGHT, between 14 and 15) so their closeness is planted before scene 22: she tails his car, they sit out a stakeout, he follows her home. 103 scenes, 322 shots; boards **334–343** are placeholders (next free number **344**), no voices yet. It deliberately names no Sakai or Ishida, never lights the lighter and shows no grey car; `verify:neonoire` guards all three. The pre-14A script is kept as `docs/neonoire/baseline/Neonoire_PreScene14A_2026-10-02.fountain` and saved workspaces on a known default receive the scene (`newSceneIds` in the sync). Read the bible's Part 9 item 17 and the handoff before touching it.

## Latest session — 1 October 2026: Jack's office desk lock, and the card out of the puddle

Jack's office is one room and must never be redrawn. Scenes 10, 11, 18, 21 and 77 all carry
`scripts/neonoire/office-layout-look.mjs`: the **free-standing 1.60 m × 0.75 m worn dark-walnut desk**, banker's lamp at
its **left** end, **exactly one** rotary phone at its right back corner, grey steel cupboard under the window with
nothing on top of it, filing cabinet + CRT and the sofa on the right wall, door lettered the whole word JACK, **never
mirrored, never a second table**. The only room master is `s10/164-depends-whos-calling.jpg`; `s77/85` was rebuilt to
agree with it and no longer leads. Ten generations (the budget) installed seven corrected frames in place — 6/62 (card on
dry laminate, spill confined to the crushed cup), 11/245 (box **out of the cupboard**, no chair), 11/251, 10/166, 10/167,
18/191, 77/87 — and the director authorised the **one scene-11 action line** that moves with it. Dialogue, scene numbers,
asset paths and the 299/102 board are unchanged. A second session the same day spent ten further calls on the six
frames pass 1 queued — 11/252, 77/88, 77/89, 18/283 and scene 21's 196 and 271 — two of those calls being corrections
(an invented second pair of hands inside a "man alone" frame, a third coffee cup in a two-cup scene), and scene 21's
room turned out to be a **mirror** of the master and was un-mirrored. `officeLayoutQueued` is now empty and
`verify:neonoire` guards the lock, the single telephone, the master's status, the card's dry laminate **and that empty
queue**: declaring a frame unfinished takes an edit in the module *and* in its note. The first ledger also claimed
those two scene-21 frames were already `RETAKE PENDING` — they never were; the 30 September pins are scene **20**'s
193 and 194 — and the verifier pins that fact too. Read
[the ledger](docs/neonoire/passes/office-desk-lock-2026-10-01.md) before regenerating anything in this room.

## Latest correction — 1 October 2026: full-page audit and restored 99A

Prior image/export work is committed as `8bfa455`. The complete pre-revision 106-scene source is preserved in `docs/neonoire/baseline/Neonoire_PreRevision_2026-09-29.fountain`; the shipped pre-restoration source is `Neonoire_PreRestoration_2026-10-01.fountain`. Read [the full-page audit](docs/neonoire/passes/revision-restoration-2026-10-01.md). **299/299 images across 102 scenes**: original demolition cards 158/159 are restored inside 99A before the dissolve to 305/306/307, never a revived separate 99. Kaneko's six old stools are explicit before the plaza; the introductions, 25 bonding exchange, 94 tea line and 98 title card are recovered. All rooftop text and the 91 train survive; 85/87/91/92 are unchanged, 86/88/90 add-only.

`verify:revision:neonoire` guards the complete pages and safe saved-template refresh. Three existing takes from 13 are re-pinned to 25; one now-false father recollection is archived, not erased. New corrected 25 speech and restored 94 tea line are unrecorded; no replacement voices were generated. The selected main-image approvals remain intact. Older draft counts/retirement notes below are historical.

## Latest session — 1 October 2026: director-selected main images and animatic export

The director selected the final nine and the corrected drawer/run sequence as **Ready/main images, with no review queue**. Seven replacements installed (7/64,65,67; 73/69,70,71; 75/80). Retain the matching one-shoe exit/puddle pair, not the rejected new shoe studies. Only the explicitly authorised drawer/forward-route sentences changed in the Fountain; dialogue and score are unchanged. See bible Part 9 item 11 and [current delivery](docs/neonoire/passes/director-continuity-animatic-2026-10-01.md).

The app now exports real MP4s through Export → Animatic playback, using the existing FFmpeg script with saved snapshots, scene/shot order, static cameras, timing/audio controls and progress/download/cancellation. `verify:animatic` and `verify:animatic:browser` cover it. Set `FFMPEG` or install FFmpeg; outputs in ignored `exports/animatics/`. Previous draft wording below is superseded for selected main images; the older rewrite pins are separate.

## Latest session — 1 October 2026: final nine images and screenplay order

**Nobody's Witness** has **297/297 shot images across 102 active scenes**, zero missing-image cards. The final nine (298/299/300/302/310/311/313/314/320) are fresh **draft** studies; 311 used a corrective retake. The **16 older rewrite retakes remain Needs review**. Read [the final pass and its full-size continuity caveats](docs/neonoire/passes/remaining-boards-final-2026-10-01.md) and the updated bible/handoff before more generation; historical missing/master queues below are superseded.

Storyboard, shot list, player, shared view, prompt batches and CSV/print are now in screenplay scene order, with quoted-beat coverage interleaved by the builder. Original shot numbers/scene insert labels/IDs/filenames remain fixed. Saved reads fill untouched marked blanks and migrate only exact legacy default ordering, preserving writer edits and intentional blanks. Cross-scene reordering is blocked; edits inside a scene persist. New/duplicate shots get distinct production numbers. The screenplay and voice files were not changed.

`npm run verify:shot-order` is the ordering/import/migration/rendered-view/export regression. The rebuilt bundle and all feature/assets/type checks pass. `verify:shot-order:browser` and `verify:features:live` also pass on the production preview (port 3000), including real desktop/mobile interactions; no screenplay or audio changes.
