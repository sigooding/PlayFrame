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
| Packages voiced shots for lipsync / video generation | `scripts/neonoire/voice-export.mjs` |
| Superseded takes (kept, never deleted) | `docs/neonoire/voice/archive/` |

## In the app

A frame can carry `audio`: a list of `{ id, character, text, src, offset, duration, voice, model }`. `src` must be under `/audio/`. The storyboard presentation plays each line at its offset while a frame plays (there is a "Dialogue on / Sound off" toggle), and the frame dialog lists the lines with players. Existing saved workspaces pick up new audio the next time NEONOIRE is opened, without touching anything else on a frame.

## Adding a line

1. Generate the take (v4 for emotion tags; a line is one take per speaker).
2. `node scripts/neonoire/voice-ingest.mjs --frame neonoire-shot-156 --character JACK --text "…" --file <mp3 or https URL> --offset 0.4 --model eleven_v4`
3. `npm run build:neonoire && npm run verify:neonoire` (the builder stretches a frame that is too short for its line).

## Re-recording a line

`node scripts/neonoire/voice-ingest.mjs --replace 1 --id s74-vera-why-didnt-you --frame … --character VERA --text "[crying] …" --file <url> --gen flow/session/generation`. The new take takes over the same file path and id (so nothing that points at it breaks); the old take is copied to `docs/neonoire/voice/archive/` and listed in the line's `history`. Every line records its ElevenLabs `generation` (flow / session / id) so any take can be traced back.

Note: the director's tag picks from the direction test (Jack `[awkwardly]` for the date invitation, Vera `[teasing]` for the breakfast banter) apply to those moments only. Choose the tag for each line from what the moment needs.

## Editing takes in Adobe (or anywhere)

Edit a copy of the file from `public/audio/neonoire/…` (or the frame's `lines/` in the lipsync export), export as mp3, wav, m4a or ogg, then bring it back with the same command as a re-record: `node scripts/neonoire/voice-ingest.mjs --replace 1 --id <line id> --frame <frame id> --character <NAME> --text "<line>" --file <your edited file> --status edited`, then `npm run build:neonoire`. The line keeps its id and path (only the extension changes if the format does), the take it replaces is archived, and the manifest marks it `edited`. Never overwrite a file in `public/audio/` by hand without doing this, or the manifest, the frame durations and the archive fall out of step.

## Lipsync and video (Kling)

`node scripts/neonoire/voice-export.mjs [--scene 74 | --frame <id>]` writes one folder per voiced frame under `exports/neonoire/lipsync/<scene>/<shot>-<title>/` (rebuilt from the repo, not committed):

- `frame.jpg` — the board still (1920x1080);
- `dialogue.wav` — the frame's dialogue on the frame's own timeline (silence with each line at its offset, lossless mono 44.1 kHz);
- `lines/` — every line as its own file, numbered in order;
- `frame.json` — timings, text, tagged prompt, voice and generation ids, plus the shot data (type, lens, angle, movement, lighting, description).

`index.json` lists them all. Each frame also gets a `lipsync.faceVisible` rating from its shot type: **the wide, small-figure frames this film favours (Wide, Extreme wide) will not lipsync**, because the model cannot find a face. For those, either add a closer coverage shot of the speaker or use the audio only as sound over motion. Scenes 62 and 74 are both wide.

Keep the source of truth in the repo: takes in `public/audio/`, timings in `manifest.json`, voices in `voices.json`. Nothing under `exports/` is precious.

## The animatic

**In the app:** Export → **Animatic playback** renders a real MP4 from the current saved project, not a stale bundle. Choose the whole project, a scene or a scene range, 1080p/720p, playback/tight timing, dialogue, optional subtitles and score. Progress and cancellation are shown; the render continues when the dialog closes, and reopening resumes its status/download. Node + FFmpeg and a writable persistent `exports/animatics/` directory are required (not a short-lived serverless function). `FFMPEG` selects an executable if it is not on PATH. Outputs/snapshots are ignored by Git.

The renderer preserves edited within-scene order and leaves **Static** shots still. `--camera` is opt-in for explicitly moving shots; the old inference from prose such as "no tracking" is removed. `--project <snapshot.json> --output <video.mp4> --resolution 720p --hold --no-camera --no-subs --no-music` exports a saved playback snapshot. `--no-audio` mutes dialogue and `--no-credits` omits the CLI's optional credits tail. The app never adds a credits tail to playback.

`FFMPEG=/path/to/ffmpeg node scripts/neonoire/animatic.mjs --scene 98` (or `--from 96 --to 100`, or no flag for the whole film). Output: `exports/neonoire/` (not committed). ffmpeg: install it, or `pip install imageio-ffmpeg` for a static build.

## Rules

- Keep the script unchanged for voice work. Japanese-language lines are voiced in **English** for now, and Jack's too; characters who speak only Japanese use English placeholder voices.
- A voice is final only when its ID is in `voices.json`. Designed previews are short-lived and must be saved to the ElevenLabs library first.
- Never store a take only as a link. Ingest it.
- Recorded so far (Jack and Vera only): scene 62 (9 lines) and scene 74 (7 lines) in `eleven_v4`, about 714 credits including the four retakes (29 September) that removed the whispers; plus two older-model pilot lines in scene 98 (redo in v4).
- **No whispering.** Whispers and `[quietly]` read badly in these voices. Where a line is upset, use `[crying]`, `[voice breaking]` or `[trembling voice]` at speaking volume; where it is careful, leave it plain.
- **Cost:** every model is about 1 credit per character; the bracketed emotion tags count as characters. So write plain lines with punctuation, and add a short tag (`[whispers]`, `[crying]`, `[voice breaking]`) only where the performance needs it. Estimate first (`estimate_only`), one take per line.
- `text` in the manifest is the script line as spoken; `prompt` is the tagged text sent to ElevenLabs.
- Scene 62 is a single board frame, so its dialogue stretches the frame to 27 seconds; add coverage shots when it is boarded properly.


## Pauses and pacing (added 29 September 2026)

- **Pauses on v4** are square-bracket tags, not braces: `[short pause]`, `[pause]`, `[long pause]`, placed where the beat falls. Use them for the beats the script marks ("A beat.", a long look) and sparingly, since a tag costs credits like any other characters.
- **Animatic cuts are tight by default** (`animatic.mjs`): a voiced frame starts about 0.5 s before its first line and ends 0.4 s after its last; a silent frame holds at most 4 s (`--silent-max N` to change it, `--hold` for the board durations as they are). Board durations in the bundle are not changed.
- **ElevenLabs allows 3 concurrent requests**: send generations in waves of 3-4, or one will fail on "Too many concurrent requests".
