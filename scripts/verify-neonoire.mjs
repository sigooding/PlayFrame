// Offline regression checks for the NEONOIRE opening-scenes workspace.
//
//   npm run verify:neonoire
//
// Checks, with no server and no browser: the bundle is in step with the draft and the boards, the
// screenplay tab carries all seven scenes and each scene selects its own heading, every frame
// carries a shot type and a lens from the app's own libraries, every claimed keyframe is on disk,
// the cast links are reciprocal, and the prompt studio and CSV export handle the project.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(root, "node_modules/.cache/verify-neonoire");
mkdirSync(cache, { recursive: true });
const read = file => readFileSync(join(root, file), "utf8");
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== NEONOIRE — opening scenes ===");

// The builder proves the pages rebuild the draft and every quoted line is in it.
execFileSync(process.execPath, ["scripts/neonoire/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const project = JSON.parse(read("public/projects/neonoire-opening.json"));
const bundle = JSON.parse(read("public/projects/let-the-raptures-commence.json"));
const fountain = read("Neonoire_Opening.fountain");

const exportsFile = join(cache, "project.mjs");
await build({
  stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/prompt"; export * from "./src/lib/export"; export * from "./src/lib/seed"; export * from "./src/lib/structure"; export * from "./src/lib/types";', resolveDir: root },
  outfile: exportsFile, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const {
  validatePatch, sanitizeImport, buildFramePrompt, buildScenePrompt, shotListCsv, scenesInScript,
  starterProjects, sceneHeadings, normaliseSlugline, SHOT_TYPES, CAMERA_MOVEMENTS, CAMERA_ANGLES, LENSES, LIGHTING,
} = await import(pathToFileURL(exportsFile).href);

// ---------------------------------------------------------------- schema and ceilings
validatePatch(project);
assert.equal(project.acts.length, 1);
assert.equal(project.scenes.length, 7);
assert.equal(project.frames.length, 65);
assert.equal(project.characters.length, 8);
assert.equal(project.notes.length, 5);
assert.equal(project.brainstorm.length, 6);
assert.equal(project.moodboards.length, 4);
assert(project.scenes.every(scene => scene.actId === project.acts[0].id), "Every scene belongs to the opening act");
assert.equal(new Set(project.frames.map(frame => frame.id)).size, 65, "Frame ids are unique");
assert.equal(new Set(project.frames.map(frame => `${frame.sceneId}/${frame.title}`)).size, 65, "No two shots in a scene share a title");
pass(`the bundle validates: ${project.scenes.length} scenes, ${project.frames.length} shots, ${project.characters.length} cast, ${project.moodboards.length} boards`);

// ---------------------------------------------------------------- the screenplay
const map = scenesInScript(project, project.script);
assert.equal(map.size, project.scenes.length, `The screenplay should carry all ${project.scenes.length} scenes, found ${map.size}`);
for (const scene of project.scenes) {
  const hit = map.get(scene.id);
  assert(hit, `${scene.title} was not found in the screenplay`);
  const line = project.script.slice(project.script.lastIndexOf("\n", hit.start) + 1, hit.end);
  assert(sceneHeadings(scene).includes(normaliseSlugline(line)), `${scene.title} should select its own heading, got ${JSON.stringify(line)}`);
  assert(line.includes(scene.location), `${scene.title}'s heading should name its location`);
}
// The workspace script is the draft with the seven `#n#` markers removed, and nothing else changed.
const clean = fountain.replace(/ #\d+#(?=\n|$)/g, "");
assert.equal(project.script.replace(/\s+$/, ""), clean.replace(/\s+$/, ""), "The screenplay should be the draft, minus its scene-number markers");
for (const scene of project.scenes) assert(project.script.includes(`${scene.location} - ${scene.time}`), `${scene.title}'s slugline must survive in the script`);
pass(`the screenplay carries all 7 scenes, in order, each selecting its own slugline (${project.script.split(/\s+/).length} words)`);

// ---------------------------------------------------------------- frames, lenses, keyframes
for (const frame of project.frames) {
  assert(SHOT_TYPES.includes(frame.shotType), `${frame.title}: unknown shot type ${frame.shotType}`);
  assert(LENSES.includes(frame.lens), `${frame.title}: no lens from the library (${frame.lens})`);
  assert(CAMERA_MOVEMENTS.includes(frame.movement), `${frame.title}: unknown movement ${frame.movement}`);
  assert(CAMERA_ANGLES.includes(frame.angle), `${frame.title}: unknown angle ${frame.angle}`);
  assert(LIGHTING.includes(frame.lighting), `${frame.title}: unknown lighting ${frame.lighting}`);
  assert.equal(frame.durationIsEstimate, true, `${frame.title}: durations are estimates`);
  assert(project.scenes.some(scene => scene.id === frame.sceneId), `${frame.title} belongs to no scene`);
}
const onDisk = project.frames.filter(frame => frame.image);
const placeholders = project.frames.filter(frame => !frame.image);
for (const frame of onDisk) assert(existsSync(join(root, "public", frame.image)), `Missing keyframe: ${frame.image}`);
for (const frame of placeholders) {
  assert(/\(keyframe missing\)$/.test(frame.title), `${frame.title} should say its keyframe is missing`);
  assert(/KEYFRAME MISSING/.test(frame.notes) && frame.notes.includes(`public/images/neonoire/`), `${frame.title} should name the file it is waiting for`);
  assert.equal(frame.status, "Needs review", `${frame.title} is a placeholder and cannot be ready`);
}
const lenses = [...new Set(project.frames.map(frame => frame.lens))];
const types = [...new Set(project.frames.map(frame => frame.shotType))];
assert(lenses.length >= 4, "The opening should use at least four lens lengths");
assert(types.length >= 8, "The opening should use at least eight shot types");
pass(`every shot carries a type, lens, angle, movement and light (${lenses.join(", ")}; ${types.length} types)`);
pass(`${onDisk.length}/${project.frames.length} keyframes on disk, ${placeholders.length} honest placeholder cards holding their slots`);

// Passes are ten shots at a time, in screenplay order — the notes on every frame say which pass.
for (const [i, frame] of project.frames.entries()) {
  assert(frame.notes.includes(`Shot ${i + 1} of 65`), `Shot ${i + 1} should say where it sits in the running order`);
  assert(frame.notes.includes(`Pass ${Math.ceil((i + 1) / 10)} of 7`), `Shot ${i + 1} should name its pass`);
}
pass("passes run ten keyframes at a time, in screenplay order, and every frame carries its pass in the notes");

// ---------------------------------------------------------------- cast, sheets and continuity
const byId = new Map(project.characters.map(c => [c.id, c]));
for (const character of project.characters) {
  for (const relation of character.relations || []) {
    const other = byId.get(relation.targetId);
    assert(other, `${character.name} links to a missing character`);
    assert((other.relations || []).some(r => r.targetId === character.id), `${character.name} → ${other.name} is not reciprocal`);
  }
}
for (const key of ["mara", "vera"]) {
  const sheet = `public/images/neonoire/sheets/${key}.jpg`;
  assert(existsSync(join(root, sheet)), `Missing continuity sheet: ${sheet}`);
  assert.equal(byId.get(`neonoire-${key}`).image, `/images/neonoire/sheets/${key}.jpg`, `${key} should carry the sheet the frames are generated against`);
}
assert(byId.get("neonoire-mara").description.includes("American") && byId.get("neonoire-vera").description.includes("American"), "Mara and Vera are American");
assert(byId.get("neonoire-jack").name === "Jack Voss", "Jack Voss is on the cast card for the photograph");
assert(project.scenes.find(s => s.id === "neonoire-s4").characters.includes("neonoire-jack"), "Jack belongs to the apartment scene, through the photograph");
assert(project.notes.some(note => /Continuity — the Voss family/.test(note.title)), "The continuity notes should travel with the project");
pass(`cast links are reciprocal; both sisters carry a continuity sheet and the family rule is in the notes`);

// The series workspace that shipped before this one is untouched by any of it.
assert.equal(bundle.id, "74a9cb34-9e80-4a04-a614-000000000014");
assert.equal(bundle.frames.length, 526);
assert.equal(bundle.scenes.length, 42);
assert(starterProjects.some(p => p.id === project.id), "A fresh workspace seeds NEONOIRE");
pass("the series bundle is unchanged, and NEONOIRE ships beside it as its own project");

// ---------------------------------------------------------------- prompts, CSV and import
const models = ["minimax-h3", "seedance", "kling", "runway", "veo", "sdxl", "flux", "midjourney"];
for (const model of models) {
  const frame = project.frames.find(f => f.characters.length) || project.frames[0];
  const prompt = buildFramePrompt(project, frame, model);
  assert(prompt && prompt.length > 40 && !/undefined|NaN/.test(prompt), `Frame prompt for ${model} is not clean`);
  const scenePrompt = buildScenePrompt(project, project.scenes[0], model);
  assert(scenePrompt && scenePrompt.length > 40 && !/undefined|NaN/.test(scenePrompt), `Scene prompt for ${model} is not clean`);
}
const csv = shotListCsv(project);
// Every cell is quoted, and a production note may itself contain newlines, so rows are counted by
// the fields they must carry rather than by lines.
const csvHeader = csv.replace(/^\uFEFF/, "").split("\n")[0];
assert(csvHeader.startsWith('"Shot","Act","Sequence","Scene"'), "The shot list should open with its own header row");
for (const frame of project.frames) {
  assert(csv.includes(`"${frame.shotType}"`) && csv.includes(`"${frame.lens}"`), `${frame.title} should reach the shot list with its framing`);
  assert(csv.includes(`"${frame.title}"`), `${frame.title} is missing from the shot list`);
}
assert(csv.includes('"EXT. BACKSTREET, KANDA"') && csv.includes('"INT. POLICE STATION, DETECTIVES\' ROOM"'), "Both ends of the running order should be in the shot list");
const imported = sanitizeImport(project);
assert.equal(imported.frames.length, 65);
assert.equal(imported.scenes.length, 7);
pass(`prompts for ${models.length} models, the shot list CSV and a project re-import all handle the workspace`);

console.log("\nAll NEONOIRE checks passed.");
