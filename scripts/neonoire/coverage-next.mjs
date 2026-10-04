// The second 4 October 2026 coverage pass follows shots 364–368 and adds the next eight numbered
// frames requested from the animatic/continuity queue. Existing images and production numbers stay
// untouched; the installed boundary is deliberately explicit so an unmade frame cannot masquerade
// as delivered.
export const coverageNextSlots = Array.from({ length: 8 }, (_, index) => 369 + index);
export const coverageNextSlotsDelivered = [369, 370, 371, 372, 373, 374, 375, 376];
export const coverageNextSlotsQueued = coverageNextSlots.filter(number => !coverageNextSlotsDelivered.includes(number));

export const coverageNextLook =
  "Coverage pass two (4 October 2026) — eight new frames, 369–376, after the first relief pass (364–368): scene 25's pencil drawing and the now-scripted 114 tag; scene 20's Mara single and red-bird clip on the closed sketchbook; scene 27A's Okada at the glass as Vera arrives and Vera reflected in the switched-off CRT; scene 11's receiver settling onto Jack's desk; and scene 36's matching Jack-side payphone intercut. No frame is renumbered or replaced. The corrected 375 desk-only retake is installed; the first 375 generation is retained only in the ignored review artifacts and is not a library alternate. All eight are full-bleed 1920×1080 studies, production approval pending.";
