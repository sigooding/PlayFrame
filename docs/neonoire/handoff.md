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

The draft (`Neonoire_Opening.fountain`, repository root) is seven scenes, 403 lines — its title page
reads *First Draft — Scenes 1-12*, and seven of the twelve are written. It has been turned into:

| | |
| --- | --- |
| **screenplay** | the draft, page by page, in `docs/neonoire/screenplay/` — verbatim; a build step fails if it ever drifts from the fountain |
| **board** | 67 numbered shots in `docs/neonoire/scenes/` — shot type, lens, angle, movement, cast, lighting, duration, keyframe filename, notes, and the draft's own words for each shot |
| **keyframes** | 67 of 67 generated, plus 9 studio keys — in `public/images/neonoire/` |
| **workspace** | `public/projects/neonoire-opening.json`, opened in the app from Templates → NEONOIRE |

Story: Kanda, night. Mara Voss (24, American) declines her sister's call, watches two masked men
shoot an old man in the rain, takes a coin-locker key out of his hand and hides behind a bar counter
while a journalist is killed in front of a laughing television — losing her red bird hair clip
between the crates without noticing. Three days later her sister Vera
reports her missing; a detective with her sister's purse already in his desk drawer tells her to call
any time. The opening ends there. **Nothing is explained** — that is the film's rule, and it is the
workspace's.

---

## 2. What you are being asked to do

**All 67 keyframes are now generated.** Use [`passes/README.md`](passes/README.md) as the review index; the
numbered boards, continuity sheets and the app style in [`src/lib/styles.ts`](../../src/lib/styles.ts) remain
the source of truth for any regeneration — and `node scripts/neonoire/pass-prompts.mjs --all` rewrites
every pass as a regeneration brief.

Work one pass at a time, in screenplay order. A pass is at most ten frames.

```bash
npm install                                  # the sandbox wipes node_modules between sessions
node scripts/neonoire/pass-prompts.mjs       # regenerate the pass briefs from the board
node scripts/neonoire/pass-prompts.mjs --pass 3   # or print one pass
node scripts/neonoire/pass-prompts.mjs --all      # or every pass, as regeneration briefs
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
(`src/lib/styles.ts`), which is what every frame in the bundle carries. In short: 2.39:1 anamorphic, 35mm Kodak Vision3 500T, visible fine grain,
halation around every practical light, crushed but never muddy blacks, muted desaturated palette,
cold steady rain on black reflective asphalt, lit by vending machines, sodium streetlights and sick
fluorescent green — **never by the sky**. Wide and patient, figure small, lots of negative space,
ordinary city life hinted at around them: a lit window, laundry, a distant train.

Negative prompt: lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon
overload, oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up
portrait, fashion pose, smiling, text, watermark, anime style.

**If it comes out too cyberpunk:** drop "neon", add "1990s, ordinary, worn, documentary realism".

Technical: JPEG, exactly **2.39:1** — the repo standard is 1912×800, and every frame currently on
disk is that. Normalise with:

```bash
convert FILE.jpg -resize "1912x800^" -gravity center -extent 1912x800 -quality 92 -strip FILE.jpg
```

Do not rename, move or delete anything the board names. The filename *is* the shot's identity.

---

## 4. Continuity — the thing that breaks first

- **Mara Voss (24)** — American. Long wavy ash-blonde hair, soaked flat for the whole opening and
  held back by a cheap enamel clip shaped like a small red bird (shot 4 plants it; shot 29 drops it
  between the crates, unseen), pale blue eyes, indigo denim jacket, heather-grey tee, black jeans,
  white trainers, thin black cord necklace. Sheet `sheets/mara.jpg`; face crop `sheets/mara-face.jpg`.
  **Attach the face crop to every generation she is in, and the shot 4 study to any frame that shows
  the clip.**
- **Vera Voss (29)** — American, her older sister, same blonde hair and blue eyes, told apart by
  shorter hair with a fringe, a charcoal wool coat, a cream high-neck knit, navy trousers and brown
  boots. She carries Mara's pale-blue umbrella: bone dry on the shelf, dripping on police linoleum.
  Sheet `sheets/vera.jpg`; face crop `sheets/vera-face.jpg`.
- **The Young Officer (20s)** — the recurring front-counter officer now has a canonical sheet and
  face crop: `sheets/young-officer.jpg` and `sheets/young-officer-face.jpg`. Neat black hair, navy
  police uniform, ordinary polite face; keep him fixed across shots 47–52.
- **Detective Ishida (50s)** — the recurring detective now has a canonical sheet and face crop:
  `sheets/ishida.jpg` and `sheets/ishida-face.jpg`. Short salt-and-pepper hair, lean build,
  charcoal suit, tired kindness; keep him fixed across shots 54–67.
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

1. **The first twelve frames generated (now shots 1–3 and 5–13) were made in 16:9 and
   centre-cropped to 2.39:1.** Their compositions were decided for a taller frame. They hold up, but a
   native 2.39 generation will always beat them — the draft asks for wide, patient framing with the
   figure small, and that is a widescreen decision.
2. **Shot 15 (she kneels)** puts vending machines on both sides of the street. The draft has **one**
   vending machine, at the corner, and it is the brightest thing in the film's first minute. Keep it
   singular and let shots 14–19 stay emptier than feels comfortable.
3. **Shot 16 (the grip)** reads as a hand on a shoulder rather than a dying man's grip on a wrist with
   something pressed into a palm. It wants to be tighter and less legible.
4. **The bar (shots 20–30)** is lit too cosily in places. The scene is amber bottles, one CRT's blue
   flicker, no overhead light, and the floor's-eye view does most of the work. The murder happens
   *off* the centre of frame while the television audience laughs — the camera must never be
   interested in the violence.
5. **Vera's thread — the apartment, the counter, the interview room — is 31 shots of the board** and
   it is the first time the film looks directly at somebody's face. The pass 4 and 5 studies carry
   it; check them against her sheet before approving anything.
6. **The two red bird frames are brand new studies.** Shot 4 (the clip in her hair) and shot 29 (the
   clip dropping between the crates) were generated against the Mara face crop, the bar key and each
   other — but they are draft studies like every other frame, and the clip's bird shape and chipped
   enamel must match between them before either is approved.

---

## 6. What not to touch

- **The draft.** `Neonoire_Opening.fountain` is the source of truth; the pages are generated from it
  and the builder proves they rebuild it byte for byte. Never hand-edit `docs/neonoire/screenplay/`.
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
- **All sixty-seven board keyframes** — `public/images/neonoire/s1/` (1–19), `s2/` (20–30) and
  `s3 … s7/` (31–67), with each frame's notes naming its pass and the continuity sheet it was
  generated against. The two newest are `s1/04-the-red-bird.jpg` and `s2/29-the-red-bird-drops.jpg`.
- **Continuity sheets and face crops** — `public/images/neonoire/sheets/`.
