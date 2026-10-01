import type { FilmProject } from "./types";
import { framesInSceneOrder } from "./frame-order";

export type AnimaticResolution = "720p" | "1080p";
export type AnimaticTiming = "playback" | "tight";
export interface AnimaticOptions {
  sceneId?: string;
  fromSceneId?: string;
  toSceneId?: string;
  resolution: AnimaticResolution;
  timing: AnimaticTiming;
  audio: boolean;
  music: boolean;
  subtitles: boolean;
  camera: boolean;
  credits: boolean;
}
export interface AnimaticJobStatus {
  id: string;
  projectId: string;
  status: "rendering" | "complete" | "failed" | "cancelled";
  phase: "frames" | "mixing";
  completed: number;
  total: number;
  filename: string;
  createdAt: string;
  error?: string;
}

/** Accept a bounded options object, never ffmpeg arguments, filenames or filesystem paths. */
export function parseAnimaticOptions(raw: unknown, project: FilmProject): AnimaticOptions {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Choose animatic export settings.");
  const data = raw as Record<string, unknown>;
  const allowed = new Set(["sceneId", "fromSceneId", "toSceneId", "resolution", "timing", "audio", "music", "subtitles", "camera", "credits"]);
  if (Object.keys(data).some(key => !allowed.has(key))) throw new Error("Unknown animatic export setting.");
  const sceneId = (key: string) => {
    const value = data[key];
    if (value === undefined || value === "") return undefined;
    if (typeof value !== "string" || !project.scenes.some(scene => scene.id === value)) throw new Error("Choose a scene from this project.");
    return value;
  };
  const boolean = (key: string, fallback: boolean) => {
    if (data[key] === undefined) return fallback;
    if (typeof data[key] !== "boolean") throw new Error("Sound and subtitle settings must be on or off.");
    return data[key] as boolean;
  };
  const options: AnimaticOptions = {
    sceneId: sceneId("sceneId"), fromSceneId: sceneId("fromSceneId"), toSceneId: sceneId("toSceneId"),
    resolution: data.resolution === undefined ? "1080p" : data.resolution as AnimaticResolution,
    timing: data.timing === undefined ? "playback" : data.timing as AnimaticTiming,
    audio: boolean("audio", true), music: boolean("music", false), subtitles: boolean("subtitles", false),
    camera: boolean("camera", false), credits: boolean("credits", false),
  };
  if (!["720p", "1080p"].includes(options.resolution) || !["playback", "tight"].includes(options.timing)) throw new Error("Choose 720p or 1080p and a supported timing mode.");
  if (options.sceneId && (options.fromSceneId || options.toSceneId)) throw new Error("Choose one scene or a range, not both.");
  if (!!options.fromSceneId !== !!options.toSceneId) throw new Error("Choose both ends of the scene range.");
  if (options.fromSceneId && project.scenes.findIndex(scene => scene.id === options.fromSceneId) > project.scenes.findIndex(scene => scene.id === options.toSceneId)) throw new Error("The range must follow screenplay scene order.");
  if (options.subtitles && !options.audio) throw new Error("Turn on recorded dialogue to include its subtitles.");
  if (options.credits && !options.music) throw new Error("Turn on the configured score to add the end credits.");
  if (options.music && !project.scenes.some(scene => /^neonoire-s\d+[a-z]?$/i.test(scene.id))) throw new Error("This project has no configured score cues.");
  const frames = animaticFrames(project, options);
  if (!frames.length) throw new Error("There are no shots in that selection.");
  if (frames.length > 1000 || frames.reduce((seconds, frame) => seconds + frame.duration, 0) > 4 * 60 * 60) throw new Error("Choose a shorter scene range (maximum four hours of board holds).");
  return options;
}

export function animaticFrames(project: FilmProject, options: Pick<AnimaticOptions, "sceneId" | "fromSceneId" | "toSceneId">) {
  const from = project.scenes.findIndex(scene => scene.id === options.fromSceneId);
  const to = project.scenes.findIndex(scene => scene.id === options.toSceneId);
  const ids = from >= 0 && to >= from ? new Set(project.scenes.slice(from, to + 1).map(scene => scene.id)) : null;
  return framesInSceneOrder(project.frames, project.scenes).filter(frame => options.sceneId ? frame.sceneId === options.sceneId : ids ? ids.has(frame.sceneId) : true);
}
