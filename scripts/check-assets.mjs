// Verifies every /images/... and /fonts/... path referenced in src exists under public/.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const refs = new Set();
const walk = dir => { for (const name of readdirSync(dir)) { const p = join(dir, name); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css|json)$/.test(name)) { const text = readFileSync(p, "utf8"); for (const m of text.matchAll(/["'(]\/(images|fonts)\/([^"')\s]+)["')]/g)) refs.add(`/${m[1]}/${m[2]}`); } } };
walk(join(root, "src"));
if (existsSync(join(root, "public", "projects"))) walk(join(root, "public", "projects"));

/** Read the retired-image map out of lib/image.ts so its keys are not reported as missing files. */
function legacyImages() {
  const text = readFileSync(join(root, "src", "lib", "image.ts"), "utf8");
  const block = /const RETIRED_IMAGES[\s\S]*?\n\};/.exec(text)?.[0] || "";
  return new Set([...block.matchAll(/"([^"]+)":\s*"/g)].map(m => m[1]));
}

// Photos the UI can live without: the lighting library falls back to a colour swatch per look.
const optional = f => /^\/images\/lighting\//.test(f);
// Paths that only exist so older projects keep working (lib/image.ts maps them to live files).
const legacy = legacyImages();
const missing = [...refs].filter(r => !r.endsWith("/") && !existsSync(join(root, "public", r)) && !optional(r) && !legacy.has(r));
const missingOptional = [...refs].filter(r => optional(r) && !existsSync(join(root, "public", r)));
const present = refs.size - missing.length - [...refs].filter(r => r.endsWith("/")).length;
console.log(`Checked ${present + missing.length} asset references — ${present} present, ${missing.length} missing.`);
if (missing.length) {
  console.log("\nMissing files (add them to public/):");
  for (const m of missing) console.log("  " + m);
  console.log("\nIf you cloned this from GitHub, the public/images folder was probably not uploaded. See README.md → \"If images don't appear\".");
  process.exit(1);
}
if (missingOptional.length) {
  console.log(`\nOptional, not on disk (the UI falls back to a colour swatch): ${missingOptional.length}`);
  for (const m of missingOptional) console.log("  " + m);
}
console.log("All good — every required image and font is on disk.");
