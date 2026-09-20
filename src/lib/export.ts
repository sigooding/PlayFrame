import type { FilmProject } from "./types";
import { actOf, kindOf, partOf } from "./structure";
import { relationLines, relationNoun } from "./relations";

export const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "film";

export function downloadFile(content: string, filename: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function shotListCsv(project: FilmProject): string {
  const escape = (value: string | number) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Shot", "Act", "Sequence", "Scene", "Kind", "Title", "Description", "Shot type", "Camera angle", "Lens", "Camera movement", "Lighting", "Lighting direction", "Cut in", "Duration (s)", "Duration is estimate", "Cast", "Relationships", "Mood", "Status", "Production notes"],
    ...project.frames.map((frame, i) => {
      const scene = project.scenes.find(s => s.id === frame.sceneId);
      const act = scene ? actOf(project, scene) : undefined;
      const part = scene ? partOf(project, scene) : undefined;
      return [
        i + 1, act?.title || "", part?.title || "", scene?.location || "Unassigned", scene ? kindOf(scene) : "",
        frame.title, frame.description, frame.shotType, frame.angle || "Eye level", frame.lens || "", frame.movement,
        frame.lighting || scene?.lighting || "", frame.lightingNotes || scene?.lightingNotes || "", frame.transition || "Cut", frame.duration, frame.durationIsEstimate ? "Yes" : "No",
        (frame.characters || []).map(id => project.characters.find(c => c.id === id)?.name).filter(Boolean).join(" / "),
        relationLines(project, frame.characters || [], 6).join(" / "),
        frame.mood || "", frame.status, frame.notes,
      ];
    }),
  ];
  return "\uFEFF" + rows.map(row => row.map(escape).join(",")).join("\r\n");
}

export function exportShotList(project: FilmProject) {
  downloadFile(shotListCsv(project), `${slugify(project.title)}-shot-list.csv`, "text/csv;charset=utf-8;");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export type PrintKind = "storyboard" | "script" | "look";

export function printProject(project: FilmProject, kind: PrintKind = "storyboard") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("Allow pop-ups to open the print-ready document.");
  const sceneLabel = (sceneId: string) => {
    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) return "Unassigned";
    const act = actOf(project, scene);
    return `${act ? `${act.title} · ` : ""}${scene.location} — ${scene.time}`;
  };

  const frames = project.frames.map((frame, i) => {
    const visual = frame.image
      ? `<img src="${escapeHtml(frame.image.startsWith("/") ? `${window.location.origin}${frame.image}` : frame.image)}" alt="${escapeHtml(frame.title)}" />`
      : `<div class="missing-frame">Keyframe missing — this card holds the numbered slot</div>`;
    return `<article>${visual}<div class="card-content"><small>FRAME ${String(i + 1).padStart(2, "0")} · ${escapeHtml(sceneLabel(frame.sceneId))}</small><h3>${escapeHtml(frame.title)}</h3><p>${escapeHtml(frame.description)}</p><footer>${escapeHtml(frame.shotType)} · ${escapeHtml(frame.angle || "Eye level")}${frame.lens ? ` · ${escapeHtml(frame.lens)}` : ""} · ${escapeHtml(frame.movement)} · ${frame.durationIsEstimate ? "~" : ""}${frame.duration}s${frame.transition && frame.transition !== "Cut" ? ` · ${escapeHtml(frame.transition)}` : ""}</footer>${frame.notes ? `<p class="note">${escapeHtml(frame.notes)}</p>` : ""}</div></article>`;
  }).join("");

  const boards = project.moodboards.map(board => {
    const items = board.items.map(item => {
      const src = item.image.startsWith("/") ? `${window.location.origin}${item.image}` : item.image;
      return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(item.caption || board.title)}" />${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}</figure>`;
    }).join("");
    return `<section class="board"><h3>${escapeHtml(board.title)}</h3>${board.description ? `<p>${escapeHtml(board.description)}</p>` : ""}<div class="mosaic">${items}</div></section>`;
  }).join("");

  const cast = project.characters.map(c => {
    const links = (c.relations || []).map(r => {
      const target = project.characters.find(o => o.id === r.targetId);
      return target ? `${escapeHtml(target.name)} is ${escapeHtml(c.name)}'s ${escapeHtml(relationNoun[r.kind])}${r.note ? ` (${escapeHtml(r.note)})` : ""}` : "";
    }).filter(Boolean);
    return `<div class="person"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}${c.age ? ` · ${escapeHtml(c.age)}` : ""}</span><p>${escapeHtml(c.description)}${c.traits.length ? ` Traits: ${escapeHtml(c.traits.join(", "))}.` : ""}</p>${links.length ? `<p class="links">${links.join(" · ")}</p>` : ""}</div>`;
  }).join("");

  const structure = project.acts.map((act, i) => {
    const scenes = project.scenes.filter(s => s.actId === act.id);
    return `<div class="actblock"><h4>Act ${["I", "II", "III", "IV", "V", "VI"][i] || i + 1} — ${escapeHtml(act.title)}</h4>${act.description ? `<p>${escapeHtml(act.description)}</p>` : ""}${act.parts?.length ? `<ul>${act.parts.map(p => `<li><strong>${escapeHtml(p.title)}</strong>${p.description ? ` — ${escapeHtml(p.description)}` : ""} (${scenes.filter(s => s.partId === p.id).length} scenes)</li>`).join("")}</ul>` : ""}<p class="scenes">${scenes.map((s, j) => `${j + 1}. ${escapeHtml(s.location)}`).join(" · ")}</p></div>`;
  }).join("");

  const cold = project.scenes.filter(s => s.kind === "Cold open");
  const body = kind === "script"
    ? `<pre>${escapeHtml(project.script)}</pre>`
    : kind === "look"
      ? `${cold.length ? `<section class="board"><h3>Cold open</h3><p>${escapeHtml(cold.map(s => s.title).join(", "))}</p></section>` : ""}${structure ? `<section class="board"><h3>Structure</h3>${structure}</section>` : ""}${boards || `<section class="board"><h3>Mood boards</h3><p>No boards yet.</p></section>`}${cast ? `<section class="board"><h3>Cast</h3><div class="people">${cast}</div></section>` : ""}`
      : `<div class="grid">${frames}</div>`;

  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(project.title)} — ${kind === "script" ? "Screenplay" : kind === "look" ? "Look book" : "Storyboard"}</title><style>
@page{size:${kind === "script" ? "A4 portrait" : "A4 landscape"};margin:${kind === "script" ? "18mm" : "12mm"}}
*{box-sizing:border-box}body{font:13px system-ui,sans-serif;color:#263b2f;margin:35px}
header{display:flex;justify-content:space-between;align-items:end;border-bottom:1px solid #deded5;padding-bottom:22px;margin-bottom:26px}
h1{font:42px Georgia,serif;margin:0 0 8px}header p{margin:0;color:#74786e}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
article{border:1px solid #deded5;border-radius:7px;overflow:hidden;break-inside:avoid}
article img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
.missing-frame{display:flex;align-items:center;justify-content:center;min-height:120px;background:#eef1e7;color:#6f8360;font-size:11px;padding:20px;text-align:center}
.card-content{padding:13px}small{font-size:9px;letter-spacing:1px;color:#73776d}
h3{font-size:14px;margin:9px 0}h2{font-size:18px}p{line-height:1.6}
footer{padding-top:10px;border-top:1px solid #eee;font-size:10px}
.note{font-size:10px;color:#73776d}
.board{break-inside:avoid;margin-bottom:24px}.board>h3{font:26px Georgia,serif;margin:0 0 6px}.board>p{font-size:11px;color:#66715c;margin:0 0 12px}
.mosaic{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}figure{margin:0}figure img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:5px;display:block}
figcaption{font-size:9px;color:#6c7565;margin-top:5px}
.people{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.person{border:1px solid #e0e4da;border-radius:6px;padding:12px}.person strong{display:block;font-size:14px}.person span{font-size:10px;color:#767f6d}.person p{font-size:10px;margin-top:6px}.person .links{color:#41613f;border-top:1px solid #e6eadd;padding-top:5px}
.actblock{border-left:2px solid #d8ded0;padding:2px 0 2px 12px;margin-bottom:12px}.actblock h4{margin:0;font-size:13px}.actblock p,.actblock li{font-size:10px;color:#6c7565}.actblock ul{margin:4px 0;padding-left:16px}.scenes{margin-top:4px}
pre{max-width:650px;margin:40px auto;white-space:pre-wrap;font:12pt/1.6 'Courier New',monospace}
.print-button{position:fixed;right:24px;bottom:24px;border:0;background:#294c3c;color:white;border-radius:6px;padding:14px 24px;cursor:pointer}
@media print{body{margin:0}.print-button{display:none}.grid{gap:12px}}
</style></head><body><header><div><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description)}</p></div><div>frame. / ${kind === "script" ? "Screenplay" : kind === "look" ? "Look book" : "Storyboard"}</div></header>${body}<button class="print-button" onclick="window.print()">Print / Save as PDF</button></body></html>`);
  printWindow.document.close();
  printWindow.focus();
}
