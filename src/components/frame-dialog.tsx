"use client";

import { useRef, useState } from "react";
import { Upload, ImagePlus, Trash2, Copy, LoaderCircle, Camera, Check, Clapperboard, Sparkles, ClipboardCopy, CheckCheck, Info, Wand2, Link2, Images } from "lucide-react";
import { Field, Modal } from "./ui";
import { CAMERA_ANGLES, CAMERA_MOVEMENTS, LENSES, SHOT_TYPES, TRANSITIONS, type CameraAngle, type CameraMovement, type Character, type FilmProject, type FrameStatus, type Lens, type Scene, type ShotType, type StoryFrame, type Transition } from "@/lib/types";
import { applyShotType, isShotReference, shotGuide } from "@/lib/shots";
import { LightingPicker } from "./lighting-picker";
import { VisualStylePicker } from "./style-picker";
import { DEFAULT_STYLE_ID, VISUAL_STYLES } from "@/lib/styles";
import { relationLines } from "@/lib/relations";
import { buildFramePrompt, extractNegativePrompt, extractPositivePrompt, PLATFORMS, type PlatformId, type PlatformKind } from "@/lib/prompt";
import { IMAGE_TYPES, projectImages, resizeImage } from "@/lib/image";
import { onImageError } from "@/lib/image";
import { selectFrameImage } from "@/lib/image-history";
import { ImageBrowser, useImageLibrary } from "./image-library";
import { sceneNumber } from "@/lib/frame-order";

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
          <span className="shot-thumb"><img src={entry.image} alt="" loading="lazy" onError={onImageError} />{entry.framing && <img className="shot-framing" src={entry.framing} alt="" loading="lazy" onError={onImageError} />}{entry.diagram && <i title="Framing diagram — this shot is about camera position, not lens length">DIAGRAM</i>}{active && <span className="shot-check"><Check size={13} /></span>}</span>
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
  const [browsing, setBrowsing] = useState(false);
  const imageLibrary = useImageLibrary();
  const [platform, setPlatform] = useState<PlatformId>("hailuo");
  // The AI prompt starts from the look the shot already has: its own style, else its scene's, else the default.
  const [style, setStyle] = useState<string>(() => {
    const known = (id?: string) => !!id && VISUAL_STYLES.some(entry => entry.id === id);
    const sceneStyle = scenes.find(scene => scene.id === frame.sceneId)?.style;
    return known(frame.style) ? frame.style! : known(sceneStyle) ? sceneStyle! : DEFAULT_STYLE_ID;
  });
  const [categoryFilter, setCategoryFilter] = useState<"all" | PlatformKind>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const lastChosenImage = useRef(frame.image);
  const set = <K extends keyof StoryFrame>(key: K, value: StoryFrame[K]) => setDraft(prev => ({ ...prev, [key]: value }));
  const setImage = (image: string) => {
    const previous = lastChosenImage.current;
    lastChosenImage.current = image;
    setDraft(prev => {
      const selected = selectFrameImage({ ...prev, image: previous }, image);
      return { ...prev, image, imageOriginal: selected.imageOriginal, imageHistory: selected.imageHistory };
    });
  };
  const usingReference = !draft.image || isShotReference(draft.image);
  const prompt = buildFramePrompt(project, draft, platform, style);
  const currentModel = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
  const library = projectImages(project);

  const hasNegative = prompt.includes("NEGATIVE PROMPT:");
  const positivePart = hasNegative ? extractPositivePrompt(prompt) : "";
  const negativePart = hasNegative ? extractNegativePrompt(prompt) : null;

  async function upload(files?: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!IMAGE_TYPES.test(file.type)) { setError("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("Please use an image smaller than 15 MB."); return; }
    setUploading(true); setError("");
    try { setImage(await resizeImage(file, 1600, 0.85)); }
    catch { setError("That image couldn't be opened. Please try another file."); }
    finally { setUploading(false); if (uploadRef.current) uploadRef.current.value = ""; }
  }

  async function copyText(text: string, key = "prompt") {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      setError("Select the prompt text and copy it with Ctrl/Cmd+C.");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) { setError("Every frame needs a title."); setTab("frame"); return; }
    if (!draft.sceneId) { setError("Choose a scene for this frame."); setTab("frame"); return; }
    if (!(draft.duration > 0 && draft.duration <= 3600)) { setError("Duration must be between 1 and 3,600 seconds."); setTab("frame"); return; }
    setBusy(true); setError("");
    const image = draft.image || shotGuide[draft.shotType].image;
    const selected = image === lastChosenImage.current
      ? draft
      : selectFrameImage({ ...draft, image: lastChosenImage.current }, image);
    if (await onSave({ ...selected, image, title: draft.title.trim() })) onClose();
    else setError("We couldn't save this frame. Please try again.");
    setBusy(false);
  }

  const tabs: { id: Tab; label: string; icon: typeof Camera }[] = [
    { id: "frame", label: "Frame", icon: Clapperboard },
    { id: "shot", label: "Shot design", icon: Camera },
    { id: "prompt", label: "AI prompt", icon: Sparkles },
  ];

  const visiblePlatforms = categoryFilter === "all" ? PLATFORMS : PLATFORMS.filter(p => p.kind === categoryFilter);

  return <Modal wide title={isNew ? "A new frame. A new possibility." : `Frame ${String(frameNumber || 1).padStart(2, "0")}`} subtitle={isNew ? "Turn a moment in your script into a visual." : "Fine-tune the details that bring this moment to life."} onClose={onClose} className="frame-modal"><form onSubmit={submit}><nav className="dialog-tabs" aria-label="Frame sections">{tabs.map(t => <button type="button" key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}><t.icon size={15} />{t.label}</button>)}<span className="dialog-tab-meta">{draft.shotType} · {draft.movement} · {draft.durationIsEstimate ? "~" : ""}{draft.duration}s</span></nav>

    {tab === "frame" && <div className="frame-dialog-grid"><div className="frame-visual-side"><div className="frame-preview">{draft.image ? <img src={draft.image} alt={draft.title || "Frame preview"} onError={onImageError} /> : <div className="image-placeholder"><ImagePlus size={32} /><span>Your next great shot</span></div>}<span className="preview-ratio">16:9</span>{usingReference && draft.image && <span className="preview-tag"><Camera size={11} />{draft.shotType} reference</span>}</div>
      <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload reference image" onChange={e => upload(e.target.files)} />
      <div className="image-actions"><button type="button" className="button" onClick={() => uploadRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}Upload image</button>{usingReference ? <button type="button" className="text-button" onClick={() => setTab("shot")}>Change shot type to update this image</button> : <button type="button" className="text-button" onClick={() => setImage(shotGuide[draft.shotType].image)}><Wand2 size={13} />Back to the {draft.shotType.toLowerCase()} example</button>}<button type="button" className="text-button" onClick={() => setShowUrl(!showUrl)}>Image URL</button>{imageLibrary.length > 0 && <button type="button" className="button" onClick={() => setBrowsing(!browsing)} aria-expanded={browsing}><Images size={15} />{browsing ? "Hide image library" : "Browse all images"}</button>}</div>
      {browsing && imageLibrary.length > 0 && <ImageBrowser library={imageLibrary} selected={draft.image} imageOriginal={draft.imageOriginal} imageHistory={draft.imageHistory} sceneNumber={(() => { const index = scenes.findIndex(scene => scene.id === draft.sceneId); return index < 0 ? undefined : sceneNumber(scenes[index], index); })()} onPick={setImage} />}
      {showUrl && <Field label="Image URL"><input type="url" placeholder="https://..." value={draft.image.startsWith("http") ? draft.image : ""} onChange={e => set("image", e.target.value)} /></Field>}
      {library.length > 0 && <><p className="eyebrow reference-label">FROM THIS PROJECT</p><div className="reference-grid reference-grid-wide">{library.map(src => <button type="button" key={src} aria-label="Use this image" className={draft.image === src ? "selected" : ""} onClick={() => setImage(src)}><img src={src} alt="" onError={onImageError} />{draft.image === src && <span><Check size={12} /></span>}</button>)}</div></>}
      <Field label="Director’s notes"><textarea rows={4} placeholder="Lighting, sound, performance... the little things that matter." value={draft.notes} onChange={e => set("notes", e.target.value)} /></Field>{draft.audio && draft.audio.length > 0 && <div className="field frame-dialogue"><span>Recorded audio</span>{draft.audio.map(clip => <div key={clip.id} className="frame-dialogue-line"><strong>{clip.character}</strong> <span>{clip.offset}s{clip.duration ? ` · ${clip.duration}s` : ""}</span><p>{clip.text || "Sound effect"}</p><audio controls preload="none" src={clip.src} /></div>)}</div>}</div>

      <div className="frame-fields"><Field label="Frame title"><input maxLength={300} required placeholder="Give this moment a name" value={draft.title} onChange={e => set("title", e.target.value)} /></Field>
        <Field label="Scene"><select required value={draft.sceneId} onChange={e => { const next = scenes.find(s => s.id === e.target.value); const prevScene = scenes.find(s => s.id === draft.sceneId); setDraft(prev => { const inherited = prev.characters === undefined || (prevScene && JSON.stringify([...(prev.characters || [])].sort()) === JSON.stringify([...(prevScene.characters || [])].sort())); const lightingFollows = !prev.lighting || prev.lighting === prevScene?.lighting; return { ...prev, sceneId: e.target.value, characters: inherited ? (next?.characters || []) : prev.characters, lighting: lightingFollows ? next?.lighting : prev.lighting }; }); }}><option value="" disabled>Select a scene</option>{scenes.map((scene, i) => <option key={scene.id} value={scene.id}>{sceneNumber(scene, i).padStart(2, "0")} · {scene.location} — {scene.time}</option>)}</select></Field>
        <Field label="What happens in this frame?"><textarea rows={3} placeholder="Describe the action, feeling, or visual..." value={draft.description} onChange={e => set("description", e.target.value)} /></Field>
        <div className="field"><span>Shot type</span><ShotTypePicker value={draft.shotType} onPick={type => setDraft(prev => applyShotType(prev, type))} compact /></div>
        {characters.length > 0 && <div className="field"><span>Who is in this shot?</span><div className="chip-row">{characters.map(c => { const active = (draft.characters || []).includes(c.id); return <button key={c.id} type="button" className={`chip chip-toggle ${active ? "chip-active" : ""}`} onClick={() => setDraft(prev => ({ ...prev, characters: active ? (prev.characters || []).filter(id => id !== c.id) : [...(prev.characters || []), c.id] }))}>{c.name}{active && <Check size={12} />}</button>; })}</div></div>}
        {characters.length > 0 && (() => { const lines = relationLines(project, draft.characters || []); return lines.length ? <div className="relation-context"><span className="eyebrow">RELATIONSHIPS IN THIS SHOT</span><div className="chip-row">{lines.map(line => <span key={line} className="chip chip-static"><Link2 size={11} />{line}</span>)}</div><small>The AI prompt describes how these people know each other.</small></div> : null; })()}
        <div className="fields-row"><Field label="Duration (seconds)"><input type="number" min="1" max="3600" required value={draft.duration} onChange={e => set("duration", Number(e.target.value))} /></Field><Field label="Status"><select value={draft.status} onChange={e => set("status", e.target.value as FrameStatus)}><option>Draft</option><option>Ready</option><option>Needs review</option></select></Field></div>
        <label className="estimate-checkbox"><input type="checkbox" checked={draft.durationIsEstimate || false} onChange={e => set("durationIsEstimate", e.target.checked)} /> Working duration estimate (not locked)</label>
        <button type="button" className="field-tip field-tip-button" onClick={() => setTab("shot")}><Camera size={17} /><p><strong>Shot design →</strong> Angle, lens, lighting and the cut into this shot.</p></button></div></div>}

    {tab === "shot" && <div className="modal-body shot-design"><Field label="Shot type" hint={usingReference ? "The frame image follows your choice while you're using a shot example. Upload your own image any time." : "You're using a custom image, so it stays put. Switch back to the example from the Frame tab if you prefer."}><ShotTypePicker value={draft.shotType} onChange={type => setDraft(prev => applyShotType(prev, type))} /></Field><div className="fields-row fields-row-3"><Field label="Camera angle"><select value={draft.angle || "Eye level"} onChange={e => set("angle", e.target.value as CameraAngle)}>{CAMERA_ANGLES.map(a => <option key={a}>{a}</option>)}</select></Field><Field label="Camera movement"><select value={draft.movement} onChange={e => set("movement", e.target.value as CameraMovement)}>{CAMERA_MOVEMENTS.map(m => <option key={m}>{m}</option>)}</select></Field><Field label="Lens"><select value={draft.lens || ""} onChange={e => set("lens", (e.target.value || undefined) as Lens | undefined)}><option value="">Director’s choice</option>{LENSES.map(l => <option key={l}>{l}</option>)}</select></Field></div><div className="field"><span>Lighting</span><LightingPicker value={draft.lighting} onChange={lighting => set("lighting", lighting)} /></div><Field label="Lighting direction" hint="Leave blank to inherit the scene direction; otherwise this replaces generic lighting prose in AI prompts."><textarea rows={3} maxLength={1000} placeholder={scenes.find(s => s.id === draft.sceneId)?.lightingNotes || "Specific practical sources and restrictions"} value={draft.lightingNotes || ""} onChange={e => set("lightingNotes", e.target.value || undefined)} /></Field><div className="fields-row"><Field label="Cut into this shot" hint="How we arrive here from the previous shot."><select value={draft.transition || ""} onChange={e => set("transition", (e.target.value || undefined) as Transition | undefined)}><option value="">Straight cut</option>{TRANSITIONS.map(t => <option key={t}>{t}</option>)}</select></Field><Field label="Mood in a few words"><input maxLength={300} placeholder="e.g. Quiet anticipation" value={draft.mood || ""} onChange={e => set("mood", e.target.value)} /></Field></div><div className="field-tip"><Camera size={17} /><p>Think in shots. Each frame is one camera setup and one piece of your story.</p></div></div>}

    {tab === "prompt" && <div className="modal-body prompt-panel">
      <div className="prompt-category-bar">
        <button type="button" className={`prompt-category-pill ${categoryFilter === "all" ? "active" : ""}`} onClick={() => setCategoryFilter("all")}>All Models ({PLATFORMS.length})</button>
        <button type="button" className={`prompt-category-pill ${categoryFilter === "image" ? "active" : ""}`} onClick={() => setCategoryFilter("image")}>AI Image Models ({PLATFORMS.filter(p => p.kind === "image").length})</button>
        <button type="button" className={`prompt-category-pill ${categoryFilter === "video" ? "active" : ""}`} onClick={() => setCategoryFilter("video")}>AI Video Models ({PLATFORMS.filter(p => p.kind === "video").length})</button>
      </div>

      <div className="field prompt-style-field"><span>Visual style</span><VisualStylePicker value={style} onChange={setStyle} /></div>

      <div className="prompt-toolbar">
        <div className="platform-picker" role="tablist" aria-label="Video model">
          {visiblePlatforms.map(p => (
            <button type="button" key={p.id} role="tab" aria-selected={platform === p.id} className={platform === p.id ? "active" : ""} onClick={() => setPlatform(p.id)}>
              {p.name}
              <span className={`prompt-model-badge ${p.kind}`}>{p.kind}</span>
            </button>
          ))}
        </div>
        <div className="prompt-actions-row">
          {hasNegative && positivePart && (
            <button type="button" className="button button-small" onClick={() => copyText(positivePart, "pos")}>
              {copiedKey === "pos" ? <CheckCheck size={14} /> : <ClipboardCopy size={14} />}
              {copiedKey === "pos" ? "Copied" : "Copy positive"}
            </button>
          )}
          {hasNegative && negativePart && (
            <button type="button" className="button button-small" onClick={() => copyText(negativePart, "neg")}>
              {copiedKey === "neg" ? <CheckCheck size={14} /> : <ClipboardCopy size={14} />}
              {copiedKey === "neg" ? "Copied" : "Copy negative"}
            </button>
          )}
          <button type="button" className="button button-primary" onClick={() => copyText(prompt, "all")}>
            {copiedKey === "all" ? <CheckCheck size={15} /> : <ClipboardCopy size={15} />}
            {copiedKey === "all" ? "Copied" : "Copy prompt"}
          </button>
        </div>
      </div>

      <p className="platform-hint">
        <Info size={13} />
        {currentModel?.hint}
        {currentModel?.aspectRatio && <span> · Aspect: <strong>{currentModel.aspectRatio}</strong></span>}
      </p>

      <textarea className="prompt-output" readOnly value={prompt} aria-label="Generated video prompt" rows={12} onFocus={e => e.target.select()} />

      <div className="prompt-includes">
        <span className="eyebrow">THIS PROMPT INCLUDES</span>
        <div className="chip-row">
          {[
            currentModel.name,
            currentModel.kind === "image" ? "Still image / Keyframe" : "Video motion",
            draft.shotType,
            draft.angle,
            draft.lens,
            currentModel.kind === "video" ? draft.movement : "",
            draft.lighting,
            draft.transition || "Cut in",
            currentModel.kind === "video" ? `${draft.duration}s` : "16:9 Aspect",
            (draft.characters || []).length ? `${(draft.characters || []).length} character${(draft.characters || []).length > 1 ? "s" : ""}` : "",
            "Scene setting",
            relationLines(project, draft.characters || []).length ? "Cast relationships" : "",
            "Next-shot continuity",
            "Style guide",
          ].filter(Boolean).map(item => <span key={item as string} className="chip">{item}</span>)}
        </div>
        <small>Edits on the other tabs update this prompt live. The storyboard’s <strong>AI prompts</strong> button builds the whole scene as one sequence.</small>
      </div>
    </div>}

    {error && <p className="form-error" role="alert">{error}</p>}<div className="modal-footer"><div className="footer-left">{!isNew && <><button type="button" className="icon-button danger-hover" aria-label="Delete frame" title="Delete frame" onClick={onDelete}><Trash2 size={17} /></button><button type="button" className="button button-ghost" onClick={onDuplicate}><Copy size={15} />Duplicate</button></>}</div><button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy || uploading}>{busy && <LoaderCircle size={15} className="spin" />}{isNew ? "Add to storyboard" : "Save changes"}</button></div></form></Modal>;
}
