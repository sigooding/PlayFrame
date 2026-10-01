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
export function cameraMove(frame, duration) {
  const movement = String(frame.movement || "Static").toLowerCase();
  if (movement === "static") return null;
  const n = Math.max(1, Math.round(duration * 24)), p = `min(on/${n},1)`;
  const centre = { x: "iw/2-iw/zoom/2", y: "ih/2-ih/zoom/2" };
  const maximum = Math.min(1.12, 1 + 0.014 * duration);
  if (/pull|dolly out/.test(movement)) return { z: `${maximum}-${maximum - 1}*${p}`, ...centre, kind: "pull" };
  if (/handheld/.test(movement)) return { z: "1.06+0.01*sin(on/9)", x: "iw/2-iw/zoom/2+sin(on/7)*7", y: "ih/2-ih/zoom/2+cos(on/11)*5", kind: "handheld" };
  if (/pan|track|steadicam/.test(movement)) return { z: "1.09", x: /left/.test(movement) ? `(iw-iw/zoom)*(1-${p})` : `(iw-iw/zoom)*${p}`, y: centre.y, kind: "track" };
  if (/tilt/.test(movement)) return { z: "1.09", x: centre.x, y: /up/.test(movement) ? `(ih-ih/zoom)*(1-${p})` : `(ih-ih/zoom)*${p}`, kind: "tilt" };
  if (/push|dolly in/.test(movement)) return { z: `1+${maximum - 1}*${p}`, ...centre, kind: "push" };
  // Unrecognised movement has no fabricated motion, either.
  return null;
}
