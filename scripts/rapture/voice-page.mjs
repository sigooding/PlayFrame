// Renders public/audio/rapture/index.html: the cast (every voice design preview, the picked one marked, with its measurements) and the
// episode-one table read (every recorded line in screenplay order, scene by scene, with the pauses the page spells out).
//
//   node scripts/rapture/voice-page.mjs
//
// The page is static with its data embedded, so it opens from a checkout as well as from the site (/audio/rapture/). Paths in it are
// relative to the page. Levels: the browser cannot boost an <audio> element, so each voice is turned down to the level of the quietest
// voice (measured mean level of its takes) and the lines of a scene play at about the same loudness.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readEpisode, root } from "./voice-script.mjs";

const voices = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/voices.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/manifest.json"), "utf8"));
const plan = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/elevenlabs-plan-ep1.json"), "utf8"));
const pages = readEpisode(root).filter(page => page.lines.length);
// Episodes two to five: the twelve shot boards (docs/rapture/voice/manifest-scenes.json), played after episode one's pages.
const sceneManifest = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/manifest-scenes.json"), "utf8"));
const boards = JSON.parse(readFileSync(resolve(root, "docs/rapture/voice/elevenlabs-plan-scenes.json"), "utf8")).boards;

const rel = file => file.replace(/^\/audio\/rapture\//, "");
const meanBy = new Map();
for (const line of [...manifest.lines, ...sceneManifest.lines]) { const m = meanBy.get(line.voice) ?? []; m.push(line.rmsdb); meanBy.set(line.voice, m); }
const mean = voice => { const m = meanBy.get(voice); return m ? m.reduce((a, b) => a + b, 0) / m.length : null; };
const quietest = Math.min(...[...meanBy.keys()].map(mean));
const gain = {};
for (const voice of meanBy.keys()) gain[voice] = Math.round(10 ** ((quietest - mean(voice)) / 20) * 1000) / 1000;

const recorded = new Map(manifest.lines.map(l => [l.id, l]));
const data = {
  cast: Object.entries(voices.voices).map(([key, v]) => ({
    key, name: v.name, character: v.character, age: v.age, description: v.description, why: v.why, id: v.id,
    ...(v.standIn ? { standIn: v.standIn } : {}), ...(v.doubling ? { doubling: v.doubling } : {}), ...(v.note ? { note: v.note } : {}),
    lines: meanBy.get(key)?.length ?? 0, meanDb: mean(key) === null ? null : Math.round(mean(key) * 10) / 10,
    rounds: v.rounds.map(r => ({ ...(r.rejected ? { rejected: r.rejected } : {}), previews: r.previews.map(p => ({ file: p.file, picked: p.picked, hz: p.median_hz, range: Math.round(p.p90_hz - p.p10_hz), bright: p.centroid_hz, db: p.level_db })) })),
  })),
  scenes: pages.map(page => ({
    id: page.id, title: page.title, lines: page.lines.map(l => {
      const rec = recorded.get(l.id);
      const row = plan.lines.find(p => p.id === l.id);
      return { id: l.id, speaker: l.speaker, voice: row.voice, text: l.text, tag: row.tag, gap: l.gap, gapKind: l.gapKind, gapNote: l.gapNote || "", file: rec ? rel(rec.file) : null, duration: rec?.duration ?? null, db: rec?.rmsdb ?? null };
    }),
  })).concat(boards.map(board => ({
    id: board.id, title: board.title, lines: sceneManifest.lines.filter(l => l.page === board.id).map(l => (
      { id: l.id, speaker: l.speaker, voice: l.voice, text: l.text, tag: l.tag, gap: l.gap, gapKind: l.gapKind, gapNote: l.gapNote || "", file: rel(l.file), duration: l.duration, db: l.rmsdb }
    )),
  }))),
  gain, recorded: manifest.recorded + sceneManifest.recorded, planned: manifest.planned + sceneManifest.planned,
};
const json = JSON.stringify(data).replace(/<\//g, "<\\/");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Raptures Voices</title>
<style>
:root { --bg:#f7f5f0; --fg:#1d1b17; --muted:#6b665c; --line:#d9d4c8; --card:#fffdf8; --accent:#7a3b12; --chip:#ece6d8; --ok:#2f6b3a; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#16140f; --fg:#ece7da; --muted:#9a9384; --line:#35302a; --card:#1e1b15; --accent:#e0a36a; --chip:#2b261d; --ok:#7bc88a; } }
:root[data-theme="dark"] { --bg:#16140f; --fg:#ece7da; --muted:#9a9384; --line:#35302a; --card:#1e1b15; --accent:#e0a36a; --chip:#2b261d; --ok:#7bc88a; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.5 Georgia, "Iowan Old Style", serif; }
main { max-width:960px; margin:0 auto; padding:24px 16px 80px; }
h1 { font-size:1.7rem; margin:0 0 4px; } h2 { font-size:1.25rem; margin:36px 0 8px; border-top:1px solid var(--line); padding-top:20px; }
h3 { font-size:1.02rem; margin:22px 0 6px; }
p { margin:8px 0; } .muted { color:var(--muted); } code { background:var(--chip); padding:1px 5px; border-radius:4px; font-size:.88em; }
.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:12px 14px; margin:10px 0; }
.chip { display:inline-block; background:var(--chip); border-radius:99px; padding:1px 9px; font-size:.78rem; color:var(--muted); margin:0 4px 2px 0; font-family: system-ui, sans-serif; }
.chip.pick { background:var(--ok); color:#fff; }
.row { display:grid; grid-template-columns: 96px 1fr auto; gap:6px 12px; align-items:start; padding:7px 0; border-top:1px solid var(--line); }
.row:first-of-type { border-top:0; }
.who { font:600 .78rem system-ui, sans-serif; letter-spacing:.04em; text-transform:uppercase; padding-top:4px; }
.say { margin:0; } .tag { font:.8rem system-ui, sans-serif; color:var(--muted); }
.gap { font:.78rem system-ui, sans-serif; color:var(--accent); padding:2px 0 2px 108px; }
.previews { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:8px; margin-top:6px; }
.previews div { font:.8rem system-ui, sans-serif; } audio { width:100%; height:34px; }
button { font:600 .85rem system-ui, sans-serif; border:1px solid var(--accent); background:transparent; color:var(--accent); border-radius:8px; padding:5px 12px; cursor:pointer; }
button:hover { background:var(--accent); color:var(--bg); } button.on { background:var(--accent); color:var(--bg); }
.line.playing { background:var(--chip); } .pending { opacity:.55; }
@media (max-width:560px) { .row { grid-template-columns: 1fr; } .gap { padding-left:0; } }
</style>
</head>
<body>
<main>
<h1>Let the Raptures Commence: voices</h1>
<p class="muted">Episode one (the draft of 21 September 2026), then episodes two to five (the twelve shot boards, which carry their own dialogue). <span id="count"></span></p>
<p><strong>Nobody has listened to any of this.</strong> Every voice was designed from the show bible's cast text and picked <em>blind</em>, by measured pitch, range, brightness and pace. The cast section lists every preview of every voice so you can pick by ear; the table read plays the recorded lines in screenplay order with the pauses the script spells out (the rest are estimates). Jodie is a light young adult voice: the design tool refuses a child's. Episodes two to five add 14 characters; the workspace's 30 custom-voice slots were full, so they speak in ready-made ElevenLabs voices used as they are (picked blind from measured previews; the 16 designs made for them are auditions in <code>voices/eps2-5/</code>, never saved).</p>

<h2>Table read</h2>
<p class="muted">Press <em>Play scene</em>, or any line. Lines play at their place on the scene's timeline; the written pauses ("Four seconds of nothing", "An eight-second pause") are locked, the others are guesses for the action between lines.</p>
<div id="scenes"></div>

<h2>Cast</h2>
<div id="cast"></div>
</main>
<script id="data" type="application/json">${json}</script>
<script>
const D = JSON.parse(document.getElementById("data").textContent);
const $ = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); for (const k of kids) e.append(k); return e; };
document.getElementById("count").textContent = D.recorded + " of " + D.planned + " spoken lines recorded.";

// ---- table read
let timers = [], current = null, running = null;
const stopAll = () => { timers.forEach(clearTimeout); timers = []; if (current) { current.pause(); current = null; } document.querySelectorAll(".line.playing").forEach(e => e.classList.remove("playing")); document.querySelectorAll("button.on").forEach(b => { b.classList.remove("on"); b.textContent = b.dataset.label; }); running = null; };
function playLine(line, rowEl, done) {
  if (!line.file) { done && done(); return; }
  const a = new Audio(line.file); a.volume = Math.min(1, D.gain[line.voice] ?? 1); current = a;
  document.querySelectorAll(".line.playing").forEach(e => e.classList.remove("playing")); rowEl.classList.add("playing");
  a.onended = () => { rowEl.classList.remove("playing"); done && done(); }; a.play().catch(() => done && done());
}
for (const scene of D.scenes) {
  const box = $("div", { className: "card" });
  const total = scene.lines.reduce((t, l) => t + l.gap + (l.duration || 0), 0);
  const head = $("h3", {}, scene.id + "  " + scene.title);
  const btn = $("button", { textContent: "Play scene" }); btn.dataset.label = "Play scene";
  head.append(" ", btn, $("span", { className: "muted", textContent: "  about " + Math.round(total) + " s" }));
  box.append(head);
  const rows = [];
  for (const line of scene.lines) {
    if (line.gap >= 3 || line.gapKind === "written") box.append($("div", { className: "gap", textContent: line.gapKind === "written" ? "pause " + line.gap + " s (written: " + line.gapNote + ")" : "pause about " + line.gap + " s" }));
    const row = $("div", { className: "row line" + (line.file ? "" : " pending") });
    const play = $("button", { textContent: "\\u25B6" });
    play.onclick = () => { stopAll(); playLine(line, row); };
    const who = $("div", { className: "who", textContent: line.speaker.toLowerCase() });
    const say = $("div", {}, $("p", { className: "say", textContent: line.text }), $("span", { className: "tag", textContent: "[" + line.tag + "]" + (line.file ? "" : "  (not recorded yet)") }));
    row.append(who, say, play); box.append(row); rows.push([line, row]);
  }
  btn.onclick = () => {
    if (running === scene.id) { stopAll(); return; }
    stopAll(); running = scene.id; btn.classList.add("on"); btn.textContent = "Stop";
    let t = 0; const t0 = performance.now();
    for (const [line, row] of rows) {
      t += line.gap * 1000;
      const at = t; if (line.file) timers.push(setTimeout(() => playLine(line, row), Math.max(0, at - (performance.now() - t0) + 0)));
      t += (line.duration || 0) * 1000;
    }
    timers.push(setTimeout(stopAll, t + 300));
  };
  document.getElementById("scenes").append(box);
}

// ---- cast
for (const v of D.cast) {
  const box = $("div", { className: "card" });
  box.append($("h3", {}, v.name, $("span", { className: "muted", textContent: "   " + v.character + ", " + v.age + (v.lines ? "  \\u00b7  " + v.lines + " recorded lines" : "") })));
  box.append($("p", { textContent: v.description }));
  if (v.standIn) box.append($("p", { className: "muted", textContent: v.standIn }));
  if (v.doubling) box.append($("p", { className: "muted", textContent: v.doubling }));
  if (v.note) box.append($("p", { className: "muted", textContent: v.note }));
  box.append($("p", { className: "muted", textContent: "Picked blind: " + v.why + " Voice id " + v.id + "." }));
  v.rounds.forEach((r, ri) => {
    if (v.rounds.length > 1) box.append($("p", { className: "muted", textContent: r.rejected ? "Round " + (ri + 1) + " (not used): " + r.rejected : "Round " + (ri + 1) + ":" }));
    const grid = $("div", { className: "previews" });
    r.previews.forEach((p, i) => {
      const d = $("div");
      d.append($("span", { className: "chip" + (p.picked ? " pick" : ""), textContent: p.picked ? "in the game" : "preview " + (i + 1) }), $("span", { className: "chip", textContent: Math.round(p.hz) + " Hz, range " + p.range }), $("span", { className: "chip", textContent: "bright " + p.bright }));
      const a = $("audio", { controls: true, preload: "none", src: p.file }); d.append(a); grid.append(d);
    });
    box.append(grid);
  });
  document.getElementById("cast").append(box);
}
</script>
</body>
</html>
`;
writeFileSync(resolve(root, "public/audio/rapture/index.html"), html);
console.log(`Wrote public/audio/rapture/index.html (${data.scenes.length} scenes, ${data.cast.length} voices, ${data.recorded}/${data.planned} lines)`);
