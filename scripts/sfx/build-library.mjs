// Builds the shared sound-effect library (NEONOIRE, the Hangar cold open, the Rapture) from docs/sfx/library-source.json:
// for every new effect, picks the strongest measured ElevenLabs variation from public/audio/sfx/alternates/<id>--v<N>.mp3, levels it (hits to a peak of
// -3 dBFS, loops to an average of -24 dB, never lifting more than 14 dB) with a short fade-out and writes public/audio/sfx/<id>.mp3; then writes docs/sfx/library.json (every effect, its file, length,
// the projects it fits and where, and the generation it came from) and the listening page public/audio/sfx/index.html.
//
//   FFMPEG=/path/to/ffmpeg node scripts/sfx/build-library.mjs
//
// The alternates are never touched. Re-running rebuilds the leveled files from them.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../../..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const source = JSON.parse(readFileSync(resolve(root, "docs/sfx/library-source.json"), "utf8"));
const generations = JSON.parse(readFileSync(resolve(root, "docs/sfx-generations-2026-10-08.json"), "utf8"));
const run = args => spawnSync(ffmpeg, args, { encoding: "utf8", maxBuffer: 1 << 26 });
const duration = file => { const r = run(["-i", file, "-f", "null", "-"]); const t = /time=(\d+):(\d+):([\d.]+)/g; let m, last; while ((m = t.exec(r.stderr))) last = m; return last ? Math.round((+last[1] * 3600 + +last[2] * 60 + +last[3]) * 100) / 100 : 0; };
const peak = file => { const r = run(["-i", file, "-af", "volumedetect", "-f", "null", "-"]); const m = /max_volume: (-?[\d.]+) dB/.exec(r.stderr); return m ? Number(m[1]) : null; };

const mean = file => { const r = run(["-i", file, "-af", "volumedetect", "-f", "null", "-"]); const m = /mean_volume: (-?[\d.]+) dB/.exec(r.stderr); return m ? Number(m[1]) : null; };
const WEAK_PEAK = -25;   // a take whose loudest moment is quieter than this is mostly room noise: it is never picked while another take is louder
const MAX_BOOST = 14;    // dB; leveling never lifts a take further than this, so a weak take stays visibly weak instead of becoming hiss
const LOOP_MEAN = -24;   // dB; loops and ambiences are leveled by their average, hits by their peak

const effects = [];
for (const e of source.new) {
  const takes = [1, 2, 3, 4].map(n => ({ n, file: resolve(root, `public/audio/sfx/alternates/${e.id}--v${n}.mp3`) })).filter(t => existsSync(t.file))
    .map(t => ({ ...t, peak: peak(t.file), mean: mean(t.file), duration: duration(t.file) }));
  if (!takes.length) { effects.push({ ...e, file: null, status: "not generated yet" }); continue; }
  // the pick is measured, not heard: among takes that are not mostly silence, the one with the most energy over its length
  const usable = takes.filter(t => t.peak !== null && t.peak > WEAK_PEAK);
  const best = (usable.length ? usable : takes).reduce((a, b) => (b.mean > a.mean ? b : a));
  const out = resolve(root, `public/audio/sfx/${e.id}.mp3`);
  const byPeak = -3 - best.peak, byMean = LOOP_MEAN - best.mean;
  const gain = Math.min(MAX_BOOST, e.loop ? Math.min(byPeak, byMean) : byPeak);
  const fade = e.loop ? "" : `,afade=t=out:st=${Math.max(0, best.duration - 0.04)}:d=0.04`;
  const r = run(["-v", "error", "-y", "-i", best.file, "-af", `volume=${gain}dB${fade}`, "-c:a", "libmp3lame", "-q:a", "2", out]);
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${e.id}: ${r.stderr}`);
  const g = generations[`${e.id}--v${best.n}`];
  effects.push({
    id: e.id, title: e.title, file: `/audio/sfx/${e.id}.mp3`, duration: duration(out), loop: !!e.loop, pick: `v${best.n}`, gainDb: Math.round(gain * 10) / 10,
    sourcePeakDb: best.peak, sourceMeanDb: best.mean, peakDb: peak(out), meanDb: mean(out), weak: best.peak <= WEAK_PEAK || gain >= MAX_BOOST,
    projects: e.projects, prompt: g?.prompt ?? null, generation: g ? { flow: g.flow, session: g.session, id: g.generation } : null,
    alternates: takes.map(t => `/audio/sfx/alternates/${e.id}--v${t.n}.mp3`),
    source: "new",
  });
}
for (const e of source.reused) {
  const file = resolve(root, "public" + e.file);
  if (!existsSync(file)) throw new Error(`${e.file} is not on disk`);
  effects.push({ id: e.id, title: e.title, file: e.file, duration: duration(file), loop: false, projects: e.projects, source: "neonoire" });
}
const projects = ["neonoire", "hangar", "rapture"];
const library = {
  generated: "2026-10-08", note: source.note, model: "eleven_text_to_sound_v2", flow: "ZP4ByZuSmCPZ2E7b8XKB", projects,
  counts: Object.fromEntries(projects.map(p => [p, effects.filter(e => e.file && p in e.projects).length])),
  effects,
};
writeFileSync(resolve(root, "docs/sfx/library.json"), JSON.stringify(library, null, 1) + "\n");

const data = JSON.stringify(library).replace(/<\//g, "<\\/");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shared sound effects</title>
<style>
:root{--bg:#f7f5f0;--fg:#1d1b17;--muted:#6b665c;--line:#d9d4c8;--card:#fffdf8;--accent:#7a3b12;--chip:#ece6d8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#16140f;--fg:#ece7da;--muted:#9a9384;--line:#35302a;--card:#1e1b15;--accent:#e0a36a;--chip:#2b261d}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 Georgia,serif}main{max-width:960px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:1.6rem;margin:0 0 4px}.muted{color:var(--muted)}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0}
.chip{display:inline-block;background:var(--chip);border-radius:99px;padding:1px 9px;font:.78rem system-ui,sans-serif;color:var(--muted);margin:0 4px 2px 0}
button.f{font:600 .85rem system-ui,sans-serif;border:1px solid var(--accent);background:transparent;color:var(--accent);border-radius:8px;padding:5px 12px;margin:0 6px 6px 0;cursor:pointer}
button.f.on{background:var(--accent);color:var(--bg)}audio{width:100%;height:34px}h3{margin:0 0 4px;font-size:1.02rem}ul{margin:6px 0 0;padding-left:18px;font:.88rem system-ui,sans-serif}
</style></head><body><main>
<h1>Shared sound effects</h1>
<p class="muted">NEONOIRE, the Hangar cold open and the Rapture draw on one library, so an effect made for one story is there for the others. <strong>Nobody has listened to the new ones.</strong> The filter shows what fits each story; each card says where.</p>
<div id="filters"></div><div id="list"></div></main>
<script id="data" type="application/json">${data}</script>
<script>
const L=JSON.parse(document.getElementById("data").textContent);const names={neonoire:"NEONOIRE",hangar:"Hangar (untitled)",rapture:"Rapture"};
let cur="all";const $=(t,p={},...k)=>{const e=Object.assign(document.createElement(t),p);for(const x of k)e.append(x);return e};
function draw(){const f=document.getElementById("filters");f.replaceChildren();for(const k of ["all",...L.projects]){const b=$("button",{className:"f"+(k===cur?" on":""),textContent:(k==="all"?"All":names[k])+" ("+(k==="all"?L.effects.filter(e=>e.file).length:L.counts[k])+")"});b.onclick=()=>{cur=k;draw()};f.append(b)}
const list=document.getElementById("list");list.replaceChildren();
for(const e of L.effects){if(!e.file||(cur!=="all"&&!(cur in e.projects)))continue;const c=$("div",{className:"card"});c.append($("h3",{textContent:e.title}),$("span",{className:"chip",textContent:e.duration+" s"+(e.loop?" \\u00b7 loops":"")}),$("span",{className:"chip",textContent:e.source==="new"?"new, 8 Oct":"from NEONOIRE"}));
c.append($("audio",{controls:true,preload:"none",src:e.file.replace(/^\\/audio\\/sfx\\//,"")}));
const ul=$("ul");for(const p of L.projects)if(p in e.projects)ul.append($("li",{textContent:names[p]+": "+e.projects[p]}));c.append(ul);list.append(c)}}
draw();
</script></body></html>
`;
writeFileSync(resolve(root, "public/audio/sfx/index.html"), html);
console.log(`${effects.filter(e => e.file).length} effects (${effects.filter(e => e.source === "new" && e.file).length} new), ${Object.entries(library.counts).map(([k, v]) => `${k} ${v}`).join(", ")}`);
