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
// 6 October 2026 (director): everything is spoken in English, so "(in Japanese)" parentheticals are gone from the current script.
// The pre-revision baseline still carries them; compare like with like.
const withoutJapanese = text => text.split("\n").flatMap(line => {
  const m = /^\((.*)\)$/.exec(line.trim());
  if (!m || !m[1].includes("Japanese") || m[1].includes("subtitled")) return [line];
  const parts = m[1].replace("in halting Japanese", "haltingly").replace(/,\s*in Japanese/, "").split(";").map(part => part.trim()).filter(part => part !== "in Japanese");
  return parts.length ? [`(${parts.join("; ")})`] : [];
}).join("\n");
const before = Object.fromEntries(Object.entries(split(read("docs/neonoire/baseline/Neonoire_PreRevision_2026-09-29.fountain"))).map(([number, text]) => [number, withoutJapanese(text)]));
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
assert(current["17"].includes("Jack looks at the counter under his hands.") && !current["17"].includes("third stool"));
assert(!current["17"].includes("hoarding across the street"));
assert(current["40"].includes("MASKED LEADER (40s)") && current["40"].includes("His face stays behind the mask"));
assert(current["51"].includes("Tokyo spread out below in the rain like a circuit board"));
assert(!/^ISHIDA|^KUROSE$/m.test(current["51"]), "51 remains wordless");
assert(current["83"].includes("KUROSE (70s)") && current["83"].includes("never had to hurry"));
assert(current["94"].includes("It's only tea.") && !current["94"].includes("For twenty years."));
assert(current["100"].includes("old hand-painted sign") && current["100"].includes("red bird clip"));
pass("lost introductions/bonding and only-tea restored without undoing deliberate wordless or rewritten-scene choices");

const statement = "VERA\nIshida left a statement. He acted alone.\n\nJACK\nIs that what it says?\n\nVERA\nThat's what the police say it says.\n\n";
const stripped98 = current["98"].replace('SUPER: "FIVE DAYS LATER"\n\n', "").replace(statement, "");
// 6 October 2026 (director): the third-stool line is cut from the rooftop; everything else of the pre-revision scene survives.
const expected98 = before["98"].replace("She's taking the sign. And the stools.\n(beat)\nShe says the third one's still mine.\n", "She's taking the sign.\n");
assert.notEqual(expected98, before["98"], "the pre-revision rooftop carried the stool line the director cut");
assert.equal(stripped98, expected98, "Every other byte of the full rooftop scene survives");
assert(current["98"].includes('SUPER: "FIVE DAYS LATER"'));
// 6 October 2026 (director): the Hive's alarm — Kaneko strikes the water pipe, the pipes pass it on, the repairman has heard it, and the escape crosses more rooms.
// Everything in the pre-revision scenes survives; these are the only additions.
const alarm = {
  "85": ["Three hard strikes, iron on iron, run up the pipes overhead. Then again, farther off: a spoon on a radiator, a knuckle on a drainpipe, floor above floor. The Hive is passing it on.\n\n"],
  "86": ["KANEKO (CONT'D)\nGo now. They will help you.\n\n", "Kaneko lowers the ladle from the old iron water pipe by the stove. Three strikes were all it took: the alarm the Hive has kept for fifty years.\n\n"],
  "87": ["The pipes have already told him. "],
  "90": ["Through the wardrobe, a barber's cramped shop. The BARBER holds the beaded curtain aside with his scissors hand and turns the chair to the wall, so that anyone looking in will see only a man waiting for a haircut.\n\n", "Down four steps into a laundry where wet sheets hang in rows. Two WOMEN part the sheets ahead of them and pin them shut again behind, so that the whole room closes like water over the place they went.\n\n", "A shrine room. A GRANDMOTHER lifts the altar cloth and a low hatch opens behind it. She holds the cloth until they are through, then smooths it flat over the candle and the photograph as if nothing had happened.\n\n", "A plank laid across the gap between two balconies, a balcony bolted onto a balcony. Two MEN in vests steady it at both ends, and when the last of them is across, haul it in after them, so that the gap is only a gap.\n\n", "A pipe gallery, the pipes ringing softly all around them. A WOMAN raps one pipe once for clear, and the next hand takes it up farther on: the alarm still passing, now telling them which way is safe.\n\n"],
};
for (const [number, adds] of Object.entries(alarm)) for (const add of adds) assert(current[number].includes(add), `${number} carries the alarm addition`);
const withoutAlarm = number => (alarm[number] || []).reduce((text, add) => text.replace(add, ""), current[number]);
for (const number of ["85", "87", "91", "92"]) assert.equal(withoutAlarm(number), before[number], `${number} is unchanged apart from the alarm additions`);
assert(current["91"].includes("A train. It arrives") && current["91"].includes("rung by rung"));
assert(!/train/i.test(before["89"]), "No lost stairwell train to invent or move");
for (const [number, inserted] of [
  ["86", "VERA\nI know them.\n\nJack looks at her.\n\n"],
  ["88", "In the black, Vera's hand finds the wall, low, where a child's hand would reach. She starts to move. Jack follows the sound of her.\n\n"],
  ["90", "Vera leads them to a door with a sumo match murmuring behind it. It opens before she can knock: the OLD WOMAN from 55.\n\n"],
]) assert.equal(withoutAlarm(number).replace(inserted, ""), before[number], `${number} is revised by addition, not cuts`);
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
assert.equal(patch.frames.length, 366);
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

// 4 October 2026: the second coverage pass adds shots 369–376 to five existing scenes without a script change.
const coverage3Ids = Array.from({ length: 8 }, (_, i) => `neonoire-shot-${369 + i}`);
assert.deepEqual(project.frames.filter(frame => coverage3Ids.includes(frame.id)).map(frame => frame.id).sort(), [...coverage3Ids].sort(), "the second coverage pass is exactly 369–376");
assert.deepEqual(project.frames.filter(frame => coverage3Ids.includes(frame.id)).map(frame => frame.shotNumber), [375, 372, 371, 369, 370, 373, 374, 376], "the bundle places each new frame at its own quoted script beat");
const beforeCoverage3 = structuredClone(project);
beforeCoverage3.frames = project.frames.filter(frame => !coverage3Ids.includes(frame.id));
const coveragePatch3 = bundledFrameUpdates(beforeCoverage3, project);
assert.deepEqual(coveragePatch3.frames.map(frame => frame.id), project.frames.map(frame => frame.id), "all eight new frames arrive in bundle/story order");
assert.deepEqual(coveragePatch3.frames.filter(frame => coverage3Ids.includes(frame.id)).map(frame => frame.shotNumber), [375, 372, 371, 369, 370, 373, 374, 376]);
assert.equal(coveragePatch3.scenes, undefined, "the coverage batch adds no scenes or script changes");
assert.equal(bundledFrameUpdates({ ...beforeCoverage3, ...coveragePatch3 }, project), null, "the new batch is idempotent");
const halfHeld3 = structuredClone(project);
halfHeld3.frames = halfHeld3.frames.filter(frame => frame.id !== "neonoire-shot-375");
const heldPatch3 = bundledFrameUpdates(halfHeld3, project);
assert(!heldPatch3?.frames?.some(frame => frame.id === "neonoire-shot-375"), "a frame deleted from a workspace that already held the batch is not reinstated");
const editedCoverage3 = structuredClone(beforeCoverage3);
editedCoverage3.script += "\nWriter's extra scene.\n";
assert(!bundledFrameUpdates(editedCoverage3, project)?.frames?.some(frame => coverage3Ids.includes(frame.id)), "an edited script receives none of the new batch");
pass("a saved default receives all eight coverage frames 369–376 at their beats, once; edits, deliberate deletion and custom scripts are protected");


// 7 October 2026: the 160 lines the games read with text-to-speech were recorded. A saved workspace still holding a frame's earlier
// dialogue takes the new takes and offsets (and the frame is lengthened to fit); a frame whose dialogue the writer edited keeps it;
// frames that had no dialogue gain it.
const voiceBefore = JSON.parse(read("docs/neonoire/baseline/voice-pre-audit-2026-10-07.json"));
const beforeVoices = structuredClone(project);
for (const [id, prior] of Object.entries(voiceBefore.frames)) {
  const frame = beforeVoices.frames.find(f => f.id === id);
  if (prior.audio) frame.audio = structuredClone(prior.audio); else delete frame.audio;
  frame.duration = prior.duration;
}
const voicePatch = bundledFrameUpdates(beforeVoices, project);
assert(voicePatch, "a workspace on the earlier dialogue receives the new dialogue");
for (const id of Object.keys(voiceBefore.frames)) {
  const got = voicePatch.frames.find(f => f.id === id), want = project.frames.find(f => f.id === id);
  assert.deepEqual(got.audio, want.audio, `${id} takes the recorded dialogue`);
  assert(got.duration >= want.duration, `${id} is long enough for its lines`);
}
const voicedBefore = Object.entries(voiceBefore.frames).filter(([, prior]) => prior.audio).map(([id]) => id);
assert(voicedBefore.length >= 15 && voicedBefore.length < Object.keys(voiceBefore.frames).length, "some of the changed frames were voiced before, some were silent");
const editedVoice = structuredClone(beforeVoices);
const writerEdit = editedVoice.frames.find(f => f.id === "neonoire-shot-166");
writerEdit.audio[0].offset += 1;
const editedVoicePatch = bundledFrameUpdates(editedVoice, project);
assert.deepEqual(editedVoicePatch.frames.find(f => f.id === "neonoire-shot-166").audio, writerEdit.audio, "a frame whose dialogue the writer moved keeps their version");
assert.deepEqual(editedVoicePatch.frames.find(f => f.id === "neonoire-shot-202").audio, project.frames.find(f => f.id === "neonoire-shot-202").audio, "and the untouched frames still take the new takes");
assert.equal(bundledFrameUpdates({ ...beforeVoices, ...voicePatch }, project), null, "the dialogue refresh is idempotent");
pass(`a saved workspace holding the earlier dialogue takes the 7 October takes (${voicedBefore.length} voiced frames change, ${Object.keys(voiceBefore.frames).length - voicedBefore.length} silent ones gain theirs); a writer's edited frame keeps its own`);

const voice = JSON.parse(read("docs/neonoire/voice/manifest.json"));
for (const id of ["s13-kaneko-gruffly-eat", "s13-mara-hesitantly-thank-you-has-anyone-come", "s13-kaneko-flatly-nobody-comes-here-who-isn"]) assert.equal(voice.lines.find(line => line.id === id)?.frameId, "neonoire-shot-202");
assert(!voice.lines.some(line => line.id === "s25-mara-he-knew-me-he-saw-me"));
const clips = voice.lines.filter(line => line.frameId === "neonoire-shot-202").sort((a, b) => a.offset - b.offset);
assert(clips.every((line, index) => !index || line.offset >= clips[index - 1].offset + clips[index - 1].duration));
assert(normal(current["25"]).includes(normal(clips[0].text)));
pass("three original voice takes recovered/re-pinned, stale father recollection archived, restored master audio sequenced without overlaps");
console.log("Full-page revision-restoration checks passed.");
