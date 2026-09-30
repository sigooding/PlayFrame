# Cold open — clean restart, 30 September 2026

## Director's instruction

Redo the cold-open shot images fresh, without using the current scenes as a guide or allowing the original images to influence the attempt.

**This overrides every earlier cold-open image-reference instruction.** The screenplay is unchanged. Shot numbers, frame IDs and asset paths remain stable. The scope is scenes 1–2: shots **1–28 plus 280–282**, 31 images total.

## What actually happened

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
2. Run `node scripts/neonoire/pass-prompts.mjs --cold-open-fresh` for the **21 ungenerated** self-contained text briefs. This queue deliberately ignores whether a legacy JPEG already exists.
3. `scripts/neonoire/cold-open-fresh.mjs` is the active rule, beat, generated-set and caveat source. It supplies **no image references**, including no freshly generated images as attachments in this text-only approach. Its briefs are continuation instructions; not verbatim transcripts of the first ten tool calls.
4. The same module also has briefs for correcting generated shots. In particular, 4/5/7/8/9 must not be mistaken for approved assets merely because their numbers are in the generated set.
5. Generate, inspect individually at full size, crop-read prop text if needed, record faults honestly. Update the generated set only after a real output is installed.
6. Rebuild project, run verification, update provenance and review sheet. Do not change screenplay text to accommodate a faulty image.

## Integration and checks

- Builder replaces old reference/provenance notes for **all 31** cold-open frames; it does not concatenate the old image guidance into fresh prompts.
- Dedicated fresh-only mood board separates new work from pending legacy images. The full-sequence mood board says it is a mixed pass.
- Historical board documents and `cold-open-look.mjs` carry prominent supersession notices.
- Verification checks the 31-shot scope, ten generated / 21 pending split, explicit no-reference instructions, image dimensions, named caveats, unapproved status, and key screenplay beats.
- The screenplay and all images outside shots 1–9 and 19 are unchanged.

Validation completed: `npm run verify:neonoire`, `npm run typecheck`,
`node scripts/neonoire/build-project.mjs --check`, and `git diff --check` all pass.
These are integration/provenance checks, **not visual approval**.
