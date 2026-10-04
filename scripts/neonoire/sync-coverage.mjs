// Writes src/lib/neonoire-coverage-sync.json: the fingerprints that let a saved workspace on a known
// default text receive the long-hold pass's ten coverage frames (344–353, in scenes 20, 22 and 23)
// without touching anything the writer has edited — and without a rewrite: this pass adds frames to
// the film, it does not change a word of the script. So the gate is a script digest that is still one
// of the shipped defaults, and the arrival rule is all-or-nothing: a workspace that already holds any
// of the ten has had them (and one the director deleted stays deleted); a workspace whose script was
// edited gets none of them.
//
//   node scripts/neonoire/sync-coverage.mjs
//
// Deliberately separate from sync-scene6.mjs: that file is regenerated from the prior rewrite bundle
// and only knows scenes 1, 2, 6 and 14A, so re-running it would drop these ids. The handoff says not
// to re-run it; this module is written fresh each time a coverage pass adds numbered frames.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const digest = text => createHash("sha256").update(text).digest("hex");
const next = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const scene6Sync = JSON.parse(readFileSync(resolve(root, "src/lib/neonoire-scene6-sync.json"), "utf8"));
// The ten frames this module carries. Update this list only when a new coverage pass lands frames.
const newFrameIds = Array.from({ length: 10 }, (_, i) => `neonoire-shot-${344 + i}`);
for (const id of newFrameIds) {
  if (!next.frames.some(frame => frame.id === id)) throw new Error(`${id} is not in the current bundle`);
}
const out = {
  note: "Coverage added 4 October 2026 (the long-hold pass: 344–353, scenes 20, 22 and 23) without a script change. A saved workspace still on a known default text that holds none of the ten receives all ten at their bundle positions; a workspace that already holds any of them, or whose script was edited, is left alone.",
  priorScriptHashes: [...new Set([...scene6Sync.priorScriptHashes, digest(next.script)])],
  newFrameIds,
};
writeFileSync(resolve(root, "src/lib/neonoire-coverage-sync.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`${newFrameIds.length} coverage frames fingerprinted against ${out.priorScriptHashes.length} known defaults`);
