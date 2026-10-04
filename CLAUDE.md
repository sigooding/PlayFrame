# PlayFrame

For any NEONOIRE screenplay or storyboard work, read `docs/neonoire/story-bible.md` first (story bible and decision log), then `docs/neonoire/handoff.md`.

`docs/neonoire/baseline/Neonoire_Draft1_2026-09-25.fountain` is Draft 1 as originally written. Diff it against `Neonoire (3).fountain`: any difference not listed in the bible's Part 9 was changed in PlayFrame.

Recorded dialogue and voices: `docs/neonoire/voice/README.md` (voices file, manifest, ingest and animatic scripts). Keep the script unchanged for voice work.

## Latest session — 4 October 2026 (relief pass one): the next ten shots, 344–353 — the board runs to 353

**"Create next 10 shots" took the head of the now-empty board: the two beats the retake round left unboarded (scene 59's INTERCUT to Mrs. Sakai's empty house, scene 94's door closing) and the first five rows of the voiced animatic's coverage list, one new frame per long-talking board.** Ten generations, ten frames installed at their stable paths, nothing replaced, nothing renumbered — **332/332 keyframes on disk, 0 placeholders, `RETAKE PENDING` 0.** 344–347 are the INTERCUT in the page's own order (the kotatsu, the altar, the teacup, the phone; the "sound off" beat rides inside the room wide — a bare television screen has no business as its own still), the house held to the scene 29 masters with the people removed, all 35mm across the cut; 348 is the door, 50mm at the door, the hinge between 142 and 143; 349–353 are Vera on the wall of drawings (s14), Kaneko's bowl (s17), the storeroom bulb (s20), Jack making himself smaller (s20) and Vera's single (s22). Every frame reviewed at full size before install; each caveat is honest and in its board note. **The one to know: 344's altar photograph reads a different face than the locked `s1/07-old-man.jpg` man 345 holds** — the retake call hit the ten-generation limit and did not fire; 344 is the head of the next pass's queue, then scene 23's 199 (95 s, the film's longest single board), then scene 25's 202/258, scene 27A's 292 and scene 29's 273, all still standing in `docs/neonoire/shots-needed.md`. Boundary module `scripts/neonoire/animatic-relief.mjs`; the verifier asserts 332, the run 241–353, scene 59 playing 344–347 before 228, scene 94 playing 141–143 then 348, and scene 20's new order 309, 193, 194, 352, 284, 351. Next free number **354**. Ledger: [passes/animatic-relief-1-2026-10-04.md](docs/neonoire/passes/animatic-relief-1-2026-10-04.md). Branch `arena/01a1076a-playframe`, merged to `main`.

## Previous session — 4 October 2026 (third pass): visual inspection and audit of the retake queue's ten frames

**Visual sign-off and scene consistency audit of the retake queue's ten final frames (113, 131, 132, 141–143, 160, 161, 186, 228).**
Under the standing instruction *"if shot description don't make complete visual sense go by the logic of the scene, keep character and scene consistancy, make sure any original image replaced is backed up and then merge with main"*, the ten frames were examined across the review contact sheets and against character/location canon:
1. **113** (Vera close-up; architectural model with empty white plaza and painted figures, no old block/fountain).
2. **131** (stairwell insert; her hand reaching down and pulling Jack upward).
3. **132** (old woman's room with sumo on CRT television, pointing to open door; no landing/torch).
4. **141** (24mm wide exterior; black sedan at kerb, open door showing amber interior, empty cast, one lit window above).
5. **142** (85mm close-up; Ishida paused in rain looking up at lit window, no tie).
6. **143** (50mm two-shot; tea cup offered, watch with silver mesh strap on Kurose's wrist).
7. **160** (Kaneko's counter; Jack on stool 2, stool 3 empty, noren stirring, 金子 sign on wall).
8. **161** (hold on the three of them; Vera on stool 3 in teal coat with red bird clip, overpaid money on counter).
9. **186** (24mm exterior day; hoarding cleanly lettered KUROSE DEVELOPMENT with painted plaza, raining).
10. **228** (green payphone under tin awning; Jack on phone, Vera emerging glowing from Hive entrance).

All 10 replaced studies remain archived in `public/images/neonoire/archive/` (`--v1`–`--v3`). `RETAKE PENDING` is 0; 322/322 keyframes on disk, 0 placeholders. Branch `arena/01a10760-playframe`, merged to `main`.

## Previous session — 4 October 2026 (second pass): the retake queue is closed — ten frames, and the film's last one

**"Continue with next 10 shots" took the rest of the queue and then one frame the queue had missed.** The nine
standing `RETAKE PENDING` pins (113, 131, 132, 141–143, 160, 186, 228) **plus scene 100's 161** — the film's last
frame, which the rewrite had left playing a retired ending with no pin on it — were regenerated onto the current
screenplay text, installed over their own filenames and released: **ten generations, ten frames, `RETAKE PENDING`
9 → 0, 322/322 keyframes, 0 placeholders.** Five of them were decided on the scene's logic rather than the board's
old wording: **141** is now a 24mm wide at the kerb (an empty cast cannot be a two-shot), **131**'s hand runs hers to
his, **132** lost its stair landing and torch for the sumo television and the pointing hand, **160** is the counter
before she sits (Jack on the second stool, the third empty) and **161** is the hold on the three of them, and
**186**'s hoarding carries KUROSE DEVELOPMENT alone — TOMORROW'S TOKYO died with scene 97. **113 keeps its close-up
against the revision's own wide rule; that is the call most worth a director's reversal.** Every replaced study was
archived (`--v1`–`--v3`) and committed **before** the new frame went over it, and `verify:neonoire` asserts each
backup exists. Read [the ledger](docs/neonoire/passes/retake-queue-2026-10-04.md) and the handoff's new Current
section. **Caveat: no full-size visual review was possible in this session** — the frames were checked mechanically
(1920×1080, no letterbox bars, luminance by scene) and the contact sheets are in `reviews/`. Two coverage
observations, not fixed: scene 94's door-closing beat has no frame, and scene 59's INTERCUT to Mrs. Sakai's empty
house is not boarded. **Branch `arena/01a10706-playframe`, merged to `main`.**

## Previous session — 4 October 2026 (first pass): the cold open's five — the 2 October pins released, queue down to nine

## Previous — 4 October 2026 (first pass): the cold open's five — the 2 October pins released, queue down to nine

**"Continue with next shots" took the retake queue's head: scene 1's five frames the 2 October rewrite pinned —
3, 6, 7, 9, 10 — regenerated onto the restored walk and lane, installed over their own filenames and released;
five generations, five frames, nothing thrown away. `RETAKE PENDING` 14 → 9, 322/322 keyframes, 0 placeholders.**
3 is Mara **mid-walk** with the lit phone (the walk is back); 6 is the recess with **the scooter and the stacked
beer crates** in front of her; 7 is the **grey flat cap and cheap raincoat** arriving from the road; 9 is the stop
with **the face fully readable** — the same beat as 331 from the other side; 10 is the **black car broadside across
the lane mouth**, the men walking in, the old man down. The round's rule: character sheets **plus the street master
`s1/01-backstreet.jpg`** as the lane's geography (and the installed 331 for 7/9, 332/333 for 10) — written into
`cold-open-fresh-look.mjs`. **10's two caveats want a director's eye:** the men read as full face coverings rather
than the locked knit cap + lower-face mask, and the blocking car reads van-like. Read
[the ledger](docs/neonoire/passes/cold-open-retakes-2026-10-04.md) and the handoff's new Current section, which
also lists the three **superseded board wordings** (228's embrace, 186's banner, scene 89's noise barrage) the
remaining nine pins must be fixed with. `verify:neonoire` gained the release assertions and corrected a stale
expectation: shot 3's brief must now **ask for the walk** (the 2 October rewrite restored it); the pole snag (17)
and flashlight drift (18) stay prohibited. All checks pass. **This session's branch is `arena/01a10451-playframe`**
— older handoff text naming other arena branches is historical; `node_modules` vanishing mid-session is the
documented sandbox symptom, and `npm ci` alone recovers it when HEAD matches origin.

## Previous session — 3 October 2026 (night): the rewrite slots, pass four — 322/322, the board is complete

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
