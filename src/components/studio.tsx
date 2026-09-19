"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Bell, BookOpen, Check, CheckCheck, ChevronDown, ChevronRight, ChevronsUpDown, CircleHelp, Clapperboard, Clock3, FileText, Film, FolderOpen, Images, LayoutGrid, LayoutTemplate, Leaf, Link2, LoaderCircle, LockKeyhole, Menu, MessageSquare, MoreHorizontal, PanelsTopLeft, Plus, Search, Settings2, Upload, Share2, Sparkles, Table2, UserCircle, WandSparkles, X } from "lucide-react";
import type { Act, FilmProject, MoodBoard, ProjectNote, ProjectPatch, Scene, StoryFrame, Character, BrainstormNode, CharacterRelation, RelationKind } from "@/lib/types";
import { shotGuide } from "@/lib/shots";
import { castLinks, converseRelation } from "@/lib/relations";
import { Avatar, FrameLogo, IconButton } from "./ui";
import { FrameDialog } from "./frame-dialog";
import { ActsDialog, ConfirmDialog, ExportDialog, HelpDialog, NoteDialog, ProfileDialog, ProjectDialog, PromptDialog, SceneDialog, SearchDialog, ShareDialog, type SearchTarget } from "./dialogs";
import { Storyboard, ShotList } from "./storyboard";
import { Screenplay } from "./screenplay";
import { NotesView, OverviewView, ProjectsView, TemplatesView } from "./project-views";
import { PromptStudio } from "./prompt-studio";
import { CharacterDialog } from "./character-dialog";
import { BrainstormDialog } from "./character-dialog";
import { BrainstormBoard } from "./brainstorm-board";
import { CharactersView } from "./character-views";
import { RelationsMap } from "./relations";
import { MoodboardsView, MoodBoardDialog } from "./moodboards";
import { StoryboardPlayer } from "./storyboard-player";
import { healProjectImages, onImageError, sweepBrokenImages } from "@/lib/image";
import { PROJECT_TABS, tabSlug } from "@/lib/tabs";

type Dialog = { type: "newProject"; template?: string } | { type: "projectSettings" } | { type: "frame"; frame: StoryFrame; isNew: boolean } | { type: "scene"; scene?: Scene } | { type: "note"; note?: ProjectNote } | { type: "character"; character?: Character } | { type: "brainstorm"; node?: BrainstormNode } | { type: "acts" } | { type: "prompts"; sceneId?: string } | { type: "moodboard"; board?: MoodBoard; isNew: boolean } | { type: "share" | "export" | "help" | "profile" | "search" };
type Screen = "project" | "projects" | "recent" | "templates";
type Toast = { text: string; error: boolean } | null;

const TAB_ICONS = { "Overview": PanelsTopLeft, "Screenplay": FileText, "Characters": UserCircle, "Relationships": Link2, "Storyboard": LayoutGrid, "Prompt Studio": WandSparkles, "Shot list": Table2, "Notes": MessageSquare, "Brainstorm": Sparkles, "Mood boards": Images };
const TABS = PROJECT_TABS.map(tab => ({ ...tab, icon: TAB_ICONS[tab.name] }));

/**
 * A relationship lives on both cards: "Thomas is Ella's parent" on hers, "Ella is Thomas's child"
 * on his. Writing through here keeps the two sides in step no matter which card was edited, and
 * replaces whatever either card used to say about the pair.
 */
function linkCharacters(characters: Character[], aId: string, bId: string, kind: RelationKind, note?: string): Character[] {
  const without = (list: CharacterRelation[] | undefined) => (list || []).filter(relation => relation.targetId !== aId && relation.targetId !== bId);
  return characters.map(character => {
    const kept = without(character.relations);
    if (character.id === aId) return { ...character, relations: [...kept, { id: crypto.randomUUID(), targetId: bId, kind, note }] };
    if (character.id === bId) return { ...character, relations: [...kept, { id: crypto.randomUUID(), targetId: aId, kind: converseRelation[kind], note }] };
    return { ...character, relations: kept.length ? kept : undefined };
  });
}

/** Removes a link from both cards, so no orphaned half remains behind. */
function unlinkCharacters(characters: Character[], aId: string, bId: string): Character[] {
  return characters.map(character => {
    if (character.id !== aId && character.id !== bId) return character;
    const kept = (character.relations || []).filter(relation => relation.targetId !== aId && relation.targetId !== bId);
    return { ...character, relations: kept.length ? kept : undefined };
  });
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
  return result as T;
}

export default function Studio({ initialProjects, initialTab, initialProjectId }: { initialProjects: FilmProject[]; initialTab?: string; initialProjectId?: string }) {
  const [projects, setProjects] = useState(() => initialProjects.map(healProjectImages));
  const projectsRef = useRef(projects);
  const [activeId, setActiveId] = useState(() => initialProjects.find(p => p.id === initialProjectId)?.id || initialProjects[0]?.id || "");
  const [screen, setScreen] = useState<Screen>("project");
  const [tab, setTab] = useState(initialTab || "Storyboard");
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => Promise<void> } | null>(null);
  const [playerFrames, setPlayerFrames] = useState<StoryFrame[] | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const pendingCount = useRef(0);
  const saveQueues = useRef<Record<string, Promise<unknown>>>({});
  const [profileName, setProfileName] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("frame-profile-name") || "Jamie Parker" : "Jamie Parker"));
  const [mobileNav, setMobileNav] = useState(false);
  const [scriptJump, setScriptJump] = useState<{ start: number; end: number; stamp: number } | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const project = projects.find(p => p.id === activeId) || projects[0];

  useEffect(() => { projectsRef.current = projects; }, [projects]);
  /**
   * Images that were already broken when the server sent them stay broken until we sweep them,
   * and React may only touch the DOM once hydration has finished — so this runs on mount, never
   * during render. Anything that breaks later is caught by the onError handlers.
   */
  useEffect(() => { sweepBrokenImages(); }, []);
  /** Keep the address bar in step with the open project and section so every screen can be linked to. */
  useEffect(() => {
    if (screen !== "project" || !project) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("tab") === tabSlug(tab) && url.searchParams.get("project") === project.id) return;
    url.searchParams.set("project", project.id);
    url.searchParams.set("tab", tabSlug(tab));
    try { window.history.replaceState(null, "", url); } catch { /* older browsers just keep the previous URL */ }
  }, [tab, screen, project]);
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setDialog(current => current?.type === "search" ? null : { type: "search" }); }
      if (event.key === "Escape") { setMobileNav(false); setNotificationsOpen(false); }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  const notify = useCallback((text: string, error = false) => {
    clearTimeout(toastTimer.current);
    setToast({ text, error });
    toastTimer.current = setTimeout(() => setToast(null), error ? 6500 : 3800);
  }, []);

  const updateLocal = useCallback((updater: (current: FilmProject[]) => FilmProject[]) => {
    const next = updater(projectsRef.current);
    projectsRef.current = next;
    setProjects(next);
  }, []);

  const persist = useCallback(async (id: string, patch: ProjectPatch, message?: string): Promise<boolean> => {
    const before = projectsRef.current.find(p => p.id === id);
    updateLocal(current => current.map(p => p.id === id ? { ...p, ...patch } : p));
    pendingCount.current += 1;
    setSaveState("saving");
    const previous = saveQueues.current[id] || Promise.resolve();
    const task = previous.catch(() => undefined).then(() => request<FilmProject>(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify(patch) }));
    saveQueues.current[id] = task;
    try {
      const saved = await task;
      updateLocal(current => current.map(p => p.id === id ? { ...p, updatedAt: saved.updatedAt } : p));
      pendingCount.current -= 1;
      if (!pendingCount.current) setSaveState("saved");
      if (message) notify(message);
      return true;
    } catch (error) {
      pendingCount.current -= 1;
      setSaveState("error");
      if (before) updateLocal(current => current.map(p => {
        if (p.id !== id) return p;
        const rollback: Record<string, unknown> = {};
        for (const key of Object.keys(patch) as (keyof ProjectPatch)[]) if (p[key] === patch[key]) rollback[key] = before[key];
        return { ...p, ...rollback };
      }));
      notify(error instanceof Error ? error.message : "Your changes couldn't be saved.", true);
      return false;
    }
  }, [notify, updateLocal]);

  function openProject(id: string) { setActiveId(id); setScreen("project"); setTab("Storyboard"); setMobileNav(false); }
  function navigate(next: Screen) { setScreen(next); setMobileNav(false); }
  function addFrame() {
    if (!project.scenes.length) { setDialog({ type: "scene" }); notify("First, set the scene. Then add your first frame."); return; }
    setDialog({ type: "frame", isNew: true, frame: { id: crypto.randomUUID(), sceneId: project.scenes[0].id, title: "", description: "", image: shotGuide["Wide"].image, shotType: "Wide", movement: "Static", duration: 5, status: "Draft", notes: "", angle: "Eye level", lighting: project.scenes[0].lighting, characters: project.scenes[0].characters || [] } });
  }
  function editFrame(frame: StoryFrame) { setDialog({ type: "frame", frame, isNew: false }); }
  async function saveFrame(frame: StoryFrame) {
    const current = projectsRef.current.find(p => p.id === project.id) || project;
    const exists = current.frames.some(f => f.id === frame.id);
    return persist(project.id, { frames: exists ? current.frames.map(f => f.id === frame.id ? frame : f) : [...current.frames, frame] }, exists ? "Frame updated. Looking good." : "A new moment, added to your story.");
  }
  async function duplicateFrame(frame: StoryFrame) {
    const frames = [...project.frames];
    const index = frames.findIndex(f => f.id === frame.id);
    frames.splice(index + 1, 0, { ...frame, id: crypto.randomUUID(), title: `${frame.title} (copy)`, status: "Draft" });
    await persist(project.id, { frames }, "Frame duplicated. Try a different angle.");
  }
  function deleteFrame(frame: StoryFrame) {
    setDialog(null);
    setConfirm({ title: "Leave this frame on the cutting room floor?", description: `“${frame.title}” will be removed from your storyboard and shot list. This can't be undone.`, action: async () => { await persist(project.id, { frames: project.frames.filter(f => f.id !== frame.id) }, "Frame removed from the storyboard."); } });
  }

  function applyStyle(frameIds: string[], styleId: string) {
    const frames = project.frames.map(f => frameIds.includes(f.id) ? { ...f, style: styleId } : f);
    void persist(project.id, { frames });
  }
  async function saveScene(scene: Scene) {
    const current = projectsRef.current.find(p => p.id === project.id) || project;
    const existing = current.scenes.find(s => s.id === scene.id);
    const scenes = existing ? current.scenes.map(s => s.id === scene.id ? scene : s) : [...current.scenes, scene];
    const script = existing ? current.script.replace(`${existing.location} - ${existing.time}`, `${scene.location} - ${scene.time}`) : `${current.script.trimEnd()}\n\n${scenes.length}. ${scene.location} - ${scene.time}\n\n${scene.description}\n`;
    return persist(project.id, { scenes, script }, existing ? "Scene details saved." : "The scene is set. Keep the story going.");
  }
  async function saveCharacter(character: Character) {
    const current = projectsRef.current.find(p => p.id === project.id) || project;
    const exists = current.characters.some(c => c.id === character.id);
    const relations = (character.relations || []).filter(relation => relation.targetId && relation.targetId !== character.id);
    const saved: Character = { ...character, relations };
    const linked = new Set(relations.map(relation => relation.targetId));
    const characters = (exists ? current.characters.map(c => c.id === character.id ? saved : c) : [...current.characters, saved]).map(c => {
      if (c.id === saved.id) return c;
      const kept = (c.relations || []).filter(relation => relation.targetId !== saved.id);
      // Relationships are stored on both cards, so removing one removes it for both people.
      const mirrored = linked.has(c.id) ? [...kept, ...relations.filter(relation => relation.targetId === c.id).map(relation => ({ id: crypto.randomUUID(), targetId: saved.id, kind: converseRelation[relation.kind], note: relation.note }))] : kept;
      return { ...c, relations: mirrored.length ? mirrored : undefined };
    });
    return persist(project.id, { characters }, exists ? "Character updated." : "Character added to the cast.");
  }
  async function saveBrainstorm(node: BrainstormNode) {
    const exists = project.brainstorm.some(n => n.id === node.id);
    return persist(project.id, { brainstorm: exists ? project.brainstorm.map(n => n.id === node.id ? node : n) : [...project.brainstorm, node] }, exists ? "Idea updated." : "A new idea added to the map.");
  }
  function deleteBrainstorm(node: BrainstormNode) {
    setDialog(null);
    setConfirm({ title: "Remove this idea?", description: `"${node.title}" will be removed from the brainstorm map.`, action: async () => { await persist(project.id, { brainstorm: project.brainstorm.filter(n => n.id !== node.id) }, "Idea removed."); } });
  }
  async function saveActs(acts: Act[]) {
    const ids = new Set(acts.map(a => a.id));
    const scenes = project.scenes.map(sc => sc.actId && !ids.has(sc.actId) ? { ...sc, actId: undefined } : sc);
    return persist(project.id, { acts, scenes }, "Story structure saved.");
  }
  async function saveBrainstormAll(nodes: BrainstormNode[], message?: string) { return persist(project.id, { brainstorm: nodes }, message); }
  async function saveMoodBoard(board: MoodBoard) {
    const current = projectsRef.current.find(p => p.id === project.id) || project;
    const exists = (current.moodboards || []).some(b => b.id === board.id);
    const moodboards = exists ? current.moodboards.map(b => (b.id === board.id ? board : b)) : [...current.moodboards, board];
    const cover = !current.coverImage && board.items[0]?.image ? board.items[0].image : current.coverImage;
    return persist(project.id, { moodboards, coverImage: cover }, exists ? "Board updated." : "A room of references, saved.");
  }
  function deleteMoodBoard(board: MoodBoard) {
    setDialog(null);
    setConfirm({ title: "Clear this board?", description: `“${board.title}” and its ${board.items.length} reference image${board.items.length === 1 ? "" : "s"} will be removed.`, action: async () => { await persist(project.id, { moodboards: (project.moodboards || []).filter(b => b.id !== board.id) }, "Mood board removed."); } });
  }
  async function saveNote(note: ProjectNote) {
    const exists = project.notes.some(n => n.id === note.id);
    return persist(project.id, { notes: exists ? project.notes.map(n => n.id === note.id ? note : n) : [...project.notes, note] }, "A thought, safely kept.");
  }
  function deleteNote(note: ProjectNote) {
    setDialog(null);
    setConfirm({ title: "Let this thought go?", description: `“${note.title}” will be permanently removed from your notes.`, action: async () => { await persist(project.id, { notes: project.notes.filter(n => n.id !== note.id) }, "Note removed."); } });
  }
  function deleteCurrentProject() {
    setDialog(null);
    setConfirm({ title: "Close the book on this project?", description: `“${project.title}” and all of its scenes, frames, and notes will be permanently deleted. Any share link will stop working.`, action: async () => {
      try { await request(`/api/projects/${project.id}`, { method: "DELETE" }); const remaining = projectsRef.current.filter(p => p.id !== project.id); updateLocal(() => remaining); setActiveId(remaining[0]?.id || ""); setScreen("projects"); notify("Project deleted."); }
      catch (error) { notify(error instanceof Error ? error.message : "Unable to delete project.", true); }
    } });
  }
  async function share(enabled: boolean) {
    try { const saved = await request<FilmProject>(`/api/projects/${project.id}/share`, { method: "POST", body: JSON.stringify({ enabled }) }); updateLocal(current => current.map(p => p.id === project.id ? { ...p, shareId: saved.shareId } : p)); return true; }
    catch (error) { notify(error instanceof Error ? error.message : "Unable to update sharing.", true); return false; }
  }
  async function importScript(script: string) {
    const patch: ProjectPatch = { script };
    if (!project.scenes.length) {
      const headings = script.split("\n").map(line => line.trim()).filter(line => /^(?:\d+\.\s*)?(?:INT\.|EXT\.|INT\/EXT\.)\s/i.test(line));
      patch.scenes = headings.map((heading, i) => {
        const clean = heading.replace(/^\d+\.\s*/, "");
        const parts = clean.split(/\s+[-–—]\s+/);
        return { id: crypto.randomUUID(), title: `Scene ${i + 1}`, location: parts[0], time: parts[1] || "DAY", description: "" };
      });
    }
    return persist(project.id, patch);
  }

  async function importProjectFile(file?: File) {
    if (!file) return;
    if (!/\.json$/i.test(file.name)) { notify("Choose a frame. project backup (.json).", true); return; }
    if (file.size > 25 * 1024 * 1024) { notify("That backup is larger than 25 MB. Export again with fewer uploaded images.", true); return; }
    try {
      const created = await request<FilmProject & { imported?: Record<string, number> }>("/api/projects/import", { method: "POST", body: await file.text() });
      updateLocal(current => [...current, created]);
      openProject(created.id);
      setTab("Overview");
      const parts = Object.entries(created.imported || {}).filter(([, n]) => (n as number) > 0).map(([k, n]) => `${n} ${k}`);
      notify(parts.length ? `Imported “${created.title}” — ${parts.join(", ")}.` : `Imported “${created.title}”.`);
    } catch (error) { notify(error instanceof Error ? error.message : "That file couldn't be imported.", true); }
  }

  const tabs = TABS;
  const firstName = profileName.split(" ")[0];
  return <div className="studio-shell">{mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}<aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}><button className="brand-button" onClick={() => navigate("projects")} aria-label="Frame workspace"><FrameLogo /></button><button className="workspace-switcher" onClick={() => setDialog({ type: "profile" })}><span className="workspace-symbol"><Clapperboard size={16} /></span><span>{firstName}’s workspace<small>Personal workspace</small></span><ChevronsUpDown size={14} /></button><div className="sidebar-actions"><button className="button sidebar-new-project" onClick={() => setDialog({ type: "newProject" })}><Plus size={16} />New project</button><label className="sidebar-import" title="Import a frame. project backup (.json)"><Upload size={15} />Import<input type="file" accept="application/json,.json" className="sr-only" aria-label="Import project file" onChange={e => { void importProjectFile(e.target.files?.[0]); if (e.target) e.target.value = ""; }} /></label></div><div className="sidebar-section-label">WORKSPACE</div><nav className="main-nav" aria-label="Workspace navigation"><button className={screen === "projects" ? "active" : ""} onClick={() => navigate("projects")}><FolderOpen size={17} />All projects<span>{projects.length}</span></button><button className={screen === "recent" ? "active" : ""} onClick={() => navigate("recent")}><Clock3 size={17} />Recent projects</button><button className={screen === "templates" ? "active" : ""} onClick={() => navigate("templates")}><LayoutTemplate size={17} />Templates<span className="new-tag">NEW</span></button></nav><div className="sidebar-section-label project-list-label">YOUR PROJECTS<IconButton label="Create another project" onClick={() => setDialog({ type: "newProject" })}><Plus size={14} /></IconButton></div><nav className="sidebar-projects" aria-label="Your projects">{projects.map(p => <button key={p.id} className={`sidebar-project ${screen === "project" && p.id === project?.id ? "active" : ""}`} onClick={() => openProject(p.id)}><span className="project-thumb"><img src={p.coverImage} alt="" onError={onImageError} /></span><span className="sidebar-project-text"><strong>{p.title}</strong><small>{p.format} <span>·</span> {p.scenes.length} scenes</small></span>{screen === "project" && p.id === project?.id && <span className="active-project-dot" />}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-tip"><span className="tip-spark"><Sparkles size={21} strokeWidth={1.4} /></span><div className="tip-line-art"><span /><span /><span /></div><h3>Big ideas.<br />A little head start.</h3><p>Your next great story doesn’t<br />have to start from scratch.</p><button onClick={() => navigate("templates")}>Explore templates<ArrowUpRight size={14} /></button></div><button className="sidebar-help" onClick={() => setDialog({ type: "help" })}><CircleHelp size={16} />A little help & inspiration<ArrowUpRight size={13} /></button><button className="profile-button" onClick={() => setDialog({ type: "profile" })}><Avatar name={profileName} /><span><strong>{profileName}</strong><small>Personal account</small></span><Settings2 size={16} /></button></div></aside><div className="main-shell"><header className="topbar"><div className="breadcrumb"><IconButton label="Open navigation" className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={21} /></IconButton><span className="breadcrumb-workspace-icon"><PanelsTopLeft size={17} /></span><button onClick={() => navigate("projects")}>Workspace</button><ChevronRight size={13} /><span>{screen === "project" ? project?.title : screen === "templates" ? "Templates" : screen === "recent" ? "Recent projects" : "All projects"}</span></div><div className="topbar-right"><button className="global-search" onClick={() => setDialog({ type: "search" })}><Search size={15} /><span>Search anything...</span><kbd>⌘ K</kbd></button><span className="topbar-divider" /><div className="notifications-container"><IconButton label="Workspace activity" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /></IconButton>{notificationsOpen && <><button className="popover-dismiss" aria-label="Close activity" onClick={() => setNotificationsOpen(false)} /><div className="activity-popover"><span className="eyebrow">THE LATEST IN YOUR WORKSPACE</span><h3>A little creative momentum.</h3>{[...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3).map(p => <button key={p.id} onClick={() => { openProject(p.id); setNotificationsOpen(false); }}><span><CheckCheck size={17} /></span><div><strong>{p.title}</strong><small>Saved {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {p.frames.length} frames</small></div><ArrowUpRight size={14} /></button>)}</div></>}</div><IconButton label="Help and filmmaking resources" className="topbar-help" onClick={() => setDialog({ type: "help" })}><CircleHelp size={18} /></IconButton><button className="topbar-avatar" aria-label="Your profile" onClick={() => setDialog({ type: "profile" })}><Avatar name={profileName} small /></button></div></header><main className={`main-content ${screen !== "project" ? "workspace-content" : ""}`}>{screen === "project" && project ? <><section className="project-header"><div className="project-heading-left"><span className="project-status-label"><span />{project.status.toUpperCase()}</span><div className="project-title-row"><h1>{project.title}</h1><IconButton label="Edit project details" className="project-title-edit" onClick={() => setDialog({ type: "projectSettings" })}><PencilIcon /></IconButton></div><p className="project-description">{project.description}</p><div className="project-meta"><span><Film size={13} />{project.format}</span><span className="metadata-dot">·</span><span>{project.genre}</span><span className="metadata-divider" /><span><Clapperboard size={13} />{project.scenes.length} scenes</span><span className="metadata-dot">·</span><span><LayoutGrid size={13} />{project.frames.length} frames</span></div></div><div className="project-header-right"><div className="project-header-actions"><button className="button" onClick={() => setDialog({ type: "export" })}><ArrowDownToLine size={15} />Export</button><button className="button button-primary" onClick={() => setDialog({ type: "share" })}><Share2 size={15} />Share project</button></div><span className={`save-status ${saveState === "error" ? "danger-text" : ""}`}>{saveState === "saving" ? <LoaderCircle size={13} className="spin" /> : saveState === "error" ? <CircleHelp size={13} /> : <CheckCheck size={14} />}{saveState === "saving" ? "Saving your changes..." : saveState === "error" ? "Some changes couldn’t be saved" : "All changes saved"}</span></div></section><nav className="project-tabs" aria-label="Project sections">{tabs.map(item => <button key={item.name} className={tab === item.name ? "active" : ""} onClick={() => setTab(item.name)} aria-current={tab === item.name ? "page" : undefined}><item.icon size={16} />{item.name}{item.name === "Storyboard" && <span>{project.frames.length}</span>}{item.name === "Notes" && project.notes.length > 0 && <span className="notes-tab-count">{project.notes.length}</span>}{item.name === "Mood boards" && (project.moodboards?.length || 0) > 0 && <span>{project.moodboards.length}</span>}{item.name === "Relationships" && castLinks(project.characters).length > 0 && <span>{castLinks(project.characters).length}</span>}</button>)}<button className="project-privacy" onClick={() => setDialog({ type: "share" })}><LockKeyhole size={12} />{project.shareId ? "Link sharing on" : "Private project"}</button></nav><div className="project-view">{tab === "Storyboard" && <Storyboard key={project.id} project={project} onEdit={editFrame} onAdd={addFrame} onPlay={setPlayerFrames} onReorder={frames => { void persist(project.id, { frames }); }} onDuplicate={duplicateFrame} onDelete={deleteFrame} onPrompts={sceneId => setDialog({ type: "prompts", sceneId })} />}{tab === "Prompt Studio" && <PromptStudio key={project.id} project={project} onApplyStyle={applyStyle} />}{tab === "Screenplay" && <Screenplay key={project.id} project={project} onSave={script => persist(project.id, { script })} onAddScene={() => setDialog({ type: "scene" })} onEditScene={scene => setDialog({ type: "scene", scene })} onImport={importScript} notify={notify} onManageActs={() => setDialog({ type: "acts" })} jump={scriptJump} />}{tab === "Shot list" && <ShotList project={project} onEdit={editFrame} onAdd={addFrame} onUpdate={saveFrame} />}{tab === "Notes" && <NotesView project={project} onAdd={() => setDialog({ type: "note" })} onEdit={note => setDialog({ type: "note", note })} />}{tab === "Overview" && <OverviewView project={project} onAddScene={() => setDialog({ type: "scene" })} onEditScene={scene => setDialog({ type: "scene", scene })} onTab={setTab} onManageActs={() => setDialog({ type: "acts" })} />}{tab === "Characters" && <CharactersView project={project} characters={project.characters} scenes={project.scenes} onEdit={c => setDialog({ type: "character", character: c })} onAdd={() => setDialog({ type: "character" })} />}{tab === "Relationships" && <RelationsMap project={project} onOpen={c => setDialog({ type: "character", character: c })} onAdd={() => setDialog({ type: "character" })} onLink={(aId, bId, kind, note) => { void persist(project.id, { characters: linkCharacters(project.characters, aId, bId, kind, note) }, "Link made. That's the drama started."); }} onUnlink={(aId, bId) => { void persist(project.id, { characters: unlinkCharacters(project.characters, aId, bId) }, "Link removed."); }} />}{tab === "Brainstorm" && <BrainstormBoard nodes={project.brainstorm} onEdit={node => setDialog({ type: "brainstorm", node })} onAdd={(x, y) => setDialog({ type: "brainstorm", node: { id: crypto.randomUUID(), x: x || 80, y: y || 40, title: "", content: "", color: "sage", tags: [], connections: [], createdAt: new Date().toISOString() } })} onChange={saveBrainstormAll} onDelete={node => deleteBrainstorm(node)} />}{tab === "Mood boards" && <MoodboardsView project={project} onAdd={() => setDialog({ type: "moodboard", isNew: true })} onEdit={board2 => setDialog({ type: "moodboard", board: board2, isNew: false })} onDelete={deleteMoodBoard} />}</div></> : screen === "templates" ? <TemplatesView onUse={template => setDialog({ type: "newProject", template })} /> : <ProjectsView projects={projects} recent={screen === "recent"} onOpen={openProject} onNew={() => setDialog({ type: "newProject" })} onImport={importProjectFile} />}<footer className="main-footer"><span><span className="footer-brand-mark">f.</span>Made for the way stories come to life.</span><button onClick={() => setDialog({ type: "help" })}>A little inspiration<ArrowUpRight size={12} /></button></footer></main></div>{dialog?.type === "newProject" && <ProjectDialog template={dialog.template} onClose={() => setDialog(null)} onSave={async input => { try { const created = await request<FilmProject>("/api/projects", { method: "POST", body: JSON.stringify(input) }); updateLocal(current => [...current, created]); openProject(created.id); setTab("Overview"); notify("Your next great story starts now."); return true; } catch (error) { notify(error instanceof Error ? error.message : "Project couldn't be created.", true); return false; } }} />}{dialog?.type === "projectSettings" && <ProjectDialog project={project} onClose={() => setDialog(null)} onDelete={deleteCurrentProject} onSave={input => persist(project.id, { title: input.title, description: input.description, genre: input.genre, format: input.format }, "The big picture, updated.")} />}{dialog?.type === "frame" && <FrameDialog key={dialog.frame.id} frame={dialog.frame} isNew={dialog.isNew} frameNumber={project.frames.findIndex(f => f.id === dialog.frame.id) + 1} scenes={project.scenes} characters={project.characters} project={project} onClose={() => setDialog(null)} onSave={saveFrame} onDelete={() => deleteFrame(dialog.frame)} onDuplicate={() => { void duplicateFrame(dialog.frame); setDialog(null); }} />}{dialog?.type === "scene" && <SceneDialog scene={dialog.scene} characters={project.characters} acts={project.acts} defaultActId={project.acts[project.acts.length - 1]?.id} onClose={() => setDialog(null)} onSave={saveScene} onManageActs={() => setDialog({ type: "acts" })} />}{dialog?.type === "note" && <NoteDialog note={dialog.note} onClose={() => setDialog(null)} onSave={saveNote} onDelete={dialog.note ? () => deleteNote(dialog.note!) : undefined} />}{dialog?.type === "share" && <ShareDialog project={project} onClose={() => setDialog(null)} onShare={share} />}{dialog?.type === "export" && <ExportDialog project={project} onClose={() => setDialog(null)} />}{dialog?.type === "help" && <HelpDialog onClose={() => setDialog(null)} />}{dialog?.type === "profile" && <ProfileDialog name={profileName} onClose={() => setDialog(null)} onSave={name => { setProfileName(name); localStorage.setItem("frame-profile-name", name); notify("Make yourself at home."); }} />}{dialog?.type === "character" && <CharacterDialog character={dialog.character} characters={project.characters} onClose={() => setDialog(null)} onSave={saveCharacter} onDelete={dialog.character ? () => { setDialog(null); setConfirm({ title: "Remove this character?", description: `"${dialog.character?.name}" will be removed from the cast.`, action: async () => { const gone = dialog.character?.id; await persist(project.id, { characters: project.characters.filter(c => c.id !== gone).map(c => { const kept = (c.relations || []).filter(relation => relation.targetId !== gone); return { ...c, relations: kept.length ? kept : undefined }; }) }, "Character removed."); } }); } : undefined} />}{dialog?.type === "brainstorm" && <BrainstormDialog node={dialog.node} others={project.brainstorm} onClose={() => setDialog(null)} onSave={saveBrainstorm} onDelete={dialog.node ? () => { deleteBrainstorm(dialog.node!); } : undefined} />}{dialog?.type === "acts" && <ActsDialog acts={project.acts} scenes={project.scenes} onClose={() => setDialog(null)} onSave={saveActs} />}{dialog?.type === "prompts" && <PromptDialog project={project} initialSceneId={dialog.sceneId} onClose={() => setDialog(null)} onApplyStyle={applyStyle} />}{dialog?.type === "moodboard" && <MoodBoardDialog board={dialog.board} project={project} isNew={dialog.isNew} onClose={() => setDialog(null)} onSave={saveMoodBoard} onDelete={dialog.board ? () => deleteMoodBoard(dialog.board!) : undefined} />}{dialog?.type === "search" && <SearchDialog projects={projects} onClose={() => setDialog(null)} onNavigate={(id, target: SearchTarget) => {
    const found = projectsRef.current.find(p => p.id === id);
    if (!found) return;
    if (id !== project.id) { setActiveId(id); projectsRef.current = projects; }
    setScreen("project");
    setTab(target.tab || "Overview");
    if (target.frameId) { const frame = found.frames.find(f => f.id === target.frameId); if (frame) setTimeout(() => setDialog({ type: "frame", frame, isNew: false }), 60); }
    if (target.characterId) { const character = found.characters.find(c => c.id === target.characterId); if (character) setTimeout(() => setDialog({ type: "character", character }), 60); }
    if (target.noteId) { const note = found.notes.find(n => n.id === target.noteId); if (note) setTimeout(() => setDialog({ type: "note", note }), 60); }
    if (target.nodeId) { const node = found.brainstorm.find(n => n.id === target.nodeId); if (node) setTimeout(() => setDialog({ type: "brainstorm", node }), 60); }
    if (target.boardId) { const board = (found.moodboards || []).find(b => b.id === target.boardId); if (board) setTimeout(() => setDialog({ type: "moodboard", board, isNew: false }), 60); }
    if (target.sceneId) setTimeout(() => { const scene = found.scenes.find(s2 => s2.id === target.sceneId); if (scene) setDialog({ type: "scene", scene }); }, 60);
    if (target.script) setTimeout(() => setScriptJump({ ...target.script!, stamp: Date.now() }), 80);
  }} />}{confirm && <ConfirmDialog title={confirm.title} description={confirm.description} onClose={() => setConfirm(null)} onConfirm={confirm.action} />}{playerFrames && <StoryboardPlayer project={project} frames={playerFrames} onClose={() => setPlayerFrames(null)} />}{toast && <div className={`toast ${toast.error ? "toast-error" : ""}`} role="status"><span>{toast.error ? <CircleHelp size={17} /> : <Check size={17} />}</span><p>{toast.text}</p><IconButton label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></IconButton></div>}</div>;
}

function PencilIcon() { return <Settings2 size={17} strokeWidth={1.6} />; }
