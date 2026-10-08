# Shared sound effects

One library for the three stories in PlayFrame: **NEONOIRE** (Nobody's Witness), the **Hangar** cold open (the untitled animated feature) and the **Rapture** (*Let the Raptures Commence*). An effect made for one is tagged for the others it fits, so a trolley, a car door or a quiet room is made once.

**Nobody has listened to the new ones.** Open `public/audio/sfx/index.html` (from a checkout, or `/audio/sfx/` on the site): every effect plays, filtered by story, with where each is meant to go. **Nothing is wired into an animatic or a game yet**: this is the library, with the effects tagged scene by scene for whoever places them.

## What is here

<!-- counts:start -->
38 effects: 33 new (ElevenLabs `eleven_text_to_sound_v2`, 8 October 2026) and 5 that NEONOIRE already had, offered to the other two stories without being copied or touched (`rain`, `shop-chime`, `suppressed-shot`, `vending-machine-buzz`, `body-fall`; they still play from `public/audio/neonoire/`). Counts per story: NEONOIRE 19, Hangar 22, Rapture 28; 25 of 38 are tagged for more than one.
<!-- counts:end -->

<!-- table:start -->
| id | what | length | fits | from |
|---|---|---|---|---|
| `click-pattern` | Three quick clicks, one slow | 2.48 s | Hangar | new |
| `crate-knock` | One knock inside the crate | 1.48 s | Hangar | new |
| `knock-three-quick` | Three quick knocks, a gap where the fourth should be | 3 s | Hangar | new |
| `hangar-room-tone` | Empty hangar room tone | 12 s (loops) | Hangar, Rapture, NEONOIRE | new |
| `flare-hiss` | Road flare hiss and crackle | 8 s (loops) | Hangar, NEONOIRE | new |
| `creek-night` | Creek at night | 12 s (loops) | Hangar, Rapture | new |
| `crickets-night` | Night crickets | 12 s (loops) | Hangar, Rapture | new |
| `tyre-howl-chains` | Tyres howling, chains rattling | 4 s | Hangar | new |
| `forklift-yard` | Forklift beeper, generator, boots | 10 s (loops) | Hangar, Rapture | new |
| `gravel-tyres` | Tyres on gravel, engine idling | 6 s | Hangar, Rapture | new |
| `car-tumble-trees` | Car tumbling down a wooded slope | 6 s | Hangar | new |
| `engine-start-old` | Old diesel engine fails once, catches | 8 s | Rapture, Hangar | new |
| `taser-zap` | Taser discharge and the fall | 2.48 s | Rapture | new |
| `trolley-roll` | Empty trolley rolling across a car park | 5 s | Rapture, NEONOIRE | new |
| `water-bottles-burst` | Slabs of water bottles bursting across tarmac | 4 s | Rapture | new |
| `car-doors-open` | Two car doors opening at once | 2 s | Rapture, NEONOIRE, Hangar | new |
| `glass-crunch-steps` | Footsteps on broken glass | 4 s | Rapture, NEONOIRE | new |
| `tap-cough` | Tap coughing air, brown water, clear | 5 s | Rapture | new |
| `fax-machine` | Old fax machine handshake and print | 8 s | Rapture, NEONOIRE | new |
| `radio-jingle` | Kitchen radio, local station jingle | 6 s | Rapture | new |
| `knife-ring` | Knife dropping on pavement, one ring | 2.48 s | Rapture | new |
| `cup-rattle` | Cup rocking on a saucer, settling | 4 s | Rapture, NEONOIRE, Hangar | new |
| `cashpoint-hum` | Cashpoint hum, quiet street | 10 s (loops) | Rapture, NEONOIRE | new |
| `traffic-distant` | Traffic in the next street | 12 s (loops) | Rapture, NEONOIRE | new |
| `landline-dead` | Landline: dial tone, three digits, dead | 6 s | Rapture, NEONOIRE | new |
| `door-lock-handle` | Keys in a lock, handle tried twice | 5 s | Rapture, NEONOIRE | new |
| `train-over-arch` | Train over a brick arch | 8 s | NEONOIRE, Rapture | new |
| `footsteps-wet` | Footsteps on wet pavement at night | 5 s | NEONOIRE, Rapture | new |
| `pen-clipboard` | Pen scratching a clipboard | 4 s | Hangar, NEONOIRE, Rapture | new |
| `truck-horn` | Truck air horn | 3 s | Hangar, Rapture | new |
| `cockpit-drone` | Cockpit engine drone with radio hiss | 20 s (loops) | Hangar | new |
| `gunfire-bursts` | Two bursts of gunfire, then nothing | 4 s | Hangar | new |
| `mirror-snap-cap` | Mirror snaps off, cap lands on the road | 3 s | Hangar | new |
| `rain` | Heavy night rain (NEONOIRE) | 2 s | NEONOIRE, Rapture | NEONOIRE (reused) |
| `shop-chime` | Two-note shop door chime (NEONOIRE) | 5 s | NEONOIRE, Rapture | NEONOIRE (reused) |
| `suppressed-shot` | Suppressed pistol shot (NEONOIRE) | 2 s | NEONOIRE, Hangar | NEONOIRE (reused) |
| `vending-machine-buzz` | Vending machine buzz (NEONOIRE) | 2 s | NEONOIRE, Rapture, Hangar | NEONOIRE (reused) |
| `body-fall` | Body falling on a hard floor (NEONOIRE) | 1.3 s | NEONOIRE, Rapture, Hangar | NEONOIRE (reused) |
<!-- table:end -->

`docs/sfx/library.json` has, per effect, the file, length, level, the prompt, the ElevenLabs flow/session/generation it came from, every kept take and a sentence per story saying where it goes.

## Files

| Path | What |
|---|---|
| `docs/sfx/library-source.json` | The hand-written part: each effect's id, title, whether it loops, and `projects` (where it fits, per story). Edit this to retag. |
| `scripts/sfx/build-library.mjs` | `FFMPEG=... npm run build:sfx`: picks, levels and writes `public/audio/sfx/<id>.mp3`, `docs/sfx/library.json` and the listening page. |
| `scripts/verify-sfx.mjs` | `npm run verify:sfx` (in CI): 35 effects on disk, every new one keeps its takes, prompt and generation, none near-silent or clipping, NEONOIRE's five offered to the others, the 14A lighter rule kept. |
| `public/audio/sfx/<id>.mp3` | The leveled effect. |
| `public/audio/sfx/alternates/<id>--v<N>.mp3` | Every long take generated (two per effect; four for `pen-clipboard` and `footsteps-wet`, which were re-recorded). **Append-only: ElevenLabs does not keep generations for long.** |
| `public/audio/sfx/alternates/short/` | The first round, 54 clips of 0.5 to 5 s, kept as made (the default length is too short for rooms and tyres). |
| `docs/sfx-generations-2026-10-08.json` | Prompt, length, flow, session and generation id of every take. |

## How they were made, and what was learned

* The default text-to-sound length is **0.5 to 5 s**, too short for a room tone or a car crash. The long takes pass an explicit `duration_seconds` (the note on each effect in `library.json`) and, for ambiences, `loop: true` (the loop is ElevenLabs's, not checked by ear).
* **The pick is measured, not heard.** Of an effect's takes, the one with the most energy over its length that is not mostly silence (peak above -25 dB); then leveled (hits to a peak of -3 dBFS, loops to an average of -24 dB, never lifting more than 14 dB). Both takes stay in `alternates/`; `build:sfx` rebuilds from them.
* `pen-clipboard` and `footsteps-wet` came back near-silent twice (peaks -30 and -17 dB), so they were re-prompted louder and closer and the new takes are the picks.
* Prompts end with `no voice` (and `no music` where it mattered); text-to-sound will otherwise add murmurs and scores.
* **The lighter is never lit in scene 14A** (the NEONOIRE bible). `flare-hiss` is for other night-lane scenes; its tag says so and `verify:sfx` keeps it.

## Using one

Play `/audio/sfx/<id>.mp3` at its own length; ambiences loop. To use an effect in a story, add it to that story's frame audio at the offset the shot needs (the animatic and the Rapture frames take any `/audio/...` path); retag in `library-source.json` first so the library says where it went.
