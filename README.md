# frame.

A writer/director's pre-production studio: screenplay, acts & sequences, cast with a relationship map, storyboard with a shot-type library, a lighting library and a thirty-look visual style library, shot list, mood boards, brainstorm map, and a prompt studio that batches any set of shots into ready-to-paste prompts for video (MiniMax H3, Seedance, Kling, Runway, Veo) and image models (SDXL, SD 1.5, SD 3.5, Krea 2, FLUX, Midjourney, DALL-E, Leonardo, Ideogram) in thirty visual styles (Realistic, Anime, Comic, 3D Animation, Watercolor, Film Noir, Cyberpunk, Claymation, Pixel Art, Oil Painting, Classic Cartoon, Documentary, Rotoscoped, Ukiyo-e, Line Art, Mid-century Poster, Super 8, Synthwave, Charcoal, Paper Collage, Studio Ghibli, Manga, Hanna-Barbera, Isometric, Art Deco, Impressionist, Pop Art, Stained Glass, Technicolor, Polaroid).

## Run it locally

```bash
npm install
cp .env.example .env         # then point DATABASE_URL at your PostgreSQL
npx drizzle-kit push         # creates the film_projects table
npm run dev                  # http://localhost:3000
```

The first load seeds the existing sample projects plus **Let the Raptures Commence**.
The series opens by default when present; an explicit `?project=<id>` always wins.

## Let the Raptures Commence

The current **8 × 45min British black comedy** series prompt is integrated as an editable
workspace, not just a folder of images:

- **42 scenes and outlines, 525 numbered shots, 22 cast entries**, and eight episode
  outlines that are not eight completed scripts. Cast links are reciprocal; the woman at
  Number Fourteen is kept separate from Pat, the rescued blank from Alan, and Graham
  (the interview's contented blank, now an episode-three scene) from both.
- **Episode One, revised running order (about 42 minutes before the tag):** washing up
  (26 shots, FIX 4 — the pendant is her mother's and she always had it, shot 18 cut and
  holding its slot), Danny and Jodie's first appearance (21 shots, moved here from episode
  two) and the cops' second beat (6 shots, exactly ninety seconds), with Martin's storage
  unit marked as a pre-rapture flashback.
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

Sources and continuity decisions are indexed in [`docs/rapture/canon.md`](docs/rapture/canon.md).
The latest bible supersedes the old sodium/teal and wide Crane boards. The two old
wide framings in Number Fourteen are tightened; all dialogue and pauses remain unchanged,
and the original scene is archived. New images are **draft AI studies**, not approved coverage;
check the review pointers in the shot notes before approving any of them.

```bash
npm run build:rapture             # regenerate the JSON from the bible, script and production plan
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
  templates/
    short-film.jpg  feature-film.jpg  documentary.jpg
public/fonts/   (six .ttf files: DM Sans 400/500/600/700, Instrument Serif regular + italic)
```

The `styles/` pictures are the example thumbnails for the thirty visual styles (Realistic, Anime,
Comic, 3D Animation, Watercolor, Film Noir, Cyberpunk, Claymation, Pixel Art, Oil Painting,
Classic Cartoon, Documentary, Rotoscoped, Ukiyo-e, Line Art, Mid-century Poster, Super 8,
Synthwave, Charcoal, Paper Collage, Studio Ghibli, Manga, Hanna-Barbera, Isometric, Art Deco,
Impressionist, Pop Art, Stained Glass, Technicolor, Polaroid) shown in the prompt studio. If one
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
| `npm run verify:features` | checks the AI prompt models, the thirty visual styles, and drives the real screenplay editor's undo/redo in jsdom (no server, no browser needed) |
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
