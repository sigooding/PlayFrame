"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowRight, Crop, FileText, Images, LayoutGrid, LockKeyhole, Palette, Play, Timer, UserRound } from "lucide-react";
import type { FilmProject } from "@/lib/types";
import { FrameLogo } from "./ui";
import { RelationChips } from "./relations";
import { StoryboardPlayer } from "./storyboard-player";
import { printProject } from "@/lib/export";
import { onImageError, resolveImage, sweepBrokenImages } from "@/lib/image";
import { castLinks } from "@/lib/relations";
import { shotGuide } from "@/lib/shots";

export default function SharedProject({ project }: { project: FilmProject }) {
  const [tab, setTab] = useState("storyboard");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const links = castLinks(project.characters);
  // Broken pictures in the server HTML are repaired once React has hydrated.
  useEffect(() => { sweepBrokenImages(); }, []);
  return <div className="shared-page"><header className="shared-topbar"><FrameLogo /><span><LockKeyhole size={13} />Shared, read-only project</span><button className="button" onClick={() => { try { printProject(project, tab === "script" ? "script" : "storyboard"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to open print preview."); } }}><ArrowDownToLine size={15} />Print / Save PDF</button></header><main><div className="shared-heading"><span className="project-status-label"><span />A FILM IN THE MAKING</span><h1>{project.title}</h1><p>{project.description}</p><div className="project-meta"><span>{project.format}</span><span>·</span><span>{project.genre}</span><span>·</span><span>{project.scenes.length} scenes</span><span>·</span><span>{project.frames.length} frames</span></div></div><div className="shared-tabs"><button className={tab === "storyboard" ? "active" : ""} onClick={() => setTab("storyboard")}><LayoutGrid size={16} />Storyboard</button><button className={tab === "script" ? "active" : ""} onClick={() => setTab("script")}><FileText size={16} />Screenplay</button><button className={tab === "look" ? "active" : ""} onClick={() => setTab("look")}><Palette size={16} />Cast &amp; look</button><button className="button button-primary" disabled={!project.frames.length} onClick={() => setPlaying(true)}><Play size={15} />Play storyboard</button></div>{error && <p className="form-error">{error}</p>}{tab === "look" && <div className="shared-look">
      {project.scenes.filter(s => s.kind === "Cold open").length > 0 && <p className="shared-note"><strong>Cold open:</strong> this film opens before the titles.</p>}
      {links.length > 0 && <section><h2 className="shared-sub">Who knows who</h2><ul className="shared-links">{links.map(link => <li key={link.id} className={`tone-${link.tone}`}><span>{link.gist}</span>{link.notes[0] && <em>{link.notes[0]}</em>}</li>)}</ul></section>}
      {project.characters.length > 0 && <section><h2 className="shared-sub">The cast</h2><div className="shared-cast">{project.characters.map(c => <article key={c.id}><strong>{c.name}</strong><span>{c.role}{c.age ? ` · ${c.age}` : ""}</span><p>{c.description}</p>{c.traits.length > 0 && <div className="shared-traits">{c.traits.map(t => <span key={t}>{t}</span>)}</div>}<RelationChips character={c} characters={project.characters} /></article>)}</div></section>}
      {(project.moodboards || []).length > 0 && <section><h2 className="shared-sub">Mood boards</h2>{project.moodboards.map(board => <div key={board.id} className="shared-board"><div><h3>{board.title}</h3>{board.description && <p>{board.description}</p>}</div><div className="shared-mosaic">{board.items.map(item => <figure key={item.id}><img src={resolveImage(item.image)} alt={item.caption || board.title} onError={onImageError} />{item.caption && <figcaption>{item.caption}</figcaption>}</figure>)}</div></div>)}</section>}
      {(project.notes.length > 0) && <section><h2 className="shared-sub">Production notes</h2><div className="shared-notes">{project.notes.map(note => <article key={note.id} className={`shared-note-card ${note.color}`}><strong>{note.title}</strong><p>{note.content}</p>{note.tags?.length ? <div className="shared-traits">{note.tags.map(t => <span key={t}>{t}</span>)}</div> : null}</article>)}</div></section>}
      {!project.characters.length && !(project.moodboards || []).length && !project.notes.length && !links.length && <p className="shared-note">No references shared yet.</p>}
    </div>}
    {tab === "storyboard" ? <div className="shared-board-grid">{project.frames.map((frame, index) => <article className="shared-frame" key={frame.id}><div><img src={resolveImage(frame.image) || shotGuide[frame.shotType].image} alt={frame.title} onError={onImageError} /><span className="frame-number">{String(index + 1).padStart(2, "0")}</span><span className="frame-duration"><Timer size={12} />{frame.durationIsEstimate ? "~" : ""}{frame.duration}s</span></div><section><span className="scene-label">{project.scenes.find(s => s.id === frame.sceneId)?.location}</span><h2>{frame.title}</h2><p>{frame.description}</p><footer><span><Crop size={13} />{frame.shotType}</span><span><ArrowRight size={13} />{frame.movement}</span>{frame.lighting && <span><Palette size={13} />{frame.lighting}</span>}</footer>{frame.notes && <p className="shared-frame-note">{frame.notes}</p>}</section></article>)}</div> : tab === "script" ? <div className="shared-script"><pre>{project.script}</pre></div> : null}<footer className="shared-footer"><FrameLogo small /><p>Good stories deserve an audience.</p><span>Made with Frame · Shared with you</span></footer></main>{playing && <StoryboardPlayer project={project} frames={project.frames} onClose={() => setPlaying(false)} />}</div>;
}
