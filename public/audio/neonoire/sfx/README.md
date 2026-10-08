Sound-effect tests, generated 2 October 2026 with ElevenLabs eleven_text_to_sound_v2 (flow 0MHWfZQKpkIuVIcuUTLd).
Not yet wired into the animatic. Chime 5 s, shot 2 s, vending machine buzz 2 s, rain 2 s (needs looping or a longer take).
Prompts: soft two-note shop door chime; one suppressed pistol shot in a wet alley; old vending machine buzz and compressor rattle; steady heavy night rain on wet pavement.

## Body falls (8 October 2026)
Four effects for a body falling after a shot, generated with ElevenLabs eleven_text_to_sound_v2 (flow D252fi9yoELaY35Dn0PJ, three variations per prompt, 0.7 prompt influence), trimmed, faded and levelled to peak -3 dBFS (mean about -22 to -26 dB, under the gunshot's -19). The variation that was used is the one whose first impact lands at the start of the file and whose later impacts belong to the fall (the first impact of `street` and `general` only: the later hit was cut).
- `body-fall-street.mp3` (1.4 s): the old man folds onto the wet lane after the suppressed shot, scene 1. Prompt: "Heavy body falling onto wet asphalt, one dull thud, wet cloth slap, outdoors, close-mic, no voice". Used: variation 2, first impact only.
- `body-fall-bar.mp3` (2.9 s): the journalist falls from his bar stool after the two shots, scene 2: thud, then the stool and a bottle. Prompt: "Body falling off a wooden bar stool onto a hard wooden floor, heavy thud, stool clattering over, bottle rattling, indoors, no voice". Used: variation 1.
- `body-fall-doorway.mp3` (2.0 s): Mara is hit and falls through the Hive doorway, scene 70: scuffs, a stumble, the fall. Prompt: "Woman stumbling and falling through a doorway onto a concrete floor, scuffing shoes, soft body thump, cloth dragging, no voice". Used: variation 2, lead silence trimmed.
- `body-fall.mp3` (1.3 s): a general one to place anywhere. Prompt: "Heavy body falling onto a hard floor, single dull thud, cloth rustle, close-mic, dry, no voice". Used: variation 2.
`alternates/` holds all twelve untouched variations (`<name>--v1..v3.mp3`, raw, peaking at full scale); nothing in it is wired anywhere.
Wired into the visual novel (importer cues `fall-street`, `fall-door`, and `shot2` carries the bar fall) and scarlett-witness (same ids; `shot2-fall.mp3` is `shot2.mp3` with the bar fall mixed in a second later). Not in PlayFrame's animatic.
