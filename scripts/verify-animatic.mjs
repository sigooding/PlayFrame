import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { build } from "esbuild";
import { cameraMove, orderAnimaticFrames } from "./animatic/timeline.mjs";
import { directorApprovedMainIds, directorReplacementShots } from "./neonoire/director-corrections.mjs";

const root = process.cwd(), cache = `${root}/node_modules/.cache/verify-animatic`;
mkdirSync(cache, { recursive: true });
await build({ stdin: { contents: 'export * from "./src/lib/animatic-options"; export * from "./src/lib/bundle-refresh"; export * from "./src/lib/frame-order";', resolveDir: root }, outfile: `${cache}/lib.cjs`, bundle: true, platform: "node", format: "cjs", logLevel: "warning" });
const require = createRequire(import.meta.url);
const { parseAnimaticOptions, animaticFrames, bundledFrameUpdates, framesInSceneOrder } = require(`${cache}/lib.cjs`);
const project = JSON.parse(readFileSync("public/projects/neonoire-opening.json"));
const pass = text => console.log(`  PASS  ${text}`);
console.log("=== Main images, forward route and animatic export ===");
for (const id of directorApprovedMainIds) {
  const frame = project.frames.find(frame => frame.id === id);
  assert.equal(frame.status, "Ready");
  assert(frame.image && frame.notes.includes("DIRECTOR APPROVED"));
  assert(!/Production approval pending|Full-size image review|Draft, not production-approved/.test(frame.notes));
}
assert.equal(directorReplacementShots.length, 6);
assert(project.script.includes("The two drawers above it stay closed."));
assert(project.script.includes("sealed together in one clear evidence bag"));
assert(project.script.includes("the machine falls behind her."));
assert(project.frames.filter(frame => frame.sceneId === "neonoire-s75").every(frame => !frame.characters.length));
pass("18 selected main shots are Ready without review warnings; six fresh replacements, correct drawer package, explicit forward route and empty returns");

const options = parseAnimaticOptions({}, project);
assert.equal(options.timing, "playback"); assert.equal(options.audio, true);
assert.equal(options.resolution, "1080p"); assert.equal(options.music, false); assert.equal(options.subtitles, false);
assert.equal(options.camera, false); assert.equal(options.credits, false);
assert.equal(parseAnimaticOptions({ music: true, credits: true, camera: true }, project).credits, true);
assert.throws(() => parseAnimaticOptions({ credits: true }, project), /score/);
const one = parseAnimaticOptions({ sceneId: "neonoire-s7", resolution: "720p" }, project);
assert.equal(animaticFrames(project, one).length, 6);
const range = parseAnimaticOptions({ fromSceneId: "neonoire-s73", toSceneId: "neonoire-s75" }, project);
assert.equal(animaticFrames(project, range).length, 15);
for (const data of [
  { sceneId: "../../.env" }, { resolution: "1080p;-y" }, { output: "/tmp/secrets" },
  { audio: "true" }, { sceneId: "neonoire-s7", fromSceneId: "neonoire-s1", toSceneId: "neonoire-s7" },
  { fromSceneId: "neonoire-s75", toSceneId: "neonoire-s73" }, { fromSceneId: "neonoire-s7" },
  { audio: false, subtitles: true },
]) assert.throws(() => parseAnimaticOptions(data, project));
assert.throws(() => parseAnimaticOptions({}, { ...project, frames: [] }));
assert.throws(() => parseAnimaticOptions({}, { ...project, frames: project.frames.map(frame => ({ ...frame, duration: 3600 })) }));
pass("whole/one/range exports validate IDs, resolution, booleans, order and bounded duration; no caller-supplied commands or paths");

const interleaved = { ...project, frames: [...project.frames.filter(frame => frame.sceneId === "neonoire-s100"), ...project.frames.filter(frame => frame.sceneId !== "neonoire-s100")] };
[interleaved.frames[0], interleaved.frames[1]] = [interleaved.frames[1], interleaved.frames[0]];
assert.deepEqual(orderAnimaticFrames(interleaved), framesInSceneOrder(interleaved.frames, interleaved.scenes));
assert.deepEqual(animaticFrames(interleaved, {}).map(frame => frame.id), orderAnimaticFrames(interleaved).map(frame => frame.id));
for (const index of [0, 1, 2]) assert.equal(cameraMove({ movement: "Static", notes: "no tracking, she walks past, never pan" }, 14, index), null);
for (const m of ["Pan right", "Pan left", "Tracking", "Handheld", "Tilt up", "Steadicam"]) { const c = cameraMove({ movement: m }, 8); assert.equal(c.kind, "push"); assert.equal(c.x, "iw/2-iw/zoom/2"); assert.equal(c.y, "ih/2-ih/zoom/2"); } // never sideways
assert.equal(cameraMove({ movement: "Dolly out" }, 8).kind, "pull");
assert.equal(cameraMove({ movement: "Unspecified" }, 5), null);
pass("CLI and app preserve the same edited within-scene order; Static never moves, and moving shots only push or pull, centred");

const older = structuredClone(project);
older.script = readFileSync("docs/neonoire/baseline/Neonoire_PreRestoration_2026-10-01.fountain", "utf8").replace(/ #\d+[A-Z]?#(?=\n|$)/g, "");
for (const frame of older.frames) if (directorApprovedMainIds.has(frame.id)) frame.status = "Draft";
const patch = bundledFrameUpdates(older, project);
assert.equal(patch.script, project.script);
assert(patch.frames.filter(frame => directorApprovedMainIds.has(frame.id)).every(frame => frame.status === "Ready"));
const edited = structuredClone(older);
edited.script += "\nDirector's own additional scene.\n";
const custom = edited.frames.find(frame => frame.id === "neonoire-shot-299");
custom.image = "/images/coastal-road.jpg"; custom.notes = "My custom note."; custom.description = "My custom composition.";
const editedPatch = bundledFrameUpdates(edited, project);
assert.equal(editedPatch.script, undefined);
assert.deepEqual(editedPatch.frames.find(frame => frame.id === custom.id), custom);
pass("known saved screenplay gets the authorised clarification; writer scripts, custom images, descriptions and notes are not replaced");
console.log("Animatic checks passed. Run verify:animatic:browser with a running FFmpeg-enabled app for real MP4 rendering/download tests.");
