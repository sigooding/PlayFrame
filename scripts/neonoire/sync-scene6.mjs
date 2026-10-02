// Writes src/lib/neonoire-scene6-sync.json: the fingerprints that let a saved workspace still on the default text of the
// interview scene (6) be brought to its 2 October 2026 rewrite — new script, the changed shot text and recorded
// dialogue, and the seven new placeholder slots (321–327) — without touching anything the writer has edited.
// The same file carries the later 2 October additions: the cold open's slots (328–333) and the inserted scene 14A
// (the scene itself and its ten slots, 334–343), which a saved workspace on any earlier default receives whole.
//
//   node scripts/neonoire/sync-scene6.mjs <prior-bundle.json> [intermediate-bundle.json ...]
//
// <prior-bundle.json> is the bundle as it stood before the rewrite (git show <commit>:public/projects/neonoire-opening.json);
// the checked-in baseline docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json serves, so the first argument never
// changes. Every bundle shipped since is passed after it, each one a default a saved workspace may still be on.
// Also writes docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json, the prior script and scene 1, 2 and 6 frames the
// regression test in scripts/verify-revision-restoration.mjs replays.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const digest = text => createHash("sha256").update(text).digest("hex");
const fieldDigest = value => digest(JSON.stringify(value ?? null));
const prior = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
// Bundles shipped between the prior one and now (a workspace refreshed to one of them is still a default workspace).
const intermediates = process.argv.slice(3).map(file => JSON.parse(readFileSync(resolve(file), "utf8")));
const next = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
// The 2 October 2026 rewrites: scene 6 (the interview room), scene 1 (the cold open) and scene 2's one echoed line.
const scenes = ["neonoire-s1", "neonoire-s2", "neonoire-s6", "neonoire-s14a"];
// Scenes added to the screenplay since the prior bundle: a saved workspace on a default text is given them whole.
const newSceneIds = ["neonoire-s14a"].filter(id => next.scenes.some(scene => scene.id === id));
const priorFrames = prior.frames.filter(f => scenes.includes(f.sceneId)), nextFrames = new Map(next.frames.filter(f => scenes.includes(f.sceneId)).map(f => [f.id, f]));
const fields = ["title", "description", "notes", "characters", "duration", "transition", "audio"];
const frames = {};
for (const old of priorFrames) {
  const now = nextFrames.get(old.id);
  if (!now) continue;
  for (const key of fields) if (JSON.stringify(old[key] ?? null) !== JSON.stringify(now[key] ?? null)) (frames[old.id] ||= {})[key] = fieldDigest(old[key]);
}
const priorIds = new Set(priorFrames.map(f => f.id));
const out = {
  note: "Rewrites of 2 October 2026 (scene 6 the interview room, scene 1 the cold open, scene 2's echoed line). priorScriptHashes and the per-field digests are of the default text before it; bundle-refresh replaces a field only when the saved value still matches.",
  priorScriptHashes: [digest(prior.script), ...intermediates.map(bundle => digest(bundle.script))],
  newSceneIds,
  newFrameIds: [...nextFrames.keys()].filter(id => !priorIds.has(id)),
  frames,
};
writeFileSync(resolve(root, "src/lib/neonoire-scene6-sync.json"), JSON.stringify(out, null, 2) + "\n");
writeFileSync(resolve(root, "docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json"), JSON.stringify({ note: "The default script and scene 6 frames before the 2 October 2026 rewrite of the interview room; replayed by verify-revision-restoration.", script: prior.script, frames: priorFrames }) + "\n");
console.log(`${Object.keys(frames).length} changed frames, ${out.newFrameIds.length} new, prior scripts ${out.priorScriptHashes.map(h => h.slice(0, 8)).join(", ")}`);
