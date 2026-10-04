// THE 4 OCTOBER 2026 RELIEF SLOTS — the first ten new frames on the board after the 3 October
// rewrite passes closed the film at 343.
//
// With `RETAKE PENDING` empty and every numbered keyframe on disk, the next shots on the board
// were the ones the voiced animatic showed the film needed (docs/neonoire/shots-needed.md,
// 30 September 2026 — "Nothing here is generated, boarded or approved") plus the two unboarded
// beats the 4 October retake round recorded as coverage observations: the INTERCUT half of scene
// 59 (Mrs. Sakai's empty house) and scene 94's door closing.
//
// Relief pass one, 4 October 2026 — ten generations, ten frames, nothing replaced:
//   * 344–347 board the INTERCUT to Mrs. Sakai's empty house (scene 59) in the page's own order —
//     the kotatsu (the television on with the sound off rides inside it), the altar, the teacup
//     on its side, the phone ringing — all 35mm across the cut, on the scene's own grammar,
//     played before 228, held to the scene 29 house with every person removed.
//   * 348 boards scene 94's door — the last beat of the scene, the hinge between 142 and 143,
//     50mm at the door on the scene's lens plan.
//   * 349–353 take the head of the animatic's long-talking-scenes table in screenplay order,
//     one new frame per board: 349 Vera on the wall of drawings (s14, 270's 42 s), 350 Kaneko's
//     bowl (s17, 189's 46 s), 351 the storeroom bulb (s20, 194's 55 s), 352 Jack making himself
//     smaller (s20, 284's 40 s), 353 Vera's single (s22, 197's 64 s).
//
// Still queued after this pass (the next pass takes them first, in the table's order): scene 23's
// 199 "You never call" (95 s — the longest single board in the film; the list wants five or six
// shots), then scene 25's 202 and 258, scene 27A's 292 and scene 29's 273, then the rest of the
// table, the below-30 s list, the song (74–77), the rewrite-changed frames (64, 36, 70) and the
// title/credit cards.
//
// Numbering rule unchanged: nothing is renumbered; the ten frames join the end of the run as
// 344–353 and keep those numbers forever. A number enters `reliefSlotsDelivered` only when its
// JPEG is installed at the board's stable asset path, centre-cropped to exact 16:9 and resized to
// 1920×1080 by scripts/neonoire/fresh-install.mjs. Nothing in this pass replaced an existing
// image, so nothing was backed up.
export const reliefSlots = Array.from({ length: 353 - 344 + 1 }, (_, index) => 344 + index);

export const reliefSlotsDelivered = [344, 345, 346, 347, 348, 349, 350, 351, 352, 353];

export const reliefSlotsQueued = reliefSlots.filter(n => !reliefSlotsDelivered.includes(n));

export const reliefSlotsLook =
  "Relief pass one (4 October 2026) — the first ten frames of the voiced-animatic coverage list (docs/neonoire/shots-needed.md, 30 September 2026) plus the two unboarded beats the 4 October retake round recorded as coverage observations: scene 59's INTERCUT to Mrs. Sakai's empty house (344–347, held to the scene 29 house with the people removed, the television on and never static) and scene 94's door closing (348, the hinge between 142 and 143). 349–353 are one new frame per long-talking board, in screenplay order. Generated in screenplay order with each scene's masters and the cast sheets attached; nothing was replaced, so nothing was backed up. Reviewed at full size before install; the caveats are honest and unclosed.";
