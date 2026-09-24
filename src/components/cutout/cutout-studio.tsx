"use client";
/*
 * The cutout controller is an imperative, mutable, per-frame-updated game-loop
 * object (mutated inside requestAnimationFrame callbacks). React's "don't mutate
 * state in callbacks" and "don't access refs during render" heuristics don't
 * apply to this class of object — the eslint rules below are intentionally
 * relaxed for this file.
 */
/* eslint-disable react-hooks/refs, react-hooks/exhaustive-deps */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CutoutCharacter } from "@/lib/cutout/character";
import { buildPlaceholderClips, buildPlaceholderRig, buildDemoLipSync } from "@/lib/cutout/placeholder";
import { CharacterCanvas } from "./character-canvas";
import { LipSyncEditor } from "./lipsync-editor";
import { BufferPlayback, autoLipSyncFromAudio, synthesizeDemoVoice } from "@/lib/cutout/audio";
import type { LipSyncTrack, Viseme } from "@/lib/cutout/types";
import { Pause, Play, SkipBack } from "lucide-react";

/**
 * Top-level demo/editor for the cutout character system.
 *
 * Showcases:
 *   - idle / walk / run / talk / walk+talk / run+talk
 *   - directional movement (WASD/arrows, or button controls)
 *   - voice-over playback with lip-sync (synthetic demo voice)
 *   - pause / resume / seek / scrub
 *   - manual editing of viseme events on a timeline
 *   - automatic lip-sync generation from AudioBuffer
 *   - stepped visual FPS slider (so you can see the "limited animation" look)
 *   - debug overlay with current state, facing, viseme, frame
 */
export function CutoutStudio() {
  // Build character once per mount. Game-loop controller — intentionally kept
  // in a ref so React never snapshots/re-creates this mutable object.
  const initialTrack = useMemo(() => buildDemoLipSync(), []);
  const characterRef = useRef<CutoutCharacter | null>(null);
  if (characterRef.current === null) {
    const rig = buildPlaceholderRig();
    const clips = buildPlaceholderClips();
    const ch = new CutoutCharacter({ rig, clips, initialState: "idle" });
    ch.position = { x: 0, y: 0 };
    characterRef.current = ch;
  }
  const character = characterRef.current;

  // Input state.
  const keys = useRef<Record<string, boolean>>({});
  const [state, setState] = useState({
    mode: "idle" as "idle" | "walk" | "run" | "talk" | "auto",
    talking: false,
    visualFps: 12,
    showDebug: true,
    facing: "front" as const,
  });
  const [lipTrack, setLipTrack] = useState<LipSyncTrack>(initialTrack);
  const [voState, setVoState] = useState<{ playing: boolean; currentTime: number; duration: number }>({
    playing: false, currentTime: 0, duration: initialTrack.duration,
  });
  const [hud, setHud] = useState({ stateName: "idle" as string, viseme: "—", layers: {} as Record<string, { clip?: string; frame: number; frameCount: number }> });

  // Audio context + playback (lazy init — browsers require user gesture).
  const audioRef = useRef<{ ctx: AudioContext; playback: BufferPlayback } | null>(null);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const buf = synthesizeDemoVoice(ctx, { duration: initialTrack.duration });
    const pb = new BufferPlayback(ctx, buf);
    pb.onEnded = () => setVoState(s => ({ ...s, playing: false }));
    audioRef.current = { ctx, playback: pb };
    return audioRef.current;
  }, [initialTrack.duration]);

  // Apply visual FPS clip-wide on all clips (affects stepped sampling).
  useEffect(() => {
    const ch = character;
    for (const c of ch.allClips()) {
      if (c.id === "idle" || c.id === "walk" || c.id === "run" || c.id === "talk" || c.id === "mumble") {
        c.visualFps = state.visualFps;
      }
    }
  }, [state.visualFps]);

  // Keyboard handling for movement testing.
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up   = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const hudAccum = useRef(0);
  // Per-frame tick callback.
  const update = useCallback((dt: number) => {
    const ch = character;
    const k = keys.current;
    let vx = 0, vy = 0;
    if (state.mode === "auto") {
      if (k["arrowleft"] || k["a"]) vx -= 1;
      if (k["arrowright"] || k["d"]) vx += 1;
      if (k["arrowup"] || k["w"]) vy -= 1;
      if (k["arrowdown"] || k["s"]) vy += 1;
      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy); vx /= len; vy /= len;
        const speed = k["shift"] ? 200 : 110;
        vx *= speed; vy *= speed;
      }
    } else if (state.mode === "walk") {
      vx = 90;
    } else if (state.mode === "run") {
      vx = 180;
    }

    // Map local velocity (right = +x) to our facing system.
    // Also drive position so the character moves across the screen a little.
    const moveX = vx * dt * 0.15;
    ch.position.x = Math.max(-160, Math.min(160, ch.position.x + moveX));

    // Voice-over binding.
    const pb = audioRef.current?.playback ?? null;
    const voiceOver = (state.talking && pb) ? {
      track: lipTrack,
      playback: { currentTime: pb.currentTime, playing: pb.playing, duration: pb.duration },
    } : undefined;

    ch.tick(dt, {
      velocity: { x: vx, y: vy },
      voiceOver,
      facingOverride: (state.mode !== "auto") ? state.facing : undefined,
      stateOverride: state.mode === "talk" ? "talk" : undefined,
    });

    if (pb) setVoState({ playing: pb.playing, currentTime: pb.currentTime, duration: pb.duration });
    // Throttled HUD update for the sidebar — renders at ~10hz.
    hudAccum.current += dt;
    if (hudAccum.current > 0.1) {
      hudAccum.current = 0;
      const viseme = ch.voiceTrack && ch.voicePlayback
        ? (ch.voiceTrack.events.slice().reverse().find(e => e.t <= ch.voicePlayback!.currentTime)?.viseme ?? "neutral")
        : "—";
      setHud({ stateName: ch.currentState, viseme, layers: ch.lastFrameInfo });
    }
  }, [lipTrack, state]);

  const togglePlay = useCallback(() => {
    const a = ensureAudio();
    if (a.playback.playing) a.playback.pause();
    else a.playback.play();
    setVoState(s => ({ ...s, playing: a.playback.playing }));
    setState(s => ({ ...s, talking: true }));
  }, [ensureAudio]);

  const stopVoice = useCallback(() => {
    const a = audioRef.current;
    if (a) a.playback.stop();
    setVoState(s => ({ ...s, playing: false, currentTime: 0 }));
    setState(s => ({ ...s, talking: false }));
  }, []);

  const seekVoice = useCallback((t: number) => {
    const a = ensureAudio();
    a.playback.seek(t);
    setVoState({ playing: a.playback.playing, currentTime: a.playback.currentTime, duration: a.playback.duration });
  }, [ensureAudio]);

  const runAutoLipSync = useCallback(() => {
    const a = ensureAudio();
    // Regenerate a buffer for analysis. In production, cache the AudioBuffer alongside
    // the audio asset so auto-analysis only runs once per clip.
    const buf = synthesizeDemoVoice(a.ctx, { duration: lipTrack.duration });
    const generated = autoLipSyncFromAudio(buf, { audio: lipTrack.audio, id: lipTrack.id, language: "en" });
    setLipTrack(generated);
  }, [ensureAudio, lipTrack.audio, lipTrack.id, lipTrack.duration]);

  const visemesList: Viseme[] = ["neutral", "closed", "open", "wide", "round", "teeth", "FV", "narrow"];

  return (
    <div className="cutout-studio">
      <header className="cutout-header">
        <div>
          <span className="eyebrow">CUTOUT CHARACTER SYSTEM</span>
          <h2>2D Paper Animation Sandbox</h2>
          <p className="cutout-lede">
            Original placeholder rig — no copyrighted assets. Hierarchical parts, pivoted joints,
            stepped clips, layered animation (base / body / face / lip), velocity-driven state
            selection, directional poses, and audio-timestamp-driven lip-sync.
          </p>
        </div>
        <div className="cutout-stat" aria-label="Runtime status">
          <span className="cutout-stat-label">state</span>
          <strong>{hud.stateName}</strong>
          <span className="cutout-stat-label">viseme</span>
          <strong>{hud.viseme}</strong>
        </div>
      </header>

      <section className="cutout-grid">
        <div className="cutout-stage">
          <CharacterCanvas
            character={character}
            width={640}
            height={420}
            update={update}
            background="#eef1e7"
            debug={{ showPivots: state.showDebug, showStateLabel: state.showDebug }}
          />
          <div className="cutout-controls">
            <button className={`button ${state.mode === "idle" ? "button-primary" : ""}`} onClick={() => setState(s => ({ ...s, mode: "idle", facing: "front" }))}>Idle</button>
            <button className={`button ${state.mode === "walk" ? "button-primary" : ""}`} onClick={() => setState(s => ({ ...s, mode: "walk" }))}>Walk →</button>
            <button className={`button ${state.mode === "run"  ? "button-primary" : ""}`} onClick={() => setState(s => ({ ...s, mode: "run" }))}>Run →</button>
            <button className={`button ${state.mode === "talk" ? "button-primary" : ""}`} onClick={() => setState(s => ({ ...s, mode: "talk", talking: true }))}>Talk</button>
            <button className={`button ${state.mode === "auto" ? "button-primary" : ""}`} onClick={() => setState(s => ({ ...s, mode: "auto" }))}>WASD drive</button>
            <span className="cutout-divider" />
            <DirectionPicker facing={state.facing} onChange={f => setState(s => ({ ...s, facing: f }))} />
            <span className="cutout-divider" />
            <label className="cutout-fps">
              Visual FPS
              <input
                type="range" min={2} max={30} step={1}
                value={state.visualFps}
                onChange={e => setState(s => ({ ...s, visualFps: parseInt(e.target.value, 10) }))}
              />
              <strong>{state.visualFps}</strong>
            </label>
            <label className="cutout-check">
              <input type="checkbox" checked={state.showDebug} onChange={e => setState(s => ({ ...s, showDebug: e.target.checked }))} />
              Debug overlay
            </label>
          </div>
        </div>

        <aside className="cutout-side">
          <h3>Voice-over / lip-sync</h3>
          <p className="cutout-help">
            Uses the audio playback clock as the source of truth. Pause, seek and resume stay in
            sync automatically. Synthetic test voice — no audio assets are shipped.
          </p>
          <div className="cutout-transport">
            <button className="button" onClick={togglePlay}>
              {voState.playing ? <Pause size={14} /> : <Play size={14} />}
              {voState.playing ? "Pause" : "Play"}
            </button>
            <button className="button button-ghost" onClick={stopVoice}><SkipBack size={14} />Stop</button>
            <span className="cutout-time">{voState.currentTime.toFixed(2)}s / {voState.duration.toFixed(2)}s</span>
          </div>
          <LipSyncEditor
            track={lipTrack}
            currentTime={voState.currentTime}
            playing={voState.playing}
            onSeek={seekVoice}
            onChange={setLipTrack}
          />
          <div className="cutout-viseme-picker">
            <span className="eyebrow">PAINT VISIMES</span>
            <div className="cutout-visemes">
              {visemesList.map(v => (
                <button key={v} className="button button-small cutout-viseme" onClick={() => paintViseme(lipTrack, voState.currentTime, v, setLipTrack)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="cutout-actions">
            <button className="button" onClick={runAutoLipSync}>Auto-analyze audio</button>
            <button className="button button-ghost" onClick={() => setLipTrack(buildDemoLipSync())}>Reset timeline</button>
          </div>

          <h3 style={{ marginTop: 18 }}>Rig / layers</h3>
          <ul className="cutout-layers">
            {(["base", "body", "face", "lip"] as const).map(l => {
              const info = hud.layers[l];
              return (<li key={l}>
                <span>{l}</span>
                <code>
                  {info?.clip ?? "—"}
                  {info && info.frameCount > 0 ? ` · frame ${info.frame + 1}/${info.frameCount}` : ""}
                </code>
              </li>);
            })}
          </ul>

          <h3 style={{ marginTop: 18 }}>How to test</h3>
          <ol className="cutout-howto">
            <li>Click <b>Play</b> to start the synthesized voice — the mouth shapes track the audio clock.</li>
            <li>Scrub the timeline, pause, or resume; the viseme stays correct.</li>
            <li>Click <b>Walk →</b> or <b>Run →</b> and then <b>Play</b> to see walk + talk layered.</li>
            <li>Pick a direction (Front/Back/Left/Right) to test directional poses.</li>
            <li>Adjust <b>Visual FPS</b> to taste (2 fps looks very chunky; 30 looks smooth).</li>
            <li>Click a <b>viseme button</b> at the current playhead to paint manual corrections.</li>
            <li>Hit <b>Auto-analyze audio</b> to regenerate the timeline from the audio buffer.</li>
            <li>Use <b>WASD drive</b> (hold Shift to run) to test velocity-driven state selection.</li>
          </ol>
        </aside>
      </section>
    </div>
  );
}

function DirectionPicker({ facing, onChange }: { facing: string; onChange: (f: any) => void }) {
  const dirs: { id: any; label: string }[] = [
    { id: "front", label: "Front" }, { id: "back", label: "Back" },
    { id: "left", label: "Left" }, { id: "right", label: "Right" },
  ];
  return (
    <div className="cutout-dirs">
      {dirs.map(d => (
        <button key={d.id} className={`button button-small ${facing === d.id ? "button-primary" : ""}`} onClick={() => onChange(d.id)}>
          {d.label}
        </button>
      ))}
    </div>
  );
}

function currentViseme(c: CutoutCharacter): string {
  if (!c.voiceTrack || !c.voicePlayback) return "—";
  const t = c.voicePlayback.currentTime;
  const ev = c.voiceTrack.events.slice().reverse().find(e => e.t <= t);
  return ev?.viseme ?? "neutral";
}

function paintViseme(track: LipSyncTrack, t: number, viseme: Viseme, set: (t: LipSyncTrack) => void) {
  // Replace the event at (or just before) playhead, or insert a new one if within 80ms of the next event.
  const events = [...track.events];
  let idx = -1;
  for (let i = 0; i < events.length; i++) if (events[i].t <= t) idx = i; else break;
  const next = events[idx + 1];
  if (idx >= 0 && Math.abs(events[idx].t - t) < 0.1) {
    events[idx] = { ...events[idx], viseme };
  } else if (next && next.t - t < 0.1) {
    events[idx + 1] = { ...next, viseme };
  } else {
    events.push({ t: Math.max(0, Math.min(t, track.duration)), viseme });
    events.sort((a, b) => a.t - b.t);
  }
  set({ ...track, events });
}
