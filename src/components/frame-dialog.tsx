"use client";

import { useRef, useState } from "react";
import { Upload, ImagePlus, Trash2, Copy, LoaderCircle, Camera, Check, Clapperboard, Sparkles, ClipboardCopy, CheckCheck, Info, Wand2 } from "lucide-react";
import { Field, Modal } from "./ui";
import { CAMERA_ANGLES, CAMERA_MOVEMENTS, LENSES, LIGHTING, SHOT_TYPES, TRANSITIONS, type CameraAngle, type CameraMovement, type Character, type FilmProject, type FrameStatus, type Lens, type Lighting, type Scene, type ShotType, type StoryFrame, type Transition } from "@/lib/types";
import { applyShotType, isShotReference, shotGuide } from "@/lib/shots";
import { buildFramePrompt, PLATFORMS, type PlatformId } from "@/lib/prompt";
import { IMAGE_TYPES, projectImages, resizeImage } from "@/lib/image";
import { onImageError } from "@/lib/image";

export const shotTypes: ShotType[] = [...SHOT_TYPES];
export const cameraMovements: CameraMovement[] = [...CAMERA_MOVEMENTS];

type Tab = "frame" | "shot" | "prompt";

export function ShotTypePicker({ value, onChange, onPick, compact = false }: { value: ShotType; onChange?: (type: ShotType) => void; onPick?: (type: ShotType) => void; compact?: boolean }) {
  const selected = shotGuide[value];
  return <div className="shot-picker">
    <div className={`shot-grid ${compact ? "shot-grid-compact" : ""}`}>
      {SHOT_TYPES.map(type => {
        const entry = shotGuide[type];
        const active = type === value;
        return <button type="button" key={type} className={`shot-option ${active ? "selected" : ""}`} onClick={() => (onPick ? onPick(type) : onChange?.(type))} aria-pressed={active} aria-label={`${type} shot`} title={`${entry.summary} ${entry.useFor}`}>
          <span className="shot-thumb"><img src={entry.image} alt="" loading="lazy" onError={onImageError} />{entry.diagram && <i title="Framing diagram — this shot is about camera position, not lens length">DIAGRAM</i>}{active && <span className="shot-check"><Check size={13} /></span>}</span>
          <strong>{type}</strong>
        </button>;
      })}
    </div>
    {selected && <div className="shot-summary"><Info size={15} /><div><strong>{value}</strong> — {selected.summary} <span>Use it for: {selected.useFor}</span></div></div>}
  </div>;
}

export function FrameDialog({ frame, scenes, characters = [], project, isNew, frameNumber, onClose, onSave, onDelete, onDuplicate }: { frame: StoryFrame; scenes: Scene[]; characters?: Character[]; project: FilmProject; isNew: boolean; frameNumber?: number; onClose: () => void; onSave: (frame: StoryFrame) => Promise<boolean>; onDelete?: () => void; onDuplicate?: () => void }) {
  const [draft, setDraft] = useState<StoryFrame>(frame);
  const [tab, setTab] = useState<Tab>("frame");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [platform, setPlatform] = useState<PlatformId>("hailuo");
  const [copied, setCopied] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof StoryFrame>(key: K, value: StoryFrame[K]) => setDraft(prev => ({ ...prev, [key]: value }));
  const usingReference = !draft.image || isShotReference(draft.image);
  const prompt = buildFramePrompt(project, draft, platform);
  const library = projectImages(project);

  async function upload(files?: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!IMAGE_TYPES.test(file.type)) { setError("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("Please use an image smaller than 15 MB."); return; }
    setUploading(true); setError("");
    try { set("image", await resizeImage(file, 1600, 0.85)); }
    catch { setError("That image couldn't be opened. Please try another file."); }
    finally { setUploading(false); if (uploadRef.current) uploadRef.current.value = ""; }
  }

  async function copyPrompt() {
    try { await navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { setError("Select the prompt text and copy it with Ctrl/Cmd+C."); }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) { setError("Every frame needs a title."); setTab("frame"); return; }
    if (!draft.sceneId) { setError("Choose a scene for this frame."); setTab("frame"); return; }
    if (!(draft.duration > 0 && draft.duration <= 3600)) { setError("Duration must be between 1 and 3,600 seconds."); setTab("frame"); return; }
    setBusy(true); setError("");
    if (await onSave({ ...draft, title: draft.title.trim(), image: draft.image || shotGuide[draft.shotType].image })) onClose();
    else setError("We couldn't save this frame. Please try again.");
    setBusy(false);
  }

  const tabs: { id: Tab; label: string; icon: typeof Camera }[] = [{ id: "frame", label: "Frame", icon: Clapperboard }, { id: "shot", label: "Shot design", icon: Camera }, { id: "prompt", label: "AI prompt", icon: Sparkles }];

  return <Modal wide title={isNew ? "A new frame. A new possibility." : `Frame ${String(frameNumber || 1).padStart(2, "0")}`} subtitle={isNew ? "Turn a moment in your script into a visual." : "Fine-tune the details that bring this moment to life."} onClose={onClose} className="frame-modal"><form onSubmit={submit}><nav className="dialog-tabs" aria-label="Frame sections">{tabs.map(t => <button type="button" key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}><t.icon size={15} />{t.label}</button>)}<span className="dialog-tab-meta">{draft.shotType} · {draft.movement} · {draft.duration}s</span></nav>

    {tab === "frame" && <div className="frame-dialog-grid"><div className="frame-visual-side"><div className="frame-preview">{draft.image ? <img src={draft.image} alt={draft.title || "Frame preview"} onError={onImageError} /> : <div className="image-placeholder"><ImagePlus size={32} /><span>Your next great shot</span></div>}<span className="preview-ratio">16:9</span>{usingReference && draft.image && <span className="preview-tag"><Camera size={11} />{draft.shotType} reference</span>}</div>
      <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload reference image" onChange={e => upload(e.target.files)} />
      <div className="image-actions"><button type="button" className="button" onClick={() => uploadRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}Upload image</button>{usingReference ? <button type="button" className="text-button" onClick={() => setTab("shot")}>Change shot type to update this image</button> : <button type="button" className="text-button" onClick={() => set("image", shotGuide[draft.shotType].image)}><Wand2 size={13} />Back to the {draft.shotType.toLowerCase()} example</button>}<button type="button" className="text-button" onClick={() => setShowUrl(!showUrl)}>Image URL</button></div>
      {showUrl && <Field label="Image URL"><input type="url" placeholder="https://..." value={draft.image.startsWith("http") ? draft.image : ""} onChange={e => set("image", e.target.value)} /></Field>}
      {library.length > 0 && <><p className="eyebrow reference-label">FROM THIS PROJECT</p><div className="reference-grid reference-grid-wide">{library.map(src => <button type="button" key={src} aria-label="Use this image" className={draft.image === src ? "selected" : ""} onClick={() => set("image", src)}><img src={src} alt="" onError={onImageError} />{draft.image === src && <span><Check size={12} /></span>}</button>)}</div></>}
      <Field label="Director’s notes"><textarea rows={4} placeholder="Lighting, sound, performance... the little things that matter." value={draft.notes} onChange={e => set("notes", e.target.value)} /></Field></div>

      <div className="frame-fields"><Field label="Frame title"><input maxLength={300} required placeholder="Give this moment a name" value={draft.title} onChange={e => set("title", e.target.value)} /></Field>
        <Field label="Scene"><select required value={draft.sceneId} onChange={e => { const next = scenes.find(s => s.id === e.target.value); const prevScene = scenes.find(s => s.id === draft.sceneId); setDraft(prev => { const inherited = !prev.characters?.length || (prevScene && JSON.stringify([...(prev.characters || [])].sort()) === JSON.stringify([...(prevScene.characters || [])].sort())); return { ...prev, sceneId: e.target.value, characters: inherited ? (next?.characters || []) : prev.characters }; }); }}><option value="" disabled>Select a scene</option>{scenes.map((scene, i) => <option key={scene.id} value={scene.id}>{String(i + 1).padStart(2, "0")} · {scene.location} — {scene.time}</option>)}</select></Field>
        <Field label="What happens in this frame?"><textarea rows={3} placeholder="Describe the action, feeling, or visual..." value={draft.description} onChange={e => set("description", e.target.value)} /></Field>
        <div className="field"><span>Shot type</span><ShotTypePicker value={draft.shotType} onPick={type => setDraft(prev => applyShotType(prev, type))} compact /></div>
        {characters.length > 0 && <div className="field"><span>Who is in this shot?</span><div className="chip-row">{characters.map(c => { const active = (draft.characters || []).includes(c.id); return <button key={c.id} type="button" className={`chip chip-toggle ${active ? "chip-active" : ""}`} onClick={() => setDraft(prev => ({ ...prev, characters: active ? (prev.characters || []).filter(id => id !== c.id) : [...(prev.characters || []), c.id] }))}>{c.name}{active && <Check size={12} />}</button>; })}</div></div>}
        <div className="fields-row"><Field label="Duration (seconds)"><input type="number" min="1" max="3600" required value={draft.duration} onChange={e => set("duration", Number(e.target.value))} /></Field><Field label="Status"><select value={draft.status} onChange={e => set("status", e.target.value as FrameStatus)}><option>Draft</option><option>Ready</option><option>Needs review</option></select></Field></div>
        <button type="button" className="field-tip field-tip-button" onClick={() => setTab("shot")}><Camera size={17} /><p><strong>Shot design →</strong> Angle, lens, lighting and the cut into this shot.</p></button></div></div>}

    {tab === "shot" && <div className="modal-body shot-design"><Field label="Shot type" hint={usingReference ? "The frame image follows your choice while you're using a shot example. Upload your own image any time." : "You're using a custom image, so it stays put. Switch back to the example from the Frame tab if you prefer."}><ShotTypePicker value={draft.shotType} onChange={type => setDraft(prev => applyShotType(prev, type))} /></Field><div className="fields-row fields-row-3"><Field label="Camera angle"><select value={draft.angle || "Eye level"} onChange={e => set("angle", e.target.value as CameraAngle)}>{CAMERA_ANGLES.map(a => <option key={a}>{a}</option>)}</select></Field><Field label="Camera movement"><select value={draft.movement} onChange={e => set("movement", e.target.value as CameraMovement)}>{CAMERA_MOVEMENTS.map(m => <option key={m}>{m}</option>)}</select></Field><Field label="Lens"><select value={draft.lens || ""} onChange={e => set("lens", (e.target.value || undefined) as Lens | undefined)}><option value="">Director’s choice</option>{LENSES.map(l => <option key={l}>{l}</option>)}</select></Field></div><div className="fields-row fields-row-3"><Field label="Lighting"><select value={draft.lighting || ""} onChange={e => set("lighting", (e.target.value || undefined) as Lighting | undefined)}><option value="">Match the scene</option>{LIGHTING.map(l => <option key={l}>{l}</option>)}</select></Field><Field label="Cut into this shot" hint="How we arrive here from the previous shot."><select value={draft.transition || ""} onChange={e => set("transition", (e.target.value || undefined) as Transition | undefined)}><option value="">Straight cut</option>{TRANSITIONS.map(t => <option key={t}>{t}</option>)}</select></Field><Field label="Mood in a few words"><input maxLength={300} placeholder="e.g. Quiet anticipation" value={draft.mood || ""} onChange={e => set("mood", e.target.value)} /></Field></div><div className="field-tip"><Camera size={17} /><p>Think in shots. Each frame is one camera setup and one piece of your story.</p></div></div>}

    {tab === "prompt" && <div className="modal-body prompt-panel"><div className="prompt-toolbar"><div className="platform-picker" role="tablist" aria-label="Video model">{PLATFORMS.map(p => <button type="button" key={p.id} role="tab" aria-selected={platform === p.id} className={platform === p.id ? "active" : ""} onClick={() => setPlatform(p.id)}>{p.name}</button>)}</div><button type="button" className="button button-primary" onClick={copyPrompt}>{copied ? <CheckCheck size={15} /> : <ClipboardCopy size={15} />}{copied ? "Copied" : "Copy prompt"}</button></div><p className="platform-hint"><Info size={13} />{PLATFORMS.find(p => p.id === platform)?.hint}</p><textarea className="prompt-output" readOnly value={prompt} aria-label="Generated video prompt" rows={12} onFocus={e => e.target.select()} /><div className="prompt-includes"><span className="eyebrow">THIS PROMPT INCLUDES</span><div className="chip-row">{[draft.shotType, draft.angle, draft.lens, draft.movement, draft.lighting, draft.transition || "Cut in", `${draft.duration}s`, (draft.characters || []).length ? `${(draft.characters || []).length} character${(draft.characters || []).length > 1 ? "s" : ""}` : "", "Scene setting", "Next-shot continuity", "Style guide"].filter(Boolean).map(item => <span key={item as string} className="chip">{item}</span>)}</div><small>Edits on the other tabs update this prompt live. The storyboard’s <strong>AI prompts</strong> button builds the whole scene as one sequence.</small></div></div>}

    {error && <p className="form-error" role="alert">{error}</p>}<div className="modal-footer"><div className="footer-left">{!isNew && <><button type="button" className="icon-button danger-hover" aria-label="Delete frame" title="Delete frame" onClick={onDelete}><Trash2 size={17} /></button><button type="button" className="button button-ghost" onClick={onDuplicate}><Copy size={15} />Duplicate</button></>}</div><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy || uploading}>{busy && <LoaderCircle size={15} className="spin" />}{isNew ? "Add to storyboard" : "Save changes"}</button></div></form></Modal>;
}
