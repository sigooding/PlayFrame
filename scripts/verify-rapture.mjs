// Offline canon, schema, prompt, export, asset and persistence regression checks.
// npm run verify:rapture; add --live to check the running HTTP app too (read-only).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(root, "node_modules/.cache/verify-rapture");
mkdirSync(cache, { recursive: true });
const read = file => readFileSync(join(root, file), "utf8");
const project = JSON.parse(read("public/projects/let-the-raptures-commence.json"));
const source = read("docs/rapture/scenes/ep4-number-fourteen.md");
const original = read("docs/rapture/scenes/archive/ep4-number-fourteen-v1.md");
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== Rapture series workspace ===");
execFileSync(process.execPath, ["scripts/rapture/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const exportsFile = join(cache, "project.mjs");
await build({
  stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/prompt"; export * from "./src/lib/export"; export * from "./src/lib/seed"; export * from "./src/lib/relations";', resolveDir: root },
  outfile: exportsFile, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const { validatePatch, sanitizeImport, isUuid, PLATFORMS, buildFramePrompt, buildScenePrompt, describeLocation, shotListCsv, starterProjects, converseRelation } = await import(pathToFileURL(exportsFile));

assert(isUuid(project.id));
assert.equal(project.acts.length, 8);
assert.equal(project.characters.length, 20);
assert.equal(project.frames.length, 13);
assert.equal(project.scenes.length, 32);
assert.equal(project.moodboards.length, 9);
assert.equal(starterProjects.length, 4);
assert.equal(starterProjects.filter(p => p.id === project.id).length, 1);
assert.equal(starterProjects[0].title, "The Last Light", "Existing starter ordering must not change");
validatePatch(project);
const imported = sanitizeImport(JSON.parse(JSON.stringify(project)));
validatePatch(imported);
assert.equal(imported.script, project.script);
assert.equal(imported.frames.length, 13);
assert.deepEqual(imported.frames.map(f => [f.id, f.sceneId, f.characters, f.durationIsEstimate]), project.frames.map(f => [f.id, f.sceneId, f.characters, f.durationIsEstimate]));
pass("portable bundle validates and survives the existing backup/import path");

const unique = (items, label) => assert.equal(new Set(items.map(i => i.id)).size, items.length, `${label} IDs must be unique`);
for (const key of ["acts", "scenes", "frames", "characters", "notes", "moodboards", "brainstorm"]) unique(project[key], key);
const ids = key => new Set(project[key].map(x => x.id));
const acts = ids("acts"), scenes = ids("scenes"), cast = ids("characters"), ideas = ids("brainstorm");
for (const scene of project.scenes) {
  assert(acts.has(scene.actId));
  for (const id of scene.characters || []) assert(cast.has(id));
}
for (const frame of project.frames) {
  assert(scenes.has(frame.sceneId));
  for (const id of frame.characters) assert(cast.has(id));
}
for (const person of project.characters) {
  for (const relation of person.relations) {
    const other = project.characters.find(c => c.id === relation.targetId);
    assert(other, "Relationship target must exist");
    assert(other.relations.some(r => r.targetId === person.id && r.kind === converseRelation[relation.kind]), "Both relationship directions must agree");
  }
}
for (const node of project.brainstorm) for (const id of node.connections) assert(ideas.has(id));
for (const note of project.notes) for (const link of note.connections || []) assert(scenes.has(link.targetId) || ideas.has(link.targetId) || cast.has(link.targetId));
for (const board of project.moodboards) {
  if (board.sceneId) assert(scenes.has(board.sceneId));
  if (board.actId) assert(acts.has(board.actId));
  unique(board.items, board.title);
}
pass("eight episode outlines, cast relationships, scene/shot links and object map are consistent");

const numbered = text => [...text.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)].map(m => m[0].trim());
const currentShots = numbered(source), oldShots = numbered(original);
assert.equal(currentShots.length, 13);
for (let i = 0; i < currentShots.length; i++) {
  if (i !== 0 && i !== 11) assert.equal(currentShots[i], oldShots[i], `Shot ${i + 1} must not be rewritten`);
  assert(project.frames[i].notes.includes(currentShots[i]));
}
const pauses = text => [...text.matchAll(/A (\d+)-second pause/g)].map(m => Number(m[1]));
assert.deepEqual(pauses(source), pauses(original));
assert.deepEqual(pauses(project.script), pauses(original));
const dialogue = text => text.split("\n").map(l => l.trim()).filter(l => /^(DANNY|JODIE|THE WOMAN):/.test(l));
assert.deepEqual(dialogue(project.script), dialogue(original));
assert(project.script.endsWith("CUT TO BLACK."));
assert.equal(project.frames[0].shotType, "Close-up");
assert.equal(project.frames[0].lens, "50mm");
assert.equal(project.frames[11].shotType, "Medium");
assert.equal(project.frames[11].lens, "35mm");
assert(project.frames.every(f => f.movement === "Handheld" && ["Medium", "Close-up"].includes(f.shotType)));
assert.equal(new Set(project.frames.map(f => f.sceneId)).size, 1);
assert(project.scenes.filter(s => s.id !== project.frames[0].sceneId).every(s => s.description.startsWith("OUTLINE ONLY")));
assert(project.scenes.some(s => s.id === "rapture-ep4-pat"));
assert(!project.frames.some(f => f.characters.includes("rapture-pat")));
assert(!project.scenes.filter(s => s.actId === "rapture-episode-8").some(s => s.characters.includes("rapture-max")));
pass("all dialogue and pauses preserved; only two wide framings tightened; Pat/Max boundaries intact");

assert(project.frames.every(f => f.durationIsEstimate === true));
assert.equal(project.frames.reduce((n, f) => n + f.duration, 0), 175);
for (const frame of project.frames) {
  assert(frame.duration > pauses(frame.notes).reduce((n, p) => n + p, 0));
}
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], durationIsEstimate: "yes" }] }));
assert.throws(() => validatePatch({ scenes: [{ ...project.scenes[0], lightingNotes: "x".repeat(1001) }] }));
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], lightingNotes: 99 }] }));
assert.equal(sanitizeImport({ ...project, frames: [{ ...project.frames[0], durationIsEstimate: false, lightingNotes: "Kettle only" }] }).frames[0].durationIsEstimate, false);
pass("working total-shot estimates stay distinct from the exact scripted pauses");

const scene = project.scenes.find(s => s.id === project.frames[0].sceneId);
assert.equal(imported.scenes.find(s => s.id === scene.id).lightingNotes, scene.lightingNotes);
assert.equal(describeLocation("EXT./INT. NUMBER FOURTEEN"), "interior and exterior, number fourteen");
assert.equal(describeLocation("INT./EXT. VAN"), "interior and exterior, van");
assert.equal(describeLocation("EXT. ROAD"), "exterior, road");
for (const platform of PLATFORMS) {
  for (const frame of project.frames) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(prompt.includes("Red practical sources only"), `${platform.id} must inherit the specific red practical direction`);
    assert(!prompt.includes("warm pools of lamplight"), `${platform.id} must not append conflicting generic light`);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"));
    if (frame.characters.length === 0) {
      assert(!prompt.includes("Danny Crane") && !prompt.includes("Jodie Crane") && !prompt.includes("The Woman — Number Fourteen"), "Explicit empty cast must not inherit the scene's actors");
      assert(!prompt.includes("character portrait"), "Object-only shots must not be coerced into portraits");
    }
  }
  const whole = buildScenePrompt(project, scene, platform.id);
  assert(whole.includes("Red practical sources only"));
  if (platform.kind === "video") assert(whole.includes("ESTIMATED RUNTIME: 175"));
}
const tap = project.frames[6];
assert(buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes("One blue task light only"));
assert(!buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes(scene.lightingNotes));
assert(buildFramePrompt(project, { ...tap, characters: undefined }, "generic").includes("Danny Crane"), "Undefined cast still inherits");
const genericScene = { ...scene, lightingNotes: undefined };
const genericProject = { ...project, scenes: [genericScene] };
assert(buildFramePrompt(genericProject, { ...tap, lighting: undefined }, "generic").includes("warm pools of lamplight"), "Scene lighting preset should still inherit without a prose override");
const csv = shotListCsv(project);
assert(csv.includes('"Lighting direction"') && csv.includes('"Duration is estimate"'));
assert(csv.includes(scene.lightingNotes));
assert(csv.includes('"No pocket — reference"'));
assert(csv.includes("The door closes."));
assert(buildFramePrompt(project, tap, "generic").includes("approximately 11 seconds"));
pass(`${PLATFORMS.length} prompt models and CSV export retain lighting direction, empty cast and estimated timing`);

const paths = [...new Set([project.coverImage, ...project.characters.map(c => c.image).filter(Boolean), ...project.frames.map(f => f.image), ...project.moodboards.flatMap(b => b.items.map(i => i.image))])];
for (const image of paths) assert(existsSync(join(root, "public", image)), `Image not on disk: ${image}`);
assert.equal(readdirSync(join(root, "public/images/rapture/ep4")).filter(p => p.endsWith(".jpg")).length, 10);
assert.equal(new Set(project.frames.map(f => f.image)).size, 10);
assert.deepEqual(project.frames.filter(f => f.status === "Needs review").map(f => f.id), ["rapture-ep4-shot-09", "rapture-ep4-shot-10", "rapture-ep4-shot-13"]);
assert(project.frames.filter(f => f.status === "Needs review").every(f => f.title.endsWith("— reference") && f.notes.includes("REFERENCE ONLY")));
pass(`${paths.length} image references on disk; ten new studies, three honestly labelled reference shots`);

// Exercise real Drizzle service calls against an isolated local adapter file, not the user's workspace.
const services = join(cache, "services.cjs");
await build({
  stdin: { contents: 'export * from "./src/lib/projects"; export { sanitizeImport } from "./src/lib/validation";', resolveDir: root },
  outfile: services, bundle: true, platform: "node", format: "cjs", packages: "external", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const databaseFile = join(cache, "isolated-projects.json");
writeFileSync(databaseFile, "[]");
try {
  execFileSync(process.execPath, ["-e", `
    const assert = require('node:assert/strict');
    const api = require(${JSON.stringify(services)});
    (async () => {
      const id = ${JSON.stringify(project.id)};
      const initial = await api.listProjects();
      assert.equal(initial.length, 4, 'Fresh local databases must seed all four projects');
      const originalSample = initial.find(p => p.title === 'The Last Light');
      const opened = await api.openRaptureProject();
      assert.equal(opened.id, id);
      assert.equal(opened.frames.length, 13);
      await api.updateProject(id, { title: 'My edited Rapture', script: 'My preserved words' });
      const shared = await api.shareProject(id, true);
      const again = await api.openRaptureProject();
      assert.equal(again.script, 'My preserved words');
      assert.equal(again.title, 'My edited Rapture');
      assert.equal(again.shareId, shared.shareId);
      assert.equal((await api.listProjects()).length, 4, 'Opening repeatedly must not duplicate');
      assert.deepEqual(await api.getProject(originalSample.id), originalSample, 'Other projects are untouched');
      await api.deleteProject(id);
      assert.equal((await api.listProjects()).length, 3, 'Ordinary page loads respect deletion');
      const restored = await api.openRaptureProject();
      assert.equal(restored.id, id);
      assert.equal(restored.frames.length, 13);
      assert.equal(restored.shareId, null);
      const copy = await api.importProject(api.sanitizeImport(restored));
      assert.notEqual(copy.id, id, 'Import creates a separate copy');
      assert.equal(copy.scenes.find(s => s.id === 'rapture-ep4-number-fourteen').lightingNotes, restored.scenes.find(s => s.id === 'rapture-ep4-number-fourteen').lightingNotes);
      assert(copy.frames.every(f => f.durationIsEstimate === true));
    })().catch(error => { console.error(error); process.exit(1); });
  `], { cwd: root, env: { ...process.env, DATABASE_URL: "", NODE_ENV: "test", FRAME_LOCAL_DB_FILE: databaseFile }, stdio: "inherit", timeout: 30000 });
} finally { rmSync(databaseFile, { force: true }); }
pass("fresh/existing local workspaces, idempotent open, edit/share preservation, deletion and independent import");

if (process.argv.includes("--live")) {
  const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
  const response = await fetch(`${base}/api/projects`);
  assert.equal(response.status, 200);
  const saved = (await response.json()).find(p => p.id === project.id);
  assert(saved, "Open the Rapture workspace before the read-only live check");
  for (const tab of ["overview", "screenplay", "characters", "relationships", "storyboard", "shot-list", "notes", "brainstorm", "mood-boards", "prompt-studio"]) {
    const page = await fetch(`${base}/?project=${saved.id}&tab=${tab}`);
    assert.equal(page.status, 200, `${tab} must render`);
    assert((await page.text()).includes("Let the Raptures Commence"));
  }
  const served = await fetch(`${base}/projects/let-the-raptures-commence.json`);
  assert.equal(served.status, 200);
  assert.deepEqual(await served.json(), project);
  for (const path of paths) {
    const image = await fetch(`${base}${path}`);
    assert.equal(image.status, 200, `Image is not served: ${path}`);
    assert(image.headers.get("content-type")?.startsWith("image/"));
  }
  pass("all ten app tabs, portable JSON and every bundled image serve successfully");
}
console.log("Rapture checks passed.");
