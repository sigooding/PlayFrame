# The cold open (working title)

A second bundled project, separate from Nobody's Witness. Open it from **Templates → "Untitled: the cold open"**; it adds itself once and never overwrites your edits.

- **Source:** `docs/hangar/cold-open.fountain` is the screenplay. `npm run build:hangar` regenerates `public/projects/hangar-cold-open.json` from it (every shot's script quote must exist in the pages); `npm run verify:hangar` checks the bundle.
- **Contents:** 8 scenes, 39 shots, 7 cast cards, notes (the look, the seeds, the rules, the open questions) and brainstorm cards. **10 of the 39 shots now carry their own draft keyframes** (shots 4-13, the hangar and the cab); the rest still hold their slot and say they need review. Nothing is borrowed from Nobody's Witness.
- **Rules from the brief:** nobody says alien, robot or UFO; flares, never flashlight beams; one recording of "three quick, one slow" used in 1944, in the trailer and in the woods; never show what the pilot shot or what was in the crate.
- **Open:** the title; the number of uncrossed marks (the film's clock); why it moves now; whether the airman crosses sides; whether the sergeant is the old pilot.
- **Image rule:** the project's own pictures will live under `public/images/hangar/`. The never-overwrite, archive and `verify:images` rules in `CLAUDE.md` apply to them from the first picture.

## Style and shot details (7 October 2026)

- **House style:** `hangar`, shown as **Painted Americana '75** in every style picker (`src/lib/styles.ts`): the director's "Iron Giant mixed with Ghibli". Ghibli is the painted, layered, weather-heavy backgrounds; The Iron Giant is how the people are drawn: plain, weighty, strong silhouettes, believable acting, 1950s-70s Americana. Every scene and every shot carries it; the AI-prompt tab now opens on a shot's own style (then its scene's) instead of always starting on Cinematic Realistic. Its example picture borrows the Ghibli one until a real one is made.
- **Every shot has:** shot type, lens, movement, angle, lighting (library look plus its own **lighting direction**), a **mood**, a deliberately chosen **transition** (the hangar *fades in* out of the black; the swerve is a *smash cut*; the knock is a *J-cut*), and in its notes a **Sound:** line, a **Framing:** line, any spoken lines as `NAME: (delivery) words` cues, the script quote, and the style.
- **Why the notes are laid out that way:** the video prompts read them. Lines of the form `NAME: words` become spoken dialogue; the first line that mentions sound becomes the soundscape. So the labels `Sound:`, `Framing:` and `Style:` are mixed case on purpose, and the sound line comes first. Scene descriptions say where we are and what the light is doing, not what happens, because each is appended to every shot's prompt.
- **The look note** ("The look: Painted Americana '75") is the one the prompt builder quotes for its palette line; keep its first two sentences visual. The rules note is titled so it does not match the builder's look/style/palette search.
- **Checks:** `npm run verify:hangar` asserts the style on every scene and shot, mood, lighting direction, transitions, and that prompts for all 15 platforms carry the style and never name the thing in the crate.
- **The cards show the app's stock shot-type pictures** (a lighthouse for Establishing and so on) until real pictures replace them; those are library references, not this film's pictures.

## First pictures (7 October 2026)

Ten generations, the session budget, on the first ten picturable shots in screenplay order: **4** the base from above, **5** the guard-booth television, **6** the crate stencilled WRIGHT FIELD 1944 - INERT, **7** the cup set into the ring worn in the lid, **8** the hand flat on the lid, **9** the clipboard and the signature, **10** past the weigh station, **11** the two-lane into the hills with the sedan a quarter mile back, **12** the cab, **13** both men looking back at the trailer.

- Installed 16:9 full-bleed **1920x1080** under `public/images/hangar/s2/` and `s3/`, filenames `<shot number>-<slug>.jpg`. Shot 4 is also the project's cover image.
- Generated from the screenplay, the shot card and the house-style block alone — no reference from any other project. Status **Draft**, not Ready.
- **Shots 1-3 will never have a picture:** the 1944 radio exchange is held black by design, and their cards now say so instead of "no picture yet". `verify:hangar` asserts it.
- The builder's `images` map (`scripts/hangar/build-project.mjs`) is the one place a delivered frame is declared; the verifier checks each file exists, is under `/images/hangar/`, and is marked Draft.
- The never-overwrite rule now binds these ten: a retake gets archived to `public/images/hangar/archive/` first.
- Contact sheet: `public/images/hangar/reviews/first-pictures-2026-10-07.jpg`.
- Next: shots 14-23 (the missed knock, the swerve, the cap and the mirror, the fall).
