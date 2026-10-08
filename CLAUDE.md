# PlayFrame

## Standing rule for every agent: always merge into `main-restored`

`main-restored` is the repository's default branch and the one the director reads. **Open every pull request with base `main-restored` and merge it there.** Do not merge into `main` (it is an older line that stopped receiving work on 7 October 2026). Use the designated session branch for the work, then PR it into `main-restored`.

## Standing rule for every agent: never overwrite an image

The storyboard card's `⋯` chooser and **Browse all images** only work because every earlier picture still exists. So:

1. **Never overwrite or delete a file under `public/images/neonoire/`.** A new picture gets a **new filename** (the next free shot number, its own path). If a retake must replace a shot's image in place, first copy the old file to `public/images/neonoire/archive/<scene folder>/<name>--v<N>.<ext>` (next free N) and commit that **before** the new image goes over it.
2. **`public/images/neonoire/archive/` is append-only.** Never edit, rename or delete anything in it.
3. **Never drop entries from `public/images/neonoire/library.json`.** If you regenerate it (`npm run library:neonoire`) in a shallow clone, restore what it cannot rediscover from `git show origin/main:public/images/neonoire/library.json`.
4. **Before every push and every handoff run `npm run verify:images`.** It compares your tree with `origin/main` and fails on an overwritten or deleted image without an archived copy, a touched archive file, or a shrunken library. CI runs it on every PR. Never "fix" it by editing the script, deleting `origin/main` history, or force-pushing.
5. Do not run image-optimising, renaming or format-conversion tools over the image folders.

## Second project — 7 October 2026: the animated cold open (working title)

**`docs/hangar/README.md`.** A new bundled workspace beside Nobody's Witness, from the director's other conversation: an animated 1975 feature's cold open (8 scenes, 39 shots, no pictures yet), opened from Templates. It touches nothing in Nobody's Witness; `npm run verify:hangar` guards the isolation. Every scene and shot carries the new house style `hangar` (Painted Americana '75: Iron Giant people over Ghibli backgrounds) plus mood, lighting direction, transition, sound and framing; read the README's last section before editing a shot's notes (the video prompts parse them). Its pictures will go in `public/images/hangar/` under the same never-overwrite rule.

## Latest session — 8 October 2026 (night, later): episode one's four stale scenes are re-boarded

**The mugging (15 shots), St Jude's (22), the first cops scene (19) and the washing-up (23) now have boards written from the draft beat for beat, and 112 more of episode one's lines sit on their frames: 165 of the 166 are on frames (the one left is Martin's, in the storage unit, whose board is not rewritten).** Boards: `docs/rapture/scenes/ep1-mugging.md`, `ep1-st-judes.md`, `ep1-cops-first-beat.md` (new), `ep1-washing-up.md`; the old boards are in `docs/rapture/scenes/archive/` (the cops scene had none: its legacy `a2s1` keyframes are no longer legacy, they are laid on the shots they show). **No picture was drawn**: pictures that still fit are reused (mugging 10 of 15, washing-up 7 of 23, cops 19 of 19) and the rest, all 22 of St Jude's included, are "keyframe missing" placeholder cards naming the file to add under `public/images/rapture/ep1-*/`; drawing them is the open work. `plan.mjs` (`muggingPlan`, `stJudesPlan`, `washingUpPlan`, new `copsFirstBeatPlan`; `a2s1` out of `legacyBoards`), `build-project.mjs` (a `dialogueFor` per page, `timingNote` moved up) and `verify:rapture` carry it (522 frames, 179 speaking, 668 takes, project 4,575 s). The generator that wrote the boards was a throwaway; edit the board and its plan row together. Details: `docs/rapture/voice/README.md`, "Re-boarded". Branch **`claude/story-bible-decision-log-k2apor`**, PR to `main-restored`.

## Latest session — 8 October 2026 (night): the rest of the Rapture is voiced (episodes two to five)

**All 502 spoken lines of the twelve shot boards in `docs/rapture/scenes/` (episodes two to five) are recorded, one `eleven_v4` take each, and sit on 139 frames: with episode one's 12, 151 frames of the Rapture workspace speak (555 takes). PlayFrame only. Nobody has listened.** Read `docs/rapture/voice/README.md`, "Episodes two to five", first; the listening page (`public/audio/rapture/index.html`, `/audio/rapture/`) now plays all 19 scenes (668 lines) and lists the 27 voices.

**What is where.** `scripts/rapture/board-script.mjs` reads each board's `SPEAKER: (direction) words` lines (502, with the shot each is written in and the pauses the board spells out); `scenes-plan.mjs` adds a v4 direction to every line and writes `docs/rapture/voice/elevenlabs-plan-scenes.json` (`--check`, `--risky`); `scenes-batch.mjs` moves the raw takes to `public/audio/rapture/scenes/<board>/NN-<speaker>-<words>.mp3`, measures and screens them and writes `docs/rapture/voice/manifest-scenes.json`; `dialogueByShot()` in `voice-frames.mjs` lays a board's lines on the frames of their shots (called for the 12 boards at the end of `build-project.mjs`; it stops if a board has been reworded since the recording, line by line). Every ElevenLabs generation is in `scenes-raw-meta.json`; alternates and the one replaced take in `public/audio/rapture/scenes/alternates/` (ElevenLabs does not keep audio for long; everything generated is in the repo).

**Voices.** The ElevenLabs workspace is at its 30 custom-voice limit with no delete tool, so the 16 designs made for these boards (47 previews in `public/audio/rapture/voices/eps2-5/`, `casting-eps2-5.json`) were never saved and are auditions. Twenty voices speak: six are episode one's saved `<Character> - RAPTURES` designs (Nina, Martin, Danny, Jodie, Kath, Ray) and fourteen are ready-made ElevenLabs voices used as they are (picked blind from measured previews; Alan, Graham, Neil and the lockup's MAN share one on purpose). `voices.json` has `boardSpeakers` (who speaks which character on which board) and the reason for each pick. Saved designs could replace the ready-made ones once slots are free (`voice-rerecord.mjs` swaps line by line).

**Things to know.** (1) Directions follow the episode-one rules (one-word direction on a line of three words or fewer, no hush words); `PAREN` maps the board's parentheticals. (2) The repeat screen flagged eight takes: S049, S219 and S220 were re-recorded with other directions, **S385 ("Shh.") was replaced** (first take archived as `scenes/alternates/S385--v1.mp3`), and four short lines (S255, S337, S412, S444) were kept because two fresh takes of the same direction ran the same length and passed the screen (`cleared` in the manifest). About 80 takes were screened only, not transcribed. (3) Frames are lengthened, never shortened: eight boards grew (the angels' cold open 125 → 132 s, Graham's interview 172 → 184, Pat's cold open 151 → 162, Pat's house 305 → 308, scout hut 159 → 161, kitchen 365 → 367, therapy class 270 → 297, the night at Pat's 327 → 379); the whole project is 4,348 s (was 4,232) and `verify:rapture` asserts every total. (4) `bundledAudioUpdates` gives a saved workspace the new dialogue on its next read, once. (5) Levels are as made; the listening page turns each voice down to the quietest's level.

**Not done.** Sighs, laughs and breaths the boards imply are not recorded. Episode one's mugging, St Jude's, first cops scene and washing-up still need re-boarding before their takes can go on frames. Nothing went into the visual novel or scarlett-witness.

Branch **`claude/story-bible-decision-log-k2apor`**, PR to `main-restored`.

## Latest session — 8 October 2026 (later): the Rapture's episode-one voices

**All 166 spoken lines of *Let the Raptures Commence* episode one (the draft of 21 September 2026, `docs/rapture/ep1-screenplay.md`) are recorded: one `eleven_v4` take each, 13 voices designed for the show and saved in the ElevenLabs workspace as `<Character> - RAPTURES`. PlayFrame only: nothing went into the visual novel or scarlett-witness.** **The 53 lines of the two boards that carry the draft verbatim (Danny and Jodie, 33; the cops' second beat, 20) are attached to twelve of those boards' 27 frames; no other frame has dialogue yet.** Read `docs/rapture/voice/README.md` first. Nobody has listened to any of it: the voices were picked blind by measured pitch, range, brightness and pace (the deadpan parts took the narrowest range; voices that share a scene were kept apart), the directions are unheard, and the 4 s and 8 s silences are unheard. **Listen first:** `public/audio/rapture/index.html` (from a checkout, or the site at `/audio/rapture/`) plays the episode scene by scene with the pauses the script spells out, and lists the cast with all 45 design previews (the unpicked ones are auditions).

**What is where.** Takes `public/audio/rapture/ep1/<page>/NN-<speaker>-<words>.mp3`; previews `public/audio/rapture/voices/`; `docs/rapture/voice/{voices.json, manifest.json, elevenlabs-plan-ep1.json, elevenlabs-script-ep1.md}` (cast with why each voice was picked and every preview measured; every take with its prompt, level, offset on its scene's timeline and ElevenLabs generation id; the 166-row plan; the readable script). Scripts in `scripts/rapture/`: `voice-script.mjs` (reads the draft into lines, ids and the pauses it writes out; `--list`), `voice-plan.mjs` (adds a v4 direction to every line; `--check` fails if the plan is stale), `voice-batch.mjs` (ingests a folder of takes, measures them, writes the manifest; needs `FFMPEG`), `voice-measure.py`, `voice-page.mjs` (the listening page). **Directions are in the v4 best-practice style the director quoted, short natural-language directions in brackets in front of the line** (`[Dry, flat, after a long pause] …`), and `voice-plan.mjs` refuses the hush words (`quietly`, `softly`, `weakly`, `whisper`, `murmur`), the NEONOIRE finding again. About 7,400 credits for the episode.

**Found afterwards, 8 October (later still): 19 of the 166 takes said their line twice or more, and 20 were re-recorded.** A speech-to-text pass on plain copies (66 takes) heard "Rules. Rules", "They're gone. They're gone", "No, no", "Us, us, us, us, us" (Kath's last line, a five-second take), "Ca- calf" for Ray's "Kath."; the cause is a direction longer than a short line (`[Dry, after a long pause] Kath.` repeated, `[Serious] Rules.` and a bare `Rules.` did not), so the 20 were redone with one-word directions, three takes each. The old takes are in `public/audio/rapture/archive/ep1/<page>/<name>--v1.mp3` (committed first), the new ones over the old paths, 44 clean alternates and 7 repeats in `public/audio/rapture/alternates/2026-10-08/` (**ElevenLabs does not keep generations for long: everything generated is in the repo**). `scripts/rapture/voice-screen.mjs` finds the fault without a transcript (phrases against chunks; 8 of 8 on the transcribed scenes) and the manifest carries `phrases`, `expected`, `heard` and `rerecorded`; `voice-rerecord.mjs` does archive-then-install. **Ray's re-recorded "Kath." in the police car (scene 3 line 53) transcribed as nothing: listen to it first** (five alternates beside it). About 80 first takes were screened only, not transcribed. Details: `docs/rapture/voice/README.md`, "The repeat fault".

**Findings to keep.** (1) **ElevenLabs refuses to design a child's voice** ("Girl, 11, English…" was blocked), so Jodie is a light young adult voice, a stand-in until there is a child actor. (2) **Timbre words fight pitch words in a design**: "a thin, slightly nasal voice" (Brian) and "a heavier, gruffer voice" (Terry) came out at 200–270 Hz, above the women; "a dry mid-range tenor" and "a deep, gravelly bass-baritone man's voice" fixed both. The first Brian and Terry rounds are kept on the page, marked not used. Check a male design's pitch before saving it. (3) The shortest lines read quietest ("Mm." −30 dB); voices differ by up to 7 dB, so the page turns each voice down to the quietest's level and the files stay as made. **Young Man** plays both the mugger and the keen volunteer (never in a scene together). **The Mother's NEONOIRE voice was not touched.**

**On the frames (8 October, later).** `scripts/rapture/voice-frames.mjs` walks the two boards' shots, matches their `SPEAKER: text` lines in order to the manifest's lines for the page (speakers and words must agree, the one declared trim is Jodie's "who's still alive"; anything else stops the build) and lays each line over its frame with the spacing the page's own timeline gives it: the first word a beat (0.6 s) after the cut, or after the hold the draft writes (4 s before Kath's first line, 5 s before Ray's "Kath."; the six-second pause is kept). A frame is **lengthened, never shortened**, so the last word has 0.6 s of air: five frames grew (Danny and Jodie 148 → 158 s, the cops' second beat 90 → 92 s; `verify:rapture` asserts the totals, the twelve frames, the 53 ids in order, every offset, the holds, the import round trip and the repeat screen of all 166 takes). **Saved workspaces:** `bundledAudioUpdates` (`src/lib/bundle-refresh.ts`, wired in `projects.ts`) gives a saved Rapture frame that has no dialogue the bundle's takes on its next read, once, and never shortens or touches anything else (before this the Rapture was never refreshed, so a workspace already opened would not have heard of the takes). The dialogue is not in the nobodys-witness games and nothing needs re-importing.

**Not done.** The mugging, St Jude's, the first cops scene and the washing-up were written after their boards and need re-boarding before their takes can go on frames. Episodes two to five have dialogue only in their scene boards (about 450 lines) and no voices. Sighs, laughs and other non-verbals the draft does not write out are not recorded. To re-record a line use `scripts/rapture/voice-rerecord.mjs` (archive the old take first, commit that, then install; README, "Re-recording a line").

## Earlier session — 8 October 2026: the hushed takes, laugh and cry takes, phone/TV effects and body falls in the games

**Voices.** (1) The twelve Jack and Vera takes that read as whispers (`[quietly]`/`[softly]`, −26 to −30 dB) are re-recorded at speaking volume (`[firmly]`, `[gently]`, `[earnestly]`, `[sadly]`, `[evenly]`; now −18 to −26 dB), same words and ids, old takes archived (`archive/*-v1.mp3`); plan `docs/neonoire/voice/elevenlabs-plan-hushed-2026-10-08.json`; frame 189 runs 49 s (Kaneko's line had overlapped the one before by 1.6 s). Mara's four `[weakly]` scene 71 lines stay (weak may be intended). (2) **Laugh and cry/upset takes for 13 lines** where the script says someone laughs, cries or breaks (scenes 6, 36, 58, 60, 69, 71, 74, 84, 98; table in the voice README, plan `…-laugh-cry-2026-10-08.json`), recorded in the **v4 best-practice style the director pointed to: long descriptive directions in brackets** ("[A short broken laugh, then her voice cracking with hurt]"), against one-word tags, three samples each; the game takes the descriptive one unless it ran over 1.4× the one-word take. The last old-model pilot take (scene 98 "You could have told me that in the rain") is on v4 now. Sighs and scripted whispers not done (no-whispering rule). **The Mother's voice (borrowed library voice, quiet) was not touched.** Nobody has listened to any of the new takes.

**Audition set** `public/audio/neonoire/alternates/2026-10-08/` (37 lines, 7 voices; nothing in it is in the game): each re-recorded line's unused samples and replaced take, three alternate readings of Mara 71, Jack 98, Vera 98 and Vera 74's peak lines, three new design previews for each of the seven blind-picked voices. Open `index.html`; `scripts/neonoire/voice-swap.mjs --set 2026-10-08 --key W02 --take takes/W02--angrily--s1.mp3` puts one in the game (always pass `--set`: it defaults to the newest set). `scripts/neonoire/alternates-page.mjs <set>` renders a set's page from its `index.json`.

**Phone, TV and tape voices now play filtered in the games.** PlayFrame's animatic has always applied ffmpeg chains for the 26 takes with an `fx` (phone/tv/tape) while the takes stay clean; the games read the clean files, so they played unfiltered (the bundle drops `fx`, so the visual novel's own live phone filter never fired). `scripts/neonoire/voice-fx.mjs` now holds the chains plus `bakeFx()` (loudness-matched to the clean take), the visual novel's importer bakes the 26 lines into `public/voice/` (needs `FFMPEG`), scarlett-witness copies that folder. Mara's scene 4 voicemail greeting was missing its `fx` and has `phone` now; `verify:neonoire` checks the fx names. **Subtitle:** the masked men's "Shitsurei shimasu." (scenes 2 and 70, screenplay: `subtitled: "Excuse me."`) carries `sub: "Excuse me."` in the manifest; the animatic burns it, the visual novel shows it under the words, scarlett-witness as "Shitsurei shimasu. (Excuse me.)". **Body-fall effects** (`public/audio/neonoire/sfx/body-fall-*.mp3`, ElevenLabs sound effects) after the shots in scenes 1, 2 and 70, wired into both games. After any voice or effect change: re-import (README "Reaching the games"), with `FFMPEG` set.

Branch **`claude/story-bible-decision-log-k2apor`**, PR to `main-restored`; games: nobodys-witness and scarlett-witness `voices-hushed-rerecord`.

## Latest session — 7 October 2026 (later): every spoken line is voiced

**All 546 spoken lines of Nobody's Witness now have a recorded take: 561 takes in `docs/neonoire/voice/manifest.json` (was 417).** The visual novel and scarlett-witness play a take where one matches a screenplay line and read the rest with the browser's text-to-speech; on 7 October 160 lines had no take and 17 takes matched no line (reworded since they were recorded). The director upgraded the ElevenLabs plan and asked for all of them: `node tools/import-playframe.mjs --from ../PlayFrame` in nobodys-witness now reports **546 of 546 voiced** and no unmatched take. Read `docs/neonoire/voice/README.md` (last section) before touching dialogue.

How: one plan, `docs/neonoire/voice/elevenlabs-plan-missing-2026-10-07.json` (160 lines over 51 frames), ingested by the extended `scripts/neonoire/voice-batch.mjs` (`replace`, `retire`, per-line scene/voice/fx/generation, and a `frameOrder` that keeps older takes at their offsets unless a new take runs into them): 146 new lines (scene 14A's 36 among them), 13 reworded lines re-recorded under their old ids, Jack's mislabelled take of Mara's line retired and replaced, and two takes of lines that left the screenplay retired (`voice-retire.mjs`, archived as `*-cut-2026-10-07.mp3`). Frame 202's long answer was also moved to its place in the scene (it had sat last). **Voices:** Harada, Daniel, Sakai (re-designed: the 29 September voice was deleted), the Young Detective (stands in for the Young Officer, whose voice was also deleted) and a new **Sakai (tape)** for the scene 82 cassette (the tape is Sakai twenty years earlier; `voices.json` forbade reusing the old man's voice) are saved in the ElevenLabs workspace; the Mother is a borrowed library voice that records about 5 dB quiet. **Sakai, Sakai (tape), the Young Detective, Harada and Daniel were picked blind; nobody has heard them.**

**The finding to keep: `[quietly]`, `[softly]` and `[weakly]` on Jack and Vera read as whispers, about 10 dB under their speaking level** (−33 dB against −24 dB), exactly what the README's "no whispers" rule said. The first generation used `[quietly]` on 56 lines, so 57 were re-recorded with tags that stay at speaking volume (`[earnestly]`, `[tenderly]`, `[sadly]`, `[evenly]`, `[firmly]`, `[gently]`…; the list is in the README) and measured before ingest. Sixteen older takes from earlier passes are still hushed (listed in `docs/neonoire/voice/alternates-2026-10-07.md`; about 700 credits to redo).

**Alternates kept, per the director ("download all the voices you created in case some are better than others"):** every take and voice design that is not in the game: 76 alternate takes for 59 lines (the first-round hushed reads, the tag test, variants) and 15 design previews, in `public/audio/neonoire/alternates/2026-10-07/` with `index.json` and an audition page, `index.html` (opens from a checkout or from the site at `/audio/neonoire/alternates/2026-10-07/`). `scripts/neonoire/voice-swap.mjs --key N071 --take takes/N071--earnestly--test.mp3` puts one in the game (the take it replaces is archived); then rebuild the bundle and re-import into the two games. **Saved workspaces:** `scripts/neonoire/sync-voices.mjs` (writes `src/lib/neonoire-voice-sync.json` and `docs/neonoire/baseline/voice-pre-audit-2026-10-07.json`) lets a saved workspace holding a frame's earlier dialogue take the new takes; an edited frame keeps its own; `verify:revision:neonoire` replays it. All checks pass: `build:neonoire` (366/366, 561 lines), `verify:neonoire`, `verify:revision:neonoire`, `verify:animatic`, `verify:shot-order`, `verify:features`, `verify:images`, `check:assets`, `typecheck`, `lint` (0 errors). Branch **`claude/story-bible-decision-log-k2apor`**, merged to `main-restored`.

## Later the same day — 7 October 2026: one voice per character

**Harada had two voices and the scene 1 old man had two; Mrs. Sakai and Mrs. Noda wore Kaneko's.** Harada's six newspaper-office lines and the old man's "Don't let them have it." were re-recorded in the saved `Harada - NEONOIRE` / `Sakai - NEONOIRE` voices, and Mrs. Sakai (6 lines) and Mrs. Noda (9 lines) got newly designed voices (`Mrs. Sakai - NEONOIRE`, `Mrs. Noda - NEONOIRE`; both picked blind), all under their old ids with the old takes archived (`archive/*-v1.mp3`). Plans: `docs/neonoire/voice/elevenlabs-plan-unify-2026-10-07.json` and `…-sakai-noda-2026-10-07.json`. `sync-voices.mjs` now merges with earlier passes (a frame changed twice keeps both digests); `verify:revision:neonoire` still replays it. Still borrowed, each with too little text to design from: Mr. Noda, the old tobacconist, the bartender, the Mother (quiet), the vending machine. Re-import into both games is needed after this (README, "Reaching the games"). Branch **`claude/story-bible-decision-log-k2apor`**, to be merged to `main-restored`.

## Previous session — 7 October 2026: the cold open's first retakes (six boards)

**Six of the review's nine "picture is wrong" faults are fixed and installed — shots 14, 16, 17, 18, 25, 26 — each retaken over its own filename with the outgoing study archived first (`public/images/hangar/archive/sN/<name>--v1.jpg`), and each card now carries a note of what changed and where the old take is.** 14's wheel sits across the cab with the tapping hand belonging to the passenger; 16 is leafy Ohio summer with the yellow centre line and the drift; 17's window is down with the wind in her hair and the banded cap; 18 is head-on with the truck's front and the wagon's tail and the nurse alone; 25 has no red in its water and nothing curled in its straw; 26 shows the wagon's two red tail-lights. `scripts/hangar/retake-install.mjs` is the studio (trims the model's letterbox, centres to 16:9, archives, installs); `verify:images` now guards `public/images/hangar/` against its own archive as well as Nobody's Witness (proved with a negative test); `scripts/hangar/build-project.mjs` carries the corrected briefs for all six and records each retake's note; contact sheet `public/images/hangar/reviews/retakes-2026-10-07.jpg`; work list and honest caveats in `docs/hangar/review-2026-10-07.md` (25 is brighter than its scene's key; the pass hit the session's ten-generation limit, so 12, 27, 31, 32, 34 and 36 are the next pass's queue — 31's board is done and uninstalled for that reason). Branch **`arena/b4faf5bf-playframe`**.

## Previous session — 7 October 2026: painted boards for all 39 cold-open shots

**The untitled cold open now has its pictures: 39/39 boards in `public/images/hangar/s1/`–`s8/`, zero placeholders, nothing borrowed from Nobody's Witness.** Shots 1–3 are the screenplay's pure black frames; 4–39 are painted in the house style against new continuity sheets, so the crate (pine box, steel straps, stencil WRIGHT FIELD 1944 – INERT, one ordinary **coffee-stain ring** on the lid — a stain, not a symbol), the cream-and-teal semi with its plain box trailer, the woodgrain wagon, the unmarked sedan and all five faces stay the same from shot to shot. The nurse is drawn warm and pretty; shot 13's rear window is filled by the hitched trailer's front wall (there is no road behind it — that is the beat). **Styles for future use:** a real example for Painted Americana '75 at `public/images/styles/painted-americana-75.jpg` now wired into the style picker (it no longer borrows the Ghibli one), cast sheets for the sergeant, airman, trucker, nurse and agent plus key art in `public/images/hangar/sheets/`, and the four prop sheets in `public/images/hangar/props/`. One retake: shot 15's first take had a mangled face — archived to `public/images/hangar/archive/s3/15-slow-one-never-arrives--v1.jpg` before the corrected board replaced it. `scripts/hangar/build-project.mjs` now installs a board on every shot, the cast sheets on the character cards and the key art as cover; `verify:hangar` asserts every board and sheet is on disk; README and the template card updated. All checks pass: `build:hangar`, `verify:hangar` (15 platforms × 39 prompts), `check:assets` (1020 refs), `typecheck`, `lint` (0 errors). Branch **`arena/651e399b-playframe`**, merged to `main-restored`.

## Previous session — 6 October 2026: shot 73 retired, the cold open's geometry, Vera's emptiness frames

**Shot 73 (the vending-machine frame, id `neonoire-shot-71`) is retired — number not reused, image stays on disk. Shots 14, 17, 18 were retaken to one lane layout (barbershop left, vending machine right, bar at the far end, sedan gone after 13; earlier versions archived). New: 383 (empty lane), 384–386 (Vera in her apartment), 387–388 (Vera's run in the red dress). 366/366 images, next free number 389.** Read the bible's Part 9 item 19 (open calls listed there) and the top of `docs/neonoire/handoff.md`.

**Later the same day: the car scene (bible item 20) is done — 333 retaken here; 10, 12, 13 and 11 other frames (361, 158–161, 320, 86, 87, 316, 89, 90) were retaken in scarlett-witness and synced back (item 21), old versions archived.**

## Previous session — 5 October 2026: the prologue, shot 377

**Scene 1 now opens on `.INSERT - THE HIVE, REMEMBERED`: five `KANEKO (V.O.)` paragraphs (English narration) over new shot 377 (`s1/377-the-hive-remembered.jpg`, a new file, nothing overwritten). 356/356 images, next free number 378.** Read the bible's Part 9 item 18 and the top of `docs/neonoire/handoff.md`. A pre-prologue script hash was appended by hand to `neonoire-scene6-sync.json` (never re-run `sync-scene6.mjs`).

## Previous session — 4 October 2026 (seventh pass): shots 369–376 and the restored image chooser

**Eight new scene-ordered coverage frames, 369–376, 355/355 images, zero placeholders, next free number 377.** Scene 25 gets the floor-level drawing and the corrected 114 tag; scene 20 the Mara single and the red-bird clip on the closed sketchbook; scene 27A Okada's arrival and Vera's face in the switched-off CRT; scene 11 Jack setting down the receiver; scene 36 Jack's side of the payphone call. Shot 375 uses `375-the-line-ends-retake-raw.jpg`, the desk-only corrected image; the first draft with the wrong door lettering and static CRT is not installed. No existing frame image was overwritten, and shot 258 remains unchanged. Read `docs/neonoire/passes/coverage-369-376-2026-10-04.md` and the top/current section of `docs/neonoire/handoff.md`.

The storyboard card's `⋯` menu now opens a preview chooser for exact-shot earlier versions and unused alternates from that scene. `imageOriginal` keeps the first image; `imageHistory` retains later selections through save/import. The image-library manifest has 705 assets (355 current shots, 276 archived earlier versions, 20 unused scene alternates, and 54 sheets/keys/props), so the originals remain available in the shot chooser. Refreshed saved-default migrations carry 344–376 in four atomic batches. NEONOIRE, revision-restoration, shot-order, feature, animatic, type, asset, lint and production-build checks pass. The browser regression is authored but unrun because the Playwright Chromium download failed; do not say browser verification passed.

For any NEONOIRE screenplay or storyboard work, read `docs/neonoire/story-bible.md` first (story bible and decision log), then `docs/neonoire/handoff.md`.

`docs/neonoire/baseline/Neonoire_Draft1_2026-09-25.fountain` is Draft 1 as originally written. Diff it against `Neonoire (3).fountain`: any difference not listed in the bible's Part 9 was changed in PlayFrame.

Recorded dialogue and voices: `docs/neonoire/voice/README.md` (voices file, manifest, ingest and animatic scripts). Keep the script unchanged for voice work.

## Previous session — 4 October 2026 (sixth pass): the relief pass, one — five new coverage frames, 364–368

**"Create next 10 shots" generated ten frames against the run's free numbers, but two parallel sessions' passes landed on `main` ahead of this one and took every number it was generating against — the long-hold pass took 344–353 (scenes 20/22/23) and the second long-hold pass took 354–363 (scenes 29/17/14). The numbers are production identity, so this pass's five unique frames joined the run at 364–368, and five of its studies were dropped as duplicates of beats the long-hold frames carry (the s20 bulb = their 346 same line, the s20 sack = their 344 same line, the s22 Vera single = their 348/349, the s17 bowl = their 359 same line, the s14 wall = their 361 same line). The dropped raws are kept in `artifacts/neonoire/relief-2026-10-04/`; the full decision table is in the ledger. 342 → 347 keyframes, 0 placeholders, next free number 369, nothing replaced and nothing renumbered.** The five are the **two unboarded script beats** neither long-hold pass took: **364–367** scene 59's INTERCUT to Mrs. Sakai's empty house (the kotatsu with the television on and never static, the altar held to `s1/07-old-man.jpg`, the teacup on its side, the phone ringing) — four 35mm cuts playing before 228; **368** scene 94's door closing (the hinge the retake round left with no frame of its own, 50mm at the door). Where they play is the scene's logic, not board order: scene 59 runs **364, 365, 366, 367**, 228; scene 94 runs 141, 142, 143, **368**. The caveats are honest and in the boards; **364's altar photograph reads a different face than the locked `s1/07-old-man.jpg` — its face-check retake hit the session's ten-generation limit and 364 is the head of the next pass's queue.** `build-project.mjs` now carries separate notes branches for 364+, 354+ and 344+; `verify-neonoire` scopes the long-hold block to 344–363 and asserts the relief block on 364–368 (`EXPECTED_SHOTS` 347, run 241–368; the scene-group `revisionBoards` filter stays `>= 308`, keeping every 4 October coverage frame out of the older generation blocks' scene-group sets); `verify-shot-order` moves `nextShotNumber` to 369 and `verify-shot-order-browser` to 369/370; `library.json` was rebuilt by hand to 697 images (the tool's git-history walk is shallow-clone blind). **All checks pass:** `build:neonoire` (347/347, 0 placeholders), `verify:neonoire`, `verify:shot-order`, `verify:revision:neonoire`, `verify:animatic`, `verify:rapture`, `verify:features`, `check:assets`, `typecheck`, production build. Branch **`arena/01a1076a-playframe`**, merged to `main`.

## Previous session — 4 October 2026 (fifth pass): the second long-hold pass — ten new coverage frames, 354–363

**"Create next 10 shots" took the next three holds from the coverage note the voiced animatic wrote, ten new numbered frames, nothing renumbered and nothing written over. 332 → 342 keyframes, 0 placeholders, next free number 364.** The note in `docs/neonoire/shots-needed.md` lists the long holds: **scene 29, 53 seconds on 273; scene 17, 46 on 189; scene 14, 42 on 270.** The pass covered: **354/355/356/357** Mrs. Sakai's house (the altar photograph, Jack asking about rent, the unfolded No. 114 receipt, Mrs. Sakai watching him with grief and relief), **358/359/360** Kaneko's counter (Jack looking at the empty third stool beside him, Kaneko serving the steaming noodles, the overpayment and business card on the counter), **361/362/363** Mara's apartment (Vera looking at the wall of sketches, Jack turning the page to the careful kanji sign drawing, Vera placing the red bird clip onto the sketchbook). Generated in screenplay order from each room's delivered masters with the cast sheets attached, installed 16:9 full-bleed 1920×1080 by `fresh-install.mjs` at new asset paths — no original image was replaced. Read [the ledger](docs/neonoire/passes/long-hold-2-2026-10-04.md) and the handoff's new Current section. In-scene playing order: scene 29 runs 354, 206, 355, 273, 356, 357; scene 17 runs 189, 358, 359, 360, 190; scene 14 runs 184, 270, 361, 185, 362, 363. All checks pass: `build:neonoire` (342/342, 0 placeholders), `verify:neonoire`, `verify:shot-order`, `verify:revision:neonoire`, `verify:animatic`, `verify:rapture`, `verify:features`, `check:assets` (949), `typecheck`, `lint`, production build. Branch **`arena/01a10798-playframe`**, merged to `main`.

## Previous session — 4 October 2026 (fourth pass): the long-hold pass — ten new coverage frames, 344–353

**"Create next 10 shots" took the head of the coverage note the voiced animatic wrote, ten new numbered frames, nothing renumbered and nothing written over. 322 → 332 keyframes, 0 placeholders, next free number 354.** The note in `docs/neonoire/shots-needed.md` says a single board cannot keep a long exchange alive past about thirty seconds, and its three longest holds each had one frame: **scene 23, 95 seconds on 199; scene 22, 64 on 197; scene 20, 55 on 194.** The pass gave each room its hands, its singles and its held silences — **344/345/346** the storeroom (him on the flour sack making himself smaller, the sketchbook pulled into her lap with the clip on its cover, the bare bulb and the humming silence), **347/348/349** the arch counter (the cups trembling as the train goes over, her turned single, his answer with his eyes on the bowl), **350/351/352/353** the yakitori stall (Ishida's hands turning a skewer, Jack watching him, the napkin written on and pushed across, the small nod that ends the scene). Generated in screenplay order from each room's **delivered masters** with the cast sheets attached, installed 16:9 full-bleed 1920×1080 by `fresh-install.mjs` at **new asset paths** — so no original image was replaced and the archive fired for none of them; the standing instruction's backup rule now binds any future retake of the ten instead. Read [the ledger](docs/neonoire/passes/long-hold-2026-10-04.md) and the handoff's new Current section, which carries the five decisions (the 50mm/85mm singles inside 35mm scenes; 350 and 352 leaving Ishida without a close single — a coverage observation, not smuggled in; 353 taking the nod and 200 keeping the sway; nothing replaced, nothing archived; and the new **separate** sync module — do **not** re-run `sync-scene6.mjs`). Where they play is the scene's logic, not board order: scene 20 runs 309, 193, 194, **345, 344**, 284, **346** (the book into her lap before he sits). The caveats are honest and in the boards: **352's napkin carries partly legible pseudo-text where the board forbids a readable address — the one caveat worth a retake**; 347's tremble cannot read in a still; 349 came back wider than its 50mm board line; 351's eyeline drifts and his wet hair does not read. **All checks pass:** `build:neonoire` (332/332, 0 placeholders), `verify:neonoire`, `verify:shot-order`, `verify:revision:neonoire`, `verify:animatic`, `verify:rapture`, `verify:features`, `check:assets` (939), `typecheck`, `lint`, production build. Branch **`arena/01a10771-playframe`**, merged to `main`.

## Previous session — 4 October 2026 (third pass): visual inspection and audit of the retake queue's ten frames

**Visual sign-off and scene consistency audit of the retake queue's ten final frames (113, 131, 132, 141–143, 160, 161, 186, 228).**
Under the standing instruction *"if shot description don't make complete visual sense go by the logic of the scene, keep character and scene consistancy, make sure any original image replaced is backed up and then merge with main"*, the ten frames were examined across the review contact sheets and against character/location canon:
1. **113** (Vera close-up; architectural model with empty white plaza and painted figures, no old block/fountain).
2. **131** (stairwell insert; her hand reaching down and pulling Jack upward).
3. **132** (old woman's room with sumo on CRT television, pointing to open door; no landing/torch).
4. **141** (24mm wide exterior; black sedan at kerb, open door showing amber interior, empty cast, one lit window above).
5. **142** (85mm close-up; Ishida paused in rain looking up at lit window, no tie).
6. **143** (50mm two-shot; tea cup offered, watch with silver mesh strap on Kurose's wrist).
7. **160** (Kaneko's counter; Jack on stool 2, stool 3 empty, noren stirring, 金子 sign on wall).
8. **161** (hold on the three of them; Vera on stool 3 in teal coat with red bird clip, overpaid money on counter).
9. **186** (24mm exterior day; hoarding cleanly lettered KUROSE DEVELOPMENT with painted plaza, raining).
10. **228** (green payphone under tin awning; Jack on phone, Vera emerging glowing from Hive entrance).

All 10 replaced studies remain archived in `public/images/neonoire/archive/` (`--v1`–`--v3`). `RETAKE PENDING` is 0; 322/322 keyframes on disk, 0 placeholders. Branch `arena/01a10760-playframe`, merged to `main`.

## Previous session — 4 October 2026 (second pass): the retake queue is closed — ten frames, and the film's last one

**"Continue with next 10 shots" took the rest of the queue and then one frame the queue had missed.** The nine
standing `RETAKE PENDING` pins (113, 131, 132, 141–143, 160, 186, 228) **plus scene 100's 161** — the film's last
frame, which the rewrite had left playing a retired ending with no pin on it — were regenerated onto the current
screenplay text, installed over their own filenames and released: **ten generations, ten frames, `RETAKE PENDING`
9 → 0, 322/322 keyframes, 0 placeholders.** Five of them were decided on the scene's logic rather than the board's
old wording: **141** is now a 24mm wide at the kerb (an empty cast cannot be a two-shot), **131**'s hand runs hers to
his, **132** lost its stair landing and torch for the sumo television and the pointing hand, **160** is the counter
before she sits (Jack on the second stool, the third empty) and **161** is the hold on the three of them, and
**186**'s hoarding carries KUROSE DEVELOPMENT alone — TOMORROW'S TOKYO died with scene 97. **113 keeps its close-up
against the revision's own wide rule; that is the call most worth a director's reversal.** Every replaced study was
archived (`--v1`–`--v3`) and committed **before** the new frame went over it, and `verify:neonoire` asserts each
backup exists. Read [the ledger](docs/neonoire/passes/retake-queue-2026-10-04.md) and the handoff's new Current
section. **Caveat: no full-size visual review was possible in this session** — the frames were checked mechanically
(1920×1080, no letterbox bars, luminance by scene) and the contact sheets are in `reviews/`. Two coverage
observations, not fixed: scene 94's door-closing beat has no frame, and scene 59's INTERCUT to Mrs. Sakai's empty
house is not boarded. **Branch `arena/01a10706-playframe`, merged to `main`.**

## Previous session — 4 October 2026 (first pass): the cold open's five — the 2 October pins released, queue down to nine

## Previous — 4 October 2026 (first pass): the cold open's five — the 2 October pins released, queue down to nine

**"Continue with next shots" took the retake queue's head: scene 1's five frames the 2 October rewrite pinned —
3, 6, 7, 9, 10 — regenerated onto the restored walk and lane, installed over their own filenames and released;
five generations, five frames, nothing thrown away. `RETAKE PENDING` 14 → 9, 322/322 keyframes, 0 placeholders.**
3 is Mara **mid-walk** with the lit phone (the walk is back); 6 is the recess with **the scooter and the stacked
beer crates** in front of her; 7 is the **grey flat cap and cheap raincoat** arriving from the road; 9 is the stop
with **the face fully readable** — the same beat as 331 from the other side; 10 is the **black car broadside across
the lane mouth**, the men walking in, the old man down. The round's rule: character sheets **plus the street master
`s1/01-backstreet.jpg`** as the lane's geography (and the installed 331 for 7/9, 332/333 for 10) — written into
`cold-open-fresh-look.mjs`. **10's two caveats want a director's eye:** the men read as full face coverings rather
than the locked knit cap + lower-face mask, and the blocking car reads van-like. Read
[the ledger](docs/neonoire/passes/cold-open-retakes-2026-10-04.md) and the handoff's new Current section, which
also lists the three **superseded board wordings** (228's embrace, 186's banner, scene 89's noise barrage) the
remaining nine pins must be fixed with. `verify:neonoire` gained the release assertions and corrected a stale
expectation: shot 3's brief must now **ask for the walk** (the 2 October rewrite restored it); the pole snag (17)
and flashlight drift (18) stay prohibited. All checks pass. **This session's branch is `arena/01a10451-playframe`**
— older handoff text naming other arena branches is historical; `node_modules` vanishing mid-session is the
documented sandbox symptom, and `npm ci` alone recovers it when HEAD matches origin.

## Previous session — 3 October 2026 (night): the rewrite slots, pass four — 322/322, the board is complete

**One generation, one frame installed: 343 *Forty metres back*, and the film's last placeholder is gone — 322 of 322
keyframes on disk, zero placeholder cards.** The study is the camera behind both cars, the old silver-grey sedan seen
from its **rear** in the near right foreground with its lamps throwing light forward up the wet asphalt, the small
boxy maroon hatchback far ahead as two red points, nobody else on the road. Pass three had thrown the first study away
for taking the follower nose-on to the camera while the followed car showed tail lights, and had written the geometry
down as a rule; the corrected study satisfies it. **`verify:neonoire` now reads owed = `[]`, queued = `[]`, delivered =
321–343 and asserts no placeholder card is left**; `rewrite-slots.mjs` carries the empty queue, `plan.mjs` reads 14A as
all ten on disk, `passes:README.md` reads 322 of 322, and the 343 placeholder-note digest joined `pendingNotesHashes`
(23 digests, 321–343). **343's caveats:** the gap reads long rather than exactly forty metres, both cars' plates show as
small blanks, and the dim nearside-headlight lock can't be judged from behind. Read
[the pass-4 ledger](docs/neonoire/passes/rewrite-slots-4-2026-10-03.md) and the pass-4 section of the handoff.
**The session branch is merged into `main` in this session** — the finished board is on `main`, no history rewritten.

## Previous session — 3 October 2026 (evening): the rewrite slots, pass three

**"If the shot description doesn't make complete visual sense go by the scene's logic and leave note in handoff."**
Ten generations, eight frames installed, two studies thrown away, one slot left open: **321/322 keyframes on disk, the
film's only placeholder is 343.** Delivered: 331 (retaken: single sharp figure — the earlier study carried a second
elderly man, the one after it was blurred), 336 (retaken: the light at the window of the **maroon boxy hatchback** the
script gives Vera, not the SUV the study drew), 338 (retaken: wrapper peeled back, rice bare, no bite), 339 (retaken:
**Vera turns to Jack** — the page's beat is hers), plus new **340** (the watcher's hand on the bar's shuttered handle),
**341** (the arm across her, the umbrella turning to the car) and **342** (the pencil plate **56-19** on the flattened
bag). **337's retake was thrown away for stringing red lanterns down a lane whose canon has none and hiding the clip**
— the pass-2 master stands and `verify:neonoire` asserts "no lanterns, ever". **343's study was not installed**: it
took the following grey sedan nose-on to the camera while the hatchback ahead showed its tail lights, so the board now
fixes the geometry — camera behind both cars, the follower showing its **rear**, forty metres back — and the slot
waits. Read [the pass-3 ledger](docs/neonoire/passes/rewrite-slots-3-2026-10-03.md) and the handoff's seven permanent
scene-logic decisions before regenerating anything in scenes 1 or 14A.

## Previous session — 3 October 2026 (later): the rewrite slots, pass two

**"Continue"** took the head of the queue: scene 1's last three (**331** he refuses, **332** the sedan broadside across
the lane mouth, **333** the old man in the white light) and **scene 14A's first six** (**334–339** — the mirror, the
lane mouth, the lighter, **337 the scene's master**, the rice ball, not running from you). Ten generations, one thrown
away (336's first study came back portrait), everything 16:9 at its stable path; **318/322 on disk, four placeholders
left: 340 and 341–343**. Read [the ledger](docs/neonoire/passes/rewrite-slots-2-2026-10-03.md) before touching scene
14A: the interiors read newer than the scene-31 car (337 is the master to copy, corrected), 336's car reads SUV rather
than the locked maroon hatchback, and **339 leaves Vera looking at the lane instead of turning to Jack** — the retake
candidate. Scene 1's caveats: 331 has a second elderly man in frame, 332 lights the pole, 333 invents a sign and loses
the scooter. The delivered boundary is `scripts/neonoire/rewrite-slots.mjs`; `verify:neonoire` now also gates 14A's
delivered/owed split.

## Previous session — 3 October 2026: the rewrite slots, pass one ("continue next shots")

**Ten generations, ten frames installed, nothing renumbered: the interview room's 321–327** (the form, her
handwriting, the pen that stops, the passport photograph, squared to the corner, no trace, the inside pocket) **and
scene 1's 328–330** (the scrap, the lane and her watch, the red clip), all 16:9 at their stable paths.
**309/322 keyframes on disk, 13 placeholders left** — 331–333 plus scene 14A's 334–343, briefed in
`docs/neonoire/passes/pass-34.md` and `pass-35.md`. The delivered boundary lives in
`scripts/neonoire/rewrite-slots.mjs` and both the builder and `verify:neonoire` read it; the interview frames attach
the room masters (51, 56, the retaken 62) and the cast sheets, the cold-open frames character sheets only. Read
[the ledger](docs/neonoire/passes/rewrite-slots-1-2026-10-03.md) for the ten unclosed caveats (325's wrongly headed
form is the one to close) before regenerating anything in those scenes. **Do not add the current bundle to
`sync-scene6.mjs`'s intermediates** — it already contains scene 14A, and a workspace that deleted the scene would get
it back (that fails `verify:revision:neonoire`).

## Previous session — 2 October 2026 (night): scene 14A, Vera and Jack in the car

The director added **14A** (INT./EXT. JACK'S CAR, KANDA - NIGHT, between 14 and 15) so their closeness is planted before scene 22: she tails his car, they sit out a stakeout, he follows her home. 103 scenes, 322 shots; boards **334–343** are placeholders (next free number **344**), no voices yet. It deliberately names no Sakai or Ishida, never lights the lighter and shows no grey car; `verify:neonoire` guards all three. The pre-14A script is kept as `docs/neonoire/baseline/Neonoire_PreScene14A_2026-10-02.fountain` and saved workspaces on a known default receive the scene (`newSceneIds` in the sync). Read the bible's Part 9 item 17 and the handoff before touching it.

## Latest session — 1 October 2026: Jack's office desk lock, and the card out of the puddle

Jack's office is one room and must never be redrawn. Scenes 10, 11, 18, 21 and 77 all carry
`scripts/neonoire/office-layout-look.mjs`: the **free-standing 1.60 m × 0.75 m worn dark-walnut desk**, banker's lamp at
its **left** end, **exactly one** rotary phone at its right back corner, grey steel cupboard under the window with
nothing on top of it, filing cabinet + CRT and the sofa on the right wall, door lettered the whole word JACK, **never
mirrored, never a second table**. The only room master is `s10/164-depends-whos-calling.jpg`; `s77/85` was rebuilt to
agree with it and no longer leads. Ten generations (the budget) installed seven corrected frames in place — 6/62 (card on
dry laminate, spill confined to the crushed cup), 11/245 (box **out of the cupboard**, no chair), 11/251, 10/166, 10/167,
18/191, 77/87 — and the director authorised the **one scene-11 action line** that moves with it. Dialogue, scene numbers,
asset paths and the 299/102 board are unchanged. A second session the same day spent ten further calls on the six
frames pass 1 queued — 11/252, 77/88, 77/89, 18/283 and scene 21's 196 and 271 — two of those calls being corrections
(an invented second pair of hands inside a "man alone" frame, a third coffee cup in a two-cup scene), and scene 21's
room turned out to be a **mirror** of the master and was un-mirrored. `officeLayoutQueued` is now empty and
`verify:neonoire` guards the lock, the single telephone, the master's status, the card's dry laminate **and that empty
queue**: declaring a frame unfinished takes an edit in the module *and* in its note. The first ledger also claimed
those two scene-21 frames were already `RETAKE PENDING` — they never were; the 30 September pins are scene **20**'s
193 and 194 — and the verifier pins that fact too. Read
[the ledger](docs/neonoire/passes/office-desk-lock-2026-10-01.md) before regenerating anything in this room.

## Latest correction — 1 October 2026: full-page audit and restored 99A

Prior image/export work is committed as `8bfa455`. The complete pre-revision 106-scene source is preserved in `docs/neonoire/baseline/Neonoire_PreRevision_2026-09-29.fountain`; the shipped pre-restoration source is `Neonoire_PreRestoration_2026-10-01.fountain`. Read [the full-page audit](docs/neonoire/passes/revision-restoration-2026-10-01.md). **299/299 images across 102 scenes**: original demolition cards 158/159 are restored inside 99A before the dissolve to 305/306/307, never a revived separate 99. Kaneko's six old stools are explicit before the plaza; the introductions, 25 bonding exchange, 94 tea line and 98 title card are recovered. All rooftop text and the 91 train survive; 85/87/91/92 are unchanged, 86/88/90 add-only.

`verify:revision:neonoire` guards the complete pages and safe saved-template refresh. Three existing takes from 13 are re-pinned to 25; one now-false father recollection is archived, not erased. New corrected 25 speech and restored 94 tea line are unrecorded; no replacement voices were generated. The selected main-image approvals remain intact. Older draft counts/retirement notes below are historical.

## Latest session — 1 October 2026: director-selected main images and animatic export

The director selected the final nine and the corrected drawer/run sequence as **Ready/main images, with no review queue**. Seven replacements installed (7/64,65,67; 73/69,70,71; 75/80). Retain the matching one-shoe exit/puddle pair, not the rejected new shoe studies. Only the explicitly authorised drawer/forward-route sentences changed in the Fountain; dialogue and score are unchanged. See bible Part 9 item 11 and [current delivery](docs/neonoire/passes/director-continuity-animatic-2026-10-01.md).

The app now exports real MP4s through Export → Animatic playback, using the existing FFmpeg script with saved snapshots, scene/shot order, static cameras, timing/audio controls and progress/download/cancellation. `verify:animatic` and `verify:animatic:browser` cover it. Set `FFMPEG` or install FFmpeg; outputs in ignored `exports/animatics/`. Previous draft wording below is superseded for selected main images; the older rewrite pins are separate.

## Latest session — 1 October 2026: final nine images and screenplay order

**Nobody's Witness** has **297/297 shot images across 102 active scenes**, zero missing-image cards. The final nine (298/299/300/302/310/311/313/314/320) are fresh **draft** studies; 311 used a corrective retake. The **16 older rewrite retakes remain Needs review**. Read [the final pass and its full-size continuity caveats](docs/neonoire/passes/remaining-boards-final-2026-10-01.md) and the updated bible/handoff before more generation; historical missing/master queues below are superseded.

Storyboard, shot list, player, shared view, prompt batches and CSV/print are now in screenplay scene order, with quoted-beat coverage interleaved by the builder. Original shot numbers/scene insert labels/IDs/filenames remain fixed. Saved reads fill untouched marked blanks and migrate only exact legacy default ordering, preserving writer edits and intentional blanks. Cross-scene reordering is blocked; edits inside a scene persist. New/duplicate shots get distinct production numbers. The screenplay and voice files were not changed.

`npm run verify:shot-order` is the ordering/import/migration/rendered-view/export regression. The rebuilt bundle and all feature/assets/type checks pass. `verify:shot-order:browser` and `verify:features:live` also pass on the production preview (port 3000), including real desktop/mobile interactions; no screenplay or audio changes.
