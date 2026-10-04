# NEONOIRE — the retake queue, closed: the last nine pins and the film's last frame (4 October 2026)

**Ten generations, ten frames installed over their own filenames at their stable paths, nothing thrown away and
nothing renumbered — and `RETAKE PENDING` is empty for the first time since 30 September 2026.** The round took the
nine frames the queue still held (**113, 131, 132, 141, 142, 143, 160, 186, 228**) and, as the tenth, scene 100's
**161** — the film's last frame, which the same rewrite had left playing a retired ending with no pin on it at all.
`scripts/neonoire/rewrite-pending.mjs` now reads `new Set([])`; the nine studies and 161's study are on disk in
`public/images/neonoire/archive/` under their own names before the fact (see the last section).

The standing instruction for the round: **"if the shot description doesn't make complete visual sense go by the logic
of the scene, leave note in handoff."** Five of the ten needed exactly that, because the descriptions on the boards
had been written for the cut the 30 September revision replaced. The calls are recorded below, in the board notes,
and in the handoff's new Current section.

## What each frame was showing, and what it shows now

| # | file | retired beat the study still showed | the rewritten beat it now shows |
| --- | --- | --- | --- |
| 113 | `s83/111-just-a-face.jpg` | the model behind her still carrying the dark patched block and its fountain | the close-up on her verdict, the model corrected: **only the white plaza, with tiny painted people crossing it** (the block was lifted out in scene 51) |
| 131 | `s89/129-she-lets-him.jpg` | **his** hand finding hers and closing over it while she lets him | **her** hand finding his and pulling him up after her — she reaches back, she leads |
| 132 | `s90/130-the-roof.jpg` | a stair landing, the old woman lit from below by a torch of her own | her own room: the sumo murmuring on a television nobody watches, its flicker the only light, **her pointing across it to the second open door** — no landing, no torch |
| 141 | `s94/139-only-tea.jpg` | the back-seat two-shot and every line in it ("Get in, Ishida. You'll catch cold." … "I did everything you asked. For twenty years.") | **the car at the kerb at the foot of the steps**, engine running, wipers going, the rear door open from inside, one lit second-floor window, **nobody in frame** |
| 142 | `s94/140-where-are-we-going.jpg` | Ishida in the car with the cup, Tokyo sliding past, and the retired line "Where are we going?" | **Ishida stopped in the rain, looking back up at the station at the one lit window** — the scene's only close-up |
| 143 | `s94/141-he-drinks.jpg` | him drinking with his eyes closed while Kurose looks ahead | **the clean hand holding out the steel cup, the watch from the model on the wrist**, and Ishida's hands rising to take it |
| 160 | `s100/158-the-third-stool.jpg` | Vera already seated on the third stool, and a man standing in the doorway with his long shadow on the floor | the counter **at the beat before she sits**: Jack on the second stool, **the third empty**, the curtain in the doorway just beginning to move |
| 161 | `s100/159-she-doesnt-turn.jpg` | the man in the doorway, the long shadow, a second bowl for the fourth stool | **the hold on the three of them**: her back and the clip, Jack on the stool beside her, Kaneko across the counter, the overpaid money left where she put it, the lit window past the curtain |
| 186 | `s15/184-a-gap-in-someones-teeth.jpg` | an unlettered hoarding, and a pavement that reads damp | **the hoarding lettered KUROSE DEVELOPMENT** with its painted plaza of smiling people who don't exist — and it is raining |
| 228 | `s59/226-at-the-edge-of-a-high-place.jpg` | the embrace, and his eyes going over her shoulder to every parked car | **the green payphone under the tin awning**, Jack at the receiver while it rings, and Vera coming out of the entrance glowing behind him |

## The five scene-logic calls (permanent unless the director overrides)

1. **Scene 94 is three new frames, not three corrected ones.** The rewrite emptied the scene of dialogue and moved it
   out of the car, and the board's own re-quoted cast for 141 is empty while its heading still read
   `TWO-SHOT — 35mm` from the front seat. A two-shot with nobody in it does not make visual sense, so 141 is now the
   establishing **WIDE — 24mm** the screenplay page prescribes for the steps and the rain; 142 keeps its 85mm close-up
   but takes the look back at the station (its old description was written for the retired "Where are we going?");
   143 keeps its 50mm two-shot and plays the hand and the watch rather than the drinking.
2. **131's hand runs the other way.** "His hand finding hers in the dark. She lets him." is gone; the page reads
   *"Her other hand finds Jack's and pulls him up after her."* She reaches back, she grips, he is drawn up.
3. **132 lost the stair landing and the torch.** The rewrite moved the old-woman beat out of scene 89's stair and
   gave it a room, a murmuring sumo on a television nobody watches, and *"She points across it to the far wall, where
   a second door stands open."* The television's cold flicker is now the light on her face.
4. **160 is the room before she sits, and 161 is the three of them.** The consistency pass of 26 September locked
   160 to Vera on the third stool; the frame's own line is *"Kaneko ladles. JACK sits on the second stool. The third
   is empty."*, and her entrance is the next beat. So the master holds Jack on the second stool with the third empty
   and the curtain stirring — and the two beats the rewrite retired from the film's last frame (the man in the doorway
   with his long shadow, the second bowl for the fourth stool) are gone from 161, which is now the hold the page asks
   for. Vera's Look F is first framed in 265 and 260 instead.
5. **186's hoarding carries one company name.** TOMORROW'S TOKYO was scene 97's slogan and died with the cut scene;
   the rewritten page gives this hoarding KUROSE DEVELOPMENT and a painted plaza of smiling people. With it, 228 was
   generated *after* 186 so the Hive's daylight geography carries between them, as the board always said it should.

Plus one call the director may want to reverse (**113**): the revision's rule for scene 83 plays *"It's just a face"*
wide and gives the accusations no close-up, and the board's coverage note says the same. The retake kept the close-up
anyway — the line is her verdict rather than an accusation, and it is the only close-up the scene gets — and the
decision is written into the board note and the handoff. One line from the director re-frames it wide.

## Three superseded board wordings, fixed with the frames

- **Scene 89's board promised the noise barrage** — a dog, a baby, radios, a television, a pot banged with a spoon,
  the whole building making noise on purpose. The rewrite cut all of it; the grammar line and shot 130's note now say
  the stair is silent but for the beam, and `scripts/neonoire/escape-look.mjs` says so too.
- **186's board asked for a separate TOMORROW'S TOKYO banner.** Gone, with the scene that owned it; `s97/` keeps its
  images on disk and stopped being this location's reference.
- **228's board described the embrace and the parked cars.** Gone; the frame is the payphone, the glowing entrance
  and the call nobody answers. The other half of the beat — the INTERCUT to Mrs. Sakai's empty house — is not boarded
  here, and is noted as a coverage observation rather than silently drawn into this frame.

## References attached

Character and location sheets only — the cold open's stricter fresh-pass rule does not govern these scenes, but the
habit holds: **no earlier frame of the same shot was attached to any generation.** Each frame carries the sheets it
needs plus, for geography only, the location master or canon sheet the board already holds it to:

- **113** `sheets/vera.jpg`, `vera-face.jpg`, `vera-look-c.jpg`; the room master `s83/109-the-fortieth-floor.jpg`.
- **131** `sheets/vera.jpg`, `sheets/jack.jpg`; the stairwell master `s89/128-by-touch.jpg`.
- **132** `s16/186-everybody-sees-him.jpg` (the woman asleep at the sumo — she has no sheet of her own),
  `sheets/vera-look-c.jpg`, `sheets/jack.jpg`.
- **141 / 142** the station masters `s93/137-he-knows-this-car.jpg` and `s93/138-the-door-opens.jpg`; `sheets/ishida.jpg`.
- **143** `sheets/ishida.jpg`, `sheets/kurose.jpg`, and — for the back-seat look only, cream leather and amber, which
  after this round no longer lives on the board — the archived `s94/139-only-tea.jpg` study.
- **160** the archived `s100/158-the-third-stool.jpg` for the room, `props/kaneko-sign-board.jpg`, `sheets/kaneko.jpg`,
  `sheets/jack.jpg`. **161** was generated from the newly installed 160, plus `sheets/vera-look-f.jpg`,
  `sheets/kaneko.jpg`, `sheets/jack.jpg`.
- **186** `sheets/hive-exterior-day.jpg` (canon day), `keys/06-the-block.jpg`, the archived 186 for the street,
  `sheets/jack.jpg`. **228** the newly installed 186, `sheets/vera.jpg`, `sheets/jack.jpg`.

## Honest caveats

- **No full-size human review was possible in this session** — the round's frames were generated to the board's
  written beat, checked mechanically (all ten are 1920×1080 with no baked letterbox bars, and their tonalities sit
  where their scenes want them: the stairwell insert is the darkest frame in the film at a mean luminance of 0.10,
  the daylight street and the office the brightest) and installed. The pixel-level approval is the director's, as it
  has been since the first pass; the contact sheets below are for that review.
- **131** is a hands-only insert in near-total dark: whether the grip reads as hers taking his, rather than his
  covering hers, is a judgement that wants a human eye at full size.
- **141** rests on the car reading as the film's ordinary black 1990s sedan and on the station's one lit window being
  legible; both are small in a 24mm frame.
- **160 and 161** depend on six stools reading as six, and on the 金子 board carrying from the master; 161's money on
  the counter is a prop the old frame never had, and its legibility is unproven.
- **186** must carry the KUROSE DEVELOPMENT lettering and the painted plaza; if the letters came back as pseudo-text,
  that is the one caveat worth a retake, because the lettering is the reason the frame was pinned.
- **132**'s old woman still has no identity sheet; she is held to the scene 16 passage master, and her hair reads a
  little lighter and looser there (a hair check carried forward, not a blocked frame).
- **143**'s watch from the model is the film's last sight of it and is small in a 50mm two-shot.

## Nothing was thrown away

Every study the round replaced was copied into the versioned archive **before** the new frame was written over it, and
committed: `archive/s83/111-just-a-face--v2.jpg`, `archive/s89/129-she-lets-him--v1.jpg`,
`archive/s90/130-the-roof--v3.jpg`, `archive/s94/139-only-tea--v1.jpg`, `archive/s94/140-where-are-we-going--v1.jpg`,
`archive/s94/141-he-drinks--v1.jpg`, `archive/s100/158-the-third-stool--v2.jpg`,
`archive/s100/159-she-doesnt-turn--v2.jpg`, `archive/s15/184-a-gap-in-someones-teeth--v2.jpg`,
`archive/s59/226-at-the-edge-of-a-high-place--v2.jpg`. `verify:neonoire` asserts each one exists. The raw generations
sit in the ignored `artifacts/neonoire/retakes-2026-10-04/` (raw, before and after sheets) and the review sheets are
in `public/images/neonoire/reviews/`.

## The checks

`npm run build:neonoire` (**322/322 keyframes on disk, 0 placeholders**), `npm run verify:neonoire` (the queue reads
`0`, each of the ten records `RETAKE LANDED 4 OCTOBER 2026`, each keeps its stable asset path and its archive backup,
141 is a 24mm wide, and the three superseded wordings are gone from the boards), `npm run verify:shot-order`,
`npm run check:assets`, `npm run typecheck` and the production build all pass. No `pendingNotesHashes` additions were
needed — no card changed state from "awaiting a picture" — and `sync-scene6.mjs` was **not** re-run.
