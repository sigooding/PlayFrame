import type { FilmProject, Scene, StoryFrame } from "./types";
import { angleDescriptions, hailuoCommands, movementDescriptions, shotGuide } from "./shots";
import { lightingGuide } from "./lighting";
import { relationLines } from "./relations";

export const PLATFORMS = [
  { id: "hailuo", name: "MiniMax Hailuo", hint: "Uses bracketed camera commands. One shot per generation, 6–10s." },
  { id: "seedance", name: "Seedance", hint: "Natural language. Supports multi-shot sequences in one prompt." },
  { id: "kling", name: "Kling", hint: "Prose prompt plus a negative prompt." },
  { id: "runway", name: "Runway Gen", hint: "Lead with camera movement, keep it direct, no negatives." },
  { id: "veo", name: "Google Veo", hint: "Prose with optional audio direction." },
  { id: "generic", name: "Universal", hint: "Full structured prompt that works almost anywhere." },
] as const;
export type PlatformId = (typeof PLATFORMS)[number]["id"];

const clean = (value?: string) => (value || "").replace(/\s+/g, " ").trim();
const sentence = (value: string) => { const v = clean(value).replace(/\.{2,}/g, "."); return v ? (/[.!?…]$/.test(v) ? v : `${v}.`) : ""; };

export function describeLocation(location: string) {
  const l = clean(location);
  const prefix = /^INT\.?\/EXT\.?/i.test(l) ? "interior and exterior" : /^INT/i.test(l) ? "interior" : /^EXT/i.test(l) ? "exterior" : "";
  const place = l.replace(/^(INT\.?\/EXT\.?|INT\.?|EXT\.?)\s*/i, "").toLowerCase();
  return prefix ? `${prefix}, ${place}` : place;
}

const timeOfDay = (time: string) => clean(time).toLowerCase();

function castLine(project: FilmProject, ids: string[] | undefined) {
  const people = (ids || []).map(id => project.characters.find(c => c.id === id)).filter(Boolean);
  if (!people.length) return "";
  return people.map(c => {
    const detail = [c!.age && `${c!.age}`, c!.traits.slice(0, 3).join(", ")].filter(Boolean).join(", ");
    const desc = clean(c!.description).split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/, "");
    return `${c!.name}${detail ? ` (${detail})` : ""}${desc ? ` — ${desc}` : ""}`;
  }).join("; ");
}

function styleLine(project: FilmProject, hasLighting = false) {
  const visual = project.notes.find(n => /visual|look|style|palette|cinematograph/i.test(`${n.title} ${(n.tags || []).join(" ")}`));
  const palette = visual ? clean(visual.content).split(/(?<=[.!?])\s/).slice(0, 2).join(" ").replace(/[.!?]+$/, "") : "";
  return `${project.genre.toLowerCase()} ${project.format.toLowerCase()}, cinematic realism,${hasLighting ? "" : " natural light,"} 35mm film grain, shallow depth of field${palette ? `. ${palette}` : ""}`;
}

export interface PromptContext { scene?: Scene; previous?: StoryFrame; next?: StoryFrame; index: number; total: number }

export function frameContext(project: FilmProject, frame: StoryFrame): PromptContext {
  const scene = project.scenes.find(s => s.id === frame.sceneId);
  const siblings = project.frames.filter(f => f.sceneId === frame.sceneId);
  const found = siblings.findIndex(f => f.id === frame.id);
  const isNew = found < 0;
  const index = isNew ? siblings.length : found;
  const previous = isNew ? siblings[siblings.length - 1] : (found > 0 ? siblings[found - 1] : undefined);
  const next = !isNew && found < siblings.length - 1 ? siblings[found + 1] : undefined;
  return { scene, previous, next, index, total: isNew ? siblings.length + 1 : siblings.length };
}

function parts(project: FilmProject, frame: StoryFrame, ctx: PromptContext) {
  const shot = `${shotGuide[frame.shotType]?.prompt || `${frame.shotType.toLowerCase()} shot`}${frame.angle && frame.angle !== "Eye level" ? `, ${angleDescriptions[frame.angle]}` : ""}${frame.lens ? `, ${frame.lens} lens` : ""}`;
  const camera = movementDescriptions[frame.movement] || frame.movement.toLowerCase();
  const setting = ctx.scene ? `${describeLocation(ctx.scene.location)} at ${timeOfDay(ctx.scene.time)}` : "";
  const light = frame.lighting
    ? lightingGuide[frame.lighting]?.prompt || `${frame.lighting.toLowerCase()} lighting`
    : (ctx.scene && /dawn|morning|sunset|dusk/i.test(ctx.scene.time) ? "soft golden natural light" : "natural lighting");
  const castIds = frame.characters?.length ? frame.characters : (ctx.scene?.characters || []);
  const cast = castLine(project, castIds);
  const relations = sentence(relationLines(project, castIds).join("; "));
  const action = [sentence(frame.description), ctx.scene && clean(ctx.scene.description) !== clean(frame.description) ? sentence(ctx.scene.description) : ""].filter(Boolean).join(" ");
  const mood = (clean(frame.mood) || (frame.notes ? clean(frame.notes).split(/(?<=[.!?])\s/)[0] : "")).replace(/[.!?]+$/, "");
  const transitionIn = frame.transition ? (ctx.previous ? `${frame.transition} from the previous shot (${ctx.previous.shotType.toLowerCase()} — “${ctx.previous.title}”)` : `Begins with a ${frame.transition.toLowerCase()}`) : (ctx.previous ? `Cut from previous shot (${ctx.previous.shotType.toLowerCase()} — “${ctx.previous.title}”)` : "");
  const transitionOut = ctx.next ? `${ctx.next.transition || "Cut"} to next shot: ${ctx.next.shotType.toLowerCase()} — “${ctx.next.title}”` : "Scene ends on this shot";
  return { shot, camera, setting, light, cast, relations, action, mood, transitionIn, transitionOut, style: styleLine(project, Boolean(frame.lighting)) };
}

export function buildFramePrompt(project: FilmProject, frame: StoryFrame, platform: PlatformId): string {
  const ctx = frameContext(project, frame);
  const p = parts(project, frame, ctx);
  const duration = `${frame.duration} second${frame.duration === 1 ? "" : "s"}`;
  const avoid = "text, captions, watermarks, logos, distorted faces, extra limbs, morphing";

  if (platform === "hailuo") {
    return [`${hailuoCommands[frame.movement] || "[Static shot]"} ${p.shot}. ${p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : ""}`, p.cast ? `Characters: ${p.cast}.` : "", p.relations, p.action, p.mood ? `Mood: ${sentence(p.mood)}` : "", `Style: ${p.style}. ${duration}, 16:9. No ${avoid}.`].filter(Boolean).join(" ");
  }
  if (platform === "runway") {
    return [`${p.camera[0].toUpperCase()}${p.camera.slice(1)}: ${p.shot} of ${p.cast ? p.cast.split(" (")[0] : "the subject"}${p.setting ? ` in ${p.setting}` : ""}.`, p.action, p.relations, `${p.light[0].toUpperCase()}${p.light.slice(1)}. ${p.style}.`].filter(Boolean).join(" ");
  }
  if (platform === "kling") {
    return [`${p.shot}, ${p.camera}. ${p.setting ? `Setting: ${p.setting}, ${p.light}.` : ""}`, p.cast ? `Subject: ${p.cast}.` : "", p.relations ? `Relation: ${p.relations}` : "", `Action: ${p.action}`, p.mood ? `Atmosphere: ${sentence(p.mood)}` : "", `Style: ${p.style}. Duration ${duration}, aspect ratio 16:9.`, "", `Negative prompt: ${avoid}, blurry, low quality, oversaturated, cartoon.`].join("\n").trim();
  }
  if (platform === "veo") {
    const audio = frame.notes && /ambien|sound|score|wind|silence|music/i.test(frame.notes) ? clean(frame.notes).split(/(?<=[.!?])\s/).find(s => /ambien|sound|score|wind|silence|music/i.test(s)) : "";
    return [`${p.shot}, ${p.camera}. ${p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : ""}`, p.cast ? `${p.cast}.` : "", p.relations, p.action, p.mood ? `The mood is ${p.mood.toLowerCase().replace(/\.$/, "")}.` : "", `Visual style: ${p.style}.`, `Audio: ${audio ? audio : "natural ambient sound of the location, no dialogue, no music"}.`, `${duration}, 16:9.`].filter(Boolean).join(" ");
  }
  if (platform === "seedance") {
    return [`Shot ${ctx.index + 1} of ${ctx.total} — ${duration}.`, `${p.shot}, ${p.camera}.`, p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : "", p.cast ? `${p.cast}.` : "", p.relations, p.action, p.mood ? `Mood: ${sentence(p.mood)}` : "", `${p.transitionIn ? sentence(p.transitionIn) + " " : ""}${sentence(p.transitionOut)}`, `Style: ${p.style}. 16:9. Avoid ${avoid}.`].filter(Boolean).join(" ");
  }
  // generic
  return [
    `SHOT: ${p.shot}.`,
    `CAMERA: ${p.camera}.`,
    p.setting ? `SETTING: ${p.setting}. LIGHTING: ${p.light}.` : `LIGHTING: ${p.light}.`,
    p.cast ? `CHARACTERS: ${p.cast}.` : "",
    p.relations ? `RELATIONSHIPS: ${p.relations}` : "",
    `ACTION: ${p.action}`,
    p.mood ? `MOOD: ${sentence(p.mood)}` : "",
    `CONTINUITY: ${[p.transitionIn, p.transitionOut].filter(Boolean).map(sentence).join(" ")}`,
    `STYLE: ${p.style}.`,
    `DURATION: ${duration}. ASPECT: 16:9.`,
    `AVOID: ${avoid}.`,
  ].filter(Boolean).join("\n");
}

export function buildScenePrompt(project: FilmProject, scene: Scene, platform: PlatformId): string {
  const frames = project.frames.filter(f => f.sceneId === scene.id);
  const cast = castLine(project, scene.characters);
  const header = [`SCENE: ${scene.title.toUpperCase()} — ${describeLocation(scene.location)} at ${timeOfDay(scene.time)}.`, sentence(scene.description), cast ? `CHARACTERS: ${cast}.` : "", `STYLE: ${styleLine(project, Boolean(scene.lighting || frames[0]?.lighting))}.`, `TOTAL RUNTIME: ${frames.reduce((s, f) => s + f.duration, 0)} seconds across ${frames.length} shot${frames.length === 1 ? "" : "s"}. Aspect 16:9.`].filter(Boolean).join("\n");
  if (!frames.length) return `${header}\n\nNo shots planned yet. Add frames to this scene to generate a shot-by-shot sequence.`;
  const shots = frames.map((frame, i) => {
    const ctx = frameContext(project, frame);
    const p = parts(project, frame, ctx);
    const transition = i === 0 ? (frame.transition ? `${frame.transition}.` : "Open.") : `${frame.transition || "Cut"}.`;
    return `${transition} SHOT ${i + 1} (${frame.duration}s): ${p.shot}, ${p.camera}, ${p.light}. ${p.cast ? `${p.cast}. ` : ""}${p.relations ? `${p.relations} ` : ""}${p.action}${p.mood ? ` Mood: ${sentence(p.mood)}` : ""}`;
  });
  const closing = platform === "kling" ? `\n\nNegative prompt: text, watermarks, logos, distorted faces, extra limbs, morphing, blurry.` : "";
  const note = platform === "hailuo" ? `\n\n(Hailuo generates one shot at a time — copy each shot prompt separately from the list below.)` : platform === "seedance" ? `\n\n(Seedance can render this as a single multi-shot sequence.)` : "";
  return `${header}\n\n${shots.join("\n\n")}${closing}${note}`;
}
