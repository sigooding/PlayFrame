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
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { SCENES, parseBoard, readBoard } from "./neonoire/plan.mjs";
import { streetsPassOneImages, streetsPassTwoImages } from "./neonoire/streets-look.mjs";
import { dawnImages, jackRecastDone, jackRecastImages, jackRecastPending, policeDayImages } from "./neonoire/dawn-look.mjs";
import { witnessImages, witnessNeedsReview } from "./neonoire/witness-look.mjs";
import { hiveImages } from "./neonoire/hive-look.mjs";
import { escapeImages } from "./neonoire/escape-look.mjs";
import { confrontationImages, veraLookCImages, veraLookCSheet } from "./neonoire/confrontation-look.mjs";

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
assert.equal(project.scenes.length, 100, "The final screenplay's 100 numbered scenes all belong to the workspace");
const boardedIds = new Set(project.frames.map(frame => frame.sceneId));
assert.equal(boardedIds.size, 28, "The opening seven plus scenes 72–92 are boarded");
assert(project.scenes.filter(scene => !boardedIds.has(scene.id)).every(scene => scene.description.startsWith("WRITTEN, NOT BOARDED")), "Unboarded scenes say honestly that the board has not reached them");
assert(project.scenes.filter(scene => !boardedIds.has(scene.id)).every(scene => scene.partId === "neonoire-part-feature"), "Unboarded scenes hang together in one sequence");
assert.equal(project.frames.length, 138, "The twenty-eight boarded scenes carry 138 numbered shots");
assert.equal(project.characters.length, 14);
assert(project.scenes.every(scene => scene.style === "neonoire"), "Every scene is lit and generated in the studio brief's own look");
assert(project.frames.every(frame => frame.style === "neonoire"), "Every frame carries the Neo-Noir Tokyo style, so prompts use the brief automatically");
assert(project.frames.every(frame => frame.lens), "Every frame declares a lens");
assert.equal(project.notes.length, 8);
assert(project.notes.some(note => note.id === "neonoire-frame-format" && /16:9 full-bleed, 1920×1080/.test(note.content)), "The workspace carries the film's 16:9 frame rule");
assert.equal(project.brainstorm.length, 6);
assert(project.moodboards.length >= 3 && project.moodboards.length <= 7, "The boards carried are the ones with keyframes on them");
for (const board of project.moodboards) assert(board.items.length > 0, `An empty mood board is a dead card: ${board.title}`);
assert(project.scenes.every(scene => scene.actId === project.acts[0].id), "Every scene belongs to the opening act");
assert.equal(new Set(project.frames.map(frame => frame.id)).size, 138, "Frame ids are unique");
assert.equal(new Set(project.frames.map(frame => `${frame.sceneId}/${frame.title}`)).size, 138, "No two shots in a scene share a title");
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
const clean = fountain.replace(/ #\d+#(?=\n|$)/g, "");
assert.equal(project.script.replace(/\s+$/, ""), clean.replace(/\s+$/, ""), "The screenplay should be the draft, minus its scene-number markers");
for (const scene of project.scenes) assert(project.script.includes(`${scene.location} - ${scene.time}`), `${scene.title}'s slugline must survive in the script`);
pass(`the screenplay carries all 100 scenes, in order, each selecting its own slugline (${project.script.split(/\s+/).length} words)`);

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
const { coldOpenCompletedThrough, isColdOpenScene } = await import("./neonoire/cold-open-look.mjs");
assert(coldOpenCompletedThrough >= 10 && coldOpenCompletedThrough <= 28);
const coldOpen = project.frames.filter(frame => ["neonoire-s1", "neonoire-s2"].includes(frame.sceneId));
assert.equal(coldOpen.length, 28);
for (const frame of coldOpen) {
  const n = Number(frame.id.replace("neonoire-shot-", ""));
  assert(isColdOpenScene(frame.sceneId.replace("neonoire-", "")));
  if (n <= coldOpenCompletedThrough) {
    assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must be revised 16:9`);
    assert(!frame.notes.includes("COLD OPEN REVISION PENDING"));
    for (const detail of ["Cold-open visual revision", "s1/01-backstreet.jpg", "s1/07-old-man.jpg", "s1/08-sedan-arrives.jpg", "red enamel bird clip", "dark-brown structured leather handbag", "Strap intact through 16", "tag 87"]) {
      assert(frame.notes.includes(detail), `${frame.title} lacks cold-open continuity: ${detail}`);
    }
  } else {
    assert.deepEqual(jpegDimensions(frame.image), [1912, 800], `${frame.title}: legacy image must not masquerade as a revised frame`);
    assert.equal(frame.status, "Needs review");
    assert(frame.notes.includes("COLD OPEN REVISION PENDING"));
    assert(!frame.notes.includes("Cold-open visual revision:"));
  }
}
pass(`cold-open shots 1–${coldOpenCompletedThrough} are 1920×1080; remaining ${28 - coldOpenCompletedThrough} are explicitly pending revision`);

// Scenes 72–75: session one (nine studies plus Jack's sheet, ten calls) and session two (the six
// pending replacements plus the lost-heel and twenty-metre continuity replacements, eight calls)
// together complete every keyframe. The old street studies stay retired either way.
const streets = project.frames.filter(frame => ["neonoire-s72", "neonoire-s73", "neonoire-s74", "neonoire-s75"].includes(frame.sceneId));
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
  assert.equal(frame.status, jackRecastPending.has(frame.id) ? "Needs review" : "Draft", `${frame.title}: only the superseded-Jack frames await review`);
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
assert(project.moodboards.some(b => b.id === "neonoire-look-tokyo-story" && b.items.length === 15));
const aftermath = project.frames.filter(f => f.sceneId === "neonoire-s76");
assert.deepEqual(aftermath.map(f => f.id), ["neonoire-shot-82", "neonoire-shot-83", "neonoire-shot-84"], "Scene 76 stable identities remain unchanged");
for (const frame of aftermath) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert(frame.notes.includes("Scene 76 is unchanged"));
}
for (let n = 1; n <= 84; n++) assert(project.frames.some(f => f.id === `neonoire-shot-${String(n).padStart(2, "0")}`), `Existing frame identity ${n} must survive the inserted scene 72`);
// Scenes 77–79: first boarding, nine shots, with Jack recast as a white American in the same session.
const dawn = project.frames.filter(frame => ["neonoire-s77", "neonoire-s78", "neonoire-s79"].includes(frame.sceneId));
assert.equal(dawn.length, 9, "Three office, three corridor and three apartment shots");
assert.deepEqual(dawn.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${87 + i}`), "New stable IDs start after scene 72's 85–86");
assert.deepEqual(new Set(dawn.map(f => f.image)), new Set(dawnImages), "Every scenes 77–79 frame is a delivered generation");
for (const frame of dawn) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title}: 16:9 delivery`);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, "Draft");
  for (const detail of ["white American", "DANIEL VOSS", "BAREFOOT", "umbrella stand EMPTY", "exactly two ivory cups, both empty"]) assert(frame.notes.includes(detail), `${frame.title} is missing scenes 77–79 continuity: ${detail}`);
}
assert(dawn.filter(f => f.sceneId === "neonoire-s77").every(f => f.characters.includes("neonoire-jack")));
assert(dawn.filter(f => f.sceneId !== "neonoire-s77").every(f => f.characters.join() === "neonoire-vera"));
assert.deepEqual(jpegDimensions("/images/neonoire/sheets/jack.jpg"), [1920, 1080], "Jack's recast sheet is 16:9");
assert(/white American/.test(project.characters.find(c => c.id === "neonoire-jack").description), "Jack's cast card carries the recast");
assert(project.moodboards.some(b => b.id === "neonoire-look-dawn" && b.items.length === 9));
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
const policeDay = project.frames.filter(f => f.sceneId === "neonoire-s80");
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
const witness = project.frames.filter(f => f.sceneId === "neonoire-s81" || f.sceneId === "neonoire-s82");
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
const confrontation = project.frames.filter(f => f.sceneId === "neonoire-s83" || f.sceneId === "neonoire-s84");
assert.deepEqual(confrontation.map(f => f.id), Array.from({ length: 10 }, (_, i) => `neonoire-shot-${111 + i}`));
assert.deepEqual(new Set(confrontation.map(f => f.image)), new Set(confrontationImages));
for (const frame of confrontation) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, "Draft");
  const office = frame.sceneId === "neonoire-s83";
  assert.equal(frame.lighting, office ? "Overcast soft" : "Low key");
  const look = office ? ["GLASS CASE", "KUROSE", "never touches the tea", "sheets/vera.jpg"] : ["single bare bulb", "white American", "scenes 13, 20 and 25"];
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
const hive = project.frames.filter(f => ["neonoire-s85", "neonoire-s86", "neonoire-s87", "neonoire-s88"].includes(f.sceneId));
assert.deepEqual(hive.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${121 + i}`));
assert.deepEqual(new Set(hive.map(f => f.image)), new Set(hiveImages));
for (const frame of hive) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, "Draft");
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
const escape = project.frames.filter(f => ["neonoire-s89", "neonoire-s90", "neonoire-s91", "neonoire-s92"].includes(f.sceneId));
assert.deepEqual(escape.map(f => f.id), Array.from({ length: 9 }, (_, i) => `neonoire-shot-${130 + i}`));
assert.deepEqual(new Set(escape.map(f => f.image)), new Set(escapeImages));
for (const frame of escape) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080]);
  assert.equal(frame.movement, "Static");
  assert.equal(frame.status, "Draft");
  for (const detail of ["WARDROBE LOOK C", "sheets/vera-look-c.jpg", "white American", "s91/132-the-rails-sing.jpg"]) assert(frame.notes.includes(detail), `${frame.title} is missing scene 89–92 continuity: ${detail}`);
  assert(frame.characters.every(id => [castOf("Jack"), castOf("Vera Voss")].includes(id)), `${frame.title}: only Jack and Vera are in frame`);
}
assert.deepEqual(escape.find(f => f.id === "neonoire-shot-136").characters, [], "The walkway is empty when the last carriage passes");
assert.equal(escape.find(f => f.id === "neonoire-shot-134").lens, escape.find(f => f.id === "neonoire-shot-136").lens, "Scene 91 closes on its opening camera");
pass("scenes 89–92 boarded: nine 16:9 shots — stairwell, roof, walkway and street; Vera in Look C throughout, an empty walkway after the train");

pass("Tokyo Story colour revision complete: ten + eight generations, all fifteen street shots delivered, stable IDs, makeup/shoe states and static low-level cameras");

const frontCounter = project.frames.filter(frame => frame.sceneId === "neonoire-s5");
assert.equal(frontCounter.length, 8);
for (const frame of frontCounter) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["police_station.png", "16:9", "pale-blue umbrella", "charcoal wool coat", "young-officer.jpg"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing revised continuity: ${detail}`);
  }
}
assert.deepEqual(jpegDimensions("/images/neonoire/keys/05-the-police-station.jpg"), [1920, 1080]);
pass("all eight front-counter JPEGs and the station key are 1920×1080, with the revised continuity brief");

const apartment = project.frames.filter(frame => frame.sceneId === "neonoire-s4");
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
// Scene 3's frames are the remaining legacy scope studies: honest, labelled, Needs review.
const block3 = project.frames.filter(frame => frame.sceneId === "neonoire-s3");
assert.equal(block3.length, 4);
for (const frame of block3) {
  assert.deepEqual(jpegDimensions(frame.image), [1912, 800], `${frame.title}: legacy image must not masquerade as a revised frame`);
  assert.equal(frame.status, "Needs review", `${frame.title} awaits the 16:9 revision`);
  assert(frame.notes.includes("16:9 REVISION PENDING"), `${frame.title} should name its pending revision`);
}
pass("scene 3's four legacy frames are labelled 16:9 revision pending rather than silently cropped");
pass("all ten apartment JPEGs and their key are 1920×1080; pendant removal and prop/cast continuity are recorded");

const interview = project.frames.filter(frame => frame.sceneId === "neonoire-s6");
assert.equal(interview.length, 12);
for (const frame of interview) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["s6/51-the-interview-room.jpg", "s6/56-three-days-ago.jpg", "window sill", "sheets/ishida.jpg", "NO TIE", "pale-blue umbrella", "PAPER cup", "intact and the table dry through shot 59", "crushed cup and wet table"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing interview continuity: ${detail}`);
  }
}
assert(project.frames.find(frame => frame.id === "neonoire-shot-51").notes.includes("fluorescent is steady"));
pass("all twelve interview JPEGs are 1920×1080; room, wardrobe, cup and spill continuity are recorded");

const detectives = project.frames.filter(frame => frame.sceneId === "neonoire-s7");
assert.equal(detectives.length, 6);
for (const frame of detectives) {
  assert.deepEqual(jpegDimensions(frame.image), [1920, 1080], `${frame.title} must remain 16:9`);
  for (const detail of ["s7/63-the-detectives-room.jpg", "s7/64-the-bottom-drawer.jpg", "sheets/ishida.jpg", "NO TIE", "BOTTOM drawer", "SEALED transparent bag", "s1/18-the-flashlight.jpg", "evidence hidden", "s5/43-the-front-counter.jpg"]) {
    assert(frame.notes.includes(detail), `${frame.title} is missing detectives-room continuity: ${detail}`);
  }
}
pass("all six detectives-room JPEGs are 1920×1080; Ishida, drawer states, sealed evidence and clock references are recorded");

// Passes are ten shots at a time, in screenplay order — the notes on every frame say which pass.
for (const [i, frame] of project.frames.entries()) {
  assert(frame.notes.includes(`Shot ${i + 1} of 138`), `Shot ${i + 1} should say where it sits in the running order`);
  assert(frame.notes.includes(`Pass ${Math.ceil((i + 1) / 10)} of 14`), `Shot ${i + 1} should name its pass`);
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
assert(csvHeader.startsWith('"Shot","Act","Sequence","Scene"'), "The shot list should open with its own header row");
for (const frame of project.frames) {
  assert(csv.includes(`"${frame.shotType}"`) && csv.includes(`"${frame.lens}"`), `${frame.title} should reach the shot list with its framing`);
  assert(csv.includes(`"${frame.title}"`), `${frame.title} is missing from the shot list`);
}
assert(csv.includes('"EXT. BACKSTREET, KANDA"') && csv.includes('"INT. POLICE STATION, DETECTIVES\' ROOM"'), "Both ends of the running order should be in the shot list");
const imported = sanitizeImport(project);
assert.equal(imported.frames.length, 138);
assert.equal(imported.scenes.length, 100, "A re-import carries the whole final screenplay");
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
      assert.equal(opened.frames.length, 138);
      assert.equal(opened.scenes.length, 100);
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

console.log("\nAll NEONOIRE checks passed.");
