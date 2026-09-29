# NEONOIRE — recorded dialogue

Voices are generated with ElevenLabs (`eleven_v4`, which takes emotion tags such as `[tired]`, `[whispers]`, `[groggy]`), then stored in the repo so nothing depends on ElevenLabs links (they expire after two hours).

| Piece | Where |
| --- | --- |
| Which voice speaks each character | [`voices.json`](voices.json) |
| Every recorded line (frame, text, file, offset, voice, model) | [`manifest.json`](manifest.json) |
| The audio files | `public/audio/neonoire/<scene>/<shot>-<character>-<words>.mp3` |
| Attaches lines to frames at build time | `scripts/neonoire/voice.mjs` (used by `build-project.mjs`) |
| Adds a take to the project | `scripts/neonoire/voice-ingest.mjs` |
| Builds the animatic with ffmpeg | `scripts/neonoire/animatic.mjs` |

## In the app

A frame can carry `audio`: a list of `{ id, character, text, src, offset, duration, voice, model }`. `src` must be under `/audio/`. The storyboard presentation plays each line at its offset while a frame plays (there is a "Dialogue on / Sound off" toggle), and the frame dialog lists the lines with players. Existing saved workspaces pick up new audio the next time NEONOIRE is opened, without touching anything else on a frame.

## Adding a line

1. Generate the take (v4 for emotion tags; a line is one take per speaker).
2. `node scripts/neonoire/voice-ingest.mjs --frame neonoire-shot-156 --character JACK --text "…" --file <mp3 or https URL> --offset 0.4 --model eleven_v4`
3. `npm run build:neonoire && npm run verify:neonoire` (the builder stretches a frame that is too short for its line).

## The animatic

`FFMPEG=/path/to/ffmpeg node scripts/neonoire/animatic.mjs --scene 98` (or `--from 96 --to 100`, or no flag for the whole film). Output: `exports/neonoire/` (not committed). ffmpeg: install it, or `pip install imageio-ffmpeg` for a static build.

## Rules

- Keep the script unchanged for voice work. Japanese-language lines are voiced in **English** for now, and Jack's too; characters who speak only Japanese use English placeholder voices.
- A voice is final only when its ID is in `voices.json`. Designed previews are short-lived and must be saved to the ElevenLabs library first.
- Never store a take only as a link. Ingest it.
- Recorded so far: two pilot lines in scene 98 (Jack's "she was sorry", Vera's "in the rain"), made with the older model; redo them in v4 when the cast is settled.
