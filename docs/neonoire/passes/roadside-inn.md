# NEONOIRE — the roadside inn, first boarding: the stairs and the colour change (26 September 2026)

**Scope:** scenes 31, 32 and 34 (the warm refuge) and scenes 38, 39, 40, 41 and 45 (they come for Jack). **Ten shots, IDs neonoire-shot-171 … 180**, 16:9 full-bleed 1920×1080 JPEG, from **ten image-generation calls**. The director asked for stairways "like in Tokyo Story" to show the ups and downs, and for a cinematic colour change when they come for Jack, then said "you choose what is visually best". The inn is where both pay off, so it was boarded ahead of scenes 13–30, numbered in boarding order. Scenes 30, 33, 35–37, 42–44 and 46–49 of the sequence remain written, not boarded.

Boards: [n31](../scenes/n31-roadside-inn.md), [n32](../scenes/n32-roadside-inn-lobby.md), [n34](../scenes/n34-roadside-inn-jacks-room.md), [n38](../scenes/n38-roadside-inn-night.md), [n39](../scenes/n39-roadside-inn-jacks-room.md), [n40](../scenes/n40-roadside-inn-lobby.md), [n41](../scenes/n41-roadside-inn-upstairs-corridor.md), [n45](../scenes/n45-roadside-inn-lobby-dark.md). Rules: `scripts/neonoire/inn-look.mjs`. Review sheet: [roadside-inn-pass-1.jpg](../../../public/images/neonoire/reviews/roadside-inn-pass-1.jpg), laid out as **warm on the left and cold on the right, from the same camera positions**.

| Shot | ID | Image | Colour |
| --- | --- | --- | --- |
| 171 WIDE 35mm — the only car (master) | neonoire-shot-171 | `s31/169-the-only-car.jpg` | warm |
| 172 MEDIUM WIDE 50mm — just one night (lobby master) | neonoire-shot-172 | `s32/170-just-one-night.jpg` | warm |
| 173 MEDIUM 50mm — upstairs at the end (**stair frame**) | neonoire-shot-173 | `s32/171-upstairs-at-the-end.jpg` | warm |
| 174 MEDIUM WIDE 50mm — twenty years of Januaries | neonoire-shot-174 | `s34/172-twenty-years-of-januaries.jpg` | warm |
| 175 WIDE 35mm — four black sedans (**the change**) | neonoire-shot-175 | `s38/173-four-black-sedans.jpg` | cold |
| 176 MEDIUM WIDE 50mm — he has heard the gravel | neonoire-shot-176 | `s39/174-he-has-heard-the-gravel.jpg` | cold |
| 177 POV 35mm — the curtain gap | neonoire-shot-177 | `s39/175-the-curtain-gap.jpg` | cold |
| 178 MEDIUM WIDE 50mm — closed, we said | neonoire-shot-178 | `s40/176-were-closed.jpg` | cold |
| 179 MEDIUM 50mm — boots below (**stair frame repeated**) | neonoire-shot-179 | `s41/177-boots-below.jpg` | cold |
| 180 MEDIUM WIDE 50mm — thank you very much | neonoire-shot-180 | `s45/178-thank-you-very-much.jpg` | cold |

## Standing rule 1: the stairway motif

- **The rule:** stairs are staged wherever the script allows, from a low, level, static camera square to the flight.
  - Going **up** means refuge, hope or the past.
  - Coming **down**, or something coming up from below, means danger or loss.
- **At the inn:** shot 173 (warm) and shot 179 (cold) use the **identical frame**. Mrs. Noda leads Jack up to safety; then a masked man climbs where she stood, and Jack turns away at the top.
- **Planned next:**
  - Scenes 15–16: the Hive's outside stair; Jack climbs into the past.
  - Scene 21: Jack's office stairwell as Vera comes up, with a matching shot of her going down at the end of scene 10.
  - Scene 28: stone steps up from the sea wall in the fishing town, after Onomichi.
  - Scenes 69 and 71: the Hive stairwell, matching scene 89.

## Standing rule 2: the colour change

- **Scenes 31–37, the warm refuge:** tungsten amber, ivory paper, tobacco wood, muted olive and the pink payphone, in Tokyo Story restraint.
- **From scene 38, the cold:** steel blue and blue-black, with hard xenon-white headlight beams and the rain visible only inside them. The warm lights are dead; the only warm things left are small and accidental (the vending machine, the CRT).
- **How it was made:** every cold frame was generated from its warm counterpart, so the camera never moves and only the light changes.
- **Planned for scene 50:** a drained blue-grey dawn in the pickup.

## Perspective check (standing rule, added 26 September 2026)

Every image is now checked before install for vehicle count, completeness and direction, screen direction against adjacent shots and POV reverses, headcounts, architecture, and lit practicals. See the handoff's *Standing rules*.

## Honest caveats

- **Shot 174:** the table is Western height, not a low tatami table.
- **Shot 175, fixed in a follow-up turn:** the perspective check found the first study had three sedans facing *away* from the inn, which contradicted shot 177. It was regenerated in three calls (five cars; mixed directions; then an edit removing the extra car). It now shows four sedans, all facing the inn, though already stopped rather than turning in.
- **Shot 171:** Jack's car faces the camera, as if reversed in, and is parked centre-left, where shot 175 has it at the far right.
- **Shot 177:** about ten men, where the script has eight.
- **Shot 178:** Mr. Noda doesn't read clearly as Japanese and is at the desk rather than diving behind it.
- **Shot 180:** the CRT is dark, though the script lights the room with it alone.
- **Not boarded:** the burst through the paper screens in scene 41, and the ringing payphone in scene 45.
- **No generation was left** this session.

**The next session** should board scenes 13–30 in order, with the stair motif in scenes 15, 16, 21 and 28. Or it could finish the inn (30, 33, 35–37, 42–49) and the dawn (50).


## Style sheet and mask rule (29 September 2026)

**The style sheet.** The inn had a studio key (`keys/09-the-roadside-inn.jpg`) and its look file,
but no canon sheet in `sheets/`. It has one now: `public/images/neonoire/sheets/roadside-inn.jpg`,
1920×1080, four labelled panels — the exterior as the WARM REFUGE (tungsten amber windows, the
beer vending machine, the pickup crooked behind), the lobby warm (pink payphone, keyring case,
CRT baseball, wooden counter, the steep stair), the stairs from the low level static square to
the flight, and the same exterior as THE COLD (steel blue and blue-black, xenon-white headlight
beams with the rain visible only inside them, every warm light dead). Panels: the sheet is
people-free on purpose, so it works as a set reference for any shot. `innBase` in
`scripts/neonoire/inn-look.mjs` now points every inn prompt at it.

**The mask rule (director's confirmation).** The masked men at the inn are the same crew as
scene 1: dark knit caps over **black lower-face masks** covering nose and mouth, eyes visible —
never white facemasks, never full balaclavas, never a face under the mask. The costume is locked
by `sheets/masked-man.jpg` and now written into `innBase` as an explicit ban. Six frames where
the masks read wrong (white or balaclava in the glare) were retaken the same day — masks only,
everything else held to the previous frame:

| Shot | Frame | Notes |
| --- | --- | --- |
| 177 | `s39/175-the-curtain-gap.jpg` | the POV through the curtain: sedans in an arc, the men among the cars |
| 178 | `s40/176-were-closed.jpg` | the two in the headlight glare (the balaclava reading, now corrected) |
| 179 | `s41/177-boots-below.jpg` | the man climbing the stairs |
| 180 | `s45/178-thank-you-very-much.jpg` | the man spinning toward the corridor |
| 224 | `s47/222-mud-and-impacts.jpg` | the man coming round the building |
| 217 | `s49/215-no-need-to-chase.jpg` | the eight in the headlights |

Review sheets: `public/images/neonoire/reviews/roadside-inn-sheet-review.jpg` (the studio key
beside the new sheet) and `public/images/neonoire/reviews/roadside-inn-masks.jpg` (the six
retaken frames). Caveats: all seven images are verified at 1920×1080; the session's image viewer
is unreliable, so give both review sheets a full-size look — in particular that the masks read
black and lower-face in the glare frames. Labels on the style sheet garble in places, as ever.
`verify-neonoire.mjs` locks the sheet at 16:9, the `innBase` guard wording and the six board notes.
