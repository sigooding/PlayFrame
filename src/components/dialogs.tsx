"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Images, UserRound, Check, CheckCheck, Info, ListOrdered, Sparkles, Clapperboard, Clipboard, Download, FileJson, FileText, Film, Globe2, LayoutGrid, Link2, LoaderCircle, LockKeyhole, MessageSquare, Plus, Search, ShieldCheck, SunMedium, Table2, Trash2, WandSparkles } from "lucide-react";
import { Field, Modal } from "./ui";
import { LightingPicker } from "./lighting-picker";
import { downloadFile, exportShotList, printProject, slugify } from "@/lib/export";
import type { Act, ActPart, FilmProject, ProjectNote, Scene, SceneKind, StoryFrame } from "@/lib/types";
import { kindMeta, sceneKinds } from "@/lib/structure";
import { onImageError } from "@/lib/image";
import { PromptStudio } from "./prompt-studio";

type ProjectInput = { title: string; description: string; genre: string; format: string; template: string };
export function ProjectDialog({ project, template, onClose, onSave, onDelete }: { project?: FilmProject; template?: string; onClose: () => void; onSave: (input: ProjectInput) => Promise<boolean>; onDelete?: () => void }) {
  const [draft, setDraft] = useState<ProjectInput>({ title: project?.title || "", description: project?.description || "", genre: project?.genre || (template === "documentary" ? "Documentary" : "Drama"), format: project?.format || (template === "documentary" ? "Documentary" : template === "feature-film" ? "Feature film" : "Short film"), template: template === "short-film" ? "short-film" : "blank" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <Modal title={project ? "The big picture" : "Every great story starts here."} subtitle={project ? "A few details to keep your production in focus." : "Give your next film a place to take shape."} onClose={onClose}><form onSubmit={async e => { e.preventDefault(); if (!draft.title.trim()) return; setBusy(true); if (await onSave({ ...draft, title: draft.title.trim() })) onClose(); else setError("We couldn't save your project. Please try again."); setBusy(false); }}><div className="modal-body form-stack"><Field label="Project title"><input autoFocus required maxLength={180} placeholder="A working title is a perfect start" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Logline" hint="The heart of your story, in one sentence."><textarea rows={3} placeholder="A story about..." value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></Field><div className="fields-row"><Field label="Format"><select value={draft.format} onChange={e => setDraft({ ...draft, format: e.target.value })}><option>Short film</option><option>Feature film</option><option>Documentary</option><option>Music video</option><option>Commercial</option><option>Series</option></select></Field><Field label="Genre"><select value={draft.genre} onChange={e => setDraft({ ...draft, genre: e.target.value })}><option>Drama</option><option>Comedy</option><option>Thriller</option><option>Documentary</option><option>Coming of age</option><option>Sci-fi</option><option>Romance</option><option>Horror</option><option>Adventure</option><option>Other</option></select></Field></div>{!project && <Field label="Starting point"><select value={draft.template} onChange={e => setDraft({ ...draft, template: e.target.value })}><option value="blank">A blank canvas</option><option value="short-film">Three-act short film template</option></select></Field>}{template && !project && <div className="field-tip"><WandSparkles size={18} /><p>Your screenplay starts with standard scene formatting, ready for your words.</p></div>}{error && <p className="form-error">{error}</p>}</div><div className="modal-footer">{project && onDelete ? <button type="button" className="button button-ghost danger-text footer-left" onClick={onDelete}><Trash2 size={15} />Delete project</button> : <div className="footer-left" />}<button type="button" className="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? <LoaderCircle size={16} className="spin" /> : !project ? <Plus size={16} /> : null}{project ? "Save details" : "Create project"}</button></div></form></Modal>;
}

export function SceneDialog({ scene, characters = [], acts = [], defaultActId, onClose, onSave, onManageActs }: { scene?: Scene; characters?: import("@/lib/types").Character[]; acts?: Act[]; defaultActId?: string; onClose: () => void; onSave: (scene: Scene) => Promise<boolean>; onManageActs?: () => void }) {
  const [draft, setDraft] = useState<Scene>(scene || { id: crypto.randomUUID(), title: "", location: "EXT. ", time: "DAY", description: "", characters: [], actId: defaultActId, kind: "Standard" });
  const selectedAct = acts.find(a => a.id === draft.actId);
  const parts = selectedAct?.parts || [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <Modal title={scene ? "Shape the scene" : "Set the scene."} subtitle="A place, a moment, and something worth telling." onClose={onClose}><form onSubmit={async e => { e.preventDefault(); setBusy(true); if (await onSave(draft)) onClose(); else setError("The scene couldn't be saved. Please try again."); setBusy(false); }}><div className="modal-body form-stack"><Field label="Scene title"><input required maxLength={300} placeholder="The moment everything changes" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field><div className="fields-row"><Field label="Location"><input required maxLength={300} placeholder="EXT. COASTAL ROAD" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value.toUpperCase() })} /></Field><Field label="Time of day"><select value={draft.time} onChange={e => setDraft({ ...draft, time: e.target.value })}><option>DAY</option><option>NIGHT</option><option>DAWN</option><option>MORNING</option><option>DUSK</option><option>SUNSET</option><option>CONTINUOUS</option></select></Field></div><Field label="Scene type" hint={draft.kind && draft.kind !== "Standard" ? kindMeta[draft.kind].note : "Most scenes are standard. A cold open runs before the titles."}><div className="kind-row"><select value={draft.kind || "Standard"} onChange={e => setDraft({ ...draft, kind: e.target.value as SceneKind })}>{sceneKinds.map(k => <option key={k}>{k}</option>)}</select>{(draft.kind || "Standard") !== "Standard" && <span className={`kind-badge kind-${kindMeta[(draft.kind || "Standard") as SceneKind].tone}`}>{draft.kind}</span>}</div></Field><div className="field"><span>Default lighting for this scene</span><LightingPicker value={draft.lighting} onChange={lighting => setDraft({ ...draft, lighting })} /><small className="chip-hint">New shots in this scene start with this light. Any shot can override it on the Shot design tab.</small></div>{(acts.length > 0 || onManageActs) && <Field label="Act" hint={acts.length ? undefined : "Group scenes into acts to shape the structure of your story."}><div className="act-select-row"><select value={draft.actId || ""} onChange={e => setDraft({ ...draft, actId: e.target.value || undefined })}><option value="">No act</option>{acts.map((act, i) => <option key={act.id} value={act.id}>{["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][i] || i + 1} · {act.title}</option>)}</select>{parts.length > 0 && <select aria-label="Sequence" value={draft.partId || ""} onChange={e => setDraft({ ...draft, partId: e.target.value || undefined })}><option value="">Whole act</option>{parts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>}{onManageActs && <button type="button" className="button" onClick={onManageActs}><ListOrdered size={14} />Acts & sequences</button>}</div><small className="act-hint">{selectedAct ? `Part of ${selectedAct.title}` : "Assign an act to shape the structure"}</small></Field>}<Field label="Scene summary"><textarea rows={4} placeholder="What happens? What changes?" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></Field>{characters.length > 0 && <div className="field"><span>Who appears in this scene?</span><div className="chip-row">{characters.map(c => { const active = (draft.characters || []).includes(c.id); return <button key={c.id} type="button" className={`chip chip-toggle ${active ? "chip-active" : ""}`} onClick={() => setDraft({ ...draft, characters: active ? (draft.characters || []).filter(id => id !== c.id) : [...(draft.characters || []), c.id] })}>{c.name}{active && <Check size={12} />}</button>; })}</div></div>}{error && <p className="form-error">{error}</p>}</div><div className="modal-footer"><span className="footer-left" /><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy && <LoaderCircle size={15} className="spin" />}{scene ? "Save scene" : "Add scene"}</button></div></form></Modal>;
}

export function NoteDialog({ note, onClose, onSave, onDelete }: { note?: ProjectNote; onClose: () => void; onSave: (note: ProjectNote) => Promise<boolean>; onDelete?: () => void }) {
  const [draft, setDraft] = useState<ProjectNote>(note || { id: crypto.randomUUID(), title: "", content: "", color: "sage", createdAt: new Date().toISOString() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <Modal title={note ? "A thought worth keeping." : "Make a little room for an idea."} subtitle="Creative notes, production reminders, and everything in between." onClose={onClose}><form onSubmit={async e => { e.preventDefault(); setBusy(true); if (await onSave(draft)) onClose(); else setError("Your note couldn't be saved. Please try again."); setBusy(false); }}><div className="modal-body form-stack"><Field label="Title"><input required maxLength={300} placeholder="What's on your mind?" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Your note"><textarea required rows={7} placeholder="Catch the thought before it gets away..." value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} /></Field><div className="note-colors"><span>A little color</span>{(["sage", "sand", "rose"] as const).map(color => <button key={color} className={`color-choice ${color} ${draft.color === color ? "selected" : ""}`} type="button" aria-label={`${color} note color`} onClick={() => setDraft({ ...draft, color })}>{draft.color === color && <Check size={15} />}</button>)}</div>{error && <p className="form-error">{error}</p>}</div><div className="modal-footer">{note && onDelete ? <button type="button" className="button button-ghost danger-text footer-left" onClick={onDelete}><Trash2 size={15} />Delete note</button> : <span className="footer-left" />}<button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy && <LoaderCircle size={15} className="spin" />}{note ? "Save note" : "Keep this thought"}</button></div></form></Modal>;
}

export function ShareDialog({ project, onClose, onShare }: { project: FilmProject; onClose: () => void; onShare: (enabled: boolean) => Promise<boolean> }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const url = project.shareId ? `${window.location.origin}/share/${project.shareId}` : "";
  async function toggle() { setBusy(true); setError(""); if (!(await onShare(!project.shareId))) setError("Sharing couldn't be updated. Please try again."); setBusy(false); }
  return <Modal title="Good stories deserve an audience." subtitle={`Share a little of “${project.title}” with your collaborators.`} onClose={onClose}><div className="modal-body"><div className="share-preview"><img src={project.coverImage} alt="Project cover" onError={onImageError} /><div><span className="eyebrow">PROJECT PREVIEW</span><h3>{project.title}</h3><p>{project.frames.length} frames · {project.scenes.length} scenes · {project.format}</p></div></div><div className="share-setting"><span className="share-setting-icon">{project.shareId ? <Globe2 size={21} /> : <LockKeyhole size={21} />}</span><div><h4>{project.shareId ? "Anyone with the link" : "Your project is private"}</h4><p>{project.shareId ? "Can view the storyboard and screenplay" : "Create a read-only link when you're ready"}</p></div><button className={`switch ${project.shareId ? "on" : ""}`} role="switch" aria-checked={!!project.shareId} aria-label="Enable public share link" onClick={toggle} disabled={busy}><span /></button></div>{url && <div className="share-link"><Link2 size={16} /><input readOnly aria-label="Share link" value={url} onFocus={e => e.target.select()} /><button className="button button-primary" onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setError("Select the link and copy it with Ctrl/Cmd+C."); } }}>{copied ? <CheckCheck size={15} /> : <Clipboard size={15} />}{copied ? "Copied!" : "Copy"}</button></div>}<div className="share-security"><ShieldCheck size={16} /><p>{project.shareId ? "Your original stays safe. Visitors can view, but never edit. Turn sharing off to revoke access." : "Your screenplay, storyboard, and shot notes will be visible to anyone you share the link with."}</p></div>{error && <p className="form-error">{error}</p>}</div><div className="modal-footer"><span className="footer-left" />{url && <a className="button" href={url} target="_blank" rel="noreferrer">Preview link<ArrowUpRight size={15} /></a>}<button className="button button-primary" onClick={onClose}>Done</button></div></Modal>;
}

export function ExportDialog({ project, onClose }: { project: FilmProject; onClose: () => void }) {
  const [kind, setKind] = useState("storyboard");
  const [error, setError] = useState("");
  const options = [
    { id: "storyboard", title: "Storyboard", detail: "Print-ready layout · Save as PDF", icon: LayoutGrid },
    { id: "screenplay", title: "Screenplay", detail: "Fountain · Works with screenwriting apps", icon: FileText },
    { id: "shots", title: "Shot list", detail: "CSV · Ready for your production team", icon: Table2 },
    { id: "look", title: "Look book", detail: "Mood boards, structure & cast · PDF", icon: Images },
    { id: "backup", title: "Project backup", detail: "JSON · Everything incl. your uploaded images · Re-importable", icon: FileJson },
  ];
  function exportFile() {
    try {
      if (kind === "storyboard") printProject(project);
      if (kind === "look") printProject(project, "look");
      if (kind === "screenplay") downloadFile(project.script, `${slugify(project.title)}.fountain`);
      if (kind === "shots") exportShotList(project);
      if (kind === "backup") downloadFile(JSON.stringify(project, null, 2), `${slugify(project.title)}.json`, "application/json");
      onClose();
    } catch (e) { setError(e instanceof Error ? e.message : "Export failed. Please try again."); }
  }
  return <Modal title="Ready for the next stage." subtitle="Take your story from the workspace to the set." onClose={onClose}><div className="modal-body export-options">{options.map(option => <button key={option.id} className={`export-option ${kind === option.id ? "selected" : ""}`} onClick={() => setKind(option.id)}><span className="export-icon"><option.icon size={21} /></span><span><strong>{option.title}</strong><small>{option.detail}</small></span><span className="radio-circle">{kind === option.id && <span />}</span></button>)}{error && <p className="form-error">{error}</p>}</div><div className="modal-footer"><span className="footer-left export-meta">Made with a little help from frame.</span><button className="button button-primary" onClick={exportFile}><Download size={15} />{kind === "storyboard" || kind === "look" ? "Open print preview" : "Export file"}</button></div></Modal>;
}

export type SearchTarget = { tab?: string; frameId?: string; sceneId?: string; characterId?: string; noteId?: string; nodeId?: string; boardId?: string; actId?: string; script?: { start: number; end: number } };
type Hit = { projectId: string; project: string; type: string; title: string; detail: string; target: SearchTarget };
const SEARCH_FILTERS = ["All", "Projects", "Scenes", "Shots", "Script", "Cast", "Notes", "Ideas", "Acts", "Mood boards"] as const;

export function SearchDialog({ projects, onClose, onNavigate }: { projects: FilmProject[]; onClose: () => void; onNavigate: (projectId: string, target: SearchTarget) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof SEARCH_FILTERS)[number]>("All");
  const [active, setActive] = useState(0);
  const term = query.toLowerCase().trim();
  const hit = (project: FilmProject, type: string, title: string, detail: string, target: SearchTarget): Hit => ({ projectId: project.id, project: project.title, type, title, detail, target });

  const results: Hit[] = [];
  for (const project of projects) {
    if (!term) { results.push(hit(project, "Project", project.title, `${project.format} · ${project.scenes.length} scenes · ${project.frames.length} shots`, { tab: "Overview" })); continue; }
    if (project.title.toLowerCase().includes(term)) results.push(hit(project, "Project", project.title, `${project.format} · ${project.genre}`, { tab: "Overview" }));
    if (filter === "All" || filter === "Scenes") project.scenes.forEach((scene, i) => { if (`${scene.title} ${scene.location} ${scene.time} ${scene.description}`.toLowerCase().includes(term)) results.push(hit(project, "Scene", scene.title, `${String(i + 1).padStart(2, "0")} · ${scene.location} — ${scene.time}`, { tab: "Screenplay", sceneId: scene.id })); });
    if (filter === "All" || filter === "Shots") project.frames.forEach((frame, i) => { if (`${frame.title} ${frame.description} ${frame.notes} ${frame.mood || ""}`.toLowerCase().includes(term)) results.push(hit(project, "Shot", frame.title, `${String(i + 1).padStart(2, "0")} · ${frame.shotType} · ${frame.movement}`, { tab: "Storyboard", frameId: frame.id })); });
    if (filter === "All" || filter === "Cast") project.characters.forEach(c => { if (`${c.name} ${c.role} ${c.description} ${c.traits.join(" ")}`.toLowerCase().includes(term)) results.push(hit(project, "Cast", c.name, `${c.role}${c.age ? ` · ${c.age}` : ""}`, { tab: "Characters", characterId: c.id })); });
    if (filter === "All" || filter === "Notes") project.notes.forEach(n => { if (`${n.title} ${n.content} ${(n.tags || []).join(" ")}`.toLowerCase().includes(term)) results.push(hit(project, "Note", n.title, n.content.slice(0, 70), { tab: "Notes", noteId: n.id })); });
    if (filter === "All" || filter === "Ideas") project.brainstorm.forEach(b => { if (`${b.title} ${b.content} ${b.tags.join(" ")}`.toLowerCase().includes(term)) results.push(hit(project, "Idea", b.title, b.content.slice(0, 70), { tab: "Brainstorm", nodeId: b.id })); });
    if (filter === "All" || filter === "Acts") project.acts.forEach((a, ai) => { if (`${a.title} ${a.description} ${(a.parts || []).map(p => `${p.title} ${p.description}`).join(" ")}`.toLowerCase().includes(term)) results.push(hit(project, "Act", a.title, `${["I", "II", "III", "IV", "V", "VI"][ai] || ai + 1} · ${project.scenes.filter(s => s.actId === a.id).length} scenes${a.parts?.length ? ` · ${a.parts.length} sequences` : ""}`, { tab: "Overview", actId: a.id })); });
    if (filter === "All" || filter === "Mood boards") project.moodboards?.forEach(b => { if (`${b.title} ${b.description} ${b.items.map(x => x.caption).join(" ")}`.toLowerCase().includes(term)) results.push(hit(project, "Mood board", b.title, `${b.items.length} reference image${b.items.length === 1 ? "" : "s"}`, { tab: "Mood boards", boardId: b.id })); });
    if (filter === "All" || filter === "Script") {
      let offset = 0; let found = 0;
      for (const line of project.script.split("\n")) {
        const at = line.toLowerCase().indexOf(term);
        if (at >= 0) { results.push(hit(project, "Script", line.trim().slice(0, 78) || "(blank)", `${project.title} · line ${project.script.slice(0, offset).split("\n").length}`, { tab: "Screenplay", script: { start: offset + at, end: offset + at + term.length } })); found += 1; if (found >= 4) break; }
        offset += line.length + 1;
      }
    }
  }
  const shown = results.slice(0, 24);
  const select = (result: Hit) => { onNavigate(result.projectId, result.target); onClose(); };

  return <Modal title="Find anything in your work." subtitle="Scenes, shots, cast, notes, ideas, acts, mood boards, and the script itself." onClose={onClose} className="search-modal">
    <div className="search-input-wrap"><Search size={20} /><input autoFocus aria-label="Search workspace" role="combobox" aria-expanded="true" aria-controls="search-results" placeholder="Try “letter”, “Ella”, “golden hour”, “cold open”…" value={query} onChange={e => { setQuery(e.target.value); setActive(0); }} onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, shown.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); } if (e.key === "Enter") { e.preventDefault(); const r = shown[active]; if (r) select(r); } }} /><kbd>ESC</kbd></div>
    <div className="search-filters" role="tablist" aria-label="Result types">{SEARCH_FILTERS.map(f => <button type="button" key={f} role="tab" aria-selected={filter === f} className={filter === f ? "active" : ""} onClick={() => { setFilter(f); setActive(0); }}>{f}</button>)}</div>
    <div className="search-results" id="search-results" role="listbox" aria-label="Search results">{shown.length > 0 && <p className="eyebrow">{term ? `${results.length} RESULT${results.length === 1 ? "" : "S"}` : "YOUR PROJECTS"}</p>}{shown.map((result, i) => <button key={`${result.projectId}-${result.type}-${i}`} role="option" aria-selected={i === active} className={`search-result ${i === active ? "active" : ""}`} onMouseEnter={() => setActive(i)} onClick={() => select(result)}><span className="search-result-icon">{result.type === "Project" ? <Film size={18} /> : result.type === "Scene" ? <Clapperboard size={18} /> : result.type === "Shot" ? <LayoutGrid size={18} /> : result.type === "Cast" ? <UserRound size={18} /> : result.type === "Note" ? <MessageSquare size={18} /> : result.type === "Idea" ? <Sparkles size={18} /> : result.type === "Act" ? <ListOrdered size={18} /> : result.type === "Mood board" ? <Images size={18} /> : <FileText size={18} />}</span><span><strong>{result.title}</strong><small>{result.project} · {result.detail}</small></span><span className="search-result-type">{result.type}</span><ArrowUpRight size={15} /></button>)}{shown.length === 0 && <div className="search-empty"><Search size={27} /><p>Nothing matches that yet.</p><span>Try a location, a character, a shot type, or a feeling.</span></div>}</div>
    <div className="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span>{projects.length} project{projects.length === 1 ? "" : "s"} in this workspace</span></div>
  </Modal>;
}

export function HelpDialog({ onClose }: { onClose: () => void }) {
  return <Modal wide title="A little structure. A lot of possibility." subtitle="Your film, from the first word to the final frame." onClose={onClose}><div className="modal-body help-grid"><div><span className="eyebrow">YOUR CREATIVE TOOLKIT</span><div className="help-item"><FileText size={21} /><div><h3>Write the story</h3><p>Use the screenplay editor, import a .fountain or .txt script, and organize your narrative into scenes.</p></div></div><div className="help-item"><LayoutGrid size={21} /><div><h3>See it before you shoot it</h3><p>Add reference images, link frames to scenes, and drag to reorder your storyboard. Press play for a timed preview.</p></div></div><div className="help-item"><Table2 size={21} /><div><h3>Make every shot count</h3><p>Set framing, camera movement, and duration. Export a shot list for your crew or a print-ready storyboard.</p></div></div><div className="help-item"><SunMedium size={21} /><div><h3>Decide how it is lit</h3><p>Every scene carries a default look and every shot can override it — golden hour, low key, practical night. The lighting library shows each look, and the AI prompt describes it.</p></div></div><div className="help-item"><Link2 size={21} /><div><h3>Know who knows who</h3><p>Link your cast on the Relationships tab — parent, rival, mentor, estranged. Prompts mention the relationship whenever two linked people share a shot.</p></div></div></div><div className="help-resources"><span className="eyebrow">BUILT ON PROFESSIONAL IDEAS</span><p>Frame brings familiar pre-production practices into one focused workspace. For more production inspiration:</p><a href="https://www.studiobinder.com/storyboard-software/" target="_blank" rel="noreferrer">StudioBinder<span>Connected storyboards & shot lists</span><ArrowUpRight size={17} /></a><a href="https://www.finaldraft.com/" target="_blank" rel="noreferrer">Final Draft<span>Screenplay structure & formatting</span><ArrowUpRight size={17} /></a><a href="https://fountain.io/" target="_blank" rel="noreferrer">Fountain<span>Open, portable screenplay files</span><ArrowUpRight size={17} /></a><div className="keyboard-tip"><kbd>⌘ / Ctrl</kbd><kbd>K</kbd><span>Find anything in your workspace</span></div></div></div><div className="modal-footer"><span className="footer-left" /><button className="button button-primary" onClick={onClose}>Back to the story<ArrowUpRight size={15} /></button></div></Modal>;
}

export function ProfileDialog({ name, onClose, onSave }: { name: string; onClose: () => void; onSave: (name: string) => void }) {
  const [draft, setDraft] = useState(name);
  return <Modal title="Your little corner of the studio." subtitle="Personalize this workspace on your device." onClose={onClose}><form onSubmit={e => { e.preventDefault(); onSave(draft.trim() || "Jamie Parker"); onClose(); }}><div className="modal-body form-stack"><Field label="Your name"><input required maxLength={60} value={draft} onChange={e => setDraft(e.target.value)} /></Field><div className="field-tip"><LockKeyhole size={18} /><p>This is a personal workspace. Projects are saved to the connected database; public access is controlled with share links.</p></div></div><div className="modal-footer"><span className="footer-left" /><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save profile</button></div></form></Modal>;
}

export function ConfirmDialog({ title, description, onClose, onConfirm }: { title: string; description: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return <Modal title={title} onClose={onClose}><div className="modal-body"><p className="confirm-description">{description}</p></div><div className="modal-footer"><span className="footer-left" /><button className="button" onClick={onClose} disabled={busy}>Keep it</button><button className="button button-danger" disabled={busy} onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); onClose(); }}>{busy ? <LoaderCircle size={15} className="spin" /> : <Trash2 size={15} />}Delete</button></div></Modal>;
}


export function ActsDialog({ acts, scenes, onClose, onSave }: { acts: Act[]; scenes: Scene[]; onClose: () => void; onSave: (acts: Act[]) => Promise<boolean> }) {
  const [draft, setDraft] = useState<Act[]>(acts.length ? acts.map(a => ({ ...a, parts: a.parts || [] })) : [{ id: crypto.randomUUID(), title: "Act I", description: "", parts: [] }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(acts[0]?.id || null);
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const update = (id: string, patch: Partial<Act>) => setDraft(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  const move = (index: number, dir: number) => setDraft(prev => { const next = [...prev]; const target = index + dir; if (target < 0 || target >= next.length) return prev; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const addPart = (actId: string) => { setOpen(actId); setDraft(prev => prev.map(a => (a.id === actId ? { ...a, parts: [...(a.parts || []), { id: crypto.randomUUID(), title: `Sequence ${(a.parts || []).length + 1}`, description: "" }] } : a))); };
  const updatePart = (actId: string, partId: string, patch: Partial<ActPart>) => setDraft(prev => prev.map(a => (a.id === actId ? { ...a, parts: (a.parts || []).map(p => (p.id === partId ? { ...p, ...patch } : p)) } : a)));
  const removePart = (actId: string, partId: string) => setDraft(prev => prev.map(a => (a.id === actId ? { ...a, parts: (a.parts || []).filter(p => p.id !== partId) } : a)));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.some(a => !a.title.trim())) { setError("Every act needs a title."); return; }
    if (draft.some(a => (a.parts || []).some(p => !p.title.trim()))) { setError("Every sequence needs a title."); return; }
    setBusy(true);
    const ok = await onSave(draft.map(a => ({ ...a, title: a.title.trim(), parts: (a.parts || []).map(p => ({ ...p, title: p.title.trim() })) })));
    setBusy(false);
    if (ok) onClose(); else setError("The structure couldn't be saved. Please try again.");
  }

  return <Modal title="Give the story its shape." subtitle="Acts group your scenes into movements. Long acts often split into sequences." onClose={onClose}>
    <form onSubmit={submit}>
      <div className="modal-body form-stack">
        <div className="act-presets"><span className="eyebrow">START FROM</span><button type="button" className="button button-small" onClick={() => setDraft([{ id: crypto.randomUUID(), title: "Act I — Setup", description: "Introduce the world, the character, and what they want.", parts: [] }, { id: crypto.randomUUID(), title: "Act II — Confrontation", description: "Obstacles rise. The character is tested and changed.", parts: [] }, { id: crypto.randomUUID(), title: "Act III — Resolution", description: "The final choice, and what it costs.", parts: [] }])}>Three-act</button><button type="button" className="button button-small" onClick={() => setDraft(["Exposition", "Rising action", "Climax", "Falling action", "Resolution"].map((t, i) => ({ id: crypto.randomUUID(), title: `Act ${roman[i]} — ${t}`, description: "", parts: [] })))}>Five-act</button></div>
        <div className="acts-list">{draft.map((act, i) => {
          const mine = scenes.filter(s => s.actId === act.id);
          const parts = act.parts || [];
          const expanded = open === act.id;
          return <div key={act.id} className="act-item">
            <div className="act-row">
              <span className="act-numeral">{roman[i] || i + 1}</span>
              <div className="act-fields">
                <input maxLength={120} required placeholder="Act title" value={act.title} onChange={e => update(act.id, { title: e.target.value })} aria-label={`Act ${i + 1} title`} />
                <input maxLength={2000} placeholder="What this act is about (optional)" value={act.description} onChange={e => update(act.id, { description: e.target.value })} aria-label={`Act ${i + 1} description`} />
                <small>{mine.length} scene{mine.length === 1 ? "" : "s"}{parts.length ? ` · ${parts.length} sequence${parts.length > 1 ? "s" : ""}` : ""}</small>
              </div>
              <div className="act-controls">
                <button type="button" className="icon-button" aria-label="Move act up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={14} /></button>
                <button type="button" className="icon-button" aria-label="Move act down" disabled={i === draft.length - 1} onClick={() => move(i, 1)}><ArrowDown size={14} /></button>
                <button type="button" className="icon-button danger-hover" aria-label={`Remove act ${act.title || i + 1}`} onClick={() => setDraft(prev => prev.filter(a => a.id !== act.id))}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="act-parts">
              <button type="button" className="act-parts-toggle" onClick={() => setOpen(expanded ? null : act.id)} aria-expanded={expanded}><ChevronDown size={12} className={expanded ? "open" : ""} />Sequences<small>{parts.length ? `${parts.length} part${parts.length > 1 ? "s" : ""} of this act` : "optional — break a long act into parts"}</small></button>
              {expanded && <div className="act-parts-body">
                {parts.map(part => { const count = mine.filter(s => s.partId === part.id).length; return <div key={part.id} className="part-row"><input value={part.title} maxLength={160} aria-label={`Sequence title in ${act.title}`} onChange={e => updatePart(act.id, part.id, { title: e.target.value })} /><input value={part.description} maxLength={1000} placeholder="What this sequence is about" aria-label={`Sequence description in ${act.title}`} onChange={e => updatePart(act.id, part.id, { description: e.target.value })} /><span className="part-count" title={`${count} scene${count === 1 ? "" : "s"} in this sequence`}>{count}</span><button type="button" className="icon-button danger-hover" aria-label={`Remove sequence ${part.title}`} onClick={() => removePart(act.id, part.id)}><Trash2 size={13} /></button></div>; })}
                <button type="button" className="text-button" onClick={() => addPart(act.id)}><Plus size={13} />Add a sequence</button>
              </div>}
            </div>
          </div>;
        })}</div>
        <button type="button" className="add-scene-button" onClick={() => setDraft(prev => [...prev, { id: crypto.randomUUID(), title: `Act ${roman[prev.length] || prev.length + 1}`, description: "", parts: [] }])}><Plus size={15} />Add an act</button>
        <div className="field-tip"><Info size={17} /><p>Removing an act or sequence keeps its scenes — they simply become unassigned.</p></div>
        {error && <p className="form-error">{error}</p>}
      </div>
      <div className="modal-footer"><span className="footer-left" /><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy && <LoaderCircle size={15} className="spin" />}Save structure</button></div>
    </form>
  </Modal>;
}

export function PromptDialog({ project, initialSceneId, onClose, onApplyStyle, onAddShot, onEditShot }: { project: FilmProject; initialSceneId?: string; onClose: () => void; onApplyStyle: (frameIds: string[], styleId: string) => void; onAddShot?: (sceneId?: string) => void; onEditShot?: (frame: StoryFrame) => void }) {
  return <Modal wide title="The prompt studio." subtitle="Pick the shots, choose a look and a model, and copy every prompt in one go." onClose={onClose} className="prompt-modal">
    <PromptStudio project={project} initialSceneId={initialSceneId} onApplyStyle={onApplyStyle} onAddShot={onAddShot} onEditShot={onEditShot} onClose={onClose} />
  </Modal>;
}
