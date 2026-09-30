# NEONOIRE — the final screenplay

> **New session? Read [`story-bible.md`](story-bible.md) first** — premise, characters and their decision history, conspiracy backstory, locations, structure, scene intent, rejected ideas, motifs, post-draft changes and known inconsistencies. [`baseline/Neonoire_Draft1_2026-09-25.fountain`](baseline/Neonoire_Draft1_2026-09-25.fountain) is Draft 1 as originally written (100 scenes, before the letter rewrite); the working script started identical to it, so any difference from it that is not in the bible's Part 9 was changed in PlayFrame.

**100 numbered screenplay scenes and six inserted scenes (25A, 27A, 53A, 63A, 82A, 99A), all boarded: 307 numbered shots.** The first boarding is shots 1–240. Coverage 241–269 added the beats that boarding had named and left, without renumbering; 270–286 covered the new endings and the letter rewrite; 287–296 boarded 25A, 27A and 63A; **297–307 boarded 53A, 82A and 99A and the story-pass-2 coverage of scenes 96, 97 and 99A**. The draft itself is unchanged and is carried page by page into Frame. Eight of the newest shots hold honest placeholder cards naming the files they await (briefs in the pass files).

**Latest passes:** [the cold-open fresh pass — APPROVED](passes/cold-open-fresh-2026-09-30.md) (30 September 2026): all 31 cold-open frames (shots 1–28 and coverage 280–282) regenerated from scratch from the screenplay text with character sheets only — plus the bar sheet's night panels in scene 2 by the director's override — installed as the film's main images at status Ready, with new cast sheets for Sakai and the journalist. Before that: [story pass 2 — the boards and the retakes](passes/story-pass-2-boards.md) (29 September 2026): scenes 83–84, 96–97 and the new 53A, 82A and 99A boarded and corrected, the six escape retakes installed in place and the frames released from Needs review. Before that: [scenes 77–79 and scene 80](passes/scenes-77-79.md) (shots 87–101), and [scenes 81–82](passes/scenes-81-82.md) (shots 102–110). The bar by day with Okada, and the newsroom with Harada. Then [scenes 83–84](passes/scenes-83-84.md) (shots 111–120): Kurose's office, and the Hive storeroom. Then [scenes 85–88](passes/scenes-85-88.md) (shots 121–129): the raid on the Hive. Then [scenes 89–92](passes/scenes-89-92.md) (shots 130–138): the escape. Then [scenes 93–96](passes/scenes-93-96.md) (shots 139–147): Ishida's last night. Then [scene 97](passes/scene-97.md) (shots 148–154): the ground-breaking at the Hive, with Vera in costume Look D. Then [scenes 98–100](passes/scenes-98-100.md) (shots 155–161): the rooftop, the demolition and the new counter, the end of the film. Then [scenes 8–12](passes/scenes-8-12.md) (shots 162–170, numbered in boarding order): Kanda revisited and Jack's office. Then [the roadside inn](passes/roadside-inn.md) (shots 171–180): the stairway motif and the colour change. Then [scenes 13–17](passes/scenes-13-17.md) (shots 181–190): the Hive, first seen.

## Current image pass: Tokyo Story in colour

[Scenes 72–75 were re-directed and re-imaged on 25 September 2026](passes/tokyo-streets-revision.md):

- **10 generations: Jack's new character sheet plus nine shot images** across the hotel, run, confrontation and empty still lifes.
- **Six shots still need replacement.** Their old images have been removed; the board shows labelled empty **Needs review** slots, not stale images called finished.
- All ten delivered masters are **16:9 full-bleed, 1920×1080 JPEG**. A face crop and review contact sheet are derivatives, not additional generation calls.
- Low, **level**, static cameras; normal 50mm perspective, 35mm for the distant aftermath. *Tokyo Story* restraint in muted colour, not monochrome and not action coverage.
- Vera is pretty, dry and carefully made-up in the hotel; **only the rain undoes her makeup**. The same wine-red silk dress continues through the sequence. After the skid her right foot is bare and left red shoe remains.
- **Jack (48)** is the former detective/private investigator, recast on 25 September 2026 as a white American (new `sheets/jack.jpg`); the recast is applied to every Jack frame, including scene 74's three. The old “Jack Voss” entry was incorrect: **Daniel Voss** is the father in the photograph. [Jack's profile](characters/jack.md) records the distinction.

[Review contact sheet](../../public/images/neonoire/reviews/tokyo-story-72-75-pass-1.jpg) · [Jack reference](../../public/images/neonoire/sheets/jack.jpg) · [remaining prompts](passes/README.md)

## Where things live

| Material | Location |
| --- | --- |
| Source of truth | [`Neonoire (3).fountain`](../../Neonoire%20(3).fountain); the older opening extract is historical |
| Screenplay pages | [`screenplay/`](screenplay/) — one per scene, draft text verbatim under production headers |
| Shot boards | [`scenes/`](scenes/) — type, lens, angle, movement, duration estimate, cast, light, image and script quote |
| Current street brief | `scripts/neonoire/streets-look.mjs` |
| Images | `public/images/neonoire/s1 … s7/`, `s72 … s96/`, `sheets/`, `keys/` |
| Workspace bundle | [`public/projects/neonoire-opening.json`](../../public/projects/neonoire-opening.json) |
| Story bible and decision log | [`story-bible.md`](story-bible.md) — read first |
| Draft 1 baseline (diff against the working script) | [`baseline/Neonoire_Draft1_2026-09-25.fountain`](baseline/Neonoire_Draft1_2026-09-25.fountain) |
| Next-agent handoff | [`handoff.md`](handoff.md), [revision ledger](passes/tokyo-streets-revision.md) |

**All 147 shot images are on disk** — the Tokyo Story colour revision of scenes 72–75 completed in two sessions (10 + 8 generation calls). Of the existing opening images, shots 11–28 and scene 3 are still legacy 2.39:1 studies pending their separate 16:9 revision; see [cold-open-revision.md](passes/cold-open-revision.md). Scene 76 images are unchanged by the current pass. Neither group is claimed as freshly regenerated.

## Opening the revision

A fresh workspace seeds the current portable bundle. Open **Templates → NEONOIRE → Open the final screenplay**, or import the JSON above. Existing separately saved/edited projects are deliberately not overwritten automatically; import a separate revision copy if the project was opened before this revision. Subsequent new images still fill untouched missing-keyframe slots when reopening.

## Commands

```bash
npm run split:neonoire         # regenerate screenplay pages, never retype the draft
npm run build:neonoire         # regenerate the portable bundle; report missing slots
npm run verify:neonoire        # screenplay, schema, cameras, image bytes, cast, prompts, CSV, persistence
npm run check:assets
node scripts/neonoire/build-project.mjs --check
node scripts/neonoire/pass-prompts.mjs
```

## Builder rules

1. Page bodies rebuild the 100-scene fountain **byte for byte**. Only its ` #n#` markers are removed in the workspace script.
2. Every `SCRIPT:` quote comes from the draft, whitespace aside.
3. Every shot declares its type, lens, angle, movement, light, cast and positive working duration using the app's libraries. `Low, level` is different from a heroic upward low angle.
4. A missing image is an empty, labelled **Needs review** slot, never a neighbour's picture.
5. Displayed shot numbers run 1–86. Existing frame IDs and asset filenames remain stable when scene 72 is inserted; optional board `ID:` records that mapping. **Do not infer order from IDs or image prefixes.**
6. All generated images are draft studies, not approved coverage. The cast sheets and new location masters are the references; earlier street studies are not.

For detailed makeup, shoe, umbrella, camera and casting continuity, use the [revision handoff](passes/tokyo-streets-revision.md), not the older pass notes.
