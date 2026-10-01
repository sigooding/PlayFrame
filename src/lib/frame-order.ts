import type { FilmProject, Scene, StoryFrame } from "./types";

/**
 * The screenplay's scene array is the running order (including inserted scenes such as 25A).
 * Keep the editor's chosen order inside each scene; never sort by an ID or an image filename.
 * Unknown/unassigned scenes stay at the end, in their existing order. The input is not mutated.
 */
export function framesInSceneOrder<T extends Pick<StoryFrame, "sceneId">>(frames: readonly T[], scenes: readonly Pick<Scene, "id">[]): T[] {
  const rank = new Map(scenes.map((scene, index) => [scene.id, index]));
  return [...frames].sort((a, b) => (rank.get(a.sceneId) ?? scenes.length) - (rank.get(b.sceneId) ?? scenes.length));
}

/** A production number is an identity, not the frame's current playback position. */
export const shotNumber = (frame: Pick<StoryFrame, "shotNumber">, index: number) => frame.shotNumber ?? index + 1;

/** Preserve the screenplay's labels and gaps; an unnumbered user scene uses its list position. */
export const sceneNumber = (scene: Pick<Scene, "number">, index: number) => scene.number || String(index + 1);

/** Reorder within a scene without allowing a drag to scramble the screenplay's scene order. */
export function reorderFrameInScene(project: Pick<FilmProject, "frames" | "scenes">, draggedId: string, targetId: string): StoryFrame[] {
  const frames = framesInSceneOrder(project.frames, project.scenes);
  const from = frames.findIndex(frame => frame.id === draggedId);
  const to = frames.findIndex(frame => frame.id === targetId);
  if (from < 0 || to < 0 || from === to || frames[from].sceneId !== frames[to].sceneId) return frames;
  const [moved] = frames.splice(from, 1);
  frames.splice(to, 0, moved);
  return frames;
}

/** Give additions to an already-numbered board a new production identity, never a copied number. */
export function nextShotNumber(frames: readonly Pick<StoryFrame, "shotNumber">[]): number | undefined {
  const numbered = frames.flatMap(frame => frame.shotNumber === undefined ? [] : [frame.shotNumber]);
  return numbered.length ? Math.max(...numbered) + 1 : undefined;
}
