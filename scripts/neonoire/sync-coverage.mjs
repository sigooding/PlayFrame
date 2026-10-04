// Writes src/lib/neonoire-coverage-sync.json: the fingerprints that let a saved workspace on a known
// default text receive the long-hold passes (344–363), the first relief pass (364–368), and this
// second coverage pass (369–376) without touching anything the writer has edited. These are added
// frames, not a script rewrite, so the gate is a
// script digest that is still one of the shipped defaults, and the arrival rule is all-or-nothing: a
// workspace that already holds any of a batch has had them (and one the director deleted stays deleted);
// a workspace whose script was edited gets none of them.
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
// Coverage batches this module carries. Each batch is an all-or-nothing arrival in bundle order.
const batch1 = Array.from({ length: 10 }, (_, i) => `neonoire-shot-${344 + i}`);
const batch2 = Array.from({ length: 10 }, (_, i) => `neonoire-shot-${354 + i}`);
const batch3 = Array.from({ length: 5 }, (_, i) => `neonoire-shot-${364 + i}`);
const batch4 = Array.from({ length: 8 }, (_, i) => `neonoire-shot-${369 + i}`);
const newFrameIds = [...batch1, ...batch2, ...batch3, ...batch4];
for (const id of newFrameIds) {
  if (!next.frames.some(frame => frame.id === id)) throw new Error(`${id} is not in the current bundle`);
}
const out = {
  note: "Coverage added 4 October 2026 (344–363 long-hold frames, 364–368 relief frames, and 369–376 second-pass frames) without a script change. A saved workspace still on a known default text that holds none of a batch receives that whole batch at its bundle positions; a workspace that already holds any frame in that batch, or whose script was edited, is left alone.",
  priorScriptHashes: [...new Set([...scene6Sync.priorScriptHashes, digest(next.script)])],
  newFrameIds,
  batches: [batch1, batch2, batch3, batch4],
};
writeFileSync(resolve(root, "src/lib/neonoire-coverage-sync.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`${newFrameIds.length} coverage frames fingerprinted against ${out.priorScriptHashes.length} known defaults across ${out.batches.length} batches`);
