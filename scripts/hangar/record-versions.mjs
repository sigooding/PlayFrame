// Records which values of the cold-open bundle have shipped before, as hashes, so a saved copy of the
// project can be refreshed without touching anything its owner edited: a field whose saved value is
// still a shipped default is replaced by the current bundle's, any other value is left alone.
//
// Run `npm run sync:hangar` BEFORE `npm run build:hangar` whenever the bundle is about to change:
// it adds the committed (about to be superseded) version to src/lib/hangar-sync.json.
// `npm run sync:hangar -- <commit> ...` adds specific historic versions instead.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = "src/lib/hangar-sync.json";
const BUNDLE = "public/projects/hangar-cold-open.json";
const hash = value => createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex");
const sync = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { project: {}, frames: {}, scenes: {}, characters: {}, notes: {} };
const add = (bucket, id, project) => {
  const target = id === null ? (sync.project ||= {}) : ((sync[bucket] ||= {})[id] ||= {});
  for (const [key, value] of Object.entries(project)) {
    if (key === "id" || typeof value === "object" && value !== null && !Array.isArray(value)) continue;
    const list = (target[key] ||= []);
    const h = hash(value);
    if (!list.includes(h)) list.push(h);
  }
};
const revs = process.argv.slice(2);
const sources = revs.length ? revs.map(rev => execFileSync("git", ["show", `${rev}:${BUNDLE}`], { encoding: "utf8", maxBuffer: 1 << 28 })) : [execFileSync("git", ["show", `HEAD:${BUNDLE}`], { encoding: "utf8", maxBuffer: 1 << 28 })];
for (const source of sources) {
  const bundle = JSON.parse(source);
  const { frames, scenes, characters, notes, ...rest } = bundle;
  const topLevel = ["title", "description", "genre", "format", "status", "coverImage", "script"];
  add("project", null, Object.fromEntries(topLevel.map(key => [key, rest[key]])));
  for (const frame of frames) add("frames", frame.id, frame);
  for (const scene of scenes) add("scenes", scene.id, scene);
  for (const character of characters) add("characters", character.id, character);
  for (const note of notes) add("notes", note.id, note);
}
writeFileSync(FILE, JSON.stringify(sync, null, 1) + "\n");
console.log(`Recorded ${sources.length} bundle version(s) in ${FILE}`);
