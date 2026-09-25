# NEONOIRE — handoff

For the agent taking over the keyframes. Everything below is what already exists, what is missing,
what the film has to look like, and how to land your work without breaking the app. Read the
`neonoire` style in [`src/lib/styles.ts`](../../src/lib/styles.ts) next, then the pass you are generating in
[`passes/`](passes).

---

## 1. What this is

`sigooding/PlayFrame` is a writer/director's pre-production studio (Next.js app: screenplay,
storyboard, shot list, mood boards, prompt studio). NEONOIRE — the opening scenes of a neo-noir
feature set in Tokyo — is one of the projects it ships, and it is a *separate, self-contained*
workspace from the series project that was already in the repo.

The draft (`Neonoire (3).fountain`, repository root) is the **final screenplay**: 100 numbered
scenes, 3,474 lines, from the Kanda backstreet to Kaneko's new counter and `>THE END<`. The opening
`Neonoire_Opening.fountain` is superseded — kept only as a historical extract. The final draft has
been turned into:

| | |
| --- | --- |
| **screenplay** | the draft, page by page, in `docs/neonoire/screenplay/` — one page per numbered scene (n01–n100), verbatim; a build step fails if it ever drifts from the fountain |
| **board** | 84 numbered shots in `docs/neonoire/scenes/` — `n01–n07` for the opening, `n73–n76` for the film proper's centre — shot type, lens, angle, movement, cast, lighting, duration, keyframe filename, notes, and the draft's own words for each shot |
| **keyframes** | 84 of 84 generated, plus 9 studio keys — in `public/images/neonoire/` (`s73 … s76/` for scenes 73–76) |
| **workspace** | `public/projects/neonoire-opening.json`, opened in the app from Templates → NEONOIRE; the other eighty-nine scenes ride in it as **WRITTEN, NOT BOARDED** cards with their full screenplay pages |

Story (opening): Kanda, night. Mara Voss (24, American) declines her sister's call, watches two
masked men shoot an old man in the rain, takes a coin-locker key out of his hand and hides behind a
bar counter while a journalist is killed in front of a laughing television. Three days later her
sister Vera reports her missing; a detective with her sister's purse already in his desk drawer tells
her to call any time. **The final screenplay then plays the whole board out** — the key's price, the
Hive, Kurose, the roadside inn, and a new counter under the railway, where the red bird clip ends up
in Vera's hair and a shadow fills a doorway. **Nothing is explained** — that is the film's rule, and
it is the workspace's. Note the one continuity change the final draft makes inside the opening:
Mara's red bird clip now slips loose between the crates in scene 2 and is gone from her hair from
that beat on.

---

## 2. What you are being asked to do

**All 84 keyframes are now generated** — the opening's 68 and the streets boards' sixteen. Use [`passes/README.md`](passes/README.md) as the review index; the
numbered boards, continuity sheets and the app style in [`src/lib/styles.ts`](../../src/lib/styles.ts) remain
the source of truth for any regeneration.

Work one pass at a time, in screenplay order. A pass is at most ten frames.

```bash
npm install                                  # the sandbox wipes node_modules between sessions
node scripts/neonoire/pass-prompts.mjs       # regenerate the pass briefs from the board
node scripts/neonoire/pass-prompts.mjs --pass 3   # or print one pass
```

After your frames are on disk:

```bash
npm run build:neonoire     # rebuilds the workspace; lists anything missing or misnamed
npm run verify:neonoire    # schema, screenplay map, lenses, placeholders, CSV, prompts, persistence
npm run check:assets       # every referenced image is on disk
```

`build:neonoire` will refuse to build if a frame claims a file that is not there, so it is also your
typo check. The app fills a placeholder in automatically the next time the workspace is opened.

---

## 3. The look — non-negotiable

The full style block and negative prompt are the **`neonoire` visual style inside the app**
(`src/lib/styles.ts`), which is what every frame in the bundle carries. In short, per the final
screenplay: **16:9 full-bleed widescreen for every image in the film**, 35mm Kodak Vision3 500T, visible fine grain,
halation around every practical light, crushed but never muddy blacks, muted desaturated palette,
cold steady rain on black reflective asphalt, lit by vending machines, sodium streetlights and sick
fluorescent green — **never by the sky**. Wide and patient, figure small, lots of negative space,
ordinary city life hinted at around them: a lit window, laundry, a distant train.

Negative prompt: lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon
overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up
portrait, fashion pose, smiling, text, watermark, anime style.

**If it comes out too cyberpunk:** drop "neon", add "1990s, ordinary, worn, documentary realism".

Technical: JPEG. **Every image is 16:9, 1920×1080 — this is the film's frame rule from the final screenplay (25 September 2026) onward, and it covers any frame generated for scenes 8–100 as the board reaches them.** Scenes 4–7 (shots 33–68) and the apartment/police-station keys were already revised to it from `police_station.png` with Vera and the young officer matched to their sheets. See `scenes/n05-front-counter.md` and `scripts/neonoire/front-counter-look.mjs`. The apartment uses `appartment.png` and `photo.png`; the paper pendant is removed completely, including cord/reflection. See `scenes/n04-vera-apartment.md` and `scripts/neonoire/apartment-look.mjs` for room, cup, phone, wardrobe and childhood-photo continuity. The interview room follows `s6/51-the-interview-room.jpg` and `s6/56-three-days-ago.jpg`, with the cup/spill states and tissue-box placement in `scripts/neonoire/interview-look.mjs`; shots 57 and 59 are reframings of their masters. The detectives’ room follows `scripts/neonoire/detectives-look.mjs`: Ishida keeps his open-collar suit, the evidence remains sealed inside the bottom drawer, and only that drawer opens before closing again. Cold-open shots 1–10 have also been rebuilt at 1920×1080; shots 11–28 remain older 2.39:1 studies marked Needs review, and scene 3 (shots 29–32) carries the same 16:9-revision-pending label. Continue via `passes/cold-open-revision.md` and `scripts/neonoire/cold-open-look.mjs`. Do not recrop revised frames to scope, and do not letterbox 16:9 content to fake the old shape (two of shots 71/75 arrived with burned-in matte lines and were de-letterboxed at source, not faked). Scenes 73–76 (shots 69–84) generate against `scripts/neonoire/streets-look.mjs`: Vera in the ruined deep-red dress losing one red court shoe in shot 72, Jack as the living man in the soaked charcoal overcoat, and scene 75's five still frames with nobody in them, each tied to an earlier master (the shoe to 72's puddle, the lounge to the pale-blue umbrella, the machine to `s1/01-backstreet.jpg`). No frame is to be generated at 2.39:1 any more; normalise every fresh or regenerated frame with:

```bash
convert FILE.jpg -resize "1920x1080^" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg
```

Do not rename, move or delete anything the board names. The filename *is* the shot's identity.

---

## 4. Continuity — the thing that breaks first

- **Mara Voss (24)** — American. Long wavy ash-blonde hair, soaked flat for the whole opening and
  held back by a cheap enamel clip shaped like a small red bird; in the final screenplay the clip
  slides loose between the crates inside the bar (scene 2) and is out of her hair from that beat on. Pale blue eyes, indigo denim jacket, heather-grey tee, black jeans, white trainers, thin
  black cord necklace. Sheet `sheets/mara.jpg`; face crop `sheets/mara-face.jpg`. **Attach the face crop
  to every generation she is in.**
- **Vera Voss (29)** — American, her older sister, same blonde hair and blue eyes, told apart by
  shorter hair with a fringe, a charcoal wool coat, a cream high-neck knit, navy trousers and brown
  boots. She carries Mara's pale-blue umbrella: bone dry on the shelf, dripping on police linoleum.
  Sheet `sheets/vera.jpg`; face crop `sheets/vera-face.jpg`.
- **The Young Officer (20s)** — the recurring front-counter officer now has a canonical sheet and
  face crop: `sheets/young-officer.jpg` and `sheets/young-officer-face.jpg`. Neat black hair, navy
  police uniform, ordinary polite face; keep him fixed across shots 45–50.
- **Detective Ishida (50s)** — the recurring detective now has a canonical sheet and face crop:
  `sheets/ishida.jpg` and `sheets/ishida-face.jpg`. Short salt-and-pepper hair, lean build,
  charcoal suit, tired kindness; keep him fixed across shots 52–68.
- **Jack Voss** — their American father, present only inside one framed photograph in scene 4
  (rumpled suit, both small daughters' hands in his, a Tokyo noodle-shop sign behind them, twenty
  years ago). He is the only saturated warm colour in the film so far and is never spoken about.
- **Unnamed roles keep their faces out of it.** The masked men: masks, gloved hands, wet black shoes,
  eyes only. The old man: plastic raincoat, seen from behind or at a distance, then on the ground.
  The journalist: ordinary man in his forties; he is killed in four shots and gets no death scene.

Faces drift between passes more than anything else. If a study of Mara or Vera does not match her
sheet, mark the frame **Needs review** rather than keeping it in the cut. Never swap in a different
actor's face to fix a composition.

---

## 5. Where the existing frames are weak (beat these)

Honest assessment, in the order worth fixing:

1. **Legacy shots 11–12 were generated in 16:9 and centre-cropped to 2.39:1.** Shots 1–10 have since been rebuilt in native 16:9. The legacy compositions were
   decided for a taller frame. Rebuild them in **16:9**, like shots 1–10; preserve the patient framing rather than cropping to scope again.
2. **Shot 14 (she kneels)** puts vending machines on both sides of the street. The draft has **one**
   vending machine, at the corner, and it is the brightest thing in the film's first minute. Keep it
   singular and let shots 13–18 stay emptier than feels comfortable.
3. **Shot 15 (the grip)** reads as a hand on a shoulder rather than a dying man's grip on a wrist with
   something pressed into a palm. It wants to be tighter and less legible.
4. **The bar (shots 19–22, and 23–28 to come)** is lit too cosily in places. The scene is amber
   bottles, one CRT's blue flicker, no overhead light, and the floor's-eye view does most of the
   work. The murder happens *off* the centre of frame while the television audience laughs — the
   camera must never be interested in the violence.
5. **Vera has only two frames so far** (keys 4 and 5). Her thread — the apartment, the counter, the
   interview room — is 27 shots of the board and it is the first time the film looks directly at
   somebody's face. Get her right in pass 4 and 5 and the second half of the opening works.

---

## 6. What not to touch

- **The draft.** `Neonoire (3).fountain` is the source of truth — the final screenplay; the pages are
  generated from it and the builder proves the 100 of them rebuild it byte for byte. Never hand-edit
  `docs/neonoire/screenplay/`.
- **The board's numbers, framing or filenames.** They are asserted at build time. If a shot's
  direction is wrong, say so — do not silently change the board to match a picture you like.
- **The series project.** `public/projects/let-the-raptures-commence.json` and `docs/rapture/` belong
  to a different film; `verify:rapture` guards it and must stay green.
- **The app's other features.** Your changes should be images plus, if needed, board notes.

## 7. Landing the work

```bash
git checkout -b your-branch
# generate, normalise, place the files
npm run build:neonoire && npm run verify:neonoire && npm run check:assets
git add -A && git commit -m "NEONOIRE: keyframe pass N"
```

Then open a pull request. The build writes the new filenames into the workspace, so the app, the
storyboard, the shot list and every generated prompt pick the frames up with no other change.

## 8. What already exists, so you can match it

- **Nine studio keys** — `public/images/neonoire/keys/`, generated from the brief. These are the bar
  for quality and tone; if your frame looks glossier, cleaner or more neon than these, it is wrong.
  They are the first nine entries of the *The style block — nine keys* mood board in the app.
- **Twenty-two board keyframes** — `public/images/neonoire/s1/` (1–18) and `s2/` (19–22), with each
  frame's notes naming its pass and the continuity sheet it was generated against.
- **Continuity sheets and face crops** — `public/images/neonoire/sheets/`.
