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
await build({ stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/frame-order"; export * from "./src/lib/prompt"; export * from "./src/lib/styles"; export * from "./src/lib/types"; export * from "./src/lib/hangar";', resolveDir: root }, outfile: lib, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning" });
const { validatePatch, isUuid, MAX_FRAMES, MAX_SCENES, framesInSceneOrder, buildFramePrompt, buildScenePrompt, visualStyle, VISUAL_STYLES, TRANSITIONS, PLATFORMS, deliveredHangarImageUpdates } = await import(`file://${lib}`);

assert(isUuid(project.id));
validatePatch(project);
pass("the bundle is a valid project");
assert(project.frames.length <= MAX_FRAMES && project.scenes.length <= MAX_SCENES);
assert.equal(project.scenes.length, 8);
assert.equal(project.frames.length, 39);
assert.deepEqual(framesInSceneOrder(project.frames, project.scenes).map(f => f.id), project.frames.map(f => f.id), "frames are already in scene order");
const blackFrame = "/images/hangar/shot-01-03-black.png";
assert(project.frames.slice(0, 3).every(f => f.image === blackFrame), "the first three audio-led shots stay completely black");
assert(project.frames.slice(3, 12).every(f => f.image === `/images/hangar/shot-${String(f.shotNumber).padStart(2, "0")}.jpg`), "the first illustrated sequence has a unique image per shot");
assert(project.frames.filter(f => f.image).length >= 12, "the initial pass includes the three black holds and nine illustrated shots");
for (const frame of project.frames.filter(f => f.image)) {
  assert(frame.image.startsWith("/images/hangar/"), `shot ${frame.shotNumber} uses a project-owned image`);
  assert(existsSync(join(root, "public", frame.image.slice(1))), `shot ${frame.shotNumber}'s image exists on disk`);
}
assert(project.frames.every(f => f.status === "Needs review"), "generated images are not treated as director-approved");
assert(project.frames.every(f => project.scenes.some(s => s.id === f.sceneId)), "every frame belongs to a scene");
assert.equal(new Set(project.frames.map(f => f.shotNumber)).size, project.frames.length, "shot numbers are unique");
pass(`8 scenes, 39 shots, ${project.frames.filter(f => f.image).length} pictured frames, all still reviewable`);

const slotMarker = "No picture yet: this card holds the shot's slot.";
const preImageDescription = "The cold open of an animated 1975 feature: a pilot who sounds amazed, a crate marked INERT, a truck, a near-miss, and a crate that is empty. About six minutes, 8 scenes, 39 shots, almost no dialogue, in the house style Painted Americana '75. No pictures yet.";
const savedBeforeDelivery = {
  ...project,
  coverImage: "",
  description: preImageDescription,
  frames: project.frames.map(frame => ({
    ...frame,
    image: "",
    notes: frame.notes.replace(/This full-black image is intentional; sound and pacing carry the beat\.|An illustrated study is attached; keep it Needs review until composition and continuity are approved\./, slotMarker),
  })),
};
savedBeforeDelivery.frames[3].notes += "\nDirector crop note: keep the apron horizon low.";
savedBeforeDelivery.frames[5].image = "/images/custom-crate-study.jpg";
savedBeforeDelivery.frames[12].notes = savedBeforeDelivery.frames[12].notes.replace(slotMarker, "Director intentionally left this frame blank.");
const imagePatch = deliveredHangarImageUpdates(savedBeforeDelivery);
assert(imagePatch?.frames, "delivered storyboard art is available as a migration");
assert.equal(imagePatch.frames[0].image, blackFrame, "the intended black slate fills an untouched placeholder");
assert.equal(imagePatch.frames[3].image, project.frames[3].image, "an untouched shot receives its delivered illustration");
assert(imagePatch.frames[3].notes.includes("Director crop note"), "a writer's note survives delivery");
assert.equal(imagePatch.frames[5].image, "/images/custom-crate-study.jpg", "a custom image is never overwritten");
assert.equal(imagePatch.frames[12].image, "", "an intentional blank without its placeholder marker stays blank");
assert.equal(imagePatch.coverImage, project.coverImage, "the empty cover receives the establishing image");
assert.equal(imagePatch.description, project.description, "only the known untouched project description is refreshed");
pass("saved copies receive only delivered images in explicitly untouched slots; custom images and notes stay safe");

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
assert(!style.photoreal && /gouache/.test(style.prompt) && /grounded weight/.test(style.prompt) && /atmospheric depth/.test(style.prompt), "the style is painted, grounded, and model-neutral");
assert.equal(style.image, "/images/styles/painted-americana-75.jpg", "the reusable style has its own reference image");
assert(existsSync(join(root, "public", style.image.slice(1))), "the style reference image is on disk");
assert(!/Ohio|1975/.test(style.prompt), "the reusable style does not lock future projects to this story's setting");
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
