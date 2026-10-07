# Recorded takes the games did not play (7 October 2026) — resolved the same day

The visual novel's importer and scarlett-witness attach a recorded take to a screenplay line only when the speaker matches and the take's words open the line's words. On the morning of 7 October 17 of the 417 manifest takes matched no line of `Neonoire (3).fountain`, so those lines played the browser's text-to-speech (or nothing), and 160 other lines had no take at all.

**Resolved by the 7 October 2026 voice pass** (see [`README.md`](README.md) and [`elevenlabs-plan-missing-2026-10-07.json`](elevenlabs-plan-missing-2026-10-07.json)): `node tools/import-playframe.mjs --from ../PlayFrame` now reports **546 of 546 spoken lines voiced and no unmatched takes**. What happened to the 17:

## Reworded since the recording: re-recorded under the old id (the old take is in the line's `history`)

| Scene | Old take | Screenplay now |
|---|---|---|
| 11 | ISHIDA "Go to sleep, Jack. You're too old to be haunted." | adds "You found enough twenty years ago." in the middle |
| 20 | MARA "They have my purse. They know my name. ..." | adds "My passport.", ends "...And they'll follow her. (beat) They'll use her to get to me. And then they'll kill her too." |
| 22 | VERA "I believe he was sad. ... A man wrote to me. Last month. ..." | "A man wrote to me last week. He said Dad didn't do it. He said the police knew." |
| 29 | MRS. SAKAI "Every January. ... Even the years we had nothing, he paid it. I thought it was a woman." | "...Even after he left, the receipts kept coming here." (the next take, "He left these here. Maybe on purpose.", was already right) |
| 64 | JACK "Tomorrow it'll be over." | "Safe. Tomorrow it'll be over." |
| 98 | JACK "At the end, she asked me to tell you something. She said to tell you she was sorry." | two lines with Vera's beat between: re-recorded as two takes |

## Recorded under the wrong speaker: retired, replaced by a Mara take

| Scene | Old take | Screenplay |
|---|---|---|
| 20 | **JACK** "Is she okay? Is she -- does she know you're --" | spoken by **MARA**; the old take is `archive/194-jack-is-she-okay-is-she-does-cut-2026-10-07.mp3`, the new one `s20-x01-mara` |

## Reworded replacements for lines that looked cut: re-recorded under the old id

I first took these for cut lines; each has a successor line in the screenplay.

| Scene | Old take | Successor line |
|---|---|---|
| 1 | OLD MAN "Twenty years." | "After twenty years." |
| 10 | JACK "Depends who's calling." | "Who calls me that?" |
| 14 | JACK "She wasn't planning to leave." | "She wasn't planning to disappear." |
| 27A | VERA "Where did you find the clip?" | "Show me where." |
| 36 | JACK "The countryside. There's no signal. I'm on a payphone. It's pink." | "The coast. An inn off the highway. The phone is pink." |
| 64 | OKADA "That's what people say the night before." | "You said that about my daughter." |
| 70 | DRIVER "Excuse me." | "Shitsurei shimasu." (the driver is the masked man's voice) |

## Truly cut: retired to the archive

| Scene | Old take | Archived as |
|---|---|---|
| 12 | JACK "Because they didn't find it." | `archive/247-jack-quietly-because-they-didn-t-find-cut-2026-10-07.mp3` |
| 14 | JACK "People draw the places they want to go." | `archive/185-jack-softly-people-draw-the-places-they-cut-2026-10-07.mp3` |

Nothing was changed in the screenplay.
