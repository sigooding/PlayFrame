// Offline regression checks for the NEONOIRE workspace (final screenplay + opening boards).
//
//   npm run verify:neonoire
//
// Checks, with no server and no browser: the bundle is in step with the final screenplay and the
// opening's boards, the screenplay tab carries all one hundred scenes and each scene selects its
// own heading, every frame
// carries a shot type and a lens from the app's own libraries, every claimed keyframe is on disk,
// the cast links are reciprocal, and the prompt studio and CSV export handle the project.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { SCENES, parseBoard, readBoard } from "./neonoire/plan.mjs";
import { streetsPassOneImages, streetsPassTwoImages } from "./neonoire/streets-look.mjs";
import { dawnImages, jackRecastDone, jackRecastImages, jackRecastPending, policeDayImages } from "./neonoire/dawn-look.mjs";
import { rewritePending } from "./neonoire/rewrite-pending.mjs";
import { remainingBoardsCompleted } from "./neonoire/remaining-boards.mjs";
import { remainingBoardsFinalShots } from "./neonoire/remaining-boards-final.mjs";
import { directorApprovedMainIds, directorReplacementShots } from "./neonoire/director-corrections.mjs";
const expectedDraftStatus = frame => directorApprovedMainIds.has(frame.id) ? "Ready" : "Draft";
import { inStoryOrder } from "./neonoire/story-order.mjs";
import { witnessImages, witnessNeedsReview } from "./neonoire/witness-look.mjs";
import { hiveImages } from "./neonoire/hive-look.mjs";
import { escapeImages } from "./neonoire/escape-look.mjs";
import { ishidaEndImages } from "./neonoire/ishida-end-look.mjs";
import { hiveMorningImages, veraLookDSheet } from "./neonoire/hive-morning-look.mjs";
import { endingImages, veraLookESheet } from "./neonoire/ending-look.mjs";
import { kandaReturnImages } from "./neonoire/kanda-return-look.mjs";
import { innImages, innStairFrames, innWarmLook } from "./neonoire/inn-look.mjs";
import { kandaBarScenes, kandaBarSheet, kandaBarLook } from "./neonoire/bar-look.mjs";
import { TAIL, readManifest, readVoices } from "./neonoire/voice.mjs";
import { hiveFirstImages } from "./neonoire/hive-first-look.mjs";
import { confrontationImages, veraLookCImages, veraLookCSheet } from "./neonoire/confrontation-look.mjs";
import { officeLayoutLock, officeLayoutLook, officeLayoutQueued, officeLayoutRetakes, officeLayoutScenes, officeRoomMaster } from "./neonoire/office-layout-look.mjs";
import { interviewLook } from "./neonoire/interview-look.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(root, "node_modules/.cache/verify-neonoire");
mkdirSync(cache, { recursive: true });
const read = file => readFileSync(join(root, file), "utf8");
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== NEONOIRE — the final screenplay workspace ===");

// The builder proves the pages rebuild the draft and every quoted line is in it.
execFileSync(process.execPath, ["scripts/neonoire/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const project = JSON.parse(read("public/projects/neonoire-opening.json"));
const bundle = JSON.parse(read("public/projects/let-the-raptures-commence.json"));
const fountain = read("Neonoire (3).fountain");
const plannedShots = SCENES.flatMap(scene => parseBoard(readBoard(root, scene), scene));
const plannedById = new Map(plannedShots.map(shot => [shot.id, shot]));
// Generation-pass audits below use production order. It is deliberately NOT the app's playback order.
const generationFrames = [...project.frames].sort((a, b) => a.shotNumber - b.shotNumber);
assert.deepEqual(project.frames.map(f => f.id), inStoryOrder(generationFrames, project.scenes, root).map(f => f.id), "The portable bundle must follow screenplay scenes with coverage at its own quoted beat");
const sceneRank = new Map(project.scenes.map((scene, index) => [scene.id, index]));
assert(project.frames.every((frame, index) => index === 0 || sceneRank.get(frame.sceneId) >= sceneRank.get(project.frames[index - 1].sceneId)), "Scene order never goes backwards");
for (const frame of project.frames) assert.equal(frame.shotNumber, plannedById.get(frame.id).n, `${frame.id} keeps its production number`);
pass("storyboard running order: screenplay scenes and quoted coverage beats, with stable production numbers");

const exportsFile = join(cache, "project.mjs");
await build({
  stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/prompt"; export * from "./src/lib/export"; export * from "./src/lib/seed"; export * from "./src/lib/structure"; export * from "./src/lib/styles"; export * from "./src/lib/types";', resolveDir: root },
  outfile: exportsFile, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const {
  validatePatch, sanitizeImport, buildFramePrompt, buildScenePrompt, shotListCsv, scenesInScript,
  starterProjects, sceneHeadings, normaliseSlugline, SHOT_TYPES, CAMERA_MOVEMENTS, CAMERA_ANGLES, LENSES, LIGHTING,
} = await import(pathToFileURL(exportsFile).href);

// ---------------------------------------------------------------- schema and ceilings
validatePatch(project);
assert.equal(project.acts.length, 1);
assert.equal(project.scenes.length, 102, "The revised screenplay's 96 numbered scenes and 6 inserted scenes (25A, 27A, 53A, 63A, 82A, 99A) all belong to the workspace; 13, 24, 97 and 99 are retired");
const boardedIds = new Set(project.frames.map(frame => frame.sceneId));
assert.equal(boardedIds.size, 102, "Every scene of the revised screenplay and the six inserted scenes are boarded; no board survives for a retired scene");
assert(project.scenes.filter(scene => !boardedIds.has(scene.id)).every(scene => scene.description.startsWith("WRITTEN, NOT BOARDED")), "Unboarded scenes say honestly that the board has not reached them");
assert(project.scenes.filter(scene => !boardedIds.has(scene.id)).every(scene => scene.partId === "neonoire-part-feature"), "Unboarded scenes hang together in one sequence");
const EXPECTED_SHOTS = 299;
const shotNo = frame => Number(String(frame.id).replace("neonoire-shot-", ""));
// 30 September 2026: the revision's boards (308–320) sit with their scenes but join none of the
// earlier generation blocks; the audits below read those blocks' pre-revision runs.
const revisionBoards = f => shotNo(f) >= 308;
assert.equal(project.frames.length, EXPECTED_SHOTS, "The restored screenplay carries 299 numbered shots (158/159 returned inside 99A): 307 stood before the 30 September revision, which retired 22 frames in place and boarded 13 new ones (308–320)");
assert.equal(project.characters.length, 19, "Nineteen cast cards after the revision added Vera's mother");
assert(project.scenes.every(scene => scene.style === "neonoire"), "Every scene is lit and generated in the studio brief's own look");
assert(project.frames.every(frame => frame.style === "neonoire"), "Every frame carries the Neo-Noir Tokyo style, so prompts use the brief automatically");
assert(project.frames.every(frame => frame.lens), "Every frame declares a lens");
assert.equal(project.notes.length, 8);
assert(project.notes.some(note => note.id === "neonoire-frame-format" && /16:9 full-bleed, 1920×1080/.test(note.content)), "The workspace carries the film's 16:9 frame rule");
assert.equal(project.brainstorm.length, 6);
assert(project.moodboards.length >= 3 && project.moodboards.length <= 8, "The boards carried are the ones with keyframes on them");
for (const board of project.moodboards) assert(board.items.length > 0, `An empty mood board is a dead card: ${board.title}`);
assert(project.scenes.every(scene => scene.actId === project.acts[0].id), "Every scene belongs to the opening act");
assert.equal(new Set(project.frames.map(frame => frame.id)).size, EXPECTED_SHOTS, "Frame ids are unique");
assert.equal(new Set(project.frames.map(frame => `${frame.sceneId}/${frame.title}`)).size, EXPECTED_SHOTS, "No two shots in a scene share a title");
pass(`the bundle validates: ${project.scenes.length} scenes, ${project.frames.length} shots, ${project.characters.length} cast, ${project.moodboards.length} boards`);
assert(project.notes.some(note => note.id === "neonoire-style-block" && /Neo-Noir Tokyo|35mm Kodak Vision3 500T/.test(note.content)), "The style block should travel with the project");
assert(project.moodboards.some(b => b.id === "neonoire-look-style" && b.items.length === 9), "The nine keys should be on their own board");
for (const item of project.moodboards.find(b => b.id === "neonoire-look-style").items) assert(existsSync(join(root, "public", item.image)), `Missing style key: ${item.image}`);

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
// The workspace script is the draft with its one hundred `#n#` markers removed, and nothing else changed.
const clean = fountain.replace(/ #\d+[A-Z]?#(?=\n|$)/g, "");
assert.equal(project.script.replace(/\s+$/, ""), clean.replace(/\s+$/, ""), "The screenplay should be the draft, minus its scene-number markers");
for (const scene of project.scenes) assert(project.script.includes(`${scene.location} - ${scene.time}`), `${scene.title}'s slugline must survive in the script`);
pass(`the screenplay carries all 102 scenes (96 numbered, 6 inserted), in order, each selecting its own slugline (${project.script.split(/\s+/).length} words)`);
assert(fountain.includes("The number on the worn tag, still legible: 114."), "Scene 25 must reveal 114 on the tag");
assert(fountain.includes("Its worn tag reads 114."), "Scene 60 must repeat the tag number");
assert(!fountain.includes("The plastic tag is so old the printing has worn away."), "The old metal-stamp/blank-tag explanation is superseded");
pass("key-tag script clarification: 114 is legible on the worn tag, not stamped metal with a blank tag");

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

// Scenes 4–7's requested format is in the JPEG bytes, not just a cropped UI preview.
function jpegDimensions(file) {
  const bytes = readFileSync(join(root, "public", file));
  assert.equal(bytes.readUInt16BE(0), 0xffd8, `${file} must be JPEG`);
  for (let offset = 2; offset + 8 < bytes.length;) {
    assert.equal(bytes[offset], 0xff, `${file}: invalid JPEG marker`);
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
    }
    const length = bytes.readUInt16BE(offset + 2);
    assert(length >= 2, `${file}: invalid JPEG segment`);
    offset += 2 + length;
  }
  throw new Error(`No JPEG dimensions in ${file}`);
}
const { coldOpenLook, coldOpenCompletedThrough, isColdOpenScene } = await import("./neonoire/cold-open-look.mjs");
const { coldOpenFreshLook, coldOpenFreshCompleted } = await import("./neonoire/cold-open-fresh-look.mjs");
assert(coldOpenCompletedThrough >= 10 && coldOpenCompletedThrough <= 28);
const coldOpen = generationFrames.filter(frame => ["neonoire-s1", "neonoire-s2"].includes(frame.sceneId) && shotNo(frame) <= 28);
// The 30 September revision retired scene 1's shots 8 and 11 in place; 26 cold-open frames remain.
assert.equal(coldOpen.length, 26);
for (const frame of coldOpen) {
  const n = Number(frame.id.replace("neonoire-shot-", ""));
  assert(isColdOpenScene(frame.sceneId.replace("neonoire-", "")));
  if (n <= coldOpenCompletedThrough) {
    assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be revised 16:9`);
    assert(!frame.notes.includes("COLD OPEN REVISION PENDING"));
    if (coldOpenFreshCompleted.includes(n)) {
      assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : "Ready", `${frame.title} is director-approved fresh-pass coverage`);
      // Fresh pass of 30 September 2026: the frame carries the character-sheet-only provenance and
      // must not wear the older master-derived revision note.
      for (const detail of ["Cold-open fresh pass", "CHARACTER SHEETS ONLY", "sheets/mara.jpg", "sheets/sakai.jpg", "sheets/masked-man.jpg", "red enamel bird clip", "dark-brown structured leather handbag", "spills across the wet street", "stamped number tag worn almost smooth"]) {
        assert(frame.notes.includes(detail), `${frame.title} lacks fresh-pass continuity: ${detail}`);
      }
      assert(!frame.notes.includes("Cold-open visual revision"), `${frame.title} is fresh-pass coverage, not the master-derived revision`);
    } else {
      for (const detail of ["Cold-open visual revision", "s1/01-backstreet.jpg", "s1/07-old-man.jpg", "s1/08-sedan-arrives.jpg", "red enamel bird clip", "dark-brown structured leather handbag", "Strap intact through 16", "114 on its worn tag"]) {
        assert(frame.notes.includes(detail), `${frame.title} lacks cold-open continuity: ${detail}`);
      }
    }
  } else {
    assert.deepEqual(jpegDimensions(frame.image), [1912, 800], `${frame.title}: legacy image must not masquerade as a revised frame`);
    assert.equal(frame.status, "Needs review");
    assert(frame.notes.includes("COLD OPEN REVISION PENDING"));
    assert(!frame.notes.includes("Cold-open visual revision:"));
  }
}
for (const sheet of ["images/neonoire/sheets/sakai.jpg", "images/neonoire/sheets/journalist.jpg"]) {
  const [w, h] = jpegDimensions(sheet);
  assert(w > h, `${sheet} exists and is a landscape cast sheet`);
}
assert(coldOpenFreshLook.includes("CHARACTER SHEETS ONLY") && coldOpenFreshLook.includes("no scene masters"), "The fresh-pass brief carries the character-references-only rule");
pass(`cold-open: all ${coldOpen.length} surviving frames of scenes 1–2 are 1920×1080 fresh-pass images (8, 11 and 280–282 retired by the 30 September revision); the five re-pinned retakes hold Needs review`);

// The 30 September 2026 revision retired scene 1's coverage 280–282 and its shots 8 and 11 in
// place; what remains of the cold open's first scene is its original run, minus the two retired
// numbers, each frame re-pinned to the rewritten street.
const s1frames = generationFrames.filter(frame => frame.sceneId === "neonoire-s1");
assert.deepEqual(s1frames.map(f => shotNo(f)), [1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18], "Scene 1 runs 1–18 with 8 and 11 retired, and nothing above 28");
for (const n of [3, 6, 17, 18])
  assert(rewritePending.has(`neonoire-shot-${String(n).padStart(2, "0")}`), `Scene 1's re-pinned frame ${n} holds its retake`);
pass("scene 1 after the revision: sixteen frames, four of them re-pinned under RETAKE PENDING, the letter coverage retired with the cut beats");
assert(project.frames.find(f => f.id === "neonoire-shot-07").notes.includes("Retake 28 September 2026"), "Shot 7 still carries the letter-rewrite retake note the 30 September revision left standing");
// Kanda alley layout pass, 29 September 2026 — the sedan blocks the alley mouth, the men walk in
// and out on foot, and the six blocked frames are retaken to the fixed pedestrian layout.
const backsOut = project.frames.find(frame => frame.id === "neonoire-shot-13");
assert(backsOut.notes.includes("plate is not legible"), "Shot 13 keeps the layout-pass plate note; its alley reverse was re-pinned by the 30 September revision and the frame stands under RETAKE PENDING with its neighbours");
for (const n of [10, 12, 13, 17, 18]) {
  const frame = project.frames.find(f => f.id === `neonoire-shot-${String(n).padStart(2, "0")}`);
  assert(frame.notes.includes("Retake 29 September 2026 (the layout pass)") && frame.notes.includes("sheets/kanda-alley-layout.jpg"), `Shot ${n} carries the layout-pass retake note and the layout sheet`);
}
assert(coldOpenLook.includes("Alley layout (canonical") && coldOpenLook.includes("too narrow for cars") && coldOpenLook.includes("Mara runs away from the car"), "The cold-open look carries the canonical alley layout");
assert.deepEqual(jpegDimensions("images/neonoire/sheets/kanda-alley-layout.jpg"), [1920, 1080], "The kanda layout sheet is 1920×1080");
pass("kanda alley layout: the sedan blocks the mouth, the six frames retaken, the layout sheet installed");

// Scenes 72–75: session one (nine studies plus Jack's sheet, ten calls) and session two (the six
// pending replacements plus the lost-heel and twenty-metre continuity replacements, eight calls)
// together complete every keyframe. The old street studies stay retired either way.
const streets = generationFrames.filter(frame => ["neonoire-s72", "neonoire-s73", "neonoire-s74", "neonoire-s75"].includes(frame.sceneId) && !revisionBoards(frame));
assert.equal(streets.length, 15, "Two lounge, four run, four confrontation and five pillow shots");
assert.equal(streets.filter(f => f.image).length, 15, "Both sessions delivered: no placeholder slots remain in scenes 72–75");
assert.equal(streetsPassOneImages.length, 10, "The session-one budget includes Jack's sheet");
assert.equal(new Set(streetsPassOneImages).size, 10);
assert.equal(streetsPassTwoImages.length, 8, "Session two: six needed shots plus two continuity replacements, two slots held back");
assert.equal(new Set(streetsPassTwoImages).size, 8);
for (const image of [...streetsPassOneImages, ...streetsPassTwoImages]) assert.deepEqual(jpegDimensions(image), [1920, 1080], `${image}: native delivery must be 16:9`);
const deliveredStreetImages = new Set([...streetsPassOneImages, ...streetsPassTwoImages].filter(image => !image.includes("/sheets/")));
assert.deepEqual(new Set(streets.map(f => f.image)), deliveredStreetImages, "Every completed frame is a replacement from this revision, not a legacy study");
assert(!streets.some(f => f.notes.includes("REPLACEMENT PENDING")), "No pending street replacement remains");
for (const frame of streets) {
  assert.equal(frame.movement, "Static", `${frame.title}: no tracking or push-in`);
  assert.equal(frame.angle, "Low, level", `${frame.title}: low height is NOT an upward hero angle`);
  assert.equal(frame.lens, frame.id === "neonoire-shot-73" ? "35mm" : "50mm");
  assert(frame.notes.includes("Tokyo Story in colour"));
  assert(frame.notes.includes("RIGHT foot bare, LEFT red shoe retained"));
  assert.equal(frame.status, jackRecastPending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: only the superseded-Jack frames await review`);
  assert.equal(frame.notes.includes("JACK RECAST PENDING"), jackRecastPending.has(frame.id));
  assert.equal(frame.style, "neonoire");
}
const twentyMetres = streets.find(f => f.id === "neonoire-shot-74");
assert(/twenty-metre gap is on screen/.test(twentyMetres.notes) && /session two/.test(twentyMetres.notes), "Board 75's keyframe must stage the scripted separation distance itself");
const lostHeel = streets.find(f => f.id === "neonoire-shot-72");
assert(/match the shot 79 still life/.test(lostHeel.notes), "Board 74's keyframe must carry the shot 79 puddle/drain lock");
const lounge = streets.filter(f => f.sceneId === "neonoire-s72");
assert.equal(lounge.length, 2);
for (const frame of lounge) {
  assert(/dry/i.test(frame.description) && /intact/i.test(frame.description), "Makeup stays intact until the rain");
  assert(!/mascara running|mascara runs|wet hair/i.test(frame.description), "Do not pre-ruin Vera in the hotel");
}
assert.deepEqual(streets.filter(f => f.sceneId === "neonoire-s74").map(f => f.id), ["neonoire-shot-74", "neonoire-shot-75", "neonoire-shot-73", "neonoire-shot-76"], "The confrontation must run approach, blows/folding, aftermath wide, reflection");
const wide = project.frames.find(f => f.id === "neonoire-shot-73");
assert(wide.description.includes("sits") && wide.description.includes("kneels"), "The extreme wide is the aftermath, not two standing figures");
assert.deepEqual(wide.characters, ["neonoire-vera", "neonoire-jack"], "Tiny figures still need cast references");
assert(project.frames.find(f => f.id === "neonoire-shot-75").description.includes("rejection"), "Do not board only the blow and omit the collapse/rejection");
assert(/same puddle, same shoe/i.test(project.frames.find(f => f.id === "neonoire-shot-77").notes));
assert(streets.filter(f => f.sceneId === "neonoire-s75").every(f => !f.characters.length), "Pillow shots have no cast, including reflections");
assert(project.moodboards.some(b => b.id === "neonoire-look-tokyo-story" && b.items.length === 16));
const aftermath = generationFrames.filter(f => f.sceneId === "neonoire-s76" && !revisionBoards(f));
assert.deepEqual(aftermath.map(f => f.id), ["neonoire-shot-82", "neonoire-shot-83", "neonoire-shot-84"], "Scene 76 stable identities remain unchanged");
for (const frame of aftermath) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert(frame.notes.includes("Scene 76 is unchanged"));
}
for (let n = 1; n <= 84; n++) { if ([8, 11].includes(n)) continue; assert(project.frames.some(f => f.id === `neonoire-shot-${String(n).padStart(2, "0")}`), `Existing frame identity ${n} must survive the inserted scene 72 (8 and 11 retired by the 30 September revision alone)`); }
// Scenes 77–79: first boarding, nine shots, with Jack recast as a white American in the same session.
const dawn = generationFrames.filter(frame => ["neonoire-s77", "neonoire-s78", "neonoire-s79"].includes(frame.sceneId) && shotNo(frame) <= 95);
assert.equal(dawn.length, 9, "Three office, three corridor and three apartment shots");
assert.deepEqual(dawn.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${87 + i}`), "New stable IDs start after scene 72's 85–86");
assert.deepEqual(new Set(dawn.map(f => f.image)), new Set(dawnImages), "Every scenes 77–79 frame is a delivered generation");
for (const frame of dawn) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title}: 16:9 delivery`);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, expectedDraftStatus(frame));
  for (const detail of ["white American", "DANIEL VOSS", "BAREFOOT", "umbrella stand EMPTY", "exactly two ivory cups, both empty"]) assert(frame.notes.includes(detail), `${frame.title} is missing scenes 77–79 continuity: ${detail}`);
}
assert(dawn.filter(f => f.sceneId === "neonoire-s77").every(f => f.characters.includes("neonoire-jack")));
assert(dawn.filter(f => f.sceneId !== "neonoire-s77").every(f => f.characters.join() === "neonoire-vera"));
assert.deepEqual(jpegDimensions("/images/neonoire/sheets/jack.jpg"), [1920, 1080], "Jack's recast sheet is 16:9");
assert(/white American/.test(project.characters.find(c => c.id === "neonoire-jack").description), "Jack's cast card carries the recast");
const dawnBoard = project.moodboards.find(b => b.id === "neonoire-look-dawn");
assert(dawnBoard && dawnBoard.items.length === 11, "The scenes 77–79 board carries the nine boarded shots, the two dawn studies and the revision's 316");
assert(dawnBoard.items.some(i => i.image === "/images/neonoire/s78/316-squared-to-the-door.jpg"), "The revision's squared-to-the-door board joins the scenes 77–79 board");
pass("scenes 77–79 boarded: nine 16:9 shots, Jack recast as a white American");

// The recast carried back into scene 74, and scene 80 boarded.
assert.equal(jackRecastPending.size, 0, "No frame still shows the superseded Jack");
assert.equal(jackRecastImages.length, 3);
for (const image of jackRecastImages) assert.deepEqual(jpegDimensions(image), [1920, 1080]);
for (const id of jackRecastDone) {
  const frame = project.frames.find(f => f.id === id);
  assert(frame.characters.includes("neonoire-jack") && frame.notes.includes("JACK RECAST APPLIED") && frame.status === "Draft", `${frame.title}: recast applied`);
}
assert.deepEqual(new Set(project.frames.filter(f => f.characters.includes("neonoire-jack") && f.sceneId === "neonoire-s74").map(f => f.id)), jackRecastDone, "Every scene 74 Jack frame carries the recast");
const policeDay = generationFrames.filter(f => f.sceneId === "neonoire-s80");
assert.deepEqual(policeDay.map(f => f.id), Array.from({ length: 6 }, (_, i) => `neonoire-shot-${96 + i}`));
assert.deepEqual(new Set(policeDay.map(f => f.image)), new Set(policeDayImages));
for (const frame of policeDay) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.lighting, "Natural daylight");
  for (const detail of ["s7/63-the-detectives-room.jpg", "SINGLE round black-rim", "NO TIE", "white American", "never hits him"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 80 continuity: ${detail}`);
}
assert.equal(policeDay[0].lens, "24mm"); assert.equal(policeDay[4].lens, "24mm");
pass("Jack recast applied to all three scene 74 frames; scene 80 boarded: six 16:9 shots, one clock, Ishida with no tie");

// Scenes 81–82: the cassette and the witness.
const witness = generationFrames.filter(f => f.sceneId === "neonoire-s81" || f.sceneId === "neonoire-s82");
assert.deepEqual(witness.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${102 + i}`));
assert.deepEqual(new Set(witness.map(f => f.image)), new Set(witnessImages));
const castOf = name => project.characters.find(c => c.name === name).id;
for (const frame of witness) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.lighting, "Overcast soft");
  const look = frame.sceneId === "neonoire-s81" ? ["s2/19-the-bar.jpg", "SHIOHAMA", "white American", "OKADA"] : ["s2/20-the-journalist.jpg", "HARADA", "never hear Jack's testimony"];
  for (const detail of look) assert(frame.notes.includes(detail), `${frame.title} is missing scene 81–82 continuity: ${detail}`);
  assert.equal(frame.status, witnessNeedsReview.has(frame.id) ? "Needs review" : "Draft", `${frame.title} status`);
}
assert(witness.filter(f => f.sceneId === "neonoire-s81" && f.characters.length > 1).every(f => f.characters.includes(castOf("Okada")) && f.characters.includes(castOf("Jack"))), "Scene 81 two-handers are Okada and Jack");
assert(["neonoire-shot-107", "neonoire-shot-109"].every(id => witness.find(f => f.id === id).characters.includes(castOf("The Journalist"))), "The photograph on Harada's desk is the journalist");
assert.equal(witness.find(f => f.id === "neonoire-shot-106").lens, "24mm"); assert.equal(witness.find(f => f.id === "neonoire-shot-110").lens, "24mm");
assert(witness.find(f => f.id === "neonoire-shot-108").notes.includes("BY DIRECTOR'S CHOICE") && witness.find(f => f.id === "neonoire-shot-108").status === "Draft", "Shot 108 keeps the chosen original tape and says so");
pass("scenes 81–82 boarded: nine 16:9 shots, Okada and Harada carded, the SHIOHAMA tape, and shot 108 on the director's chosen original tape");

// Scenes 83–84: Kurose's office and the Hive storeroom.
const confrontation = generationFrames.filter(f => (f.sceneId === "neonoire-s83" || f.sceneId === "neonoire-s84") && !revisionBoards(f));
assert.deepEqual(confrontation.map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${111 + i}`));
assert.deepEqual(new Set(confrontation.map(f => f.image)), new Set(confrontationImages));
for (const frame of confrontation) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: only the revision retakes await review`);
  const office = frame.sceneId === "neonoire-s83";
  assert.equal(frame.lighting, office ? "Overcast soft" : "Low key");
  const look = office ? ["GLASS CASE", "KUROSE", "never touches the tea", "sheets/vera.jpg"] : ["single bare bulb", "white American", "scenes 14, 20 and 25"];
  for (const detail of look) assert(frame.notes.includes(detail), `${frame.title} is missing scene 83–84 continuity: ${detail}`);
  assert(frame.characters.includes(castOf(office ? "Vera Voss" : "Jack")) || frame.characters.includes(castOf("Kurose")) || frame.characters.includes(castOf("Vera Voss")), `${frame.title} cast`);
}
assert(!confrontation.some(f => f.sceneId === "neonoire-s84" && f.characters.includes(castOf("Kurose"))), "Kurose is not in the storeroom");
assert.deepEqual(jpegDimensions(veraLookCSheet), [1920, 1080]);
const veraCostumed = confrontation.filter(f => f.characters.includes(castOf("Vera Voss")));
assert.deepEqual(new Set(veraCostumed.map(f => f.image)), new Set(veraLookCImages), "Every Vera frame in 83–84 is in costume Look C");
for (const frame of veraCostumed) assert(frame.notes.includes("WARDROBE LOOK C") && frame.notes.includes("sheets/vera-look-c.jpg") && !frame.notes.includes("cream roll-neck, hair dry"), `${frame.title}: Vera's costume change`);
assert(project.moodboards.some(b => b.items.some(i => i.image === veraLookCSheet)), "Look C travels with the cast board");
assert.equal(confrontation[0].lens, "24mm"); assert.equal(confrontation[6].lens, "24mm");
pass("scenes 83–84 boarded: ten 16:9 shots, Kurose carded, the model under glass, and the storeroom's first master; Vera in costume Look C");

// Scenes 85–88: the raid on the Hive.
const hive = generationFrames.filter(f => ["neonoire-s85", "neonoire-s86", "neonoire-s87", "neonoire-s88"].includes(f.sceneId));
assert.deepEqual(hive.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${121 + i}`));
assert.deepEqual(new Set(hive.map(f => f.image)), new Set(hiveImages));
for (const frame of hive) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, expectedDraftStatus(frame));
  for (const detail of ["keys/06-the-block.jpg", "s1/12-masked-man-radio.jpg", "never shows a face under a mask", "WARDROBE LOOK C"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 85–88 continuity: ${detail}`);
}
const counter = hive.filter(f => f.sceneId === "neonoire-s86");
assert(counter.every(f => f.characters.includes(castOf("Kaneko"))), "Kaneko is in every counter shot");
assert(counter.filter(f => f.characters.includes(castOf("Vera Voss"))).length === 2, "Vera is at the counter in Look C");
assert(hive.filter(f => f.sceneId === "neonoire-s85" || f.sceneId === "neonoire-s88").every(f => f.characters.length === 1 && f.characters[0] === castOf("The Masked Men")), "The passages hold only the masked men");
assert.equal(hive.find(f => f.id === "neonoire-shot-121").lens, hive.find(f => f.id === "neonoire-shot-128").lens, "Scene 88 returns to the scene 85 camera");
assert(hive.find(f => f.id === "neonoire-shot-128").notes.includes("every bulb out"), "Shot 128's light caveat travels with it");
pass("scenes 85–88 boarded: nine 16:9 shots, the raid on the Hive, Kaneko and the radio repairman carded, scene 88 on scene 85's camera");

// Scenes 89–92: the escape.
const escape = generationFrames.filter(f => ["neonoire-s89", "neonoire-s90", "neonoire-s91", "neonoire-s92"].includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(escape.filter(f => shotNo(f) <= 138).map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${130 + i}`));
assert.deepEqual(new Set(escape.map(f => f.image)), new Set(escapeImages));
for (const frame of escape) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: only the frames whose scene the script rewrote await retakes`);
  assert.equal(frame.notes.includes("RETAKE PENDING"), rewritePending.has(frame.id));
  for (const detail of ["WARDROBE LOOK C", "sheets/vera-look-c.jpg", "white American", "s91/132-the-rails-sing.jpg"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 89–92 continuity: ${detail}`);
  assert(frame.characters.every(id => [castOf("Jack"), castOf("Vera Voss")].includes(id)), `${frame.title}: only Jack and Vera are in frame`);
}
assert.deepEqual(escape.find(f => f.id === "neonoire-shot-136").characters, [], "The ladder is empty when the last carriage passes");
assert.equal(escape.find(f => f.id === "neonoire-shot-134").lens, escape.find(f => f.id === "neonoire-shot-136").lens, "Scene 91 closes on its opening camera");
pass("scenes 89–92: nine 16:9 shots — stairwell, through the rooms (132, 133, 267) and the fire ladder (134–136) rewritten and retaken 29 September 2026, then the street; Vera in Look C throughout");

// Scenes 93–96: Ishida's last night.
const ishidaEnd = generationFrames.filter(f => ["neonoire-s93", "neonoire-s94", "neonoire-s95", "neonoire-s96"].includes(f.sceneId));
assert.deepEqual(ishidaEnd.filter(f => shotNo(f) <= 147).map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${139 + i}`));
assert.deepEqual(new Set(ishidaEnd.filter(f => f.image).map(f => f.image)), new Set(ishidaEndImages.filter(p => existsSync(join(root, "public", p)))));
for (const frame of ishidaEnd) {
  if (frame.image) {
    assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
    assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: only the revision retakes await review`);
  }
  assert.equal(frame.movement, "Static");
  for (const detail of ["sheets/ishida.jpg", "NO TIE", "SINGLE round black-rim", "s1/13-taillights-gone.jpg"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 93–96 continuity: ${detail}`);
}
const s94 = ishidaEnd.filter(f => f.sceneId === "neonoire-s94");
assert.deepEqual(s94.map(f => f.id), ["neonoire-shot-141", "neonoire-shot-142", "neonoire-shot-143"], "The rewritten 94 is its kerb, its detective and its cup of tea — three frames, all RETAKE PENDING");
assert.deepEqual(s94.map(f => f.characters.join()),
  ["", castOf("Detective Ishida"), `${castOf("Detective Ishida")},${castOf("Kurose")}`],
  "Scene 94 after the revision: the sedan at the kerb with nobody in frame, Ishida alone in the rain, then one clean hand and the watch");
for (const f of s94) assert(f.notes.includes("RETAKE PENDING"), `Shot ${shotNo(f)}: the old back-seat study stands retired until the pass`);
assert(!ishidaEnd.some(f => f.sceneId === "neonoire-s96" && f.characters.includes(castOf("Detective Ishida"))), "Ishida is gone from the morning room");
assert.deepEqual(ishidaEnd.find(f => f.id === "neonoire-shot-144").characters, [], "The receding car has no visible cast");
const call303 = ishidaEnd.find(f => f.id === "neonoire-shot-303");
assert(call303 && call303.characters.join() === castOf("The Young Detective"), "Shot 303 is the young detective on the call");
assert(call303.notes.includes("He left a statement") && call303.notes.includes("Under the expressway"), "Shot 303 carries the call's beats");
pass("scenes 93–96 boarded: nine 16:9 shots and the story-pass-2 call (303) — the black car, the tea, the taillights that rhyme with shot 13, an empty drawer under a clock a minute fast, and a statement left");

// Scene 97 (the ground-breaking) is cut by the 30 September 2026 revision: its seven frames
// (148–154) and the news-crawl insert (304) retire with it, the crawl text it framed no longer
// exists in the draft, and Vera's costume Look D goes with them to the archive.
assert.equal(project.frames.filter(f => f.sceneId === "neonoire-s97").length, 0, "Scene 97 is off the board");
assert(!project.frames.some(f => f.id === "neonoire-shot-304"), "The crawl insert retires with the scene that framed it");
assert.deepEqual(jpegDimensions(veraLookDSheet), [1920, 1080], "The Look D sheet keeps its archive dimensions");
assert(project.moodboards.some(b => b.items.some(i => i.image === veraLookDSheet)), "Look D stays on the cast board as archive");
pass("scene 97 retired: the ground-breaking, the tent and the crawl come off the shot list; Vera's Look D rests on the cast board");

// Scenes 98–100: the ending; Vera's costume Looks E and F — each a different coat, not a recolour.
// Scenes 98 and 100: the ending. The ground-breaking scene 99 (158–159) is cut by the 30 September
// revision; its images stay on disk, its frames are off the bundle; scene 100 also holds the
// revision's news-on-the-shelf insert (320), audited with the other revision boards.
const ending = generationFrames.filter(f => ["neonoire-s98", "neonoire-s100"].includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(ending.map(f => f.id), ["neonoire-shot-155", "neonoire-shot-156", "neonoire-shot-157", "neonoire-shot-160", "neonoire-shot-161", "neonoire-shot-241", "neonoire-shot-260", "neonoire-shot-265"], "Three on the roof, two at the new counter, the face in the window and the two late adds");
assert.deepEqual(new Set(ending.map(f => f.image)), new Set(endingImages.filter(p => !p.includes("/s99/"))));
const demolition = project.frames.filter(f => f.sceneId === "neonoire-s99a" && f.shotNumber < 240);
assert.deepEqual(demolition.map(f => f.id), ["neonoire-shot-158", "neonoire-shot-159"]);
assert.deepEqual(demolition.map(f => f.image), ["/images/neonoire/s99/156-cut-open.jpg", "/images/neonoire/s99/157-the-sign.jpg"]);
assert.deepEqual(project.frames.filter(f => f.sceneId === "neonoire-s99a").map(f => f.shotNumber), [158, 159, 305, 306, 307]);
assert.equal(project.frames.find(f => f.id === "neonoire-shot-305").transition, "Dissolve");
assert.deepEqual(jpegDimensions(veraLookESheet), [1920, 1080]);
for (const frame of ending) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: only the revision retakes await review`);
}
const rooftop = ending.filter(f => f.sceneId === "neonoire-s98");
for (const frame of rooftop) for (const detail of ["WARDROBE LOOK E", "sheets/vera-look-e.jpg", "CAR COAT", "white American", "RED BIRD CLIP"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 98 continuity: ${detail}`);
for (const frame of ending.filter(f => f.sceneId === "neonoire-s100")) for (const detail of ["WARDROBE LOOK F", "PEACOAT", "RED ENAMEL BIRD CLIP", "s86/121-the-shutter.jpg"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 100 continuity: ${detail}`);
assert(!ending.some(f => f.notes.includes("WARDROBE LOOK D")), "Look D ended with the cut scene 97");
assert(project.moodboards.some(b => b.items.some(i => i.image === veraLookESheet)), "Look E travels with the cast board");
pass("the ending, revised: seven 16:9 shots — the first dry sky, the red bird clip, and a second bowl with the news at sound down above it; Vera in Looks E and F; the cut-open Hive restored at the opening of 99A");

// Scenes 8–12: Kanda revisited — boarded after the ending, so numbered 162–170; Vera in her original look.
const kanda = generationFrames.filter(f => ["neonoire-s8", "neonoire-s9", "neonoire-s10", "neonoire-s11", "neonoire-s12"].includes(f.sceneId));
assert.deepEqual(kanda.filter(f => shotNo(f) <= 170).map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${162 + i}`));
assert.deepEqual(new Set(kanda.map(f => f.image)), new Set(kandaReturnImages));
for (const frame of kanda) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.status, expectedDraftStatus(frame));
  for (const detail of ["ORIGINAL LOOK", "sheets/vera.jpg", "white American", "s4/35-the-photograph.jpg"]) assert(frame.notes.includes(detail), `${frame.title} is missing scenes 8–12 continuity: ${detail}`);
  assert(!/WARDROBE LOOK [C-F]/.test(frame.notes), `${frame.title}: no later costume look before scene 83`);
}
assert(kanda.filter(f => f.sceneId === "neonoire-s8" || f.sceneId === "neonoire-s9").every(f => f.characters.includes(castOf("Okada"))), "Okada is in every shot of scenes 8–9");
assert(kanda.find(f => f.id === "neonoire-shot-169").characters.includes(castOf("Daniel Voss")), "The photograph of two men shows Daniel Voss");
pass("scenes 8–12 boarded: nine 16:9 shots — the bar by day, the clip returned, Jack's office, two men laughing, and the strap");

// The roadside inn: the stairway motif and the colour change (warm refuge → the cold at scene 38).
const inn = generationFrames.filter(f => ["s31", "s32", "s34", "s38", "s39", "s40", "s41", "s45"].map(k => `neonoire-${k}`).includes(f.sceneId));
assert.deepEqual(inn.filter(f => shotNo(f) <= 180).map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${171 + i}`));
assert.deepEqual(new Set(inn.map(f => f.image)), new Set(innImages));
for (const frame of inn) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  for (const detail of ["keys/09-the-roadside-inn.jpg", "STAIRWAY MOTIF", "white American"]) assert(frame.notes.includes(detail), `${frame.title} is missing inn continuity: ${detail}`);
  const warm = ["neonoire-s31", "neonoire-s32", "neonoire-s34"].includes(frame.sceneId);
  assert(frame.notes.includes(warm ? "THE WARM REFUGE" : "THE COLD, from scene 38"), `${frame.title} carries the wrong half of the colour change`);
  assert.equal(frame.lighting, warm ? "Practical night" : "Low key");
}
assert.deepEqual(innStairFrames.map(image => inn.find(f => f.image === image).id), ["neonoire-shot-173", "neonoire-shot-179"], "The stair frame is shot twice: warm going up, cold with danger coming up");
pass("the roadside inn boarded: ten 16:9 shots — the warm refuge, the stair frame, four sedans, and the same stairs gone cold");

// Scenes 13–17: the Hive, first seen; the stairway motif going up (shot 187).
const hiveFirst = generationFrames.filter(f => ["s14", "s15", "s16", "s17"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(hiveFirst.filter(f => shotNo(f) <= 190).map(f => f.id), Array.from({ length: 7 }, (_, i) => `neonoire-shot-${184 + i}`), "Scene 13's 181-183 retire with the cut scene");
assert.deepEqual(new Set(hiveFirst.map(f => f.image)), new Set(hiveFirstImages.filter(q => !q.includes("/s13/"))), "The Hive-first board carries every delivered image except scene 13's retired three");
for (const frame of hiveFirst) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  for (const detail of ["s84/115-the-storeroom.jpg", "NO bird clip", "white American", "ORIGINAL LOOK", "STAIRWAY MOTIF"]) assert(frame.notes.includes(detail), `${frame.title} is missing scenes 14–17 continuity: ${detail}`);
}
pass("scenes 14–17 boarded (13 cut): seven 16:9 shots — the sketchbook, the Hive low and patched between towers, the stair up, and Kaneko’s long look");

// Scenes 18–23: the call after the last train, the standoff, the stair up to the lie.
const callNight = generationFrames.filter(f => ["s18", "s19", "s20", "s21", "s22", "s23"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(callNight.filter(f => shotNo(f) <= 200).map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${191 + i}`), "191–200 holds; 201 retired with the cut scene 24");
for (const frame of callNight) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(callNight.find(f => f.id === "neonoire-shot-195").notes.includes("STAIRWAY MOTIF"), "Shot 195 carries the stairway motif");
assert(callNight.find(f => f.id === "neonoire-shot-194").notes.includes("s1/03-mara-walks.jpg"), "Shot 194 locks the red bird clip to its prop");
assert(callNight.filter(f => ["neonoire-shot-195", "neonoire-shot-197", "neonoire-shot-198"].includes(f.id)).every(f => f.characters.includes(castOf("Vera Voss"))), "Vera is in every shot she plays in scenes 21–22");
pass("scenes 18–23 boarded: ten 16:9 shots — the call, the standoff, the clip, the stair up, the arch counter and the lanterns swaying");

// Scene 21 office window: two image-only retakes against the established blinds/railway geography.
for (const shot of [196, 271]) {
  const frame = project.frames.find(f => f.id === `neonoire-shot-${shot}`);
  assert.equal(frame.sceneId, "neonoire-s21", `shot ${shot} stays in scene 21`);
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `shot ${shot} remains full-bleed 16:9`);
  for (const detail of ["Image-only retake 29 September 2026", "venetian blinds", "elevated", "convenience store"]) {
    assert(frame.notes.includes(detail), `shot ${shot} records the window retake: ${detail}`);
  }
}
assert(project.frames.find(f => f.id === "neonoire-shot-196").notes.includes("hands still read older than 48"), "shot 196 keeps its hand-double caveat");
assert(project.frames.find(f => f.id === "neonoire-shot-271").notes.includes("two coffees"), "shot 271 keeps both coffee cups");
assert.deepEqual(jpegDimensions("/images/neonoire/reviews/scene-21-office-window-retakes.jpg"), [1952, 1166], "scene 21 before/after review sheet exists");
pass("scene 21: two in-place window retakes use the office blinds and elevated train, with no shot renumbering");

// Scenes 24–28: the chairman's model, the key's number, the loop, the crossing, the sea-wall steps.
const coast = generationFrames.filter(f => ["s25", "s26", "s27", "s28"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(coast.filter(f => shotNo(f) <= 205).map(f => f.id), Array.from({ length: 4 }, (_, i) => `neonoire-shot-${202 + i}`), "202–205: the chairman's night (24, 200–201) is cut; its model beat moved to the wordless dawn 51");
for (const frame of coast) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(coast.find(f => f.id === "neonoire-shot-205").notes.includes("STAIRWAY MOTIF"), "Shot 205 carries the stairway motif, descending");
pass("scenes 25–28 boarded (24 cut): four 16:9 shots — the number, the loop, the crossing and the sea-wall steps");

// Scenes 29–44: the inn's missing nights — the widow, the beacon, and the cold coming in.
const innNights = generationFrames.filter(f => ["s29", "s30", "s33", "s35", "s36", "s37", "s42", "s43", "s44"].map(k => `neonoire-${k}`).includes(f.sceneId));
assert.deepEqual(innNights.filter(f => shotNo(f) <= 214).map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${206 + i}`));
for (const frame of innNights) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(innNights.find(f => f.id === "neonoire-shot-212").notes.includes("steel blue"), "Shot 212 carries the cold");
assert(innNights.find(f => f.id === "neonoire-shot-209").notes.includes("stair"), "Shot 209 keeps the inn stair in frame");
pass("scenes 29–44 boarded: nine 16:9 shots — the widow, the beacon, the swollen window, the pink phone, the dark apartment, the eave, and the cold coming in");

// The escape's turn: scenes 46–55 bar 47, whose yard master boards next turn as shot 224.
const turn = generationFrames.filter(f => ["s46", "s48", "s49", "s50", "s51", "s52", "s53", "s54", "s55"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(turn.filter(f => shotNo(f) <= 223).map(f => f.id), [215, 216, 217, 218, 220, 221, 222, 223].map(n => `neonoire-shot-${n}`), "219 retires with the wordless rewrite of scene 51");
for (const frame of turn) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(turn.find(f => f.id === "neonoire-shot-218").notes.includes("drained dawn"), "Shot 218 carries the drained dawn of standing rule 2");
assert(turn.find(f => f.id === "neonoire-shot-223").notes.includes("金子"), "Shot 223 locks the counter's kanji sign");
pass("scenes 46–55 boarded: eight 16:9 shots — the pantry door, the cab, the eight, the drained dawn, the two men, the doorway, the pink water and the match (the hat-in-hand beat is cut; its model dawn is 310–311)");

// The key's answer: scene 47's yard and scenes 56–64, the sisters' curtain and the Ueno box.
const answer = generationFrames.filter(f => ["s47", "s56", "s57", "s58", "s59", "s60", "s61", "s62", "s63", "s64"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(answer.filter(f => shotNo(f) <= 233).map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${224 + i}`));
for (const frame of answer) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(answer.find(f => f.id === "neonoire-shot-224").notes.includes("no weapons in frame"), "Shot 224 keeps the moderation-safe composition");
assert(answer.find(f => f.id === "neonoire-shot-232").notes.includes("MONTHLY. YEARLY. NO QUESTIONS."), "Shot 232 locks the locker-room sign");
pass("scene 47 and scenes 56–64 boarded: ten 16:9 shots — the yard, the third stool, the curtain gap, the overpayment, the embrace, the key, the car, the date, the lockers and the bar");

// The last rain: scenes 65–71 close the board — the dress, the wait, the trap and the waking.
const lastrain = generationFrames.filter(f => ["s65", "s66", "s67", "s68", "s69", "s70", "s71"].map(k => `neonoire-${k}`).includes(f.sceneId) && !revisionBoards(f));
assert.deepEqual(lastrain.filter(f => shotNo(f) <= 240).map(f => f.id), Array.from({ length: 7 }, (_, i) => `neonoire-shot-${234 + i}`));
for (const frame of lastrain) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(lastrain.find(f => f.id === "neonoire-shot-234").notes.includes("s72/69"), "Shot 234 locks the wine-red dress to the scene 72 wardrobe master");
assert(lastrain.find(f => f.id === "neonoire-shot-235").notes.includes("production-review check"), "Shot 235 carries the lounge clock as a production-review check");
assert(lastrain.find(f => f.id === "neonoire-shot-235").notes.includes("ash-blonde"), "Shot 235 locks Vera's ash-blonde hair to her sheets");
for (const [sceneFile, needle, shotId] of [["n02-small-bar", "IMAGE: 20-the-journalist.jpg", "shot 20"], ["n18-office-after-the-last-train", "IMAGE: 189-after-the-last-train.jpg", "shot 191"], ["n29-mrs-sakai-house-day", "IMAGE: 204-the-tea-she-does-not-want-to-pour.jpg", "shot 206"], ["n45-roadside-inn-lobby-dark", "IMAGE: 178-thank-you-very-much.jpg", "shot 180"], ["n75-still-frames", "IMAGE: 81-static-in-a-window.jpg", "shot 83"], ["n77-jacks-office", "IMAGE: 85-the-desk-lamp.jpg", "shot 87"]]) {
  const board = readFileSync(new URL(`../docs/neonoire/scenes/${sceneFile}.md`, import.meta.url), "utf8");
  const block = board.split(/(?=^\d+\. )/m).find(b => b.includes(needle)) ?? "";
  assert(block.includes("never static"), `${shotId} board note carries the TVs-never-static rule`);
}
assert(lastrain.find(f => f.id === "neonoire-shot-236").notes.includes("8:52"), "Shot 236 locks the service-road sign");
assert(lastrain.find(f => f.id === "neonoire-shot-239").notes.includes("no weapons"), "Shot 239 keeps the ambush moderation-safe");
assert(lastrain.find(f => f.id === "neonoire-shot-240").notes.includes("no blood"), "Shot 240 keeps Mara's death a scene of care");
pass("scenes 65–71 boarded: seven 16:9 shots — the dress, the wait at ten, the different clock, rice balls for the car, the passages, the trap and the waking; every numbered scene of the screenplay is now boarded");

// Coverage pass: shots 241–250, appended without renumbering 1–240. The beats the first boarding named and left.
const coverage = generationFrames.filter(f => shotNo(f) >= 241);
// 241–320 with the 30 September retirements left as gaps: 274 and 280–282 (scene 51's bow, the
// scene 1 letter coverage) and 304 (the crawl, cut with scene 97). Nothing is renumbered.
assert.deepEqual(coverage.map(f => shotNo(f)),
  [241, 242, 243, 244, 245, 246, 247, 248, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260,
   261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 273, 275, 276, 277, 278, 279, 283, 284,
   285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303,
   305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320],
  "Coverage runs 241–320 minus the retired gaps: 249 fell with scene 13, 272 and 274 with scene 51's rewrite, 280–282 with scene 1's restructure, 304 with scene 97");
for (const frame of coverage) if (frame.image) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(coverage.find(f => f.id === "neonoire-shot-241").notes.includes("small reflection in the upper corner"), "Shot 241's retake shrinks the face");
assert(!coverage.find(f => f.id === "neonoire-shot-241").notes.includes("larger than a glancing reflection"), "Shot 241 no longer carries the large-reflection caveat");
assert(coverage.find(f => f.id === "neonoire-shot-242").notes.includes("down the bar"), "Shot 242's retake looks down the bar");
assert(coverage.find(f => f.id === "neonoire-shot-243").notes.includes("JACK. INVESTIGATIONS."), "Shot 243 locks the business card");
assert(coverage.find(f => f.id === "neonoire-shot-243").notes.includes("out of the raised hand"), "Shot 243's retake lowers the umbrella");
assert(coverage.find(f => f.id === "neonoire-shot-244").notes.includes("STAIRWAY MOTIF"), "Shot 244 carries the scene 10 stair exit");
assert(coverage.find(f => f.id === "neonoire-shot-245").notes.includes("never static"), "Shot 245 keeps the office television a programme");
assert(coverage.find(f => f.id === "neonoire-shot-245").notes.includes("from inside the open cupboard"), "Shot 245's box comes out of the cupboard, not off thin air");
assert(coverage.find(f => f.id === "neonoire-shot-245").notes.includes("no chair in the business"), "Shot 245 is on one knee; the chair caveat is retired");
assert(!/top of the filing cabinet/.test(coverage.find(f => f.id === "neonoire-shot-245").notes), "Shot 245 no longer lifts a box off the cabinet top");
assert(coverage.find(f => f.id === "neonoire-shot-251").notes.includes("room master"), "Shot 251 follows the room master, not the frame before it");
assert(coverage.find(f => f.id === "neonoire-shot-246").notes.includes("DANIEL VOSS, 41"), "Shot 246 locks the clipping caption");
// The missed-calls screen (249) was scene 13's cover shot; the phone now rings once in scene 1 and
// she declines it — the frame retires with the scene, its image staying on disk for review.
assert(!coverage.some(f => f.id === "neonoire-shot-249"), "Shot 249 retires with scene 13");
assert(coverage.find(f => f.id === "neonoire-shot-250").notes.includes("金子"), "Shot 250 locks the counter sign");
assert(coverage.find(f => f.id === "neonoire-shot-250").notes.includes("Six stools"), "Shot 250's retake dresses the sixth stool");
assert(coverage.find(f => f.id === "neonoire-shot-251").notes.includes("never static"), "Shot 251 keeps the office television a programme");
assert(coverage.find(f => f.id === "neonoire-shot-252").notes.includes("No cigarettes"), "Shot 252 locks the lighter with no cigarettes");
assert(coverage.find(f => f.id === "neonoire-shot-253").notes.includes("dentist's chair"), "Shot 253 boards the dentist's chair");
assert(coverage.find(f => f.id === "neonoire-shot-254").notes.includes("pink"), "Shot 254 locks the inn payphone");
assert(coverage.find(f => f.id === "neonoire-shot-255").notes.includes("KATO RENTAL LOCKERS"), "Shot 255 locks the locker stamp");
assert(coverage.find(f => f.id === "neonoire-shot-255").notes.includes("No. 114"), "Shot 255 locks the locker number");
assert(coverage.find(f => f.id === "neonoire-shot-256").notes.includes("No weapons"), "Shot 256 keeps the lobby move free of weapons");
assert(coverage.find(f => f.id === "neonoire-shot-257").notes.includes("No cigarettes"), "Shot 257 locks the lighter on the train");
assert(coverage.find(f => f.id === "neonoire-shot-258").notes.includes("87"), "Shot 258 keeps the cold-open tag");
assert(coverage.find(f => f.id === "neonoire-shot-258").notes.includes("114"), "Shot 258 locks the metal stamp");
assert(coverage.find(f => f.id === "neonoire-shot-259").notes.includes("SHIOHAMA"), "Shot 259 locks the cassette");
assert(coverage.find(f => f.id === "neonoire-shot-260").notes.includes("third stool"), "Shot 260 logs the stool caveat");
assert(coverage.find(f => f.id === "neonoire-shot-261").notes.includes("paper screens"), "Shot 261 boards the torn screens");
assert(coverage.find(f => f.id === "neonoire-shot-262").notes.includes("never static"), "Shot 262 keeps the inn television a programme");
assert(coverage.find(f => f.id === "neonoire-shot-263").notes.includes("too small"), "Shot 263 holds the umbrella at a size the faces can take");
assert(coverage.find(f => f.id === "neonoire-shot-264").notes.includes("SHIOHAM"), "Shot 264 locks the cassette label as far as the thumb allows");
assert(coverage.find(f => f.id === "neonoire-shot-264").notes.includes("under the thumb"), "Shot 264 does not claim the last letter is clear");
assert(coverage.find(f => f.id === "neonoire-shot-265").notes.includes("third from the left"), "Shot 265 seats Vera on the third stool");
assert(coverage.find(f => f.id === "neonoire-shot-265").notes.includes("two empty stools to her left"), "Shot 265 keeps the empty stools to her left");
assert(coverage.find(f => f.id === "neonoire-shot-266").notes.includes("third from the left"), "Shot 266 seats Vera on the third stool at the Hive");
assert(coverage.find(f => f.id === "neonoire-shot-267").notes.includes("door after door"), "Shot 267 boards the enfilade of doorways, not the gap");
assert(coverage.find(f => f.id === "neonoire-shot-268").notes.includes("not a ryokan"), "Shot 268 keeps the corridor off the ryokan");
assert(coverage.find(f => f.id === "neonoire-shot-269").notes.includes("staff side"), "Shot 269 puts Mr. Noda on the staff side");
pass("coverage pass: shots 241–269 — named beats the first boarding left, through the third stool, the gap and the staff side");

// Final coverage pass: shots 270–279 — the beats the boards had named and left in the cut.
const finalCoverage = generationFrames.filter(f => shotNo(f) >= 270 && shotNo(f) <= 279);
// 272 (the model's tiny tree, Kurose's fingertip) and 274 (the bow held a moment too long) sat on
// scene 51's board and retire with its wordless rewrite; what replaces them are 310–311, and the
// tree's plaza becomes the finished paving of 99A and of Vera's last look at the model in 83.
assert.deepEqual(finalCoverage.map(f => f.id), [270, 271, 273, 275, 276, 277, 278, 279].map(n => `neonoire-shot-${n}`), "270–279 with 272 and 274 retired");
assert(finalCoverage.find(f => f.id === "neonoire-shot-270").notes.includes("packed and zipped"), "Shot 270 locks the packed suitcase under the futon");
assert(finalCoverage.find(f => f.id === "neonoire-shot-271").notes.includes("Not yet"), "Shot 271 boards the sketchbook lie");
assert(finalCoverage.find(f => f.id === "neonoire-shot-273").notes.includes("no legible text invented"), "Shot 273 keeps the receipt bundle unread");
assert(finalCoverage.find(f => f.id === "neonoire-shot-275").notes.includes("sheets/vera-face.jpg") && finalCoverage.find(f => f.id === "neonoire-shot-275").notes.includes("sheets/jack-face.jpg"), "Shot 275 holds the kiss to both face sheets");
assert(finalCoverage.find(f => f.id === "neonoire-shot-276").notes.includes("mara-hiding"), "Shot 276 holds Mara to her hiding sheet");
assert(finalCoverage.find(f => f.id === "neonoire-shot-277").notes.includes("vera-look-b") && finalCoverage.find(f => f.id === "neonoire-shot-277").notes.includes("bone dry"), "Shot 277 locks Look B and the dry borrowed umbrella");
assert(finalCoverage.find(f => f.id === "neonoire-shot-278").notes.includes("9:58") && finalCoverage.find(f => f.id === "neonoire-shot-278").notes.includes("10:00"), "Shot 278 locks the lounge clock from 9:58 to 10:00");
assert(finalCoverage.find(f => f.id === "neonoire-shot-279").notes.includes("mara-hiding"), "Shot 279 holds Mara's smile to her hiding sheet");
pass("final coverage: shots 270–279 — the packed suitcase, the lie, the receipts (re-pinned), the kiss, the wall, the umbrella, the clock at ten and her sister’s smile; the tree and the bow retired with scene 51");

// Letter rewrite coverage, 28 September 2026 — shots 283–286: the letter under the lamp, the
// coward line in the storeroom, the hand over the inside pocket, and the sheet returned at dawn.
const letterRewrite = generationFrames.filter(f => shotNo(f) >= 283 && shotNo(f) <= 286);
assert.deepEqual(letterRewrite.map(f => f.id), Array.from({ length: 4 }, (_, i) => `neonoire-shot-${283 + i}`), "The letter rewrite runs 283–286; 280–282 retired with the scene 1 cuts");
for (const frame of letterRewrite) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} is 16:9 full-bleed`);
  // 283–286 remain draft studies; their scene-1 siblings 280–282 were retired by the revision.
  assert.equal(frame.status, shotNo(frame) <= 282 ? "Ready" : "Draft", `${frame.title}: cold-open coverage is director-approved Ready, the rest stay Draft`);
}
const desk = letterRewrite.find(f => f.id === "neonoire-shot-283");
assert(desk.notes.includes("props/sakai-letter.jpg") && desk.notes.includes("T. SAKAI") && desk.notes.includes("VERA VOSS"), "Shot 283 locks the letter and its envelope to the prop master");
const storeroom = letterRewrite.find(f => f.id === "neonoire-shot-284");
assert(storeroom.notes.includes("sheets/mara-hiding.jpg") && storeroom.notes.includes("NO clip"), "Shot 284 keeps Mara's hiding look with the clip gone to Jack");
const pocket = letterRewrite.find(f => f.id === "neonoire-shot-285");
assert(pocket.notes.includes("s22/195-somewhere-like-this.jpg") && pocket.notes.includes("hand over the pocket"), "Shot 285 holds Jack's hand over the inside pocket");
const returned = letterRewrite.find(f => f.id === "neonoire-shot-286");
assert(returned.notes.includes("props/sakai-letter.jpg") && returned.notes.includes("two-hands, two-cups"), "Shot 286 returns the same sheet beside the two cups");
assert(returned.characters.join() === castOf("Vera Voss"), "Shot 286 is Vera's insert");
pass("letter rewrite coverage, surviving half: 283–286 — the letter under the lamp, the coward line, the pocket and the smoothed-flat sheet");

// Scenes 25A, 27A, 63A — first boarding, shots 287–296.
const insertedBoards = generationFrames.filter(f => ["s25a", "s27a", "s63a"].map(k => `neonoire-${k}`).includes(f.sceneId));
assert.deepEqual(insertedBoards.map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${287 + i}`));
for (const frame of insertedBoards) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
assert(insertedBoards.find(f => f.id === "neonoire-shot-287").notes.includes("never static"), "Shot 287 keeps the breakfast CRT a cooking show");
assert(insertedBoards.find(f => f.id === "neonoire-shot-288").notes.includes("Make her eat breakfast"), "Shot 288 pays off Mara's breakfast line");
assert(insertedBoards.find(f => f.id === "neonoire-shot-290").notes.includes("s8/160"), "Shot 290 holds Okada's bar to scene 8");
assert(insertedBoards.find(f => f.id === "neonoire-shot-292").notes.includes("s2/24-from-the-floor.jpg"), "Shot 292 rhymes with Mara's floor");
assert(insertedBoards.find(f => f.id === "neonoire-shot-293").notes.includes("lights off"), "Shot 293 locks the sedan waiting dark");
assert(insertedBoards.find(f => f.id === "neonoire-shot-295").notes.includes("no masks") && insertedBoards.find(f => f.id === "neonoire-shot-295").notes.includes("no weapons"), "Shot 295 keeps the public tail unmasked and unarmed");
assert(insertedBoards.find(f => f.id === "neonoire-shot-296").notes.includes("SHIOHAMA"), "Shot 296 locks the cassette label");
pass("scenes 25A, 27A and 63A boarded: ten 16:9 shots — breakfast, the almost-slip, Okada's bar, the floor where Mara hid, the sedan, the parlour, the alley and the tape");

// Story pass 2 boards, 29 September 2026 — shots 297–307: Vera at the Toto Shimbun (53A), the
// notebook photocopied (82A), the call and the crawl (96, 97), and the finished plaza (99A).
const storyPass2 = generationFrames.filter(f => shotNo(f) >= 297 && shotNo(f) <= 307);
// 304 retired with scene 97 on 30 September; the run keeps every other number.
assert.deepEqual(storyPass2.map(f => f.id), [297, 298, 299, 300, 301, 302, 303, 305, 306, 307].map(n => `neonoire-shot-${n}`), "Story pass 2 runs 297–307 with only the scene 97 crawl retired");
assert.deepEqual(storyPass2.filter(f => f.sceneId === "neonoire-s53a").map(f => f.id), ["neonoire-shot-297", "neonoire-shot-298", "neonoire-shot-299"], "53A carries three shots");
assert.deepEqual(storyPass2.filter(f => f.sceneId === "neonoire-s82a").map(f => f.id), ["neonoire-shot-300", "neonoire-shot-301", "neonoire-shot-302"], "82A carries three shots");
assert.deepEqual(storyPass2.filter(f => f.sceneId === "neonoire-s99a").map(f => f.id), ["neonoire-shot-305", "neonoire-shot-306", "neonoire-shot-307"], "99A carries three shots");
assert(storyPass2.find(f => f.id === "neonoire-shot-297").notes.includes("s82/104-the-newsroom.jpg"), "Shot 297 holds the newsroom to the scene 82 master");
assert(storyPass2.find(f => f.id === "neonoire-shot-297").notes.includes("never static"), "Shot 297 keeps the three channels a programme");
assert(storyPass2.find(f => f.id === "neonoire-shot-298").notes.includes("There was no car"), "Shot 298 carries the line the scene exists for");
assert(storyPass2.find(f => f.id === "neonoire-shot-299").notes.includes("KONDO"), "Shot 299 locks the card");
assert(storyPass2.find(f => f.id === "neonoire-shot-301").notes.includes("flashing white"), "Shot 301 boards the copier's bar of light");
assert(storyPass2.find(f => f.id === "neonoire-shot-302").notes.includes("Kurose Development"), "Shot 302 carries the hook");
assert(storyPass2.find(f => f.id === "neonoire-shot-305").notes.includes("the plaza as it is built"), "Shot 305 builds the plaza — to the revised words");
assert(storyPass2.find(f => f.id === "neonoire-shot-306").notes.includes("the hoarding is out of the film"), "Shot 306 retires the hoarding it once locked");
assert(storyPass2.find(f => f.id === "neonoire-shot-307").notes.includes("nothing answers"), "Shot 307 carries the film's last train, and the plaza's silence under it");
// The remaining twenty (story pass 2's left-over studies and the revision's 308–320) are generated
// in batches under one rule; scripts/neonoire/remaining-boards.mjs is the ledger of what is
// installed, and this block keeps the bundle honest against it: a delivered frame is on disk at
// 16:9 and carries the pass's provenance, a delivered-nowhere frame keeps its placeholder.
assert.deepEqual(placeholders.filter(f => shotNo(f) <= 307).map(f => shotNo(f)).sort((a, b) => a - b),
  [298, 299, 300, 302, 306, 307].filter(n => !remainingBoardsCompleted.includes(n)),
  "The story-pass-2 placeholders hold exactly the ungenerated slots (303 delivered, 304 retired with scene 97)");
assert.deepEqual(placeholders.filter(f => shotNo(f) >= 308).map(f => shotNo(f)),
  Array.from({ length: 13 }, (_, i) => 308 + i).filter(n => !remainingBoardsCompleted.includes(n)),
  "Every revision board still to generate holds an honest placeholder");
const deliveredRemaining = project.frames.filter(f => remainingBoardsCompleted.includes(shotNo(f)));
assert.equal(deliveredRemaining.length, remainingBoardsCompleted.length, "Every number the ledger calls delivered is on the board");
for (const frame of deliveredRemaining) {
  assert(frame.image, `${frame.title} is installed, not a placeholder`);
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title}: 16:9 delivery`);
  assert.equal(frame.status, rewritePending.has(frame.id) ? "Needs review" : expectedDraftStatus(frame), `${frame.title}: a delivered study; only a standing RETAKE PENDING pin holds one back`);
  assert(frame.notes.includes("remaining-boards pass") || (directorApprovedMainIds.has(frame.id) && frame.notes.includes("DIRECTOR APPROVED")), `${frame.title} names the pass it came from`);
}
pass(`remaining boards: ${remainingBoardsCompleted.filter(n => n !== 305).length}/20 missing slots delivered plus the 305 plaza retake; ${placeholders.length} placeholders remain`);
// 305–307 were delivered together from the re-pinned scene 99A text and released from the pin.
for (const f of storyPass2.filter(x => [305, 306, 307].includes(shotNo(x)))) {
  assert(f.image && remainingBoardsCompleted.includes(shotNo(f)), `99A frame ${shotNo(f)}: the plaza is delivered from the re-pinned text`);
  assert(!rewritePending.has(f.id), `99A frame ${shotNo(f)}: the plaza's retake pin is released`);
}
pass("story pass 2 boards: all surviving 297–307 images delivered; the crawl retired with scene 97");


// Consistency retake pass, 26 September 2026: the third stool at both counters, Mr. Noda behind the counter, Jack's hands at 48, one hand-painted sign.
const stool160 = project.frames.find(f => f.id === "neonoire-shot-160");
assert(stool160.notes.includes("two empty stools to her left"), "Shot 160 seats Vera on the third stool");
assert(stool160.notes.includes("金子"), "Shot 160 carries the hand-painted sign");
const stool161 = project.frames.find(f => f.id === "neonoire-shot-161");
assert(stool161.notes.includes("generated from the retaken shot 160"), "Shot 161 derives from the retaken master");
const stool260 = project.frames.find(f => f.id === "neonoire-shot-260");
assert(stool260.notes.includes("two empty stools to her left"), "Shot 260 keeps the empty stools to her left");
assert(!stool260.notes.includes("CAVEAT"), "Shot 260's stool caveat is closed");
const stool225 = project.frames.find(f => f.id === "neonoire-shot-225");
assert(stool225.notes.includes("two empty stools to her left"), "Shot 225 seats Vera on the third stool at the Hive");
assert(stool225.notes.includes("金子"), "Shot 225 carries the hand-painted sign");
const sign265 = project.frames.find(f => f.id === "neonoire-shot-265");
assert(sign265.notes.includes("金子"), "Shot 265 hangs the old hand-painted sign, not a paper menu");
const noda262 = project.frames.find(f => f.id === "neonoire-shot-262");
assert(noda262.notes.includes("BEHIND the wooden counter"), "Shot 262 puts Mr. Noda behind the counter");
assert(noda262.notes.includes("never static"), "Shot 262 keeps the inn television a programme");
const noda178 = project.frames.find(f => f.id === "neonoire-shot-178");
assert(noda178.notes.includes("no weapons in frame"), "Shot 178's reframe keeps the weapons out of frame");
const hands259 = project.frames.find(f => f.id === "neonoire-shot-259");
assert(hands259.notes.includes("48"), "Shot 259 keeps Jack's hands at 48");
assert(hands259.notes.includes("SHIOHAMA"), "Shot 259 keeps the cassette label");
pass("consistency retakes: the third stool at both counters and in the clip, Mr. Noda behind the counter, Jack's hands at 48, one hand-painted sign");

// Consistency retake pass two, 26 September 2026: one pole on the cold-open street, the strap untouched, the 1975 wood corridor, the katakana card, three customers, a waist-high rail.
const wood261 = project.frames.find(f => f.id === "neonoire-shot-261");
assert(wood261.notes.includes("not a ryokan"), "Shot 261 keeps the corridor on the lobby's 1975 wood");
const pole170 = project.frames.find(f => f.id === "neonoire-shot-170");
assert(pole170.notes.includes("one barber pole") && pole170.notes.includes("does not touch"), "Shot 170 keeps one pole and the strap untouched");
const pole248 = project.frames.find(f => f.id === "neonoire-shot-248");
assert(pole248.notes.includes("one barber pole"), "Shot 248 keeps one pole in the deep background too");
const card243 = project.frames.find(f => f.id === "neonoire-shot-243");
assert(card243.notes.includes("katakana"), "Shot 243 carries the katakana line the draft prints");
const lunch225 = project.frames.find(f => f.id === "neonoire-shot-225");
assert(lunch225.notes.includes("three customers"), "Shot 225 carries the draft's three customers");
pass("consistency retakes two: one pole on the cold-open street, the strap untouched, the 1975 wood corridor, the katakana card, three customers (the walkway rail check went with the walkway, cut 29 September 2026)");

// Cast-sheet pass, 26 September 2026: the recurring cast and the film's last costume carry identity sheets.
for (const sheet of ["kaneko", "okada", "kurose", "mr-noda", "mrs-noda", "repairman", "harada", "young-detective", "vera-look-f", "vera-look-b", "mara-hiding", "masked-man"]) {
  assert.deepEqual(jpegDimensions(`/images/neonoire/sheets/${sheet}.jpg`), [1920, 1080], `${sheet}'s identity sheet is 16:9`);
}
pass("cast sheets: Kaneko, Okada, Kurose, the Nodas, the repairman, Harada, the young detective, the masked man and Vera's Looks B and F carry identity sheets");

// Okada's bar has one set sheet across night, daylight and the later night return.
assert.deepEqual(jpegDimensions(kandaBarSheet), [1920, 1080], "the Kanda bar location sheet is 16:9");
assert.deepEqual([...kandaBarScenes].sort(), ["s2", "s27a", "s64", "s8", "s81"], "only Okada's bar scenes use the sheet (not the hotel lounge)");
assert(kandaBarLook.includes("CRT switched OFF") && kandaBarLook.includes("scene 2 variety show") && kandaBarLook.includes("sheets/okada.jpg"), "the bar lock records the day/night states and Okada's identity");
for (const sceneKey of kandaBarScenes) {
  const frames = project.frames.filter(frame => frame.sceneId === `neonoire-${sceneKey}`);
  assert(frames.length > 0 && frames.every(frame => frame.notes.includes("sheets/kanda-bar.jpg")), `scene ${sceneKey} carries the bar's shared location lock`);
}
const barBoard = project.moodboards.find(board => board.id === "neonoire-look-kanda-bar");
assert(barBoard?.items.some(item => item.image === kandaBarSheet), "the bar sheet is visible in Mood boards");
assert(!project.frames.filter(frame => ["neonoire-s66", "neonoire-s72", "neonoire-s75"].includes(frame.sceneId)).some(frame => frame.notes.includes("sheets/kanda-bar.jpg")), "the hotel lounge does not borrow Okada's bar sheet");
pass("Kanda bar: the 16:9 night/day sheet and location rules travel with all five bar scenes, not the hotel");

// Script-pass image retakes are in-place; scene 17 was reverted and is out of this pass.
for (const [shot, phrase] of [[229, "new taped counter drawing"], [237, "NO red-bird clip"], [88, "folded letter"], [96, "shift change"], [97, "script-pass follow-up"], [100, "Retake 29 September 2026"], [101, "near desks unoccupied"], [117, "rear-wall drawing"], [118, "back of a loose-haired woman"], [119, "script-pass follow-up"]]) {
  const frame = project.frames.find(f => f.id === `neonoire-shot-${shot}`);
  assert(frame?.notes.includes(phrase), `shot ${shot} records the installed script-pass retake`);
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `script-pass retake ${shot} is 16:9`);
}
assert(!project.frames.find(f => f.id === "neonoire-shot-189")?.notes.includes("SCRIPT-PASS RETAKE"), "scene 17 is reverted, not recorded as a retake");
pass("script-pass retakes: ten in-place 16:9 frames installed; scene 17 reverted");

// The roadside inn style sheet and the mask rule (29 September 2026): the inn carries a four-panel
// style sheet, and the masked men's costume is locked to the black lower-face mask — at the inn too.
assert.deepEqual(jpegDimensions("/images/neonoire/sheets/roadside-inn.jpg"), [1920, 1080], "the roadside inn style sheet is 16:9");
assert(innWarmLook.includes("sheets/roadside-inn.jpg") && innWarmLook.includes("never white masks") && innWarmLook.includes("sheets/masked-man.jpg"), "The inn look carries the style sheet and the black lower-face mask rule");
for (const board of ["n39-roadside-inn-jacks-room.md", "n40-roadside-inn-lobby.md", "n41-roadside-inn-upstairs-corridor.md", "n45-roadside-inn-lobby-dark.md", "n47-inn-back-yard.md", "n49-eight-in-the-headlights.md"]) {
  const text = readFileSync(join(root, "docs", "neonoire", "scenes", board), "utf8");
  assert(text.includes("black lower-face mask under a dark knit cap"), `${board} records the mask retake`);
}
pass("roadside inn: the style sheet is installed and the masked men's black lower-face masks are locked at the inn");

// Looks-and-props pass, 26 September 2026: the legible-text props carry clean masters beside the cassette label and the notebook cover.
for (const prop of ["jack-investigations-card", "daniel-voss-clipping", "key-87-tag", "kaneko-sign-board", "locker-room-sign", "service-road-852", "sakai-letter"]) {
  assert.deepEqual(jpegDimensions(`/images/neonoire/props/${prop}.jpg`), [1920, 1080], `${prop}'s prop master is 16:9`);
}
pass("prop masters: the card, the clipping, the 87 tag, the sign board, the locker sign, the 8:52 sign and Sakai's letter carry clean legible masters");

// Hive canon, 28 September 2026: one look file (scripts/neonoire/hive-canon-look.mjs), six canon
// sheets (night exterior, day exterior, section, counter, storeroom, passages-and-roof). The
// 29 September 2026 retake pass runs in the director's tiers: the seven exteriors that were wrong
// building AND wrong look are retaken against the canon sheets (hiveRetakenExteriors); the three
// interior set failures and the twenty-four look-only frames still queue — twenty-seven in all,
// nothing outside the Hive.
const { hiveCanonSheets, hiveRetakenExteriors, hiveRetakenLook, hiveRetakenOptional, hiveRetakenQueue, hiveCanonRetakes, hiveLookRetakes, hiveNextPassPlan, hiveCanon, hiveCanonNight, hiveCanonDay, hiveCanonNegative, hiveCanonRules, hiveCanonScenes } = await import("./neonoire/hive-canon-look.mjs");
assert.equal(hiveCanonSheets.length, 6, "Six canon sheets: night exterior, day exterior, section, counter, storeroom, passages-and-roof");
for (const sheet of hiveCanonSheets) assert.deepEqual(jpegDimensions(sheet.path), [1920, 1080], `${sheet.key}'s canon sheet is 16:9`);
for (const retake of hiveRetakenExteriors) assert.deepEqual(jpegDimensions(`images/neonoire/${retake.image}`), [1920, 1080], `${retake.image} is installed at 16:9 after the exterior retake`);
assert.equal(hiveRetakenExteriors.length, 7, "Seven exteriors — wrong building and wrong look — retaken on the canon and the new look");
for (const retake of hiveRetakenLook) assert.deepEqual(jpegDimensions(`images/neonoire/${retake.image}`), [1920, 1080], `${retake.image} is installed at 16:9 after the look retake`);
assert.equal(hiveRetakenLook.length, 13, "Thirteen frames ran in the 29 September 2026 look retake pass (new look plus model fixes), all installed");
for (const retake of hiveRetakenOptional) assert.deepEqual(jpegDimensions(`images/neonoire/${retake.image}`), [1920, 1080], `${retake.image} is installed at 16:9 after the optional retake`);
assert.equal(hiveRetakenOptional.length, 5, "Five optional frames judged and retaken (service road steam, rooftop city)");
assert.equal(hiveCanonRetakes.length, 0, "The interior set failures are absorbed into the look retake pass");
for (const retake of hiveRetakenQueue) assert.deepEqual(jpegDimensions(`images/neonoire/${retake.image}`), [1920, 1080], `${retake.image} is installed at 16:9 after the queue pass`);
assert.equal(hiveRetakenQueue.length, 11, "All eleven queue frames retaken on the look (29 September 2026 queue pass)");
for (const retake of hiveLookRetakes) assert(existsSync(join(root, "public", "images", "neonoire", retake.image)), `${retake.image} exists and queues for the look retake pass`);
assert.equal(hiveLookRetakes.length, 0, "The look retake queue is closed");
assert.equal(hiveNextPassPlan.length, 0, "The next pass plan is empty — every Hive frame is on the look");
assert.equal(new Set(hiveNextPassPlan.map(r => r.image)).size, 0, "No frame queues twice");
assert.equal(new Set([...hiveNextPassPlan, ...hiveRetakenExteriors, ...hiveRetakenLook, ...hiveRetakenOptional, ...hiveRetakenQueue].map(r => r.image)).size, 36, "Every Hive retake frame is queued exactly once, done or pending");
assert(hiveNextPassPlan.every(r => r.look === "day" || r.look === "night"), "Every queued frame declares day or night");
assert(hiveCanon.includes("retrofitted for sixty years") && hiveCanon.includes("Steam vents from pipes and kitchen flues"), "The canon carries the sixty-year retrofit and the steam vents");
assert(hiveCanonNight.includes("small pools") && hiveCanonNight.includes("35mm anamorphic film look"), "The night look is small pools and film, not saturated neon");
assert(hiveCanonDay.includes("pale grey-ochre murk") && hiveCanonDay.includes("the murk begins at the Hive's edge"), "The day look is the murk, and the street outside stays ordinary");
assert(hiveCanonRules.includes("one bulb, amber tungsten, steam") && hiveCanonRules.includes("screens bigger than an old CRT") && hiveCanonRules.includes("Never write a film title in a prompt"), "The Hive rules travel with the canon");
for (const term of ["vivid colours", "many neon signs", "video billboards", "bright sunny daylight", "cyberpunk", "brand logos"]) assert(hiveCanonNegative.includes(term), `The Hive negative prompt bans ${term}`);
assert(!hiveCanonScenes.has("s3") && !hiveCanonScenes.has("s78") && !hiveCanonScenes.has("s14") && !hiveCanonScenes.has("s47"), "Vera's apartment building, Mara's apartment and the inn's back yard are not the Hive");
assert(hiveCanonScenes.has("s91"), "the rear wall by the viaduct is the Hive's own exterior");
assert(hiveCanonScenes.has("s19") && hiveCanonScenes.has("s69") && hiveCanonScenes.has("s71") && hiveCanonScenes.has("s67"), "The counter night, the passages and the service road are the Hive");
let retakeNoteCount = 0;
for (const board of ["n15-the-hive-day.md", "n59-glowing-in-the-rain.md", "n92-below-the-viaduct.md", "n16-hive-passages.md", "n69-vera-would-love-this.md", "n71-everyones-awake.md", "n85-hive-passages.md", "n55-they-match.md", "n67-a-different-clock.md", "n68-rice-balls-for-the-car.md", "n70-position.md", "n17-kaneko-counter-first.md", "n56-vera-on-the-third-stool.md", "n58-bring-her.md", "n86-kaneko-counter.md", "n87-radio-repair-shop.md"]) {
  const text = readFileSync(join(root, "docs", "neonoire", "scenes", board), "utf8");
  const hits = text.split("Retake 29 September 2026").length - 1;
  assert(hits > 0, `${board} records its exterior retake`);
  retakeNoteCount += hits;
}
// Scene 90's three optional-pass records (shots 132, 133, 267) went with the roof, rewritten 29 September 2026.
const retiredRoofRecords = 3;
// The cut scenes' records (n97: 7, n99: 2) went with their boards on 30 September 2026; the
// retaken images stay installed and counted in the canon module, but no board notes them.
const retiredCutSceneRecords = 9;
assert.equal(retakeNoteCount, 7 + hiveRetakenLook.length + hiveRetakenOptional.length + hiveRetakenQueue.length - retiredRoofRecords - retiredCutSceneRecords, "Every installed retake is recorded in its board notes");
pass("hive canon: six sheets installed; the wrong-building tier, the new-look pass, the judged optionals and the queue pass all retaken on the canon and the look, the queue closed");

pass("Tokyo Story colour revision complete: ten + eight generations, all fifteen street shots delivered, stable IDs, makeup/shoe states and static low-level cameras");

const frontCounter = generationFrames.filter(frame => frame.sceneId === "neonoire-s5");
assert.equal(frontCounter.length, 8);
for (const frame of frontCounter) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["police_station.png", "16:9", "pale-blue umbrella", "charcoal wool coat", "young-officer.jpg"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing revised continuity: ${detail}`);
  }
}
assert.deepEqual(jpegDimensions("/images/neonoire/keys/05-the-police-station.jpg"), [1920, 1080]);
pass("all eight front-counter JPEGs and the station key are 1920×1080, with the revised continuity brief");

const apartment = generationFrames.filter(frame => frame.sceneId === "neonoire-s4");
assert.equal(apartment.length, 10);
for (const frame of apartment) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["appartment.png", "photo.png", "NO paper pendant", "hanging cord", "pale-blue umbrella", "four-year-old Mara", "nine-year-old Vera", "smartphone stays face-up"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing apartment continuity: ${detail}`);
  }
}
assert.deepEqual(jpegDimensions("/images/neonoire/keys/04-veras-apartment.jpg"), [1920, 1080]);
const { frameFormat } = await import("./neonoire/front-counter-look.mjs");
assert(frameFormat({ key: "s1" }).startsWith("16:9"), "The cold open targets 16:9 even while legacy frames await revision");
assert(frameFormat({ key: "s2" }).startsWith("16:9"));
assert(frameFormat({ key: "s4" }).startsWith("16:9"));
assert(frameFormat({ key: "s5" }).startsWith("16:9"));
assert(frameFormat({ key: "s6" }).startsWith("16:9"));
assert(frameFormat({ key: "s7" }).startsWith("16:9"));
assert(frameFormat({ key: "s3" }).startsWith("16:9"), "The final screenplay puts every scene's images in 16:9");
// Scene 3 fully rebuilt 16:9 on 26 September 2026 — and shots 29 and 30 retaken 29 September 2026 so
// Vera's apartment building is an ordinary old four-storey grey concrete block beside the elevated
// railway, never the Hive.
const block3 = generationFrames.filter(frame => frame.sceneId === "neonoire-s3");
assert.equal(block3.length, 4);
for (const frame of block3) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} is rebuilt in 16:9`);
  for (const detail of ["ordinary old four-storey", "NOT the Hive", "not knowing the Hive", "s3/31-the-lit-window.jpg", "s78/88-the-walkway.jpg", "THIRD FLOOR"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing scene 3 apartment-building continuity: ${detail}`);
  }
}
for (const id of ["neonoire-shot-29", "neonoire-shot-30"]) {
  const frame = block3.find(f => f.id === id);
  assert(frame.notes.includes("Retake 29 September 2026"), `${frame.title} carries the 29 September 2026 ordinary-apartment retake note`);
}
pass("scene 3 fully rebuilt 16:9 — shots 29 and 30 retaken as Vera's ordinary old four-storey apartment building beside the elevated railway, not the Hive");
pass("all ten apartment JPEGs and their key are 1920×1080; pendant removal and prop/cast continuity are recorded");

const interview = generationFrames.filter(frame => frame.sceneId === "neonoire-s6");
assert.equal(interview.length, 12);
for (const frame of interview) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["s6/51-the-interview-room.jpg", "s6/56-three-days-ago.jpg", "window sill", "sheets/ishida.jpg", "NO TIE", "pale-blue umbrella", "PAPER cup", "intact and the table dry through shot 59", "crushed cup and wet table"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing interview continuity: ${detail}`);
  }
}
assert(project.frames.find(frame => frame.id === "neonoire-shot-51").notes.includes("fluorescent is steady"));
// 1 October 2026: the first study laid Ishida's card down inside the spilled tea. The interview brief and
// shot 62's own note both now hold the spill to a pool around the crushed cup and run the card on dry laminate.
for (const [who, text] of [["shot 62", project.frames.find(frame => frame.id === "neonoire-shot-62").notes], ["the interview brief", interviewLook]]) {
  assert(/DRY laminate/.test(text) && /never lies in/.test(text), `${who}: the card must travel on dry laminate, never in the puddle`);
}
assert(project.frames.find(frame => frame.id === "neonoire-shot-62").notes.includes("Shot 62 retaken 1 October 2026"), "shot 62 records its retake");
pass("all twelve interview JPEGs are 1920×1080; room, wardrobe, cup and spill continuity are recorded");

// ── Jack's office: the desk lock (1 October 2026) ─────────────────────────────────────────────
// The office was generated as a chain — each frame copied the picture before it — so the desk shrank
// and re-coloured five times and one study mirrored the room. Scenes 10, 11, 18, 21 and 77 now all
// carry one lock, and the wide of scene 10 is the only room master.
const officeFrames = project.frames.filter(f => officeLayoutScenes.has(f.sceneId.replace("neonoire-", "")));
assert.equal(officeFrames.length, 17, "Five scenes hold Jack's office: 4 + 5 + 2 + 3 + 3 frames");
for (const frame of officeFrames) {
  for (const detail of [officeLayoutLock, "1.60 m", "NEVER mirrored", "Never honey-blond", "exactly ONE black rotary telephone", officeRoomMaster]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing the Jack's office desk lock: ${detail}`);
  }
  if (frame.image) assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be 16:9`);
}
// The queue is a contract in both directions: a frame named here must say QUEUED in its own board note, and a
// frame not named here must not claim to be waiting. An empty list therefore means "nothing is outstanding" —
// reopen it only by naming the frame in office-layout-look.mjs AND in its note.
for (const id of officeLayoutQueued) assert(officeFrames.some(f => f.id === id && f.notes.includes("QUEUED")), `${id} is on the office queue, so its note must say QUEUED`);
for (const frame of officeFrames) if (!officeLayoutQueued.includes(frame.id)) assert(!/QUEUED for the desk lock/.test(frame.notes), `${frame.id} says it is queued but the office queue does not name it`);
assert.deepEqual(officeLayoutQueued, [], "the 1 October 2026 office queue is closed; if a frame is knowingly unfinished, name it here and in its note");
// Every frame the lock rebuilt must say so in its own note, not only in the scene header — twice over, once
// for the lock it now carries and once for the retake that put it there.
for (const id of officeLayoutRetakes) {
  const frame = project.frames.find(f => f.id === id);
  assert(frame, `${id} is listed as rebuilt but is not in the bundle`);
  // An office frame carries the lock, and the lock itself names the date — so 2 is the floor there: one for
  // the lock, one for the retake that put it on the desk. Shot 62 sits in scene 6 and carries no office lock,
  // so it is held to the stricter thing that matters: the retake must be in the note, not only the header.
  const hits = (frame.notes.match(/1 October 2026/g) || []).length;
  assert(hits >= (officeLayoutScenes.has(frame.sceneId.replace("neonoire-", "")) ? 2 : 1),
    `${id} must record its 1 October 2026 retake in its own note as well as carrying the lock`);
}
// And the record must stay accurate: the 30 September RETAKE PENDING list is scene 20's 193 and 194. Scene
// 21's 196 and 271 were never pinned, whatever a ledger once claimed.
assert(!rewritePending.has("neonoire-shot-196") && !rewritePending.has("neonoire-shot-271"), "scene 21's office frames are not RETAKE PENDING");
assert(rewritePending.has("neonoire-shot-193") && rewritePending.has("neonoire-shot-194"), "the scene-20 pins 193 and 194 are the real ones");
assert(officeLayoutLook.includes("ONE black rotary telephone"), "The office lock forbids the duplicated telephone");
assert(project.frames.find(f => f.id === "neonoire-shot-166").notes.includes("room master for the whole film"), "Shot 166 is declared the room master");
assert(project.frames.find(f => f.id === "neonoire-shot-87").notes.includes("no longer leads the room"), "Shot 87's study no longer leads the room");
pass("Jack's office: 17 frames carry the locked 1.60 m walnut desk, one telephone, the un-mirrored room and one master");

const detectives = generationFrames.filter(frame => frame.sceneId === "neonoire-s7");
assert.equal(detectives.length, 6);
for (const frame of detectives) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["s7/63-the-detectives-room.jpg", "s7/64-the-bottom-drawer.jpg", "sheets/ishida.jpg", "NO TIE", "BOTTOM drawer", "SEALED transparent bag", "s1/18-the-flashlight.jpg", "evidence hidden", "s5/43-the-front-counter.jpg"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing detectives-room continuity: ${detail}`);
  }
}
pass("all six detectives-room JPEGs are 1920×1080; Ishida, drawer states, sealed evidence and clock references are recorded");

// Passes are ten shots at a time, in screenplay order — the notes on every frame say which pass.
// The notes line numbers a card by its boarding-run slot, which the later-inserted scene 72 and the
// answer block left a permutation of the board ids (scenes 72–76 carry ids 69–86, labelled in boarding
// order). What must hold is that the labels are a bijection and each card names its own pass.
const labels = project.frames.map(frame => Number((frame.notes.match(/Stable Shot (\d+);/) || [])[1]));
for (const [i, frame] of project.frames.entries()) {
  assert.equal(frame.shotNumber, labels[i], `${frame.id}: metadata and production note agree`);
  assert(Number.isInteger(labels[i]) && labels[i] >= 1 && labels[i] <= 320, `${frame.id} should retain its stable production number`);
  assert(frame.notes.includes(`Pass ${Math.ceil(labels[i] / 10)} of ${Math.ceil(Math.max(...labels) / 10)}`), `${frame.id} should name its pass`);
}
assert.deepEqual(new Set(labels), new Set(project.frames.map(shotNo)), "Every production label maps to exactly one card, and every card to one label");
pass("generation passes run ten production numbers at a time, independent of scene-order playback");

// ---------------------------------------------------------------- cast, sheets and continuity
const byId = new Map(project.characters.map(c => [c.id, c]));
for (const character of project.characters) {
  for (const relation of character.relations || []) {
    const other = byId.get(relation.targetId);
    assert(other, `${character.name} links to a missing character`);
    assert((other.relations || []).some(r => r.targetId === character.id), `${character.name} → ${other.name} is not reciprocal`);
  }
}
for (const key of ["mara", "vera", "jack"]) {
  const sheet = `public/images/neonoire/sheets/${key}.jpg`;
  assert(existsSync(join(root, sheet)), `Missing continuity sheet: ${sheet}`);
  assert.equal(byId.get(`neonoire-${key}`).image, `/images/neonoire/sheets/${key}.jpg`, `${key} should carry the sheet the frames are generated against`);
}
assert(byId.get("neonoire-mara").description.includes("American") && byId.get("neonoire-vera").description.includes("American"), "Mara and Vera are American");
assert.equal(byId.get("neonoire-jack").name, "Jack");
assert.equal(byId.get("neonoire-jack").age, "48");
assert(byId.get("neonoire-jack").role.includes("detective"));
assert(byId.get("neonoire-jack").relations.every(r => !["Parent", "Child", "Sibling"].includes(r.kind)), "Jack is not a Voss family member");
assert.equal(byId.get("neonoire-daniel").name, "Daniel Voss");
for (const sister of ["vera", "mara"]) assert(byId.get(`neonoire-${sister}`).relations.some(r => r.targetId === "neonoire-daniel" && r.kind === "Parent"), "Daniel is the parent, in the correct relationship direction");
const photoCast = project.frames.find(f => f.id === "neonoire-shot-35").characters;
assert(photoCast.includes("neonoire-daniel") && !photoCast.includes("neonoire-jack"), "The photograph is Daniel, not Jack");
assert(project.scenes.find(s => s.id === "neonoire-s74").characters.includes("neonoire-jack"));
assert(existsSync(join(root, "public/images/neonoire/sheets/jack-face.jpg")), "Jack has a usable face reference");
assert(project.notes.some(note => /Continuity — the Voss family/.test(note.title)), "The continuity notes should travel with the project");
pass(`cast links are reciprocal; Jack has a distinct profile and Daniel has the father links`);

// The series workspace that shipped before this one is untouched by any of it.
assert.equal(bundle.id, "74a9cb34-9e80-4a04-a614-000000000014");
assert.equal(bundle.frames.length, 526);
assert.equal(bundle.scenes.length, 42);
assert(starterProjects.some(p => p.id === project.id), "A fresh workspace seeds NEONOIRE");
pass("the series bundle is unchanged, and NEONOIRE ships beside it as its own project");

// The look the workspace is generated in is a first-class style in the app's own library.
const { VISUAL_STYLES, visualStyle } = await import(pathToFileURL(exportsFile).href);
const style = visualStyle("neonoire");
assert.equal(style.id, "neonoire", "The Neo-Noir Tokyo style should be selectable by id");
assert(style.prompt.includes("35mm Kodak Vision3 500T") && style.prompt.includes("halation"), "The style should carry the studio brief's look");
assert(style.negative.includes("glossy cyberpunk") && style.negative.includes("HDR"), "The style should carry the brief's negative prompt");
assert(existsSync(join(root, "public", style.image)), `The style's example image is missing: ${style.image}`);
assert.equal(VISUAL_STYLES.filter(s => s.id === "neonoire").length, 1, "The style is registered once");
pass("the studio brief is the app's Neo-Noir Tokyo visual style, with its negative prompt and a key as its example image");

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
assert(csvHeader.startsWith('"Shot","Act","Sequence","Scene number","Scene"'), "The shot list should open with its own header row");
for (const frame of project.frames) {
  assert(csv.includes(`"${frame.shotType}"`) && csv.includes(`"${frame.lens}"`), `${frame.title} should reach the shot list with its framing`);
  assert(csv.includes(`"${frame.title}"`), `${frame.title} is missing from the shot list`);
}
assert(csv.includes('"EXT. BACKSTREET, KANDA"') && csv.includes('"INT. POLICE STATION, DETECTIVES\' ROOM"'), "Both ends of the running order should be in the shot list");
const imported = sanitizeImport(project);
assert.equal(imported.frames.length, EXPECTED_SHOTS);
assert.equal(imported.scenes.length, 102, "A re-import carries the whole revised screenplay");
pass(`prompts for ${models.length} models, the shot list CSV and a project re-import all handle the workspace`);

// ---------------------------------------------------------------- persistence
// Real service calls against an isolated local adapter file, never the user's workspace.
const services = join(cache, "services.cjs");
await build({
  stdin: { contents: 'export * from "./src/lib/projects"; export { sanitizeImport } from "./src/lib/validation";', resolveDir: root },
  outfile: services, bundle: true, platform: "node", format: "cjs", packages: "external", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const databaseFile = join(cache, "isolated-neonoire.json");
writeFileSync(databaseFile, "[]");
try {
  execFileSync(process.execPath, ["-e", `
    const assert = require('node:assert/strict');
    const api = require(${JSON.stringify(services)});
    (async () => {
      const id = ${JSON.stringify(project.id)};
      assert.equal((await api.listProjects()).length, 5, 'A fresh workspace seeds all five projects');
      const opened = await api.openNeonoireProject();
      assert.equal(opened.frames.length, ${EXPECTED_SHOTS});
      assert.equal(opened.scenes.length, 102);
      const studied = opened.frames.filter(f => f.image).length;
      assert(studied > 0, 'The bundled keyframes arrive with the workspace');

      // A writer's edit survives, and re-opening never duplicates.
      const frame = opened.frames[0];
      await api.updateProject(id, { title: 'NEONOIRE — my pass', frames: opened.frames.map(f => f.id === frame.id ? { ...f, title: 'My own title', status: 'Ready' } : f) });
      const again = await api.openNeonoireProject();
      assert.equal(again.title, 'NEONOIRE — my pass');
      assert.equal(again.frames.find(f => f.id === frame.id).title, 'My own title', 'An edited frame is never overwritten');
      assert.equal((await api.listProjects()).length, 5, 'Opening repeatedly must not duplicate');

      // A slot still waiting for its keyframe is filled in when the pass lands, and nothing else is.
      const awaiting = again.frames.find(f => !f.image);
      if (awaiting) {
        const filled = (await api.openNeonoireProject()).frames.find(f => f.id === awaiting.id);
        assert(!filled.image && filled.title.endsWith('(keyframe missing)'), 'A slot with no keyframe in the bundle stays a labelled placeholder');
      }
      const emptied = { ...again.frames.find(f => f.image), image: '', title: 'The key (keyframe missing)', notes: 'KEYFRAME MISSING — waiting for pass 2.', status: 'Needs review' };
      await api.updateProject(id, { frames: again.frames.map(f => f.id === emptied.id ? emptied : f) });
      const refilled = (await api.openNeonoireProject()).frames.find(f => f.id === emptied.id);
      assert(refilled.image, 'A placeholder whose keyframe has since arrived is filled in on the next open');
      assert(!refilled.title.includes('keyframe missing'), 'The filled-in frame loses its placeholder title');

      await api.deleteProject(id);
      assert.equal((await api.listProjects()).length, 4, 'Ordinary page loads respect deletion');
      await api.openNeonoireProject();
      assert.equal((await api.listProjects()).length, 5, 'Opening it again is deliberate');
    })().catch(error => { console.error(error); process.exit(1); });
  `], { cwd: root, env: { ...process.env, DATABASE_URL: "", NODE_ENV: "test", FRAME_LOCAL_DB_FILE: databaseFile }, stdio: "inherit", timeout: 30000 });
} finally { rmSync(databaseFile, { force: true }); }
pass("fresh/existing local workspaces: seeded once, edits preserved, keyframe passes filled in, deletion respected");

// A first-class low-level camera survives schema/import, CSV and every prompt platform.
for (const platform of ["flux", "sdxl", "midjourney", "generic", "hailuo", "seedance", "kling", "runway", "veo"]) {
  const prompt = buildFramePrompt(project, streets.find(f => f.id === "neonoire-shot-75"), platform, "neonoire");
  const text = typeof prompt === "string" ? prompt : JSON.stringify(prompt);
  assert(text.includes("low-set camera held level"), `${platform} loses the low level camera`);
  assert(!text.includes("making the subject feel powerful"), `${platform} silently converts restraint into a heroic up-angle`);
}
assert(shotListCsv(project).includes('"Low, level"'), "Camera detail survives CSV");
pass("the low-level camera remains level through import, CSV and nine image/video prompt platforms");

// ---------------------------------------------------------------- the remaining-keyframe briefs
// docs/neonoire/passes/ is what an image agent works from, so it has to match the board exactly.
execFileSync(process.execPath, ["scripts/neonoire/pass-prompts.mjs"], { cwd: root, stdio: "pipe" });
const passIndex = join(root, "docs", "neonoire", "passes", "README.md");
assert(existsSync(passIndex), "The pass index should exist: docs/neonoire/passes/README.md");
const index = readFileSync(passIndex, "utf8");
const awaiting = project.frames.filter(frame => !frame.image);
assert(index.includes(`${onDisk.length} of ${project.frames.length} keyframes are on disk`), `The pass index should state ${onDisk.length}/${project.frames.length} keyframes on disk`);
for (const frame of awaiting) {
  const n = plannedById.get(frame.id).n;
  const passFile = join(root, "docs", "neonoire", "passes", `pass-${Math.ceil(n / 10)}.md`);
  assert(existsSync(passFile), `Shot ${n} is still to generate but pass ${Math.ceil(n / 10)} has no brief`);
  const brief = readFileSync(passFile, "utf8");
  assert(brief.includes(`### Shot ${n} — `), `Pass ${Math.ceil(n / 10)} should carry a brief for shot ${n}`);
  assert(brief.includes(`public/images/neonoire/`), `Shot ${n}'s brief should name the file to write`);
}
if (awaiting.length) {
  const passText = awaiting.map(frame => { const n = plannedById.get(frame.id).n; return readFileSync(join(root, "docs", "neonoire", "passes", `pass-${Math.ceil(n / 10)}.md`), "utf8"); }).join("\n");
  assert(passText.includes("35mm Kodak Vision3 500T"), "Every pass brief should carry the style block");
  assert(passText.includes("glossy cyberpunk"), "Every pass brief should carry the negative prompt");
  pass(`${awaiting.length} remaining shots have a self-contained pass brief, carrying the style block and the negative prompt`);
} else {
  pass(`all ${project.frames.length} keyframes are on disk; cold-open revision status is checked separately above`)
}

// ---------------------------------------------------------------- final missing-image pass, 1 October 2026
assert.equal(placeholders.length, 0, "The nine final missing studies are delivered; none is a borrowed-image placeholder");
assert.equal(remainingBoardsFinalShots.length, 9);
for (const study of remainingBoardsFinalShots) {
  const frame = project.frames.find(f => f.shotNumber === study.n);
  assert.equal(frame.image, `/images/neonoire/${study.file}`);
  assert.equal(frame.status, "Ready", "The director explicitly selected these as main shots");
  assert(frame.notes.includes("1 October 2026") && frame.notes.includes("DIRECTOR APPROVED"), "Explicit approval travels with the main image");
  assert(!/Production approval pending|Full-size image review|Draft, not production-approved/i.test(frame.notes), "No review warnings on approved main images");
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert(study.references.every(file => file.startsWith("sheets/") && existsSync(join(root, "public/images/neonoire", file))), "Fresh revision generation attaches only existing character sheets");
}
assert.equal(project.frames.filter(f => f.status === "Needs review").length, rewritePending.size, "The older rewrite retakes stay honestly flagged, separate from missing images");
for (const shot of directorReplacementShots) {
  const frame = project.frames.find(frame => frame.id === shot.id);
  assert.equal(frame.image, `/images/neonoire/${shot.file}`);
  assert.equal(frame.status, "Ready");
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert(frame.notes.includes("LEFT TO RIGHT") && frame.notes.includes("Static frames remain genuinely static"));
}
assert(project.script.includes("the machine falls behind her") && project.script.includes("The two drawers above it stay closed"));
pass("director main shots: final nine approved, seven replacements installed, no review warnings; drawer geometry and forward route clarified");

// ---------------------------------------------------------------- recorded dialogue
// Every line in docs/neonoire/voice/manifest.json is a real file on a real frame, rides on that frame in the
// bundle at its offset, and fits inside the frame's duration; the voices file names the chosen voices.
{
  const manifest = readManifest(root);
  const voices = readVoices(root);
  assert(voices.characters.JACK?.voiceId && voices.characters.VERA?.voiceId, "voices.json names Jack's and Vera's voices");
  const ids = new Set();
  for (const line of manifest.lines) {
    assert(!ids.has(line.id), `Voice line ${line.id} appears once`);
    ids.add(line.id);
    const frame = project.frames.find(f => f.id === line.frameId);
    assert(frame, `Voice line ${line.id} belongs to a frame of the bundle`);
    assert(existsSync(join(root, "public", line.file)) && statSync(join(root, "public", line.file)).size > 1000, `public${line.file} is a real audio file`);
    const clip = frame.audio?.find(a => a.id === line.id);
    assert(clip && clip.src === line.file && clip.offset === line.offset && clip.character === line.character, `Frame ${frame.id} carries voice line ${line.id}`);
    assert(frame.duration >= line.offset + (line.duration || 0) + TAIL - 1, `Frame ${frame.id} is long enough for ${line.id}`);
    assert(voices.characters[line.character], `${line.character} has an entry in voices.json`);
  }
  assert.equal(project.frames.reduce((n, f) => n + (f.audio?.length || 0), 0), manifest.lines.length, "The bundle carries exactly the manifest's lines");
  pass(`recorded dialogue: ${manifest.lines.length} line(s) on the frames, files present, offsets and durations fit, voices.json names Jack and Vera`);
}

// ---------------------------------------------------------------- director's global rules
// Four rules the 30 September 2026 revision set over the whole film; each is checked against the
// draft and the bundle, not just against prose.
{
  const draftPath = join(root, "Neonoire (3).fountain");
  const draft = readFileSync(draftPath, "utf8").split("\n");
  const heading = (n) => draft.findIndex(l => new RegExp(`#${n}[A-Z]?#$`).test(l.trim()));
  assert.equal(project.title, "Nobody's Witness", "The workspace goes out under the film's title");
  // 1. No score before scene 75 — the draft carries exactly one score cue and it sits before the
  // scene 75 heading, after scene 74; no earlier line calls for music at all.
  const cue = draft.findIndex(l => /SCORE enter/i.test(l));
  assert(cue >= 0 && cue < heading(75) && cue > heading(74), "The score enters once, at the top of the scene 75 series");
  assert(draft.slice(0, cue).every(l => !/^\s*(MUSIC|SCORE)\b/i.test(l)), "Nothing before the cue asks for music");
  // 2. Exactly seven close-up inserts, named in the revision as the film's only cut-ins.
  const namedInserts = project.frames.filter(f => [308, 309, 312, 313, 315, 316, 319].includes(shotNo(f)));
  assert.equal(namedInserts.length, 7, "The seven named inserts are all boarded");
  assert.deepEqual(namedInserts.map(f => f.sceneId),
    ["s2", "s20", "s63", "s71", "s76", "s78", "s89"].map(k => `neonoire-${k}`),
    "Each named insert sits in the scene that named it");
  for (const f of namedInserts) assert(/Insert|Close-up/i.test(f.shotType), `${f.title} is a cut-in, typed ${f.shotType}`);
  // 3. Scene 83 opens wide: the confrontation's master is the 24mm full-body take.
  const s83master = project.frames.find(f => f.sceneId === "neonoire-s83");
  assert.equal(s83master.shotType, "Wide", "Scene 83 opens on its wide master");
  assert.equal(s83master.lens, "24mm", "The scene 83 master is the 24mm take");
  assert(s83master.notes.includes("Rain on the glass") && s83master.notes.includes("24mm room"), "The scene 83 master is the fortieth floor with rain on the glass");
  // 4. Every exterior stays wet until 98: the draft's one rain-stopped line is two lines into 98.
  const stopped = draft.map((l, i) => /rain (has stopped|stops)/i.test(l) ? i : -1).filter(i => i >= 0);
  assert.deepEqual(stopped, [heading(98) + 4], "The rain stops once, and only in scene 98");
  pass("director's global rules: the film title over the bundle, one score cue at 75, seven named inserts and no more, 83 on its wide master, wet until 98");
}

console.log("\nAll NEONOIRE checks passed.");
