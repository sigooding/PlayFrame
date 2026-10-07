# Voice alternates: the takes and voices that are not in the game (7 October 2026)

The 7 October pass voiced the 160 lines the games had been reading with browser text-to-speech (see [`elevenlabs-plan-missing-2026-10-07.json`](elevenlabs-plan-missing-2026-10-07.json)). Getting there took more than 160 generations. **Every take and every voice design that is not in the game is kept**, in case one is better than the one that was picked:

| What | Where |
| --- | --- |
| The audition page (play every take against the one in the game, filter by speaker or scene) | `public/audio/neonoire/alternates/2026-10-07/index.html`, so on the site at `/audio/neonoire/alternates/2026-10-07/` once it is deployed; it also opens straight from a checkout |
| Machine-readable index: line, frame, speaker, the take in the game, every alternate with its tag, voice, level and ElevenLabs ids | `public/audio/neonoire/alternates/2026-10-07/index.json` |
| 76 alternate takes, for 59 lines (`takes/<key>--<tag>--<round>.mp3`) | `public/audio/neonoire/alternates/2026-10-07/takes/` |
| 15 voice design previews for Sakai, Sakai (tape), the Young Detective, Harada and Daniel (`voices/<character>--<generated voice id>[--picked].mp3`) | `public/audio/neonoire/alternates/2026-10-07/voices/` |

`key` is the line's key in the plan (`N071`, `L10`, …); `round` is `first` (the first generation), `retake`, `variant` or `test`.

## Why there are alternates

The first generation of all 160 lines tagged 56 of them `[quietly]`. On Jack's and Vera's voices that tag reads as a whisper: **about 10 dB below their speaking level** (−33 dB against −24 dB for the same voices untagged; the whispered takes retaken on 29 September measure −28 to −36 dB). The README's "no whispers" rule already said so. A tag test on two lines (`[sadly]`, `[solemnly]`, `[tenderly]`, `[earnestly]`) found tags that stay at speaking volume; 57 lines were re-recorded with them (five of those a second time, with variants, because they were still quiet), and the loudest take of each was installed. The first-round takes are kept here so the director can still choose them.

Level = the average of the speech's active frames in dBFS (higher is louder). It is a measurement, not a verdict: **nobody has listened to these takes.** The picks that most want an ear are the blind ones below.

## Using an alternate

```
FFMPEG=/path/to/ffmpeg node scripts/neonoire/voice-swap.mjs --list --key N071
FFMPEG=/path/to/ffmpeg node scripts/neonoire/voice-swap.mjs --key N071 --take takes/N071--earnestly--test.mp3
npm run build:neonoire && npm run verify:neonoire
```

A swap is a re-record of the same line: the line keeps its id and file path, the take it replaces is copied to `docs/neonoire/voice/archive/` and listed in the line's `history`, and the frame's later lines are pushed along if the new take is longer. To undo a swap, swap the archived copy back in with `voice-ingest.mjs --replace 1 --id <line id> --file docs/neonoire/voice/archive/<file>`. Then rebuild the VN and the scarlett-witness story (see "Reaching the games" in the README).

`index.html` shows the command for every take (copy button).

## Voices

| Character | Voice in use | Previews kept | Notes |
| --- | --- | --- | --- |
| Harada | `oiQsVLQVbTyIiNejyPfk` "Harada - NEONOIRE" | 2 others (29 Sept design) | picked blind on 29 Sept, saved 7 Oct |
| Daniel | `oOJyrMKhBUCGET6PTTAu` "Daniel - NEONOIRE" | 2 others (29 Sept design) | picked blind on 29 Sept, saved 7 Oct |
| Sakai (the old man, scene 1) | `oBCsFZ1GTHU9VCiEZSXY` "Sakai - NEONOIRE" | 2 others (7 Oct redesign) | the 29 Sept voice was deleted from the workspace; **blind pick** |
| Sakai (tape, scene 82) | `QQyMyGyBbWgRljZdGD3r` "Sakai (tape) - NEONOIRE" | 2 others | new: the tape is Sakai twenty years earlier and `voices.json` forbids reusing the dying old man's voice; picked by lowest pitch (about 118 Hz) because the previews could not be heard: **blind pick** |
| Young Detective (scene 96; also stands in for the Young Officer) | `QQQk8imC2qHxHZySJvr0` "Young Detective - NEONOIRE" | 2 others (7 Oct) | the 29 Sept Young Officer voice was deleted; **blind pick** |
| Mother (scene 76, phone) | `roYauZ4bOLAKvVZTPLre` ElevenLabs library voice "Lena" | none | borrowed; records about 5 dB quieter than the rest; design a proper one later |

Unpicked previews stay valid for a long time (the 29 September ones were still there on 7 October): to use one, save it with `creative_save_designed_voice` (its `generated_voice_id` is in the file name), put the voice id in `voices.json`, and re-record that character's lines with a `voice-batch` plan whose lines carry `"replace"`. The takes already in the game are tied to the voice id they were made with (`voice` in the manifest).

## Still hushed (older takes, not part of this pass)

These takes from earlier passes carry `[quietly]`, `[softly]` or `[weakly]` and measure −29 to −35 dB, the same hush the pass above removed from the 160 new lines. They were left alone; re-recording them is about 700 credits: `s44-jack-i-ll-get-him`, `s10-jack-softly-your-father`, `s53-jack-i-won-t`, `s44-jack-stay-whatever-you-hear`, `s17-jack-quietly-he-always-paid-too-much`, `s60-jack-and-then-i-tell-her-everything`, `s12-jack-quietly-why-come-back`, `s17-jack-quietly-i-m-looking-for-his`, `s10-jack-quietly-i-m-sorry`, `s10-vera-quietly-he-died-pause-that-year`, `s14-vera-quietly-that-was-for-america-she`, `s14-vera-quietly-i-told-her-to-go`, and Mara's four `[weakly]` lines in scene 71 (`s71-mara-weakly-jack`, `…-everyone-s-awake`, `…-tell-her-i-m-sorry`, `…-tell-her`; those may be meant to be weak).
