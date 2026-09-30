# Cold open — clean restart, 30 September 2026

## Director's instruction

Redo the cold-open shot images fresh, without using the current scenes as a guide or allowing the original images to influence the attempt.

**This overrides every earlier cold-open image-reference instruction.** The screenplay is unchanged. Shot numbers, frame IDs and asset paths remain stable. The scope is scenes 1–2: shots **1–28 plus 280–282**, 31 images total.

## Current state — batch 2 (same day)

The director said **“they're better next”**: continue forward in this text-only direction, not a request to retake batch 1. Nine more images are installed: **10–17 and 20**. Total **19/31 fresh**, with **12 remaining: 18, 21–28, 280–282**. All remain draft review, not production approval.

[Batch 2 review sheet](../../../public/images/neonoire/reviews/cold-open-fresh-2026-09-30-batch-2.jpg) shows only these nine new files. The original ten-frame review sheet below is retained as **batch 1 history**, not the current total. The app's fresh-only mood board now includes all nineteen.

All ten batch-2 generation attempts used **`images: []`**. Nine succeeded. The initial shot-18 body-search/flashlight request was blocked by moderation and produced no file. A non-violent **object-only purse-discovery** request was then attempted, but the tool returned its ten-generation turn limit without creating an image. Shot 18 is **still the old image, explicitly pending**, not silently substituted or marked complete. Its next brief is the empty-frame prop insert; the screenplay's body-search action is unchanged.

No prior scene, sheet or even batch-1 image was opened as a generation reference this turn. Only new batch-2 outputs were viewed, after generation. All nine were inspected individually at full size; tag 114 in shot 16 was also cropped and read. No generated pixels were patched or cropped for installation. Native 1376×768 output was full-frame resized to 1920×1080; thin generated black edges in 11 and 20 are retained and logged, not falsely described as full-bleed passes.

| Shot | Batch 2 review / caveats |
| --- | --- |
| 10 | Collapse and two lower-face masks read. Mara is too exposed in recess; figures closer than distant-wide brief, headlight direction unproven. |
| 11 | Both hands over mouth read. Gaze goes screen-right rather than toward visible alley opening; clip side/scale drifts. Thin baked-in black edge. |
| 12 | Radio, two men, concealed Mara and body read. Sedan across mouth but headlights sideways, not down alley; coat opacity/set details vary. |
| 13 | Sedan is outside on cross street with rear red lights, body remains. Mara exposed, dark shoes and changed bag; cross street too bright. |
| 14 | Kneeling, dark phone screen, attached bag, living Sakai read. Sakai props himself rather high on elbow; faces/set details drift. |
| 15 | Two hands and key transfer read; not the closing-fingers/wrist grip yet. Camera reads waist-high and tag geometry differs from 16. |
| 16 | **114 clearly legible**, one key/tag, five fingers. Palm reads right rather than specified left; not a locked prop master. |
| 17 | Runs away from camera, no bag on body, bag caught at pole touching water. Strap reads continuous hanging loop, not visible tear; returning headlight cue weak. |
| 20 | Watch, glance, beer and closed brown notebook read. Backed chair rather than stool, raised counter tier, CRT presenter panel rather than clearly variety; thin black bars. |

The first ten images remain untouched. New SHA-256 values are appended to the asset provenance file, with batch membership and the blocked shot explicitly recorded. `--cold-open-fresh` lists twelve pending shots and starts at 18. No reference policy changed.

## What actually happened — batch 1 history

- Read the screenplay and written story/character facts. Did **not** open any pre-existing scene, cast, prop or location image.
- All ten successful generation calls were **text-to-image with `images: []`**. No old pixels, crops, source frames, cast sheets, style keys, or location sheets were supplied. No old frames were edited.
- Made new compositions from the written action. The fresh text design puts the barber recess on the right when looking toward the bar, vending machine on the left; the new bar has its counter on the right. These are new design choices, not a tracing of the previous set.
- Generated **shots 1–9 and 19**, installed in place at their existing filenames. The generator then explicitly refused further calls because this turn reached its **10-image limit**. The refused attempts did not create files.
- **21 images still await fresh generation:** 10–18, 20–28, 280–282. Their old images remain temporarily in the board with **FRESH PASS PENDING** notes. They are not replacements and must not become references.
- Every cold-open frame is **Needs review**, including the ten new images. Generated is not approved: text-only generation still produced significant continuity/staging faults, recorded below.
- Native output was 1376×768. Delivery JPEGs use a full-frame resize to 1920×1080, without cropping, padding, compositing or incorporating old imagery. This is a small aspect normalization, not native 1920×1080 generation.
- Installed asset hashes and reference provenance: [`cold-open-fresh-2026-09-30-assets.json`](cold-open-fresh-2026-09-30-assets.json).

## Review

[Fresh-only review sheet](../../../public/images/neonoire/reviews/cold-open-fresh-2026-09-30.jpg) — ten labeled frames, not a before/after comparison. Also available in the project's **Cold open — fresh text-only attempt** mood board. Each generated file was opened at full size before installation; no image is signed off as continuity-correct.

| Shot | Result / remaining review |
| --- | --- |
| 1 | Fresh empty alley: ordinary surfaces, right-hand barber, left vending, distant bar. Location study only, not an approved master. |
| 2 | Fresh vending insert. Machine model/detail differs from 1. |
| 3 | Fresh Mara walk. Walk comes toward camera rather than requested lateral staging; face/bag continuity still needs review. |
| 4 | Fresh phone beat. **Caller text is malformed, not legible VERA.** Correction needed. |
| 5 | Fresh phone-off insert; black screen reads. **Loose strap end reads detached too early**, and handbag shape varies. Correction needed. |
| 6 | Fresh doorway. Vending model and distance, recess geometry differ from 1. Correction needed. |
| 7 | Fresh Sakai recognition. **Full turn rather than fleeting glance**, extra vending machine, opaque coat, Mara footwear drift. Correction needed. |
| 8 | Fresh car arrival. **Major failure:** Sakai faces men instead of away; invented hat/umbrella, taxi-like sedan, crowded bright cross street. **Not a master. Retake from text.** |
| 9 | Fresh Sakai stop. Shirt changes, background masks not clearly present, car reads inside lane. **Not a master. Retake from text.** |
| 19 | Fresh bar. Counter right, real programme on CRT. Journalist is near camera rather than far corner; six-stool count not fully provable. Staging review needed. |

The fresh set does **not** yet cut as an approved continuous scene. Do not fix that by feeding the old images back into the generator. Other scenes and later visits to the bar/alley were not retaken; the changed cold-open design therefore also needs a later continuity decision against those visits, not a silent rewrite of them.

## Next batch

1. Read this ledger and the script, not historical image pass notes.
2. Run `node scripts/neonoire/pass-prompts.mjs --cold-open-fresh` for the **12 currently ungenerated** self-contained text briefs. This queue deliberately ignores whether a legacy JPEG already exists.
3. `scripts/neonoire/cold-open-fresh.mjs` is the active rule, beat, generated-set and caveat source. It supplies **no image references**, including no freshly generated images as attachments in this text-only approach. Its briefs are continuation instructions; not verbatim transcripts of the first ten tool calls.
4. The same module also has briefs for correcting generated shots. In particular, 4/5/7/8/9 must not be mistaken for approved assets merely because their numbers are in the generated set.
5. Generate, inspect individually at full size, crop-read prop text if needed, record faults honestly. Update the generated set only after a real output is installed.
6. Rebuild project, run verification, update provenance and review sheet. Do not change screenplay text to accommodate a faulty image.

## Integration and checks

- Builder replaces old reference/provenance notes for **all 31** cold-open frames; it does not concatenate the old image guidance into fresh prompts.
- Dedicated fresh-only mood board separates new work from pending legacy images. The full-sequence mood board says it is a mixed pass.
- Historical board documents and `cold-open-look.mjs` carry prominent supersession notices.
- Verification checks the 31-shot scope, nineteen generated / twelve pending split, explicit no-reference instructions, image dimensions, named caveats, unapproved status, and key screenplay beats.
- The screenplay is unchanged. Batch 1 replaced 1–9 and 19; batch 2 replaced 10–17 and 20. All other images, including failed shot 18, are unchanged.

Validation completed: `npm run verify:neonoire`, `npm run typecheck`,
`node scripts/neonoire/build-project.mjs --check`, and `git diff --check` all pass.
These are integration/provenance checks, **not visual approval**.
