// Full-page preservation, not just clipped worksheet summaries.
import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { build } from "esbuild";

const read = path => readFileSync(path, "utf8");
const split = text => {
  const marks = [...text.matchAll(/^.*#(\d+[A-Z]?)#\s*$/gm)];
  return Object.fromEntries(marks.map((mark, i) => [mark[1], text.slice(mark.index, marks[i + 1]?.index ?? text.length)]));
};
const normal = text => text.replace(/\s+/g, " ").trim();
const current = split(read("Neonoire (3).fountain"));
const before = split(read("docs/neonoire/baseline/Neonoire_PreRevision_2026-09-29.fountain"));
const shipped = read("docs/neonoire/baseline/Neonoire_PreRestoration_2026-10-01.fountain");
const project = JSON.parse(read("public/projects/neonoire-opening.json"));
const pass = message => console.log(`  PASS  ${message}`);

assert.equal(Object.keys(current).length, 103);
for (const cut of ["13", "24", "97", "99"]) assert.equal(current[cut], undefined);
for (const phrase of ["Weeks later.", "The Hive is coming down.", "Rooms stand exposed to the sky", "Its six old stools in a row.", "DISSOLVE TO:", "Months later.", "Nothing marks where anything was."]) assert(current["99A"].includes(phrase), phrase);
assert(current["99A"].indexOf("The Hive is coming down") < current["99A"].indexOf("DISSOLVE TO:"));
assert(current["99A"].indexOf("DISSOLVE TO:") < current["99A"].indexOf("Months later."));
assert.deepEqual(project.frames.filter(frame => frame.sceneId === "neonoire-s99a").map(frame => frame.shotNumber), [158, 159, 305, 306, 307]);
assert.equal(project.frames.find(frame => frame.id === "neonoire-shot-305").transition, "Dissolve");
pass("one 99A contains demolition/old stools before a dissolve to the revised plaza; both original demolition cards are on screen again");

assert(current["15"].includes("dense, self-built block") && current["15"].includes("forgotten it is there"));
for (const phrase of ["Eat.", "Has anyone... come? Asking?", "Nobody comes here who isn't lost.", "The rice goes cold in Mara's lap."]) assert(current["25"].includes(phrase));
assert(current["25"].includes("Don't let them have it.") && !current["25"].includes("Your father. It was not what they say."));
assert(current["17"].includes("She looks at the empty third stool beside him."));
assert(!current["17"].includes("hoarding across the street"));
assert(current["40"].includes("MASKED LEADER (40s)") && current["40"].includes("His face stays behind the mask"));
assert(current["51"].includes("Tokyo spread out below in the rain like a circuit board"));
assert(!/^ISHIDA|^KUROSE$/m.test(current["51"]), "51 remains wordless");
assert(current["83"].includes("KUROSE (70s)") && current["83"].includes("never had to hurry"));
assert(current["94"].includes("It's only tea.") && !current["94"].includes("For twenty years."));
assert(current["100"].includes("Six new stools, the same height as the old ones.") && current["100"].includes("old hand-painted sign") && current["100"].includes("red bird clip"));
pass("lost introductions/bonding and only-tea restored without undoing deliberate wordless or rewritten-scene choices");

const statement = "VERA\nIshida left a statement. He acted alone.\n\nJACK\nIs that what it says?\n\nVERA\nThat's what the police say it says.\n\n";
const stripped98 = current["98"].replace('SUPER: "FIVE DAYS LATER"\n\n', "").replace(statement, "");
assert.equal(stripped98, before["98"], "Every other byte of the full rooftop scene survives");
assert(current["98"].includes('SUPER: "FIVE DAYS LATER"'));
for (const number of ["85", "87", "91", "92"]) assert.equal(current[number], before[number], `${number} must be unchanged`);
assert(current["91"].includes("A train. It arrives") && current["91"].includes("rung by rung"));
assert(!/train/i.test(before["89"]), "No lost stairwell train to invent or move");
for (const [number, inserted] of [
  ["86", "VERA\n(in Japanese)\nI know them.\n\nJack looks at her.\n\n"],
  ["88", "In the black, Vera's hand finds the wall, low, where a child's hand would reach. She starts to move. Jack follows the sound of her.\n\n"],
  ["90", "Vera leads them to a door with a sumo match murmuring behind it. It opens before she can knock: the OLD WOMAN from 55.\n\n"],
]) assert.equal(current[number].replace(inserted, ""), before[number], `${number} is revised by addition, not cuts`);
pass("98's whole rooftop survives plus exactly the statement/card; 85/87/91/92 unchanged, 86/88/90 add-only, train intact in 91");

const cache = "node_modules/.cache/verify-revision-restoration";
mkdirSync(cache, { recursive: true });
await build({ stdin: { contents: 'export * from "./src/lib/bundle-refresh";', resolveDir: process.cwd() }, outfile: `${cache}/lib.cjs`, bundle: true, platform: "node", format: "cjs", logLevel: "warning" });
const { bundledFrameUpdates } = createRequire(import.meta.url)(`${process.cwd()}/${cache}/lib.cjs`);
const old = structuredClone(project);
old.script = shipped.replace(/ #\d+[A-Z]?#(?=\n|$)/g, "");
old.frames = old.frames.filter(frame => ![158, 159].includes(frame.shotNumber));
const patch = bundledFrameUpdates(old, project);
assert.equal(patch.script, project.script);
assert.equal(patch.frames.length, 347);
assert.deepEqual(patch.frames.filter(frame => frame.sceneId === "neonoire-s99a").map(frame => frame.shotNumber), [158, 159, 305, 306, 307]);
const edited = structuredClone(old); edited.script += "\nWriter's extra scene.\n";
const protectedPatch = bundledFrameUpdates(edited, project);
assert.equal(protectedPatch?.script, undefined);
assert(!protectedPatch?.frames?.some(frame => frame.shotNumber === 158));
const deleted = structuredClone(old); deleted.frames = deleted.frames.filter(frame => frame.id !== "neonoire-shot-01");
assert(!bundledFrameUpdates(deleted, project)?.frames?.some(frame => frame.shotNumber === 158));
pass("known complete saved template receives the restoration; custom scripts and deliberate structural edits/deletions are not overwritten");

// 2 October 2026: the rewrites of scene 6 (interview room), scene 1 (cold open) and scene 2's echoed line reach a saved
// workspace still on the text before them.
const scene6Before = JSON.parse(read("docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json"));
const rewrittenScenes = new Set(["neonoire-s1", "neonoire-s2", "neonoire-s6"]);
const rewrittenIds = project.frames.filter(frame => rewrittenScenes.has(frame.sceneId)).map(frame => frame.id);
const before6 = structuredClone(project);
before6.script = scene6Before.script;
before6.frames = [...project.frames.filter(frame => !rewrittenScenes.has(frame.sceneId)), ...structuredClone(scene6Before.frames)];
const patch6 = bundledFrameUpdates(before6, project);
assert.equal(patch6.script, project.script, "the saved default script takes the rewritten scenes");
const got6 = patch6.frames.filter(frame => rewrittenScenes.has(frame.sceneId));
assert.deepEqual(got6.map(frame => frame.id).sort(), [...rewrittenIds].sort(), "the new slots (328–333 in scene 1, 321–327 in scene 6) arrive");
for (const scene of rewrittenScenes) assert.deepEqual(got6.filter(frame => frame.sceneId === scene).map(frame => frame.id), project.frames.filter(frame => frame.sceneId === scene).map(frame => frame.id), `${scene}: shots arrive in bundle order`);
for (const frame of got6) {
  const wanted = project.frames.find(f => f.id === frame.id);
  assert.deepEqual(frame.audio, wanted.audio, `${frame.id} carries the rewritten dialogue`);
  assert.equal(frame.description, wanted.description, `${frame.id} carries the rewritten description`);
}
const kept6 = structuredClone(before6);
kept6.frames.find(frame => frame.id === "neonoire-shot-56").notes = "My own notes on this shot.";
const keptPatch = bundledFrameUpdates(kept6, project);
assert.equal(keptPatch.frames.find(frame => frame.id === "neonoire-shot-56").notes, "My own notes on this shot.", "a writer's edited notes survive the rewrite");
assert.equal(keptPatch.frames.find(frame => frame.id === "neonoire-shot-56").description, project.frames.find(frame => frame.id === "neonoire-shot-56").description);
const custom6 = structuredClone(before6); custom6.script += "\nWriter's extra scene.\n";
assert.equal(bundledFrameUpdates(custom6, project)?.script, undefined, "an edited script is never replaced");
assert(!bundledFrameUpdates(custom6, project)?.frames?.some(frame => frame.shotNumber === 321 || frame.shotNumber === 328), "and gets no new slots");
pass("a saved workspace on the pre-rewrite default receives the 2 October rewrites (script, shot text, dialogue, slots 321–333); edits and edited scripts are protected");

// 2 October 2026: scene 14A is inserted after scene 14. A saved workspace on the default text before it (the cold-open version
// that main shipped) receives the scene and its ten slots in place; an edited script gets nothing, and a workspace that
// already has the new text but lacks the scene deleted it on purpose and keeps it deleted.
const preScene14A = read("docs/neonoire/baseline/Neonoire_PreScene14A_2026-10-02.fountain").replace(/ #\d+[A-Z]?#(?=\n|$)/g, "");
const s14aIds = project.frames.filter(frame => frame.sceneId === "neonoire-s14a").map(frame => frame.id);
assert.deepEqual(s14aIds, Array.from({ length: 10 }, (_, i) => `neonoire-shot-${334 + i}`), "scene 14A's ten slots are 334–343");
assert.equal(project.scenes.findIndex(scene => scene.id === "neonoire-s14a"), project.scenes.findIndex(scene => scene.id === "neonoire-s14") + 1, "14A follows 14");
const before14a = structuredClone(project);
before14a.script = preScene14A;
before14a.scenes = project.scenes.filter(scene => scene.id !== "neonoire-s14a");
before14a.frames = project.frames.filter(frame => frame.sceneId !== "neonoire-s14a");
const patch14a = bundledFrameUpdates(before14a, project);
assert.equal(patch14a.script, project.script, "the saved default script takes scene 14A");
assert.deepEqual(patch14a.scenes, project.scenes, "14A is in the scene list right after scene 14, as the bundle has it");
assert.deepEqual(patch14a.frames.map(frame => frame.id), project.frames.map(frame => frame.id), "its ten slots arrive in bundle order: after scene 14's shots, before scene 15's");
const edited14a = structuredClone(before14a); edited14a.script += "\nWriter's extra scene.\n";
const editedPatch14a = bundledFrameUpdates(edited14a, project);
assert.equal(editedPatch14a?.script, undefined, "an edited script is never replaced");
assert(!editedPatch14a?.scenes?.some(scene => scene.id === "neonoire-s14a") && !editedPatch14a?.frames?.some(frame => s14aIds.includes(frame.id)), "and gets neither the scene nor its slots");
const deleted14a = structuredClone(project);
deleted14a.scenes = project.scenes.filter(scene => scene.id !== "neonoire-s14a");
deleted14a.frames = project.frames.filter(frame => frame.sceneId !== "neonoire-s14a");
const deletedPatch14a = bundledFrameUpdates(deleted14a, project);
assert(!deletedPatch14a?.scenes?.some(scene => scene.id === "neonoire-s14a") && !deletedPatch14a?.frames?.some(frame => s14aIds.includes(frame.id)), "a workspace on the new text without 14A deleted it, and stays without it");
pass("a saved workspace on the cold-open default receives scene 14A and its slots 334–343 in place; edited scripts and a deliberate deletion are protected");

// 4 October 2026: the long-hold pass added ten numbered coverage frames (344–353, scenes 20, 22 and 23) and changed
// no word of the script. A saved workspace on a known default that holds none of them receives all ten, at their
// bundle positions; a workspace that already holds any of them has had them (so a frame the director deleted is not
// reinstated), and an edited script gets none of them.
const coverageIds = Array.from({ length: 10 }, (_, i) => `neonoire-shot-${344 + i}`);
assert.deepEqual(project.frames.filter(frame => coverageIds.includes(frame.id)).map(frame => frame.id).sort(), [...coverageIds].sort(), "the long-hold frames are 344–353");
assert.deepEqual(project.frames.filter(frame => coverageIds.includes(frame.id)).map(frame => frame.shotNumber), [345, 344, 346, 347, 348, 349, 350, 351, 352, 353], "the bundle plays them at their quoted beats: in scene 20 the book goes into her lap (345) before he sits down (344)");
const beforeCoverage = structuredClone(project);
beforeCoverage.frames = project.frames.filter(frame => !coverageIds.includes(frame.id));
const coveragePatch = bundledFrameUpdates(beforeCoverage, project);
assert.deepEqual(coveragePatch.frames.map(frame => frame.id), project.frames.map(frame => frame.id), "the ten long-hold frames arrive at their bundle positions");
assert.deepEqual(coveragePatch.frames.filter(frame => coverageIds.includes(frame.id)).map(frame => frame.shotNumber), [345, 344, 346, 347, 348, 349, 350, 351, 352, 353], "…in story order: in scene 20 the book goes into her lap (345) before he sits down (344), exactly as the draft's beats run");
assert.equal(coveragePatch.scenes, undefined, "no scene changes with them — this pass adds frames, not scenes");
assert.equal(bundledFrameUpdates({ ...beforeCoverage, ...coveragePatch }, project), null, "and the arrival is idempotent");
const halfHeld = structuredClone(project);
halfHeld.frames = halfHeld.frames.filter(frame => frame.id !== "neonoire-shot-350");
const heldPatch = bundledFrameUpdates(halfHeld, project);
assert(!heldPatch?.frames?.some(frame => frame.id === "neonoire-shot-350"), "a long-hold frame the workspace no longer holds is not reinstated: it had them, and it deleted one");
const editedCoverage = structuredClone(beforeCoverage);
editedCoverage.script += "\nWriter's extra scene.\n";
assert(!bundledFrameUpdates(editedCoverage, project)?.frames?.some(frame => coverageIds.includes(frame.id)), "an edited script gets none of the long-hold frames");
pass("a saved workspace on a default text receives the long-hold coverage 344–353 whole and once; a deleted frame is not reinstated and an edited script gets none");

// 4 October 2026: the second long-hold pass added ten numbered coverage frames (354–363, scenes 29, 17 and 14)
const coverage2Ids = Array.from({ length: 10 }, (_, i) => `neonoire-shot-${354 + i}`);
assert.deepEqual(project.frames.filter(frame => coverage2Ids.includes(frame.id)).map(frame => frame.id).sort(), [...coverage2Ids].sort(), "the second long-hold frames are 354–363");
assert.deepEqual(project.frames.filter(frame => coverage2Ids.includes(frame.id)).map(frame => frame.shotNumber), [361, 362, 363, 358, 359, 360, 354, 355, 356, 357], "the bundle plays them at their quoted beats in scene order (14, 17, 29)");
const beforeCoverage2 = structuredClone(project);
beforeCoverage2.frames = project.frames.filter(frame => !coverage2Ids.includes(frame.id));
const coveragePatch2 = bundledFrameUpdates(beforeCoverage2, project);
assert.deepEqual(coveragePatch2.frames.map(frame => frame.id), project.frames.map(frame => frame.id), "the ten second long-hold frames arrive at their bundle positions");
assert.equal(coveragePatch2.scenes, undefined, "no scene changes with them — this pass adds frames, not scenes");
assert.equal(bundledFrameUpdates({ ...beforeCoverage2, ...coveragePatch2 }, project), null, "and the arrival is idempotent");
const halfHeld2 = structuredClone(project);
halfHeld2.frames = halfHeld2.frames.filter(frame => frame.id !== "neonoire-shot-358");
const heldPatch2 = bundledFrameUpdates(halfHeld2, project);
assert(!heldPatch2?.frames?.some(frame => frame.id === "neonoire-shot-358"), "a long-hold frame the workspace no longer holds is not reinstated: it had them, and it deleted one");
const editedCoverage2 = structuredClone(beforeCoverage2);
editedCoverage2.script += "\nWriter's extra scene.\n";
assert(!bundledFrameUpdates(editedCoverage2, project)?.frames?.some(frame => coverage2Ids.includes(frame.id)), "an edited script gets none of the long-hold frames");
pass("a saved workspace on a default text receives the long-hold coverage 354–363 whole and once; a deleted frame is not reinstated and an edited script gets none");


const voice = JSON.parse(read("docs/neonoire/voice/manifest.json"));
for (const id of ["s13-kaneko-gruffly-eat", "s13-mara-hesitantly-thank-you-has-anyone-come", "s13-kaneko-flatly-nobody-comes-here-who-isn"]) assert.equal(voice.lines.find(line => line.id === id)?.frameId, "neonoire-shot-202");
assert(!voice.lines.some(line => line.id === "s25-mara-he-knew-me-he-saw-me"));
const clips = voice.lines.filter(line => line.frameId === "neonoire-shot-202").sort((a, b) => a.offset - b.offset);
assert(clips.every((line, index) => !index || line.offset >= clips[index - 1].offset + clips[index - 1].duration));
assert(normal(current["25"]).includes(normal(clips[0].text)));
pass("three original voice takes recovered/re-pinned, stale father recollection archived, restored master audio sequenced without overlaps");
console.log("Full-page revision-restoration checks passed.");
