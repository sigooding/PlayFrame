// Shared by the CLI renderer and the web export tests. Playback order, not production-number order.
export function orderAnimaticFrames(project) {
  const rank = new Map(project.scenes.map((scene, i) => [scene.id, i]));
  return [...project.frames].sort((a, b) => (rank.get(a.sceneId) ?? project.scenes.length) - (rank.get(b.sceneId) ?? project.scenes.length));
}
export function animaticSceneTag(project, id) {
  const scene = project.scenes.find(s => s.id === id);
  return scene?.number || id.replace(/^neonoire-s/, "").toUpperCase();
}

// Never infer motion from notes: "no tracking" used to match "tracking" and alternate pan direction.
// A Static shot is actually static, even when optional camera simulation is enabled.
// Slow, centred push or pull only, eased at both ends. Sideways drift, handheld sway and tilts made the cut feel
// sick, so Pan, Track, Steadicam, Handheld and Tilt are all rendered as the same gentle push; Pull / Dolly out reverses it.
export function cameraMove(frame, duration) {
  const movement = String(frame.movement || "Static").toLowerCase();
  if (movement === "static") return null;
  const pull = /pull|dolly out/.test(movement);
  if (!pull && !/push|dolly|pan|track|steadicam|handheld|tilt|crane|zoom|move/.test(movement)) return null; // unrecognised: no fabricated motion
  const n = Math.max(1, Math.round(duration * 24)), t = `min(on/${n},1)`, p = `(${t}*${t}*(3-2*${t}))`; // smoothstep
  const maximum = Math.min(1.06, 1 + 0.008 * duration);
  const centre = { x: "iw/2-iw/zoom/2", y: "ih/2-ih/zoom/2" };
  return pull
    ? { z: `${maximum}-${maximum - 1}*${p}`, ...centre, kind: "pull" }
    : { z: `1+${maximum - 1}*${p}`, ...centre, kind: "push" };
}
