# Cold open — fresh pass (30 September 2026)

**Director's order: redo the cold-open shots from scratch.** Not as a guide for this pass — the
screenplay is. Every generation in this pass attaches **character sheets only**
(`sheets/mara.jpg`, `sheets/mara-face.jpg`, `sheets/masked-man.jpg`, plus the two sheets the pass
created, `sheets/sakai.jpg` and `sheets/journalist.jpg`); frames with no cast attach nothing at all.
The shared street and bar descriptions live in
[`scripts/neonoire/cold-open-fresh-look.mjs`](../../scripts/neonoire/cold-open-fresh-look.mjs)
(`freshStreet`, `freshBar`, `freshCast`, per-shot prompts in `coldOpenFreshShots`); the builder and
verifier read `coldOpenFreshCompleted` from the same file. Raw generations and the pre-pass frames
stay under ignored `artifacts/cold-open/`; installed frames are centre-cropped to exact 16:9 and
resized to 1920×1080 by `scripts/neonoire/fresh-install.mjs` (never stretched, and never a crop of
a legacy frame).

## Why the old frames kept coming out wrong

Every previous retake was generated image-to-image from the frames or masters it was meant to fix,
so each pass inherited the last pass's drift: Mara vanishing from the recess, the sedan turning in
a lane too narrow for it, a missing body, a bar sign at both ends, a journalist whose jacket changed
between shots. This pass breaks the chain: text-only scene briefs, identity from the cast sheets.

## New cast sheets (batch 1)

- `sheets/sakai.jpg` — SAKAI, 70s: slight, thin grey-white hair, translucent beige plastic raincoat
  hood down over cream shirt and brown cardigan, dark trousers, black shoes, one hand at his side.
  Three turns plus a framed head close-up, house sheet layout.
- `sheets/journalist.jpg` — THE JOURNALIST (Kondo), mid-40s: ordinary, thinning black hair, thin
  round wire-rimmed glasses, rumpled charcoal-grey wool jacket over a pale blue open-collar shirt,
  grey trousers, worn brown shoes. One wardrobe for every frame he is in.

## Delivery log

| batch | date | frames | status |
| --- | --- | --- | --- |
| 1 | 30 Sep 2026 | sheets/sakai.jpg, sheets/journalist.jpg, shots 1–8 | installed 1920×1080 at the stable asset paths |
| 2 | 30 Sep 2026 | shots 9–17 | installed 1920×1080; shot 18 re-queued (see below) |
| 3 | 30 Sep 2026 | shot 18, shots 19–27 | installed 1920×1080; the bar frames carry `sheets/kanda-bar.jpg` (night panels) by the director's override |
| 4 | 30 Sep 2026 | retakes 20, 22, 24, 26; shots 28, 280–282 | installed 1920×1080 — **the pass is complete: all 31 cold-open frames are fresh** |

## Batch 2 review notes (9–17, frame by frame at full size)

- **9** — Sakai from behind, stopped mid-lane; the headlights are only a glow on the wet road and
  his long shadow; no car, no beam, no face.
- **10** — he folds onto his side in the black water just outside the barbershop recess; no flash,
  no blood, no weapon; Mara a silhouette deep in the recess shadow at frame edge.
- **11** — both hands over her mouth in the doorway dark; wet hair, cold skin, clip unlit; the
  vending glow out of focus in front of her.
- **12** — the masked man on the earpiece, eyes only above the mask, bored; the sedan waits at the
  mouth with beams down the lane; no bar sign in this direction; Mara faint in the recess.
- **13** — the sedan at the mouth showing its rear, red smearing on the wet road, the alley falling
  dark; Sakai's body in the black water mid-lane and Mara a dark shape in the recess — the two
  findings the 29 September review flagged are closed. **Caveat, logged not spent a generation on:**
  the taillight reflection in the water beside Sakai's head can read as blood at a glance; it is a
  reflection of the car's lamps. Director's call whether to retake.
- **14** — Mara kneels beside him with the dead phone in shaking hands; the handbag still on its
  strap; his face turned up to hers; distant and non-graphic.
- **15** — the two hands only: his grip folding her fingers over the key; rain rings on the asphalt.
- **16** — the coin-locker key on its worn oval tag and **114 legible at full size**, closing the old
  87 art mismatch with the script; rain on metal and skin; nothing else from the bag.
- **17** — she runs toward the lit bar sign at the far end with no bag on her; the torn strap looped
  on the barbershop pole and the purse in the puddle at its foot hold the end of the frame.

**Shot 18, moderation note:** the first attempt (masked man kneeling over the body, searching the
coat) was blocked by the image service's content moderation, and the retry spent the turn's last
call on the limit. The queued composition is the house's standing moderation-safe one: the torch
beam on the purse in the water is the subject, the searching man stands small and distant by the
sedan, and no body is in frame.

## Batch 3 review notes (18–27, frame by frame at full size)

**The director's override applied:** every bar frame attached `sheets/kanda-bar.jpg` (night panels)
as the room reference, with the character sheets for cast. The room now matches its sheet: counter
and red-brown stools left, amber shelves with menu strips, rain-streaked window right, CRT above
the rear doorway, crates and the half-open back door at the far end.

- **18** — the beam on the purse in the puddle is the subject; the masked man small and distant by
  the sedan; no body in frame. The moderation-safe composition landed first time.
- **19** — the room established empty, exactly the sheet's geometry; CRT variety show on, back door
  half open with its thin warm light; nobody behind the counter.
- **20** — the journalist's wardrobe, glasses, untouched beer and strapped brown notebook all lock
  to his sheet. **Caveat, retake queued:** he sits at a window table; the screenplay seats him on a
  stool at the counter (24's shoes beneath his stool, 26's tipped stool).
- **21** — Mara in the doorway with the rain falling through the open door behind her; soaked hair,
  clip, no handbag; the room holds.
- **22** — he half rises, glances, looks away; Mara small in the doorway behind; beer and notebook
  still in front of him. Same table caveat as 20; retake queued with it.
- **23** — she crouches behind the far end of the counter with her back to the shelves, the key open
  in her palm, unlit; no handbag.
- **24** — **retake queued:** the journalist's legs read detached under the stool (trousers ending
  at the seat), and the CRT's blue wash on the ceiling is missing. The crate of bottles and the low
  angle are right; the figure geometry is not.
- **25** — shoes and hems only: two wet black pairs in, the journalist's brown shoes shifting by the
  stool base; no faces, no full figures.
- **26** — the tipped stool and the laughing variety show on the CRT carry the joke. **Retake
  queued:** the hand on the floor wears a cream cuff (his wardrobe is pale blue shirt, charcoal
  jacket) and lies by the window wall rather than the far side of the counter; the CRT's caption
  strap is gibberish type.
- **27** — a gloved hand takes the strapped brown notebook from beside the journalist's other hand;
  the second pair of shoes waits turned toward the back door; no faces, no detached shoes.

**Retake queue after batch 3:** 20 and 22 (stool seating at the counter corner, same wardrobe),
24 (shoes and trouser hems under the stool with the ceiling's blue wash, no detached legs), 26 (the
hand at the far side of the counter in his locked cuff, gibberish caption off the CRT), then 28 and
the coverage 280–282. Eight generations.

## Batch 4 review notes (the retakes and the last frames)

- **20 (retake)** — he now sits on a round red-brown stool at the counter's far corner, beer and
  strapped notebook on the boards in front of him, checking his watch. The table is gone.
- **22 (retake)** — he half rises from that same counter stool; Mara small in the doorway behind;
  beer and notebook unmoved. 20 and 22 and 24 and 26 now seat him in one place.
- **24 (retake, twice)** — the legs are anatomically continuous under the stool seat and the CRT's
  blue wash reaches the ceiling. The first retake carried legible KIRIN beer labels on the crate;
  the brief forbids legible brand names, so it was regenerated unbranded in the same session.
- **26 (retake)** — the tipped stool and the laughing variety show, clean picture with no caption
  strap; the hand on the boards at the far side of the counter in his pale-blue cuff and charcoal
  sleeve.
- **28** — her face between the CRT blue and the bottle amber, palm flat on the clinking crate; the
  clip catches its faint highlight. The scene's last photographed beat before the titles.
- **280 (retake, twice)** — the scrap now reads Kanda 2-3-1 and 1:00 in her handwriting, legible at
  full size; the first attempt's address named Shinjuku's Kabukicho, the wrong ward for a meeting
  in Kanda, and was regenerated in the same session. Wardrobe and strap carry from the sheet.
- **281** — the POV to the bar end with no references attached at all: recess and unlit pole and
  vending machine in the foreground, the small lit BAR sign the only warm light at the end.
- **282** — low on the asphalt, his face turned up to hers in the rain, both sheets carrying; no
  blood, no weapon, the unlit pole deep behind.

## Closeout

**All 31 frames of the cold open — shots 1–28 and the coverage 280–282 — are fresh-pass
generations at 1920×1080 on their stable asset paths**, every one generated from the screenplay
text with character sheets (and, by the director's override, the bar sheet's night panels in
scene 2) as the only references. `coldOpenFreshCompleted` carries all 31 numbers; the builder gives
them fresh-pass provenance and the verifier checks it. The standing 29 September review findings
are closed except the one logged caveat on 13 (taillight reflection beside Sakai's head can read as
blood at a glance) — the director's call whether to spend a generation on it. Final review sheet of
all 31 in story order: `reviews/cold-open-fresh-final-2026-09-30.jpg`.

**APPROVAL — 30 September 2026: the director approved all 31 frames as the film's main images.**
The builder now gives them status **Ready** and their notes carry the approval; the verifier asserts
the Ready status on every fresh-pass frame. The rest of the board remains draft studies.

## Batch 1 review notes (frame by frame at full size)

- **1** — the lane, the barbershop recess with its unlit pole, the vending machine opposite and the
  small lit BAR sign at the far end all read in one frame; no people. The pole catches a faint
  highlight; carry the standing on-set caveat (dress it dark).
- **2** — the vending insert holds its own generation this pass (no crop of the master); rain
  columns through the cold white face, no people.
- **3** — Mara's soaked hair, red bird clip, folded arms and white trainers carry from the sheet;
  the jacket reads dark indigo in the sodium light.
- **4** — the phone screen reads VERA; screen light on a three-quarter face, street out of focus.
- **5** — the phone goes into the open bag; strap right shoulder to left hip, intact.
- **6** — she presses into the recess; the pole fixed at the recess's right edge, unlit.
- **7** — Sakai passes the doorway with his hand at his side; Mara reads in the recess shadow; his
  glance flickers and leaves. First frame using the new Sakai sheet.
- **8** — the sedan across the mouth, beams down the lane, two masked men walking in as silhouettes;
  no bar sign in this direction; Mara a faint shape in the recess at frame left.

## Fixes carried from the 29 September review

1. Mara stays in the recess shadow in every frame whose camera sees the doorway (8, 10, 12).
2. The sedan reverses out of the mouth; it never turns inside the lane (13).
3. Sakai's body lies in the lane in 13 — the board's "no people" meant no one standing.
4. The bar sign appears only in frames looking toward the bar end (never with the headlights).
5. The journalist's wardrobe is locked to `sheets/journalist.jpg` for 20, 22, 24, 25, 26.
6. Shot 27 carries shoes on legs and a hand on the notebook — no detached shoes.
7. The key's worn tag reads **114** in 16, closing the old 87 art mismatch with the script.

## Verification / handoff

`coldOpenFreshCompleted` moves only when the JPEGs have actually been replaced; the builder swaps
the frame's provenance note to the fresh pass and the verifier checks the fresh note's references.
Run `npm run build:neonoire && npm run verify:neonoire && npm run check:assets && npm run typecheck`
after each batch. All frames remain AI-generated draft studies; nothing here is production approval.
