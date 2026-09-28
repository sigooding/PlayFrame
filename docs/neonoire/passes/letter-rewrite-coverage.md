# NEONOIRE — the letter rewrite coverage: Sakai chose Mara (28 September 2026)

**Scope:** seven new shots, IDs `neonoire-shot-280` … `286`, plus an **in-place retake of shot 7** and a **new prop master** `props/sakai-letter.jpg`, all for the director's same-day patch of the draft ("Sakai chose Mara — the letter rewrite"). Nothing in 1–279 was renumbered; no other existing image was regenerated. Ten generations were spent: one prop master, seven coverage frames, and one retake after shot 286's first generation threw a third hand into frame. Every frame was reviewed at full size before install; every remaining flaw is logged below.

Review sheet: [letter-rewrite-coverage.jpg](../../../public/images/neonoire/reviews/letter-rewrite-coverage.jpg).

| Shot | ID | Image | Held to |
| --- | --- | --- | --- |
| 7 FULL 50mm — the flicker (retake in place) | neonoire-shot-7 | `s1/07-old-man.jpg` | `s1/01-backstreet.jpg`, `s1/05-phone-off.jpg`, `sheets/mara.jpg` |
| 280 MEDIUM CLOSE-UP 50mm — one o'clock | neonoire-shot-280 | `s1/280-one-oclock.jpg` | `s1/05-phone-off.jpg`, `s1/03-mara-walks.jpg`, `sheets/mara.jpg` |
| 281 POV 35mm — the bar sign | neonoire-shot-281 | `s1/281-the-bar-sign.jpg` | `s1/01-backstreet.jpg` |
| 282 TWO-SHOT 85mm — Mr. Sakai? | neonoire-shot-282 | `s1/282-mr-sakai.jpg` | `s1/14-she-kneels.jpg`, `s1/07-old-man.jpg` |
| 283 INSERT 85mm — the letter | neonoire-shot-283 | `s18/283-the-letter.jpg` | `s10/164-depends-whos-calling.jpg`, `s77/85-the-desk-lamp.jpg`, `props/sakai-letter.jpg` |
| 284 MEDIUM CLOSE-UP 85mm — a coward, hiding | neonoire-shot-284 | `s20/284-i-called-her-a-coward.jpg` | `s13/179-eat.jpg`, `sheets/mara-hiding.jpg` |
| 285 MEDIUM 50mm — the inside pocket | neonoire-shot-285 | `s22/285-the-inside-pocket.jpg` | `s22/195-somewhere-like-this.jpg`, `sheets/jack.jpg` |
| 286 INSERT 85mm — smoothed flat | neonoire-shot-286 | `s79/286-smoothed-flat.jpg` | `s79/91-grey-light.jpg`, `sheets/vera-look-b.jpg`, `props/sakai-letter.jpg` |

## Locks

- **Prop master** `props/sakai-letter.jpg`: cheap cream lined paper, "Miss Voss." and "Your father did not kill himself." legible, the body laborious cursive **texture-only per the shot-94 rule**, signed T. SAKAI; the envelope addressed VERA VOSS. Shots 283 and 286 were generated against it so the sheet matches in both scenes.
- **7** same camera, same street, same wardrobe as the first boarding; the old man's eyes now find Mara in the doorway — a flicker — and look away at once, walking faster toward the bar sign. Mara reads in the doorway as in the draft.
- **280** the folded scrap carries the time **1:00** in her own handwriting, legible at full size; Mara keeps the soaked denim, the red enamel bird clip and the dark-brown handbag strap of `s1/03`.
- **281** the street master's geometry — barbershop recess and pole left, vending machine right — with the small lit BAR sign the only new light at the far end; no people in frame.
- **282** low on the wet asphalt, his face turned up to hers; his translucent raincoat and her soaked denim carry from `s1/14`; distant and non-graphic — no blood, no weapons in frame.
- **283** the green-shaded brass lamp is ON for this one beat only — the rewrite has Jack unfold the letter "under the lamp", superseding the lamp-off rule of 164/191 for this frame; the black rotary and the worn desk follow the office masters.
- **284** the hiding look from `sheets/mara-hiding.jpg`: borrowed brown cardigan, unwashed loose hair, **no bird clip** (the clip is with Jack by now, shot 194); bare bulb and flour sacks as in the storeroom masters.
- **285** the brick arch, the faded menus and the warm bulb at the end follow `s22/195`; Jack's hand rests flat on his chest over the inside pocket of the coat, and he does not move to touch it; a thick white cup on its saucer at the frame edge.
- **286** Vera's two hands — and only her two hands — hold the sheet open beside **exactly two empty ivory cups**, wine-red silk sleeve at the wrist, grey dawn window light only, per `s79/91` and Look B.

## Caveats

- **7 / 280 / 281 / 282** the barber pole reads **slightly lit** in all four street frames, where the street master keeps it unlit — dress it dark on set.
- **280** at this angle the scrap shows the time only; the address sits on the fold. Carry on set as written.
- **283** the hands holding the letter read older than Jack's 48 from this angle; the face never meets the letter in this frame.
- **285** Jack's face reads a shade older than 48 in this light.
- **286** first generation threw a third hand into frame; it was rejected and retaken. The retake passed the two-hands, two-cups check.

## Also in this pass

- `EXPECTED_SHOTS` moved 279 → 286 in `scripts/verify-neonoire.mjs`; new note-lock blocks for 280–282 (`letterS1`) and 280–286 (`letterRewrite`), the shot-7 retake note locked, and `sakai-letter` added to the prop-master dimension list. The final-coverage lock (270–279), the dawn group and the cold-open group now filter coverage out (`shotNo ≤ 279`, `≤ 95`, `≤ 28` respectively).
- `scripts/neonoire/build-project.mjs`: coverage frames (shot.n > 240) get their own image note instead of falling into a dated first-boarding boilerplate, and the cold-open "Needs review" status plus the REVISION-PENDING note are guarded to primary shots only, so scene 1's coverage never wears the legacy cold-open note.
- Boards: `n01-backstreet.md` carries the shot-7 retake note and the coverage block 280–282; `n18`, `n20`, `n22`, `n79` each gain a coverage block (283, 284, 285, 286); the `plan.mjs` scene descriptions name the appended coverage and the retake.
- Review sheet: `npm run review:neonoire -- reviews/letter-rewrite-coverage.jpg s1 s18 s20 s22 s79`.
