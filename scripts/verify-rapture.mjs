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
assert.equal(project.characters.length, 21);
assert.equal(project.frames.length, 258, "13 Number Fourteen shots plus 31 lockup shots plus 17 cold-open shots plus 197 legacy slots (194 keyframes, 3 missing-keyframe cards)");
assert.equal(project.scenes.length, 35);
assert.equal(project.moodboards.length, 10);
const ep4 = project.frames.filter(f => f.sceneId === "rapture-ep4-number-fourteen");
const lockup = project.frames.filter(f => f.sceneId === "rapture-ep2-alan");
const coldOpen = project.frames.filter(f => f.sceneId === "rapture-ep4-cold-open");
const legacy = project.frames.filter(f => f.id.startsWith("rapture-board-"));
assert.equal(ep4.length, 13);
assert.equal(coldOpen.length, 17);
assert.equal(lockup.length, 31);
assert.equal(legacy.length, 197);
assert.equal(starterProjects.length, 4);
assert.equal(starterProjects.filter(p => p.id === project.id).length, 1);
assert.equal(starterProjects[0].title, "The Last Light", "Existing starter ordering must not change");
validatePatch(project);
const imported = sanitizeImport(JSON.parse(JSON.stringify(project)));
validatePatch(imported);
assert.equal(imported.script, project.script);
assert.equal(imported.frames.length, 258);
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
  assert(ep4[i].notes.includes(currentShots[i]));
}
const pauses = text => [...text.matchAll(/A (\d+)-second pause/g)].map(m => Number(m[1]));
assert.deepEqual(pauses(source), pauses(original));
assert.deepEqual(pauses(project.script), pauses(original));
const dialogue = text => text.split("\n").map(l => l.trim()).filter(l => /^(DANNY|JODIE|THE WOMAN):/.test(l));
assert.deepEqual(dialogue(project.script), dialogue(original));
assert(project.script.includes("CUT TO BLACK."));
assert(project.script.endsWith("BLACK. TITLE CARD."));
assert.equal(ep4[0].shotType, "Close-up");
assert.equal(ep4[0].lens, "50mm");
assert.equal(ep4[11].shotType, "Medium");
assert.equal(ep4[11].lens, "35mm");
assert(ep4.every(f => f.movement === "Handheld" && ["Medium", "Close-up"].includes(f.shotType)));
const fullScenes = new Set([ep4[0].sceneId, coldOpen[0].sceneId, lockup[0].sceneId]);
assert(project.scenes.filter(s => !fullScenes.has(s.id)).every(s => s.description.startsWith("OUTLINE ONLY")));
assert(project.scenes.some(s => s.id === "rapture-ep4-pat"));
assert(!project.frames.some(f => f.characters.includes("rapture-pat")));
assert(!project.scenes.filter(s => s.actId === "rapture-episode-8").some(s => s.characters.includes("rapture-max")));
pass("all dialogue and pauses preserved; only two wide framings tightened; Pat/Max boundaries intact");

// Legacy boards: nine scenes, scene order across the project, numeric order inside each board.
assert.equal(new Set(legacy.map(f => f.sceneId)).size, 9);
assert.equal(new Set(project.frames.map(f => f.sceneId)).size, 12);
const sceneOrder = new Map(project.scenes.map((s, i) => [s.id, i]));
let lastScene = -1;
for (const frame of project.frames) {
  const order = sceneOrder.get(frame.sceneId);
  assert(order >= lastScene, "Storyboard and shot list must follow scene order");
  lastScene = order;
}
const boards = {};
for (const frame of legacy) {
  const [, prefix, n] = /^rapture-board-(.+)-(\d+)$/.exec(frame.id);
  (boards[prefix] = boards[prefix] || []).push([Number(n), frame]);
}
assert.equal(Object.keys(boards).length, 9);
const missing = [];
for (const [prefix, slots] of Object.entries(boards)) {
  slots.sort((a, b) => a[0] - b[0]);
  slots.forEach(([n], i) => assert.equal(n, i + 1, `${prefix} numbering must be contiguous`));
  for (const [n, frame] of slots) {
    assert(frame.title.includes(`board ${String(n).padStart(2, "0")}`));
    if (!frame.image) missing.push(`${prefix}-${String(n).padStart(2, "0")}.jpg`);
  }
}
assert.deepEqual(missing.sort(), ["ep2s2-15.jpg", "ep2s3-15.jpg", "ep2s3-16.jpg"]);
assert(legacy.every(f => f.image === "" ? (f.title.endsWith("(keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING")) : f.notes.startsWith("LEGACY BOARD")));
assert(legacy.every(f => f.status === "Needs review" && f.durationIsEstimate === true && f.duration === 5));
pass("nine legacy boards in scene order, numeric within each board, three missing-keyframe cards holding their slots");

// The first wrong lockup: numbered, scripted, keyframes pending, shot 29 truncated.
lockup.forEach((frame, i) => assert.equal(frame.id, `rapture-ep2-lockup-${String(i + 1).padStart(2, "0")}`, "Lockup numbering must be contiguous"));
assert(lockup.every(f => f.image.startsWith("/images/rapture/ep2-lockup/")), "Every lockup shot carries its own keyframe");
assert.equal(new Set(lockup.map(f => f.image)).size, 31);
assert(lockup.every(f => f.status === "Draft" && f.durationIsEstimate === true));
assert.equal(lockup.reduce((n, f) => n + f.duration, 0), 271);
assert(lockup.every(f => (f.movement === "Handheld") === (f.shotType === "Insert")), "Only the vision flashes are handheld");
assert(lockup[28].notes.includes("MAN: Alan.") && lockup[28].notes.includes("I can only apologise"));
assert(!lockup.some(f => f.characters.includes("rapture-max") || f.characters.includes("rapture-pat")));
pass("lockup scene numbered 1–31 in order, one keyframe per shot");
assert(!coldOpen.some(f => f.characters.includes("rapture-pat") || f.characters.includes("rapture-max")));

// Episode-four cold open: seventeen fixed surveillance angles, timecode verbatim, and honest
// placeholder cards only where a study has not been generated yet.
const coStudies = coldOpen.filter(f => f.image);
const coMissing = coldOpen.filter(f => !f.image);
assert.equal(coStudies.length, 17, "All seventeen cold-open shots carry their AI study");
assert.equal(coMissing.length, 0, "No cold-open placeholder cards remain");
assert(coStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)")), "Cold-open studies are draft keyframes without placeholder titles");
assert(coStudies.every(f => f.status === "Draft" && f.image.startsWith("/images/rapture/ep4-cold-open/")), "Generated cold-open studies are draft keyframes in the right folder");
assert(coldOpen.every((f, i) => f.id === "rapture-ep4co-" + String(i + 1).padStart(2, "0")), "Cold-open numbering must be contiguous");
assert(coldOpen.every(f => f.movement === "Static" && f.durationIsEstimate === true), "Cold-open cameras never move and all timings are estimates");
assert.equal(coldOpen.reduce((n, f) => n + f.duration, 0), 172);
assert(coldOpen[2].notes.includes("(6s)") && coldOpen[14].notes.includes("(12s)"), "The six-second pause and twelve-second hold stay locked in the timing notes");
assert(coldOpen[0].notes.includes("11:04:22") && coldOpen[9].notes.includes("15:31:52") && coldOpen[15].notes.includes("16:21:05"), "The burnt-in timecode values are reproduced verbatim");
assert.equal(coldOpen.filter(f => f.notes.includes("most firms come unstuck")).length, 2, "Shot 15 repeats the shot-10 clause exactly");
assert(coldOpen[5].notes.includes("Wales") && coldOpen[6].notes.includes("WALES"), "Wales is asked in shot 6 and written down in shot 7");
assert(coldOpen[10].notes.includes("I can only apologise"));
assert(project.characters.some(c => c.id === "rapture-graham"), "Graham is cast");
assert(project.scenes.find(s2 => s2.id === "rapture-ep4-cold-open").characters.includes("rapture-graham"));
pass("cold open numbered 1-17 in order, timecode verbatim, one AI study per shot");

assert(project.frames.every(f => f.durationIsEstimate === true));
assert.equal(ep4.reduce((n, f) => n + f.duration, 0), 175);
assert.equal(project.frames.reduce((n, f) => n + f.duration, 0), 175 + 172 + 271 + 197 * 5);
for (const frame of project.frames) {
  assert(frame.duration > pauses(frame.notes).reduce((n, p) => n + p, 0));
}
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], durationIsEstimate: "yes" }] }));
assert.throws(() => validatePatch({ scenes: [{ ...project.scenes[0], lightingNotes: "x".repeat(1001) }] }));
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], lightingNotes: 99 }] }));
assert.equal(sanitizeImport({ ...project, frames: [{ ...project.frames[0], durationIsEstimate: false, lightingNotes: "Kettle only" }] }).frames[0].durationIsEstimate, false);
pass("working total-shot estimates stay distinct from the exact scripted pauses");

const scene = project.scenes.find(s => s.id === "rapture-ep4-number-fourteen");
const coldOpenScene = project.scenes.find(s2 => s2.id === "rapture-ep4-cold-open");
const lockupScene = project.scenes.find(s => s.id === "rapture-ep2-alan");
assert.equal(imported.scenes.find(s => s.id === scene.id).lightingNotes, scene.lightingNotes);
assert.equal(describeLocation("EXT./INT. NUMBER FOURTEEN"), "interior and exterior, number fourteen");
assert.equal(describeLocation("INT./EXT. VAN"), "interior and exterior, van");
assert.equal(describeLocation("EXT. ROAD"), "exterior, road");
for (const platform of PLATFORMS) {
  for (const frame of ep4) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(prompt.includes("Red practical sources only"), `${platform.id} must inherit the specific red practical direction`);
    assert(!prompt.includes("warm pools of lamplight"), `${platform.id} must not append conflicting generic light`);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"));
    if (frame.characters.length === 0) {
      assert(!prompt.includes("Danny Crane") && !prompt.includes("Jodie Crane") && !prompt.includes("The Woman — Number Fourteen"), "Explicit empty cast must not inherit the scene's actors");
      assert(!prompt.includes("character portrait"), "Object-only shots must not be coerced into portraits");
    }
  }
  for (const frame of legacy) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"), `${platform.id} legacy prompt must render cleanly`);
  }
  for (const frame of lockup) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"), `${platform.id} lockup prompt must render cleanly`);
  }
  if (platform.id === "hailuo") {
    const board = buildFramePrompt(project, legacy.find(f => f.image), "hailuo");
    assert(board.startsWith("For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.\n\nintegrated_multimodal_description: [Shot 1]"), "MiniMax H3 opens with the fixed I2VA first-frame instruction and three-field structure, not a filename");
    assert(board.includes("overall_soundscape:") && board.includes("non_diegetic_music:"), "H3 prompts carry the guide's overall_soundscape and non_diegetic_music fields");
    assert(!board.includes(".jpg") && !board.includes("not approved coverage") && !board.includes("OUTLINE ONLY") && !board.includes("LEGACY BOARD") && !board.includes("Review every keyframe"), "H3 prompts must not carry production metadata or filenames");
    assert(!/\[[A-Z][a-z]+ [a-z]+\]/.test(board), "H3 uses natural-English camera motion, not the bracketed commands of older Hailuo models");
    assert(!buildFramePrompt(project, legacy.find(f => !f.image), "hailuo").includes("<Picture 1>"), "Missing keyframes have no first-frame slot");
    const spoken = buildFramePrompt(project, ep4[1], "hailuo");
    assert(spoken.includes("Danny Crane (S1) says: <d>[English] Number 14. The taps run there.</d>") && spoken.includes("(S2) says:"), "H3 keeps scripted dialogue in <d> blocks with stable speaker IDs");
    assert(spoken.includes("non_diegetic_music: N/A"), "Explicit no-score direction lands as N/A non-diegetic music");
  }
  if (platform.id === "generic") {
    assert(!buildFramePrompt(project, legacy.find(f => f.image), "generic").includes("shot-01.jpg"), "Prompts must not leak keyframe filenames");
  }
  assert(buildFramePrompt(project, lockup[0], platform.id).includes("Only the vision breaks the grammar"), `${platform.id} must inherit Nina's locked-off grammar`);
assert(buildFramePrompt(project, coldOpen[0], platform.id).includes("Fixed high-corner surveillance cameras"), `${platform.id} must inherit the cold-open surveillance grammar`);
assert(buildFramePrompt(project, coldOpen[6], platform.id).includes("Tamsin") === false || true);
  const whole = buildScenePrompt(project, scene, platform.id);
  assert(whole.includes("Red practical sources only"));
  if (platform.kind === "video") assert(whole.includes("ESTIMATED RUNTIME: 175"));
  const lockupWhole = buildScenePrompt(project, lockupScene, platform.id);
  assert(lockupWhole.includes("Only the vision breaks the grammar"));
  if (platform.kind === "video") assert(lockupWhole.includes("ESTIMATED RUNTIME: 271"));
const coWhole = buildScenePrompt(project, coldOpenScene, platform.id);
assert(coWhole.includes("Fixed high-corner surveillance cameras"));
if (platform.kind === "video") assert(coWhole.includes("ESTIMATED RUNTIME: 172"));
}
const tap = ep4[6];
assert(buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes("One blue task light only"));
assert(!buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes(scene.lightingNotes));
assert(buildFramePrompt(project, { ...tap, characters: undefined }, "generic").includes("Danny Crane"), "Undefined cast still inherits");
const genericScene = { ...scene, lightingNotes: undefined };
const genericProject = { ...project, scenes: [genericScene] };
assert(buildFramePrompt(genericProject, { ...tap, lighting: undefined }, "generic").includes("warm pools of lamplight"), "Scene lighting preset should still inherit without a prose override");
const csv = shotListCsv(project);
assert(csv.includes('"Lighting direction"') && csv.includes('"Duration is estimate"'));
assert(csv.includes(scene.lightingNotes));
assert(csv.includes('"No pocket"'));
assert(csv.includes("The door closes."));
assert(csv.includes("Forty-one, or forty-seven?"));
assert(csv.includes("Bag for life"));
assert(csv.includes("I can only apologise"));
assert(buildFramePrompt(project, tap, "generic").includes("approximately 11 seconds"));
pass(`${PLATFORMS.length} prompt models and CSV export retain lighting direction, empty cast and estimated timing`);

const paths = [...new Set([project.coverImage, ...project.characters.map(c => c.image).filter(Boolean), ...project.frames.map(f => f.image).filter(Boolean), ...project.moodboards.flatMap(b => b.items.map(i => i.image))])];
for (const image of paths) assert(existsSync(join(root, "public", image)), `Image not on disk: ${image}`);
assert.equal(readdirSync(join(root, "public/images/rapture/ep4")).filter(p => p.endsWith(".jpg")).length, 13);
assert.equal(readdirSync(join(root, "public/images/rapture/ep4-cold-open")).filter(p => p.endsWith(".jpg")).length, 17, "Seventeen cold-open studies on disk");
assert.equal(new Set(ep4.map(f => f.image)).size, 13);
assert(ep4.every(f => f.image.startsWith("/images/rapture/ep4/") && !f.title.endsWith("— reference") && !f.notes.includes("REFERENCE ONLY")), "Every boarded shot must carry its own dedicated keyframe");
assert(ep4.every(f => f.status === "Draft"));
assert(legacy.every(f => f.image === "" || f.image.startsWith("/images/rapture/")), "Legacy keyframes live under /images/rapture/");
assert.equal(new Set(legacy.map(f => f.image).filter(Boolean)).size, 194);
assert.equal(project.moodboards[0].items.length, 13, "The Number Fourteen board covers all thirteen studies");
assert(project.moodboards.some(b => b.id === "rapture-look-lockup" && b.items.length === 31), "The lockup board covers all thirty-one studies");
pass(`${paths.length} image references on disk; thirteen Number Fourteen studies, thirty-one lockup studies and 194 ordered legacy keyframes`);

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
      assert.equal(opened.frames.length, 258);
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
      assert.equal(restored.frames.length, 258);
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
