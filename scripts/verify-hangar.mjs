// npm run verify:hangar: the cold-open workspace's schema, ceilings, source fidelity and isolation.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
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
await build({ stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/frame-order";', resolveDir: root }, outfile: lib, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning" });
const { validatePatch, isUuid, MAX_FRAMES, MAX_SCENES, framesInSceneOrder } = await import(`file://${lib}`);

assert(isUuid(project.id));
validatePatch(project);
pass("the bundle is a valid project");
assert(project.frames.length <= MAX_FRAMES && project.scenes.length <= MAX_SCENES);
assert.equal(project.scenes.length, 8);
assert.equal(project.frames.length, 39);
assert.deepEqual(framesInSceneOrder(project.frames, project.scenes).map(f => f.id), project.frames.map(f => f.id), "frames are already in scene order");
assert(project.frames.every(f => f.image === "" && f.status === "Needs review"), "no frame borrows a picture; each says it still needs one");
assert(project.frames.every(f => project.scenes.some(s => s.id === f.sceneId)), "every frame belongs to a scene");
assert.equal(new Set(project.frames.map(f => f.shotNumber)).size, project.frames.length, "shot numbers are unique");
pass("8 scenes, 39 shots, in order, none with a borrowed picture");

const text = project.script;
for (const word of ["alien", "robot", "UFO"]) {
  const lines = text.split("\n").filter(line => new RegExp(`\\b${word}\\b`, "i").test(line) && !line.includes("never says") && !line.includes("Nobody in this film"));
  assert.equal(lines.length, 0, `nobody says "${word}" in the open`);
}
assert(!project.frames.some(f => /\b(alien|robot|ufo)\b/i.test(f.description + f.title)), "no shot names it");
assert(project.frames.filter(f => /flare/i.test(f.description)).length >= 3 && !/(?<!not )flashlight/i.test(project.frames.map(f => f.description).join(" ")), "flares, never flashlights");
pass("nothing is ever named, and the light outdoors is flares");

const neonoire = JSON.parse(read("public/projects/neonoire-opening.json"));
assert.notEqual(project.id, neonoire.id);
assert(!project.script.includes("Nobody's Witness") && !JSON.stringify(project).includes("/images/neonoire/"), "nothing leaks across from the other project");
pass("isolated from Nobody's Witness: its images, ids and script are untouched");
console.log("\nAll cold-open checks passed.");
