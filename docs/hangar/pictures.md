# The cold open — pictures

First picture pass: 6 October 2026, second pass the same day. Before the first, every storyboard card
in the cold open held an empty slot (`image: ""`, status *Needs review*) and the workspace had no
pictures of its own at all. This is the ledger for what has been delivered since, what it cost in
caveats, and what is queued.

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
| 5 | `s2/05-guard-booth-tv.jpg` | Two Agents — `sheets/agent.jpg` |
| 6 | `s2/06-wright-field-1944-inert.jpg` | |
| 7 | `s2/07-the-coffee-ring.jpg` | |
| 8 | `s2/08-hand-flat-on-the-lid.jpg` | |
| 11 | `s3/11-into-the-hills.jpg` | |
| 12 | `s3/12-the-cab.jpg` — **retake** | |
| 16 | `s4/16-headlights-round-the-bend.jpg` | |
| 17 | `s4/17-two-more-miles.jpg` — **retake** | |
| 23 | `s5/23-down-the-bank.jpg` | |
| 27 | `s6/27-road-flares.jpg` | |
| 31 | `s7/31-empty.jpg` | |
| 36 | `s7/36-the-far-corner.jpg` | |

Twenty-one pictures, all 1920×1080 full-bleed 16:9: five cast sheets and sixteen frames — **16 of 39
shots**. Contact sheets:
[`reviews/first-pass-2026-10-06.jpg`](../../public/images/hangar/reviews/first-pass-2026-10-06.jpg)
(the cast row, the black plate, the hangar, the hills, the cab, the bend, the nurse) and
[`reviews/pass-two-2026-10-06.jpg`](../../public/images/hangar/reviews/pass-two-2026-10-06.jpg)
(the booth, the crate, the ring, the hand, the two retakes, the fall, the flares, the empty crate, the
far corner).

**Superseded studies are archived, never deleted:** `archive/s3/12-the-cab--v1.jpg` and
`archive/s4/17-two-more-miles--v1.jpg`, both replaced in place on 6 October after the director's notes
(the cab had no windscreen frame or roof drawn over the men and a green radio display 1975 never had;
the nurse read older than thirty-four and carried a printer's white frame). The archive is append-only,
and `install-picture.mjs --replace` refuses an in-place replacement it cannot see an archived
predecessor for.
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

- **Full-bleed is stated in every prompt.** No border, no white frame, no cream margin, no vignette —
  "paint right up to all four edges". This is not decoration: shot 17's first study came back with a
  printer's white frame around it, which is the one generation artefact that has actually reached the
  board. Every prompt below, and every future one, says it.
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

### Second pass, same day (shots 5–8, 23, 27, 31, 36; retakes 12 and 17)

- **5 — The guard-booth TV.** Locked-off insert, 50mm: a 1970s set with rabbit ears on a booth shelf,
  its small curved screen carrying a grainy senate committee and a raised gavel in blue-white flicker,
  the screen the only light, a mug, clipboard and thermos beside it, the emptied hangar and sodium
  lamps through the booth glass. No cast.
- **6 — WRIGHT FIELD 1944 – INERT.** Medium wide, 35mm, low near the floor so the crate looms: one
  bare lamp directly above, hard top light, deep shadow beneath, the stencil weathered but legible,
  the coffee ring worn into the lid, the rest of the floor empty and dark. No people.
- **7 — The coffee ring.** Top-down insert, 50mm: the dark ring worn into the lid's grain, the
  sergeant's chipped blue enamel mug sitting exactly in it, a thread of steam, his weathered hand
  caught lifting it away. Sergeant sheet attached.
- **8 — Hand flat on the lid.** Close-up, 85mm, eye level: the old hand resting flat and still on the
  lid, warm lamp bounce on skin and worn wood, the face out of frame. Sergeant sheet attached.
- **23 — Down the bank.** Wide tracking, 24mm, monochrome-blue moonlight: the crate tumbling into a
  trunk, boards spinning away, layered painted ferns and bark, nothing visible inside it and nothing
  thrown clear. No cast.
- **27 — Road flares.** Medium, 35mm: the trucker crouched over the lit flare with sparks spitting,
  the truck and trailer slewed across the wet road, the sedan stopped at an angle with both agents
  out of it, the flare's crimson the only key on the men — no flashlight, stated in the negative.
  Trucker and agent sheets attached.
- **31 — Empty.** Medium wide, 35mm: the split crate in the shallows, boards and straw strewn, the
  open interior pure empty shadow, one agent with the flare held low, the second a backlit shape, the
  creek glinting behind. Agent sheet attached.
- **36 — The far corner.** Locked close-up, 50mm: the flare's red only just reaching the nearest
  boards, the few uncrossed tally marks in near-darkness, the rest black. No cast.
- **12 — retake.** Same two-shot brief as the first study, plus the explicit correction: an enclosed
  cab with windshield header, roof liner, sun visor, side glass and pillars, round analog gauges, a
  period AM radio with a needle dial, and no digital display of any kind. Trucker and airman sheets
  attached.
- **17 — retake on the director's note.** Close-up, 85mm: "a beautiful young nurse of thirty-four —
  soft regular features, clear skin, dark lashes, expressive warm face, genuinely pretty — prettier
  and fresher than a tired version, but with honest exhaustion in her eyes", the cap, coat and
  clipped badge kept from her sheet, and the full-bleed instruction stated twice. Nurse sheet
  attached.

## Caveats, honestly

- **12 — The cab (retaken).** The cab geometry is right now: enclosed, glazed, period instrumentation,
  the anachronistic green display gone. Two flaws remain: a pale band along the top right of the glass
  (reads as the cab's lit roofline, but it is a flaw) and the dark trailer through the rear glass that
  the first study had, now unreadable.
- **17 — Two more miles (retaken).** Prettier and full-bleed, as asked: the white frame is gone, she
  reads thirty-four, and the cap, coat, badge and slow blink all hold. Her hand on the wheel is a shade
  heavy — small in frame, and the one thing a third visit could fix.
- **11 — Into the hills.** The composition, the layered blue ridgelines and the fog are right; the
  foliage runs **close to photographic** for a hand-painted film. A retake should push visible
  brushwork and painted edges.
- **27 — Road flares.** The blocking, the red key and the agents' arrival all read; the flare's spark
  burst is closer to a firework than a road flare, and the agents' cut reads a little anachronistic
  against the 1975 brief.
- **31 — Empty.** The empty interior reads as pure shadow, which is what the scene needs; the pines
  read **Northern European rather than Ohio** — a retake should go bare deciduous.
- **23 — Down the bank.** The strongest of the pass. Only note: the crate reads a little small against
  the trunks, and its stencil is weathered to gibberish (unreadable by design).
- **36 — The far corner.** Marks read few and small in near-darkness, no cross-strokes — the beat is
  the audience finding them, and they do.
- **4 — Wright-Patterson at night.** No blocking fault found. The airmen are small by design; the
  crate line reads without singling out the INERT crate, which is what the screenplay wants.
- All thirteen are **draft studies, not approved coverage** — the same standing caveat the other
  workspace's ledgers carry. "Ready" is the app's word for a card that is not missing anything, not a
  claim that a director has signed the frame off.

## Queued — the next passes

Twenty-three shots still hold their slots, plus the prettier cast sheet for the nurse and the style
plate: about three more passes of ten generations each. The order that keeps the film watchable while
it is completed:

1. **A prettier nurse cast sheet first** (she is the only cast sheet the director has asked to
   revisit, and every future generation of her — 19 in scene 4, scene 6 — copies it), then **9** (the
   two-shot at the clipboard, trucker and airman), **25** (the crate by the creek, locked off), **33**
   (INERT half-sunk in the water), **34** (rows of marks) and **35** (the newest stroke).
2. **The rest of the road and the swerve:** 10 (past the weigh station), 13 (the knock heard before
   anyone looks), 14 (the knee-taps in unison), 15 (the raised finger, the missing fourth), 18 (the
   two vehicles a hand's width apart), 19 (the mirror and the cap — both clearly in frame, they are
   plot), 20 (the skid), 21 (the rear doors bursting), 22 (over the edge).
3. **The road and the swerve:** 10 (past the weigh station), 13 (the knock heard before anyone looks),
   14 (the knee-taps in unison), 15 (the raised finger, the missing fourth), 18 (the two vehicles a
   hand's width apart), 19 (the mirror and the cap — both clearly in frame, they are plot), 20 (the
   skid), 21 (the rear doors bursting), 22 (over the edge).
3. **The rest of the descent, top-side and the close:** 24 (POV inside — darkness and slivers through
   the cracks and **nothing recognizable**), 26 (taillights round the bend), 28 (the gloved hand
   lifting the cap), 29 (Where is it?), 30 (three figures down the bank through red fog), 32 (**only
   the hollow in the straw**, no form of anything), 37 (the woods, the clicks receding), 38 (Only the
   airman hears), 39 (the flare gutter, then black).
5. **The style plate, for future use** — `public/images/styles/painted-americana.jpg`, the example
   thumbnail for the `hangar` entry in `src/lib/styles.ts`, which today **borrows `ghibli.jpg`** and
   must not be left borrowing another style's example forever. It is not a shot frame: it is the
   picker's example picture, 16:9, showing the whole look at once — a 1975 Ohio night, gouache
   weather, weighty hand-drawn people, dashboard amber against blue. (`neonoire` already has its own
   `neo-noir-tokyo.jpg`; this is the last entry in the library without its own.)

Rules that bind every one of them: nothing is ever shown in the crate, nobody says alien, robot or
UFO, the light outdoors is a flare and never a flashlight beam, and the frames are 1920×1080,
full-bleed, in Painted Americana '75.
