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
export const remainingBoardsCompleted = [303, 308, 315, 316, 317, 318, 319, 309, 312, 305, 306, 307];

// The boards queued behind batch 2 — carried in the boards, the pass briefs and the handoff so the
// next session starts where this one stopped. 313 stays here as the re-composition: its first call
// was refused by the image service's content moderation, and the second study landed the right place
// with no figures in frame but the drawings themselves unreadable at size, so it is re-composed again
// (the drawings the subject, close enough for the pencil counters and the viaduct to be read).
export const remainingBoardsQueued = [
  { n: 313, file: "s71/313-drawings-in-the-water.jpg", note: "re-composed again — the drawings must be legible at size; no figures in frame" },
  { n: 310, file: "s51/310-the-model-at-dawn.jpg", note: "the fortieth floor at dawn, the patched block in the model" },
  { n: 311, file: "s51/311-the-hand-on-the-model.jpg", note: "the hand, the watch and the Hive block on the tray" },
  { n: 314, file: "s75/314-the-empty-crossing.jpg", note: "the empty crossing — the one still that breaks the film's rule on purpose" },
  { n: 320, file: "s100/320-the-news-nobody-watches.jpg", note: "the news nobody watches, above Kaneko's new counter" },
  { n: 298, file: "s53a/298-there-was-no-car.jpg", note: "two women, one photograph, and a car that was never there" },
  { n: 299, file: "s53a/299-the-card-on-the-desk.jpg", note: "Kondo's card, the written number, the photograph face up" },
  { n: 300, file: "s82a/300-at-the-edge-of-the-newsroom.jpg", note: "Vera at the edge of the newsroom, Jack behind the glass" },
  { n: 302, file: "s82a/302-the-copies.jpg", note: "the warm folder handed over — the copies, not the original" },
];
