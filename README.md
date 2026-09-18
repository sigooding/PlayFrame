# frame.

A writer/director's pre-production studio: screenplay, acts & sequences, cast with a relationship map, storyboard with a shot-type library and a lighting library, shot list, mood boards, brainstorm map, and AI video-prompt generation (MiniMax Hailuo, Seedance, Kling, Runway, Veo).

## Run it locally

```bash
npm install
cp .env.example .env         # then point DATABASE_URL at your PostgreSQL
npx drizzle-kit push         # creates the film_projects table
npm run dev                  # http://localhost:3000
```

The first load seeds a sample film ("The Last Light") so every screen has something in it.

## If images don't appear after cloning / uploading to GitHub

The app's pictures live in **`public/images/`** (and fonts in `public/fonts/`). They are ordinary files that must be in the repo.

Check the folder exists in your GitHub repo and contains these files:

```
public/images/
  cliffside.jpg  coastal-road.jpg  letter.jpg  lighthouse-path.jpg  lighthouse.jpg  woman-car.jpg
  lighting/
    natural-daylight.jpg  golden-hour.jpg  blue-hour.jpg  overcast-soft.jpg
    low-key.jpg  high-key.jpg  practical-night.jpg  backlit-silhouette.jpg
  shots/
    establishing.jpg  extreme-wide.jpg  wide.jpg  full.jpg  medium-wide.jpg  medium.jpg
    medium-close-up.jpg  close-up.jpg  extreme-close-up.jpg  insert.jpg  low-key.jpg
    over-the-shoulder.svg  two-shot.svg  pov.svg  aerial.svg
public/fonts/   (six .ttf files)
```

The lighting photos are optional: if one is missing the lighting tile falls back to its own
colour swatch, and the app never shows a broken image.

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
```

If a picture is missing at runtime the app now shows a labelled placeholder instead of a broken icon, and `npm run check:assets` lists exactly which files are absent.

## Useful scripts

| command | what it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` / `npm start` | production build and serve |
| `npm run check:assets` | verifies every image the code references exists on disk |
| `node scripts/verify6.mjs` | checks relationships, lighting and shot-reference images (needs the dev server running) |
| `npx drizzle-kit push` | apply schema changes to the database |

## Character relationships, lighting and shot references

- **Shot types** — all fourteen shot types (from Establishing to Aerial) carry a photographic reference
  that matches the framing. The four camera-position shots (over the shoulder, two-shot, POV, aerial)
  also show a small framing diagram on the corner of the photo.
- **Lighting** — eight looks (natural daylight, golden hour, blue hour, overcast soft, low key, high key,
  practical night, backlit silhouette) each with a reference photograph, shown in the Shot design tab of
  a frame and as a scene default in the scene dialog. New frames inherit their scene's light; shots can
  override it. The chosen look and its full description go into the AI prompt.
- **Relationships** — link cast members from a character card (parent, sibling, mentor, rival, estranged…).
  Links are stored on both cards with the correct wording on each side, appear as chips on the cast cards,
  render as a map on the **Relationships** tab, and are named in AI prompts when both people share a shot.

## Data

Everything is stored in one PostgreSQL table (`film_projects`) as JSON columns. **Export → Project backup** downloads a `.json` you can re-import from the sidebar or the projects screen, so work is portable between installs.
