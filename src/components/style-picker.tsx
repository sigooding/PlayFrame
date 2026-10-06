"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { VISUAL_STYLES, visualStyle, type VisualStyleEntry } from "@/lib/styles";

/** One style tile. If the example image isn't on disk yet the tile shows its palette instead of a broken image. */
function StyleThumb({ entry, active, onPick }: { entry: VisualStyleEntry; active: boolean; onPick: (id: string) => void }) {
  const [missing, setMissing] = useState(false);
  return <button type="button" className={`lighting-option style-option ${active ? "selected" : ""}`} aria-pressed={active} aria-label={`${entry.name} style`} title={`${entry.summary} ${entry.useFor}`} onClick={() => onPick(entry.id)}>
    <span className="lighting-thumb style-thumb" style={{ background: entry.swatch }}>
      {!missing && <img src={entry.image} alt="" loading="lazy" onError={() => setMissing(true)} />}
      {active && <span className="shot-check"><Check size={13} /></span>}
    </span>
    <strong>{entry.name}</strong>
  </button>;
}

/** The reusable visual-style library — each look steers how image and video models render a shot. */
export function VisualStylePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const selected = visualStyle(value);
  return <div className="lighting-picker style-picker">
    <div className="lighting-grid style-grid">
      {VISUAL_STYLES.map(entry => <StyleThumb key={entry.id} entry={entry} active={entry.id === selected.id} onPick={onChange} />)}
    </div>
    <div className="shot-summary lighting-summary style-summary">
      <Info size={15} />
      <div><strong>{selected.name}</strong> — {selected.summary} <span>Use it for: {selected.useFor}</span></div>
    </div>
  </div>;
}
