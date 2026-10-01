// Builds an animatic from the bundle: each frame's image held for its duration, its recorded dialogue
// mixed in at the offsets in the manifest. Output goes to exports/neonoire/ (not committed).
//
//   node scripts/neonoire/animatic.mjs --scene 98            one scene (also 25A, 99A ...)
//   node scripts/neonoire/animatic.mjs --from 96 --to 100    a range of scene numbers
//   node scripts/neonoire/animatic.mjs                       the whole film (long)
//   --project saved-project.json --output cut.mp4           export current saved edits/order
//   --resolution 720p --hold --no-subs --no-camera          match storyboard playback, faster render
//   --camera          slow centred push or pull for shots whose Movement is not Static (no sideways drift)
//   --crf 16 --preset slow --audio-bitrate 192k             best quality (defaults: 20, veryfast, 128k)
//   --no-audio --no-music --no-credits                      optional sound/credit controls
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
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

import { orderAnimaticFrames, animaticSceneTag, cameraMove } from "../animatic/timeline.mjs";
import { readManifest } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const argv = process.argv.slice(2);
const args = Object.fromEntries(argv.flatMap((arg, i) => arg.startsWith("--") ? [[arg.slice(2), argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true]] : []));
const ff = process.env.FFMPEG || "ffmpeg";
const input = args.project ? resolve(args.project) : resolve(root, "public/projects/neonoire-opening.json");
const bundle = JSON.parse(readFileSync(input, "utf8"));
const width = args.resolution === "720p" ? 1280 : 1920, height = args.resolution === "720p" ? 720 : 1080;
const dimensions = `${width}x${height}`;
const publicRoot = resolve(root, "public");
const mediaRoot = args["media-root"] ? resolve(args["media-root"]) : null;
function localMedia(src) {
  if (mediaRoot && typeof src === "string" && src.startsWith(mediaRoot + "/")) {
    const rel = relative(mediaRoot, resolve(src));
    if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Upload must stay inside the export media folder.");
    return resolve(src);
  }
  if (typeof src !== "string" || !/^\/(images|audio)\//.test(src)) return null;
  const path = resolve(publicRoot, `.${src}`), rel = relative(publicRoot, path);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Media must stay inside public/.");
  return path;
}
const hasScore = bundle.scenes.some(scene => /^neonoire-s\d+[a-z]?$/i.test(scene.id));
const sceneNo = id => { const m = /^neonoire-s(\d+)([a-z]?)$/.exec(id); return m ? Number(m[1]) : NaN; };
const sceneTag = id => animaticSceneTag(bundle, id);

// Match the app: scene order with the saved/manual order inside each scene preserved.
let frames = orderAnimaticFrames(bundle);
if (args["scene-id"]) frames = frames.filter(f => f.sceneId === args["scene-id"]);
else if (args.scene) frames = frames.filter(f => sceneTag(f.sceneId) === String(args.scene).toUpperCase());
else if (args.from || args.to) frames = frames.filter(f => sceneNo(f.sceneId) >= Number(args.from || 0) && sceneNo(f.sceneId) <= Number(args.to || 1e9));
if (!frames.length) { console.error("No frames selected."); process.exit(1); }

const out = args.output ? dirname(resolve(args.output)) : resolve(root, "exports/neonoire");
const work = resolve(out, ".work");
mkdirSync(work, { recursive: true });
const run = a => execFileSync(ff, ["-y", "-loglevel", "error", "-filter_threads", "1", "-filter_complex_threads", "1", ...a], { stdio: "inherit" });
const segments = [];
let segmentsTotal = 0;
let voiced = 0;
const sceneSpan = {}; // scene tag -> [start, end] seconds in the cut, for music cues
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
const LEAD = Number(args.lead || 0.7), TAIL = Number(args.tail || 0.9);
// Tightened timing for one frame: the length it plays and its clips shifted to match.
// Scenes under a music cue (docs/neonoire/music/cues.json) keep their board durations on silent frames: the stills play to the song.
const holdScenes = new Set();
{
  const cf = resolve(root, "docs/neonoire/music/cues.json");
  if (hasScore && args["no-music"] === undefined && existsSync(cf)) for (const c of JSON.parse(readFileSync(cf, "utf8")).cues || []) {
    const a = Number(String(c.from).replace(/\D/g, "")), b = Number(String(c.to).replace(/\D/g, ""));
    if (a && b && !/CREDITS/i.test(String(c.from))) for (let n = a; n <= b; n++) holdScenes.add(n);
  }
}
function pace(frame, clips) {
  if (!tight) return { dur: frame.duration, clips };
  if (!clips.length) return { dur: holdScenes.has(sceneNo(frame.sceneId)) ? frame.duration : Math.min(frame.duration, silentMax), clips };
  const shift = Math.max(0, Math.min(...clips.map(c => c.offset)) - LEAD);
  const end = Math.max(...clips.map(c => c.offset + (c.duration || 0))) - shift;
  return { dur: Math.min(frame.duration, Math.round((end + TAIL) * 10) / 10) || frame.duration, clips: clips.map(c => ({ ...c, offset: c.offset - shift })) };
}

// Camera simulation is opt-in. Even with --camera, explicit Static shots stay flat.
const camera = args.camera !== undefined && args["no-camera"] === undefined;
console.log(JSON.stringify({ type: "progress", completed: 0, total: frames.length, phase: "frames" }));

for (let [i, frame] of frames.entries()) {
  const image = localMedia(frame.image);
  const seg = resolve(work, `seg-${String(i).padStart(4, "0")}.mp4`);
  const paced = pace(frame, (args["no-audio"] !== undefined ? [] : (frame.audio || [])).filter(c => localMedia(c.src) && existsSync(localMedia(c.src))));
  const clips = paced.clips;
  voiced += clips.length;
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
    : ["-f", "lavfi", "-t", String(frame.duration), "-i", `color=c=black:s=${dimensions}:r=24`];
  const inputs = [...video];
  for (const c of clips) inputs.push("-i", localMedia(c.src));
  let filter = "";
  const labels = [];
  clips.forEach((c, k) => { const fx = FX[fxByFile.get(c.src)]; filter += `[${k + 1}:a]aresample=44100,aformat=channel_layouts=mono${fx ? "," + fx : ""},adelay=${Math.round(c.offset * 1000)}|${Math.round(c.offset * 1000)}[d${k}];`; labels.push(`[d${k}]`); });
  if (clips.length) filter += `${labels.join("")}amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${frame.duration}[a]`;
  else filter = `anullsrc=r=44100:cl=mono,atrim=0:${frame.duration}[a]`;
  const cam = camera && image && existsSync(image) ? cameraMove(frame, frame.duration, i) : null;
  const look = cam
    ? `scale=2880:1620:force_original_aspect_ratio=increase,crop=2880:1620,zoompan=z='${cam.z}':x='${cam.x}':y='${cam.y}':d=1:s=${dimensions}:fps=24`
    : `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
  run([...inputs, "-filter_complex", filter, "-map", "0:v", "-map", "[a]", "-t", String(frame.duration),
    "-vf", `${look}${subFilter},format=yuv420p`,
    "-c:v", "libx264", "-preset", String(args.preset || "veryfast"), "-crf", String(args.crf || 20), "-threads", "2", "-r", "24", "-c:a", "aac", "-b:a", String(args["audio-bitrate"] || "128k"), "-ar", "44100", "-ac", "1", seg]);
  const tag = sceneTag(frame.sceneId);
  sceneSpan[tag] = [sceneSpan[tag]?.[0] ?? segmentsTotal, segmentsTotal + frame.duration];
  segments.push(seg);
  segmentsTotal += frame.duration;
  console.log(JSON.stringify({ type: "progress", completed: i + 1, total: frames.length, phase: "frames" }));
}

// End credits: a cue with "from": "CREDITS" (and "after": the last scene, "length": seconds, "lines": [...]) adds a black tail
// after that scene, with the title and credit lines, and lets the song play over it. Only when this cut ends on that scene.
{
  const cf = resolve(root, "docs/neonoire/music/cues.json");
  const cc = hasScore && args["no-credits"] === undefined && args["no-music"] === undefined && existsSync(cf) ? (JSON.parse(readFileSync(cf, "utf8")).cues || []).find(c => String(c.from).toUpperCase() === "CREDITS") : null;
  const lastTag = frames.length ? sceneTag(frames[frames.length - 1].sceneId) : "";
  if (cc && lastTag === String(cc.after).toUpperCase() && existsSync(resolve(root, cc.file))) {
    const len = cc.length || 120, seg = resolve(work, "seg-credits.mp4");
    // drawtext is not in every ffmpeg build; libass (subtitles) is, so the credit lines are an .ass file.
    const ass = resolve(work, "credits.ass");
    const t = k => `0:00:${String(2 + k * 2).padStart(2, "0")}.00`;
    const lines = (cc.lines || ["NOBODY'S WITNESS"]).map(x => String(x).replace(/[{}\\]/g, ""));
    writeFileSync(ass, `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,OutlineColour,BackColour,Bold,Alignment,MarginV\n` +
      `Style: Title,DejaVu Sans,96,&H00FFFFFF,&H00000000,&H00000000,1,5,0\nStyle: Sub,DejaVu Sans,40,&H00CCCCCC,&H00000000,&H00000000,0,5,0\n\n[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n` +
      lines.map((x, k) => `Dialogue: 0,${t(k)},0:02:${String(20 + k).padStart(2, "0")}.00,${k ? "Sub" : "Title"},,0,0,${k ? 0 : 0},,{\\fad(1800,1800)\\pos(960,${k ? 600 + (k - 1) * 70 : 440})}${x}`).join("\n") + "\n");
    run(["-f", "lavfi", "-t", String(len), "-i", `color=c=black:s=${dimensions}:r=24`, "-f", "lavfi", "-t", String(len), "-i", "anullsrc=r=44100:cl=mono",
      "-vf", `subtitles=${ass},format=yuv420p`, "-c:v", "libx264", "-preset", String(args.preset || "veryfast"), "-crf", String(args.crf || 20), "-threads", "2", "-r", "24", "-c:a", "aac", "-b:a", String(args["audio-bitrate"] || "128k"), "-ar", "44100", "-ac", "1", "-shortest", seg]);
    sceneSpan.CREDITS = [segmentsTotal, segmentsTotal + len];
    segments.push(seg);
    segmentsTotal += len;
  }
}

const name = args.name || (args.scene ? `scene-${args.scene}` : args.from || args.to ? `scenes-${args.from || 1}-${args.to || "end"}` : "film");
const list = resolve(work, "list.txt");
writeFileSync(list, segments.map(s => `file '${s}'`).join("\n") + "\n");
const file = args.output ? resolve(args.output) : resolve(out, `neonoire-${name}.mp4`);
console.log(JSON.stringify({ type: "progress", completed: frames.length, total: frames.length, phase: "mixing" }));
// One loudness pass over the whole cut, so whispered lines are audible next to spoken ones without
// each frame being levelled on its own (which would shout the quietest lines).
// Music cues (docs/neonoire/music/cues.json): { file, from: "72", to: "73", gain, fadeOut }. The bed starts at the first
// frame of `from`, ends at the last frame of `to` (clamped to what is in this cut), and ducks under dialogue.
const cuesFile = resolve(root, "docs/neonoire/music/cues.json");
const music = hasScore && args["no-music"] === undefined && existsSync(cuesFile) ? JSON.parse(readFileSync(cuesFile, "utf8")).cues || [] : [];
const live = music.map(c => {
  const a = sceneSpan[String(c.from).toUpperCase()], b = sceneSpan[String(c.to || c.from).toUpperCase()];
  return a && b && existsSync(resolve(root, c.file)) ? { ...c, start: c.startOffset === undefined ? a[0] : (c.startOffset < 0 ? a[1] : a[0]) + c.startOffset, end: b[1] } : null;
}).filter(Boolean);
if (!live.length) run(["-f", "concat", "-safe", "0", "-i", list, "-c:v", "copy",
  // loudnorm has no finite loudness target on very short pure silence; copying the silent AAC is exact.
  ...(voiced && segmentsTotal >= 3 ? ["-af", "loudnorm=I=-16:LRA=11:TP=-1.5", "-c:a", "aac", "-b:a", "128k", "-ar", "44100"] : ["-c:a", "copy"]),
  "-movflags", "+faststart", file]);
else {
  const ins = ["-f", "concat", "-safe", "0", "-i", list];
  let f = "[0:a]asplit=2[dlg][sc];";
  live.forEach((c, k) => {
    ins.push("-i", resolve(root, c.file));
    const len = c.end - c.start, fo = c.fadeOut ?? 3;
    f += `[${k + 1}:a]aresample=44100,aformat=channel_layouts=stereo,atrim=${c.seek || 0}:${((c.seek || 0) + len).toFixed(2)},asetpts=PTS-STARTPTS,afade=t=in:d=${c.fadeIn ?? 1.5},afade=t=out:st=${Math.max(0, len - fo).toFixed(2)}:d=${fo},volume=${c.gain ?? 0.35},adelay=${Math.round(c.start * 1000)}|${Math.round(c.start * 1000)}[m${k}];`;
  });
  f += live.map((_, k) => `[m${k}]`).join("") + `amix=inputs=${live.length}:normalize=0[mus];[sc]aformat=channel_layouts=mono,anull[scm];[mus][scm]sidechaincompress=threshold=0.02:ratio=10:attack=30:release=600[duck];[dlg]aformat=channel_layouts=stereo[dl];[dl][duck]amix=inputs=2:normalize=0,loudnorm=I=-16:LRA=11:TP=-1.5[out]`;
  run([...ins, "-filter_complex", f, "-map", "0:v", "-map", "[out]", "-c:v", "copy", "-c:a", "aac", "-b:a", String(args["audio-bitrate"] || "160k"), "-ar", "44100", "-movflags", "+faststart", file]);
  console.log(`music: ${live.map(c => `${c.file} ${c.start.toFixed(1)}s-${c.end.toFixed(1)}s`).join("; ")}`);
}
const total = segmentsTotal;
if (subs) writeFileSync(file.replace(/\.mp4$/, ".srt"), cues.map((c, k) => `${k + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join("\n"));
console.log(`${file}: ${frames.length} frames, ${voiced} voiced lines, ${Math.round(total)}s`);
