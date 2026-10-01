# Nobody’s Witness — full-page revision audit and restoration

**1 October 2026.** Prior image/order/animatic work was committed first as **8bfa455**. This pass corrects the unintended losses without reinstating cut scene numbers or undoing deliberate rewrites.

## Sources actually checked

- The complete last pre-revision Fountain: GitHub commit `24ff4d9bd1b58339d310c35daf59c6a37ef08d36`, 29 September 2026, **106 scenes**, saved unchanged as [the pre-revision baseline](../baseline/Neonoire_PreRevision_2026-09-29.fountain). SHA-256: `13947ff97d63e4bb26084368b4fa6374d032ae031dd0a2cbc608cf0b214ac265`.
- The complete script shipped with this session’s first commit, saved as [the pre-restoration baseline](../baseline/Neonoire_PreRestoration_2026-10-01.fountain).
- All 19 pages of `NEONOIRE — Revision Pages.pdf`, plus the two complete original screenplay PDFs (90 and 87 pages) and Draft 1. PDF scratch extraction is ignored under `artifacts/revision-repair/`.

The revision PDF itself distinguishes **8 whole-scene rewrites, 31 limited revisions and 4 cuts**. “Revised” and truncated “…” text are not permission to replace the remainder of a full page. The old handoff’s larger edit count/“verbatim” claim was not an adequate preservation audit.

## Corrections

| Scene | Result |
| --- | --- |
| **99A** | One scene now opens **weeks later** with the complete demolition from old 99: excavators, rooms open to the air, wallpaper/calendar/mirror/height marks, residents watching and Kaneko holding the old sign. Added the requested standing counter and **six old stools in a row**. **DISSOLVE TO** the existing clean plaza **months later**. Scene 99 remains absent; 99A is the one scene. |
| **15** | The full dense/self-built/forgotten-by-the-city introduction was **already present**. Kept it and the eleven-storey/rear-wing canon. Did not duplicate the obsolete “we don’t see it whole yet” line from 13 inside the establishing wide. |
| **17** | Kaneko looks at the **empty third stool**, not an impossible view of the street hoarding. Added her lost first-appearance age/tiny/sharp-eyed description. The fourth/third-stool relationship and dialogue remain. |
| **25** | Kaneko brings the bowl of rice; restored **“Eat.” / “Thank you. Has anyone… come? Asking?” / “Nobody comes here who isn’t lost.”** She leaves; the same bowl goes cold in Mara’s lap. This plants the rice balls and invitation in 68. |
| **40** | Introduced **MASKED LEADER (40s)** in his plain dark suit at the inn. His face stays masked; no unmasked shot was invented. |
| **51** | Restored the three-sided glass office and Tokyo below in the rain **“like a circuit board.”** The model-removal scene remains wordless; Ishida is not put back in the room. |
| **83** | Restored Kurose’s first in-person description: seventies, silver hair, beautiful suit, the stillness of someone who never hurries. Kept the revised replies, photocopy/right-of-reply chain, cash envelope, wide staging and model departure. |
| **94** | Restored only **“It’s only tea.”**, spoken from inside as the cup is offered. The deliberately removed twenty-years-service conversation and “You were always very careful” are not reinstated. |
| **98** | Moved **SUPER: “FIVE DAYS LATER”** here. Otherwise the whole pre-revision scene remains, plus exactly the three statement lines after the licence exchange. This includes the earlier drawings conversation, stopping rain, clip/broken laugh, “I couldn’t say anything in the rain,” lighter, six-o’clock invitation and trains. |
| **100** | Kept the intentional television/Jack-on-second/Vera-on-third/too-much-money ending. Restored compatible details lost in replacement: the warm bulb, old hand-painted sign and Vera’s red bird clip. The six new stools now answer the old ones in 99A. Did **not** restore the superseded ambiguous doorway/second-bowl ending. |

### Additional contradiction found

Scene 25 still said Sakai walked away from Mara and quoted **“Your father. It was not what they say.”** The revised scene 1 deliberately removed that speech and stages him stopping, then pressing the key into her hand. Mara’s recollection now matches the visible action and **“Don’t let them have it.”** Restoring the old father speech in 1 would undo a deliberate revision, so it was not done.

## Full-page preservation checks

- **85, 87, 91, 92:** byte-identical scene bodies to the complete pre-revision source. The train covers their ladder descent in **91**, with the passengers and empty-ladder ending intact. 92 still begins at the ladder’s foot.
- **86, 88, 90:** removing only the worksheet’s added Vera-leading passages reproduces the full prior bodies byte for byte. Nothing else was removed.
- **89:** checked against the full old page. It had **no train**. Its old residents’ noise chorus/torch doorway belongs to the intentionally replaced stairwell version; the revised unlit lighter/hand-leading setup remains, and the old-woman doorway is explicitly in 90. No roof jump or railway-walkway route was reintroduced.
- **98:** removing only the statement exchange and relocated title card reproduces the full prior rooftop body byte for byte. The drawings dialogue was already in the full pre-revision page; it was not an accidental extra from the worksheet.
- **1/2:** the full rewrites and retained six-stool/amber-bottles/CRT room description in 2 are preserved. No knowingly cut father speech or old purse/escape choreography was restored.
- **59:** the payphone/intercut/empty widow’s room is a whole-scene rewrite. Its omitted hug/high-place description is deliberate, not clipped text to paste back.
- **11/36:** the director’s later agreed compromise is preserved: both Ishida lines in 11, the coast/inn/pink-phone reply and Vera’s near-laugh in 36.
- **29:** checked the complete speech and receipt handling. The specified replacement (“Even after he left, the receipts kept coming here”) and Kato/Ueno/114 evidence remain. The former “I thought it was a woman” belongs to the replaced speech; it was not silently treated as a retained ellipsis.
- **97:** the full source showed the ceremony/news/prosecutors, **not a separate Hive-emptying passage**. Its statement dialogue remains in 98 and television outcome in 100. The exposed empty rooms in restored 99A supply the decline image without inventing another time stage.

## Boards, saved workspace and sound

- **299 active cards, 299 installed images, 102 scenes.** Original demolition cards **158/159** now belong to **99A**, before **305/306/307**. Original IDs, production numbers and `/images/neonoire/s99/156-cut-open.jpg` / `157-the-sign.jpg` paths are retained. 305 is labelled **Dissolve**. No new images were generated and none of the previously selected main images was demoted.
- Boards, scene metadata and generated screenplay pages follow the corrected Fountain. The full draft still rebuilds byte for byte from its pages.
- Checksum-guarded saved-template refresh installs the known script correction and inserts the restored cards into complete old templates. Custom scripts/images/notes and deliberate deletions are not overwritten or guessed away.
- Reused the **three original recorded takes** of the scene-13 exchange in 25, keeping voices and audio bytes. Sequenced the master’s lines in script order; the old two-pass offsets overlapped.
- Archived, rather than deleted, the stale recorded father recollection. **Two short passages are unrecorded:** Mara’s corrected recollection and Kurose’s restored tea line. This script pass does not generate replacement voices or pretend the old takes say the new words. Active manifest: **333 takes**; every audio file is preserved.

## Regression

`npm run verify:revision:neonoire` protects the complete-page comparisons, the one-scene demolition/plaza order, introductions/bonding, statement/title card, train, intentional wordless choices, saved-template safety and recovered voice timing.

`build:neonoire`, `verify:neonoire`, `verify:shot-order`, `verify:animatic`, `verify:features`, `check:assets`, typecheck and production build pass. Asset check: **905/905** references present. Final lint, related-project regression and commit are recorded in the handoff.
