# The cold open (working title)

A second bundled project, separate from Nobody's Witness. Open it from **Templates → "Untitled: the cold open"**; it adds itself once and never overwrites your edits.

- **Source:** `docs/hangar/cold-open.fountain` is the screenplay. `npm run build:hangar` regenerates `public/projects/hangar-cold-open.json` from it (every shot's script quote must exist in the pages); `npm run verify:hangar` checks the bundle.
- **Contents:** 8 scenes, 39 shots, 7 cast cards, notes (the look, the seeds, the rules, the open questions) and brainstorm cards. **13 of the 39 shots are boarded with pictures** (shots 1–13, scenes 1–3) as of 7 October 2026; the other 26 cards hold their slots, say they need review, and name the exact file they are waiting for. Nothing is borrowed from Nobody's Witness.
- **Rules from the brief:** nobody says alien, robot or UFO; flares, never flashlight beams; one recording of "three quick, one slow" used in 1944, in the trailer and in the woods; never show what the pilot shot or what was in the crate.
- **Open:** the title; the number of uncrossed marks (the film's clock); why it moves now; whether the airman crosses sides; whether the sergeant is the old pilot.
- **Image rule:** the project's own pictures live under `public/images/hangar/`, one folder per scene (`s1/`…`s8/`), named `<shot number>-<slug>.jpg`, **16:9 full-bleed at 1920×1080**. The never-overwrite, archive and `verify:images` rules in `CLAUDE.md` apply to them from the first picture.

## Style and shot details (7 October 2026)

- **House style:** `hangar`, shown as **Painted Americana '75** in every style picker (`src/lib/styles.ts`): the director's "Iron Giant mixed with Ghibli". Ghibli is the painted, layered, weather-heavy backgrounds; The Iron Giant is how the people are drawn: plain, weighty, strong silhouettes, believable acting, 1950s-70s Americana. Every scene and every shot carries it; the AI-prompt tab now opens on a shot's own style (then its scene's) instead of always starting on Cinematic Realistic. Its example picture borrows the Ghibli one until a real one is made.
- **Every shot has:** shot type, lens, movement, angle, lighting (library look plus its own **lighting direction**), a **mood**, a deliberately chosen **transition** (the hangar *fades in* out of the black; the swerve is a *smash cut*; the knock is a *J-cut*), and in its notes a **Sound:** line, a **Framing:** line, any spoken lines as `NAME: (delivery) words` cues, the script quote, and the style.
- **Why the notes are laid out that way:** the video prompts read them. Lines of the form `NAME: words` become spoken dialogue; the first line that mentions sound becomes the soundscape. So the labels `Sound:`, `Framing:` and `Style:` are mixed case on purpose, and the sound line comes first. Scene descriptions say where we are and what the light is doing, not what happens, because each is appended to every shot's prompt.
- **The look note** ("The look: Painted Americana '75") is the one the prompt builder quotes for its palette line; keep its first two sentences visual. The rules note is titled so it does not match the builder's look/style/palette search.
- **Checks:** `npm run verify:hangar` asserts the style on every scene and shot, mood, lighting direction, transitions, and that prompts for all 15 platforms carry the style and never name the thing in the crate.
- **The cards show the app's stock shot-type pictures** (a lighthouse for Establishing and so on) until real pictures replace them; those are library references, not this film's pictures.

## Pictures (7 October 2026)

First keyframe pass: **13/39**. `public/images/hangar/s1/` holds shots 1–3 as *rendered pure black
frames* — scene 1 is black in the screenplay, so the board shows black rather than a placeholder or
an invented picture. Shots 4–13 are AI-generated **draft** studies built from each shot's own
framing, lighting, mood and lens plus the `hangar` style prompt; none is approved, and shot 4 is the
head of the retake queue (it letters the building HANGAR 4, and the doors read too small).

`scripts/hangar/build-project.mjs` carries the delivered list in `keyframes` and the outstanding 26
in `pending`; the two must partition 1–39, and `npm run verify:hangar` asserts that, that every
delivered file is on disk at 1920×1080 with status **Draft**, and that every other card still holds
an honest placeholder. The ledger is [`passes/keyframes-1-2026-10-07.md`](passes/keyframes-1-2026-10-07.md).
