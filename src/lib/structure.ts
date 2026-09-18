import { SCENE_KINDS, type Act, type FilmProject, type Scene, type SceneKind } from "./types";

export const sceneKinds: SceneKind[] = [...SCENE_KINDS];
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export const kindMeta: Record<SceneKind, { tone: string; note: string }> = {
  "Standard": { tone: "plain", note: "A regular scene" },
  "Cold open": { tone: "cold", note: "Before the titles, before Act I" },
  "Flashback": { tone: "flash", note: "Time moves backwards" },
  "Dream": { tone: "dream", note: "Interior, imagined" },
  "Montage": { tone: "montage", note: "Compressed time" },
  "Title card": { tone: "card", note: "On-screen text" },
  "Tag": { tone: "tag", note: "After the ending" },
};

export type SceneRef = { scene: Scene; index: number };
export type PartGroup = { key: string; title: string; description: string; scenes: SceneRef[] };
export type SceneGroup = {
  key: string;
  level: "cold" | "act" | "loose";
  title: string;
  subtitle?: string;
  description?: string;
  scenes: SceneRef[];
  parts: PartGroup[];
};

/**
 * Groups scenes the way a writer reads a script: cold open first, then each act
 * (with its sequences nested inside), then anything unassigned.
 */
export function groupScenes(project: Pick<FilmProject, "scenes" | "acts">): SceneGroup[] {
  const indexed: SceneRef[] = project.scenes.map((scene, index) => ({ scene, index }));
  const groups: SceneGroup[] = [];

  const cold = indexed.filter(x => x.scene.kind === "Cold open");
  if (cold.length) groups.push({ key: "__cold", level: "cold", title: "Cold open", subtitle: "Before the titles", description: "", scenes: cold, parts: [] });

  const claimed = new Set(cold.map(x => x.scene.id));
  project.acts.forEach((act: Act, ai) => {
    const mine = indexed.filter(x => x.scene.actId === act.id && !claimed.has(x.scene.id));
    mine.forEach(x => claimed.add(x.scene.id));
    const parts: PartGroup[] = (act.parts || []).map(part => ({
      key: part.id,
      title: part.title,
      description: part.description || "",
      scenes: mine.filter(x => x.scene.partId === part.id),
    })).filter(part => part.scenes.length > 0);
    const partIds = new Set((act.parts || []).map(p => p.id));
    const direct = mine.filter(x => !x.scene.partId || !partIds.has(x.scene.partId));
    if (!parts.length && !direct.length) return;
    groups.push({
      key: act.id,
      level: "act",
      title: act.title,
      subtitle: /^act\b/i.test(act.title) ? "" : `Act ${ROMAN[ai] || ai + 1}`,
      description: act.description || "",
      scenes: direct,
      parts,
    });
  });

  const rest = indexed.filter(x => !claimed.has(x.scene.id));
  if (rest.length) groups.push({ key: "__loose", level: project.acts.length ? "loose" : "act", title: project.acts.length ? "Unassigned scenes" : "Scenes", subtitle: "", description: "", scenes: rest, parts: [] });

  return groups;
}

/** All scene rows in render order, with the sequence headers they belong to. */
export type SceneRow = { kind: "header"; key: string; part: PartGroup } | { kind: "scene"; key: string; scene: Scene; index: number };

export function renderRows(group: SceneGroup): SceneRow[] {
  const rows: SceneRow[] = [];
  group.scenes.forEach(({ scene, index }) => rows.push({ kind: "scene", key: scene.id, scene, index }));
  for (const part of group.parts) { rows.push({ kind: "header", key: part.key, part }); part.scenes.forEach(({ scene, index }) => rows.push({ kind: "scene", key: scene.id, scene, index })); }
  return rows;
}

export function actOf(project: Pick<FilmProject, "acts">, scene: Scene): Act | undefined {
  return project.acts.find(a => a.id === scene.actId);
}

export function partOf(project: Pick<FilmProject, "acts">, scene: Scene) {
  if (!scene.partId) return undefined;
  for (const act of project.acts) { const part = (act.parts || []).find(p => p.id === scene.partId); if (part) return part; }
  return undefined;
}

export const kindOf = (scene: Scene): SceneKind => scene.kind || "Standard";
export const isNotableKind = (scene: Scene) => kindOf(scene) !== "Standard";
