"use client";

import { useEffect, useState } from "react";
import { Download, Film, LoaderCircle, X } from "lucide-react";
import type { FilmProject } from "@/lib/types";
import { animaticFrames, type AnimaticJobStatus, type AnimaticOptions } from "@/lib/animatic-options";
import { sceneNumber } from "@/lib/frame-order";
import { Field } from "./ui";

export function AnimaticExportPanel({ project }: { project: FilmProject }) {
  const [scope, setScope] = useState("all");
  const [sceneId, setSceneId] = useState(project.scenes[0]?.id || "");
  const [fromSceneId, setFrom] = useState(project.scenes[0]?.id || "");
  const [toSceneId, setTo] = useState(project.scenes.at(-1)?.id || "");
  const [resolution, setResolution] = useState<AnimaticOptions["resolution"]>("1080p");
  const [timing, setTiming] = useState<AnimaticOptions["timing"]>("playback");
  const [audio, setAudio] = useState(true);
  const [music, setMusic] = useState(false);
  const [subtitles, setSubtitles] = useState(false);
  const [job, setJob] = useState<AnimaticJobStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const storageKey = `frame-animatic-${project.id}`;
  const base = `/api/projects/${project.id}/animatic`;
  const jobId = job?.id, jobStatus = job?.status;
  const running = busy || jobStatus === "rendering";
  const settings: AnimaticOptions = {
    ...(scope === "scene" ? { sceneId } : scope === "range" ? { fromSceneId, toSceneId } : {}),
    resolution, timing, audio, music, subtitles: audio && subtitles,
  };
  const frames = animaticFrames(project, settings);
  const seconds = frames.reduce((sum, frame) => sum + frame.duration, 0);
  const supportsScore = project.scenes.some(scene => /^neonoire-s\d+[a-z]?$/i.test(scene.id));
  const sceneOptions = project.scenes.map((scene, index) => <option key={scene.id} value={scene.id}>{sceneNumber(scene, index)} · {scene.title}</option>);

  useEffect(() => {
    const id = sessionStorage.getItem(storageKey);
    if (!id) return;
    const controller = new AbortController();
    fetch(`${base}/jobs/${id}`, { cache: "no-store", signal: controller.signal }).then(async response => {
      if (response.ok) setJob(await response.json()); else sessionStorage.removeItem(storageKey);
    }).catch(() => {});
    return () => controller.abort();
  }, [base, storageKey]);

  useEffect(() => {
    if (!jobId || jobStatus !== "rendering") return;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const response = await fetch(`${base}/jobs/${jobId}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to check the export.");
        setJob(data); setError("");
      } catch (cause) { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Connection interrupted; checking again."); }
    };
    void poll();
    const timer = setInterval(() => { void poll(); }, 1500);
    return () => { controller.abort(); clearInterval(timer); };
  }, [base, jobId, jobStatus]); // Progress updates don't restart the polling clock.

  async function start() {
    setBusy(true); setError("");
    try {
      const response = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start the export.");
      setJob(data); sessionStorage.setItem(storageKey, data.id);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Export could not be started."); }
    finally { setBusy(false); }
  }
  async function cancel() {
    if (!job) return;
    try {
      const response = await fetch(`${base}/jobs/${job.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to cancel.");
      setJob(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to cancel."); }
  }
  return <section className="animatic-export-panel" aria-label="Animatic export settings">
    <div className="field-tip"><Film size={18} /><p>A real MP4 from your saved shots, in screenplay scene order. Static images stay still; dialogue keeps its offsets. Rendering continues if you close this dialog.</p></div>
    <fieldset disabled={running} className="animatic-settings">
      <Field label="Animatic scope"><select value={scope} onChange={event => setScope(event.target.value)}><option value="all">Whole project</option><option value="scene">One scene</option><option value="range">Scene range</option></select></Field>
      {scope === "scene" && <Field label="Scene to export"><select value={sceneId} onChange={event => setSceneId(event.target.value)}>{sceneOptions}</select></Field>}
      {scope === "range" && <div className="fields-row"><Field label="First scene"><select value={fromSceneId} onChange={event => setFrom(event.target.value)}>{sceneOptions}</select></Field><Field label="Last scene"><select value={toSceneId} onChange={event => setTo(event.target.value)}>{sceneOptions}</select></Field></div>}
      <div className="fields-row"><Field label="Video resolution"><select value={resolution} onChange={event => setResolution(event.target.value as AnimaticOptions["resolution"])}><option value="1080p">1080p · Full HD</option><option value="720p">720p · Faster export</option></select></Field><Field label="Animatic timing"><select value={timing} onChange={event => setTiming(event.target.value as AnimaticOptions["timing"])}><option value="playback">Match storyboard playback</option><option value="tight">Tight cut · Shorter silent holds</option></select></Field></div>
      <div className="animatic-checks"><label><input type="checkbox" checked={audio} onChange={event => setAudio(event.target.checked)} />Recorded dialogue</label><label><input type="checkbox" checked={subtitles && audio} disabled={!audio} onChange={event => setSubtitles(event.target.checked)} />Dialogue subtitles</label>{supportsScore && <label><input type="checkbox" checked={music} onChange={event => setMusic(event.target.checked)} />Include configured score</label>}</div>
    </fieldset>
    <p className="animatic-summary">{frames.length} shots · {Math.floor(seconds / 60)}m {Math.round(seconds % 60)}s of board holds · 24 fps{timing === "tight" ? " · Silent holds shortened in the export" : ""}</p>
    {job && <div className="animatic-progress" role="status" aria-live="polite">
      {job.status === "rendering" ? <><div><LoaderCircle size={16} className="spin" /><strong>{job.phase === "mixing" ? "Finishing picture and sound…" : `Rendering shot ${Math.min(job.completed + 1, job.total)} of ${job.total}…`}</strong></div><progress value={job.completed} max={job.total} aria-label="Animatic rendering progress" /><button type="button" className="text-button" onClick={() => { void cancel(); }}><X size={13} />Cancel export</button></> : job.status === "complete" ? <><strong>Your {job.total}-shot animatic is ready.</strong><a className="button button-primary" href={`${base}/jobs/${job.id}/download`} download={job.filename}><Download size={15} />Download MP4</a></> : <p>{job.status === "cancelled" ? "Export cancelled. Your shots are unchanged." : job.error || "Rendering failed. Try again."}</p>}
    </div>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {!running && <button type="button" className="button button-primary" disabled={!frames.length} onClick={() => { void start(); }}><Film size={15} />{job ? "Render another animatic" : "Render animatic MP4"}</button>}
  </section>;
}
