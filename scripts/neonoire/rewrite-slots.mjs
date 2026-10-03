// THE 2 OCTOBER 2026 SLOTS — the placeholder cards the day's rewrites opened, and the frames of
// them installed since.
//
// Three changes landed on 2 October 2026, none of them touching a number already on the board:
//
//   * Scene 6, the interview room, was rewritten to the director's text. It gained seven beats it
//     had never boarded — the form, her handwriting, the pen that stops, the passport photograph,
//     the photograph squared to the corner, the tea wiped away and the photograph into his pocket
//     (321–327).
//   * Scene 1, the cold open, went back to the walk and the lane. It gained six (328–333): the
//     scrap, the lane and her watch, the red clip, he refuses, the sedan that blocks the lane and
//     the old man in the white light.
//   * Scene 14A was inserted between 14 and 15 and boarded as ten more (334–343).
//
// So the three blocks run as one unbroken run, 321–343, and this module is the boundary the builder
// and the verifier both read: a number enters `rewriteSlotsDelivered` only when its JPEG is
// installed at the board's stable asset path, centre-cropped to exact 16:9 and resized to 1920×1080
// by scripts/neonoire/fresh-install.mjs — never stretched, never borrowed from a neighbour. A frame
// not in the list and not on disk stays an honest placeholder naming the file it awaits; a frame
// with an image and no entry here fails the verifier. Nothing is renumbered: 8, 11, 249, 272, 274,
// 280–282 and 304 stay retired where the revisions left them.
//
// Pass 1, 3 October 2026 — the session's ten generations. Seven went to the interview room, where
// the rewrite's closed circle wanted finishing frame by frame (321–327), and three to the cold
// open's first beats (328–330, the scrap, the lane and the watch, the red clip), in screenplay
// order. Every frame was reviewed at full size before install and every remaining flaw is logged in
// the boards and in docs/neonoire/passes/rewrite-slots-1-2026-10-03.md. Still queued for the next
// pass, in order: 331, 332, 333 (scene 1) and the ten of scene 14A, 334–343.
export const rewriteSlots = Array.from({ length: 343 - 321 + 1 }, (_, index) => 321 + index);

export const rewriteSlotsDelivered = [321, 322, 323, 324, 325, 326, 327, 328, 329, 330];

export const rewriteSlotsQueued = rewriteSlots.filter(n => !rewriteSlotsDelivered.includes(n));

export const rewriteSlotsLook =
  "Generated in screenplay order with references attached: the interview frames on the room master s6/51-the-interview-room.jpg, the blocking master s6/56-three-days-ago.jpg, the retaken 62 and the Vera, Vera-face, Ishida and Mara-face sheets; the cold-open frames on the character sheets only (sheets/mara.jpg, sheets/mara-face.jpg), per the 30 September 2026 fresh-pass rule — no scene master, no layout sheet and no earlier frame attached. Every frame delivered 16:9 full-bleed 1920×1080, no captions, subtitles, watermarks or legible brand names. Reviewed at full size before install; the caveats below are honest and unclosed.";
