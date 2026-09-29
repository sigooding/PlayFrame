// Frames whose scene the script rewrote on 29 September 2026. Their old images stay on disk so the
// board keeps its shot numbers, but they show beats that no longer exist, so they are held at
// "Needs review" until they are regenerated to the new script.
export const rewritePending = new Set([
  "neonoire-shot-132", "neonoire-shot-133", "neonoire-shot-267", // scene 90: the roof and the gap, now "through the rooms"
  "neonoire-shot-134", "neonoire-shot-135", "neonoire-shot-136", // scene 91: the walkway, now "the fire ladder"
]);
export const rewritePendingNote = "RETAKE PENDING — the script rewrote this scene on 29 September 2026; the image on file shows a beat that no longer exists.";
