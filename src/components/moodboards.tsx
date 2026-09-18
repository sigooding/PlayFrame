"use client";

import { useRef, useState } from "react";
import { Images, Link2, LoaderCircle, Plus, Sparkles, Trash2, X, Upload, Palette } from "lucide-react";
import { Field, Modal } from "./ui";
import type { FilmProject, MoodBoard, MoodItem, Scene } from "@/lib/types";
import { IMAGE_TYPES, projectImages, resizeImage } from "@/lib/image";
import { onImageError } from "@/lib/image";

export function MoodboardsView({ project, onAdd, onEdit, onDelete }: { project: FilmProject; onAdd: () => void; onEdit: (board: MoodBoard) => void; onDelete: (board: MoodBoard) => void }) {
  const sceneLabel = (sceneId?: string) => { const scene = project.scenes.find(s => s.id === sceneId); return scene ? `${scene.location} — ${scene.time}` : ""; };
  const actLabel = (actId?: string) => project.acts.find(a => a.id === actId)?.title || "";
  return <section className="view-enter"><div className="section-heading"><div><div className="section-title-row"><h2>Mood boards</h2><span className="count-badge">{project.moodboards.length}</span></div><p>What the film should feel like before a single frame is shot.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} />New board</button></div>
    {project.moodboards.length ? <div className="board-grid">{project.moodboards.map(board => <article className="board-card" key={board.id}>
      <div className={`board-mosaic count-${Math.min(4, board.items.length)}`}>{board.items.slice(0, 4).map(item => <img key={item.id} src={item.image} alt={item.caption || board.title} onError={onImageError} />)}{board.items.length === 0 && <div className="board-mosaic-empty"><Images size={22} /></div>}{board.items.length > 4 && <span className="board-more">+{board.items.length - 4}</span>}</div>
      <div className="board-body"><h3>{board.title}</h3>{board.description && <p>{board.description}</p>}{(sceneLabel(board.sceneId) || actLabel(board.actId)) && <div className="board-links"><span><Link2 size={12} />{sceneLabel(board.sceneId) || actLabel(board.actId)}</span></div>}</div>
      <div className="board-foot"><span>{board.items.length} image{board.items.length === 1 ? "" : "s"}</span><div><button className="text-button" onClick={() => onEdit(board)}>Open</button><button className="icon-button danger-hover" aria-label={`Delete ${board.title}`} onClick={() => onDelete(board)}><Trash2 size={14} /></button></div></div>
    </article>)}<button className="new-project-card board-new" onClick={onAdd}><span><Plus size={27} strokeWidth={1.3} /></span><h3>Start a board.</h3><p>Texture, light, weather, colour.<br />Everything the words can’t hold.</p><strong>Add images →</strong></button></div> : <div className="empty-state"><span className="empty-icon"><Palette size={27} strokeWidth={1.3} /></span><h3>A room full of references.</h3><p>Mood boards hold the feeling of a scene — light, colour, texture, weather — so your crew sees what you see.</p><button className="button button-primary" onClick={onAdd}>Create your first board<Sparkles size={15} /></button></div>}
  </section>;
}

export function MoodBoardDialog({ board, project, isNew, onClose, onSave, onDelete }: { board?: MoodBoard; project: FilmProject; isNew: boolean; onClose: () => void; onSave: (board: MoodBoard) => Promise<boolean>; onDelete?: () => void }) {
  const [draft, setDraft] = useState<MoodBoard>(board || { id: crypto.randomUUID(), title: "", description: "", items: [], createdAt: new Date().toISOString() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const library = projectImages(project, 18);

  async function addFiles(files?: FileList | null) {
    const list = Array.from(files || []).filter(f => IMAGE_TYPES.test(f.type));
    if (!list.length) { if (files?.length) setError("Only JPG, PNG, or WebP images can be added."); return; }
    if (draft.items.length + list.length > 40) { setError("A board holds up to 40 images. Remove a few first."); return; }
    setError("");
    const items: MoodItem[] = [];
    for (const file of list) {
      if (file.size > 15 * 1024 * 1024) { setError("Some images were skipped — 15 MB each is the limit."); continue; }
      try { items.push({ id: crypto.randomUUID(), image: await resizeImage(file, 1100, 0.82), caption: "" }); }
      catch { setError("One image couldn’t be read and was skipped."); }
    }
    if (items.length) setDraft(prev => ({ ...prev, items: [...prev.items, ...items] }));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) { setError("Give the board a name."); return; }
    setBusy(true); setError("");
    if (await onSave({ ...draft, title: draft.title.trim(), description: draft.description.trim(), items: draft.items.filter(i => i.image) })) onClose();
    else setError("The board couldn't be saved. Please try again.");
    setBusy(false);
  }

  return <Modal wide title={isNew ? "A room of references." : draft.title || "Mood board"} subtitle="Collect the light, texture, and feeling. Drop images anywhere in the panel below." onClose={onClose} className="board-modal">
    <form onSubmit={submit}>
      <div className="board-editor">
        <div className="board-editor-side">
          <Field label="Board title"><input autoFocus required maxLength={200} placeholder="e.g. The look of Act II" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="What this board is for"><textarea rows={3} maxLength={2000} placeholder="Colour, weather, texture, the feeling you're protecting..." value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></Field>
          {project.acts.length > 0 && <Field label="Linked act"><select value={draft.actId || ""} onChange={e => setDraft({ ...draft, actId: e.target.value || undefined, sceneId: undefined })}><option value="">Whole film</option>{project.acts.map((a, i) => <option key={a.id} value={a.id}>{a.title}</option>)}</select></Field>}
          {project.scenes.length > 0 && <Field label="Linked scene"><select value={draft.sceneId || ""} onChange={e => setDraft({ ...draft, sceneId: e.target.value || undefined, actId: undefined })}><option value="">No specific scene</option>{project.scenes.map((s: Scene, i) => <option key={s.id} value={s.id}>{String(i + 1).padStart(2, "0")} · {s.location}</option>)}</select></Field>}
          {library.length > 0 && <><p className="eyebrow reference-label">ADD FROM THIS PROJECT</p><div className="board-lib">{library.map(src => <button key={src} type="button" aria-label="Add this image to the board" disabled={draft.items.some(i => i.image === src)} onClick={() => setDraft(prev => ({ ...prev, items: [...prev.items, { id: crypto.randomUUID(), image: src, caption: "" }] }))}><img src={src} alt="" onError={onImageError} /></button>)}</div></>}
          <div className="field-tip"><Images size={17} /><p>Images are resized to 1100px and stored with your project. They also print in the look book.</p></div>
        </div>
        <div className={`board-canvas ${dragOver ? "over" : ""}`} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }} onClick={e => { if (e.target === e.currentTarget) fileRef.current?.click(); }}>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label="Add images to board" onChange={e => addFiles(e.target.files)} />
          {draft.items.length === 0 ? <div className="board-canvas-empty"><Upload size={26} /><p>Drop images here<br />or click to browse</p><button type="button" className="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}><Plus size={14} />Add images</button></div> : <div className="board-items">
            {draft.items.map((item, i) => <figure key={item.id} className="board-item">
              <img src={item.image} alt={item.caption || `Reference ${i + 1}`} onError={onImageError} />
              <button type="button" className="icon-button board-remove" aria-label={`Remove image ${i + 1}`} onClick={() => setDraft(prev => ({ ...prev, items: prev.items.filter(x => x.id !== item.id) }))}><X size={13} /></button>
              <input aria-label={`Caption ${i + 1}`} placeholder="Add a note…" maxLength={300} value={item.caption} onChange={e => setDraft(prev => ({ ...prev, items: prev.items.map(x => x.id === item.id ? { ...x, caption: e.target.value } : x) }))} />
            </figure>)}
            <button type="button" className="board-add" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}><Plus size={20} /><span>Add more</span></button>
          </div>}
        </div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-footer"><div className="footer-left">{!isNew && onDelete ? <button type="button" className="button button-ghost danger-text" onClick={onDelete}><Trash2 size={15} />Delete board</button> : null}</div><span className="export-meta">{draft.items.length} image{draft.items.length === 1 ? "" : "s"}</span><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy && <LoaderCircle size={15} className="spin" />}{isNew ? "Create board" : "Save board"}</button></div>
    </form>
  </Modal>;
}
