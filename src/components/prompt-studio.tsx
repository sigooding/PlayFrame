"use client";

import { useState } from "react";
import { Check, CheckCheck, ClipboardCopy, Info, Pencil, Plus, Sparkles } from "lucide-react";
import type { FilmProject, StoryFrame } from "@/lib/types";
import { downloadFile, slugify } from "@/lib/export";
import { onImageError } from "@/lib/image";
import { VisualStylePicker } from "./style-picker";
import { DEFAULT_STYLE_ID, VISUAL_STYLES, visualStyle } from "@/lib/styles";
import { buildFramePrompt, PLATFORMS, type PlatformId, type PlatformKind } from "@/lib/prompt";

const LS_STYLE = "frame-last-style";
const LS_PLATFORM = "frame-last-platform";

const hasStyle = (id?: string | null) => !!id && VISUAL_STYLES.some(s => s.id === id);
const readLS = (key: string) => { try { return typeof window !== "undefined" ? localStorage.getItem(key) : null; } catch { return null; } };
const writeLS = (key: string, value: string) => { try { if (typeof window !== "undefined") localStorage.setItem(key, value); } catch { /* ignore */ } };

/**
 * The Prompt Studio: pick shots, a look and a model, then copy every prompt at once. The chosen
 * visual style is persisted onto the selected shots (and remembered for next time), so a
 * storyboard keeps its look across sessions. Used both as a top-level tab and inside a modal.
 */
export function PromptStudio({ project, initialSceneId, onApplyStyle, onAddShot, onEditShot, onClose }: {
  project: FilmProject;
  initialSceneId?: string;
  onApplyStyle: (frameIds: string[], styleId: string) => void;
  onAddShot?: (sceneId?: string) => void;
  onEditShot?: (frame: StoryFrame) => void;
  onClose?: () => void;
}) {
  const [sceneId, setSceneId] = useState(initialSceneId || project.scenes[0]?.id || "");
  const [categoryFilter, setCategoryFilter] = useState<"all" | PlatformKind>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [scope, setScope] = useState<"scene" | "project">("scene");
  const [selected, setSelected] = useState<string[] | null>(null);
  const [styleOverride, setStyleOverride] = useState<string | null>(null);
  const [rememberedStyle] = useState<string | null>(() => { const s = readLS(LS_STYLE); return hasStyle(s) ? s : null; });
  const [platform, setPlatform] = useState<PlatformId>(() => {
    const saved = readLS(LS_PLATFORM) as PlatformId | null;
    return saved && PLATFORMS.some(p => p.id === saved) ? saved : "seedance";
  });

  const scene = project.scenes.find(s => s.id === sceneId);
  const scopeFrames = scope === "project" ? project.frames : project.frames.filter(f => f.sceneId === sceneId);
  const selectedIds = selected ?? scopeFrames.map(f => f.id);
  const chosen = scopeFrames.filter(f => selectedIds.includes(f.id));
  const currentModel = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];

  // Effective style: an explicit pick, else the shots' persisted style, else the scene's, else
  // the last one remembered, else the default. Derived during render so it tracks scope/scene.
  const frameStyle = scopeFrames.find(f => hasStyle(f.style))?.style;
  const sceneStyle = hasStyle(scene?.style) ? scene!.style : undefined;
  const style = styleOverride ?? frameStyle ?? sceneStyle ?? rememberedStyle ?? DEFAULT_STYLE_ID;
  const styleName = visualStyle(style).name;

  const toggle = (id: string) => setSelected(prev => {
    const cur = prev ?? scopeFrames.map(f => f.id);
    return cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
  });

  function pickPlatform(id: PlatformId) {
    setPlatform(id);
    writeLS(LS_PLATFORM, id);
  }

  function changeStyle(id: string) {
    setStyleOverride(id);
    writeLS(LS_STYLE, id);
    if (selectedIds.length) onApplyStyle(selectedIds, id);
  }

  const shotBlock = (f: StoryFrame, i: number) => `=== SHOT ${i + 1}: ${f.title} (${f.shotType}) ===\n${buildFramePrompt(project, f, platform, style)}`;
  const combined = [
    `${project.title.toUpperCase()} — ${currentModel?.name} · ${styleName} · ${scope === "project" ? "WHOLE PROJECT" : (scene?.title || "Scene").toUpperCase()}`,
    "",
    ...chosen.map((f, i) => shotBlock(f, i)),
  ].join("\n\n");

  async function copy(text: string, key: string) {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch { /* fallback */ }
  }

  function downloadAll() {
    const isImage = currentModel?.kind === "image";
    const body = [
      `${project.title.toUpperCase()} — ${isImage ? "AI IMAGE & STORYBOARD PROMPTS" : "AI VIDEO PROMPTS"} (${currentModel?.name} · ${styleName})`,
      "",
      ...chosen.flatMap((f, i) => [shotBlock(f, i), ""]),
    ].join("\n");
    downloadFile(body, `${slugify(project.title)}-${scope === "project" ? "project" : slugify(scene?.title || "scene")}-prompts.txt`);
  }

  const visiblePlatforms = categoryFilter === "all" ? PLATFORMS : PLATFORMS.filter(p => p.kind === categoryFilter);

  return <>
    <div className="modal-body prompt-studio">
      <div className="prompt-category-bar">
        <button type="button" className={`prompt-category-pill ${categoryFilter === "all" ? "active" : ""}`} onClick={() => setCategoryFilter("all")}>All Models ({PLATFORMS.length})</button>
        <button type="button" className={`prompt-category-pill ${categoryFilter === "image" ? "active" : ""}`} onClick={() => setCategoryFilter("image")}>AI Image Models ({PLATFORMS.filter(p => p.kind === "image").length})</button>
        <button type="button" className={`prompt-category-pill ${categoryFilter === "video" ? "active" : ""}`} onClick={() => setCategoryFilter("video")}>AI Video Models ({PLATFORMS.filter(p => p.kind === "video").length})</button>
      </div>

      <div className="field prompt-style-field"><span>Visual style</span><VisualStylePicker value={style} onChange={changeStyle} /><small className="prompt-style-note">Saved to the {selectedIds.length} selected shot{selectedIds.length === 1 ? "" : "s"}.</small></div>

      <div className="prompt-toolbar">
        <div className="studio-scope">
          <div className="select-wrap"><select aria-label="Scope for prompts" value={scope} onChange={e => { setScope(e.target.value as "scene" | "project"); setSelected(null); setStyleOverride(null); }}><option value="scene">This scene</option><option value="project">Whole project</option></select></div>
          {scope === "scene" && <div className="select-wrap scene-filter"><select aria-label="Scene for prompts" value={sceneId} onChange={e => { setSceneId(e.target.value); setSelected(null); setStyleOverride(null); }}>{project.scenes.map((s, i) => <option key={s.id} value={s.id}>{String(i + 1).padStart(2, "0")} · {s.title} — {s.location}</option>)}</select></div>}
          {onAddShot && (
            <button
              type="button"
              className="button button-small prompt-add-shot-btn"
              onClick={() => onAddShot(scope === "scene" ? sceneId : undefined)}
              title="Add shot to this project or scene"
            >
              <Plus size={14} />
              Add shot
            </button>
          )}
        </div>
        <div className="platform-picker" role="tablist" aria-label="AI model">
          {visiblePlatforms.map(p => (
            <button type="button" key={p.id} role="tab" aria-selected={platform === p.id} className={platform === p.id ? "active" : ""} onClick={() => pickPlatform(p.id)}>
              {p.name}
              <span className={`prompt-model-badge ${p.kind}`}>{p.kind}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="platform-hint">
        <Info size={13} />
        {currentModel?.hint}
        {currentModel?.aspectRatio && <span> · Aspect: <strong>{currentModel.aspectRatio}</strong></span>}
        <span> · Style: <strong>{styleName}</strong></span>
      </p>

      {scopeFrames.length === 0 ? <div className="empty-state">
        <h3>No shots here yet.</h3>
        <p>Add frames to batch their prompts in the studio.</p>
        {onAddShot && <button type="button" className="button button-primary" onClick={() => onAddShot(scope === "scene" ? sceneId : undefined)}><Plus size={15} />Add shot</button>}
      </div> : <div className="studio-grid">
        <div className="studio-shots">
          <div className="studio-shots-head">
            <span className="eyebrow">SHOTS · {chosen.length}/{scopeFrames.length} selected</span>
            <span className="studio-shots-actions">
              {onAddShot && <button type="button" className="text-button prompt-studio-add-shot" onClick={() => onAddShot(scope === "scene" ? sceneId : undefined)} title="Add a shot"><Plus size={13} />Add shot</button>}
              <button type="button" className="text-button" onClick={() => setSelected(scopeFrames.map(f => f.id))}>All</button>
              <button type="button" className="text-button" onClick={() => setSelected([])}>None</button>
            </span>
          </div>
          <div className="studio-shot-list">
            {scopeFrames.map(f => {
              const on = selectedIds.includes(f.id);
              const sc = project.scenes.find(s => s.id === f.sceneId);
              return <div key={f.id} className={`studio-shot-item ${on ? "selected" : ""}`}>
                <button type="button" className="studio-shot-row" aria-pressed={on} onClick={() => toggle(f.id)}>
                  <img src={f.image || "/images/shots/wide.jpg"} alt="" onError={onImageError} />
                  <span className="studio-shot-text"><strong>{f.title}</strong><small>{scope === "project" && sc ? `${sc.title} · ` : ""}{f.shotType} · {f.duration}s{hasStyle(f.style) ? ` · ${visualStyle(f.style).name}` : ""}</small></span>
                  {on && <Check size={14} className="studio-shot-check" />}
                </button>
                {onEditShot && <button type="button" className="studio-shot-edit" aria-label={`Edit ${f.title}`} title={`Edit ${f.title}`} onClick={() => onEditShot(f)}><Pencil size={12} /></button>}
              </div>;
            })}
          </div>
        </div>

        <div className="studio-output">
          <div className="prompt-block-head">
            <div>
              <span className="eyebrow">{currentModel.kind === "image" ? "STILLS" : "SEQUENCE"} · {chosen.length} SHOT{chosen.length === 1 ? "" : "S"} · {styleName}</span>
              <h3>{scope === "project" ? "Whole project" : scene?.title}</h3>
            </div>
            <button type="button" className="button button-primary" onClick={() => copy(combined, "all")}>
              {copied === "all" ? <CheckCheck size={15} /> : <ClipboardCopy size={15} />}
              {copied === "all" ? "Copied" : "Copy batch"}
            </button>
          </div>
          <textarea className="prompt-output studio-output-text" readOnly rows={16} value={combined} aria-label="Combined prompts for the selected shots" onFocus={e => e.target.select()} />
        </div>
      </div>}
    </div>
    <div className="modal-footer">
      <span className="footer-left export-meta"><Sparkles size={13} /> Prompts update as you change the style, model, or selection. The look is saved to your shots.</span>
      {chosen.length > 0 && <button type="button" className="button" onClick={downloadAll}>Download batch as .txt</button>}
      {onClose && <button type="button" className="button button-primary" onClick={onClose}>Done</button>}
    </div>
  </>;
}
