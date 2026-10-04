// THE 4 OCTOBER 2026 RELIEF SLOTS — the new frames on the board after the 3 October
// rewrite passes closed the film at 343, numbered after the long-hold pass's 344–353.
//
// With `RETAKE PENDING` empty and every numbered keyframe on disk, the next shots on the board
// were the ones the voiced animatic showed the film needed (docs/neonoire/shots-needed.md,
// 30 September 2026 — "Nothing here is generated, boarded or approved") plus the two unboarded
// beats the 4 October retake round recorded as coverage observations: the INTERCUT half of scene
// 59 (Mrs. Sakai's empty house) and scene 94's door closing.
//
// Relief pass one, 4 October 2026 — ten generations, seven installed frames, nothing replaced:
//   * 354–357 board the INTERCUT to Mrs. Sakai's empty house (scene 59) in the page's own order —
//     the kotatsu (the television on with the sound off rides inside it), the altar, the teacup
//     on its side, the phone ringing — all 35mm across the cut, on the scene's own grammar,
//     played before 228, held to the scene 29 house with every person removed.
//   * 358 boards scene 94's door — the last beat of the scene, the hinge between 142 and 143,
//     50mm at the door on the scene's lens plan.
//   * 359–360 take the animatic's long-talking-scenes table in screenplay order, one new frame
//     per board: 359 Vera on the wall of drawings (s14, 270's 42 s), 360 Kaneko's bowl
//     (s17, 189's 46 s).
//
// RECONCILIATION (4 October 2026): the long-hold pass of the same day landed on main first and
// took the free numbers 344–353 for scenes 20, 22 and 23. Its 344 (Jack making himself smaller)
// and 346 (the bulb) are the same two beats this pass had generated for scene 20, and its 348
// (Vera's single) already carries scene 22's single beat, so those three studies were dropped
// from the board rather than duplicated — their raws stay in artifacts/neonoire/relief-2026-10-04/
// and the decision is recorded in the pass ledger. The pass's seven unique frames joined the end
// of the run at the next free numbers, 354–360.
//
// Still queued after this pass (the next pass takes them first, in the table's order): the rest of
// shots-needed.md's long-talking table beyond scenes 14, 17, 20, 22 and 23 (scene 25's 202 and
// 258, scene 27A's 292, scene 29's 273), the below-30 s list, the song (74–77), the
// rewrite-changed frames (64, 36, 70) and the title/credit cards. The 355 altar photograph's
// face-check retake (its photo reads younger and smiling than `s1/07-old-man.jpg`) rides the head
// of that queue.
//
// Numbering rule unchanged: nothing is renumbered; the seven frames joined the end of the run as
// 354–360 and keep those numbers forever. A number enters `reliefSlotsDelivered` only when its
// JPEG is installed at the board's stable asset path, centre-cropped to exact 16:9 and resized to
// 1920×1080 by scripts/neonoire/fresh-install.mjs. Nothing in this pass replaced an existing
// image, so nothing was backed up.
export const reliefSlots = Array.from({ length: 360 - 354 + 1 }, (_, index) => 354 + index);

export const reliefSlotsDelivered = [354, 355, 356, 357, 358, 359, 360];

export const reliefSlotsQueued = reliefSlots.filter(n => !reliefSlotsDelivered.includes(n));

export const reliefSlotsLook =
  "Relief pass one (4 October 2026) — seven new frames, 354–360, from the voiced-animatic coverage list (docs/neonoire/shots-needed.md, 30 September 2026) plus the two unboarded beats the 4 October retake round recorded as coverage observations: scene 59's INTERCUT to Mrs. Sakai's empty house (354–357, held to the scene 29 house with the people removed, the television on and never static) and scene 94's door closing (358, the hinge between 142 and 143). 359–360 are one new frame per long-talking board, in screenplay order. Numbered after the same day's long-hold pass (344–353), whose scene 20 and scene 22 beats made three of this pass's studies redundant; the dropped studies are recorded in the ledger. Generated with each scene's masters and the cast sheets attached; nothing was replaced, so nothing was backed up. Reviewed at full size before install; the caveats are honest and unclosed.";
