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
// the boards and in docs/neonoire/passes/rewrite-slots-1-2026-10-03.md.
//
// Pass 2, 3 October 2026 — ten more, in order again: scene 1's remaining three (331 the refusal,
// 332 the sedan broadside across the lane mouth with its high beams down it, 333 the white light)
// and scene 14A's first six (334 the mirror with the red bird clip, 335 the lane mouth with the
// lights going out behind, 336 the open unlit lighter, 337 the scene's master through the
// windscreen, 338 the rice ball she does not eat, 339 not running from you). 336's first study came
// back portrait and was retaken the same session in landscape. Ledger:
// docs/neonoire/passes/rewrite-slots-2-2026-10-03.md. Still queued, in order: 340 (the shuttered
// door — the watcher at the bar's handle) and 341–343, the rest of scene 14A.
//
// Pass 3, 3 October 2026 — the interviews the briefs could not settle were decided on the scene's own
// logic, and the decisions are logged in the ledger and the handoff:
//   * 331 was retaken again: the first pass-2 study carried a SECOND elderly man down the lane and the
//     second came back with the subject's face smeared by motion blur; the third study — the one on the
//     board — is a single figure, sharp, mid-turn from the doorway.
//   * 336 was retaken: the study's car read as a small SUV where this scene locks a boxy MAROON
//     hatchback; the retake is the maroon boxy hatchback the script says she drives.
//   * 337's retake was THROWN AWAY: it invented red paper lanterns along a lane whose canon has none,
//     and the darker grade hid the clip. The 14A master delivered in pass 2 stands.
//   * 339 was retaken so that Vera TURNS TO LOOK AT JACK, which is the scene's beat — the pass-2 study
//     left her gaze on the lane, which read from his side only.
//   * 338 was retaken with the wrapper peeled back so the rice ball is genuinely opened and uneaten.
//   * 340 (the watcher under the black umbrella at the bar's shuttered handle) and 341 (the arm
//     across her, the umbrella turning to the car) and 342 (the plate written on the flattened paper
//     bag, 56-19) are the pass's new frames.
//   * 343 was generated and NOT installed: the study put the following grey sedan nose-on to the
//     camera, so the frame contradicted itself — a follower driving the same way cannot face us while
//     the car ahead shows its tail lights. The slot stays an honest placeholder with the direction
//     spelled out in the board, and the study is recorded, not installed.

//
// Pass 4, 3 October 2026 — the film's last frame, 343, generated to the geometry the board fixes: the
// camera behind BOTH cars, the following silver-grey sedan seen from behind (its boot, its rear window,
// a small forward glow from its dipped lamps) and the small maroon hatchback far ahead showing its tail
// lights, forty metres of shining wet asphalt between them. The first study took the follower nose-on
// and was never installed. The rewrite-slot queue is now EMPTY: every numbered keyframe of the film is
// on disk. 8 and 11, 249, 272, 274, 280-282 and 304 stay retired where the revisions left them.

export const rewriteSlots = Array.from({ length: 343 - 321 + 1 }, (_, index) => 321 + index);

export const rewriteSlotsDelivered = [321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343];

export const rewriteSlotsQueued = rewriteSlots.filter(n => !rewriteSlotsDelivered.includes(n));

export const rewriteSlotsLook =
  "Generated in screenplay order with references attached: the interview frames on the room master s6/51-the-interview-room.jpg, the blocking master s6/56-three-days-ago.jpg, the retaken 62 and the Vera, Vera-face, Ishida and Mara-face sheets; the cold-open frames on the character sheets only (sheets/mara.jpg, sheets/mara-face.jpg), per the 30 September 2026 fresh-pass rule — no scene master, no layout sheet and no earlier frame attached. Every frame delivered 16:9 full-bleed 1920×1080, no captions, subtitles, watermarks or legible brand names. Reviewed at full size before install; the caveats below are honest and unclosed.";
