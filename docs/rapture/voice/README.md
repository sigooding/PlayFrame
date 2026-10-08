# Let the Raptures Commence: recorded dialogue

Episode one, the draft of 21 September 2026 ([`../ep1-screenplay.md`](../ep1-screenplay.md), the episode's authority): **all 166 spoken lines are recorded**, one `eleven_v4` take each, in 13 designed voices. **Nobody has listened to any of it.** Open [`public/audio/rapture/index.html`](../../../public/audio/rapture/index.html) (from a checkout, or the site at `/audio/rapture/`): the table read plays the episode scene by scene with the pauses the script spells out, and the cast lists every voice preview so the voices can be picked by ear. Only in PlayFrame: nothing here goes into the visual novel or scarlett-witness.

| Piece | Where |
| --- | --- |
| Which voice speaks each character (and every preview, measured) | [`voices.json`](voices.json) |
| Every recorded line (text, prompt, voice, file, duration, level, offset on the scene's timeline, ElevenLabs generation) | [`manifest.json`](manifest.json) |
| The plan the takes were recorded from (166 rows with the direction of each) and its readable script | [`elevenlabs-plan-ep1.json`](elevenlabs-plan-ep1.json), [`elevenlabs-script-ep1.md`](elevenlabs-script-ep1.md) |
| The takes | `public/audio/rapture/ep1/<screenplay page>/NN-<speaker>-<words>.mp3` |
| The 45 voice-design previews (the unpicked ones are auditions) | `public/audio/rapture/voices/` |
| Reads the draft into its spoken lines, ids and the pauses the page spells out | `scripts/rapture/voice-script.mjs` (`--list` prints them) |
| Adds a v4 direction to every line, writes the plan | `scripts/rapture/voice-plan.mjs` (`--check` fails if the plan is out of date) |
| Ingests a folder of takes (`R001.mp3`...) against the plan, measures them, writes the manifest | `FFMPEG=... node scripts/rapture/voice-batch.mjs --dir <folder> [--generations meta.json]` |
| Pitch, range, brightness, pace and level of a clip | `FFMPEG=... python3 -I scripts/rapture/voice-measure.py clip.mp3 [words]` |
| Renders the listening page | `node scripts/rapture/voice-page.mjs` |

## The cast

One saved ElevenLabs voice per character, named `<Character> - RAPTURES`: Nina, Kath, Ray, Jodie, Danny, Maureen, Brian, Terry, Col, Deborah, Martin (one line now, a large part from episode four), the man in the blue coat, and **Young Man**, which plays both the nineteen-year-old mugger and the keen volunteer (three lines each, never in a scene together). Each was designed from the show bible's cast text, with the character's own screenplay lines (plus their scene partner's replies where a part is too short for the tool's 100-character minimum) as the preview text, three previews per design. They were **picked blind**, by measured pitch, range, brightness and pace: the deadpan parts (Nina, Ray, Kath) took the narrowest pitch range, voices that share a scene were kept apart (Nina 170 Hz, Maureen 242, Deborah 148; Terry's gravel against Col's smooth baritone). `voices.json` says why each was chosen and keeps every preview's numbers. To change a voice: audition the previews on the page, save the one you like (`creative_save_designed_voice`, if the preview is still there) or design a new one, put its id in `voices.json`, and re-record the character's lines (below).

Two findings to keep:
- **ElevenLabs refuses to design a child's voice.** The first request for Jodie ("Girl, 11, English...") was blocked by its safety check, so Jodie is a light young adult voice: a stand-in until there is a child actor.
- **Timbre words fight pitch words in a design.** The first Brian ("a thin, slightly nasal voice") and Terry ("a heavier, gruffer voice") came out at 200 to 270 Hz, higher than the women. Asking for "a dry mid-range tenor" and "a deep, gravelly bass-baritone man's voice" fixed both. Both first rounds are kept on the page, marked as not used. Check the pitch of a male design before saving it.

## How the lines were recorded

Directions are written the v4 best-practice way, short natural-language directions in brackets in front of the line, the voice and the emotion together: `[Dry, flat, after a long pause] Some of them'll have been in cages.` Kath is `Earnest`, Ray `Dry`, Nina `Flat`; the writer's own parentheticals in the screenplay ("(not stopping)", "(hissing)", "(a beat)") are honoured. The register is one dry comedy throughout ("no pathos beats"), so most lines are plain. **No hushed directions** (`quietly`, `softly`, `weakly`, `whisper`, `murmur`): the NEONOIRE finding (voice README there) is that they read about 10 dB under speaking level, and `voice-plan.mjs` refuses them. The shortest lines read quietest (a one-word "Mm." has few loud frames); the quietest take of 166 is Jodie's "Mm." at -30 dB and the man in the blue coat's "(barely) There's no court." reads -27 dB, on purpose. Voices differ by up to 7 dB (Terry -19.7 dB on average, the man in the blue coat -26.9), so the listening page turns each voice down to the quietest voice's level; the files themselves are as ElevenLabs made them. The whole episode cost about 7,400 credits (one take per line, about a credit a character).

**Pauses.** The screenplay locks the pauses it writes out ("Four seconds of nothing", "A long pause" = 4 s, "An eight-second pause", "A six-second pause", "Five seconds"); `(pause)` is 1.2 s, `(a beat)` 0.7 s, `(immediately)` 0.1 s. Every other gap is a table-read estimate (0.5 s between speakers, 0.8 s for one speaker's next line, more where the page describes action between two lines, capped at 6 s). Each manifest line's `offset` is its start on its own page's timeline; `gapKind` says whether the gap before it is `written` or `estimated`.

## Re-recording a line

Take the line's `prompt` and `voiceId` from the plan (change the direction in `scripts/rapture/voice-plan.mjs`, run it, and the plan follows), generate it with `creative_generate_speech` (`eleven_v4`), save the take as `<dir>/<key>.mp3`, delete that line's entry from `manifest.json` and run `voice-batch.mjs` again: it keeps every line already in the manifest and only ingests the missing ones. The old take stays in the repo until you remove it; **archive it first** (copy it to `public/audio/rapture/archive/ep1/<name>--v1.mp3`) if you want it back.

## Not done

- **The takes are not attached to the storyboard frames yet.** Only two of episode one's boards carry the draft verbatim (Danny and Jodie, `ep1-danny-jodie.md`, "beat for beat, with trims only"; the cops' second beat, `ep1-cops-second-beat.md`, all six shots and every pause); the mugging, St Jude's, the first cops scene and the washing-up were written after their boards and have not been re-boarded, and a take on the wrong frame would mislead. Attaching `audio` to those 27 frames (the NEONOIRE way: `attachAudio` in the builder and `verify:rapture`) is the next step; the other scenes follow when they are re-boarded.
- Nobody has listened: the blind picks, the directions, the 4-second and 8-second silences and the levels are all unheard. Episodes two to five have dialogue only in their scene boards (about 450 lines: Martin, Pat, Graham, Tamsin, Reek, Alan, the therapy class...), not in a screenplay, and no voices yet.
- Sighs, laughs and other non-verbal sounds the draft does not write out are not recorded.
