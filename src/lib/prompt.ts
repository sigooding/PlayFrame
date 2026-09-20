import type { FilmProject, Scene, StoryFrame } from "./types";
import { angleDescriptions, hailuoMotion, movementDescriptions, shotGuide } from "./shots";
import { lightingGuide } from "./lighting";
import { relationLines } from "./relations";
import { negativeFor, stylePromptLine, visualStyle, type VisualStyleEntry } from "./styles";

export type PlatformKind = "image" | "video";

export interface PlatformConfig {
  id: string;
  name: string;
  kind: PlatformKind;
  hint: string;
  badge?: string;
  aspectRatio?: string;
  defaultNegative?: string;
}

export const PLATFORMS: readonly PlatformConfig[] = [
  // AI Video Models
  { id: "hailuo", name: "MiniMax H3", kind: "video", hint: "H3 three-field format — integrated_multimodal_description, overall_soundscape, non_diegetic_music — with natural camera motion, (S1) speaker IDs, <d> dialogue and <Picture 1> first frames. One shot per generation, 4–15s.", badge: "Video" },
  { id: "seedance", name: "Seedance", kind: "video", hint: "Natural language. Supports multi-shot sequences in one prompt.", badge: "Video" },
  { id: "kling", name: "Kling", kind: "video", hint: "Prose prompt plus a negative prompt.", badge: "Video" },
  { id: "runway", name: "Runway Gen", kind: "video", hint: "Lead with camera movement, keep it direct, no negatives.", badge: "Video" },
  { id: "veo", name: "Google Veo", kind: "video", hint: "Prose with optional audio direction.", badge: "Video" },
  { id: "generic", name: "Universal", kind: "video", hint: "Full structured prompt that works almost anywhere.", badge: "Video" },

  // AI Image Models
  { id: "flux", name: "FLUX.1", kind: "image", hint: "Black Forest Labs FLUX. Natural prose, exceptional photorealism, and 35mm cinematics.", badge: "Image", aspectRatio: "16:9" },
  { id: "sdxl", name: "Stable Diffusion XL", kind: "image", hint: "SDXL photographic syntax with composition tags, 35mm film grain, and negative prompt.", badge: "Image", aspectRatio: "16:9 (1344x768 / 1024x576)", defaultNegative: "blurry, low quality, distorted, deformed eyes, extra limbs, bad anatomy, overexposed, watermark, text, signature, duplicate, cropped, bad art" },
  { id: "sd15", name: "Stable Diffusion 1.5", kind: "image", hint: "Classic weighted prompt syntax with quality tokens and comprehensive negative prompt.", badge: "Image", aspectRatio: "16:9 (768x432)", defaultNegative: "(worst quality, low quality:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, bad eyes, text, watermark, signature, cropped, bad framing" },
  { id: "sd35", name: "Stable Diffusion 3.5", kind: "image", hint: "SD 3.5 Large / Medium natural language prompt with precise lighting and spatial depth.", badge: "Image", aspectRatio: "16:9", defaultNegative: "text, watermark, low quality, blurry, deformed, cartoon, anime, illustration, oversaturated, amateur photography" },
  { id: "krea2", name: "Krea 2", kind: "image", hint: "Krea AI generation & realtime prompt format with cinematic styling, depth, and color grade.", badge: "Image", aspectRatio: "16:9" },
  { id: "midjourney", name: "Midjourney v6", kind: "image", hint: "Cinematic shot syntax formatted with parameters: --ar 16:9 --style raw --v 6.1 --stylize 125.", badge: "Image", aspectRatio: "--ar 16:9" },
  { id: "dalle3", name: "DALL-E 3", kind: "image", hint: "Rich narrative photography description formatted for OpenAI's DALL-E 3 image generation.", badge: "Image", aspectRatio: "1792x1024 (16:9)" },
  { id: "leonardo", name: "Leonardo AI", kind: "image", hint: "Cinematic photorealism with camera optics, volumetric depth, and negative prompt.", badge: "Image", aspectRatio: "16:9", defaultNegative: "blurry, low quality, distorted faces, extra fingers, cartoon, 3d render, watermark, text" },
  { id: "ideogram", name: "Ideogram 2", kind: "image", hint: "High-consistency cinematic framing, realistic environmental lighting, and typography.", badge: "Image", aspectRatio: "16:9" },
] as const;

export type PlatformId = string;

const clean = (value?: string) => (value || "").replace(/\s+/g, " ").trim();
const sentence = (value: string) => { const v = clean(value).replace(/\.{2,}/g, "."); return v ? (/[.!?…]$/.test(v) ? v : `${v}.`) : ""; };

export function describeLocation(location: string) {
  const l = clean(location);
  const mixed = /^(?:INT\.?\/EXT\.?|EXT\.?\/INT\.?)/i;
  const prefix = mixed.test(l) ? "interior and exterior" : /^INT/i.test(l) ? "interior" : /^EXT/i.test(l) ? "exterior" : "";
  const place = l.replace(/^(INT\.?\/EXT\.?|EXT\.?\/INT\.?|INT\.?|EXT\.?)\s*/i, "").toLowerCase();
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

// Production metadata (outline banners, board ranges, filenames) is never valid model input.
const stripProductionMeta = (value?: string) => clean(value || "")
  .replace(/^OUTLINE ONLY — [^.]+\.\s*/, "")
  .replace(/^LEGACY BOARD — [^.]+\.\s*/, "")
  .replace(/^KEYFRAME MISSING — [^.]+\.\s*/, "")
  .replace(/\s*\([A-Za-z0-9_-]+\.(?:jpg|jpeg|png|webp)\)/gi, "")
  .replace(/Review every keyframe against the current grammar before production\.\s*/g, "")
  .trim();

function parts(project: FilmProject, frame: StoryFrame, ctx: PromptContext, entry: VisualStyleEntry = visualStyle()) {
  const shot = `${shotGuide[frame.shotType]?.prompt || `${frame.shotType.toLowerCase()} shot`}${frame.angle && frame.angle !== "Eye level" ? `, ${angleDescriptions[frame.angle]}` : ""}${frame.lens ? `, ${frame.lens} lens` : ""}`;
  const camera = movementDescriptions[frame.movement] || frame.movement.toLowerCase();
  const setting = ctx.scene ? `${describeLocation(ctx.scene.location)} at ${timeOfDay(ctx.scene.time)}` : "";
  const lighting = frame.lighting || ctx.scene?.lighting;
  const light = (clean(frame.lightingNotes) || clean(ctx.scene?.lightingNotes) || (lighting
    ? lightingGuide[lighting]?.prompt || `${lighting.toLowerCase()} lighting`
    : (ctx.scene && /dawn|morning|sunset|dusk/i.test(ctx.scene.time) ? "soft golden natural light" : "natural lighting"))).replace(/\.+$/, "");
  // An explicit empty cast is an insert/empty frame, not a request for everyone in the scene.
  const castIds = frame.characters ?? ctx.scene?.characters ?? [];
  const cast = castLine(project, castIds);
  const relations = sentence(relationLines(project, castIds).join("; "));
  const action = [sentence(stripProductionMeta(frame.description)), ctx.scene && clean(ctx.scene.description) !== clean(frame.description) ? sentence(stripProductionMeta(ctx.scene.description)) : ""].filter(Boolean).join(" ");
  const mood = (clean(frame.mood) || (frame.notes ? stripProductionMeta(clean(frame.notes).split(/(?<=[.!?])\s/)[0]) : "")).replace(/[.!?]+$/, "");
  const transitionIn = frame.transition ? (ctx.previous ? `${frame.transition} from the previous shot (${ctx.previous.shotType.toLowerCase()} — “${ctx.previous.title}”)` : `Begins with a ${frame.transition.toLowerCase()}`) : (ctx.previous ? `Cut from previous shot (${ctx.previous.shotType.toLowerCase()} — “${ctx.previous.title}”)` : "");
  const transitionOut = ctx.next ? `${ctx.next.transition || "Cut"} to next shot: ${ctx.next.shotType.toLowerCase()} — “${ctx.next.title}”` : "Scene ends on this shot";
  return { shot, camera, setting, light, cast, relations, action, mood, transitionIn, transitionOut, style: stylePromptLine(project, entry), finish: entry.finish };
}

// --- MiniMax H3 (Hailuo) helpers -------------------------------------------------
// MiniMax H3 abandons the bracketed-command style of earlier Hailuo models.
// Per docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md (T2VA / I2VA / FL2VA / L2VA):
//   • the prompt is three core fields: integrated_multimodal_description,
//     overall_soundscape, non_diegetic_music;
//   • camera motion is a natural-English sentence (motion + amplitude + speed);
//   • dialogue uses stable speaker IDs (S1), (S2)… with the words verbatim
//     inside <d>[Language] …</d>, delivery kept outside the tags;
//   • a first-frame keyframe adds the fixed I2VA instruction line first and is
//     cited as <Picture 1>. Durations of 4–15s are an API setting, not prompt text.

const isScriptCue = (l: string) => /^([A-Z][A-Z'.\-() ]{0,24}):\s+\S/.test(l) && !/SCRIPT/i.test(l);

/** Built-in library pictures (shot diagrams, lighting and style swatches) illustrate the
 *  framing or look — they are not first frames the director will upload. Only real keyframe
 *  art (approved studies, uploads, external stills) becomes H3's <Picture 1>. */
const isLibraryReference = (image?: string) => !!image && /^\/images\/(shots|lighting|styles)\//.test(image);
const hasKeyframeImage = (frame: StoryFrame) => !!frame.image && !isLibraryReference(frame.image);

/** Scripted cue lines ("DANNY: …") become speaker-ID sentences with <d> blocks.
 *  A speaker keeps one stable ID across the whole prompt; known cast members
 *  are matched by name so the identifier reads naturally. */
function h3Dialogue(project: FilmProject, frame: StoryFrame, castIds: string[] | undefined): string {
  const cues = (frame.notes || "").split("\n").map(l => l.trim()).filter(isScriptCue);
  if (!cues.length) return "";
  const cast = (castIds || []).map(id => project.characters.find(c => c.id === id)).filter(Boolean);
  const ids = new Map<string, string>();
  return cues.map(cue => {
    const [, raw, content] = cue.match(/^([A-Z][A-Z'.\-() ]{0,24}):\s*(.+)$/) || [];
    const key = (raw || cue).trim().toUpperCase();
    if (!ids.has(key)) ids.set(key, `S${ids.size + 1}`);
    const known = cast.find(c => c!.name.toUpperCase() === key || c!.name.toUpperCase().split(/\s+/)[0] === key);
    const name = known ? known!.name : (raw || "").trim().split(/\s+/).map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
    const spoken = /[.!?]$/.test(content || "") ? content : `${content}.`;
    return `${name} (${ids.get(key)}) says: <d>[English] ${spoken}</d>`;
  }).join(" ");
}

/** Split shot-note sound direction into the guide's two audio fields. Ambience
 *  and physical sounds go to overall_soundscape; audience-only score goes to
 *  non_diegetic_music. N/A only when silence (or no music) is the direction. */
function h3Sound(frame: StoryFrame): { soundscape: string; music: string } {
  const prose = (frame.notes || "").split("\n").map(l => l.trim()).filter(Boolean).filter(l => !isScriptCue(l));
  const all = prose.join(" ");
  const music = prose.find(l => /music|score|soundtrack|underscore|theme song/i.test(l) && !/no (score|music|theme)/i.test(l));
  const ambient = prose.find(l => l !== music && /ambien|sound|room tone|wind|rain|hum|traffic|silence/i.test(l) && !/no (score|music|dialogue)/i.test(l));
  const silence = /complete silence|no (ambient|diegetic) sound|silent throughout/i.test(all);
  const soundscape = silence ? "N/A" : sentence(ambient || "Natural ambient sound of the location continues throughout");
  return { soundscape, music: music ? sentence(music) : "N/A" };
}

export function buildFramePrompt(project: FilmProject, frame: StoryFrame, platform: PlatformId, style?: string): string {
  // Explicit style wins; otherwise inherit the shot's persisted style, then its scene's, then the default.
  const frameScene = project.scenes.find(s => s.id === frame.sceneId);
  const entry = visualStyle(style || frame.style || frameScene?.style);
  const styleNeg = (base: string) => negativeFor(base, entry);
  const artLower = entry.name.toLowerCase();
  const anCap = /^[aeiou]/.test(artLower) ? "An" : "A";
  const ctx = frameContext(project, frame);
  const p = parts(project, frame, ctx, entry);
  const duration = `${frame.durationIsEstimate ? "approximately " : ""}${frame.duration} second${frame.duration === 1 ? "" : "s"}`;
  const avoid = "text, captions, watermarks, logos, distorted faces, extra limbs, morphing";

  // ===== Video Models =====
  if (platform === "hailuo") {
    // MiniMax H3 format (Video Prompt Writing Guide, T2VA / I2VA): three core fields,
    // style stated at the start of [Shot 1], natural camera motion, <d> dialogue.
    const keyframe = hasKeyframeImage(frame);
    const spoken = h3Dialogue(project, frame, frame.characters ?? frameScene?.characters);
    const sound = h3Sound(frame);
    const styleLead = sentence(p.style);
    const body = [
      `[Shot 1] ${styleLead.charAt(0).toUpperCase()}${styleLead.slice(1)}`,
      keyframe ? "The shot begins from <Picture 1>." : "",
      `A ${p.shot}.`,
      p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : "",
      p.cast ? `${p.cast}.` : "",
      p.relations,
      hailuoMotion[frame.movement] || hailuoMotion.Static,
      p.action,
      spoken,
      p.mood ? `The overall mood is ${p.mood.toLowerCase()}.` : "",
    ].filter(Boolean).join(" ");
    const fields = [
      `integrated_multimodal_description: ${body}`,
      `overall_soundscape: ${sound.soundscape}`,
      `non_diegetic_music: ${sound.music}`,
    ].join("\n\n");
    // I2VA: the fixed first-frame instruction is the first line of the final prompt.
    return keyframe
      ? `For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.\n\n${fields}`
      : fields;
  }
  if (platform === "runway") {
    return [`${p.camera[0].toUpperCase()}${p.camera.slice(1)}: ${p.shot} of ${p.cast ? p.cast.split(" (")[0] : "the subject"}${p.setting ? ` in ${p.setting}` : ""}.`, p.action, p.relations, `${p.light[0].toUpperCase()}${p.light.slice(1)}. ${p.style}.`].filter(Boolean).join(" ");
  }
  if (platform === "kling") {
    return [`${p.shot}, ${p.camera}. ${p.setting ? `Setting: ${p.setting}, ${p.light}.` : ""}`, p.cast ? `Subject: ${p.cast}.` : "", p.relations ? `Relation: ${p.relations}` : "", `Action: ${p.action}`, p.mood ? `Atmosphere: ${sentence(p.mood)}` : "", `Style: ${p.style}. Duration ${duration}, aspect ratio 16:9.`, "", `Negative prompt: ${styleNeg(avoid + ", blurry, low quality, oversaturated, cartoon")}.`].join("\n").trim();
  }
  if (platform === "veo") {
    const audio = frame.notes && /ambien|sound|score|wind|silence|music/i.test(frame.notes) ? clean(frame.notes).split(/(?<=[.!?])\s/).find(s => /ambien|sound|score|wind|silence|music/i.test(s)) : "";
    return [`${p.shot}, ${p.camera}. ${p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : ""}`, p.cast ? `${p.cast}.` : "", p.relations, p.action, p.mood ? `The mood is ${p.mood.toLowerCase().replace(/\.$/, "")}.` : "", `Visual style: ${p.style}.`, `Audio: ${audio ? audio : "natural ambient sound of the location, no dialogue, no music"}.`, `${duration}, 16:9.`].filter(Boolean).join(" ");
  }
  if (platform === "seedance") {
    return [`Shot ${ctx.index + 1} of ${ctx.total} — ${duration}.`, `${p.shot}, ${p.camera}.`, p.setting ? `${p.setting[0].toUpperCase()}${p.setting.slice(1)}, ${p.light}.` : "", p.cast ? `${p.cast}.` : "", p.relations, p.action, p.mood ? `Mood: ${sentence(p.mood)}` : "", `${p.transitionIn ? sentence(p.transitionIn) + " " : ""}${sentence(p.transitionOut)}`, `Style: ${p.style}. 16:9. Avoid ${avoid}.`].filter(Boolean).join(" ");
  }

  // ===== Image Models =====
  if (platform === "flux") {
    return [
      `${entry.photoreal ? "A cinematic 35mm film still" : `${anCap} ${artLower} artwork`} of a ${p.shot}.`,
      p.cast ? `Featuring ${p.cast}.` : "",
      p.relations ? `Context: ${p.relations}` : "",
      p.action ? p.action : "",
      p.setting ? `Location: ${p.setting}.` : "",
      `Lighting: ${p.light}.`,
      p.mood ? `Atmosphere: ${sentence(p.mood)}` : "",
      `Cinematography: ${p.style}, ${p.finish}. Aspect ratio 16:9.`,
    ].filter(Boolean).join(" ");
  }
  if (platform === "sdxl") {
    const positive = [
      `cinematic film still, ${p.shot}`,
      p.cast ? `${p.cast}` : "",
      p.action ? `${p.action}` : "",
      p.relations ? `${p.relations}` : "",
      p.setting ? `set in ${p.setting}` : "",
      `${p.light}`,
      p.mood ? `${p.mood} atmosphere` : "",
      `${p.style}, ${p.finish}, sharp focus, 8k resolution, color graded`,
    ].filter(Boolean).join(", ");
    const neg = styleNeg(`blurry, low quality, distorted, bad anatomy, deformed eyes, extra limbs, overexposed, underexposed, watermark, text, signature, duplicate, cropped, cartoon, 3d render`);
    return [
      `PROMPT:`,
      positive,
      ``,
      `NEGATIVE PROMPT:`,
      neg,
      ``,
      `PARAMETERS:`,
      `Size: 1344x768 (16:9) | CFG: 7.0 | Steps: 30 | Sampler: DPM++ 2M Karras`,
    ].join("\n");
  }
  if (platform === "sd15") {
    const positive = [
      `(masterpiece:1.2), (best quality:1.2), (highly detailed 8k cinematic still:1.2)`,
      `${p.shot}`,
      p.cast ? `${p.cast}` : "",
      p.action ? `${p.action}` : "",
      p.relations ? `${p.relations}` : "",
      p.setting ? `${p.setting}` : "",
      `${p.light}`,
      p.mood ? `(${p.mood} mood:1.1)` : "",
      `${p.finish}, anamorphic lens, award winning cinematography, shallow depth of field, dramatic lighting, sharp focus`,
    ].filter(Boolean).join(", ");
    const neg = styleNeg(`(worst quality, low quality:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, bad eyes, text, watermark, signature, cropped, bad framing`);
    return [
      `PROMPT:`,
      positive,
      ``,
      `NEGATIVE PROMPT:`,
      neg,
      ``,
      `PARAMETERS:`,
      `Size: 768x432 (or 512x512 with Hires.fix 1.5x) | CFG: 7.5 | Steps: 28 | Sampler: Euler a / DPM++ 2M SDE`,
    ].join("\n");
  }
  if (platform === "sd35") {
    const positive = [
      `A high-end ${entry.photoreal ? "cinematic photograph" : `${entry.name.toLowerCase()} artwork`} of a ${p.shot}.`,
      p.cast ? `Character: ${p.cast}.` : "",
      p.relations ? `Context: ${p.relations}` : "",
      p.action ? `Action: ${p.action}` : "",
      p.setting ? `Environment: ${p.setting}.` : "",
      `Lighting setup: ${p.light}.`,
      p.mood ? `Mood: ${sentence(p.mood)}` : "",
      `Style: ${p.style}, ${p.finish}, volumetric atmosphere, 16:9 cinematic framing.`,
    ].filter(Boolean).join(" ");
    const neg = styleNeg(`text, watermark, low quality, blurry, deformed, cartoon, anime, illustration, oversaturated, amateur photography`);
    return [
      `PROMPT:`,
      positive,
      ``,
      `NEGATIVE PROMPT:`,
      neg,
      ``,
      `PARAMETERS:`,
      `Aspect ratio: 16:9 (1024x576 or 1536x864) | CFG: 4.5 | Steps: 28 | Shift: 3.0`,
    ].join("\n");
  }
  if (platform === "krea2") {
    const promptText = [
      `cinematic still, ${p.shot}`,
      p.cast ? `portrait of ${p.cast}` : "",
      p.action ? `${p.action}` : "",
      p.relations ? `${p.relations}` : "",
      p.setting ? `in ${p.setting}` : "",
      `${p.light}`,
      p.mood ? `${p.mood} atmosphere` : "",
      `${p.finish}, rich tones, cinematic grade, volumetric depth, 8k, highly detailed, masterwork cinematography`,
    ].filter(Boolean).join(", ");
    return [
      promptText,
      ``,
      `Style: ${entry.name} | Aspect: 16:9 | AI Strength: 0.75`,
    ].join("\n");
  }
  if (platform === "midjourney") {
    const mjPrompt = [
      `A cinematic movie still of ${p.shot},`,
      p.cast ? `featuring ${p.cast},` : "",
      p.action ? `${p.action},` : "",
      p.relations ? `${p.relations},` : "",
      p.setting ? `set in ${p.setting},` : "",
      `${p.light},`,
      p.mood ? `${sentence(p.mood)}` : "",
      `${p.style}, ${p.finish}, award-winning cinematography, intricate detail --ar 16:9 --style raw --v 6.1 --stylize 125`,
    ].filter(Boolean).join(" ").replace(/\s+,/g, ",");
    return mjPrompt;
  }
  if (platform === "dalle3") {
    return [
      `A wide 16:9 ${entry.photoreal ? "cinematic film photograph" : `${entry.name.toLowerCase()} artwork`} capturing a ${p.shot}.`,
      p.cast ? `The subject is ${p.cast}.` : "",
      p.relations ? `${p.relations}` : "",
      p.action ? `${p.action}` : "",
      p.setting ? `The scene takes place in ${p.setting}.` : "",
      `The lighting is ${p.light}.`,
      p.mood ? `The mood conveys ${p.mood.toLowerCase()}.` : "",
      `The overall aesthetic is ${p.style}, exhibiting ${p.finish}.`,
    ].filter(Boolean).join(" ");
  }
  if (platform === "leonardo") {
    const positive = [
      `cinematic movie still, ${p.shot}`,
      p.cast ? `${p.cast}` : "",
      p.action ? `${p.action}` : "",
      p.relations ? `${p.relations}` : "",
      p.setting ? `in ${p.setting}` : "",
      `${p.light}`,
      p.mood ? `${p.mood} tone` : "",
      `${p.finish}, Leonardo Kino XL cinematic style, 35mm lens, atmospheric depth, 8k resolution`,
    ].filter(Boolean).join(", ");
    const neg = styleNeg(`blurry, low quality, distorted faces, extra fingers, cartoon, 3d render, watermark, text`);
    return [
      `PROMPT:`,
      positive,
      ``,
      `NEGATIVE PROMPT:`,
      neg,
      ``,
      `PRESET: Leonardo Phoenix / Kino XL | Aspect Ratio: 16:9`,
    ].join("\n");
  }
  if (platform === "ideogram") {
    return [
      `${entry.photoreal ? "A cinematic photo" : `${anCap} ${artLower} illustration`} of a ${p.shot},`,
      p.cast ? `showing ${p.cast},` : "",
      p.action ? `${p.action},` : "",
      p.relations ? `${p.relations},` : "",
      p.setting ? `in ${p.setting},` : "",
      `${p.light},`,
      p.mood ? `${sentence(p.mood)}` : "",
      `${p.style}, ${p.finish}. Aspect Ratio: 16:9. Style: ${entry.name}.`,
    ].filter(Boolean).join(" ").replace(/\s+,/g, ",");
  }

  // generic / universal fallback
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

export function buildScenePrompt(project: FilmProject, scene: Scene, platform: PlatformId, style?: string): string {
  const entry = visualStyle(style || scene.style);
  const frames = project.frames.filter(f => f.sceneId === scene.id);
  const cast = castLine(project, scene.characters);
  const selectedPlatform = PLATFORMS.find(p => p.id === platform);
  const isImageModel = selectedPlatform?.kind === "image";

  const header = [
    `SCENE: ${scene.title.toUpperCase()} — ${describeLocation(scene.location)} at ${timeOfDay(scene.time)}.`,
    sentence(scene.description),
    cast ? `CHARACTERS: ${cast}.` : "",
    `STYLE: ${stylePromptLine(project, entry)}.`,
    isImageModel
      ? `TOTAL SHOTS: ${frames.length} frame${frames.length === 1 ? "" : "s"} (${selectedPlatform?.name || "AI Image"} prompts for keyframes & storyboard).`
      : `TOTAL ${frames.some(f => f.durationIsEstimate) ? "ESTIMATED RUNTIME" : "RUNTIME"}: ${frames.reduce((s, f) => s + f.duration, 0)} seconds across ${frames.length} shot${frames.length === 1 ? "" : "s"}. Aspect 16:9.`,
  ].filter(Boolean).join("\n");

  if (!frames.length) {
    return `${header}\n\nNo shots planned yet. Add frames to this scene to generate a shot-by-shot sequence.`;
  }

  if (isImageModel) {
    const shots = frames.map((frame, i) => {
      const shotPrompt = buildFramePrompt(project, frame, platform, style);
      return `=== SHOT ${i + 1}: ${frame.title} (${frame.shotType} · ${frame.lighting || "Natural light"}) ===\n${shotPrompt}`;
    });
    return `${header}\n\n${shots.join("\n\n")}`;
  }

  const shots = frames.map((frame, i) => {
    const ctx = frameContext(project, frame);
    const p = parts(project, frame, ctx, entry);
    const transition = i === 0 ? (frame.transition ? `${frame.transition}.` : "Open.") : `${frame.transition || "Cut"}.`;
    return `${transition} SHOT ${i + 1} (${frame.durationIsEstimate ? "~" : ""}${frame.duration}s): ${p.shot}, ${p.camera}, ${p.light}. ${p.cast ? `${p.cast}. ` : ""}${p.relations ? `${p.relations} ` : ""}${p.action}${p.mood ? ` Mood: ${sentence(p.mood)}` : ""}`;
  });
  const closing = platform === "kling" ? `\n\nNegative prompt: ${negativeFor("text, watermarks, logos, distorted faces, extra limbs, morphing, blurry", entry)}.` : "";
  const note = platform === "hailuo" ? `\n\n(MiniMax H3 generates one shot at a time — copy each shot prompt separately from the list below.)` : platform === "seedance" ? `\n\n(Seedance can render this as a single multi-shot sequence.)` : "";
  return `${header}\n\n${shots.join("\n\n")}${closing}${note}`;
}

export function extractPositivePrompt(fullText: string): string {
  const match = fullText.match(/PROMPT:\s*\n([\s\S]*?)(?=\n\s*(?:NEGATIVE PROMPT|PARAMETERS|PRESET):|$)/i);
  return match ? match[1].trim() : fullText.trim();
}

export function extractNegativePrompt(fullText: string): string | null {
  const match = fullText.match(/NEGATIVE PROMPT:\s*\n([\s\S]*?)(?=\n\s*(?:PARAMETERS|PRESET):|$)/i);
  return match ? match[1].trim() : null;
}
