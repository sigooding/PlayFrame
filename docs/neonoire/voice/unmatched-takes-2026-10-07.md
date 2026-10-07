# Recorded takes the games do not play (7 October 2026)

The visual novel's importer and scarlett-witness attach a recorded take to a screenplay line only when the speaker matches and the take's words open the line's words. 17 of the 417 manifest takes match no line of `Neonoire (3).fountain` today, so those lines play the browser's text-to-speech (or nothing) instead. `node tools/import-playframe.mjs --from ../PlayFrame` in nobodys-witness now lists them.

**The screenplay was revised after these were recorded.** Playing an old take under new words would speak text that is not on screen, so none were wired in.

## Reworded since the recording (re-record, or restore the old words)

| Scene | Take | Screenplay now |
|---|---|---|
| 11 | ISHIDA "Go to sleep, Jack. You're too old to be haunted." | adds "You found enough twenty years ago." in the middle |
| 20 | MARA "They have my purse. They know my name. ... And then they'll kill her too." | adds "My passport.", ends "...And they'll follow her. (beat) They'll use her to get to me. And then they'll kill her too." |
| 22 | VERA "I believe he was sad. ... A man wrote to me. Last month. An old man. He said Dad didn't kill himself. He said he could prove it." | "A man wrote to me last week. He said Dad didn't do it. He said the police knew." |
| 29 | MRS. SAKAI "Every January. ... Even the years we had nothing, he paid it. I thought it was a woman." | "...Even after he left, the receipts kept coming here." |
| 29 | MRS. SAKAI "He left these here. Maybe on purpose." | same words, but its line starts with the reworded take above |
| 64 | JACK "Tomorrow it'll be over." | "Safe. Tomorrow it'll be over." (an extra word first) |
| 98 | JACK "At the end, she asked me to tell you something. She said to tell you she was sorry." | two lines with Vera's beat between ("goes very still") |

## Recorded under the wrong speaker

| Scene | Take | Screenplay |
|---|---|---|
| 20 | **JACK** "Is she okay? Is she -- does she know you're --" | spoken by **MARA** |

## No longer in the screenplay (cut or rewritten away)

| Scene | Take |
|---|---|
| 1 | OLD MAN "Twenty years." |
| 10 | JACK "Depends who's calling." |
| 12 | JACK "Because they didn't find it." |
| 14 | JACK "She wasn't planning to leave." / "People draw the places they want to go." |
| 27A | VERA "Where did you find the clip?" |
| 36 | JACK "The countryside. There's no signal. I'm on a payphone. It's pink." |
| 64 | OKADA "That's what people say the night before." |
| 70 | DRIVER "Excuse me." (the screenplay now has the masked man's "Excuse me." in Japanese, subtitled) |

## What is needed

Per the voice README, re-record the seven reworded lines and the Mara line with `voice-ingest.mjs --replace 1` (the old take is archived automatically), then rebuild. For the eight cut lines the director decides whether to put them back in the screenplay. Nothing here was changed in the screenplay or the manifest.
