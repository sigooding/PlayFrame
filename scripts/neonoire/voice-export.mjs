// Packages the voiced shots for lipsync / video generation (Kling and similar): one self-contained
// folder per voiced frame with the board still, the dialogue on the frame's own timeline, each line as a
// separate file, and a frame.json with the timings, the text and the shot data. Rebuilt from the repo,
// so nothing here needs committing.
//
//   node scripts/neonoire/voice-export.mjs               every voiced frame
//   node scripts/neonoire/voice-export.mjs --scene 74    one scene (also 25A, 99A ...)
//   node scripts/neonoire/voice-export.mjs --frame neonoire-shot-231
//
// Output: exports/neonoire/lipsync/<scene>/<shot>-<title>/{frame.jpg, dialogue.wav, lines/, frame.json}
// plus exports/neonoire/lipsync/index.json. Needs ffmpeg (FFMPEG=/path/to/ffmpeg).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readManifest } from "./voice.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith("--") ? [...out, [a.slice(2), all[i + 1]]] : out), []));
const ff = process.env.FFMPEG || "ffmpeg";
const bundle = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const manifest = readManifest(root);
const sceneTag = id => id.replace(/^neonoire-s/, "").toUpperCase();
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
const shotNo = f => Number(/\d+$/.exec(f.id)?.[0]);
const run = a => execFileSync(ff, ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });

// A lipsync model needs a face it can find: the wide, small-figure frames this film favours will not work.
const FACE = {
  "Extreme close-up": "good", "Close-up": "good", "Medium close-up": "good", "Medium": "good", "Over the shoulder": "good", "Two-shot": "ok",
  "Medium wide": "ok", "Full": "poor", "Wide": "poor", "Extreme wide": "poor", "Establishing": "poor", "Aerial": "poor", "POV": "n/a", "Insert": "n/a",
};

let frames = bundle.frames.filter(f => f.audio?.length);
if (args.scene) frames = frames.filter(f => sceneTag(f.sceneId) === String(args.scene).toUpperCase());
if (args.frame) frames = frames.filter(f => f.id === args.frame);
if (!frames.length) { console.error("No voiced frames selected."); process.exit(1); }

const out = resolve(root, "exports/neonoire/lipsync");
const index = [];
for (const frame of frames) {
  const lines = manifest.lines.filter(l => l.frameId === frame.id).sort((a, b) => a.offset - b.offset);
  const dir = resolve(out, sceneTag(frame.sceneId).toLowerCase(), `${String(shotNo(frame)).padStart(3, "0")}-${slug(frame.title)}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(resolve(dir, "lines"), { recursive: true });

  const image = frame.image?.startsWith("/images/") ? resolve(root, "public" + frame.image) : null;
  if (image && existsSync(image)) copyFileSync(image, resolve(dir, "frame.jpg"));

  // The frame's dialogue on its own timeline: silence, with each line dropped in at its offset (lossless).
  const inputs = [];
  let filter = "";
  lines.forEach((l, k) => {
    const src = resolve(root, "public" + l.file);
    inputs.push("-i", src);
    filter += `[${k}:a]aresample=44100,aformat=channel_layouts=mono,adelay=${Math.round(l.offset * 1000)}|${Math.round(l.offset * 1000)}[d${k}];`;
    copyFileSync(src, resolve(dir, "lines", `${String(k + 1).padStart(2, "0")}-${l.character.toLowerCase()}-${slug(l.text).slice(0, 32)}.${l.file.split(".").pop()}`));
  });
  filter += `${lines.map((_, k) => `[d${k}]`).join("")}amix=inputs=${lines.length}:normalize=0,apad,atrim=0:${frame.duration}[a]`;
  run([...inputs, "-filter_complex", filter, "-map", "[a]", "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", resolve(dir, "dialogue.wav")]);

  const meta = {
    frameId: frame.id, scene: sceneTag(frame.sceneId), title: frame.title, description: frame.description,
    image: image && existsSync(image) ? "frame.jpg" : null, sourceImage: frame.image, size: "1920x1080",
    duration: frame.duration, shotType: frame.shotType, lens: frame.lens, angle: frame.angle, movement: frame.movement,
    lighting: frame.lighting, characters: [...new Set(lines.map(l => l.character))],
    lipsync: { faceVisible: FACE[frame.shotType] || "unknown", note: FACE[frame.shotType] === "poor" ? "Wide frame with small figures: a lipsync model is unlikely to find a face. Consider a closer coverage shot of the speaker, or use this frame only for audio over motion." : "" },
    dialogueFile: "dialogue.wav",
    lines: lines.map((l, k) => ({
      n: k + 1, character: l.character, text: l.text, prompt: l.prompt, file: `lines/${String(k + 1).padStart(2, "0")}-${l.character.toLowerCase()}-${slug(l.text).slice(0, 32)}.${l.file.split(".").pop()}`,
      start: l.offset, end: l.duration ? Math.round((l.offset + l.duration) * 100) / 100 : null, duration: l.duration ?? null,
      voiceId: l.voice, model: l.model, generation: l.generation, status: l.status,
    })),
  };
  writeFileSync(resolve(dir, "frame.json"), JSON.stringify(meta, null, 2) + "\n");
  index.push({ dir: dir.replace(out + "/", ""), frameId: frame.id, scene: meta.scene, title: frame.title, duration: frame.duration, lines: lines.length, faceVisible: meta.lipsync.faceVisible });
}
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`${index.length} voiced frame(s) exported to ${out}`);
for (const i of index) console.log(`  ${i.dir}  (${i.lines} lines, ${i.duration}s, face: ${i.faceVisible})`);
