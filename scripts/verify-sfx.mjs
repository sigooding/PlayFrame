// npm run verify:sfx: the shared sound-effect library (NEONOIRE, the Hangar cold open, the Rapture) is whole, cross-tagged and kept.
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = file => JSON.parse(readFileSync(join(root, file), "utf8"));
const pass = message => console.log(`  PASS  ${message}`);
const source = read("docs/sfx/library-source.json");
const library = read("docs/sfx/library.json");
const generations = read("docs/sfx-generations-2026-10-08.json");
const projects = ["neonoire", "hangar", "rapture"];
console.log("=== The shared sound-effect library ===");

assert.deepEqual(library.projects, projects);
assert.equal(source.new.length, 30, "30 new effects");
assert.equal(source.reused.length, 5, "5 effects reused from NEONOIRE");
assert.deepEqual(library.effects.map(e => e.id), [...source.new, ...source.reused].map(e => e.id), "library.json is the source's effects, in order (npm run: node scripts/sfx/build-library.mjs)");
assert.equal(new Set(library.effects.map(e => e.id)).size, library.effects.length, "ids are unique");
pass("35 effects: 30 new and 5 reused from NEONOIRE, library.json in step with its source");

for (const e of library.effects) {
  assert(e.file && existsSync(join(root, "public", e.file)), `${e.id} is on disk`);
  assert(statSync(join(root, "public", e.file)).size > 5000, `${e.id} is not an empty file`);
  assert(e.duration > 0.5 && e.duration <= 30, `${e.id} has a plausible length`);
  assert(Object.keys(e.projects).length > 0 && Object.keys(e.projects).every(p => projects.includes(p)), `${e.id} fits at least one known story`);
  assert(Object.values(e.projects).every(text => typeof text === "string" && text.length >= 8), `${e.id} says where in each story`);
  if (e.source !== "new") continue;
  assert(e.file === `/audio/sfx/${e.id}.mp3`);
  assert(e.prompt && e.generation?.id && e.generation.session && e.generation.flow, `${e.id} records the prompt and the ElevenLabs generation it came from`);
  assert(e.alternates.length >= 2, `${e.id} keeps at least two takes`);
  for (const a of e.alternates) {
    assert(existsSync(join(root, "public", a)), `${a} is kept in the repo (ElevenLabs does not keep audio)`);
    assert(generations[a.replace(/^.*\//, "").replace(/\.mp3$/, "")], `${a} has its generation recorded`);
  }
  assert(e.alternates.includes(`/audio/sfx/alternates/${e.id}--${e.pick}.mp3`), `${e.id}'s pick is one of its kept takes`);
  assert(!e.weak, `${e.id}'s pick is not a near-silent take`);
  assert(e.sourcePeakDb > -25, `${e.id}'s pick is not mostly room noise`);
  assert(e.peakDb < -1, `${e.id} does not clip`);
}
pass("every file is on disk, every new effect keeps its takes, prompt and generation, and none is near-silent or clipping");

// reuse is the point: no effect is for one story only except where the draft pins it, and each story draws on the others' work
const only = story => library.effects.filter(e => Object.keys(e.projects).length === 1 && story in e.projects);
const shared = library.effects.filter(e => Object.keys(e.projects).length > 1);
assert(shared.length >= 25, `at least 25 of 35 effects are tagged for more than one story (found ${shared.length})`);
for (const p of projects) {
  assert(library.counts[p] >= 15, `${p} has at least 15 effects to draw on (found ${library.counts[p]})`);
  assert(library.effects.some(e => e.source === "new" && p in e.projects && Object.keys(e.projects).some(q => q !== p)), `${p} has new effects shared with another story`);
}
for (const id of ["rain", "shop-chime", "suppressed-shot", "vending-machine-buzz", "body-fall"]) {
  const e = library.effects.find(x => x.id === id);
  assert(e?.source === "neonoire" && "neonoire" in e.projects && Object.keys(e.projects).length > 1, `NEONOIRE's ${id} is offered to the other stories`);
}
pass(`${shared.length} of 35 effects are tagged for more than one story; NEONOIRE's five are offered to the Hangar and the Rapture; counts ${projects.map(p => `${p} ${library.counts[p]}`).join(", ")}`);

// the 14A rule from the NEONOIRE bible: the lighter is never lit in scene 14A
const flare = library.effects.find(e => e.id === "flare-hiss");
assert(/never the lighter in 14A/.test(flare.projects.neonoire), "flare-hiss keeps the scene 14A rule (the lighter is never lit)");

// nothing of NEONOIRE's own was touched: the reused files are where they were
for (const e of library.effects.filter(x => x.source === "neonoire")) assert(e.file.startsWith("/audio/neonoire/"), `${e.id} still plays from NEONOIRE's own folder`);
assert(existsSync(join(root, "public/audio/sfx/index.html")), "the listening page exists");
const page = readFileSync(join(root, "public/audio/sfx/index.html"), "utf8");
assert(page.includes("Nobody has listened"), "the listening page says nobody has listened");
pass("NEONOIRE's own effect files are untouched and the listening page is there");
console.log("The shared sound-effect library is whole.");
