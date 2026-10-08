// Renders the audition page of an alternates set from its index.json.
//
//   node scripts/neonoire/alternates-page.mjs 2026-10-08
//
// public/audio/neonoire/alternates/<set>/index.json lists every line (with the take in the game and its alternates) and every voice
// design; its title, heading, intro (HTML paragraphs), voicesIntro and footer fields are the page's text. The page itself is
// scripts/neonoire/alternates-page.template.html with that data embedded, so it opens from a checkout as well as from the site
// (/audio/neonoire/alternates/<set>/). The page's swap commands name the set (--set), so older sets keep working after a newer one is added.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const set = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(set || "")) { console.error("Usage: node scripts/neonoire/alternates-page.mjs <YYYY-MM-DD>"); process.exit(1); }
const dir = resolve(root, "public/audio/neonoire/alternates", set);
const index = JSON.parse(readFileSync(resolve(dir, "index.json"), "utf8"));
for (const need of ["title", "heading", "intro", "voicesIntro", "footer", "lines", "voices"]) if (!index[need]) { console.error(`index.json has no ${need}`); process.exit(1); }
const { title, heading, intro, voicesIntro, footer, ...data } = index;
// "</" inside the embedded JSON must not close the script element
const json = JSON.stringify(data).replace(/<\//g, "<\\/");
const page = readFileSync(resolve(root, "scripts/neonoire/alternates-page.template.html"), "utf8")
  .replace("{{TITLE}}", () => title)
  .replace("{{HEADING}}", () => heading)
  .replace("  {{INTRO}}", () => intro.map(p => `  <p>${p}</p>`).join("\n"))
  .replace("{{VOICES_INTRO}}", () => voicesIntro)
  .replace("{{FOOTER}}", () => footer)
  .replace("{{DATA}}", () => json);
writeFileSync(resolve(dir, "index.html"), page);
console.log(`Wrote ${resolve(dir, "index.html")} (${Object.keys(data.lines).length} lines, ${data.voices.length} voices)`);
