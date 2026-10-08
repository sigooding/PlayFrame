// Writes src/lib/neonoire-text-sync.json: the fingerprints that let a saved workspace take corrected shot wording, a corrected running
// order inside a scene and a changed line of the screenplay, without touching anything the writer changed.
//
//   git show <commit before the change>:public/projects/neonoire-opening.json > /tmp/prior.json
//   node scripts/neonoire/sync-text.mjs /tmp/prior.json [/tmp/older-prior.json ...]
//
// For every bundle frame whose title, description or notes differ from a prior bundle's, the digest of the prior value is recorded;
// bundle-refresh replaces that field only while the saved value still matches one of the recorded digests. For every scene whose
// frames ran in another order, the prior order is recorded; a saved scene still in exactly that order takes the bundle's. For every
// prior bundle whose screenplay differs, its script digest is recorded, so a workspace still on that text takes the new one and is
// otherwise treated as current. Earlier entries are kept: a field changed twice keeps both digests (a workspace may hold either).
// Recorded dialogue has its own fingerprints (scripts/neonoire/sync-voices.mjs).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const digest = text => createHash("sha256").update(text).digest("hex");
const fieldDigest = value => digest(JSON.stringify(value ?? null));
const FIELDS = ["title", "description", "notes"];
const priors = process.argv.slice(2).map(file => JSON.parse(readFileSync(resolve(file), "utf8")));
if (!priors.length) throw new Error("Usage: node scripts/neonoire/sync-text.mjs <prior bundle json> [...]");
const next = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const now = new Map(next.frames.map(frame => [frame.id, frame]));
const syncFile = resolve(root, "src/lib/neonoire-text-sync.json");
const earlier = existsSync(syncFile) ? JSON.parse(readFileSync(syncFile, "utf8")) : { priorScriptHashes: [], frames: {}, sceneOrders: {} };
const priorScriptHashes = [...earlier.priorScriptHashes];
const frames = structuredClone(earlier.frames);
const sceneOrders = structuredClone(earlier.sceneOrders);
const order = (bundle, sceneId) => bundle.frames.filter(frame => frame.sceneId === sceneId).map(frame => frame.id);

for (const prior of priors) {
  const hash = digest(prior.script);
  if (prior.script !== next.script && !priorScriptHashes.includes(hash)) priorScriptHashes.push(hash);
  for (const old of prior.frames) {
    const frame = now.get(old.id);
    if (!frame) continue;
    for (const key of FIELDS) {
      if (JSON.stringify(old[key] ?? null) === JSON.stringify(frame[key] ?? null)) continue;
      const known = frames[old.id]?.[key] ?? [];
      const value = fieldDigest(old[key]);
      if (!known.includes(value)) frames[old.id] = { ...frames[old.id], [key]: [...known, value] };
    }
  }
  for (const scene of next.scenes) {
    const was = order(prior, scene.id), is = order(next, scene.id);
    if (!was.length || JSON.stringify(was) === JSON.stringify(is)) continue;
    if ([...was].sort().join() !== [...is].sort().join()) continue; // frames added or removed: not a reordering
    const known = sceneOrders[scene.id] ?? [];
    if (!known.some(ids => JSON.stringify(ids) === JSON.stringify(was))) sceneOrders[scene.id] = [...known, was];
  }
}

writeFileSync(syncFile, JSON.stringify({
  note: "Corrected shot wording and running order (9 October 2026: scenes 1 and 2's descriptions and titles rewritten to the pictures and the current screenplay; shot 24 moved before the two shots, with the journalist's \"Where is he?\" over it) and the screenplay line of 8 October (scene 86). frames holds, per field, the digests of the values earlier bundles shipped; sceneOrders the frame orders earlier bundles shipped per scene; priorScriptHashes the earlier default screenplays. bundle-refresh replaces a field, a scene's order or the script only while the saved one still matches.",
  priorScriptHashes,
  frames,
  sceneOrders,
}, null, 2) + "\n");
console.log(`${Object.keys(frames).length} frames with corrected text, ${Object.keys(sceneOrders).length} scene order(s), ${priorScriptHashes.length} earlier screenplay(s)`);
