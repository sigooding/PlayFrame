"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { LIGHTING, type Lighting } from "@/lib/types";
import { lightingGuide } from "@/lib/lighting";

/** One lighting reference tile. If the photograph isn't on disk yet the tile shows its palette instead of a broken image. */
function LightingThumb({ value, active, onPick }: { value: Lighting; active: boolean; onPick: (lighting: Lighting) => void }) {
  const entry = lightingGuide[value];
  const [missing, setMissing] = useState(false);
  return <button type="button" className={`lighting-option ${active ? "selected" : ""}`} aria-pressed={active} aria-label={`${value} lighting`} title={`${entry.summary} ${entry.useFor}`} onClick={() => onPick(value)}>
    <span className="lighting-thumb" style={{ background: entry.swatch }}>
      {!missing && <img src={entry.image} alt="" loading="lazy" onError={() => setMissing(true)} />}
      {active && <span className="shot-check"><Check size={13} /></span>}
    </span>
    <strong>{value}</strong>
  </button>;
}

/** The lighting library — eight looks, plus letting the scene's time of day decide. */
export function LightingPicker({ value, onChange }: { value?: Lighting; onChange: (lighting: Lighting | undefined) => void }) {
  const selected = value ? lightingGuide[value] : undefined;
  return <div className="lighting-picker">
    <div className="lighting-grid">
      <button type="button" className={`lighting-option ${!value ? "selected" : ""}`} aria-pressed={!value} aria-label="Match the scene lighting" title="Let the scene's time of day decide the light." onClick={() => onChange(undefined)}>
        <span className="lighting-thumb" style={{ background: "linear-gradient(135deg,#faf7ec,#e6ecd9 55%,#cbd8c5)" }}>{!value && <span className="shot-check"><Check size={13} /></span>}</span>
        <strong>Match the scene</strong>
      </button>
      {LIGHTING.map(item => <LightingThumb key={item} value={item} active={item === value} onPick={onChange} />)}
    </div>
    <div className="shot-summary lighting-summary">
      <Info size={15} />
      {selected
        ? <div><strong>{value}</strong> — {selected.summary} <span>Use it for: {selected.useFor}</span></div>
        : <div><strong>Match the scene</strong> — the light follows the scene&apos;s time of day, so morning reads as morning. <span>Pick a look to pin the lighting for this shot.</span></div>}
    </div>
  </div>;
}
