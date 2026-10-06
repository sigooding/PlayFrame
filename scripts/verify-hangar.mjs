// npm run verify:hangar: the cold-open workspace's schema, ceilings, source fidelity and isolation.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(join(root, file), "utf8");
const project = JSON.parse(read("public/projects/hangar-cold-open.json"));
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== The cold-open workspace ===");
execFileSync(process.execPath, ["scripts/hangar/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const cache = join(root, "node_modules/.cache/verify-hangar");
mkdirSync(cache, { recursive: true });
const lib = join(cache, "lib.mjs");
await build({ stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/frame-order"; export * from "./src/lib/prompt"; export * from "./src/lib/styles"; export * from "./src/lib/types";', resolveDir: root }, outfile: lib, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning" });
const { validatePatch, isUuid, MAX_FRAMES, MAX_SCENES, framesInSceneOrder, buildFramePrompt, buildScenePrompt, visualStyle, VISUAL_STYLES, TRANSITIONS, PLATFORMS } = await import(`file://${lib}`);

assert(isUuid(project.id));
validatePatch(project);
pass("the bundle is a valid project");
assert(project.frames.length <= MAX_FRAMES && project.scenes.length <= MAX_SCENES);
assert.equal(project.scenes.length, 8);
assert.equal(project.frames.length, 39);
assert.deepEqual(framesInSceneOrder(project.frames, project.scenes).map(f => f.id), project.frames.map(f => f.id), "frames are already in scene order");
// The pictures: read the registry (the one source of truth) and hold every frame to it. A shot with
// a delivered picture carries its path, the status Ready, the file on disk at 1920x1080 and its own
// caveat on the card; a shot still waiting keeps image "" and "Needs review" and borrows nothing.
const registry = await import(`file://${join(root, "scripts/hangar/frame-registry.mjs")}`);
const deliveredNumbers = Object.keys(registry.FRAMES).map(Number).sort((a, b) => a - b);
/** JPEG dimensions without a decoder: the first SOF marker carries the frame size. */
const jpegSize = file => {
  const buffer = readFileSync(file);
  for (let i = 2; i + 9 < buffer.length;) {
    if (buffer[i] !== 0xff) { i += 1; continue; }
    const marker = buffer[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
    i += 2 + buffer.readUInt16BE(i + 2);
  }
  throw new Error(`no JPEG frame header in ${file}`);
};
for (const frame of project.frames) {
  const entry = registry.FRAMES[frame.shotNumber];
  if (!entry) {
    assert.equal(frame.image, "", `shot ${frame.shotNumber} waits for its picture and borrows none`);
    assert.equal(frame.status, "Needs review", `shot ${frame.shotNumber} still says it needs its picture`);
    continue;
  }
  assert.equal(frame.image, entry.image, `shot ${frame.shotNumber} carries its own picture's path`);
  assert.equal(frame.status, "Ready", `shot ${frame.shotNumber} with a picture on disk is Ready`);
  assert(entry.image.startsWith("/images/hangar/"), `shot ${frame.shotNumber}'s picture lives under /images/hangar/`);
  const file = join(root, "public", entry.image);
  assert(existsSync(file), `shot ${frame.shotNumber}'s picture is on disk: ${entry.image}`);
  assert.deepEqual(jpegSize(file), { width: 1920, height: 1080 }, `shot ${frame.shotNumber}'s picture is 1920x1080 full-bleed 16:9`);
  assert(entry.note && frame.notes.includes(`\n${entry.note}`), `shot ${frame.shotNumber} carries its picture's caveat in its notes`);
}
assert(deliveredNumbers.every(n => n >= 1 && n <= project.frames.length), "every delivered picture belongs to a shot in the open");
pass(`${deliveredNumbers.length} of ${project.frames.length} shots have their picture (${deliveredNumbers.join(", ")}); the rest hold their slots`);
for (const character of project.characters) {
  const sheet = registry.CAST[character.id.replace(/^hangar-/, "")];
  if (!sheet) { assert.equal(character.image, undefined, `${character.name} borrows no sheet`); continue; }
  assert.equal(character.image, sheet.image, `${character.name} carries their own cast sheet`);
  const file = join(root, "public", sheet.image);
  assert(sheet.image.startsWith("/images/hangar/sheets/") && existsSync(file), `${character.name}'s cast sheet is on disk: ${sheet.image}`);
  assert.deepEqual(jpegSize(file), { width: 1920, height: 1080 }, `${character.name}'s cast sheet is 1920x1080`);
}
pass(`${project.characters.filter(c => registry.CAST[c.id.replace(/^hangar-/, "")]).length} of ${project.characters.length} cast carry a sheet`);
assert(project.frames.every(f => project.scenes.some(s => s.id === f.sceneId)), "every frame belongs to a scene");
assert.equal(new Set(project.frames.map(f => f.shotNumber)).size, project.frames.length, "shot numbers are unique");
pass("8 scenes, 39 shots, in order, each with its own picture or its own empty slot");

const text = project.script;
for (const word of ["alien", "robot", "UFO"]) {
  const lines = text.split("\n").filter(line => new RegExp(`\\b${word}\\b`, "i").test(line) && !line.includes("never says") && !line.includes("Nobody in this film"));
  assert.equal(lines.length, 0, `nobody says "${word}" in the open`);
}
assert(!project.frames.some(f => /\b(alien|robot|ufo)\b/i.test(f.description + f.title)), "no shot names it");
assert(project.frames.filter(f => /flare/i.test(f.description)).length >= 3 && !/(?<!not )flashlight/i.test(project.frames.map(f => f.description).join(" ")), "flares, never flashlights");
pass("nothing is ever named, and the light outdoors is flares");


// The house style and the shot details: every scene and shot carries the style, a mood, a lighting
// direction and a deliberate transition, and the prompts built from them stay clean.
const style = visualStyle("hangar");
assert.equal(style.id, "hangar", "the Painted Americana '75 style exists in the library");
assert.equal(VISUAL_STYLES.filter(entry => entry.id === "hangar").length, 1);
assert(!style.photoreal && /gouache/.test(style.prompt) && /Iron Giant/.test(style.prompt) && /Ghibli/.test(style.prompt), "the style is the painted, weighty look from the brief");
assert(project.scenes.every(scene => scene.style === "hangar" && scene.lightingNotes && scene.lightingNotes.length <= 1000), "every scene carries the style and a lighting direction");
assert(project.frames.every(frame => frame.style === "hangar"), "every shot carries the style");
assert(project.frames.every(frame => frame.mood && frame.mood.length <= 300), "every shot has a mood");
assert(project.frames.every(frame => frame.lightingNotes && frame.lightingNotes.length <= 1000 && frame.lighting), "every shot has a lighting direction");
assert(project.frames.every(frame => frame.notes.includes("\nFraming: ") && frame.notes.startsWith("Sound: ")), "every shot carries framing and sound direction");
assert(project.frames.every(frame => TRANSITIONS.includes(frame.transition)), "every transition is one the app knows");
assert.equal(project.frames[3].transition, "Fade in", "the hangar fades up out of the black, as the screenplay says");
assert(project.frames.filter(frame => frame.transition !== "Cut").length >= 6, "the non-cut transitions are chosen, not left to default");
assert.equal(project.notes.find(note => /visual|look|style|palette|cinematograph/i.test(`${note.title} ${(note.tags || []).join(" ")}`)).id, "hangar-note-look", "the prompt's palette line comes from the look note, not a rules note");
pass("every scene and shot carries the house style, a mood, a lighting direction and a chosen transition");

const bad = /\b(alien|robot|ufo|saucer|spaceship)\b/i;
for (const platform of PLATFORMS) {
  for (const frame of project.frames) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(prompt.length > 80, `${platform.id}: shot ${frame.shotNumber} builds a prompt`);
    assert(!bad.test(prompt), `${platform.id}: shot ${frame.shotNumber}'s prompt names the thing in the crate`);
    assert(/gouache/i.test(prompt), `${platform.id}: shot ${frame.shotNumber}'s prompt carries the style`);
  }
}
for (const scene of project.scenes) assert(!bad.test(buildScenePrompt(project, scene, "generic")), `scene ${scene.number}'s prompt names it`);
const image = buildFramePrompt(project, project.frames[17], "midjourney");
assert(/Painted, not photographed/.test(image) && /strobing/.test(image) && /Panic, then nothing/.test(image), "an image prompt carries the look note, the lighting direction and the mood");
const video = buildFramePrompt(project, project.frames[17], "generic");
assert(/handheld/i.test(video) && /strobing/.test(video), "a video prompt carries the camera and the lighting");
const talk = buildFramePrompt(project, project.frames[11], "hailuo");
assert(/Trucker \(S1\) says in a dry manner: <d>\[English\] Thirty years driving/.test(talk), "the cue lines in a shot's notes become spoken lines in a video prompt");
assert(!/Framing \(S\d\) says|Sound \(S\d\) says/.test(talk), "the notes' labels are not mistaken for speakers");
assert(/AM radio low under it/.test(talk), "the sound line becomes the soundscape");
pass(`prompts for ${PLATFORMS.length} platforms × ${project.frames.length} shots carry the style and never name the thing`);

const neonoire = JSON.parse(read("public/projects/neonoire-opening.json"));
assert.notEqual(project.id, neonoire.id);
assert(!project.script.includes("Nobody's Witness") && !JSON.stringify(project).includes("/images/neonoire/"), "nothing leaks across from the other project");
pass("isolated from Nobody's Witness: its images, ids and script are untouched");
console.log("\nAll cold-open checks passed.");
