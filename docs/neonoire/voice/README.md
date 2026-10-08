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

**Mrs. Sakai and Mrs. Noda** were also given their own voices the same day (they had borrowed Kaneko's): designed in ElevenLabs, saved as `Mrs. Sakai - NEONOIRE` (`RWRdNUkZ6UAfbVJPXrFG`, 167 Hz, slow and even) and `Mrs. Noda - NEONOIRE` (`Alk407KbdehWA59k1BZv`, 208 Hz, brisk), and their 15 lines re-recorded under their old ids (plan [`elevenlabs-plan-sakai-noda-2026-10-07.json`](elevenlabs-plan-sakai-noda-2026-10-07.json); one `[quietly]` became `[sadly]`). Frame 273's longer reading pushed Jack's "Did he ever pay rent…" from 26.52 to 28.3 s. **Both picked blind (by pitch and pace against Kaneko's 125 Hz gravel); nobody has listened.** The unpicked previews are in `public/audio/neonoire/alternates/2026-10-07/voices/`.

Still borrowed (drafts): Mr. Noda on Okada's (one line), the old tobacconist on the barber's (two), the bartender on the journalist's (two), the vending machine on a premade voice, the Mother on a library voice (two, about 5 dB quiet). Each has too little text to make a design preview from without inventing a line.


## The twelve hushed takes, re-recorded (8 October 2026)

The "still hushed" list in [`alternates-2026-10-07.md`](alternates-2026-10-07.md) is cleared for Jack and Vera: their twelve older `[quietly]`/`[softly]` takes (frames 167, 168, 189, 214, 229, 247, 270, 275) were re-recorded in the same saved voices, same words, under their old ids, with tags that stay at speaking volume (`[firmly]`, `[gently]`, `[earnestly]`, `[sadly]`, `[evenly]`). They measured −26 to −30 dB; the new ones measure −18 to −26 dB, in line with the takes around them (−17 to −22). Two samples were generated per line; the first was used unless the second was at least 0.5 dB louder (only "He always paid too much, too." took its second). Plan: [`elevenlabs-plan-hushed-2026-10-08.json`](elevenlabs-plan-hushed-2026-10-08.json); the old takes are in `archive/*-v1.mp3` and each line's `history`; the unused second samples are in `public/audio/neonoire/alternates/2026-10-08/`. Frame 189 now runs 49 s (was 47): Kaneko's "Everything is going…" had been overlapping the line before it by 1.6 s, so the layout pushed it and the three lines after it along. File names still say `quietly`/`softly`: ids and paths are stable on purpose.

Left alone: Mara's four `[weakly]` scene 71 lines (weak may be what the scene wants). Alternate readings of those, of Jack's scene 98 lines and of Vera's scene 74 lines are offered for audition instead (below) rather than put in the game.

**The 8 October alternates** (`public/audio/neonoire/alternates/2026-10-08/`, page `index.html`, data `index.json`; 25 lines, 7 voices, nothing in the game): (1) for each of the twelve re-recorded lines (`Q01`-`Q12`) the sample that was not used and the hushed take it replaced; (2) three alternate readings each of the peak lines: Mara scene 71 `M01`-`M04` (`[tenderly]`, `[in wonder]`, `[voice breaking]`, `[pleading]` against the game's `[weakly]`), Jack scene 98 `J01` "At the end, she asked me to tell you something." (`[sadly]`) and `J02` "She said to tell you she was sorry." (`[voice breaking]`), Vera scene 98 `V01` "Liar. It was mine." (`[crying]`), Vera scene 74 `W01`-`W06` (`[flatly]`, `[angrily]`, `[pleading]`, `[sobbing]`, `[bitterly]`, `[coldly]`); (3) three new design previews for each voice that was picked blind (Sakai, Sakai (tape), Young Detective, Harada, Daniel, Mrs. Sakai, Mrs. Noda), from the same prompts as `voices.json`, listed beside the voice in use. `[tenderly]` on Mara's "Jack." measures −27 to −29 dB, about 6 dB under the rest (a tender hush, so not obviously wrong there) and `[angrily]` about 5 dB over. A preview is not a take: to use one, say which id and the line is re-recorded in it (`creative_save_designed_voice`, then a replace plan like the one above). `node scripts/neonoire/alternates-page.mjs <set>` renders a set's page from its `index.json` (`scripts/neonoire/alternates-page.template.html`); the page's commands now carry `--set <date>`, and the 7 October page was re-rendered so its in-game takes play (they had no source) and its commands still work now that two sets exist (`voice-swap.mjs` defaults to the newest set).

Heard-but-not-fixed: `s10-jack-wearily-it-s-good-advice` (frame 167) measures −27 dB; `[wearily]` runs quiet like the others on the list above.
