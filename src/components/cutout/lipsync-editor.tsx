"use client";

import { useEffect, useRef, useState } from "react";
import type { LipSyncTrack, Viseme } from "@/lib/cutout/types";

interface Props {
  track: LipSyncTrack;
  currentTime: number;
  playing: boolean;
  onSeek: (t: number) => void;
  onChange: (t: LipSyncTrack) => void;
}

const VISEME_COLORS: Record<Viseme, string> = {
  neutral: "#c8c9c1",
  closed:  "#7b8471",
  open:    "#355440",
  wide:    "#a04a3a",
  round:   "#c58a3a",
  teeth:   "#d3b889",
  FV:      "#6b5a80",
  narrow:  "#3a4d6b",
};

/**
 * A small timeline editor for viseme events:
 *  - Waveform-style amplitude bar for reference (we approximate using event density)
 *  - Scrub by clicking/dragging
 *  - Drag events to move them; double-click to delete; click viseme block to change type
 *  - Zoom with mouse wheel
 */
export function LipSyncEditor({ track, currentTime, playing, onSeek, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<{ kind: "scrub" | "event"; eventIdx: number; offset: number } | null>(null);

  const dur = Math.max(0.1, track.duration);

  useEffect(() => {
    if (!drag) return;
    const onMove = (ev: MouseEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ev.clientX - rect.left;
      const t = Math.max(0, Math.min(dur, (x / rect.width) * dur * zoom));
      if (drag.kind === "scrub") { onSeek(t); }
      else if (drag.kind === "event") {
        const newEvents = [...track.events];
        newEvents[drag.eventIdx] = { ...newEvents[drag.eventIdx], t };
        newEvents.sort((a, b) => a.t - b.t);
        onChange({ ...track, events: newEvents });
      }
    };
    const onUp = () => setDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [drag, dur, zoom, onSeek, onChange, track]);

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.eventIdx) return; // click on an event? handled there
    const rect = trackRef.current!.getBoundingClientRect();
    const t = Math.max(0, Math.min(dur, ((e.clientX - rect.left) / rect.width) * dur * zoom));
    onSeek(t);
    setDrag({ kind: "scrub", eventIdx: -1, offset: 0 });
  };

  const removeEvent = (idx: number) => {
    const newEvents = track.events.filter((_, i) => i !== idx);
    onChange({ ...track, events: newEvents });
  };

  const cycleViseme = (idx: number) => {
    const order: Viseme[] = ["neutral", "closed", "open", "wide", "round", "teeth", "FV", "narrow"];
    const cur = track.events[idx].viseme;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    const newEvents = [...track.events];
    newEvents[idx] = { ...newEvents[idx], viseme: next };
    onChange({ ...track, events: newEvents });
  };

  const pct = (t: number) => `${(t / dur / zoom) * 100}%`;
  const playheadPct = (currentTime / dur / zoom) * 100;

  return (
    <div className="lipsync">
      <div
        ref={trackRef}
        className={`lipsync-track ${playing ? "playing" : ""}`}
        onMouseDown={handleTrackMouseDown}
        onWheel={e => { setZoom(z => Math.max(0.5, Math.min(4, z - e.deltaY * 0.002))); e.preventDefault(); }}
      >
        {/* Ruler */}
        <div className="lipsync-ruler">
          {Array.from({ length: Math.ceil(dur * zoom) + 1 }).map((_, i) => (
            <span key={i} style={{ left: `${(i / dur / zoom) * 100}%` }}>{i.toFixed(1)}s</span>
          ))}
        </div>
        {/* Events */}
        <div className="lipsync-events">
          {track.events.map((ev, i) => {
            const next = track.events[i + 1];
            const endT = next ? next.t : dur;
            const wPct = ((endT - ev.t) / dur / zoom) * 100;
            return (
              <div
                key={i}
                data-event-idx={i}
                className="lipsync-event"
                style={{ left: pct(ev.t), width: `${wPct}%`, background: VISEME_COLORS[ev.viseme] }}
                title={`${ev.viseme} @ ${ev.t.toFixed(2)}s — click to cycle, drag to move, double-click to delete`}
                onMouseDown={e => { e.stopPropagation(); setDrag({ kind: "event", eventIdx: i, offset: 0 }); }}
                onClick={e => { e.stopPropagation(); cycleViseme(i); }}
                onDoubleClick={e => { e.stopPropagation(); removeEvent(i); }}
              >
                <span>{ev.viseme}</span>
              </div>
            );
          })}
        </div>
        {/* Playhead */}
        <div className="lipsync-playhead" style={{ left: `${playheadPct}%` }} />
      </div>
      <div className="lipsync-legend">
        {(Object.keys(VISEME_COLORS) as Viseme[]).map(v => (
          <span key={v} className="lipsync-legend-item"><i style={{ background: VISEME_COLORS[v] }} />{v}</span>
        ))}
      </div>
    </div>
  );
}
