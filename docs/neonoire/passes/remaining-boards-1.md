# NEONOIRE — the remaining boards (30 September 2026)

Twenty keyframes were left owing after the 30 September 2026 revision and story pass 2: the revision's
own boards (308–320) and the story-pass-2 studies the previous session's ten calls could not reach
(298, 299, 300, 302, 303, 306, 307). This ledger covers the first seven installed. The rule for every
one of them is the cold-open fresh pass's rule, restated in
[`scripts/neonoire/remaining-boards.mjs`](../../scripts/neonoire/remaining-boards.mjs):

> **The screenplay text and the CHARACTER SHEETS are the only image references** — no scene masters, no
> earlier frame, no bar or layout sheet attached. The board's own camera, lens and lighting lines are
> followed, and the frame is delivered 16:9 full-bleed 1920×1080.

The builder and the verifier both read `remainingBoardsCompleted` from that module: a number enters it
only when the JPEG is installed at its stable asset path by
[`fresh-install.mjs`](../../scripts/neonoire/fresh-install.mjs) (centre-cropped to exact 16:9, resized
to 1920×1080, never stretched, never a crop of a legacy study). A frame that is not in the list and not
on disk stays an honest placeholder naming the file it awaits.

## Installed — batch 1

| shot | file | frame |
| --- | --- | --- |
| 303 | `s96/303-he-left-a-statement.jpg` | the young detective on the desk phone, the box open beside him, Ishida's chair empty |
| 308 | `s2/308-clip-under-the-shelf.jpg` | the red enamel bird clip in the gap under the shelf, her hand flat on the bottles |
| 315 | `s76/315-the-number-pressed.jpg` | the screen reading MOM, the phone's light the only light on her face |
| 316 | `s78/316-squared-to-the-door.jpg` | Daniel's notebook set on the mat and squared to the third-floor door, grey dawn |
| 317 | `s83/317-the-envelope-on-the-glass.jpg` | the plain envelope on the glass table, Vera's eyes on the rain-grey city |
| 318 | `s84/318-the-dried-stack.jpg` | the drawings dried flat on the storeroom futon, the bulb's hard shadow past them |
| 319 | `s89/319-the-unlit-lighter.jpg` | the thumb on the flint wheel in the black stairwell — no flame, no spark |

Review sheet: [`reviews/remaining-boards-pass-1.jpg`](../../public/images/neonoire/reviews/remaining-boards-pass-1.jpg).

## Frame by frame, at full size — batch 1

- **303** — flat grey morning, blinds, the empty neighbouring chair. The young detective follows
  `sheets/young-detective.jpg` (white shirt, dark tie, neat short hair); the box, the files and the
  dark-green radio rhyme with shot 143. **Caveat, logged not spent a call on:** his collar carries a
  pale mark that reads as a folded paper — the house rule says no invented readable props; it is not
  legible at size and the frame stays Draft.
- **308** — the clip is legible as the red bird of `sheets/mara.jpg` and `mara-face.jpg`; the hand and
  the soaked denim cuff at frame edge are the only flesh in it; the bar's amber is the only light.
  This is the first of the revision's seven named close-ups (2, 20, 63, 71, 77, 79, 89).
- **315** — **LEGIBLE-TEXT FRAME**: the screen reads exactly `MOM`, confirmed at full size. Only the
  phone lights her; the room behind stays dark and the window is wet. She wears the creased wine-red
  silk dress; her makeup is dried and ruined, not horror makeup.
- **316** — the notebook is the small dark-green cloth book of 77–79, laid on the mat, squared to the
  door panel; Jack's hand is leaving the frame and the coat is already stepping away. The corridor is
  the block's own grey concrete and railings, dripping, cold blue dawn. **Caveat:** the notebook reads
  slightly thick at this distance — it must not read as a parcel; kept for the squared-to-the-panel
  gesture the board exists for.
- **317** — the envelope is the subject and no face is emphasised, as the revision's wide-scene rule
  demands even for a prop. Vera is in Look C, eyes off the envelope, on the city; the tea is Kurose's;
  the model in its glass case stands behind. 16:9, rain-grey, no fountain rendering on the model.
- **318** — the stack is dried flat with rippled, warped edges, the top sheet showing the pencil noodle
  counter and its 金子 sign board, matching the drawings the film has already seen (scene 14's wall,
  the sketchbook). One bare bulb, both shadows thrown past the futon, nothing else lit.
- **319** — **the frame's content is what does not happen**: the thumb is on the wheel and there is no
  flame and no spark anywhere in it; the dented brushed-steel lighter is the same prop as scene 76's.
  Almost nothing is visible beyond the hand, which is the point. This is the seventh named close-up.

## Installed — batch 2

| shot | file | frame |
| --- | --- | --- |
| 309 | `s20/309-the-voicemail.jpg` | **retake** — the phone screen the only light on her face, nothing else lit |
| 312 | `s63/312-daniel-voss-flyleaf.jpg` | **retake** — the name written in ink on the flyleaf, nothing else readable |
| 305 | `s99a/305-the-plaza.jpg` | **retake, released from the pin** — the plaza as it is built, from the re-pinned text |
| 306 | `s99a/306-the-hoarding.jpg` | real people crossing pale paving — no hoarding, no fountain, no company name |
| 307 | `s99a/307-the-gardener.jpg` | the train crosses the viaduct and nothing below it moves |

Review sheet: [`reviews/remaining-boards-pass-2.jpg`](../../public/images/neonoire/reviews/remaining-boards-pass-2.jpg).

The plaza's three views (305–307) were generated **in one session as one sequence** so they match frame
to frame, and all three were generated from the re-pinned scene 99A text: 305's old study, which showed
the cut fountain and hoarding, is replaced and 305–307 are **released from `RETAKE PENDING`** — the pin's
reason is gone (`rewrite-pending.mjs` records the release).

- **309** — the storeroom behind her is almost entirely black, one dim out-of-focus bulb far behind; the
  screen is a plain player with no readable text; her hair is flat and wet with **no clip** (it is on
  the sketchbook by the end of the scene). Held to `sheets/mara-face.jpg` and the hiding look.
- **312** — **LEGIBLE-TEXT FRAME**, read at full size before install: the flyleaf carries the name in
  faded ink and the opposite leaf carries old English handwriting; nothing printed, no placard, no
  label anywhere in the frame.
- **305** — three ordinary people cross far away; a bench nobody sits on; the viaduct along the edge;
  no fountain, no steel guards, no fountain rendering in the glass. Winter light, no rain.
- **306** — four or five pedestrians crossing mid-frame, unhurried, "exactly like the painted ones";
  the company name that used to be the film's only comment on Kurose is withheld entirely.
- **307** — the train is a grey blur along the top of the frame and the plaza below it is empty and
  still: no gardener, no straightened tree. The film's last grace note is the absence itself.

## Still queued behind batch 2 (9)

- **313 — re-composed again.** The first call was refused by the image service's content moderation (a
  precedent the house has met before on shot 18). The second study landed the place with no figures in
  frame, but the drawings themselves were not readable at size, so the brief is re-composed once more:
  the drawings the subject, close enough for the pencil counters and the viaduct to be read.
- **310, 311** the model at dawn and the hand lifting the Hive out of it · **314** the empty crossing,
  the one still that breaks the film's rule on purpose · **320** the news nobody watches · **298**
  there was no car · **299** the card on the desk · **300** at the edge of the newsroom · **302** the
  copies.

## Pipeline

- `scripts/neonoire/remaining-boards.mjs` — the rule, the installed list, the queue with reasons.
- `npm run build:neonoire` — a delivered frame is **Draft** with its pass note; an undelivered one keeps
  its **Needs review** placeholder card naming the file.
- `npm run verify:neonoire` — asserts each delivered number is on disk at 1920×1080 with its provenance
  note, and that the placeholders hold exactly the numbers still owed.
- `npm run passes:neonoire` — regenerates the pass briefs; 284/297 frames on disk, 13 to go.
