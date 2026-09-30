// Story order for frames. The bundle lists frames by shot number (coverage shots 241+ come after the
// first boarding, and the first boarding is numbered in boarding order), so playing it in array order
// would put an added shot at the end of its scene, not where it happens. The draft is the authority:
// each shot quotes the script line it covers, and a frame's place is where that line sits in the draft.
import { SCENES, containsText, parseBoard, readBoard, readFountain } from "./plan.mjs";

/** Map of frame id -> position in the draft (character offset of its script quote). */
export function storyPositions(root) {
  const draft = readFountain(root).replace(/\s+/g, " ");
  const positions = new Map();
  for (const scene of SCENES) {
    for (const shot of parseBoard(readBoard(root, scene), scene)) {
      const quote = (shot.script || "").replace(/\s+/g, " ").trim();
      const at = quote && containsText(draft, quote) ? draft.indexOf(quote) : -1;
      positions.set(shot.id, at);
    }
  }
  return positions;
}

/**
 * Frames in story order: scenes in the project's order, and within a scene by where each frame's script
 * quote sits in the draft (shot number breaks ties, and frames whose quote cannot be found keep their
 * numeric place at the end of the scene).
 */
export function inStoryOrder(frames, scenes, root) {
  const positions = storyPositions(root);
  const sceneRank = new Map(scenes.map((s, i) => [s.id, i]));
  const num = f => Number(/\d+$/.exec(f.id)?.[0]);
  return [...frames].sort((a, b) =>
    (sceneRank.get(a.sceneId) ?? 1e9) - (sceneRank.get(b.sceneId) ?? 1e9)
    || ((positions.get(a.id) ?? -1) < 0 ? 1e12 : positions.get(a.id)) - ((positions.get(b.id) ?? -1) < 0 ? 1e12 : positions.get(b.id))
    || num(a) - num(b));
}
