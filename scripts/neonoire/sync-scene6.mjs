// Writes src/lib/neonoire-scene6-sync.json: the fingerprints that let a saved workspace still on the default text of the
// interview scene (6) be brought to its 2 October 2026 rewrite — new script, the changed shot text and recorded
// dialogue, and the seven new placeholder slots (321–327) — without touching anything the writer has edited.
//
//   node scripts/neonoire/sync-scene6.mjs <prior-bundle.json>
//
// <prior-bundle.json> is the bundle as it stood before the rewrite (git show <commit>:public/projects/neonoire-opening.json).
// Also writes docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json, the prior script and scene-6 frames the
// regression test in scripts/verify-revision-restoration.mjs replays.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const digest = text => createHash("sha256").update(text).digest("hex");
const fieldDigest = value => digest(JSON.stringify(value ?? null));
const prior = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
const next = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const scene = "neonoire-s6";
const priorFrames = prior.frames.filter(f => f.sceneId === scene), nextFrames = new Map(next.frames.filter(f => f.sceneId === scene).map(f => [f.id, f]));
const fields = ["title", "description", "notes", "characters", "duration", "transition", "audio"];
const frames = {};
for (const old of priorFrames) {
  const now = nextFrames.get(old.id);
  if (!now) continue;
  for (const key of fields) if (JSON.stringify(old[key] ?? null) !== JSON.stringify(now[key] ?? null)) (frames[old.id] ||= {})[key] = fieldDigest(old[key]);
}
const priorIds = new Set(priorFrames.map(f => f.id));
const out = {
  note: "Scene 6 (the interview room) rewrite of 2 October 2026. priorScriptHash and the per-field digests are of the default text before it; bundle-refresh replaces a field only when the saved value still matches.",
  priorScriptHash: digest(prior.script),
  newFrameIds: [...nextFrames.keys()].filter(id => !priorIds.has(id)),
  frames,
};
writeFileSync(resolve(root, "src/lib/neonoire-scene6-sync.json"), JSON.stringify(out, null, 2) + "\n");
writeFileSync(resolve(root, "docs/neonoire/baseline/scene6-pre-rewrite-2026-10-02.json"), JSON.stringify({ note: "The default script and scene 6 frames before the 2 October 2026 rewrite of the interview room; replayed by verify-revision-restoration.", script: prior.script, frames: priorFrames }) + "\n");
console.log(`${Object.keys(frames).length} changed frames, ${out.newFrameIds.length} new, prior script ${out.priorScriptHash.slice(0, 12)}`);
