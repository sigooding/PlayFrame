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

// ---------------------------------------------------------------------------------------------
// Finding a scene inside the screenplay
//
// The script is a sequence of scene blocks, each opening with the episode line its source
// document carried ("EPISODE FOUR — SCENE 2") and its slugline. A scene is "in the screenplay"
// when one of those blocks is its own, so blocks are matched on the slugline as a whole rather
// than on the location as a substring: two scenes share "INT. THE SCOUT HUT", an outline's
// "INT. POLICE CAR" is not episode one's parked car, and a scene genuinely written down must
// never be reported as missing.
// ---------------------------------------------------------------------------------------------

const ORDINAL_EPISODES: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };

/** "Episode 4 — The old lady", "EPISODE FOUR — SCENE 5", "Episode One" → 4 / 4 / 1; anything else → null. */
export function episodeNumberOf(text: string): number | null {
  const m = /^\s*episode\s+([a-z]+|\d+)\b/i.exec(text || "");
  if (!m) return null;
  const token = m[1].toLowerCase();
  return /^\d+$/.test(token) ? Number(token) : ORDINAL_EPISODES[token] ?? null;
}

/** Sluglines compare loosely: any dash, any spacing, any case — the same rule the episode export uses. */
export const normaliseSlugline = (text: string) => (text || "").replace(/[\u2012-\u2015]/g, "-").replace(/\s+/g, " ").trim().toUpperCase();

/** The ways a scene can be written down: "LOCATION — TIME", and the location alone for a scene whose location already carries its time. */
export const sceneHeadings = (scene: Scene) => [normaliseSlugline(`${scene.location} — ${scene.time}`), normaliseSlugline(scene.location)];

const isBoundary = (char: string | undefined) => char === undefined || /[\s.,;:()\-]/.test(char);

/** True when `needle` appears in `haystack` as a whole word run, so "INT. POLICE CAR" does not fire inside "INT. POLICE CARS". */
function containsRun(haystack: string, needle: string) {
  if (!needle) return false;
  for (let at = haystack.indexOf(needle); at >= 0; at = haystack.indexOf(needle, at + 1)) {
    if (isBoundary(haystack[at - 1]) && isBoundary(haystack[at + needle.length])) return true;
  }
  return false;
}

export interface SceneInScript {
  sceneId: string;
  /** What the script calls this scene: its slugline, or the episode line when it carries no slugline. */
  heading: string;
  /** Character offsets of that heading inside the script — ready for `setSelectionRange`. */
  start: number;
  end: number;
  /** Character offsets of the whole scene, heading and shots together. */
  blockStart: number;
  blockEnd: number;
  /** True when the scene was found by a loose search rather than read as its own scene block. */
  approximate: boolean;
}

type ScriptBlock = { start: number; end: number; heading: string; headingStart: number; headingEnd: number; slugline: string; normalised: string; sluglineStart: number; sluglineEnd: number };

/**
 * A line that reads as a slugline: INT./EXT. at the start, or after a short "THE DOORSTEP — "
 * style label, which is how the episode-four sources head their later scenes.
 */
const SLUGLINE = /^(?:[A-Z0-9'’ .,&()/-]{2,40}—\s*)?(?:INT|EXT)[./]/;

/** One line's offsets, with the surrounding whitespace left outside the selection. */
function lineRange(lines: string[], offsets: number[], index: number) {
  const line = lines[index] ?? "";
  const start = (offsets[index] ?? 0) + (line.length - line.trimStart().length);
  return { start, end: start + line.trim().length };
}

/** Splits the script into one block per episode/scene source: the shape `npm run build:rapture` writes. */
function scriptBlocks(script: string): ScriptBlock[] {
  const lines = script.split("\n");
  const offsets: number[] = [];
  let at = 0;
  for (const line of lines) { offsets.push(at); at += line.length + 1; }
  const starts: number[] = [];
  lines.forEach((line, i) => {
    if (episodeNumberOf(line) === null) return;
    const previous = lines[i - 1];
    const titled = previous && previous.trim() && previous.trim() === previous.trim().toUpperCase() && !/^EPISODE\b/i.test(previous);
    starts.push(titled ? i - 1 : i);
  });
  return starts.map((from, k) => {
    const to = starts[k + 1] ?? lines.length;
    const block = lines.slice(from, to);
    const headingIndex = block.findIndex(line => episodeNumberOf(line) !== null);
    const slugIndex = block.findIndex((line, i) => i > headingIndex && SLUGLINE.test(line.trim()));
    const heading = (block[headingIndex] || "").trim();
    const slugline = slugIndex >= 0 ? block[slugIndex].trim() : "";
    const headingRange = lineRange(lines, offsets, from + Math.max(headingIndex, 0));
    const sluglineRange = slugIndex >= 0 ? lineRange(lines, offsets, from + slugIndex) : { start: 0, end: 0 };
    return {
      start: offsets[from] ?? 0,
      end: (offsets[to] ?? at) - 1,
      heading, headingStart: headingRange.start, headingEnd: headingRange.end,
      slugline, normalised: normaliseSlugline(slugline), sluglineStart: sluglineRange.start, sluglineEnd: sluglineRange.end,
    };
  });
}

/**
 * Every scene the screenplay actually carries, keyed by scene id.
 *
 * Blocks are claimed in three passes so the closest match always wins: the slugline exactly as
 * the scene writes it, then a slugline the scene's heading opens or closes (a source may add a
 * title, a sequence label or production prose), then — for scripts that are not one block per
 * source, such as an imported Fountain file — the first heading line that spells the scene out.
 * A block or line already claimed by another scene is never reused, which is what keeps two
 * scenes with the same location apart.
 */
export function scenesInScript(project: Pick<FilmProject, "scenes">, script: string): Map<string, SceneInScript> {
  const found = new Map<string, SceneInScript>();
  if (!script) return found;
  const blocks = scriptBlocks(script);
  const taken = new Set<number>();

  const claim = (scene: Scene, block: ScriptBlock, approximate: boolean) => {
    const hasSlugline = block.slugline.length > 0;
    found.set(scene.id, {
      sceneId: scene.id,
      heading: hasSlugline ? block.slugline : block.heading,
      start: hasSlugline ? block.sluglineStart : block.headingStart,
      end: hasSlugline ? block.sluglineEnd : block.headingEnd,
      blockStart: block.start,
      blockEnd: block.end,
      approximate,
    });
  };

  // 1. The scene's own slugline, as written.
  blocks.forEach((block, index) => {
    if (!block.normalised) return;
    const scene = project.scenes.find(candidate => !found.has(candidate.id) && sceneHeadings(candidate).includes(block.normalised));
    if (scene) { taken.add(index); claim(scene, block, false); }
  });

  // 2. A slugline the scene's own heading opens or closes. The location alone is deliberately not
  //    tried here: it is what makes an unboarded outline match a different episode's scene.
  blocks.forEach((block, index) => {
    if (!block.normalised || taken.has(index)) return;
    const candidates = project.scenes
      .filter(scene => !found.has(scene.id))
      .map(scene => ({ scene, heading: sceneHeadings(scene)[0] }))
      .filter(({ heading }) => heading && (
        (block.normalised.startsWith(heading) && isBoundary(block.normalised[heading.length])) ||
        (block.normalised.endsWith(heading) && isBoundary(block.normalised[block.normalised.length - heading.length - 1]))))
      .sort((a, b) => b.heading.length - a.heading.length);
    if (candidates[0]) { taken.add(index); claim(candidates[0].scene, block, false); }
  });

  // 3. Free text: an imported or hand-typed screenplay has no episode blocks, so fall back to the
  //    lines themselves — exact heading first, then the location as a whole word run.
  const lines = script.split("\n");
  const offsets: number[] = [];
  let at = 0;
  for (const line of lines) { offsets.push(at); at += line.length + 1; }
  const claimedLines = new Set<number>();
  blocks.forEach((block, index) => {
    if (!taken.has(index)) return;
    lines.forEach((_, i) => { if (offsets[i] >= block.start && offsets[i] <= block.end) claimedLines.add(i); });
  });
  const headingLine = (index: number) => {
    const line = lines[index];
    const indent = line.length - line.trimStart().length;
    const start = offsets[index] + indent;
    return { heading: line.trim(), start, end: offsets[index] + line.trimEnd().length };
  };
  for (const scene of project.scenes) {
    if (found.has(scene.id)) continue;
    const exact = lines.findIndex((line, i) => !claimedLines.has(i) && sceneHeadings(scene).includes(normaliseSlugline(line)));
    const loose = exact >= 0 ? exact : lines.findIndex((line, i) => !claimedLines.has(i) && containsRun(normaliseSlugline(line), normaliseSlugline(scene.location)));
    if (loose < 0) continue;
    claimedLines.add(loose);
    const { heading, start, end } = headingLine(loose);
    found.set(scene.id, { sceneId: scene.id, heading, start, end, blockStart: start, blockEnd: end, approximate: true });
  }

  return found;
}
