# NEONOIRE — the stakeout coverage, and the cars' canon sheets (4 October 2026)

**The session opened with a question, not a queue: "is there a style sheet for the cars in the new
scene?"** There was not. `sheets/` held thirty-seven sheets — every named face, every repeated room,
the Hive in five canon panels — and not one vehicle. The cars of scene 14A lived only in prose: a
line in the board's locks, a caveat in four frame notes. Prose alone is exactly what drifted here
before (336's first landscape study drew Vera an SUV; 343's first study turned the following sedan
nose-on; every 14A interior read newer than the scene-31 car the scene inherits). So the cars got
what the cast have had all along, and then the scene's unboarded beats were boarded and generated
against them.

**Ten generations, the house budget: two canon sheets, seven coverage studies, one retake. Six
coverage frames installed, 348 owed, both its studies refused.**

## The car canon — scripts/neonoire/car-canon-look.mjs

One prose block locking all five vehicles in the film, in the shape of the Hive canon and the office
lock: Jack's worn silver-grey sedan (nearside lamp dimmer, bare period cabin, the clip on the
mirror), Vera's small boxy maroon rental hatchback (steamed glass, white rental sticker, never grey,
never an SUV), the watcher's small white car, the killers' black cold-open sedan and Ishida's
driver's darker grey town car — the last three held to their delivered frames (s14a/340, s1/332,
s61/228) because each appears for at most three shots and a sheet would out-rank them. The canon
repeats pass four's geometry rule (a following car is seen from BEHIND) and adds the plate rule
(blank or suppressed, never legible).

Two sheets were generated, each a four-panel canon of ONE vehicle, identical panel to panel:

| sheet | panels | caveat carried |
| --- | --- | --- |
| `sheets/jacks-car.jpg` | front 3/4 with lamps on, rear 3/4, side profile, the bare cabin with the clip on the mirror | the generation left both headlamps near-equal, so the dim-nearside lock stays prose (335 and 343 carry the same caveat); the front plate came back with faint digits and was **blanked in place** before install — suppression the canon itself demands, recorded here rather than spent a generation on |
| `sheets/vera-hatchback.jpg` | side profile with steamed glass, rear 3/4, front 3/4 with the rental sticker, the steamed window from inside | panel 1's window reads closed rather than half-down; the maroon shifts a shade warmer in the rear panel under sodium light |

Both are 16:9 1920×1080 like every image in this film, and `verify:neonoire` asserts their
dimensions and the lock's shape (the office lock's ASI guard, reused).

## Installed — the stakeout coverage, 344–350 less 348

Generated on the two canon sheets, the cast sheets and the delivered 337 master; reviewed at full
size; installed over their own filenames by `fresh-install.mjs` after the generators' black side
pillars were trimmed (a trim, not a crop of content).

| # | file | what the study is now | unclosed caveat |
| --- | --- | --- | --- |
| 344 | `s14a/344-he-walks-back.jpg` | his sedan's rear dark in the foreground, Jack walking back up the wet road, her hatchback nose-on to him forty metres up — nose-on and correct, because she was the one following | the road reads as a shuttered street of the lane's width, not 343's two-lane road; an amber shop sign with faint kanji hangs mid-street (a shop, not the bar) |
| 345 | `s14a/345-the-knuckle.jpg` | his knuckle at the steamed closed window, her shape and both hands on the wheel behind the glass | the glass reads wet-clear enough to resolve her face; the hand reads as a fist, not one knuckle |
| 346 | `s14a/346-onto-his-floor.jpg` | the pale-blue umbrella shaken out and dripping on his worn floor mat under the bare cracked dash | the canopy lies half-spread, as if just shaken, not folded and strapped |
| 347 | `s14a/347-he-takes-it.jpg` | the rice ball changing hands, the fingers a centimetre apart and not touching — the gap is the beat | his hand reads older than 48, the vein caveat Jack's frames keep carrying |
| 349 | `s14a/349-still-untouched.jpg` | the untouched onigiri standing on his cracked dash while her open door hides her exit into the rain | Vera reads only as her door and the rain; a green lit sign glows where the canon keeps two lights only |
| 350 | `s14a/350-the-umbrella-goes.jpg` | his mirror: the blue umbrella open and small under the sodium lamp, round the corner, the dark taking it; the clip a warm speck; the rice ball out of focus below | the clip's loop reads as a thick cord, not 334's thin string |

346 is the first 14A interior to carry the canon's worn cabin, so the "interior newer than the s31
car" caveat stops accruing from here.

## Refused, with the reasons — 348 The train

Two studies generated, neither installed, and the geometry written on the board instead, exactly as
343's was in pass three. The first put the lit train **through the windscreen** with an empty
mirror: the page puts the train BEHIND them, and the trembling mirror is the only way this film
shows it. The retake put the train correctly in the mirror but then sat **Vera at the wheel of
Jack's car** — Japan drives right and it is HIS car, so Jack holds the right seat and Vera the left
— and left a second lit train band across the lane's end in front. A frame that says something the
scene denies is refused, not caveated. Both studies are pictured on
`reviews/car-canon-2026-10-04.jpg` (top row the canon sheets, bottom row the two refusals) so the
rule survives in pixels as well as prose. The board note is the brief for the next generation:
Jack at the wheel on the right, Vera on the left turned to the mirror, the train ONLY in the
mirror's glass, the windscreen showing the dark lane and the wordless amber sign and no train.

The seating rule the retake forced into existence is now a board lock of its own: **Japan drives on
the left, so the wheel is on the RIGHT and it is Jack's seat.**

## Decisions made by the logic of the complete scene (the director's standing instruction)

1. **344's hatchback faces the camera and is correct.** She followed him; a followed car shows its
   rear only when it is driving away. The inverse of 343's rule, same rule.
2. **349 hides Vera behind her own open door.** The beat is the rice ball she leaves, not her exit;
   the door at this angle is what she is behind for one second of screen time.
3. **350's umbrella is open in the mirror.** It is raining; the page's "the dark take it" is the
   corner, not a folded umbrella.
4. **348 stays owed rather than fudged**, and the film carries one honest placeholder again — the
   same state pass three left 343 in, and closed the same way: the next pass opens with it.

## Mechanics

`stakeout-coverage.mjs` is the new boundary module (delivered 344–347, 349, 350; owed 348; the two
refusals recorded so nobody reinstalls them). `build:neonoire` writes **328/329 keyframes on disk,
1 placeholder card**; `verify:neonoire` reads the coverage run as 241–350, 14A as sixteen boarded
slots, owed = [348], and asserts the car canon's shape, the sheets' dimensions, the seating lock and
348's written rule; `verify:shot-order` reads the next free number as **351**; pass-prompts
regenerated `pass-35.md` around 348's brief (style block and negative prompt included) and the index
as **328/329**. `src/lib/neonoire-scene6-sync.json` was **not** re-run: no screenplay text changed
today, and the sync json propagates rewritten text — the coverage reaches saved workspaces on
re-import, like every coverage pass before it. `build:neonoire`, `verify:neonoire`,
`verify:shot-order`, `verify:revision:neonoire`, `verify:animatic`, `check:assets` (935 references),
`typecheck`, `lint` (0 errors) and the production build all pass.

**Review sheets:** `reviews/stakeout-coverage-2026-10-04.jpg` (the sixteen delivered 14A frames in
playback order) and `reviews/car-canon-2026-10-04.jpg` (the two canon sheets above the two refused
studies of 348).
