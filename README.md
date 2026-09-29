# frame.

A writer/director's pre-production studio: screenplay, acts & sequences, cast with a relationship map, storyboard with a shot-type library, a lighting library and a thirty-one-look visual style library, shot list, mood boards, brainstorm map, and a prompt studio that batches any set of shots into ready-to-paste prompts for video (MiniMax H3, Seedance, Kling, Runway, Veo) and image models (SDXL, SD 1.5, SD 3.5, Krea 2, FLUX, Midjourney, DALL-E, Leonardo, Ideogram) in thirty-one visual styles (Realistic, Anime, Comic, 3D Animation, Watercolor, Film Noir, Cyberpunk, Claymation, Pixel Art, Oil Painting, Classic Cartoon, Documentary, Rotoscoped, Ukiyo-e, Line Art, Mid-century Poster, Super 8, Synthwave, Charcoal, Paper Collage, Studio Ghibli, Manga, Hanna-Barbera, Isometric, Art Deco, Impressionist, Pop Art, Stained Glass, Technicolor, Polaroid).

## Run it locally

```bash
npm install
cp .env.example .env         # then point DATABASE_URL at your PostgreSQL
npx drizzle-kit push         # creates the film_projects table
npm run dev                  # http://localhost:3000
```

The first load seeds the existing sample projects plus **Let the Raptures Commence**.
The series opens by default when present; an explicit `?project=<id>` always wins.

## NEONOIRE — the final screenplay

The **final feature screenplay** — 100 numbered scenes — is an editable workspace of its own, with
**all 100 numbered scenes and the six inserted scenes (25A, 27A, 53A, 63A, 82A, 99A) boarded as 307 numbered shots** — the first boarding (1–240) in screenplay order, then coverage (241–286) of the named beats the first boarding left: the opening seven (shots 1–68), the hotel call and Tokyo streets of scenes 72–76 (shots 69–86), the envelope and the notebook of scenes 77–79 (shots 87–95), Jack and Ishida in scene 80 (shots 96–101), the cassette and the witness in scenes 81–82 (shots 102–110), Kurose and the storeroom in scenes 83–84 (shots 111–120), the raid on the Hive in scenes 85–88 (shots 121–129), the escape in scenes 89–92 (shots 130–138), Ishida's last night in scenes 93–96 (shots 139–147), the ground-breaking at the Hive in scene 97 (shots 148–154), the ending in scenes 98–100 (shots 155–161), Kanda revisited in scenes 8–12 (shots 162–170, numbered in boarding order), the roadside inn (shots 171–180), the Hive first seen in scenes 13–17 (shots 181–190), scenes 18–71 (shots 191–240), the later coverage passes (241–286), the inserted scenes 25A, 27A and 63A (287–296), and story pass 2's boards — 53A, 82A and 99A with the scenes 96–99A coverage (297–307), eight of which hold honest placeholder cards naming the files they await. Everything is carried page by page from
[`Neonoire (3).fountain`](<Neonoire (3).fountain>) (the earlier
[`Neonoire_Opening.fountain`](Neonoire_Opening.fountain) remains only as the opening extract).

- **The draft is the script.** The Screenplay tab shows it scene by scene — one page per numbered
  scene, in [`docs/neonoire/screenplay/`](docs/neonoire/screenplay/); `npm run split:neonoire`
  regenerates those pages and `npm run build:neonoire` refuses to build unless they rebuild the
  fountain byte for byte. The only change the workspace makes to the text is dropping its own
  ` #1#` … ` #100#` scene markers, so every scene selects its own slugline in the screenplay
  navigator. Every scene of the draft is now boarded; **WRITTEN, NOT BOARDED** survives only as the marker the board used before it closed on 26 September 2026.
- **Every image is 16:9.** From the final screenplay onward, keyframes are generated **16:9
  full-bleed, 1920×1080** — no scope, no letterbox; the Neo-Noir Tokyo style block opens at that
  shape. The older 2.39:1 studies on disk (cold-open shots 11–28, scene 3, early keys) are marked
  revision-pending and regenerate at 16:9; nothing is cropped to fake it.
- **Every shot declares its grammar.** [`docs/neonoire/scenes/`](docs/neonoire/scenes/) is the numbered
  board (Kanda backstreet 18 shots, the small bar 10, Vera's building 4, her apartment 10, the police
  station counter 8, the interview room 9, the detectives' room 6): shot type, lens, camera angle,
  movement, cast, lighting, a working duration, the keyframe filename, and the direction — with the
  draft's own words quoted per shot, checked against the fountain at build time.
- **Keyframes use at most ten generations per session.** Every frame is an AI-generated draft study
  held to a continuity sheet: Mara and Vera Voss are both American — blonde, blue eyes, told apart by
  hair, wardrobe and the umbrella. **Jack (48)** is a white American former detective (recast 25 September 2026);
  **Daniel Voss**, not Jack, is their father in the scene 4 photograph. Frames whose study has not been generated yet are labelled placeholders that name the file
  they are waiting for, never a neighbour's picture.
- **Nothing is explained**, because the film does not explain it: what the key opens, what the men are
  counting towards, and what a clock that runs a minute fast is doing in a police station are all left
  where the draft leaves them.

**Latest session — story pass 2 boards and escape retakes (29 September 2026):** the board half of story pass 2. **Six escape frames regenerated in place** under their stable filenames — the landing door with the old woman's torch, the candlelit kitchen, the enfilade of doorways, the ladder and the shutter, her hand in his on the rail (a drifted first call was retaken the same session), and the empty ladder — releasing the last of the Needs review frames (`rewrite-pending.mjs` is empty; scene 91 joined the Hive canon, the retired walkway art gone). **Scenes 83, 84, 96 and 97 corrected** (the folder, the bag and the evidence exchange, the phone call, the crawl insert with Harada) and **53A, 82A and 99A boarded** as shots 297–307, with three hero frames generated (297 the glass office, 301 the bar of light, 305 the plaza) and eight honest placeholders carrying self-contained briefs. See the [ledger](docs/neonoire/passes/story-pass-2-boards.md), [escape review sheet](public/images/neonoire/reviews/escape-retakes-pass-1.jpg) and [story-pass-2 review sheet](public/images/neonoire/reviews/story-pass-2-boards.jpg).

**Previous session — looks, masks and paper props:** three more sheets — **Vera's wine-red dress** (`vera-look-b.jpg`, the costume of the fifteen street frames), **Mara's hiding look** (`mara-hiding.jpg`, borrowed cardigan, no clip) and **the masked men's raid costume** (`masked-man.jpg`) — plus six clean prop masters in `props/`: the four-line card, the DANIEL VOSS clipping, the 87 tag, the 金子 sign board, the MONTHLY. YEARLY. NO QUESTIONS. board and the 8:52 service-road sign, every letter read at full size before install. One call died on a stale reference path and was re-listed and retaken, per the house rule. See the [ledger](docs/neonoire/passes/looks-masks-props.md) and [review sheet](public/images/neonoire/reviews/looks-masks-props-pass-4.jpg).

**Previous session — the cast-sheet pass:** with the board complete and two retake passes closed, the session's ten generations went to identity sheets in the house layout — three full-body views on mid-grey plus a face crop — for **Kaneko, Okada, Kurose, Mr. and Mrs. Noda, the radio repairman, Harada and the young detective**, plus **Vera's Look F** (teal peacoat, red bird clip), the film's last costume. The first repairman sheet was discarded because it described him from memory instead of from `s87/124`; the retake carries his round glasses and grey cardigan. Every sheet is asserted 16:9 in verify. See the [cast-sheet ledger](docs/neonoire/passes/cast-sheets.md) and [review sheet](public/images/neonoire/reviews/cast-sheets-pass-3.jpg).

**Previous session — consistency retakes two:** ten generations against the carried caveats, six installed retakes. **One barber pole** on the cold-open street in 170, 247 and 248, and the strap stays caught on the metal edge with Jack's hand open and off it — he doesn't touch it. **The inn's upstairs corridor is the lobby's 1975 wood** in 261: cream plaster, wood trim, plain cold ceiling light, no shoji and no paper lantern in the cold. **The card prints what the draft prints** — JACK. INVESTIGATIONS. with its katakana line over a Tokyo address. **Three customers** at the lunch counter with Vera on the third stool, and **the walkway rail waist-high** over the drop in 267. Four calls went to correcting a seam, a held strap, a surviving pole and a lantern; every one is logged. See the [retake ledger](docs/neonoire/passes/consistency-retakes-2.md) and [review sheet](public/images/neonoire/reviews/consistency-retakes-pass-2.jpg).

**Previous session — consistency retakes one:** the board was complete at 269 shots, so the session's ten generations went to the director's standing instruction — scene and character consistency. Eight installed retakes: **the third stool is now one motif** across shots 160, 161, 260 and 265 (teal peacoat, red clip) and 225 and 266 (charcoal coat), Vera on the third of six stools with two empty stools to her left; **one hand-painted sign** — the 金子 board from the sketchbook — in scene 100 and at the lunch counter; **Mr. Noda is one man** behind the inn counter in 178, 262 and 269, with the inn's CRT back on its shelf showing baseball; **Jack's hands are a weathered 48** in 259, with SHIOHAMA legible in full. One call was blocked by moderation and reframed once, per the house loop: the raid entry reads through raining plaster and the smashed case, no weapons in frame. See the [retake ledger](docs/neonoire/passes/consistency-retakes-1.md) and [review sheet](public/images/neonoire/reviews/consistency-retakes-pass-1.jpg).

**Earlier session — scenes 13–17 boarded, the Hive first seen:** ten new 16:9 shots. Mara hides in the storeroom with the phone glowing under a blanket and the 87 key in her fist. Mara's empty apartment and the sketchbook of the noodle counter. The Hive between glass towers, and **Jack climbing its outside stair** (the stair motif, going up into the past). The passages, and Kaneko's long look at the counter. The handoff now opens with a **consistency note for the next agent**. See the [scenes 13–17 ledger](docs/neonoire/passes/scenes-13-17.md) and [review sheet](public/images/neonoire/reviews/scenes-13-17-pass-1.jpg).

**Previous session — the roadside inn boarded: the stairs and the colour change:** ten new 16:9 shots from scenes 31–45, boarded ahead of order. **Two new standing rules.** First, the *Tokyo Story* **stairway motif**: a low, static camera square to the stairs, where going up is refuge and something coming up is danger. The inn's stair frame is shot twice from the same position, first warm with Mrs. Noda leading Jack up, then cold with a masked man climbing. Second, the **colour change**: the inn is a warm amber refuge until the four sedans turn in at scene 38, when everything turns steel blue and xenon white. **A perspective check is now a standing rule:** every image is checked for vehicle count and direction, screen direction, headcounts and architecture before it goes in. Shot 175 was regenerated after it caught the sedans facing away from the inn. See the [inn ledger](docs/neonoire/passes/roadside-inn.md) and the [warm/cold review sheet](public/images/neonoire/reviews/roadside-inn-pass-1.jpg).

**Earlier session — scenes 8–12 boarded, Kanda revisited:** nine new 16:9 shots. The bar by day, where Vera leaves the blue umbrella on purpose. Okada runs after her with the red bird clip. In Jack's office she finds the photograph face up, and Jack holds it by its edges. Past midnight, a photograph of Daniel Voss and a young Jack laughing under the noodle-shop sign. Then Jack is back on the cold open's street, standing where Mara stood. Vera wears her original look. See the [scenes 8–12 ledger](docs/neonoire/passes/scenes-8-12.md) and [review sheet](public/images/neonoire/reviews/scenes-8-12-pass-1.jpg).

**Earlier session — scenes 98–100 boarded, the ending:** seven new 16:9 shots. On the rooftop of Jack's building, on the first dry day of the film, Jack gives Vera the red bird clip and tells her Mara was sorry; she cries at the railing while he stands beside her. The Hive comes down, cut open like a cross-section, while Kaneko watches with the old sign in a blanket. At Kaneko's new counter under the arches a man's shadow falls across the floor, a second bowl is set out, and Vera doesn't turn. **Vera's coats are now different garments, not recolours:** Look E is a short oatmeal car coat ([`sheets/vera-look-e.jpg`](public/images/neonoire/sheets/vera-look-e.jpg)), and Look F is a teal peacoat. See the [scenes 98–100 ledger](docs/neonoire/passes/scenes-98-100.md) and [review sheet](public/images/neonoire/reviews/scenes-98-100-pass-1.jpg).

**Earlier session — scene 97 boarded, the Hive by morning:** seven new 16:9 shots. A ground-breaking tent stands in the rain in front of the Hive, and every TV in the shop window across the street shows Kurose. Prosecutors meet him at his car, and he walks twenty metres to a grey car without an umbrella. Vera, beside Kaneko, does not look away, and Jack watches alone. The ribbon on the silver shovel goes dark in the rain. **Vera changes to costume Look D** ([`sheets/vera-look-d.jpg`](public/images/neonoire/sheets/vera-look-d.jpg): a dark olive-green coat, a charcoal roll-neck, and her hair loose). From now on, every costume change brings a new coat coloured for its scene. Shot 140 was regenerated so the whole car is in frame. See the [scene 97 ledger](docs/neonoire/passes/scene-97.md) and [review sheet](public/images/neonoire/reviews/scene-97-pass-1.jpg).

**Earlier session — scenes 93–96 boarded, Ishida's last night:** nine new 16:9 shots. A black sedan waits outside the station in the rain, and Kurose pours Ishida tea in the back seat; he drinks it. The taillights recede exactly as in shot 13. The next morning a young detective clears the desk, finds the bottom drawer empty, and the clock still runs a minute fast. See the [scenes 93–96 ledger](docs/neonoire/passes/scenes-93-96.md) and [review sheet](public/images/neonoire/reviews/scenes-93-96-pass-1.jpg).

**Earlier session — scenes 89–92 boarded, the escape:** nine new 16:9 shots. Jack and Vera climb the stairwell in the dark, cross the rooftop in the rain and jump the gap to the railway walkway. A train roars past a metre from them (she doesn't pull away), and they end up on the street below the Hive with every window lit again. Vera is in Look C throughout. See the [scenes 89–92 ledger](docs/neonoire/passes/scenes-89-92.md) and [review sheet](public/images/neonoire/reviews/scenes-89-92-pass-1.jpg).

**Previous session — scenes 85–88 boarded, the raid on the Hive:** nine new 16:9 shots. Four masked men move in single file through the passages while doors close on them. Kaneko drops her shutter and stays behind, the radio repairman pulls the main switch, and flashlights find only the dark. Kaneko and the radio repairman are new cast cards. See the [scenes 85–88 ledger](docs/neonoire/passes/scenes-85-88.md) and [review sheet](public/images/neonoire/reviews/scenes-85-88-pass-1.jpg).

**Previous session — scenes 83–84 boarded:** ten new 16:9 shots. Vera faces Kurose on the fortieth floor ("It's just a face"), then finds Jack in the Hive storeroom beneath Mara's sketches until a voice outside says "Position." Kurose is a new cast card, and the storeroom has its first master. **Vera then changed costume**, to Look C ([`sheets/vera-look-c.jpg`](public/images/neonoire/sheets/vera-look-c.jpg): an ink-navy coat, a grey crew-neck over a white collar, and her hair in a knot), across all nine of her frames in scenes 83–84. See the [scenes 83–84 ledger](docs/neonoire/passes/scenes-83-84.md) and [review sheet](public/images/neonoire/reviews/scenes-83-84-pass-1.jpg).

**Previous session — scenes 81–82 boarded:** nine new 16:9 shots. Okada hands Jack the SHIOHAMA cassette in the bar by day, and Harada plays it in the Toto Shimbun newsroom, where Jack offers himself as the witness. Okada and Harada are new cast cards. Shot 108 keeps its original tape image, at the director's choice. See the [scenes 81–82 ledger](docs/neonoire/passes/scenes-81-82.md) and [review sheet](public/images/neonoire/reviews/scenes-81-82-pass-1.jpg).

**Previous session — scenes 77–79 boarded, Jack recast:** nine new 16:9 shots — Jack's office under one lamp, the unnamed envelope at Vera's door at dawn, DANIEL VOSS inside the cover, and the scene 4 room at dawn with two empty cups. **Jack is now a white American** with a regenerated identity sheet; the recast has since been applied to scene 74's three Jack frames, and scene 80 (the detectives' room by day) is boarded as six more shots. See the [scenes 77–79 ledger](docs/neonoire/passes/scenes-77-79.md) and [review sheet](public/images/neonoire/reviews/scenes-77-79-pass-1.jpg).

**Previous revision — scenes 72–75:** *Tokyo Story* restraint in **colour**, with low level static
cameras, 50mm lenses (35mm for the distant aftermath), and Vera's makeup intact until rain.
**Ten generations delivered Jack's sheet plus nine new shot images; six replacement shots remain
labelled empty placeholders.** Old street studies are not reused. See the
[revision ledger](docs/neonoire/passes/tokyo-streets-revision.md) and
[review sheet](public/images/neonoire/reviews/tokyo-story-72-75-pass-1.jpg).
Existing frame IDs and asset names remain stable despite the two inserted hotel shots.

Open the workspace from **Templates → NEONOIRE → Open the final screenplay** (the card opens the
Screenplay tab) or import
[`public/projects/neonoire-opening.json`](public/projects/neonoire-opening.json) with **Import project**.

```bash
npm run split:neonoire            # regenerate the 100 screenplay pages from the draft
npm run build:neonoire            # rebuild the bundle, and list every keyframe still to generate
npm run verify:neonoire           # offline: pages, schema, screenplay map, lenses, CSV, prompts
node scripts/neonoire/build-project.mjs --check   # fail if the bundle has drifted
```

Notes on the workspace live in [docs/neonoire/README.md](docs/neonoire/README.md); the Neo-Noir Tokyo
style block and negative prompt are defined in [src/lib/styles.ts](src/lib/styles.ts), the nine studio
keys are in `public/images/neonoire/keys/`; and [docs/neonoire/handoff.md](docs/neonoire/handoff.md) plus
[docs/neonoire/passes/](docs/neonoire/passes) carry everything needed to generate the remaining
keyframes, one pass of ten at a time.

## Let the Raptures Commence

The current **8 × 45min British black comedy** series prompt is integrated as an editable
workspace, not just a folder of images:

- **42 scenes and outlines, 526 numbered shots, 27 cast entries**, eight episode
  outlines that are not eight completed scripts — and **one completed script: episode one**. Cast links are reciprocal; the woman at
  Number Fourteen is kept separate from Pat, the rescued blank from Alan, and Graham
  (the interview's contented blank, now an episode-three scene) from both.
- **Episode One is written.** [`docs/rapture/ep1-screenplay.md`](docs/rapture/ep1-screenplay.md)
  is the screenplay draft of 21 September 2026, and the Screenplay tab carries it verbatim as
  eight per-scene pages in [`docs/rapture/screenplay/`](docs/rapture/screenplay/): the cold open on
  the side street, St Jude's and the rapture at breakfast, the cops in the supermarket car park,
  `ST JUDE'S - AFTER`, Martin at the storage facility (`SUPER: THREE MONTHS EARLIER`), Danny and
  Jodie, the cops at night and the 1980 tag. `npm run build:rapture` fails unless the pages rebuild
  the draft byte for byte; `node scripts/rapture/split-ep1-screenplay.mjs` regenerates them after an
  edit to the draft.
- **Episode One's boards are older than its script and are not re-boarded.** The mugging (19 shots),
  St Jude's (19) and washing up (26 shots, FIX 4 — the pendant is her mother's and she always had it,
  shot 18 cut and holding its slot) were written against earlier versions of those scenes, and the
  cops' first beat, the storage facility and the tag have no board at all — they are marked
  **WRITTEN, NOT BOARDED**. Episode one is still 9 scenes, 134 shots and about 820 seconds of
  animatic estimates, with Danny and Jodie (21 shots) and the cops' second beat (6 shots, exactly
  ninety seconds) matching the draft beat for beat.
- **Episode Four:** the Pat-and-Malcolm cold open at dusk (16 shots) running continuously
  into Scene 2, the old-lady sequence (35 shots); the scout hut (17 shots); **Number
  Fourteen** (13 shots); then Nina's thread, retained and fully boarded — the housing
  estate at dusk (36 shots), the doorstep (32 shots) and the kitchen (23 shots, 21 studied),
  which is where the machine goes into the back of the bus for good.
- **Episode Five:** the therapy class (26 shots, moved from episode six so the
  maintain-order doctrine has time to harden, with its three protections asserted in the
  builder and the verifier) and the night at Pat's (51 shots, 39 studied), which replaces
  the earlier Pat's-house coverage and the basement, rescue and scent outlines. No CCTV
  anywhere and two grammars only.
- **Also numbered:** the episode-three angels (15 shots), Graham's interview (17 shots) and
  the first wrong lockup (31 shots, one dedicated keyframe each).
- **The screenplay is the workspace's running order:** all twenty written scenes — episode one's
  eight draft pages plus the twelve numbered scene documents from episode two's first wrong lockup
  through episode five's night at Pat's — are concatenated in episode order, so the scene navigator,
  the storyboard and the episode export walk the script the same way. Clicking a scene selects its
  own slugline (two scenes share `INT. THE SCOUT HUT` and are still told apart, and episode one's
  two parked police cars are told apart by day and night), and the twenty-two scenes that are still
  outlines are marked **Outline** in the navigator and say they have no page instead of landing in
  another episode's scene. A block starts at an `EPISODE …` line at column 0, so the draft's indented
  `Episode One` title line stays text and never splits a scene in two.
- The complete bible in Notes, a six-object brainstorm map, and sixteen visual-reference
  boards. Every shot still to generate is an honest placeholder card that names the missing
  file rather than borrowing a neighbouring study.
- Exact scripted pauses; other durations are visibly marked as **working estimates**.
  Scene/shot lighting direction survives save, import, CSV and prompt generation.

In an existing workspace: **Templates → Let the Raptures Commence → Open series workspace**.
This inserts the bundled project only if absent; re-opening it never overwrites edits,
other projects or share settings. Deletion is respected until you explicitly open it again.
The built-in project ID is `74a9cb34-9e80-4a04-a614-000000000014`.

For an independent copy, import
[`public/projects/let-the-raptures-commence.json`](public/projects/let-the-raptures-commence.json)
using **Import project**. No external image host or credentials are needed.
Export → Project backup preserves subsequent edits.

Episode four's Nina thread and episode five's restructure are both current and are **not**
merged into one another: the kitchen still ends with the terminal going into the back of the
bus, and the night at Pat's still puts Neil in the cellar under the stairs. That boundary is
recorded in the canon index rather than silently resolved.

Sources and continuity decisions are indexed in [`docs/rapture/canon.md`](docs/rapture/canon.md),
including what episode one's draft changes against the older boards and the boundaries it leaves
open (the tag's `MONTHS LATER` against the bible's five years, `THREE MONTHS EARLIER` against eight
weeks in Max's room, and `GABE HOLLAND` on the auction sheet).
The latest bible supersedes the old sodium/teal and wide Crane boards. The two old
wide framings in Number Fourteen are tightened; all dialogue and pauses remain unchanged,
and the original scene is archived. New images are **draft AI studies**, not approved coverage;
check the review pointers in the shot notes before approving any of them.

```bash
npm run build:rapture             # regenerate the JSON from the bible, script and production plan
node scripts/rapture/split-ep1-screenplay.mjs   # re-split the episode-one draft into its eight pages
npm run verify:rapture            # offline fidelity/schema/assets/prompts/CSV/persistence checks
npm run verify:rapture -- --live   # also check every app tab and image; dev server must be running
npm run verify:rapture:browser     # real desktop/mobile form, template and reload checks
```

The browser check needs `npx playwright install chromium` (or `BROWSER_EXECUTABLE_PATH`).
It edits only a disposable imported copy and removes it afterwards. Screenshots go to
ignored `artifacts/`; the offline check and production build run in CI.

`NODE_ENV=test FRAME_LOCAL_DB_FILE=...` selects an isolated file for tests of the
no-Postgres adapter. The default remains `/tmp/arena_projects.json`; export a backup
for work you need to retain outside that local runtime. The committed series bundle is
always reproducible and never depends on that temporary file.

## If images don't appear after cloning / uploading to GitHub

The app's pictures live in **`public/images/`** (and fonts in `public/fonts/`). They are ordinary files that must be in the repo.

Check the folder exists in your GitHub repo and contains these files:

```
public/images/
  lighting/
    natural-daylight.jpg  golden-hour.jpg  blue-hour.jpg  overcast-soft.jpg
    low-key.jpg  high-key.jpg  practical-night.jpg  backlit-silhouette.jpg
  shots/
    establishing.jpg  extreme-wide.jpg  wide.jpg  full.jpg  medium-wide.jpg  medium.jpg
    medium-close-up.jpg  close-up.jpg  extreme-close-up.jpg  insert.jpg
    over-the-shoulder.jpg  two-shot.jpg  over-the-shoulder.svg  two-shot.svg
    pov.svg  aerial.svg
  styles/
    cinematic-realistic.jpg  anime.jpg  comic-book.jpg  animation-3d.jpg  watercolor.jpg
    film-noir.jpg  cyberpunk.jpg  claymation.jpg  pixel-art.jpg  oil-painting.jpg
    classic-cartoon.jpg  documentary.jpg  rotoscoped.jpg  ukiyo-e.jpg  line-art.jpg
    poster.jpg  super8.jpg  synthwave.jpg  charcoal.jpg  collage.jpg
    ghibli.jpg  manga.jpg  hanna-barbera.jpg  isometric.jpg  art-deco.jpg
    impressionist.jpg  pop-art.jpg  stained-glass.jpg  technicolor.jpg  polaroid.jpg
    neo-noir-tokyo.jpg
  templates/
    short-film.jpg  feature-film.jpg  documentary.jpg
public/fonts/   (six .ttf files: DM Sans 400/500/600/700, Instrument Serif regular + italic)
```

The `styles/` pictures are the example thumbnails for the thirty-one visual styles (Realistic, Anime,
Comic, 3D Animation, Watercolor, Film Noir, Cyberpunk, Claymation, Pixel Art, Oil Painting,
Classic Cartoon, Documentary, Rotoscoped, Ukiyo-e, Line Art, Mid-century Poster, Super 8,
Synthwave, Charcoal, Paper Collage, Studio Ghibli, Manga, Hanna-Barbera, Isometric, Art Deco,
Impressionist, Pop Art, Stained Glass, Technicolor, Polaroid, Neo-Noir Tokyo) shown in the prompt studio. If one
is missing the tile falls back to its colour swatch.

The prompt studio (Storyboard → "Prompts", or any frame's AI-prompt tab) lets you pick a look,
choose a model, select any set of shots — from one scene or the whole project — and copy or
download all of their prompts in a single batch.

The lighting photos are optional: if one is missing the lighting tile falls back to its own
colour swatch, and the app never shows a broken image. Pictures from earlier versions
(`/images/coastal-road.jpg`, `/images/lighthouse.jpg`, …) are mapped to the current library
automatically, so projects saved back then still look right.

Common causes when they are missing:

1. **The download skipped binaries.** Many "download project" / "export code" options only include text files. Re-download as a full ZIP, or copy the `public/` folder from the running preview.
2. **Drag-and-drop upload on github.com ignores folders.** Uploading via the browser flattens or drops nested directories. Use `git` from a terminal instead:
   ```bash
   git add -A
   git commit -m "Add public assets"
   git push
   ```
3. **A `.gitignore` rule excluded them.** This repo's `.gitignore` deliberately keeps `public/` in git — make sure nothing in your own global gitignore matches `*.jpg` or `public`.

A quick way to confirm from a terminal in the repo:

```bash
git ls-files public/images            # should list every file from the table above
npm run check:assets                  # every referenced picture and font is on disk
node scripts/verify7.mjs              # …and every one of them is actually served
```

If a picture is missing at runtime the app now shows a labelled placeholder instead of a broken icon, and `npm run check:assets` lists exactly which files are absent.

## Useful scripts

| command | what it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` / `npm start` | production build and serve |
| `npm run check:assets` | verifies every image the code references exists on disk |
| `npm run export:episode -- --episode 1` | exports one episode of the series to a folder (`exports/episode-1/`): a single `episode-1.json` with the episode, scenes, shots, keyframes, screenplay, cast and mood boards, plus copies of every keyframe and the screenplay sources — the scene's own page first (`screenplay.kind: "page"`) and the numbered shot documents the storyboard was built from beside it (`storyboardSources`, `kind: "board"`). `--out`, `--project`, `--json-only` and `--clean` are available; `--help` lists them |
| `npm run export:episode -- --reel` | the same export as **one self-contained file**, `exports/episode-1/reel.json`: no `images/` or `screenplay/` folder beside it, every keyframe and cast sheet embedded as a base64 data URI and the screenplay inlined (7 MB for episode 1, from 22 MB of images). Images are re-encoded to `--reel-width` (default 800px, JPEG `--reel-quality` 62) first — needs ImageMagick (`magick`/`convert`) on PATH, otherwise the originals are embedded as-is. `--reel-full` embeds untouched originals, `--name` renames the file |
| `npm run verify:features` | checks the AI prompt models, the thirty-one visual styles, drives the real screenplay editor's undo/redo in jsdom, and maps every written scene in the bundled projects onto its own page of the screenplay (no server, no browser needed) |
| `npm run verify:features:live` | the same, plus a check that `/?tab=screenplay` server-renders (needs the dev server running) |
| `node scripts/verify7.mjs` | checks assets, the lighting library, every shot reference and the relationship screens (needs the dev server running, no browser required) |
| `node scripts/verify6.mjs` | the same ground covered through a real browser, with screenshots (needs Playwright) |
| `npx drizzle-kit push` | apply schema changes to the database |

## Character relationships, lighting and shot references

- **Shot types** — all fourteen shot types (from Establishing to Aerial) carry a photographic reference
  that matches the framing: twelve stills, plus a framing diagram for POV and Aerial where camera
  position matters more than lens length. Over-the-shoulder and Two-shot show a photo with their
  diagram tucked into the corner. Changing a shot type updates the frame image automatically while
  the frame is still using a library reference.
- **Lighting** — eight looks (natural daylight, golden hour, blue hour, overcast soft, low key, high key,
  practical night, backlit silhouette) each with a reference photograph, shown in the Shot design tab of
  a frame and as a scene default in the scene dialog. New frames inherit their scene's light; shots can
  override it. The chosen look and its full description go into the AI prompt.
- **Relationships** — link cast members from a character card (parent, sibling, mentor, rival, estranged…)
  or with **Add a relationship** on the Relationships tab. Every link is stored on both cards with the
  correct wording on each side ("Thomas is Ella's parent", "Ella is Thomas's child"), so the cast cards,
  the map, the pair-by-pair list and the per-character storylines all agree. Links are named in AI prompts
  when both people share a shot.
- **Deep links** — `/?project=<id>&tab=relationships` opens straight onto a project and a section
  (sections: `overview`, `screenplay`, `characters`, `relationships`, `storyboard`, `shot-list`, `notes`,
  `brainstorm`, `mood-boards`).

## Editing on the web

Every section can be opened by URL, and the address bar follows the tab you click, so a link always
sends someone to the screen you were looking at.

## Data

Everything is stored in one PostgreSQL table (`film_projects`) as JSON columns. **Export → Project backup** downloads a `.json` you can re-import from the sidebar or the projects screen, so work is portable between installs.
