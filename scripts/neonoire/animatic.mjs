// Builds an animatic from the bundle: each frame's image held for its duration, its recorded dialogue
// mixed in at the offsets in the manifest. Output goes to exports/neonoire/ (not committed).
//
//   node scripts/neonoire/animatic.mjs --scene 98            one scene (also 25A, 99A ...)
//   node scripts/neonoire/animatic.mjs --from 96 --to 100    a range of scene numbers
//   node scripts/neonoire/animatic.mjs                       the whole film (long)
//
// Cuts are tight by default: a voiced frame starts about half a second before its first line and ends
// 0.4 s after its last; a silent frame holds at most 4 s. Board durations stay in the bundle untouched.
//   --hold          use the board durations as they are (no trimming)
//   --silent-max N  longest a silent frame may hold, seconds (default 4)
//
// Subtitles are burned in by default (the recorded text of each line, timed to its clip), and a matching .srt is
// written next to the video for the editor.  --no-subs  leaves them off;  --speakers  prefixes each line with its speaker.
//
// Needs ffmpeg: FFMPEG=/path/to/ffmpeg, else `ffmpeg` on the PATH (pip install imageio-ffmpeg gives a static build).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { inStoryOrder } from "./story-order.mjs";
import { readManifest } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1]]] : out), []));
const ff = process.env.FFMPEG || "ffmpeg";
const bundle = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const sceneNo = id => { const m = /^neonoire-s(\d+)([a-z]?)$/.exec(id); return m ? Number(m[1]) : NaN; };
const sceneTag = id => id.replace(/^neonoire-s/, "").toUpperCase();

// Story order, not array order: an added coverage shot plays where its line is in the draft.
let frames = inStoryOrder(bundle.frames, bundle.scenes, root);
if (args.scene) frames = frames.filter(f => sceneTag(f.sceneId) === String(args.scene).toUpperCase());
else if (args.from || args.to) frames = frames.filter(f => sceneNo(f.sceneId) >= Number(args.from || 0) && sceneNo(f.sceneId) <= Number(args.to || 1e9));
if (!frames.length) { console.error("No frames selected."); process.exit(1); }

const out = resolve(root, "exports/neonoire");
const work = resolve(out, ".work");
mkdirSync(work, { recursive: true });
const run = a => execFileSync(ff, ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });
const segments = [];
let segmentsTotal = 0;
// Filters for lines that are heard through something: the clean take stays clean on disk, the animatic colours it.
// Set with `voice-ingest --fx`; the real treatment is done in the editor, this is a fair sketch of it.
const FX = {
  phone: "highpass=f=400,lowpass=f=3000,acompressor=threshold=0.04:ratio=6,volume=1.6",
  tv: "highpass=f=300,lowpass=f=5000,aecho=0.8:0.6:35:0.25,volume=1.2",
  tape: "highpass=f=350,lowpass=f=4200,vibrato=f=5:d=0.03,volume=1.4",
};
const fxByFile = new Map(readManifest(root).lines.filter(l => l.fx).map(l => [l.file, l.fx]));
const tight = args.hold === undefined;
const subs = args["no-subs"] === undefined;
const speakers = args.speakers !== undefined;
const srtTime = t => { const ms = Math.round(t * 1000); const p = (n, w = 2) => String(n).padStart(w, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
const cueText = c => (speakers ? `${c.character}: ` : "") + (c.text || "");
const cues = [];
const silentMax = Number(args["silent-max"] || 4);
const LEAD = 0.5, TAIL = 0.4;
// Tightened timing for one frame: the length it plays and its clips shifted to match.
function pace(frame, clips) {
  if (!tight) return { dur: frame.duration, clips };
  if (!clips.length) return { dur: Math.min(frame.duration, silentMax), clips };
  const shift = Math.max(0, Math.min(...clips.map(c => c.offset)) - LEAD);
  const end = Math.max(...clips.map(c => c.offset + (c.duration || 0))) - shift;
  return { dur: Math.min(frame.duration, Math.round((end + TAIL) * 10) / 10) || frame.duration, clips: clips.map(c => ({ ...c, offset: c.offset - shift })) };
}

// Camera moves. A still is given the move its board asks for (push-in, pull-back, tracking, pan, handheld);
// a static board gets a very slow push so the animatic never freezes. --no-camera renders the stills flat.
const camera = args["no-camera"] === undefined;
function cameraMove(frame, dur, i) {
  const text = `${frame.movement || ""} ${frame.notes || ""} ${frame.description || ""} ${frame.title || ""}`.toLowerCase();
  const n = Math.max(1, Math.round(dur * 24));
  const p = `min(on/${n},1)`;
  const rate = 0.014, zmax = Math.min(1.12, 1 + rate * dur);
  const centre = { x: "iw/2-iw/zoom/2", y: "ih/2-ih/zoom/2" };
  const dir = i % 2 ? 1 : -1;
  if (/pull(ing)?[- ]?(back|out)|dolly out|retreat/.test(text)) return { z: `${zmax}-${zmax - 1}*${p}`, ...centre, kind: "pull" };
  if (/handheld/.test(text)) return { z: "1.06+0.01*sin(on/9)", x: "iw/2-iw/zoom/2+sin(on/7)*7", y: "ih/2-ih/zoom/2+cos(on/11)*5", kind: "handheld" };
  if (/\bpan(s|ning)?\b|\btrack(ing)?\b|follow|walks?\b/.test(text) || frame.movement === "Tracking")
    return { z: "1.09", x: dir > 0 ? `(iw-iw/zoom)*${p}` : `(iw-iw/zoom)*(1-${p})`, y: "ih/2-ih/zoom/2", kind: "track" };
  if (/tilt/.test(text)) return { z: "1.09", x: centre.x, y: dir > 0 ? `(ih-ih/zoom)*${p}` : `(ih-ih/zoom)*(1-${p})`, kind: "tilt" };
  const s = /push(ing)?[- ]?in|dolly in|creep|slow push|closer/.test(text) ? 1.6 : 1;
  return { z: `1+${(zmax - 1) * s}*${p}`, ...centre, kind: "push" };
}

for (let [i, frame] of frames.entries()) {
  const image = frame.image?.startsWith("/images/") ? resolve(root, "public" + frame.image) : null;
  const seg = resolve(work, `seg-${String(i).padStart(4, "0")}.mp4`);
  const paced = pace(frame, (frame.audio || []).filter(c => existsSync(resolve(root, "public" + c.src))));
  const clips = paced.clips;
  frame = { ...frame, duration: paced.dur };
  let subFilter = "";
  if (subs && clips.length) {
    const seg0 = segmentsTotal;
    const own = clips.filter(c => c.text).sort((a, b) => a.offset - b.offset);
    const rel = own.map((c, k) => `${k + 1}\n${srtTime(c.offset)} --> ${srtTime(c.offset + (c.duration || 1.5))}\n${cueText(c)}\n`).join("\n");
    const srt = resolve(work, `seg-${String(i).padStart(4, "0")}.srt`);
    writeFileSync(srt, rel);
    subFilter = `,subtitles=${srt}:force_style='FontName=DejaVu Sans,FontSize=11,Outline=1.2,Shadow=0,MarginV=12,Alignment=2'`;
    for (const c of own) cues.push({ start: seg0 + c.offset, end: seg0 + c.offset + (c.duration || 1.5), text: cueText(c) });
  }
  const video = image && existsSync(image)
    ? ["-loop", "1", "-framerate", "24", "-t", String(frame.duration), "-i", image]
    : ["-f", "lavfi", "-t", String(frame.duration), "-i", "color=c=black:s=1920x1080:r=24"];
  const inputs = [...video];
  for (const c of clips) inputs.push("-i", resolve(root, "public" + c.src));
  let filter = "";
  const labels = [];
  clips.forEach((c, k) => { const fx = FX[fxByFile.get(c.src)]; filter += `[${k + 1}:a]aresample=44100,aformat=channel_layouts=mono${fx ? "," + fx : ""},adelay=${Math.round(c.offset * 1000)}|${Math.round(c.offset * 1000)}[d${k}];`; labels.push(`[d${k}]`); });
  if (clips.length) filter += `${labels.join("")}amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${frame.duration}[a]`;
  else filter = `anullsrc=r=44100:cl=mono,atrim=0:${frame.duration}[a]`;
  const cam = camera && image && existsSync(image) ? cameraMove(frame, frame.duration, i) : null;
  const look = cam
    ? `scale=2880:1620:force_original_aspect_ratio=increase,crop=2880:1620,zoompan=z='${cam.z}':x='${cam.x}':y='${cam.y}':d=1:s=1920x1080:fps=24`
    : "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2";
  run([...inputs, "-filter_complex", filter, "-map", "0:v", "-map", "[a]", "-t", String(frame.duration),
    "-vf", `${look}${subFilter},format=yuv420p`,
    "-c:v", "libx264", "-r", "24", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1", seg]);
  segments.push(seg);
  segmentsTotal += frame.duration;
}

const name = args.name || (args.scene ? `scene-${args.scene}` : args.from || args.to ? `scenes-${args.from || 1}-${args.to || "end"}` : "film");
const list = resolve(work, "list.txt");
writeFileSync(list, segments.map(s => `file '${s}'`).join("\n") + "\n");
const file = resolve(out, `neonoire-${name}.mp4`);
// One loudness pass over the whole cut, so whispered lines are audible next to spoken ones without
// each frame being levelled on its own (which would shout the quietest lines).
run(["-f", "concat", "-safe", "0", "-i", list, "-c:v", "copy", "-af", "loudnorm=I=-16:LRA=11:TP=-1.5", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", file]);
const total = segmentsTotal;
if (subs) writeFileSync(file.replace(/\.mp4$/, ".srt"), cues.map((c, k) => `${k + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join("\n"));
const voiced = frames.reduce((n, f) => n + (f.audio?.length || 0), 0);
console.log(`${file}: ${frames.length} frames, ${voiced} voiced lines, ${Math.round(total)}s`);
