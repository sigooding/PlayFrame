# NEONOIRE — recorded dialogue

Voices are generated with ElevenLabs (`eleven_v4`, which takes emotion tags such as `[tired]`, `[whispers]`, `[groggy]`), then stored in the repo so nothing depends on ElevenLabs links (they expire after two hours).

| Piece | Where |
| --- | --- |
| Which voice speaks each character | [`voices.json`](voices.json) |
| Every recorded line (frame, text, file, offset, voice, model) | [`manifest.json`](manifest.json) |
| The audio files | `public/audio/neonoire/<scene>/<shot>-<character>-<words>.mp3` |
| Attaches lines to frames at build time | `scripts/neonoire/voice.mjs` (used by `build-project.mjs`) |
| Adds a take to the project | `scripts/neonoire/voice-ingest.mjs` |
| Adds a whole plan of takes (replacing, retiring, laying out a frame's gaps) | `scripts/neonoire/voice-batch.mjs` |
| Puts an alternate take in the game in place of the one in it | `scripts/neonoire/voice-swap.mjs` |
| Retires takes whose words left the screenplay (archived as `*-cut-<date>`) | `scripts/neonoire/voice-retire.mjs` |
| Lets a saved workspace take new dialogue | `scripts/neonoire/sync-voices.mjs` (writes `src/lib/neonoire-voice-sync.json`) |
| Takes and voice designs that are not in the game (audition page) | [`alternates-2026-10-07.md`](alternates-2026-10-07.md), `public/audio/neonoire/alternates/` |
| Builds the animatic with ffmpeg | `scripts/neonoire/animatic.mjs` |
| Packages voiced shots for lipsync / video generation | `scripts/neonoire/voice-export.mjs` |
| Superseded takes (kept, never deleted) | `docs/neonoire/voice/archive/` |

## In the app

A frame can carry `audio`: a list of `{ id, character, text, src, offset, duration, voice, model }`. `src` must be under `/audio/`. The storyboard presentation plays each line at its offset while a frame plays (there is a "Dialogue on / Sound off" toggle), and the frame dialog lists the lines with players. Existing saved workspaces pick up new audio the next time NEONOIRE is opened, without touching anything else on a frame.

## Adding a line

1. Generate the take (v4 for emotion tags; a line is one take per speaker).
2. `node scripts/neonoire/voice-ingest.mjs --frame neonoire-shot-156 --character JACK --text "…" --file <mp3 or https URL> --offset 0.4 --model eleven_v4`
3. `npm run build:neonoire && npm run verify:neonoire` (the builder stretches a frame that is too short for its line).

## Recording a whole scene from a script

A scene's lines can be planned in one JSON (`elevenlabs-plan-14A.json`: frame, speaker, tagged prompt, gap) with a human-readable script beside it (`elevenlabs-script-14A.md`, which also lists the house formatting rules). Generate each row, save the takes as `L01.mp3` … in one folder, then `node scripts/neonoire/voice-batch.mjs --plan <plan.json> --dir <folder> [--dry]` ingests them all and lays the gaps out.

A plan can also span scenes and mix new lines with older ones (`elevenlabs-plan-missing-2026-10-07.json`, 160 lines over 51 frames): each line may carry its own `scene`, `id`, `voice`, `fx` and `generation`; `replace` re-records an older line in place (same id and path, the old take archived in its `history`); `retire` archives an older take that was recorded under the wrong speaker; and `frameOrder` gives the playing order of a frame that mixes new takes with older ones, so the older takes keep their offsets and are only pushed along when a new take would run into them. `--dry` prints where everything would land without writing anything.

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
- Recorded so far: **every spoken line of the screenplay** (561 takes after the 7 October 2026 pass, which added the 160 the games had been reading with text-to-speech; see "The 7 October 2026 pass" below). Two older-model pilot lines in scene 98 remain to redo in v4.
- **No whispering.** Whispers and `[quietly]` read badly in these voices. Where a line is upset, use `[crying]`, `[voice breaking]` or `[trembling voice]` at speaking volume; where it is careful, leave it plain. Measured on 7 October 2026: `[quietly]`, `[softly]` and `[weakly]` on Jack and Vera come out about **10 dB under** their speaking level (−33 dB average against −24 dB; the whispered takes retaken on 29 September measured −28 to −36). Tags that kept speaking volume on the same lines: `[earnestly]`, `[tenderly]`, `[sadly]`, `[evenly]`, `[firmly]`, `[gently]`, `[flatly]`, `[dryly]`, `[curious]`, `[pleading]`, `[voice breaking]`, `[calling out]`. `[solemnly]` and `[wryly]` ran quiet. Measure a new batch before ingesting it (the average level of the active speech; `docs/neonoire/voice/alternates-2026-10-07.md` lists the numbers).
- **Cost:** every model is about 1 credit per character; the bracketed emotion tags count as characters. So write plain lines with punctuation, and add a short tag (`[whispers]`, `[crying]`, `[voice breaking]`) only where the performance needs it. Estimate first (`estimate_only`), one take per line.
- `text` in the manifest is the script line as spoken; `prompt` is the tagged text sent to ElevenLabs.
- Scene 62 is a single board frame, so its dialogue stretches the frame to 27 seconds; add coverage shots when it is boarded properly.


## Pauses and pacing (added 29 September 2026)

- **Pauses on v4** are square-bracket tags, not braces: `[short pause]`, `[pause]`, `[long pause]`, placed where the beat falls. Use them for the beats the script marks ("A beat.", a long look) and sparingly, since a tag costs credits like any other characters.
- **Animatic cuts are tight by default** (`animatic.mjs`): a voiced frame starts about 0.5 s before its first line and ends 0.4 s after its last; a silent frame holds at most 4 s (`--silent-max N` to change it, `--hold` for the board durations as they are). Board durations in the bundle are not changed.
- **ElevenLabs allows 3 concurrent requests**: send generations in waves of 3-4, or one will fail on "Too many concurrent requests".

## The 7 October 2026 pass: every spoken line voiced

**Why.** The visual novel and scarlett-witness play a recorded take where one matches the screenplay line and read the rest with the browser's text-to-speech. 160 of 546 spoken lines had no take (17 more takes were recorded but matched nothing, because their lines had been reworded). The importer (`tools/import-playframe.mjs` in nobodys-witness) now reports **546 of 546 voiced**.

**What.** 160 takes in `eleven_v4`, one per line, plan in [`elevenlabs-plan-missing-2026-10-07.json`](elevenlabs-plan-missing-2026-10-07.json): 146 new lines (scene 14A's 36 among them); 13 reworded lines re-recorded under their old ids (their old takes are in each line's `history`); and one take recorded under the wrong speaker (Jack's reading of Mara's "Is she okay? Is she — does she know you're —") retired to the archive and replaced by a Mara take. The two cassette lines in scene 82 use a new younger Sakai voice (`SAKAI (TAPE)` in `voices.json`) and `fx: tape`, as do Kurose's two. Phone lines (the Mother, the vending machine, Ishida's call: `fx: phone`) carry their filter in the manifest, as before. Two takes of lines that are no longer in the screenplay ("Because they didn't find it." in 12, "People draw the places they want to go." in 14) were retired to `archive/*-cut-2026-10-07.mp3`.

**Frames.** Where a new take shares a frame with older ones, the older ones keep their offsets unless the new take runs into them (15 were pushed along or re-spaced, by 0.6 to 25 s). In frame 202 (scene 25) the long answer "It's the only thing I know how to do with it…" was also moved from the end of the frame to its place after "You drew this."; the bundle's frame durations grew to fit (the builder lengthens, never shortens). Saved workspaces: a frame that still holds the dialogue the earlier bundle shipped takes the new takes and offsets, a frame whose dialogue was edited keeps it, and silent frames gain theirs (`scripts/neonoire/sync-voices.mjs`, replayed by `verify:revision:neonoire`).

**Takes and voices that did not make it** are kept: see [`alternates-2026-10-07.md`](alternates-2026-10-07.md) and `public/audio/neonoire/alternates/2026-10-07/index.html`.

**Reaching the games.** In nobodys-witness: `node tools/import-playframe.mjs --from <PlayFrame checkout>` (copies the new takes into `public/voice/`, rewrites `src/story/story.json`). In scarlett-witness: copy that `src/story/story.json` to `src/film/story.json`, then `node tools/build-film-story.mjs`. Both games ship their own copy of every voice file, so a swap (or any new take) has to be re-imported.


## One voice per character (7 October 2026, later)

Harada's six newspaper-office lines (scenes 297, 298) had been recorded with an earlier voice (`hpp4J3VqNfWAUOO0d1Us`), so Harada sounded like two people; the scene 1 old man's "Don't let them have it." used the 29 September Sakai preview (`y7NkiaxPRjIzeTdRhHDC`), which is no longer in the workspace, while "After twenty years." used the saved **Sakai - NEONOIRE**. All seven were re-recorded in the saved voices (`Harada - NEONOIRE`, `Sakai - NEONOIRE`), same words and tags, under their old ids; the old takes are in `archive/*-v1.mp3` and each line's `history`. Plan: [`elevenlabs-plan-unify-2026-10-07.json`](elevenlabs-plan-unify-2026-10-07.json). `sync-voices.mjs` now merges with what earlier passes recorded (a frame changed in two passes keeps both digests; its baseline stays the oldest), and `bundle-refresh` accepts one digest or a list, so a saved workspace on either version takes the new takes.

Still borrowed (drafts): Mrs. Sakai and Mrs. Noda on Kaneko's voice, Mr. Noda on Okada's, the old tobacconist on the barber's, the bartender on the journalist's, the vending machine on a premade voice, the Mother on a library voice.
