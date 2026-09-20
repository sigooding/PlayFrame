# LET THE RAPTURES COMMENCE — canon and production index

**Source of truth: [show-bible.md](show-bible.md), the full current series prompt.**
8 × 45min British black comedy. The latest series prompt supersedes conflicting
lighting, framing or story assumptions in older boards. The tone is the same dry
comedy in every thread; this is not noir and not a tragedy.

## Current working material

- **Series bible:** the complete cause, tone, cosmology, blanks, water clock, cast,
  nine visual grammars, connective objects, eight episode outlines and final shots.
- **Number Fourteen:** [current numbered scene](scenes/ep4-number-fourteen.md),
  13 shots in episode four. This remains a supporting water-stop scene, **not** the
  Pat / fork / gate sequence in the current episode outline.
- **The first wrong lockup:** [numbered scene](scenes/ep2-first-wrong-lockup.md),
  29 shots in episode two. Nina drives out on a pendant bearing, opens two wrong
  lockups, and acquires Alan. Keyframes are pending; shot 29's source ends
  mid-line.
- **Original scene:** [v1 archive](scenes/archive/ep4-number-fourteen-v1.md).
  The current version tightens shot 1 to a CU/50mm of the headlight switch and
  shot 12 to a MS/35mm of the passing van panel. Dialogue, beats and every explicit
  pause are unchanged. No white headlight beam is shown.
- **App bundle:** `public/projects/let-the-raptures-commence.json`. Rebuild with
  `npm run build:rapture`; verify with `npm run verify:rapture`.
- **Production plan:** `scripts/rapture/plan.mjs`. Holds cast, links, outline
  locations, reference selection and editorial timing estimates, not a second script.

## Retained identity details

- **Danny Crane — 40.** Father, left behind. Olive waxed jacket, canvas satchel.
  Reference: `public/images/rapture/sheets/danny.jpg`.
- **Jodie Crane — 11.** Daughter. Hoodie, collar headlamp, backpack. Her mother
  was raptured and judged worthy. The surname **CRANE** remains locked.
  Reference: `public/images/rapture/sheets/jodie.jpg`.
- **The Woman at Number Fourteen — 50s.** Rumpled housecoat, floral blouse,
  Tesco bag of crumpled papers. The sheet-27 character, **not Pat**. No blank,
  demon or afterlife identity has been assigned to her.
  Reference: `public/images/rapture/sheets/crazed-woman.jpg` (legacy filename).
- **Van:** weathered 1990s Ford Transit, faded grey-green. Unify number plates
  before approving final coverage. Check jacket-pocket continuity in shot 9.

## Current Crane grammar

Handheld, tight, dark. **Red practical sources only. Never a wide establishing
shot; never a whole room.** Red is a source, not a colour grade. For Number Fourteen:
letterbox, red dash indicators, kettle indicator. Jodie's collar headlamp stays off.
Cab coverage is handheld from inside, not the cops' static bonnet two-shot.

The former sodium-orange / desaturated-teal look and wide establishing coverage
are **superseded**, including in legacy Wave 3 images. They are not newly approved
coverage merely because the files are wired into the storyboard as reference.

## New images and honest status

Thirteen **AI-generated storyboard studies** in `public/images/rapture/ep4/` cover
all thirteen Number Fourteen shots, one keyframe each. They are draft references
pending production review, not finished photography. Check unwanted fill,
practical-source motivation, hand anatomy, prop counts, van geography and
bottle air gap before approving them. For the three newest studies, also check
card legibility and the pocketless jacket in shot 9, the bottle fill line in
shot 10, and door colour against shot 4 in shot 13.

194 **legacy keyframes** in `public/images/rapture/` are wired into the storyboard
and shot list as ordered reference frames (status **Needs review**), grouped by
scene in story order and numbered inside each board. Their shot type, movement,
lens and 5s durations are working placeholders. Three keyframes are missing
from disk and hold placeholder cards: `ep2s2-15`, `ep2s3-15`, `ep2s3-16`.

Unpictured cast roles use the app's initials avatar.

Only written pauses are locked. Number Fourteen's **~175 seconds** and the lockup's
**~249 seconds** are editorial playback estimates for those scenes, **not** finished
episode runtimes. Other scenes
are explicitly labelled outlines. There are not eight finished 45-minute scripts.

## Boundaries not silently resolved

- Max: flashbacks only, alive and unreachable. Episode eight says he knows the
  fields; no present-day reunion or delivery mechanism has been invented.
- 1980, death five years later and forty-five years later are retained as written;
  the present-day calendar year is not inferred. Nina remains 45.
- The chained/rescued blank is not automatically Alan. The third field officer
  and two recovery angels remain unnamed.
- Episode-four Number Fourteen has a *locally intermittent* upstairs tap; the
  series-wide upstairs failure remains episode five.
- The correction is an **auction bid, not a rewind**. Limbo is outside time and
  keeps its queue. No epilogue or resolved faces are added.

## Legacy boards (wired into the storyboard as reference frames)

Nine boards, in story order, each in numeric filename order inside its scene:

- Episode one: cold open (`shot-01`–`19` → The mugging), St Jude's (`a1s1-01`–`19`),
  washing up (`a1s3-01`–`37`, its own legacy scene), storage facility (`a1s4-01`–`24`),
  police/car park (`a2s1-01`–`19`).
- Episode two: Limbo (`ep2s1-01`–`30`), first raid (`ep2s2-01`–`16`, `15` missing),
  Hell intake (`ep2s3-01`–`19`, `15`–`16` missing), night drive (`w3-01`–`14`, its
  own legacy scene; episode-two placement is provisional).
- The Wave 3 night drive is the older horror/night sequence. Its prior framing
  and lighting are not the current Crane grammar. The ambiguous figure in `w3-08`
  remains an earlier visual idea, not an added character or listener in
  Number Fourteen.

## Opening the workspace

Fresh installations seed the series alongside the existing samples. In an existing
workspace, choose **Templates → Let the Raptures Commence → Open series workspace**.
This is idempotent: the fixed project ID is inserted only if absent. Existing edits,
other projects and public share state are never replaced. Deletion is respected until
you explicitly open the bundled workspace again.

Alternatively, import `public/projects/let-the-raptures-commence.json` through the
existing **Import project** control to create a separate editable copy.
