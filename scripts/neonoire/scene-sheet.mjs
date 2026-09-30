// Printable worksheet: one block per scene with its number, heading, dialogue beats and recorded-voice status,
// plus a notes box. Reads the screenplay and the voice manifest; changes nothing.
//   node scripts/neonoire/scene-sheet.mjs   ->  exports/neonoire/scene-worksheet.html (print to PDF)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const lines = readFileSync(resolve(root, "Neonoire (3).fountain"), "utf8").split("\n");
const manifest = JSON.parse(readFileSync(resolve(root, "docs/neonoire/voice/manifest.json"), "utf8"));
const voiced = {};
for (const l of manifest.lines) { const s = l.id.split("-")[0].replace(/^s/, "").toUpperCase(); voiced[s] = (voiced[s] || 0) + 1; }

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const clip = (t, n = 9) => { const w = t.replace(/\s+/g, " ").trim().split(" "); return w.length > n ? w.slice(0, n).join(" ") + "…" : w.join(" "); };
const isCue = s => /^[A-Z][A-Z0-9 .'()\-\/]+$/.test(s) && !/^(INT|EXT|INT\.\/EXT)[. ]/.test(s) && s.length < 40 && !/#\d+[A-Z]?#/.test(s);

const scenes = [];
let cur = null;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim();
  const h = /^((?:INT|EXT|INT\.\/EXT)[. ].*?)\s*#(\d+[A-Z]?)#\s*$/.exec(l);
  if (h) { cur = { no: h[2], heading: h[1], beats: [], action: "" }; scenes.push(cur); continue; }
  if (!cur || !l) continue;
  if (isCue(l) && lines[i + 1]?.trim() && !/^[A-Z ]+\.?$/.test(lines[i + 1].trim())) {
    const who = l.replace(/\s*\(CONT'D\)|\s*\(V\.O\.\)|\s*\(O\.S\.\)|\s*\(ON TV\)/g, "").trim();
    let j = i + 1, said = [];
    while (lines[j]?.trim()) { const t = lines[j].trim(); if (!/^\(.*\)$/.test(t)) said.push(t); j++; }
    if (said.length) cur.beats.push(`${who}: ${clip(said.join(" "))}`);
    i = j;
  } else if (!cur.action && !/^\(/.test(l)) cur.action = clip(l, 22);
}

const css = `body{font:11pt/1.35 Georgia,serif;margin:14mm}h1{font-size:16pt;margin:0 0 2mm}p.sub{margin:0 0 6mm;color:#444;font-size:9.5pt}
.s{break-inside:avoid;border-top:1px solid #999;padding:2.5mm 0 3mm;display:grid;grid-template-columns:14mm 1fr 52mm;gap:4mm}
.n{font:bold 14pt Helvetica,Arial,sans-serif}.h{font:bold 10pt Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.02em}
.a{color:#555;font-size:9.5pt;margin:.5mm 0 1mm}.b{margin:0;padding-left:4mm;font-size:10pt}.st{font:9pt Helvetica,Arial,sans-serif;color:#333;margin-top:1mm}
.box{border:1px solid #aaa;min-height:16mm}.box b{font:8pt Helvetica,Arial,sans-serif;color:#777;display:block;padding:1mm}
@media print{body{margin:10mm}}`;
const html = `<!doctype html><meta charset="utf-8"><title>NEONOIRE scene worksheet</title><style>${css}</style>
<h1>NEONOIRE: scene worksheet</h1><p class="sub">${scenes.length} scenes. Dialogue beats are the first words of each speech. "Voiced" counts recorded lines in the animatic; silent scenes show none. Notes box is yours.</p>
${scenes.map(s => `<div class="s"><div class="n">${s.no}</div><div><div class="h">${esc(s.heading)}</div><div class="a">${esc(s.action)}</div>${s.beats.length ? `<ul class="b">${s.beats.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : `<div class="st">No dialogue.</div>`}<div class="st">${s.beats.length ? (voiced[s.no] ? `Voiced: ${voiced[s.no]} line(s)` : "Not yet voiced") : ""}</div></div><div class="box"><b>Changes</b></div></div>`).join("\n")}`;
mkdirSync(resolve(root, "exports/neonoire"), { recursive: true });
writeFileSync(resolve(root, "exports/neonoire/scene-worksheet.html"), html);
console.log(`${scenes.length} scenes, ${scenes.filter(s => s.beats.length).length} with dialogue`);
