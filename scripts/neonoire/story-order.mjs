// Running order and production numbering are different: coverage is numbered when it is boarded,
// but plays where its quoted beat occurs in its OWN scene of the current screenplay.
import { featureScenes, parseBoard, readBoard, readFountain } from "./plan.mjs";

const normalise = text => text.replace(/\s+/g, " ").trim();

/** Map of frame id -> offset of its script quote in the whitespace-normalised draft. */
export function storyPositions(root) {
  const fountain = readFountain(root);
  const lines = fountain.split("\n");
  const scenes = featureScenes(fountain);
  const positions = new Map();
  for (const [index, scene] of scenes.entries()) {
    if (!scene.board) continue;
    const end = scenes[index + 1]?.line ?? lines.length;
    const block = normalise(lines.slice(scene.line, end).join("\n"));
    const start = lines.slice(0, scene.line).join("\n").replace(/\s+/g, " ").length;
    for (const shot of parseBoard(readBoard(root, scene), scene)) {
      const quote = normalise(shot.script || "");
      // A repeated line in another scene ("There was no car", "He drinks", etc.) must never
      // pull a shot to that other scene's position. Empty/unmatched quotes go last, not first.
      const at = quote ? block.indexOf(quote) : -1;
      positions.set(shot.id, at < 0 ? -1 : start + at);
    }
  }
  return positions;
}

/** Scenes in project order; shots in each scene at the beat they cover, with board number as tie-break. */
export function inStoryOrder(frames, scenes, root) {
  const positions = storyPositions(root);
  const sceneRank = new Map(scenes.map((scene, index) => [scene.id, index]));
  const numbers = new Map(featureScenes(readFountain(root)).filter(scene => scene.board)
    .flatMap(scene => parseBoard(readBoard(root, scene), scene).map(shot => [shot.id, shot.n])));
  const position = frame => {
    const at = positions.get(frame.id);
    return at === undefined || at < 0 ? Number.MAX_SAFE_INTEGER : at;
  };
  return [...frames].sort((a, b) =>
    (sceneRank.get(a.sceneId) ?? scenes.length) - (sceneRank.get(b.sceneId) ?? scenes.length)
    || position(a) - position(b)
    || (a.shotNumber ?? numbers.get(a.id) ?? 0) - (b.shotNumber ?? numbers.get(b.id) ?? 0));
}
