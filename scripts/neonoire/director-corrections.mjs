// 1 October 2026 — the director explicitly selected these as main shots, with no review queue.
// Stable IDs, not display positions: the run's assets 69–72 are production boards 71–74.
export const directorApprovedMainIds = new Set([
  ...[298, 299, 300, 302, 310, 311, 313, 314, 320].map(n => `neonoire-shot-${n}`),
  ...[64, 65, 67, 69, 70, 71, 72, 77, 80].map(n => `neonoire-shot-${String(n).padStart(2, "0")}`),
]);
export const directorMainImageNote = "Image: AI-generated main shot. DIRECTOR APPROVED — 1 October 2026. Selected as the main image, status Ready; no further image review requested.";
export const directorContinuityLook = "Director correction, 1 October 2026: scene 7 uses the attached deep LOWEST drawer, with two closed shallow upper drawers; purse and coiled torn strap sealed together inside it. The running approach (scene 73, before scene 75's empty returns) progresses LEFT TO RIGHT: hotel behind, machine ahead, then machine behind, then crossing/one-shoe exit. Vera never circles back. RIGHT foot bare / LEFT red court shoe remains after the skid. Scene 75's machine return has no people. Static frames remain genuinely static in animatic playback/export.";
export const directorReplacementShots = [
  { id: "neonoire-shot-64", file: "s7/64-the-bottom-drawer.jpg", raw: "64-bottom-drawer-final.jpg" },
  { id: "neonoire-shot-65", file: "s7/65-the-evidence-bag.jpg", raw: "65-evidence-bag.jpg" },
  { id: "neonoire-shot-67", file: "s7/67-drawer-closed.jpg", raw: "67-drawer-closed.jpg" },
  { id: "neonoire-shot-69", file: "s73/69-vera-runs.jpg", raw: "69-hotel-exit.jpg" },
  { id: "neonoire-shot-70", file: "s73/70-not-elegantly-badly.jpg", raw: "70-approach-machine.jpg" },
  { id: "neonoire-shot-71", file: "s73/71-the-machine-glows.jpg", raw: "71-past-machine.jpg" },
  { id: "neonoire-shot-80", file: "s75/80-the-machine-waits.jpg", raw: "80-machine-still.jpg" },
];

// Only machine-authored approval/review boilerplate is removed. Historical evaluations remain
// in the pass ledger; they are no longer actionable flags on the director-selected images.
export function approvedProductionNote(note) {
  return note
    .replace(/Production approval pending\.?/gi, "")
    .replace(/continuity, framing and production approval pending[^\n]*/gi, "Director-selected main image.")
    .replace(/These remain AI-generated draft studies, not approved coverage\.?/gi, "Selected main images.")
    .replace(/All are AI-generated draft studies, not approved coverage\.?/gi, "Selected main images are director-approved.")
    .replace(/Draft, not production-approved\.?/gi, "Director-approved main image.")
    .replace(/Full-size review and honest caveats:[^\n]*/gi, "Selected as the main image by the director; no further review requested.")
    .trim();
}
