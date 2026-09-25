// Splits the final screenplay (Neonoire (3).fountain) into the screenplay pages the Screenplay tab
// carries — one page per numbered scene, the opening seven boarded and the rest written.
//
// The draft at the repository root is the source of truth. Everything below a page's production
// header is the draft's own bytes, so `npm run build:neonoire` can prove the pages rebuild the
// fountain file exactly and a typo can never drift into the workspace unnoticed.
//
//   node scripts/neonoire/split-opening.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FOUNTAIN, featureScenes, pageBody, pageText, pages, readFountain } from "./plan.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fountain = readFountain(root);
const outDir = join(root, "docs", "neonoire", "screenplay");
mkdirSync(outDir, { recursive: true });

const split = pages(fountain);
const feature = featureScenes(fountain);
if (split.length !== feature.length) throw new Error(`Expected ${feature.length} scene slices, found ${split.length}`);
for (const [i, scene] of feature.entries()) {
  writeFileSync(join(outDir, scene.page), pageText(scene, split[i]));
  console.log(`wrote docs/neonoire/screenplay/${scene.page}${scene.boarded ? "" : "  (written, not boarded)"}`);
}

// The header is the only thing a page adds, so what is left has to be the draft itself —
// every line of it, in order, with the draft's own blank lines.
const rebuilt = feature.map(scene => pageBody(readFileSync(join(outDir, scene.page), "utf8"))).join("\n");
if (rebuilt !== fountain) {
  console.error(`The pages do not rebuild ${FOUNTAIN} — check the header format in plan.mjs.`);
  console.error(`\nExpected ${fountain.length} characters, rebuilt ${rebuilt.length}.`);
  process.exit(1);
}
console.log(`\n${feature.length} pages rebuild ${FOUNTAIN} exactly (${fountain.split("\n").length - 1} lines).`);
console.log(pageText(feature[0], split[0]).split("\n").slice(0, 4).join("\n"));
