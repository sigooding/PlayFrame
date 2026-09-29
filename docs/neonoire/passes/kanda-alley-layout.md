# NEONOIRE — Kanda backstreet layout (29 September 2026)

The cold-open lane is a pedestrian alley, too narrow for a car. From this date the sedan never
enters it: it stops across the **alley mouth** with its high beams shining straight down the lane,
and the masked men walk in and out on foot. Shots 8, 10, 12, 13, 17 and 18 were retaken the same
day to the fixed layout below (the earlier RETAKE PENDING notes are closed); their frames before
the pass are preserved in `reviews/kanda-alley-pending.jpg`.

**Layout, fixed:** car end (the lane opens onto a wider two-lane road) → the old man → the barbershop
doorway (left) and the vending machine (right) → the small lit bar sign at the far end. Mara runs
away from the car, toward the bar she was already heading to.

## Layout sheet brief (generate before the retakes)

```
Location reference sheet, 16:9, 1920x1080, three labelled panels, photoreal night, cold steady rain, 35mm grain, practical light only.
KANDA BACKSTREET (canonical): a narrow pedestrian lane about 2.5 metres wide between two rows of closed shops with shutters down, hand-painted signs, tangled wires overhead, wet black asphalt. Too narrow for cars. At one end (the CAR END) the lane opens onto a wider two-lane road. Halfway along, on the left, the recessed doorway of a closed brick barbershop with an unlit striped pole at its right edge; opposite on the right, one old off-white vending machine glowing. At the far end, a small lit bar sign.
Panel 1: looking down the lane from the car end: vending machine, barbershop doorway, bar sign far away.
Panel 2: the reverse, from the barbershop doorway toward the car end: a black sedan parked across the mouth of the lane, high beams shining straight in, rain lit in columns, two masked silhouettes walking into the lane.
Panel 3: overhead plan with the car end, barbershop doorway, vending machine, bar and the direction Mara runs (away from the car, toward the bar) labelled.
```

**Review sheet:** `public/images/neonoire/reviews/kanda-alley-pending.jpg` — the six frames that await the layout retake, in shot order (8, 10, 12, 13, 17, 18), as they stand on disk: the old blocking, with the sedan in the lane.

## The layout sheet (generated first, the retakes' set reference)

`public/images/neonoire/sheets/kanda-alley-layout.jpg`, 1920×1080, from the brief above verbatim —
three panels: down the lane from the car end, the reverse with the sedan across the mouth and the
two silhouettes walking in, and the overhead plan. Labels garble in places, as ever; the panels
themselves carry the layout.

## The six retakes (29 September 2026)

Each is an edit of the shot's previous frame passed alongside the layout sheet as the set
reference, keeping the film look, grain and palette and the characters' faces and wardrobe exactly
while re-staging the blocking to the fixed layout. All installed 1920×1080 at their existing asset
paths.

| Shot | Frame | Holds | New blocking |
| --- | --- | --- | --- |
| 8 | `s1/08-sedan-arrives.jpg` | the sedan's design, the two masked men's look, unhurried | sedan across the mouth facing in, high beams down the lane in white rain columns; the men walk in as silhouettes against the glare |
| 10 | `s1/10-the-shot.jpg` | the old man's raincoat and appearance, flat ordinary framing | he folds down just outside the barbershop doorway, alone in frame; no muzzle flash, no blood spray |
| 12 | `s1/12-masked-man-radio.jpg` | the masked man's look, bored eyes above the mask | on foot in the lane, low angle, the mouth's glare and rain columns behind him |
| 13 | `s1/13-taillights-gone.jpg` | the sedan's design, the empty-lane melancholy | the sedan reverses out of the mouth onto the road beyond, reverse lamps with the red taillights, the alley falling dark; no people; the plate is not legible |
| 17 | `s1/17-she-runs.jpg` | Mara's wardrobe and the red bird clip, the handbag | she runs away from the car toward the bar sign; the strap tears at the pole; the purse and puddle hold the end of the frame |
| 18 | `s1/18-the-flashlight.jpg` | the man's look, the old man's raincoat, the methodical search | one man walks back in on foot; the sedan stays at the mouth; the torch beam ends on the purse |

In code: `coldOpenLook` now carries the canonical alley layout as well (appended, every
continuity substring intact).

## Review sheets

- `public/images/neonoire/reviews/kanda-alley-retakes.jpg` — the six retaken frames in shot order.
- `public/images/neonoire/reviews/kanda-alley-pending.jpg` — the same six frames as they stood before the pass (the old blocking), for comparison.

## Caveats

- The six frames were verified installed at 1920×1080 and read back in palette statistics (night-dim, mild green, sodium-warm; 12 is cool against the beams), but the session's image viewer is unreliable — give the review sheets a full-size look before the next pass. The retake prompts, the base frames and the layout sheet are the evidence.
- Shots 1–7, 9, 11, 14–16 are untouched and still show the lane as previously boarded; the retakes match the existing master's dressing (barbershop recess, pole, vending machine) so the halves read as one place, but the lane now reads pedestrian where earlier frames read as a narrow road. If the director wants the full 21-frame scene on the pedestrian layout, that is a separate pass.
- The 27 September backing-out note on shot 13 is superseded and now recorded as history in the board's note.

## Script changes in the same commit

- Scene 1: the car blocks the alley mouth; the men walk in; the car reverses out; it swings back and one man walks in to search.
- Scene 15: the tower steps down at the back to a low rear wing against the viaduct, roof level with the tracks; old neon hangs dead on its face; the Hive keeps its own haze by day.
- Scenes 16 and 55: daylight in the passages comes in thin cold shafts through the steam.
- Scene 90: the escape is on the flat roof of the low rear wing, four storeys up, the tower behind.
