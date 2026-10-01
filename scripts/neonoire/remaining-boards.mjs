// THE REMAINING BOARDS — the twenty keyframes still to generate after the 30 September 2026
// revision and story pass 2, and the frames of them already installed.
//
// Two blocks of work are gathered here because both are generated under one rule, the cold-open
// fresh pass's rule: the screenplay text and the CHARACTER SHEETS are the only image references —
// no scene masters, no earlier frame, no layout sheet. Sixteen come from the revision
// (308–320: the seven named close-ups, the rewritten scene 51 pair, the moved voicemail, the
// dawn model, the dried stack, the corridor notebook, the plaza and the counter's television) and
// four are the story-pass-2 studies the last session's ten calls could not reach (298, 299, 300,
// 302, 303, 306, 307 — of which the plaza pair 306–307 were re-pinned by the revision).
//
// The builder and the verifier both read `remainingBoardsCompleted`: a number enters it only when
// the JPEG is installed at its stable asset path, centre-cropped to exact 16:9 and resized to
// 1920×1080 by scripts/neonoire/fresh-install.mjs — never stretched, never cropped from a legacy
// study. A frame not in the list and not on disk stays an honest placeholder naming its file.
export const remainingBoardsLook =
  "Generated under the cold-open fresh pass's rules (30 September 2026): the screenplay text and the CHARACTER SHEETS are the only image references — no scene masters, no earlier frame, no bar or layout sheet attached; the boards' own camera, lens and lighting lines are followed, and every frame is delivered 16:9 full-bleed 1920×1080. No captions, no legible text beyond what the board names, no watermarks.";

// Board numbers whose JPEGs this pass has ACTUALLY installed at the stable asset path. Update only
// when the file under public/images/neonoire/ has been written by a fresh generation.
// Batch 1, 30 September 2026: 303, 308, 315, 316, 317, 318, 319.
// Batch 2, 30 September 2026: 309, 312, 305, 306, 307 — the two retakes and the plaza's three
// views, regenerated together so the sequence matches frame to frame.
// Batch 3, 1 October 2026: the nine missing studies; 311 required one in-session retake.
// 305 is a replacement, so this is 20 delivered formerly missing images plus that plaza retake.
export const remainingBoardsCompleted = [303, 308, 315, 316, 317, 318, 319, 309, 312, 305, 306, 307, 298, 299, 300, 302, 310, 311, 313, 314, 320];

// All missing-image slots are now delivered. The sixteen older rewrite-pending images are a
// separate retake queue in rewrite-pending.mjs; completion here does not approve those images.
export const remainingBoardsQueued = [];
