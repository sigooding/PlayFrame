"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X, Volume2, VolumeX, Maximize2 } from "lucide-react";
import type { FilmProject, StoryFrame } from "@/lib/types";
import { IconButton } from "./ui";
import { onImageError } from "@/lib/image";
import { framesInSceneOrder, sceneNumber, shotNumber } from "@/lib/frame-order";

export function StoryboardPlayer({ project, frames: suppliedFrames, onClose }: { project: FilmProject; frames: StoryFrame[]; onClose: () => void }) {
  const frames = useMemo(() => framesInSceneOrder(suppliedFrames, project.scenes), [suppliedFrames, project.scenes]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const elapsedRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frame = frames[index];
  const sceneIndex = project.scenes.findIndex(s => s.id === frame?.sceneId);
  const scene = project.scenes[sceneIndex];
  const hasAudio = frames.some(f => f.audio?.length);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  // Dialogue: while a frame is playing, each of its lines starts at its offset. Pausing, muting or
  // moving to another frame stops them, and resuming re-schedules from where the frame is now.
  useEffect(() => {
    if (!playing || muted || !frame?.audio?.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const players: HTMLAudioElement[] = [];
    const now = elapsedRef.current;
    for (const clip of frame.audio) {
      const player = new Audio(clip.src);
      player.volume = Math.min(1, Math.max(0, clip.gain ?? 1));
      players.push(player);
      const start = () => { player.currentTime = Math.max(0, elapsedRef.current - clip.offset); player.play().catch(() => {}); };
      const end = clip.offset + (clip.duration ?? 0);
      if (clip.offset <= now) { if (!clip.duration || now < end) start(); }
      else timers.push(setTimeout(start, (clip.offset - now) * 1000));
    }
    return () => { timers.forEach(clearTimeout); players.forEach(p => p.pause()); };
  }, [playing, muted, frame]);

  useEffect(() => {
    if (!playing || !frame) return;
    let previous = performance.now();
    const timer = setInterval(() => {
      const current = performance.now();
      const delta = (current - previous) / 1000;
      previous = current;
      setElapsed(value => {
        const nextElapsed = value + delta;
        if (nextElapsed >= frame.duration) {
          if (index < frames.length - 1) {
            setIndex(i => i + 1);
            return 0;
          } else {
            setPlaying(false);
            return frame.duration;
          }
        }
        return nextElapsed;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [playing, index, frame, frames.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    containerRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  if (!frame) return null;
  function jump(nextIndex: number) { setIndex(Math.max(0, Math.min(nextIndex, frames.length - 1))); setElapsed(0); }
  const next = () => jump(index + 1);
  const previous = () => jump(index - 1);
  function togglePlay() {
    if (index === frames.length - 1 && elapsed >= frame.duration) jump(0);
    setPlaying(value => !value);
  }

  return <div className="player" role="dialog" aria-modal="true" aria-label="Storyboard presentation" tabIndex={-1} ref={containerRef} onKeyDown={event => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    if (event.key === " ") { event.preventDefault(); togglePlay(); }
    if (event.key === "Tab") {
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (!buttons?.length) return;
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === containerRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}><header className="player-header"><div><span className="eyebrow">STORYBOARD PRESENTATION</span><h2>{project.title}</h2></div><div><span className="player-counter">{String(index + 1).padStart(2, "0")} <span>/ {String(frames.length).padStart(2, "0")}</span></span><IconButton label="Close presentation" onClick={onClose}><X size={23} /></IconButton></div></header><div className="player-stage"><IconButton label="Previous frame" onClick={previous} disabled={index === 0}><ChevronLeft size={30} /></IconButton><div className="player-image-wrap"><img key={frame.id} src={frame.image || "/images/coastal-road.jpg"} alt={frame.title} onError={onImageError} /><span className="player-scene">{scene ? `Scene ${sceneNumber(scene, sceneIndex)} · ${scene.location} — ${scene.time}` : "Unassigned"}</span><div className="player-progress"><span style={{ width: `${Math.min(100, elapsed / frame.duration * 100)}%` }} /></div></div><IconButton label="Next frame" onClick={next} disabled={index === frames.length - 1}><ChevronRight size={30} /></IconButton></div><div className="player-caption"><div><h3>Shot {shotNumber(frame, index)} · {frame.title}</h3><p>{frame.description}</p></div><div className="player-specs"><span>{frame.shotType}</span><span>{frame.movement}</span><span>{frame.durationIsEstimate ? "~" : ""}{frame.duration}s{frame.durationIsEstimate ? " estimate" : ""}</span></div></div><footer className="player-controls"><div className="player-dots">{frames.map((f, i) => <button key={f.id} className={i === index ? "active" : ""} aria-label={`Go to frame ${i + 1}`} onClick={() => jump(i)} />)}</div><button className="player-play" onClick={togglePlay}>{playing ? <Pause size={19} /> : <Play size={19} />}<span>{playing ? "Pause" : index === frames.length - 1 && elapsed >= frame.duration ? "Replay" : "Play"}</span></button><div className="player-help">{hasAudio ? <button type="button" className="player-mute" aria-pressed={muted} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}{muted ? "Sound off" : "Dialogue on"}</button> : <span><VolumeX size={15} />Visual preview</span>}<IconButton label="Toggle fullscreen" onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else containerRef.current?.requestFullscreen().catch(() => {}); }}><Maximize2 size={17} /></IconButton></div></footer></div>;
}
