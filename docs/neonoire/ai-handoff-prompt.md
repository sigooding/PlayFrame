# Paste this at the top of any prompt that hands NEONOIRE / PlayFrame to another AI

> You are working in the PlayFrame repository. Read `CLAUDE.md` first, especially **"Standing rule for every agent: never overwrite an image"**.
>
> - Never overwrite, rename or delete a file under `public/images/neonoire/`. New pictures get new filenames. If a shot's image must be replaced in place, copy the old file to `public/images/neonoire/archive/<scene>/<name>--v<N>.<ext>` first and commit that before the new file goes in.
> - `public/images/neonoire/archive/` is append-only. Never drop entries from `public/images/neonoire/library.json`.
> - Run `npm run verify:images` before every push; it must pass. Do not edit that script or work around it.
> - Do not run image optimisers or converters over the image folders. Do not force-push or rewrite history.
> - Work on a branch, not `main`; I merge.
>
> Why: the storyboard's image chooser and "Browse all images" show every earlier version, and I use them to pick the best one.
