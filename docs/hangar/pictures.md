# The cold open — pictures

First picture pass: 6 October 2026. Before this, every storyboard card in the cold open held an empty
slot (`image: ""`, status *Needs review*) and the workspace had no pictures of its own at all. This is
the ledger for what has been delivered since, what it cost in caveats, and what is queued.

The registry is the source of truth: **`scripts/hangar/frame-registry.mjs`**. `npm run build:hangar`
reads it (so the bundle and the board cannot drift from the disk) and `npm run verify:hangar` holds
every entry to it — path under `/images/hangar/`, file on disk, exactly 1920×1080, status *Ready*, and
the entry's caveat present in the shot's own notes. A shot with no entry keeps `image: ""` and
*Needs review* and borrows nothing.

## What is on disk

| Shot | Picture | Cast sheet |
| --- | --- | --- |
| 1 | `s1/01-black-the-radio.jpg` — black plate | Airman — `sheets/airman.jpg` |
| 2 | `s1/02-three-quick-one-slow.jpg` — black plate | Sergeant — `sheets/sergeant.jpg` |
| 3 | `s1/03-gunfire-then-silence.jpg` — black plate | Trucker — `sheets/trucker.jpg` |
| 4 | `s2/04-wright-patterson-at-night.jpg` | Nurse — `sheets/mom.jpg` |
| 11 | `s3/11-into-the-hills.jpg` | Two Agents — `sheets/agent.jpg` |
| 12 | `s3/12-the-cab.jpg` | |
| 16 | `s4/16-headlights-round-the-bend.jpg` | |
| 17 | `s4/17-two-more-miles.jpg` | |

Thirteen pictures, all 1920×1080 full-bleed 16:9: five cast sheets and eight frames — **8 of 39 shots**.
Contact sheet: [`public/images/hangar/reviews/first-pass-2026-10-06.jpg`](../../public/images/hangar/reviews/first-pass-2026-10-06.jpg)
(cast row, then the frames: the black plate, the hangar, the hills, the cab, the bend, the nurse).
The five cast sheets are installed on the cast (`build-project.mjs` reads `CAST`), so the Cast tab,
the prompt builder's character line and every future generation can hold a face.

**The three black plates are the film's own picture, not a placeholder.** Shots 1–3 are pure black on
purpose — a radio, the clicks, gunfire and silence, with nothing shown and nothing faded up. They were
written deterministically (`convert -size 1920x1080 xc:black -colorspace sRGB -type TrueColor`), cost
no generation, and their frames say so.

## The look every picture holds

The house style `hangar` — **Painted Americana '75** in `src/lib/styles.ts`: gouache-painted places
with Studio Ghibli's layered atmosphere, people drawn plainly with Iron Giant-era weight and readable
silhouettes, a restrained palette of ambers, teals and blue-blacks, dashboard amber against blue
night, gentle grain and soft halation, 16:9 full-bleed. Every prompt below opens with that style
block; the cast sheets were attached as references to every frame prompt that contains a character.

## The prompts, as used

Recorded so a retake can be aimed rather than guessed at. All were generated at the style's own
16:9 and installed by `node scripts/hangar/install-picture.mjs <raw> <dest>` (centre-crop to 16:9,
resize to 1920×1080, quality 92); the raws are kept out of git, as the workspace's other passes keep
theirs.

- **Cast sheets (5).** One line each: "Character reference sheet, 16:9 widescreen, painted 2D feature
  animation: PAINTED AMERICANA '75 — Iron Giant weight, flat cel colour with one soft shadow tone, no
  cartoon take — painted over gouache with Ghibli's layered atmosphere. Subject: …" plus "half-figure
  three-quarter view plus a smaller full-figure standing pose on the same sheet, plain warm-grey
  painted studio backdrop, …, no text, not photorealistic, not CGI, not 3D, no anime big eyes."
  Subjects: the airman (22, neat civilian clothes, white shirt buttoned to the collar); the sergeant
  (58, faded olive work uniform, chipped enamel mug, reading glasses); the trucker (50, denim over
  plaid, plain dark cap, stubble); the nurse (34, white cap, navy coat, ID badge clipped on); the two
  agents (forties, plain dark suits, narrow ties, identical bearing, two slightly different ages,
  hard red flare light from below).
- **4 — Wright-Patterson at night.** High-angle 24mm crane-down on the base: hangar doors open on
  sodium-yellow light and wet concrete, a limp flag, airmen small against the doors in a slow crate
  line onto a flatbed, the guard booth's blue-white television glow, cold deep-blue night above.
  Both sheets attached.
- **11 — Into the hills.** Extreme wide 24mm high above: a twisting two-lane climbing into the Ohio
  hills, hand-painted fog lying in the hollows, ridgelines receding in layers of blue, one lit truck
  small on the road and the sedan's headlights two pinpricks a quarter mile back. No cast.
- **12 — The cab.** Medium two-shot from the dash, 35mm: the trucker at the big wheel and the airman
  beside him, dash amber on both faces, a small green radio dial, fog and night beyond the glass, the
  trailer's dark bulk in the mirror. Trucker and airman sheets attached.
- **16 — Headlights round the bend.** Locked wide 35mm at the blind bend: the wagon drifting over the
  centre line a beat too long, its beam flaring into the lens and going white in the fog, the truck
  and trailer disappearing round the far side. Nobody visible in the cars.
- **17 — Two more miles.** Close 85mm in the wagon: the nurse's cap, coat and clipped ID badge, eyes
  heavy and a slow blink caught mid-drop, window down, dash glow, and the first white glare of
  oncoming headlights crossing her eyes at the frame edge. Nurse sheet attached.

## Caveats, honestly

- **12 — The cab.** The seats, faces and dash amber read, but the cab has **no windscreen frame or
  roof drawn over the men**, and the radio carries a **green display 1975 never had**. This frame is
  the head of the retake queue: its replacement gets a new filename, and this file is archived as
  `archive/s3/12-the-cab--v1.jpg` **before** the new one is installed.
- **11 — Into the hills.** The composition, the layered blue ridgelines and the fog are right; the
  foliage runs **close to photographic** for a hand-painted film. A retake should push visible
  brushwork and painted edges.
- **17 — Two more miles.** Everything the shot needs is in the frame (cap, coat, badge, the slow
  blink, the oncoming glare), but she **reads older than the brief's thirty-four**. Exhaustion is the
  intent; a retake can pull her closer to the age.
- **4 — Wright-Patterson at night.** No blocking fault found. The airmen are small by design; the
  crate line reads without singling out the INERT crate, which is what the screenplay wants.
- All thirteen are **draft studies, not approved coverage** — the same standing caveat the other
  workspace's ledgers carry. "Ready" is the app's word for a card that is not missing anything, not a
  claim that a director has signed the frame off.

## Queued — the next passes

Thirty-one shots still hold their slots, plus one retake and one style plate: four more passes of ten
generations each. The order that keeps the film watchable while it is completed:

1. **Retake 12 first** (the only frame with a geometry fault), then the scene anchors still missing:
   **27** (road flares, red key on fog — flares only, never a flashlight), **31** (the split crate in
   the creek, empty), **23** (the crate down the wooded bank), **36** (the far dark corner).
2. **The room plates:** 5 (the booth's television), 6 (the crate, stencilled WRIGHT FIELD 1944 –
   INERT, low angle so it looms), 7 (the coffee ring, top-down), 8 (the hand flat on the lid), 9 (the
   two-shot at the clipboard), 25 (the crate by the creek, locked off).
3. **The road and the swerve:** 10 (past the weigh station), 13 (the knock heard before anyone looks),
   14 (the knee-taps in unison), 15 (the raised finger, the missing fourth), 18 (the two vehicles a
   hand's width apart), 19 (the mirror and the cap — both clearly in frame, they are plot), 20 (the
   skid), 21 (the rear doors bursting), 22 (over the edge).
4. **The rest of the descent, top-side and the crate:** 24 (POV inside — darkness and slivers through
   the cracks and **nothing recognizable**), 26 (taillights round the bend), 28 (the gloved hand
   lifting the cap), 29 (Where is it?), 30 (three figures down the bank through red fog), 32 (**only
   the hollow in the straw**, no form of anything), 33 (INERT half-sunk), 34 (rows of marks), 35 (the
   newest stroke), 37 (the woods, the clicks receding), 38 (Only the airman hears), 39 (the flare
   gutter, then black).
5. **The style plate, for future use** — `public/images/styles/painted-americana.jpg`, the example
   thumbnail for the `hangar` entry in `src/lib/styles.ts`, which today **borrows `ghibli.jpg`** and
   must not be left borrowing another style's example forever. It is not a shot frame: it is the
   picker's example picture, 16:9, showing the whole look at once — a 1975 Ohio night, gouache
   weather, weighty hand-drawn people, dashboard amber against blue. (`neonoire` already has its own
   `neo-noir-tokyo.jpg`; this is the last entry in the library without its own.)

Rules that bind every one of them: nothing is ever shown in the crate, nobody says alien, robot or
UFO, the light outdoors is a flare and never a flashlight beam, and the frames are 1920×1080,
full-bleed, in Painted Americana '75.
