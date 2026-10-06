# The cold open (working title)

A bundled project beside Nobody's Witness. Open it from **Templates → "Untitled: the cold open"**; it adds itself once and never overwrites your edits.

- **Source:** `docs/hangar/cold-open.fountain` is the screenplay. `npm run build:hangar` regenerates `public/projects/hangar-cold-open.json` and picks up delivered shot art by its stable filename; `npm run verify:hangar` checks the bundle and image paths.
- **Contents:** 8 scenes, 39 shots, 7 cast cards, notes (the look, the seeds, the rules, the open questions) and brainstorm cards. The first visual pass currently pictures shots 1–12: shots 1–3 deliberately share an exact full-black matte, and shots 4–12 have original illustrated studies. The remaining slots stay empty until pictured. Every image is **Needs review**, not director-approved.
- **Story rules:** nobody says alien, robot or UFO; flares, never flashlight beams; one recording of "three quick, one slow" used in 1944, in the trailer and in the woods; never show what the pilot shot or what was in the crate.
- **Open:** the title; the number of uncrossed marks (the film's clock); why it moves now; whether the airman crosses sides; whether the sergeant is the old pilot.
- **Image rule:** project images live under `public/images/hangar/`. Keep every delivered image; add retakes under new filenames and archive before replacing anything. `npm run verify:images` also checks the Hangar tree.

## Reusable look: Painted Americana '75

The `hangar` style is available in the shared Visual Style picker, so future projects can reuse it. Its original style tile is `public/images/styles/painted-americana-75.jpg`; the setting-neutral rendering recipe lives in [`style-guide.md`](style-guide.md) and `src/lib/styles.ts`. That entry describes the painterly medium, grounded character drawing, warm practical light, cool shadows, and film finish without hard-coding this story's Ohio setting. Shot and scene text still supplies story-specific content.

Every scene and every shot in this project carries the style. The AI-prompt tab opens on a shot's own style (then its scene's) instead of always starting on Cinematic Realistic.

## Shot details and prompts

- **Every shot has:** shot type, lens, movement, angle, lighting (library look plus its own **lighting direction**), a **mood**, a deliberately chosen **transition** (the hangar *fades in* out of black; the swerve is a *smash cut*; the knock is a *J-cut*), and in its notes a **Sound:** line, a **Framing:** line, any spoken lines as `NAME: (delivery) words` cues, the script quote, and the style.
- **Why the notes are laid out that way:** video prompts read them. Lines of the form `NAME: words` become spoken dialogue; the first line that mentions sound becomes the soundscape. So `Sound:`, `Framing:` and `Style:` are mixed case on purpose, and the sound line comes first. Scene descriptions say where we are and what the light is doing, not what happens, because each is appended to every shot's prompt.
- **The look note** ("The look: Painted Americana '75") is the one the prompt builder quotes for its palette line; keep its first two sentences visual. The rules note is titled so it does not match the builder's look/style/palette search.
- **Saved work stays safe:** a later image pass fills only cards still marked with the original missing-image note. Custom images, deliberate blanks, and edited shot notes are preserved.
- **Checks:** `npm run verify:hangar` checks the style on every scene and shot, moods, lighting directions, transitions, prompt safety across all 15 platforms, image ownership, and safe filling of untouched saved-project slots.
