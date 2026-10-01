import { spawn, execFile, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename, stat, realpath, rm } from "node:fs/promises";
import { resolve, relative, isAbsolute, join } from "node:path";
import { promisify } from "node:util";
import type { FilmProject } from "./types";
import { animaticFrames, type AnimaticJobStatus, type AnimaticOptions } from "./animatic-options";
import { slugify } from "./export";

const ROOT = process.cwd();
const JOB_ROOT = resolve(ROOT, "exports/animatics");
type Worker = { child: ChildProcess; state: AnimaticJobStatus };
const workers = globalThis as typeof globalThis & { __frameAnimaticWorkers?: Map<string, Worker>; __frameAnimaticWrites?: Map<string, Promise<void>> };
const active = workers.__frameAnimaticWorkers ??= new Map();
const writes = workers.__frameAnimaticWrites ??= new Map();
const terminal = new Set(["complete", "failed", "cancelled"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class AnimaticError extends Error {
  constructor(message: string, readonly status = 422) { super(message); }
}
const folder = (id: string) => {
  if (!uuid.test(id)) throw new AnimaticError("Export not found.", 404);
  return join(JOB_ROOT, id);
};
async function persist(state: AnimaticJobStatus) {
  const dir = folder(state.id), json = JSON.stringify(state);
  const queued = (writes.get(state.id) || Promise.resolve()).catch(() => {}).then(async () => {
    await writeFile(join(dir, "status.tmp.json"), json);
    await rename(join(dir, "status.tmp.json"), join(dir, "status.json"));
  });
  writes.set(state.id, queued);
  const clear = () => { if (writes.get(state.id) === queued) writes.delete(state.id); };
  void queued.then(clear, clear);
  return queued;
}
export async function getAnimaticJob(projectId: string, id: string): Promise<AnimaticJobStatus> {
  try {
    const state = JSON.parse(await readFile(join(folder(id), "status.json"), "utf8")) as AnimaticJobStatus;
    if (state.projectId !== projectId) throw new Error("Wrong project");
    return state;
  } catch { throw new AnimaticError("Export not found.", 404); }
}
export async function animaticDownload(projectId: string, id: string) {
  const state = await getAnimaticJob(projectId, id);
  if (state.status !== "complete") throw new AnimaticError("This export is not ready to download.", 409);
  const path = join(folder(id), "animatic.mp4");
  return { path, filename: state.filename, size: (await stat(path)).size };
}

async function publicMedia(src: string, kind: "images" | "audio") {
  let decoded: string;
  try { decoded = decodeURIComponent(src.split(/[?#]/)[0]); }
  catch { throw new AnimaticError("A media path is malformed."); }
  if (!decoded.startsWith(`/${kind}/`)) throw new AnimaticError("MP4 export uses local images and recorded audio. Upload remote images before exporting.");
  const base = resolve(ROOT, "public", kind), path = resolve(ROOT, "public", `.${decoded}`);
  const within = (file: string) => { const rel = relative(base, file); return !rel.startsWith("..") && !isAbsolute(rel); };
  if (!within(path)) throw new AnimaticError("Media paths must stay inside the public media folder.");
  let actual: string;
  try { actual = await realpath(path); }
  catch { throw new AnimaticError("A selected shot has missing media. Restore its image/audio before exporting."); }
  if (!within(actual)) throw new AnimaticError("Media paths must stay inside the public media folder.");
  return `/${kind}/${relative(base, path).split("\\").join("/")}`;
}

export async function startAnimaticJob(project: FilmProject, options: AnimaticOptions) {
  if (active.size >= 2) throw new AnimaticError("Two animatics are already rendering. Wait for one to finish, or cancel an export.", 429);
  const ffmpeg = process.env.FFMPEG || "ffmpeg";
  try { await promisify(execFile)(ffmpeg, ["-version"], { timeout: 5000 }); }
  catch { throw new AnimaticError("MP4 export needs FFmpeg on the server. Install it or set FFMPEG to its executable path, then restart the app.", 503); }
  const selected = animaticFrames(project, options);
  const id = randomUUID(), dir = folder(id), media = join(dir, "media");
  await mkdir(media, { recursive: true });
  // Snapshot precisely the saved playback order and edits; a later change cannot alter this render.
  const frames = structuredClone(selected);
  try {
    for (const [index, frame] of frames.entries()) {
      if (frame.image.startsWith("data:")) {
        const match = /^data:image\/(png|jpeg|jpg|webp);base64,([a-z0-9+/=\r\n]+)$/i.exec(frame.image);
        if (!match) throw new AnimaticError("Use a JPEG, PNG or WebP upload for MP4 export.");
        const bytes = Buffer.from(match[2], "base64");
        if (!bytes.length || bytes.length > 10 * 1024 * 1024) throw new AnimaticError("A shot image exceeds the 10 MB export limit.");
        frame.image = join(media, `image-${index}.${match[1] === "jpeg" ? "jpg" : match[1]}`);
        await writeFile(frame.image, bytes);
      } else if (frame.image) frame.image = await publicMedia(frame.image, "images");
      if (options.audio) for (const clip of frame.audio || []) clip.src = await publicMedia(clip.src, "audio");
    }
  } catch (error) { await rm(dir, { recursive: true, force: true }); throw error; }
  const snapshot = join(dir, "project.json");
  await writeFile(snapshot, JSON.stringify({ ...project, frames }));
  const state: AnimaticJobStatus = {
    id, projectId: project.id, status: "rendering", phase: "frames", completed: 0, total: frames.length,
    filename: `${slugify(project.title).slice(0, 100)}-animatic.mp4`, createdAt: new Date().toISOString(),
  };
  await persist(state);
  const args = [resolve(ROOT, "scripts/neonoire/animatic.mjs"), "--project", snapshot,
    "--output", join(dir, "animatic.mp4"), "--media-root", media, "--resolution", options.resolution, "--no-camera", "--no-credits"];
  if (options.timing === "playback") args.push("--hold");
  if (!options.audio) args.push("--no-audio");
  if (!options.music) args.push("--no-music");
  if (!options.subtitles) args.push("--no-subs");
  if (active.size >= 2) { await rm(dir, { recursive: true, force: true }); throw new AnimaticError("Two animatics are already rendering. Wait for one to finish.", 429); }
  const child = spawn(process.execPath, args, {
    cwd: ROOT, env: { ...process.env, FFMPEG: ffmpeg }, stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  active.set(id, { child, state });
  let buffer = "", log = "", serial: Promise<unknown> = Promise.resolve();
  const save = () => { const copy = { ...state }; serial = serial.catch(() => {}).then(() => persist(terminal.has(state.status) ? { ...state } : copy)); };
  const kill = () => {
    try { if (child.pid && process.platform !== "win32") process.kill(-child.pid, "SIGTERM"); else child.kill("SIGTERM"); } catch {}
  };
  const timeout = setTimeout(() => { state.status = "failed"; state.error = "The export exceeded its two-hour rendering limit. Choose a shorter range."; save(); kill(); }, 2 * 60 * 60 * 1000);
  timeout.unref();
  child.stdout?.on("data", chunk => {
    buffer += chunk.toString();
    const lines = buffer.split("\n"); buffer = lines.pop() || "";
    for (const line of lines) try {
      const progress = JSON.parse(line);
      if (progress.type === "progress" && state.status === "rendering") {
        state.completed = Math.min(state.total, Math.max(0, Number(progress.completed) || 0));
        state.phase = progress.phase === "mixing" ? "mixing" : "frames"; save();
      }
    } catch { /* CLI summaries are not status messages. */ }
  });
  child.stderr?.on("data", chunk => { log = (log + chunk.toString()).slice(-16000); });
  child.on("error", () => { state.status = "failed"; state.error = "The renderer could not start. Check FFmpeg and the server's export permissions."; save(); });
  child.on("close", code => { void (async () => {
    clearTimeout(timeout); active.delete(id);
    if (!terminal.has(state.status)) {
      let output = false;
      try { output = (await stat(join(dir, "animatic.mp4"))).size > 0; } catch {}
      state.status = code === 0 && output ? "complete" : "failed";
      if (state.status === "complete") state.completed = state.total;
      else state.error = "Rendering failed. Check the server log and selected media, then try again.";
    }
    await serial.catch(() => {});
    await persist(state);
    await writeFile(join(dir, "renderer.log"), log);
    await Promise.all([rm(join(dir, ".work"), { recursive: true, force: true }), rm(media, { recursive: true, force: true })]);
  })().catch(error => console.error("Animatic worker finalisation:", error)); });
  return { ...state };
}

export async function cancelAnimaticJob(projectId: string, id: string) {
  const state = await getAnimaticJob(projectId, id);
  if (state.status !== "rendering") return state;
  const worker = active.get(id);
  if (worker) worker.state.status = "cancelled";
  const child = worker?.child;
  if (child?.pid) {
    try { if (process.platform !== "win32") process.kill(-child.pid, "SIGTERM"); else child.kill("SIGTERM"); } catch {}
  }
  state.status = "cancelled";
  await persist(state);
  return state;
}
