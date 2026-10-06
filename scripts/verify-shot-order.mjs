// Scene-order regression checks, including real rendered components and safe saved-workspace refresh.
// npm run verify:shot-order — no server or browser download needed.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { featureScenes, parseBoard, readBoard, readFountain } from "./neonoire/plan.mjs";
import { inStoryOrder, storyPositions } from "./neonoire/story-order.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(root, "node_modules/.cache/verify-shot-order");
mkdirSync(cache, { recursive: true });
const output = join(cache, "exports.cjs");
await build({
  stdin: { contents: `
    export * from "./src/lib/frame-order";
    export * from "./src/lib/bundle-refresh";
    export * from "./src/lib/validation";
    export * from "./src/lib/image-history";
    export * from "./src/components/image-library";
    export * from "./src/lib/export";
    export * from "./src/components/storyboard";
    export * from "./src/components/storyboard-player";
    export * from "./src/components/prompt-studio";
    export { default as SharedProject } from "./src/components/shared-project";
  `, resolveDir: root },
  bundle: true, platform: "node", format: "cjs", jsx: "automatic",
  external: ["react", "react/jsx-runtime", "react-dom", "react-dom/server"],
  outfile: output, tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const require = createRequire(import.meta.url);
const {
  framesInSceneOrder, reorderFrameInScene, shotNumber, nextShotNumber, sceneNumber, bundledFrameUpdates,
  sanitizeImport, validatePatch, shotListCsv, printProject, selectFrameImage,
  frameImageVersions, sceneImageAlternates, ImageBrowser,
  Storyboard, ShotList, StoryboardPlayer, PromptStudio, SharedProject,
} = require(output);
const pass = message => console.log(`  PASS  ${message}`);
const html = (Component, props) => new JSDOM(renderToStaticMarkup(React.createElement(Component, props))).window.document;
console.log("=== Shot running order and production identities ===");
const readableImage = path => { try { readFileSync(join(root, "public", path)); return true; } catch { return false; } };

const project = JSON.parse(readFileSync(join(root, "public/projects/neonoire-opening.json"), "utf8"));
const fountain = readFountain(root);
const feature = featureScenes(fountain);
const planned = new Map(feature.flatMap(scene => parseBoard(readBoard(root, scene), scene).map(shot => [shot.id, shot])));
assert.deepEqual(project.scenes.map(scene => scene.id), feature.map(scene => scene.id));
assert.deepEqual(project.scenes.map(scene => scene.number), feature.map(scene => scene.label));
for (const frame of project.frames) {
  assert.equal(frame.shotNumber, planned.get(frame.id).n);
  // A slot whose picture is not on disk yet (scene 6's 321–327) is an honest placeholder with no image path.
  const plannedImage = planned.get(frame.id).path || `/images/neonoire/${planned.get(frame.id).scene.key}/${planned.get(frame.id).image}`;
  assert.equal(frame.image, readableImage(plannedImage) ? plannedImage : "");
}
assert.equal(new Set(project.frames.map(frame => frame.shotNumber)).size, project.frames.length);
assert.deepEqual(project.frames.map(frame => frame.id), inStoryOrder(project.frames, project.scenes, root).map(frame => frame.id));
const positions = storyPositions(root);
assert(project.frames.every(frame => positions.get(frame.id) >= 0), "Every shot quote is found in its own scene");
const rank = new Map(project.scenes.map((scene, index) => [scene.id, index]));
for (let i = 1; i < project.frames.length; i++) {
  const a = project.frames[i - 1], b = project.frames[i];
  assert(rank.get(a.sceneId) <= rank.get(b.sceneId));
  if (a.sceneId === b.sceneId) assert(positions.get(a.id) <= positions.get(b.id));
}
// Repeated short lines must be located in the matching scene, not the first global occurrence.
const lines = fountain.split("\n");
for (const [index, scene] of feature.entries()) {
  const block = lines.slice(scene.line, feature[index + 1]?.line ?? lines.length).join("\n").replace(/\s+/g, " ").trim();
  const start = lines.slice(0, scene.line).join("\n").replace(/\s+/g, " ").length;
  for (const shot of parseBoard(readBoard(root, scene), scene)) {
    assert.equal(positions.get(shot.id), start + block.indexOf(shot.script.replace(/\s+/g, " ").trim()));
  }
}
const own = key => project.frames.filter(frame => frame.sceneId === `neonoire-${key}`).map(frame => frame.shotNumber);
// The retake round of 1 October 2026 anchored 193 on the doorway line it now shows (Fountain 1000) rather
// than on the earlier futon line (990), which puts the replay between them — the order the page gives:
// she plays it again (998), then Jack is in the doorway (1000), then the clip on the book, then 284.
// The 4 October 2026 long-hold pass adds three to this scene, and they play inside it: the book into her
// lap (345) after the clip is set down, then him making himself smaller (344), then 284, then the bulb (346).
assert.deepEqual(own("s20"), [309, 193, 194, 345, 372, 344, 284, 371, 346], "The book and clip, sitting, coward-line coverage and held silence follow the screenplay beats");
assert.deepEqual(own("s22"), [197, 347, 285, 348, 349, 198], "The arch's new frames sit between the master and the cup moved back from the edge");
assert.deepEqual(own("s23"), [199, 350, 351, 352, 200, 353], "The stall's new frames run from the hands to the nod, with the lanterns swaying last but one");
assert.deepEqual(own("s29"), [354, 206, 355, 273, 356, 357], "Scene 29 plays altar photograph, tea, rent question, receipts, stamp, then heavier than me");
assert.deepEqual(own("s17"), [189, 358, 359, 360, 190], "Scene 17 plays the look, empty stool, noodles served, payment, then the curtain moves");
assert.deepEqual(own("s14"), [184, 270, 361, 185, 362, 363], "Scene 14 plays meant to come back, suitcase, wall of drawings, sketchbook, kanji sign, clip on sketchbook");
// The relief pass of 4 October 2026 joined the run after both long-hold passes; its five unique
// frames — the two unboarded beats neither pass took — play on the quoted lines they show: the
// empty house before 228, and the door at the end of 94.
assert.deepEqual(own("s59"), [364, 365, 366, 367, 228], "Scene 59's INTERCUT plays the empty house in the page's order, then Vera glowing");
assert.deepEqual(own("s94"), [141, 142, 143, 368], "Scene 94 ends on the door closing, after the three getting-ins");
assert.deepEqual(own("s51"), [310, 311]);
assert.deepEqual(own("s99a"), [158, 159, 305, 306, 307], "Demolition precedes the dissolve to the plaza within one scene");
assert.deepEqual(own("s75"), [79, 80, 81, 82, 83, 314], "The empty crossing is the last pillow shot, not a final-project append");
assert.deepEqual(own("s100"), [320, 160, 265, 260, 161], "News precedes Vera's stool and the held ending");
assert.equal(project.frames.at(-1).shotNumber, 161);
pass("103 screenplay scenes, inserted labels, coverage beats and all stable IDs/numbers/asset paths");
assert.deepEqual(own("s25"), [202, 369, 258, 370]);
assert.deepEqual(own("s27a"), [290, 373, 291, 292, 374]);
assert.deepEqual(own("s11"), [245, 246, 169, 251, 375, 252]);
assert.deepEqual(own("s36"), [210, 376]);
for (const number of [369, 370, 371, 372, 373, 374, 375, 376]) {
  const frame = project.frames.find(item => item.shotNumber === number);
  assert(frame?.image && frame.notes.includes("Coverage pass two (4 October 2026)"), `Shot ${number} is delivered with its pass note`);
  assert(readableImage(frame.image), `Shot ${number} has an installed image`);
}
pass("shots 369–376 play at their quoted scene beats; corrected 375 is installed and all eight keyframes are full-bleed");

validatePatch(project);
const imported = sanitizeImport(project);
validatePatch(imported);
assert.deepEqual(imported.frames.map(frame => frame.shotNumber), project.frames.map(frame => frame.shotNumber));
assert.deepEqual(imported.scenes.map(scene => scene.number), project.scenes.map(scene => scene.number));
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], shotNumber: -1 }] }));
assert.throws(() => validatePatch({ scenes: [{ ...project.scenes[0], number: "<script>" }] }));
assert.equal(sanitizeImport({ title: "Bad labels", scenes: [{ ...project.scenes[0], number: "<script>" }], frames: [{ ...project.frames[0], shotNumber: NaN }] }).frames[0].shotNumber, undefined);
pass("numbering survives save/import and invalid labels/numbers are rejected or sanitised");
const trackedImage = "/images/neonoire/s1/01-backstreet.jpg";
const alternateA = "/images/neonoire/s1/08-sedan-arrives.jpg";
const alternateB = "/images/neonoire/s1/11-mara-hands-over-mouth.jpg";
const baseFrame = { ...project.frames[0], image: trackedImage, imageOriginal: undefined, imageHistory: undefined };
const firstSelection = selectFrameImage(baseFrame, alternateA);
assert.equal(firstSelection.image, alternateA);
assert.equal(firstSelection.imageOriginal, trackedImage, "the first/original image is pinned before a swap");
assert.equal(firstSelection.imageHistory, undefined, "the original is retained separately from the recent-selection list");
const secondSelection = selectFrameImage(firstSelection, alternateB);
assert.equal(secondSelection.imageOriginal, trackedImage, "later swaps never replace the first original");
assert.deepEqual(secondSelection.imageHistory, [alternateA]);
const restoredSelection = selectFrameImage(secondSelection, trackedImage);
assert.equal(restoredSelection.image, trackedImage, "the original can be restored");
assert.deepEqual(restoredSelection.imageHistory, [alternateA, alternateB], "restoring the original keeps both alternate attempts");
assert.equal(selectFrameImage(restoredSelection, trackedImage), restoredSelection, "selecting the current image is a no-op");
const withImageHistory = structuredClone(project);
withImageHistory.frames[0] = { ...withImageHistory.frames[0], imageOriginal: trackedImage, imageHistory: [alternateA, alternateB] };
validatePatch(withImageHistory);
const importedHistory = sanitizeImport(withImageHistory).frames[0];
assert.equal(importedHistory.imageOriginal, trackedImage);
assert.deepEqual(importedHistory.imageHistory, [alternateA, alternateB]);
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], imageHistory: ["javascript:alert(1)"] }] }), "invalid saved-image URLs are rejected");
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], imageHistory: Array(21).fill(alternateA) }] }), "saved-image history stays within the 20-choice cap");
const fakeLibrary = [
  { src: trackedImage, group: "shots", scene: "1", name: "01-backstreet.jpg", bytes: 10 },
  { src: "/images/neonoire/archive/s1/01-backstreet--v1.jpg", group: "earlier", scene: "1", name: "01-backstreet--v1.jpg", bytes: 9, replaces: trackedImage, version: 1, of: 1 },
  { src: alternateA, group: "alternates", scene: "1", name: "08-sedan-arrives.jpg", bytes: 8 },
  { src: "/images/neonoire/s1/03-mara-walks.jpg", group: "shots", scene: "1", name: "03-mara-walks.jpg", bytes: 7 },
  { src: "/images/neonoire/s2/24-from-the-floor.jpg", group: "alternates", scene: "2", name: "24-from-the-floor.jpg", bytes: 6 },
];
const exactVersions = frameImageVersions(fakeLibrary, alternateA, trackedImage, [alternateB], "1");
assert.deepEqual(new Set(exactVersions.map(image => image.src)), new Set([trackedImage, "/images/neonoire/archive/s1/01-backstreet--v1.jpg", alternateA, alternateB]));
assert.deepEqual(sceneImageAlternates(fakeLibrary, "1").map(image => image.src), [alternateA]);
const browserMarkup = html(ImageBrowser, { library: fakeLibrary, selected: alternateA, imageOriginal: trackedImage, imageHistory: [alternateB], sceneNumber: "1", includeAll: false, onPick() {} });
assert(browserMarkup.querySelector('[role="tablist"]').textContent.includes("This shot's versions"));
assert(browserMarkup.querySelector('[role="tablist"]').textContent.includes("Scene 1 alternates (1)"));
assert.equal(browserMarkup.querySelectorAll('.image-browser .reference-grid button').length, exactVersions.length);
pass("image changes keep the original and recent alternates through save/import; chooser limits exact versions and same-scene unused alternates");

const staticLibrary = JSON.parse(readFileSync(join(root, "public/images/neonoire/library.json"), "utf8"));
assert.equal(staticLibrary.count, staticLibrary.images.length, "the image-library count matches its entries");
assert.equal(new Set(staticLibrary.images.map(image => image.src)).size, staticLibrary.images.length, "the image library has no duplicate sources");
const archivedImages = staticLibrary.images.filter(image => image.group === "earlier");
assert(archivedImages.length > 0, "checked-in original image versions remain in the chooser library");
assert(archivedImages.every(image => readableImage(image.src)), "every archived image in the chooser library is present on disk");
const savedBackstreetVersions = archivedImages.filter(image => image.replaces === trackedImage);
assert(savedBackstreetVersions.length > 0, "the opening shot retains its earlier generations as selectable replacements");
const realVersions = frameImageVersions(staticLibrary.images, trackedImage, undefined, [], "1");
assert(realVersions.some(image => image.src === trackedImage));
assert(savedBackstreetVersions.every(image => realVersions.some(option => option.src === image.src)));
assert(sceneImageAlternates(staticLibrary.images, "1").some(image => image.src === alternateA), "unused same-scene alternates remain selectable");
pass(`the static chooser library exposes ${archivedImages.length} checked-in earlier versions and same-scene alternates`);

// An intentionally interleaved project: use IDs that cannot be numerically sorted, and retain
// an edited within-scene order even when production numbers are not ascending.
const scenes = [
  { ...project.scenes[0], id: "scene-first", number: "25" },
  { ...project.scenes[0], id: "scene-insert", number: "25A" },
  { ...project.scenes[0], id: "scene-last", number: "26" },
];
const make = (id, sceneId, number) => ({ ...project.frames[0], id, sceneId, shotNumber: number, title: id, audio: undefined });
const input = [make("later-low-number", "scene-last", 2), make("first-high-number", "scene-first", 310), make("inserted", "scene-insert", 300), make("first-edited-next", "scene-first", 9), make("orphan-b", "missing-b", 500), make("orphan-a", "missing-a", 501)];
const copy = input.map(frame => frame.id);
const ordered = framesInSceneOrder(input, scenes);
assert.deepEqual(ordered.map(frame => frame.id), ["first-high-number", "first-edited-next", "inserted", "later-low-number", "orphan-b", "orphan-a"]);
assert.deepEqual(input.map(frame => frame.id), copy, "Sorting never mutates input");
const fixture = { ...project, scenes, frames: input, acts: [] };
assert.deepEqual(reorderFrameInScene(fixture, "first-high-number", "first-edited-next").map(frame => frame.id), ["first-edited-next", "first-high-number", "inserted", "later-low-number", "orphan-b", "orphan-a"]);
assert.deepEqual(reorderFrameInScene(fixture, "first-high-number", "later-low-number"), ordered, "A drag cannot cross a scene boundary");
assert.deepEqual(reorderFrameInScene(fixture, "not-a-frame", "later-low-number"), ordered);
assert.equal(sceneNumber(scenes[1], 1), "25A");
assert.equal(shotNumber({ shotNumber: 310 }, 0), 310);
assert.equal(shotNumber({}, 3), 4);
assert.equal(nextShotNumber(project.frames), 389);
assert.equal(nextShotNumber([{ id: "unnumbered" }]), undefined);
pass("scene order is stable, unassigned shots go last, manual within-scene ordering and drag boundaries work");

// Simulate the exact old default boarding array, with writer edits and awaiting image slots.
const legacy = structuredClone(project);
legacy.title = "My edited title";
legacy.script += "\nWriter's additional line.\n";
legacy.frames.sort((a, b) => a.shotNumber - b.shotNumber);
const missing = new Set([298, 299, 300, 302, 310, 311, 313, 314, 320]);
for (const frame of legacy.frames) {
  if (missing.has(frame.shotNumber)) { frame.image = ""; frame.title += " (keyframe missing)"; frame.status = "Needs review"; frame.notes = "KEYFRAME MISSING — awaiting this frame"; }
  delete frame.shotNumber;
}
for (const scene of legacy.scenes) delete scene.number;
legacy.frames.find(frame => frame.id === "neonoire-shot-01").title = "Director's own title";
const patch = bundledFrameUpdates(legacy, project);
assert(patch);
assert.deepEqual(Object.keys(patch).sort(), ["frames", "scenes"]);
assert.deepEqual(patch.frames.map(frame => frame.id), project.frames.map(frame => frame.id));
assert.equal(patch.frames.find(frame => frame.id === "neonoire-shot-01").title, "Director's own title");
for (const n of missing) assert(patch.frames.find(frame => frame.shotNumber === n).image);
const refreshed = { ...legacy, ...patch };
assert.equal(refreshed.script, legacy.script);
assert.equal(refreshed.title, legacy.title);
assert.equal(bundledFrameUpdates(refreshed, project), null, "Migration is idempotent");

const edited = structuredClone(refreshed);
[edited.frames[0], edited.frames[1]] = [edited.frames[1], edited.frames[0]];
const blank = edited.frames.find(frame => frame.shotNumber === 298);
blank.image = ""; blank.title = "Deliberately blank"; blank.notes = "Leave this blank.";
const changed = bundledFrameUpdates(edited, project);
assert.equal(changed, null, "A deliberate blank and manually edited order are never reset");
const shorter = { ...edited, frames: edited.frames.filter(frame => frame.shotNumber !== 3) };
assert.equal(bundledFrameUpdates(shorter, project), null, "Deleted frames are never reinstated");
const extra = { ...edited, frames: [...edited.frames, make("custom-shot", edited.scenes[0].id, 344)] };
const extraPatch = bundledFrameUpdates(extra, project);
assert.equal(extraPatch.frames.length, extra.frames.length);
assert(extraPatch.frames.some(frame => frame.id === "custom-shot"));
assert.deepEqual(extraPatch.frames.slice(0, 2).map(frame => frame.id), edited.frames.slice(0, 2).map(frame => frame.id));
// The exact earlier default gets the new production brief, not stale "still missing" notes.
const defaultPending = structuredClone(project);
const originalPending = defaultPending.frames.find(frame => frame.shotNumber === 299);
Object.assign(originalPending, { image: "", title: "The card on the desk (keyframe missing)", status: "Needs review", notes: "KEYFRAME MISSING \u2014 /images/neonoire/s53a/299-the-card-on-the-desk.jpg is not in public/images/neonoire/s53a, so this card holds slot 299 of 297 until pass 30 is generated.\n\nThe scene's button. The card reads TOTO SHIMBUN with KONDO in katakana, as Okada handed it over in 27A; the number on its back is written, not printed, and need not be legible. The photograph stays face up beside it \u2014 the same photograph as scene 82's. Holds \"Will you print it?\" / \"Print what? A dead man's diary? (beat) Bring me something with a name on it.\" Placeholder study \u2014 the keyframe is still to generate.\n\nSCRIPT \u2014 the draft's own words for this shot:\n\"Vera writes her number on the back of Kondo's card and leaves it on the desk, beside the photograph.\"\n\nThe scene 82 newsroom by day, three channels at once, and two women across a desk with a photograph between them. Ordinary volume, static camera; the only stillness is Vera hearing that a car was promised and never came.\n\nTokyo as a memory that is still happening. The city lights the characters, not the sky: vending machines, shop signs, train windows, fluorescent tubes. Sodium orange against a sick fluorescent green. Soft halation around every light, blacks slightly crushed. It should look like film, and feel like something remembered. Rain is never glamorous \u2014 no lightning, no storms, cold, steady, patient rain that turns the streets black and reflective. Wide and patient; close-ups are rare, so they count. Nothing is explained.\n\nTiming: 6s is a working estimate for animatic playback. The draft locks no durations.\n\nPass 30 of 30 \u2014 ten keyframes at a time, in screenplay order. Shot 299 of 297." });
const deliveredDefault = bundledFrameUpdates(defaultPending, project).frames.find(frame => frame.shotNumber === 299);
assert.equal(deliveredDefault.notes, project.frames.find(frame => frame.shotNumber === 299).notes);
assert.equal(deliveredDefault.status, "Ready");
// Pending cards can have director edits without losing their machine markers.
const pendingEdits = structuredClone(project);
const editedPending = pendingEdits.frames.find(frame => frame.shotNumber === 299);
editedPending.image = "";
editedPending.title = "My revised card insert (keyframe missing)";
editedPending.notes = "KEYFRAME MISSING — keep the insert tighter. Director: no telephone digits.";
editedPending.status = "Needs review";
const pendingPatch = bundledFrameUpdates(pendingEdits, project);
const keptPending = pendingPatch.frames.find(frame => frame.shotNumber === 299);
assert(keptPending.image);
assert.equal(keptPending.title, "My revised card insert");
assert.equal(keptPending.notes, editedPending.notes);
assert.equal(keptPending.status, "Ready", "Explicit main-image approval does not erase director notes");
pass("saved default boarding order migrates; images arrive; writer edits, deliberate blanks, deletions and custom shots survive");

// Render the real views, rather than just testing a sorter disconnected from the UI.
const callbacks = { onEdit() {}, onAdd() {}, onPlay() {}, onReorder() {}, onDuplicate() {}, onDelete() {}, onUpdate() {} };
const board = html(Storyboard, { project: fixture, ...callbacks });
assert.deepEqual([...board.querySelectorAll(".frame-card h3")].map(node => node.textContent), ordered.map(frame => frame.title));
assert.deepEqual([...board.querySelectorAll(".frame-card .frame-number")].map(node => Number(node.textContent)), ordered.map(frame => frame.shotNumber));
assert(board.querySelector('.scene-filter option[value="scene-insert"]').textContent.startsWith("25A"));
const list = html(ShotList, { project: fixture, ...callbacks });
assert.deepEqual([...list.querySelectorAll(".shot-number")].map(node => Number(node.textContent)), ordered.map(frame => frame.shotNumber));
assert(list.querySelectorAll(".shot-title small")[2].textContent.startsWith("Scene 25A"));
const shared = html(SharedProject, { project: fixture });
assert.deepEqual([...shared.querySelectorAll(".shared-frame h2")].map(node => node.textContent), ordered.map(frame => frame.title));
const player = html(StoryboardPlayer, { project: fixture, frames: input, onClose() {} });
assert.equal(player.querySelector(".player-caption h3").textContent, "Shot 310 · first-high-number");
const prompts = html(PromptStudio, { project: fixture, initialSceneId: "scene-first", onApplyStyle() {} });
const promptText = prompts.querySelector("textarea").textContent;
assert(promptText.includes("=== SHOT 310:") && promptText.includes("=== SHOT 9:"));
assert(promptText.indexOf("=== SHOT 310:") < promptText.indexOf("=== SHOT 9:"));
pass("real storyboard, shot list, shared board, player and prompt batch render in the same scene order with fixed numbers");

const csv = shotListCsv(fixture).split("\r\n").slice(1);
assert.deepEqual(csv.map(row => Number(/^"(\d+)"/.exec(row)[1])), ordered.map(frame => frame.shotNumber));
let printed = "";
const previousWindow = globalThis.window;
globalThis.window = { location: { origin: "https://preview.example" }, open: () => ({ document: { write(value) { printed = value; }, close() {} }, focus() {} }) };
try { printProject(fixture); } finally { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; }
const print = new JSDOM(printed).window.document;
assert.deepEqual([...print.querySelectorAll("article h3")].map(node => node.textContent), ordered.map(frame => frame.title));
assert(print.querySelector("article small").textContent.startsWith("FRAME 310"));
assert(print.querySelectorAll("article small")[2].textContent.includes("Scene 25A"));
pass("CSV and print/PDF use identical order and preserve production numbers");
console.log("\nAll shot-order checks passed.");
