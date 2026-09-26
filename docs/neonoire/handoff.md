# NEONOIRE — keyframe handoff

## Current state — 25 September 2026

The final screenplay is `Neonoire (3).fountain`: **100 scenes**, unchanged. The numbered board covers **all 100 scenes, 240 shots** — the screenplay is fully boarded as of 26 September 2026. **All 240 shot images are on disk; no placeholder slots remain.** All images are full-bleed 16:9, 1920×1080 JPEG. The newest pass is [scenes 65–71](passes/scenes-65-71.md) (shots 234–240), the last rain: the dress, the wait at ten, the trap and the waking. **The remaining image work is revision, not boarding:** cold-open shots 14–28 and scene 3 (shots 29–32) still hold legacy 2.39:1 frames — see the cold-open note below — plus any retakes or set inserts the director orders. Review sheets are one command: `npm run review:neonoire -- <out.jpg> s65 ...`.

## Note to the next agent — how consistency is kept here

The director's first and lasting request is **scene and character consistency**. What has worked, and what went wrong, across these sessions:

- **Always attach references; never describe a known person or place from memory.**
  - Characters: attach their sheet (`sheets/jack.jpg`, `vera.jpg`, the Vera look sheets, `mara.jpg`, `ishida.jpg`, `young-officer.jpg`).
  - Cast with no sheet: attach their established frame (Kaneko `s86/123`, Okada `s81/100`, Kurose the scene 83 master, the repairman `s87/124`, the masked men `s1/12`, Daniel `s4/35`).
  - Locations: attach the location master, listed in each pass ledger's *Locks*.
- **Generate each scene's master first, then derive its other shots from that master** (image-to-image). Every derived shot then shares the room, the light and the wardrobe. For before/after pairs (warm and cold at the inn, the stair frame), generate the second from the first, from the same camera position.
- **Wardrobe by scene range:**
  - Vera: the original charcoal coat (`sheets/vera.jpg`) up to 71; the wine-red dress in 72–79; Look C in 83–92; Look D (olive) in 97; Look E (short oatmeal car coat) in 98; Look F (teal peacoat, red clip) in 100.
  - Jack: always `sheets/jack.jpg`, a **white American**, 48. He is NOT the sisters' father; Daniel Voss is.
  - Mara: `sheets/mara.jpg` (denim jacket, grey tee). In hiding (13 onward) she wears an old cardigan that isn't hers, and has no bird clip, because Okada has it.
- **Recurring props:**
  - The red bird clip: `s1/03`, `s98/154`.
  - The key with its round 87 tag: `s1/16`.
  - The hand-painted noodle-shop sign: `s86/121`.
  - The pale blue umbrella: `s4/34`.
  - The family photograph: `s4/35`.
- **Re-list reference filenames with `ls` immediately before generating.** Parallel passes rename assets (shot numbers shift when a scene gains a frame); a stale path costs a generation and returns "Source image not found".
- **Before starting a turn, sync git. Committing problems seen in this sandbox, and their fix.** Symptom: at the start of a turn the local checkout is silently reset to the session's branch point (commit `93dc0c1`) — `git status` then shows a pile of stale modifications, `git log` is missing every commit you pushed, and `node_modules` has vanished. Nothing is actually lost: the pushed branch on origin still holds all of it. **Fix, in this order:** `git fetch origin arena/01a0da06-playframe`; compare `git rev-parse HEAD` with `git rev-parse FETCH_HEAD`; if they differ, `git reset --hard FETCH_HEAD`; then `npm ci --silent` before running any script. This has happened five times (latest: 26 September 2026) and the reset protocol has recovered everything each time. **Never force-push** over it, and never re-generate images that already exist on the pushed branch — check `public/images/neonoire/` first. Equally: **commit and push before ending a turn**; uncommitted work does not survive the sandbox reset, pushed work always does.
- **Review every image at full size before installing it** (see rule 2 below): identity, wardrobe, prop, count, direction, and left/right against the neighbouring shots. Past failures were:
  - a car missing its front (shot 140)
  - sedans facing away from the building they had arrived at (shot 175)
  - one coat recoloured instead of a new garment (Look E, first attempt)
  - two men in one photograph who looked alike (shot 169, first attempt)
  - three prosecutors where the script has four (shot 150)
- **Stable numbering:** shots are numbered in boarding order. Never renumber, never reuse a frame ID or asset name, never edit the fountain, and keep ten generations per session. Log every flaw you don't fix as an honest caveat.

## Note — the cold open's consistency, audited 26 September 2026

The user asked whether the cold open looks consistent. **Answer: not yet, and here is exactly why.** Shots 1–10 were rebuilt 16:9 in the cold-open pass; shots 11–13 were rebuilt 16:9 on 26 September 2026 from the same street masters (`s1/01`, `s1/06`, `s1/08`) and the same beats, so **1–13 now read as one street, one Mara (clip, denim, bag), one sedan, two masked men** — reviewed frame by frame at full size that day. **The cold open (1–28) and scene 3 (29–32) are wholly 16:9 — no legacy 2.39:1 frame remains anywhere in the numbered board** (batches two, three and four landed on 26 September 2026); the older style keys stay 2.39:1 references by design. Batch four also closed every carried detail caveat: shot 235's clock reads 9:58, shot 234's box reads TOKYO, shot 27's notebook matches shot 20's brown leather wrap, shot 21's rain falls through the open door, shot 31's window matches 29's geometry. Prop masters live in `public/images/neonoire/props/` (SHIOHAMA cassette label, DANIEL VOSS notebook cover). That is not drift by accident — it is budget: every turn's ten generations were spent on the forward numbered board in screenplay order, on the director's instruction that there be **no more gap-filling until the shots were done**, and the shots only finished on 26 September 2026 with scenes 65–71. The repo rule forbids cropping legacy frames to fake 16:9, so they stay honestly marked **Needs review / REVISION PENDING** (the builder says so from `coldOpenCompletedThrough`, now 13) until regenerated. With the board complete, the cold open and scene 3 revised and the inserts shot, **the standing image queue is empty**: what remains is director-ordered retakes only.

## Note — how the small details are done (the self-improvement loop, 26 September 2026)

The director's standing instruction is that self-improvement on small details is the key to this workspace. This is the loop that does it, written for the next agent:

1. **Verify before generating.** `ls` every reference directory before batching prompts; stale filenames have wasted generations before. References that must survive a sandbox reset are the *installed, tracked* JPEGs in `public/images/neonoire/` — raw PNGs under ignored `artifacts/` paths do not survive resets (seven calls were lost to this on 26 September 2026).
2. **Review at full size, then crop the legible things.** Every frame is montaged and looked at before install; every piece of in-frame text (the 8:52 sign, the 87 tag, the locker sign, clock faces) is cropped and read at full size. What passes is locked; what fails is carried as a named caveat, never hidden.
3. **Lock details in verify, not in memory.** Details that must not drift are asserted as substrings in `scripts/verify-neonoire.mjs` ("MONTHLY. YEARLY. NO QUESTIONS.", "no weapons in frame", "no blood", sheet filenames). A future pass that drops a lock fails the build instead of silently shipping.
4. **Reframe, never argue, with moderation.** When a generation is blocked, photograph the consequence instead of the action: mud impacts instead of gunfire, a torch beam on the purse instead of a body search, a wrist at a sleeve instead of a drawn weapon. One reframe, first try, every time so far.
5. **Chain masters inside a session.** Later shots attach the installed frame of the earlier shot they continue (the dress from 234 into the lounge, the road from 236 into the ambush, the corridor from 238 into the death, the bar from 19 into the floor grammar). Locations and garments then carry by construction, not by hope.
6. **Assign colour temperature before the prompt, as an arc.** Each scene's temperature is a decision (amber lounge against sodium trap; blue-hour dusk as the film's first daylight), written into the board's lighting notes and the pass ledger, so the cut reads as a colour story.
7. **Check geometry like a continuity supervisor.** The standing perspective check on every frame; right-hand-drive check on every car interior (flop only when no legible text is in frame); eyelines and door sides matched to the set master.
8. **Keep aspect honest.** Legacy 2.39:1 frames are regenerated, never cropped; `coldOpenCompletedThrough` moves only when the JPEGs are actually replaced; whatever still waits is labelled Needs review / REVISION PENDING by the builder.
9. **Patch scripts only against grepped anchors**, and learn the board vocabulary (SHOT_TYPE / MOVEMENT / ANGLE / LIGHT tokens) before writing boards — the build fails fast on anything outside it.
10. **Close the loop in public.** Every pass ends with a ledger in `docs/neonoire/passes/`, a review sheet in `public/images/neonoire/reviews/`, the caveats listed in both, an updated handoff — and a commit plus push, because the sandbox eats anything uncommitted.

## Standing rules for every pass (set by the director)

1. **Commit and push at the end of every turn** to `arena/01a0da06-playframe`; never leave work uncommitted.
2. **Check perspective and geometry in every image before it is installed.** Look at it at full size against the script and the neighbouring shots:
   - **Vehicles:** the right number; each whole (no missing front or back, not cut off at a door); **facing the direction the action implies** (a car arriving at a building faces the building, a departing car faces away); the same car in the same place and orientation across shots of one scene.
   - **Screen direction:** left and right, eyelines and the 180° line agree with the adjacent shots and with POV reverses (for example the lot seen from the window and from the ground).
   - **Headcounts and props:** match the script (four sedans, eight men, one clip).
   - **Architecture:** stairs, doors and windows lead where the location says they do; verticals are straight; the room matches its master.
   - **Light and shadow:** direction is plausible, and practicals the script names (a TV, a bulb) are actually lit.
   If an image fails and a generation is left, regenerate or edit it. If not, log the failure in the board note and the pass ledger as an honest caveat. Never install an image with an unlogged failure.
3. **Vera's costume changes** always bring a genuinely new coat (a different garment, not a recolour) in a colour that fits the scene.
4. **The stairway motif and the inn colour change** are described in `scripts/neonoire/inn-look.mjs`.

**Latest session — [scenes 13–17 boarded](passes/scenes-13-17.md), the Hive first seen.** Ten shots (181–190), ten calls, no retries, made following the consistency note above: masters first, then derived shots, and a perspective check on every image. Shot 187 is the stair motif (Jack climbs the Hive's outside stair). **The next shot is 191, with assets from `s18/189`. The next unboarded scene is 18**; carry on through 30, with the office stairwell in 21 and the sea-wall steps in 28.

**Previous session — [the roadside inn boarded](passes/roadside-inn.md): the stairs and the colour change.** Ten shots (171–180), ten calls, boarded ahead of order at the director's request. **Two new standing rules, written in `scripts/neonoire/inn-look.mjs`:**

1. **The stairway motif.** Stage stairs wherever the script allows, from a low, level, static camera square to the flight. Going up means refuge, hope or the past; something coming up, or going down, means danger or loss. The planned uses are scenes 15–16 (the Hive's outside stair), scene 21 plus a scene 10 exit (the office stairwell), scene 28 (stone steps up from the sea wall) and scenes 69 and 71 (matching scene 89).
2. **The colour change at the inn.** Scenes 31–37 are the warm refuge in amber. From scene 38 everything is cold: steel blue and xenon white, with rain only in the beams. Generate each cold frame from its warm counterpart. Scene 50's dawn is drained blue-grey.

(Scenes 13–17 took shots 181–190.) The next session should board scenes 13–30 in order (the stair motif comes in 15, 16, 21 and 28), or finish the inn (30, 33, 35–37, 42–49) and the dawn (50).

**Earlier session — [scenes 8–12 boarded](passes/scenes-8-12.md), Kanda revisited.** Nine shots (162–170), plus one discarded attempt at shot 169; ten calls in all. The shots are **numbered in boarding order**: scenes 8–12 are appended after scene 100 in `SCENES`, so no earlier shot number or ID moves. Later passes carry on the same way (the inn took shots 171–180). Vera wears her original look (`sheets/vera.jpg`, with the pale blue umbrella) until the red dress in scene 72; if she changes costume anywhere in scenes 13–71, the coat rule applies there too (a genuinely different coat, coloured for the scene). Okada follows `s81/100`, and the office follows `s77/85`. Caveats: the clip in shot 165 reads as a bow; shot 166's door lettering shows only "JAC". Scene 13 was left for later: the roadside inn was boarded next.

**Earlier session — [scenes 98–100 boarded](passes/scenes-98-100.md), the ending.** Seven shots (155–161), plus the Look E sheet, one discarded sheet and one aborted call; ten calls in all. **Director's standing rule, tightened: every further Vera costume change gets a genuinely NEW coat — a different garment and silhouette, not the same coat recoloured — in a colour that fits the scene.** Look E (scene 98, `sheets/vera-look-e.jpg`) is a short boxy oatmeal car coat. Look F (scene 100, no sheet; shot 160 is its master) is a deep teal peacoat worn with the red bird clip. Caveats: Jack's train-window reflection in scene 98 is unboarded; in shot 160 Vera is not on the third stool; in shot 161 the man is visible in the doorway and the shadow stops short of her stool. **The board has reached the end of the film;** the unboarded scenes are 8–71.

**Earlier session — [scene 97 boarded](passes/scene-97.md), the Hive by morning.** Seven shots (148–154), plus the Look D sheet and two regenerations of shot 140; ten calls in all. Shot 140 now shows the whole car in frame. **Vera wears costume Look D from scene 97** (`sheets/vera-look-d.jpg`, a dark olive-green coat, hair loose). **Director's standing rule: every further Vera costume change gets a NEW coat whose colour fits the scene.** The plan is a pale stone or camel coat for scene 98 and another new coat for scene 100. Caveat: shot 150 shows three prosecutors, not four. The next unboarded scene is **98**.

**Earlier session — [scenes 93–96 boarded](passes/scenes-93-96.md), Ishida's last night.** Nine shots (139–147), using ten calls; shot 140 was regenerated so the car door is open. The station exterior and the sedan's back seat are new locations. Scenes 95 and 96 rhyme with shots 13, 64 and 68. The young detective is a new card. Scene 97 followed in the next session.

**Earlier session — [scenes 89–92 boarded](passes/scenes-89-92.md), the escape.** Nine shots (130–138) and ten calls, one of which fixed Jack's face in shot 138. There are four new locations: the stairwell, the roof (`s90/130-the-roof.jpg`), the walkway (`s91/132-the-rails-sing.jpg`) and the street below the viaduct (`s92/135-below-the-viaduct.jpg`). Scene 93 followed in the next session.

**Previous session — [scenes 85–88 boarded](passes/scenes-85-88.md), the raid on the Hive.** Nine shots (121–129), using ten calls because one generation failed to write and was retried. There are three new locations: the passages (master `s85/119-single-file.jpg`, reused dark in scene 88), Kaneko's counter (`s86/121-the-shutter.jpg`) and the radio repair shop (`s87/124-the-repairman.jpg`). Kaneko and the radio repairman are new cards without sheets. Scene 89 followed in the next session.

**Previous session — [scenes 83–84 boarded](passes/scenes-83-84.md).** Ten shots (111–120), using ten generation calls: Kurose's office by day, and the Hive storeroom by night. Kurose is a new card without a sheet. The storeroom master `s84/115-the-storeroom.jpg` is now the reference for scenes 13, 20 and 25. **Vera's costume change:** from scene 83 she wears Look C (`sheets/vera-look-c.jpg`). Use that sheet for her clothes and `sheets/vera-face.jpg` for her face in every Vera shot from here on. Scene 85 followed in the next session.

**Previous session — [scenes 81–82 boarded](passes/scenes-81-82.md).** Nine shots (102–110), using ten generation calls: the bar by day with Okada, and the newsroom with Harada. The two new cast cards have no identity sheets yet and are held to their scene masters. Shot 108 was reverted to its original tape image at the director's request.

**Previous session — [scenes 77–79 boarded](passes/scenes-77-79.md), and Jack recast as a white American.** Nine new shots (87–95) plus a regenerated `sheets/jack.jpg`/`jack-face.jpg`. **Follow-up turn:** scene 74's three Jack frames have been regenerated with the recast, and **scene 80** (the detectives' room by day, Jack and Ishida) is boarded as shots 96–101 — see the same ledger. Scene 81 followed in the next session.

The [Tokyo Story colour revision of scenes 72–75](passes/tokyo-streets-revision.md) is **complete in two sessions**: ten generation calls (Jack's sheet + nine shots), then eight (the six remaining replacements plus the lost-heel and twenty-metre continuity replacements). Read that ledger for the masters, the locks and the honest production-review caveats.

| Material | Location |
| --- | --- |
| Source screenplay | `Neonoire (3).fountain` — never edit it for image work |
| Verbatim screenplay pages | `docs/neonoire/screenplay/`, regenerated by `npm run split:neonoire` |
| Camera/shot boards | `docs/neonoire/scenes/`, including the newly boarded scene 72 |
| Shared current street brief | `scripts/neonoire/streets-look.mjs` |
| Active images / identity sheets | `public/images/neonoire/` |
| Importable project | `public/projects/neonoire-opening.json` |
| Remaining generation prompts | [pass 8](passes/pass-8.md), [pass 9](passes/pass-9.md) |

## Next images: none in scenes 72–75 — the revision is complete

Session two delivered the six pending shots and replaced two that failed review:

1. Board 71 — `s73/69-vera-runs.jpg`: hotel exit, makeup still mostly intact, both shoes.
2. Board 73 — `s73/71-the-machine-glows.jpg`: Vera passes through a static machine frame.
3. Board 74 — `s73/72-the-lost-heel.jpg` **(replaced)**: regenerated to match shot 79's locked puddle, drain and shoe orientation; a real stumble, RIGHT foot bare.
4. Board 75 — `s74/74-twenty-metres-apart.jpg` **(replaced)**: the scripted twenty-metre separation now actually pictured at distance; the old ~5m study and its asphalt smear are gone.
5. Board 78 — `s74/76-the-reflection.jpg`: umbrella only in an ambiguous reflection, face never resolved.
6. Board 81 — `s75/79-the-hive-shut.jpg`: intact closed Hive, no people, not yet demolished.
7. Board 82 — `s75/80-the-machine-waits.jpg`: same new ivory machine, nobody.
8. Board 83 — `s75/81-static-in-a-window.jpg`: grey CRT static in a colour night, no people, then black.

Do not regenerate these without a new instruction, and do not restore any superseded image. Jack has a completed sheet and does not need another generation. What still awaits its own pass: cold-open shots 11–28 and scene 3 (legacy 2.39:1 studies), tracked in [cold-open-revision.md](passes/cold-open-revision.md).

## Colour arc — the temperature of every approach (set by the director, extended each pass)

The film's colour is a story: warmth is refuge and it is taken away. Standing rule 2 holds: the inn (31–37) is warm, from scene 38 the cold arrives, and scene 50 dawns drained. Every pass since assigns each new scene its temperature **before** generating, so the approach is planned, not discovered:

- **18–23:** practical warmth only where people are — the bulb, the lanterns, the arch counter; offices, stairs and rain stay grey.
- **24:** the coldest room in the film: blue-black glass, one white pool of light on the model, the city an amber circuit board far below.
- **25:** bulb amber again but darker than 13–20 — warmth turned conspiratorial.
- **26–27:** institutional green-grey; 27 carries the only warmed midtones before the inn, and earns them.
- **28:** salt slate and sea green — the coldest daylight in the film.
- **29 (next):** tatami beige and altar gold, grief draining the room; **30:** black fields, one headlight, the inn sign as the first warm beacon into 31–37.

## Camera and look

*Tokyo Story* restraint **in colour**, not black and white: low-set, **level**, static camera; frontal architecture; ordinary 50mm perspective, 35mm only for the aftermath extreme wide. No tracking, push-in, handheld, Dutch tilt or hero up-angle. The app's new `Low, level` angle preserves this distinction in image/video prompts and CSV export.

Practical light only: ivory vending displays, muted sodium amber, dull green shutters, dark wine-red silk and black rainwater. 35mm Kodak Vision3 500T grain, modest halation; never glossy cyberpunk or an illuminated sky. Rain is fine and steady, not spectacular.

The confrontation runs **stop/approach → chest blows, folding and rejected touch → seated/kneeling aftermath wide → reflection → return to that same wide**. It no longer opens with an aftermath quote over standing people. The long full-body take must cover the collapse, not only the sampled blow keyframe. The score enters late. Scene 75 has no people, including reflections.

For this sequence, attach **new masters and cast sheets only**. Ignore the superseded street pictures and older rain/cutaway style keys:

- `s72/69-the-wait.jpg`: hotel, dry hair/makeup and wine-red silk dress.
- `s73/69-vera-runs.jpg`: the hotel threshold; makeup still pretty, both shoes.
- `s73/70-not-elegantly-badly.jpg`: rainy run, ivory machine/green shutter/railway geography.
- `s73/71-the-machine-glows.jpg`: the machine frame with Vera passing; both shoes.
- `s73/72-the-lost-heel.jpg`: shoe, shallow puddle, kerb and drain — session-two version matching `s75/77-the-red-shoe.jpg`.
- `s74/74-twenty-metres-apart.jpg`: confrontation architecture; session-two version with the scripted 20m gap on screen.
- `s74/75-one-desperate-blow.jpg`: the chest blow at bystander distance.
- `s74/73-two-small-figures.jpg`: distant separated aftermath.
- `s74/76-the-reflection.jpg`: the almost-reflection, water only.
- `s75/77-the-red-shoe.jpg`, `s75/78-the-empty-lounge.jpg`, `s75/79-the-hive-shut.jpg`, `s75/80-the-machine-waits.jpg`, `s75/81-static-in-a-window.jpg`: the five pillow shots.

## Character continuity

- **Vera Voss (29):** American, shoulder-length ash-blonde hair with soft fringe, pale blue eyes; `sheets/vera.jpg`, `vera-face.jpg`. Pretty, groomed and intact makeup in the hotel. Only the rain ruins it, into thin mascara trails, not horror makeup. Same wine-red silk broad-strap cowl-neck calf-length dress throughout. Both low red court shoes until the skid, then **RIGHT bare / LEFT shoe retained**. No coat or umbrella on the street; blue umbrella stays at the hotel stool.
- **Jack (48):** **recast 25 September 2026 as a white American**: regenerated `sheets/jack.jpg`, `jack-face.jpg`; [full profile](characters/jack.md). Age/former detective are script facts. Lean, cool, long angular tired face, grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble, charcoal knee-length coat and off-white open collar. Rain-soaked, hands dark, no weapon or cigarette. He never retaliates and stops touching her after she pushes him away.
- **Daniel Voss (41, twenty years ago):** the sisters' American father, not Jack. The scene 11 clipping names him. The existing scene 4 photograph is still its own reference; do not substitute Jack's new sheet into it. Father links belong to Daniel.
- **Mara (24):** `sheets/mara.jpg`, `mara-face.jpg`; the red-bird clip slips loose in scene 2, not held in place throughout. No resolved Mara face in the street reflection.
- **Ishida / young officer:** retain their existing sheets and face crops; not redesigned in this session.

## Other work is not this revision

- Opening shots 1–10: revised 16:9. Shots 11–28 and scene 3 retain legacy 2.39:1 images marked **Needs review**; see [cold-open-revision.md](passes/cold-open-revision.md). Do not crop those studies into a supposed regeneration.
- Scenes 4–7: existing revised images remain. Apartment grammar: `apartment-look.mjs`, no paper pendant or hanging cord, exactly two cups, corrected family photo. Police/interview/detectives continuity remains in their respective look modules.
- Scene 76: all three images unchanged by this session. Board positions shift to 84–86 but stable IDs/assets 82–84 remain. Dark apartment, ruined dress, dried mascara, Jack's old steel lighter; he is not her father.
- The Rapture project and other app features remain separate.

## Integration and verification

`ID:` on a board is a stable frame identity; the numbered heading is its current screenplay-order position. Scene 72 was inserted without stealing existing IDs. Asset prefixes are also retained. **Do not assume either is a running-order counter.**

Generated screenplay pages may change their production headers, never the source draft's words. The builder proves the 100 page bodies rebuild the fountain byte for byte. Every `SCRIPT:` quote must be present in it. Missing images stay honest placeholders.

```bash
npm ci
npm run build:neonoire
npm run verify:neonoire
npm run check:assets
npm run typecheck
```

Raw generation PNGs and review scratch work belong in ignored `artifacts/`; only delivered JPEG assets, the board, the portable bundle and handoff material need versioning. Normalise freshly composed wide frames to 1920×1080 without burning in letterbox bars. Never fake a revised master by cropping a legacy scope image.

The portable project and fresh workspaces receive this revision. An independently edited saved workspace is **not** silently overwritten: import the updated bundle as a separate revision copy when necessary. Reopening an existing project still fills untouched missing-keyframe slots as new files arrive.
