"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlignLeft, ArrowDownToLine, CheckCheck, ChevronDown, Expand, FileText, ListOrdered, LoaderCircle, Pencil, Plus, Redo2, Save, Undo2, Upload, UserRound } from "lucide-react";
import type { FilmProject, Scene } from "@/lib/types";
import { IconButton } from "./ui";
import { downloadFile, printProject, slugify } from "@/lib/export";
import { groupScenes, kindMeta, renderRows } from "@/lib/structure";
import { formatCount } from "@/lib/format";

type Jump = { start: number; end: number; stamp: number };

interface HistoryEntry {
  text: string;
  sel?: [number, number];
}

export function Screenplay({ project, onSave, onAddScene, onEditScene, onImport, notify, onManageActs, jump }: { project: FilmProject; onSave: (script: string) => Promise<boolean>; onAddScene: () => void; onEditScene: (scene: Scene) => void; onImport: (script: string) => Promise<boolean>; notify: (message: string, error?: boolean) => void; onManageActs?: () => void; jump?: Jump | null }) {
  const [draft, setDraft] = useState(project.script);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [focused, setFocused] = useState(false);
  const [selectedScene, setSelectedScene] = useState(project.scenes.find(scene => project.script.includes(scene.location))?.id || project.scenes[0]?.id || "");
  const [history, setHistory] = useState<HistoryEntry[]>([{ text: project.script, sel: [0, 0] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const savedRef = useRef(project.script);
  const draftRef = useRef(draft);
  const saveRef = useRef(onSave);
  const pendingSel = useRef<[number, number] | null>(null);

  const historyRef = useRef<HistoryEntry[]>(history);
  const historyIndexRef = useRef<number>(historyIndex);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    saveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  const words = draft.trim().split(/\s+/).filter(Boolean).length;
  const pages = Math.max(1, Math.ceil(words / 180));

  // Apply caret/selection after React has committed the new value — otherwise the caret jumps to the end.
  useLayoutEffect(() => {
    const selection = pendingSel.current;
    if (!selection || !textarea.current) return;
    pendingSel.current = null;
    textarea.current.focus({ preventScroll: true });
    textarea.current.setSelectionRange(selection[0], selection[1]);
  }, [draft]);

  function pushHistory(newText: string, sel?: [number, number], immediate = false) {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const now = Date.now();
    const timeSince = now - lastTypingTimeRef.current;
    lastTypingTimeRef.current = now;

    const curIdx = historyIndexRef.current;
    const currentHist = historyRef.current.slice(0, curIdx + 1);
    const lastEntry = currentHist[currentHist.length - 1];

    if (lastEntry && lastEntry.text === newText) {
      return;
    }

    if (immediate || timeSince > 650 || currentHist.length === 0) {
      const next = [...currentHist, { text: newText, sel }];
      const trimmed = next.length > 150 ? next.slice(next.length - 150) : next;
      const nextIdx = trimmed.length - 1;
      historyRef.current = trimmed;
      historyIndexRef.current = nextIdx;
      setHistory(trimmed);
      setHistoryIndex(nextIdx);
    } else {
      const updated = [...currentHist];
      updated[updated.length - 1] = { text: newText, sel };
      historyRef.current = updated;
      setHistory(updated);
      typingTimerRef.current = setTimeout(() => {
        lastTypingTimeRef.current = 0;
      }, 650);
    }
  }

  function undo() {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    const curIdx = historyIndexRef.current;
    if (curIdx <= 0) return;
    const nextIdx = curIdx - 1;
    historyIndexRef.current = nextIdx;
    setHistoryIndex(nextIdx);
    const target = historyRef.current[nextIdx];
    if (target) {
      if (target.sel) pendingSel.current = target.sel;
      setDraft(target.text);
    }
  }

  function redo() {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    const curIdx = historyIndexRef.current;
    if (curIdx >= historyRef.current.length - 1) return;
    const nextIdx = curIdx + 1;
    historyIndexRef.current = nextIdx;
    setHistoryIndex(nextIdx);
    const target = historyRef.current[nextIdx];
    if (target) {
      if (target.sel) pendingSel.current = target.sel;
      setDraft(target.text);
    }
  }

  useEffect(() => {
    if (draft === savedRef.current) return;
    const timer = setTimeout(async () => {
      setSaveState("saving");
      const result = await saveRef.current(draft);
      if (result) savedRef.current = draft;
      setSaveState(result ? "saved" : "error");
    }, 900);
    return () => clearTimeout(timer);
  }, [draft]);

  useEffect(() => () => {
    if (draftRef.current !== savedRef.current) void saveRef.current(draftRef.current);
  }, []);

  useEffect(() => {
    if (project.script !== savedRef.current && draftRef.current === savedRef.current) {
      savedRef.current = project.script;
      setDraft(project.script);
      const initialEntry = { text: project.script, sel: [0, 0] as [number, number] };
      setHistory([initialEntry]);
      setHistoryIndex(0);
      historyRef.current = [initialEntry];
      historyIndexRef.current = 0;
    }
  }, [project.script]);

  useEffect(() => {
    if (!jump || !textarea.current) return;
    const el = textarea.current;
    el.focus({ preventScroll: true });
    el.setSelectionRange(jump.start, jump.end);
    const line = el.value.slice(0, jump.start).split("\n").length;
    el.scrollTop = Math.max(0, (line - 5) * 25);
  }, [jump]);

  async function saveNow() {
    setSaveState("saving");
    const result = await onSave(draft);
    if (result) { savedRef.current = draft; notify("Screenplay saved. Back to the story."); }
    setSaveState(result ? "saved" : "error");
  }

  function insertText(insert: string) {
    const text = textarea.current;
    if (!text) return;
    const start = text.selectionStart;
    const end = text.selectionEnd;
    const caret = start + insert.length;
    pendingSel.current = [caret, caret];
    const nextDraft = draft.slice(0, start) + insert + draft.slice(end);
    setDraft(nextDraft);
    pushHistory(nextDraft, [caret, caret], true);
  }

  function insertBlock(type: string) {
    const blocks: Record<string, string> = {
      cold: "\n\nCOLD OPEN:\n\n",
      act: "\n\n\n                         ACT ONE\n\n\n",
      scene: "\n\nEXT. LOCATION - DAY\n\n",
      action: "\n\n",
      character: "\n\n                         CHARACTER\n",
      dialogue: "\n             ",
      parenthetical: "\n                   (quietly)\n",
      transition: "\n\n                                                CUT TO:\n",
      title: "\n\n                              TITLE: \n",
    };
    insertText(blocks[type] || "\n\n");
  }

  function insertCharacter(name: string) {
    if (!name) return;
    const cue = name.toUpperCase().replace(/[^A-Z0-9\s.'-]/g, "").trim() || name.toUpperCase();
    insertText(`\n\n                         ${cue}\n             `);
  }

  function goToScene(scene: Scene) {
    setSelectedScene(scene.id);
    const location = draft.indexOf(scene.location);
    if (location >= 0 && textarea.current) {
      const el = textarea.current;
      const line = draft.slice(0, location).split("\n").length;
      el.scrollTop = Math.max(0, (line - 5) * 25);
      el.focus({ preventScroll: true });
      el.setSelectionRange(location, location + scene.location.length);
    } else notify("This scene isn't in the screenplay yet. Add its heading where the story needs it.");
  }

  async function importFile(file?: File) {
    if (!file) return;
    if (!/\.(txt|fountain)$/i.test(file.name)) { notify("Choose a .txt or .fountain screenplay.", true); return; }
    if (file.size > 500000) { notify("Please use a screenplay smaller than 500 KB.", true); return; }
    const content = await file.text();
    if (await onImport(content)) {
      savedRef.current = content;
      setDraft(content);
      pushHistory(content, [0, 0], true);
      notify("Screenplay imported. Let’s make it yours.");
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  const groups = groupScenes(project);

  return <section className={`screenplay-section view-enter ${focused ? "focus-mode" : ""}`}><div className="section-heading"><div><div className="section-title-row"><h2>Screenplay</h2><span className="subtle-badge">DRAFT 01</span></div><p>Make room for the story only you can tell.</p></div><div className="section-actions"><input type="file" accept=".txt,.fountain" className="sr-only" ref={fileInput} aria-label="Import screenplay file" onChange={e => importFile(e.target.files?.[0])} /><button className="button" onClick={() => fileInput.current?.click()}><Upload size={14} />Import</button><button className="button button-primary" onClick={() => downloadFile(draft, `${slugify(project.title)}.fountain`)}><ArrowDownToLine size={15} />Export script</button></div></div><div className="screenplay-workspace">{!focused && <aside className="scene-navigator"><div className="scene-nav-heading"><span className="eyebrow">YOUR SCENES</span><span>{project.scenes.length}</span>{onManageActs && <IconButton label="Manage acts and sequences" onClick={onManageActs}><ListOrdered size={15} /></IconButton>}<IconButton label="Add scene" onClick={onAddScene}><Plus size={16} /></IconButton></div><div className="scene-list">{groups.map(group => <div key={group.key} className="act-group">{group.title && <button type="button" className="act-header" onClick={onManageActs} title="Manage acts and sequences"><span>{group.title}</span><small>{group.scenes.length + group.parts.reduce((n, p) => n + p.scenes.length, 0)}</small></button>}{renderRows(group).map(row => row.kind === "header" ? <button key={row.key} type="button" className="act-header is-part" onClick={onManageActs} title="Manage sequences"><span>{row.part.title}</span><small>{row.part.scenes.length}</small></button> : <div key={row.key} className={`scene-nav-item ${selectedScene === row.scene.id ? "selected" : ""}`}><button className="scene-nav-main" onClick={() => goToScene(row.scene)}><span className="scene-nav-number">{String(row.index + 1).padStart(2, "0")}</span><span><strong>{row.scene.title}</strong>{row.scene.kind && row.scene.kind !== "Standard" && <em className={`kind-badge kind-${kindMeta[row.scene.kind].tone}`}>{row.scene.kind}</em>}<small>{row.scene.location}</small><span className="scene-time">{row.scene.time}</span>{project.characters.length > 0 && (row.scene.characters || []).length > 0 && <span className="scene-cast" title="Cast in this scene">{(row.scene.characters || []).map(cid => { const c = project.characters.find(x => x.id === cid); return c ? <i key={cid}>{c.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}</i> : null; })}</span>}</span></button><button className="scene-edit-button" aria-label={`Edit scene ${row.scene.title}`} onClick={() => onEditScene(row.scene)}><Pencil size={12} /></button></div>)}{project.scenes.length === 0 && <div className="scene-empty"><FileText size={25} /><p>A fresh page.<br />Endless possibilities.</p></div>}</div>)}</div><button className="add-scene-button" onClick={onAddScene}><Plus size={15} />Add a scene</button><div className="scene-nav-bottom"><span><FileText size={13} />{pages} {pages === 1 ? "page" : "pages"}, estimated</span><p>One page. One minute.<br />A whole world of possibility.</p></div></aside>}<div className="script-editor"><div className="script-toolbar"><div className="select-wrap"><AlignLeft size={15} /><select aria-label="Insert screenplay element" value="" onChange={e => insertBlock(e.target.value)}><option value="" disabled>Insert element</option><option value="cold">Cold open</option><option value="act">Act heading</option><option value="scene">Scene heading</option><option value="action">Action</option><option value="character">Character</option><option value="dialogue">Dialogue</option><option value="parenthetical">Parenthetical</option><option value="title">Title card</option><option value="transition">Transition</option></select><ChevronDown size={12} /></div>{project.characters.length > 0 && <><div className="select-wrap cast-select"><UserRound size={15} /><select aria-label="Insert a character from your cast" value="" onChange={e => insertCharacter(e.target.value)}><option value="" disabled>Add cast member</option>{project.characters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select><ChevronDown size={12} /></div></>}<span className="toolbar-divider" /><span className="script-font-label">Courier <span>12</span></span><div className="script-toolbar-right"><IconButton label="Undo (⌘Z / Ctrl+Z)" disabled={historyIndex <= 0} onClick={undo}><Undo2 size={16} /></IconButton><IconButton label="Redo (⌘⇧Z / Ctrl+Y)" disabled={historyIndex >= history.length - 1} onClick={redo}><Redo2 size={16} /></IconButton><span className="toolbar-divider" /><IconButton label="Print screenplay / Save as PDF" onClick={() => { try { printProject({ ...project, script: draft }, "script"); } catch (e) { notify(e instanceof Error ? e.message : "Couldn't open print preview.", true); } }}><FileText size={16} /></IconButton><IconButton label={focused ? "Show scenes" : "Focus mode"} onClick={() => setFocused(!focused)} className={focused ? "selected" : ""}><Expand size={16} /></IconButton><IconButton label="Save screenplay" onClick={saveNow}><Save size={16} /></IconButton></div></div><div className="script-page-area"><div className="script-paper"><div className="paper-header"><span>{project.title.toUpperCase()}</span><span>WORKING DRAFT</span></div><textarea ref={textarea} className="screenplay-text" aria-label="Screenplay editor" spellCheck value={draft} onChange={e => { const value = e.target.value; const selStart = e.target.selectionStart; const selEnd = e.target.selectionEnd; pendingSel.current = null; setDraft(value); pushHistory(value, [selStart, selEnd], false); }} onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); insertText("    "); } else if ((e.key === "s" || e.key === "S") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void saveNow(); } else if ((e.metaKey || e.ctrlKey) && !e.shiftKey && (e.key === "z" || e.key === "Z")) { e.preventDefault(); undo(); } else if ((e.metaKey || e.ctrlKey) && ((e.shiftKey && (e.key === "z" || e.key === "Z")) || e.key === "y" || e.key === "Y")) { e.preventDefault(); redo(); } }} /></div></div><div className="script-status"><span className={saveState === "error" ? "danger-text" : ""}>{saveState === "saving" ? <LoaderCircle size={13} className="spin" /> : <CheckCheck size={14} />}{saveState === "saving" ? "Saving your words..." : saveState === "error" ? "Not saved. Click Save to retry." : "All your words, safely saved"}</span><span>{formatCount(words)} words <i>·</i> ~{pages} min read</span></div></div></div></section>;
}
