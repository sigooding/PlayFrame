# Let the Raptures Commence: recorded dialogue

Episode one, the draft of 21 September 2026 ([`../ep1-screenplay.md`](../ep1-screenplay.md), the episode's authority): **all 166 spoken lines are recorded**, one `eleven_v4` take each, in 13 designed voices. **Nobody has listened to any of it**, but a speech-to-text pass on 66 of the takes found that 19 said their line twice or more, and those were re-recorded (below). Open [`public/audio/rapture/index.html`](../../../public/audio/rapture/index.html) (from a checkout, or the site at `/audio/rapture/`): the table read plays the episode scene by scene with the pauses the script spells out, and the cast lists every voice preview so the voices can be picked by ear. Only in PlayFrame: nothing here goes into the visual novel or scarlett-witness.

| Piece | Where |
| --- | --- |
| Which voice speaks each character (and every preview, measured) | [`voices.json`](voices.json) |
| Every recorded line (text, prompt, voice, file, duration, level, offset on the scene's timeline, ElevenLabs generation) | [`manifest.json`](manifest.json) |
| The plan the takes were recorded from (166 rows with the direction of each) and its readable script | [`elevenlabs-plan-ep1.json`](elevenlabs-plan-ep1.json), [`elevenlabs-script-ep1.md`](elevenlabs-script-ep1.md) |
| The takes | `public/audio/rapture/ep1/<screenplay page>/NN-<speaker>-<words>.mp3` |
| The 20 takes that were replaced (kept, never overwritten) | `public/audio/rapture/archive/ep1/<page>/<name>--v1.mp3` |
| The clean re-recordings that were not used (44) and the ones that repeated themselves again (7), with an index | `public/audio/rapture/alternates/2026-10-08/` |
| What was wrong with each replaced take and what was heard, every prompt and generation | [`rerecords-2026-10-08.json`](rerecords-2026-10-08.json) |
| The 45 voice-design previews (the unpicked ones are auditions) | `public/audio/rapture/voices/` |
| Reads the draft into its spoken lines, ids and the pauses the page spells out | `scripts/rapture/voice-script.mjs` (`--list` prints them) |
| Adds a v4 direction to every line, writes the plan | `scripts/rapture/voice-plan.mjs` (`--check` fails if the plan is out of date) |
| Ingests a folder of takes (`R001.mp3`...) against the plan, measures them, writes the manifest | `FFMPEG=... node scripts/rapture/voice-batch.mjs --dir <folder> [--generations meta.json]` |
| Pitch, range, brightness, pace and level of a clip | `FFMPEG=... python3 -I scripts/rapture/voice-measure.py clip.mp3 [words]` |
| Screens takes for a repeated word, merges speech-to-text transcripts | `FFMPEG=... node scripts/rapture/voice-screen.mjs` (`--fill`, `--heard file.json`) |
| Replaces faulty takes: archive first, then install | `FFMPEG=... node scripts/rapture/voice-rerecord.mjs --dir <staging> --archive` then `--install` |
| Lays the dialogue over the frames of the two verbatim boards | `scripts/rapture/voice-frames.mjs` (called by `build-project.mjs`; `verify:rapture` checks it) |
| Renders the listening page | `node scripts/rapture/voice-page.mjs` |

## The cast

One saved ElevenLabs voice per character, named `<Character> - RAPTURES`: Nina, Kath, Ray, Jodie, Danny, Maureen, Brian, Terry, Col, Deborah, Martin (one line now, a large part from episode four), the man in the blue coat, and **Young Man**, which plays both the nineteen-year-old mugger and the keen volunteer (three lines each, never in a scene together). Each was designed from the show bible's cast text, with the character's own screenplay lines (plus their scene partner's replies where a part is too short for the tool's 100-character minimum) as the preview text, three previews per design. They were **picked blind**, by measured pitch, range, brightness and pace: the deadpan parts (Nina, Ray, Kath) took the narrowest pitch range, voices that share a scene were kept apart (Nina 170 Hz, Maureen 242, Deborah 148; Terry's gravel against Col's smooth baritone). `voices.json` says why each was chosen and keeps every preview's numbers. To change a voice: audition the previews on the page, save the one you like (`creative_save_designed_voice`, if the preview is still there) or design a new one, put its id in `voices.json`, and re-record the character's lines (below).

Two findings to keep:
- **ElevenLabs refuses to design a child's voice.** The first request for Jodie ("Girl, 11, English...") was blocked by its safety check, so Jodie is a light young adult voice: a stand-in until there is a child actor.
- **Timbre words fight pitch words in a design.** The first Brian ("a thin, slightly nasal voice") and Terry ("a heavier, gruffer voice") came out at 200 to 270 Hz, higher than the women. Asking for "a dry mid-range tenor" and "a deep, gravelly bass-baritone man's voice" fixed both. Both first rounds are kept on the page, marked as not used. Check the pitch of a male design before saving it.

## How the lines were recorded

Directions are written the v4 best-practice way, short natural-language directions in brackets in front of the line, the voice and the emotion together: `[Dry, flat, after a long pause] Some of them'll have been in cages.` Kath is `Earnest`, Ray `Dry`, Nina `Flat`; the writer's own parentheticals in the screenplay ("(not stopping)", "(hissing)", "(a beat)") are honoured. The register is one dry comedy throughout ("no pathos beats"), so most lines are plain. **No hushed directions** (`quietly`, `softly`, `weakly`, `whisper`, `murmur`): the NEONOIRE finding (voice README there) is that they read about 10 dB under speaking level, and `voice-plan.mjs` refuses them. The shortest lines read quietest (a one-word "Mm." has few loud frames); the quietest take of 166 is Jodie's "Mm." at -30 dB and the man in the blue coat's "(barely) There's no court." reads -27 dB, on purpose. Voices differ by up to 7 dB (Terry -19.7 dB on average, the man in the blue coat -26.9), so the listening page turns each voice down to the quietest voice's level; the files themselves are as ElevenLabs made them. The whole episode cost about 7,400 credits (one take per line, about a credit a character).

**Pauses.** The screenplay locks the pauses it writes out ("Four seconds of nothing", "A long pause" = 4 s, "An eight-second pause", "A six-second pause", "Five seconds"); `(pause)` is 1.2 s, `(a beat)` 0.7 s, `(immediately)` 0.1 s. Every other gap is a table-read estimate (0.5 s between speakers, 0.8 s for one speaker's next line, more where the page describes action between two lines, capped at 6 s). Each manifest line's `offset` is its start on its own page's timeline; `gapKind` says whether the gap before it is `written` or `estimated`.

## On the frames

`scripts/rapture/voice-frames.mjs`, called by `scripts/rapture/build-project.mjs`, puts the 53 lines of page ep1-07 (Danny and Jodie, 21 shots) and ep1-08 (the cops' second beat, 6 shots) on their frames. It reads each board shot's indented `SPEAKER: text` lines, matches them in order to the manifest's lines for the page and **stops the build** if a speaker or a word differs (the one declared trim: the board says "anyone still alive", the draft "anyone who's still alive"). Inside a frame every line keeps the spacing the page's own timeline gives it; the first word comes 0.6 s after the cut, or after the hold the draft writes ("Hold. Four seconds." before Kath's first line, "Hold. Five seconds." before Ray's "Kath."; the six-second pause is kept). A frame grows when its words do not fit (never shrinks), so the last word has 0.6 s of air: five frames grew, Danny and Jodie from 148 to 158 s and the cops' second beat from 90 to 92 s. A frame's note says so. The offsets come from the page's table-read estimates (0.5 s between speakers, more where the page describes action), so they are estimates like the rest of the timing; the written pauses are exact.

A saved workspace that has no dialogue on these frames receives it on its next read (`bundledAudioUpdates`); nothing else it holds changes.

## The repeat fault, and the re-records (8 October)

**`eleven_v4` repeated short lines.** A speech-to-text pass (`eleven_scribe_v1`, on plain copies of the takes, not on the generation nodes, whose "transcript" only echoes the prompt) found 19 of the first 166 takes saying their line twice or more: "Rules. Rules", "They're gone. They're gone", "Exactly. Exactly", "No, no", "Why? Why? Why?", "One in ten, one in ten, one in twenty", Kath's last line "Us, us, us, us, us" (a five-second take); Ray's "Kath." came back as "Ca- calf". Danny's "It was already —" stammered ("It, it was already") and was replaced too: 20 takes in all, in scenes 2, 3, 4, 6, 7 and 8. All but one were lines of three words or fewer (the exception is Kath's recited caution in the police car, whose first sentence was said twice).

**A direction longer than the line invites it.** "[Dry, after a long pause] Kath." came back "Kath. Kath"; "[Low, steady, serious, said once] Rules." and "[Low and serious, a single word] Rules." repeated again; a bare "Rules." and "[Serious] Rules." came back once. So the 20 were re-recorded with **one-word directions** (`[Flat] No.`, `[Dry] Mm.`, `[Pleased] Exactly.`, `[Sincere] Us.`, `[Uneasy] They're gone.`), three takes each, and a take was kept only if it passed the screen. `voice-plan.mjs` still carries a longer direction on 45 lines of three words or fewer; they came back clean (screen and, for the ones transcribed, speech-to-text), and `voice-screen.mjs` flags any new take that does not.

**The screen.** `voice-screen.mjs` splits a take at silences (0.22 s or more, 32 dB under its peak) and counts the phrases against the chunks the line is written in. On the 53 lines transcribed it flagged all 8 faulty takes and one good one; on the other 113 it flagged 13, 11 of them faulty; after the re-records 3 takes are flagged and all 3 are cleared by a transcript (`heard` in the manifest). Each manifest entry carries `phrases` and `expected`; a re-recorded one carries `rerecorded` with the old take's archive copy, prompt, level, generation and what it heard.

**What is and is not checked.** 66 takes were transcribed (the two boarded scenes, Danny and Jodie and the cops' second beat, all 53; the 13 the screen flagged elsewhere) and 19 of the 20 new takes. The other ~80 first takes were screened for repeats only; a dropped or mispronounced word would not show. **Ray's re-recorded "Kath." in the police car (scene 3, line 53) transcribed as nothing** (the other "Kath." as "Cath", a spelling of the same sound), so it is the take to listen to first; five alternates are in `alternates/2026-10-08/` (`R095-alt1`...`alt5`). A one-hum "Mm." transcribes as "Hmm." or as Japanese "うーん" (the speech-to-text cannot spell a hum); those are single hums.

## Re-recording a line

Take the line's `prompt` and `voiceId` from the plan (change the direction in `scripts/rapture/voice-plan.mjs`, run it, and the plan follows), generate it with `creative_generate_speech` (`eleven_v4`, three takes), keep one that passes `voice-screen.mjs`, and describe the change in a record like `rerecords-2026-10-08.json`. Then `voice-rerecord.mjs --archive` copies the old take to `public/audio/rapture/archive/ep1/<page>/<name>--v<N>.mp3` (commit that first) and `--install` puts the new one over it, keeps the other clean takes as alternates, updates the manifest and lays every page out again. For a brand-new line `voice-batch.mjs` ingests it and screens it.

**ElevenLabs does not keep generations for long** (signed links last two hours): download every take you generate, the unused ones too. Everything generated for episode one is in the repo: the 166 first takes, the 20 replacements, 44 alternates, 7 repeats, 45 voice previews.

## Episodes two to five (8 October 2026, later)

**All 502 spoken lines of the twelve shot boards in `docs/rapture/scenes/` are recorded**, one `eleven_v4` take each (about 25 MB), and sit on 139 frames: with episode one's 12, 151 frames of the workspace now speak (555 takes). The boards have no screenplay draft, so each board is its own authority and a line belongs to the shot it is written in. **Nobody has listened**: the voices were picked blind from measured previews, the directions are unheard.

| Piece | Where |
| --- | --- |
| Reads each board's `SPEAKER: (direction) words` lines (502, 12 boards), with the pauses a board spells out | `scripts/rapture/board-script.mjs` (`--list`) |
| Adds a v4 direction to every line and writes the plan (`--check` fails if it is stale, `--risky` lists lines whose direction is longer than the line) | `scripts/rapture/scenes-plan.mjs` → [`elevenlabs-plan-scenes.json`](elevenlabs-plan-scenes.json), [`elevenlabs-script-scenes.md`](elevenlabs-script-scenes.md) |
| Every recorded line: text, prompt, voice, file, duration, level, shot, offset on the board's timeline, ElevenLabs generation, repeat screen | [`manifest-scenes.json`](manifest-scenes.json) |
| Ingests the raw takes: final path, measure, screen, lay out | `FFMPEG=... node scripts/rapture/scenes-batch.mjs` |
| The takes | `public/audio/rapture/scenes/<board>/NN-<speaker>-<words>.mp3` |
| Every ElevenLabs generation of each raw take (session, id, prompt) | [`scenes-raw-meta.json`](scenes-raw-meta.json) |
| Alternates (10) and S385's replaced first take | `public/audio/rapture/scenes/alternates/`, [`scenes-alt-meta.json`](scenes-alt-meta.json) |
| Which voice speaks each character on each board | [`voices.json`](voices.json) (`boardSpeakers`) |
| The 16 designs made first and never saved (auditions) | [`casting-eps2-5.json`](casting-eps2-5.json), `public/audio/rapture/voices/eps2-5/` (47 previews) |
| Lays the dialogue over the frames | `dialogueByShot()` in `scripts/rapture/voice-frames.mjs`, called for the 12 boards at the end of `build-project.mjs` |

**Voices.** The workspace is at its 30 custom-voice limit and there is no delete tool, so the 16 designs made for these boards could not be saved. Twenty voices speak: six are episode one's saved designs (Nina, Martin, Danny, Jodie, Kath, Ray), and fourteen are ready-made ElevenLabs voices (library and premade; none needs a slot) picked blind from their previews and from the measures of the designs. Alan, Graham, Neil and the lockup's MAN share one voice (`blank`; they never share a scene, so the show's people who do what they are told sound alike on purpose), and the scout hut's MAN is the hi-vis man. `voices.json` has the reason for each. The designs stay as auditions.

**Directions.** The same v4 rules as episode one. The board's own parentheticals set the direction where they say something a voice can do (`(furious, controlled)` → `[Furious, controlled]`; `PAREN` in `scenes-plan.mjs` maps or drops each one); otherwise the speaker's default. A line of three words or fewer, or a direction as long as the line, gets a one-word direction: a longer direction on a short line is what made episode one's takes say it twice. The hush words are refused as before.

**The repeat screen.** Every take was screened (`voice-screen.mjs`, no transcript). Eight flags in all: S049, S219 and S220 were re-recorded early with a different direction. Of the five that came with the last batches, **S385 ("Shh.", 2.08 s) was replaced** by a 1.28 s take (the first is `scenes/alternates/S385--v1.mp3`), and four short lines (S255, S337, S412, S444) were left, because two fresh takes of the same direction ran the same length and passed the screen: the flag is a breath read as a second phrase (`cleared` in the manifest, alternates kept). About 80 of the 502 were screened only, not transcribed.

**On the frames.** Each line is laid on the frame of its shot with the spacing its board's own timeline gives it, the first word a beat (0.6 s) after the cut or after the hold the board writes; a frame is lengthened, never shortened, so the last word has 0.6 s of air. Eight boards grew: the angels' cold open 125 → 132 s, Graham's interview 172 → 184, Pat's cold open 151 → 162, Pat's house 305 → 308, the scout hut 159 → 161, the kitchen 365 → 367, the therapy class 270 → 297, the night at Pat's 327 → 379; the lockup, Number Fourteen, the estate and the doorstep needed nothing. The whole project is 4,348 s (was 4,232). `build-project.mjs` stops if a board is reworded or a take re-recorded without the manifest following (`dialogueByShot` compares the board with the manifest line by line), and `verify:rapture` checks all of it. Saved workspaces take the new dialogue on their next read through `bundledAudioUpdates` (a frame with none gets the bundle's takes and is lengthened, never shortened).

**Not done.** Sighs, laughs, off-screen noises and "(pause)" breaths the boards imply are not recorded. Levels are as made (voices differ by several dB; the listening page turns each voice down to the quietest's level). The ready-made voices are not Raptures-specific and could be replaced by saved designs once slots are free: the 16 designs are the first candidates, and `voice-rerecord.mjs` is the way to swap a voice line by line. Episode one's scenes written after their boards still need re-boarding (see below).

## Re-boarded: the mugging, St Jude's, the washing-up and the first cops scene (8 October 2026, night)

Those four scenes were written after their boards (the boards said so: "reference only, not re-boarded"), so their takes could not go on frames. Each now has a board written from the draft page beat for beat, with the draft's words verbatim and each line on the shot it is written in. The old boards are in `docs/rapture/scenes/archive/` (`ep1-mugging-alley-v1.md`, `ep1-st-judes-two-hander-v1.md`, `ep1-washing-up-fix4-v1.md`; the first cops scene never had a board file, its legacy keyframes `a2s1-01..19` are now laid on the shots they show).

| Scene | Board | Shots | Lines on frames | Pictures |
| --- | --- | --- | --- | --- |
| The mugging (`ep1-01`) | `docs/rapture/scenes/ep1-mugging.md` | 15 | 3 on 3 frames | all 15 on the alley board's studies (same street, cashpoint, woman, knife); shots 9-13 (he isn't there, the knife rings, the tissue...) took `shot-10`, `09`, `12`, `15` and `17` in the later pass |
| St Jude's (`ep1-02`) | `ep1-st-judes.md` | 22 | 39 on 11 frames | the old two-hander board's studies do not fit, but the earlier St Jude's reference studies `a1s1-01` to `18` show this house and these beats and are laid on all 22 shots (later pass) |
| The first cops scene (`ep1-03`) | `ep1-cops-first-beat.md` | 19 | 66 on 10 frames | all 19 legacy car-park keyframes |
| The washing-up (`ep1-04`) | `ep1-washing-up.md` | 23 | 4 on 4 frames | 12 on existing studies (kitchen, hall, her room, the pendant, the corridor, the road, and in the later pass the dining room, the utility room, the office, the corridor clipboard, the kitchen sink); 11 are placeholder cards |

So **165 of episode one's 166 lines are on frames**; the one left is Martin's line in the storage unit (`ep1-06`), a scene whose board has not been rewritten. Placeholder cards are the established "keyframe missing" cards (`Needs review`, the file name to add in the note, the slot held): add the picture at the named path and rebuild. Frames are lengthened, never shortened (the first cops scene grew most: 231 → 262 s, because its dialogue runs longer than its old estimate). `verify:rapture` asserts all of it, including the draft's written holds (four seconds before Kath's first word, eight before "It's what we signed up for"). The pictures themselves are the open work: nothing was drawn.

## Not done

- **Martin's one line in the storage unit (`ep1-06`) is not on a frame**: that scene's board has not been rewritten from the draft. The other seven scenes of episode one are boarded from it (see "Re-boarded" above); Danny and Jodie and the cops' second beat carry it verbatim already.
- Nobody has listened: the blind picks, the directions, the 4-second and 8-second silences and the levels are all unheard. Episodes two to five's boards are voiced (see above).
- Sighs, laughs and other non-verbal sounds the draft does not write out are not recorded.
