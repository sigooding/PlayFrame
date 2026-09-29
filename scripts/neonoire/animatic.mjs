// Builds an animatic from the bundle: each frame's image held for its duration, its recorded dialogue
// mixed in at the offsets in the manifest. Output goes to exports/neonoire/ (not committed).
//
//   node scripts/neonoire/animatic.mjs --scene 98            one scene (also 25A, 99A ...)
//   node scripts/neonoire/animatic.mjs --from 96 --to 100    a range of scene numbers
//   node scripts/neonoire/animatic.mjs                       the whole film (long)
//
// Needs ffmpeg: FFMPEG=/path/to/ffmpeg, else `ffmpeg` on the PATH (pip install imageio-ffmpeg gives a static build).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1]]] : out), []));
const ff = process.env.FFMPEG || "ffmpeg";
const bundle = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const sceneNo = id => { const m = /^neonoire-s(\d+)([a-z]?)$/.exec(id); return m ? Number(m[1]) : NaN; };
const sceneTag = id => id.replace(/^neonoire-s/, "").toUpperCase();

let frames = bundle.frames;
if (args.scene) frames = frames.filter(f => sceneTag(f.sceneId) === String(args.scene).toUpperCase());
else if (args.from || args.to) frames = frames.filter(f => sceneNo(f.sceneId) >= Number(args.from || 0) && sceneNo(f.sceneId) <= Number(args.to || 1e9));
if (!frames.length) { console.error("No frames selected."); process.exit(1); }

const out = resolve(root, "exports/neonoire");
const work = resolve(out, ".work");
mkdirSync(work, { recursive: true });
const run = a => execFileSync(ff, ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });
const segments = [];

for (const [i, frame] of frames.entries()) {
  const image = frame.image?.startsWith("/images/") ? resolve(root, "public" + frame.image) : null;
  const seg = resolve(work, `seg-${String(i).padStart(4, "0")}.mp4`);
  const video = image && existsSync(image)
    ? ["-loop", "1", "-framerate", "24", "-t", String(frame.duration), "-i", image]
    : ["-f", "lavfi", "-t", String(frame.duration), "-i", "color=c=black:s=1920x1080:r=24"];
  const clips = (frame.audio || []).filter(c => existsSync(resolve(root, "public" + c.src)));
  const inputs = [...video];
  for (const c of clips) inputs.push("-i", resolve(root, "public" + c.src));
  let filter = "";
  const labels = [];
  clips.forEach((c, k) => { filter += `[${k + 1}:a]aresample=44100,aformat=channel_layouts=mono,adelay=${Math.round(c.offset * 1000)}|${Math.round(c.offset * 1000)}[d${k}];`; labels.push(`[d${k}]`); });
  if (clips.length) filter += `${labels.join("")}amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${frame.duration}[a]`;
  else filter = `anullsrc=r=44100:cl=mono,atrim=0:${frame.duration}[a]`;
  run([...inputs, "-filter_complex", filter, "-map", "0:v", "-map", "[a]", "-t", String(frame.duration),
    "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-c:v", "libx264", "-r", "24", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1", seg]);
  segments.push(seg);
}

const name = args.name || (args.scene ? `scene-${args.scene}` : args.from || args.to ? `scenes-${args.from || 1}-${args.to || "end"}` : "film");
const list = resolve(work, "list.txt");
writeFileSync(list, segments.map(s => `file '${s}'`).join("\n") + "\n");
const file = resolve(out, `neonoire-${name}.mp4`);
// One loudness pass over the whole cut, so whispered lines are audible next to spoken ones without
// each frame being levelled on its own (which would shout the quietest lines).
run(["-f", "concat", "-safe", "0", "-i", list, "-c:v", "copy", "-af", "loudnorm=I=-16:LRA=11:TP=-1.5", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", file]);
const voiced = frames.reduce((n, f) => n + (f.audio?.length || 0), 0);
console.log(`${file}: ${frames.length} frames, ${voiced} voiced lines, ${frames.reduce((s, f) => s + f.duration, 0)}s`);
