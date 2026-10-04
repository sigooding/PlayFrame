// THE 4 OCTOBER 2026 RELIEF SLOTS — the new frames on the board after the 3 October
// rewrite passes closed the film at 343, numbered after the two same-day long-hold passes'
// 344–363.
//
// With `RETAKE PENDING` empty and every numbered keyframe on disk, the next shots on the board
// were the ones the voiced animatic showed the film needed (docs/neonoire/shots-needed.md,
// 30 September 2026 — "Nothing here is generated, boarded or approved") plus the two unboarded
// beats the 4 October retake round recorded as coverage observations: the INTERCUT half of scene
// 59 (Mrs. Sakai's empty house) and scene 94's door closing.
//
// Relief pass one, 4 October 2026 — ten generations, five installed frames, five dropped in
// reconciliation, nothing replaced:
//   * 364–367 board the INTERCUT to Mrs. Sakai's empty house (scene 59) in the page's own order —
//     the kotatsu (the television on with the sound off rides inside it), the altar, the teacup
//     on its side, the phone ringing — all 35mm across the cut, on the scene's own grammar,
//     played before 228, held to the scene 29 house with every person removed.
//   * 368 boards scene 94's door — the last beat of the scene, the hinge between 142 and 143,
//     50mm at the door on the scene's lens plan.
//
// RECONCILIATION (4 October 2026, two rounds): this session generated against the run's free
// numbers, which were 344–353 when it started. Two same-day passes from parallel sessions landed
// on main ahead of this one and took every number it had been generating against:
//   * the long-hold pass took **344–353** for scenes 20, 22 and 23. Its 344 (Jack making himself
//     smaller) and 346 (the bulb) are the same two quoted beats this pass had generated for scene
//     20, and its 348 already carries scene 22's single beat — three studies dropped.
//   * the second long-hold pass took **354–363** for scenes 29, 17 and 14. Its 359
//     (`s17/359-eat-then-go.jpg`) and 361 (`s14/361-the-wall-of-drawings.jpg`) quote the very same
//     lines as this pass's scene 17 bowl and scene 14 wall studies — two more studies dropped.
// The five raw generations sit untouched in artifacts/neonoire/relief-2026-10-04/ (`351-raw`,
// `352-raw`, `353-raw`, `349-raw`, `350-raw`); the decisions are recorded in the pass ledger. The
// pass's five unique frames — the two unboarded script beats, which neither long-hold pass took —
// joined the end of the run at the next free numbers, **364–368**.
//
// Still queued after this pass (the next pass takes them first, in the table's order): scene 25's
// 202 and 258, scene 20's 284 and the clip single, scene 27A's 292 and 290, scene 11's 251,
// scene 36's 210, scene 10's 166, then the below-30 s list, the song (74–77), the
// rewrite-changed frames (64, 36, 70) and the title/credit cards. The 365 altar photograph's
// face-check retake (its photo reads younger and smiling than `s1/07-old-man.jpg`) rides the head
// of that queue.
//
// Numbering rule unchanged: nothing is renumbered; the five frames joined the end of the run as
// 364–368 and keep those numbers forever. A number enters `reliefSlotsDelivered` only when its
// JPEG is installed at the board's stable asset path, centre-cropped to exact 16:9 and resized to
// 1920×1080 by scripts/neonoire/fresh-install.mjs. Nothing in this pass replaced an existing
// image, so nothing was backed up.
export const reliefSlots = Array.from({ length: 368 - 364 + 1 }, (_, index) => 364 + index);

export const reliefSlotsDelivered = [364, 365, 366, 367, 368];

export const reliefSlotsQueued = reliefSlots.filter(n => !reliefSlotsDelivered.includes(n));

export const reliefSlotsLook =
  "Relief pass one (4 October 2026) — five new frames, 364–368, from the two unboarded beats the 4 October retake round recorded as coverage observations, which neither same-day long-hold pass took: scene 59's INTERCUT to Mrs. Sakai's empty house (364–367, held to the scene 29 house with the people removed, the television on and never static) and scene 94's door closing (368, the hinge between 142 and 143). Numbered after the same day's long-hold passes (344–353 and 354–363), whose beats made five of this pass's studies redundant; the dropped studies are recorded in the ledger. Generated with each scene's masters and the cast sheets attached; nothing was replaced, so nothing was backed up. Reviewed at full size before install; the caveats are honest and unclosed.";
