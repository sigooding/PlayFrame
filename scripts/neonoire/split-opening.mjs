// Splits Neonoire_Opening.fountain into the seven screenplay pages the Screenplay tab carries.
//
// The draft at the repository root is the source of truth. Everything below a page's production
// header is the draft's own bytes, so `npm run build:neonoire` can prove the pages rebuild the
// fountain file exactly and a typo can never drift into the workspace unnoticed.
//
//   node scripts/neonoire/split-opening.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, pageBody, pageText, ORDER, readFountain, SCENES, pageHeader } from "./plan.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fountain = readFountain(root);
const outDir = join(root, "docs", "neonoire", "screenplay");
mkdirSync(outDir, { recursive: true });

const split = pages(fountain);
for (const [i, scene] of SCENES.entries()) {
  const file = ORDER[i];
  writeFileSync(join(outDir, file), pageText(scene, split[i]));
  console.log(`wrote docs/neonoire/screenplay/${file}`);
}

// The header is the only thing a page adds, so what is left has to be the draft itself.
const rebuilt = SCENES.map((scene, i) => pageBody(pageText(scene, split[i]))).join("\n\n") + "\n";
if (rebuilt !== fountain) {
  console.error("The pages do not rebuild Neonoire_Opening.fountain — check the header format in plan.mjs.");
  console.error(`\nExpected ${fountain.length} characters, rebuilt ${rebuilt.length}.`);
  process.exit(1);
}
console.log(`\n7 pages rebuild Neonoire_Opening.fountain exactly (${fountain.split("\n").length - 1} lines).`);
console.log(pageHeader(SCENES[0]).split("\n").slice(0, 4).join("\n"));
