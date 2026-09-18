"use client";

import { useState } from "react";
import { Check, Trash2, UserRound, LoaderCircle, Plus, Sparkles, X } from "lucide-react";
import { Field, Modal } from "./ui";
import type { BrainstormNode, Character } from "@/lib/types";

export function CharacterDialog({ character, onClose, onSave, onDelete }: { character?: Character; onClose: () => void; onSave: (c: Character) => Promise<boolean>; onDelete?: () => void }) {
  const [draft, setDraft] = useState<Character>(character || { id: crypto.randomUUID(), name: "", role: "Protagonist", age: "", description: "", traits: [], color: "sage", image: "", createdAt: new Date().toISOString() });
  const [traitInput, setTraitInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const colors = ["sage", "sand", "rose", "clay"] as const;
  const roles = ["Protagonist", "Antagonist", "Mentor", "Love interest", "Supporting", "Observer", "Guide", "Narrator"];
  const set = <K extends keyof Character>(key: K, value: Character[K]) => setDraft(prev => ({ ...prev, [key]: value }));

  function addTrait() {
    const value = traitInput.trim();
    if (!value) return;
    if (draft.traits.length >= 5) { setError("Keep it to five defining traits."); return; }
    if (draft.traits.some(t => t.toLowerCase() === value.toLowerCase())) { setTraitInput(""); return; }
    set("traits", [...draft.traits, value]);
    setTraitInput("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) { setError("Every character needs a name."); return; }
    if (!draft.description.trim()) { setError("Tell us something about this character."); return; }
    setBusy(true); setError("");
    const pending = traitInput.trim();
    const traits = pending && draft.traits.length < 5 ? [...draft.traits, pending] : draft.traits;
    if (await onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim(), traits })) onClose();
    else setError("The character couldn't be saved. Please try again.");
    setBusy(false);
  }

  return <Modal title={character ? "A person in the story." : "Who walks through this film?"} subtitle={character ? "Every character carries a piece of the world." : "Build the people who make your scenes matter."} onClose={onClose}><form onSubmit={submit}><div className="modal-body form-stack"><Field label="Character name"><input autoFocus required maxLength={120} placeholder="Enter a name that fits the story" value={draft.name} onChange={e => set("name", e.target.value)} /></Field><div className="fields-row"><Field label="Role"><select value={draft.role} onChange={e => set("role", e.target.value)}>{roles.map(role => <option key={role}>{role}</option>)}</select></Field><Field label="Age"><input maxLength={40} placeholder="Age or life stage" value={draft.age} onChange={e => set("age", e.target.value)} /></Field></div><Field label="About this character" hint="What drives them? What do they bring to the story?"><textarea rows={3} maxLength={700} placeholder="A little about who they are..." value={draft.description} onChange={e => set("description", e.target.value)} /></Field><Field label="Key traits" hint="Type a trait and press Enter."><div className="tag-input-row"><input maxLength={50} placeholder="e.g. Quiet, Resilient..." value={traitInput} onChange={e => setTraitInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTrait(); } }} /><button type="button" className="button" onClick={addTrait} disabled={!traitInput.trim()}><Plus size={15} />Add</button></div><div className="chip-row">{draft.traits.map(trait => <span key={trait} className="chip">{trait}<button type="button" aria-label={`Remove trait ${trait}`} onClick={() => set("traits", draft.traits.filter(t => t !== trait))}><X size={12} /></button></span>)}{draft.traits.length === 0 && <span className="chip-hint">No traits yet</span>}</div></Field><Field label="Profile color"><div className="note-colors"><span>Choose a color</span>{colors.map(color => <button key={color} type="button" className={`color-choice ${color} ${draft.color === color ? "selected" : ""}`} onClick={() => set("color", color)}>{draft.color === color && <Check size={15} />}</button>)}</div></Field></div>{error && <p className="form-error">{error}</p>}<div className="modal-footer">{character && onDelete ? <button type="button" className="button button-ghost danger-text footer-left" onClick={onDelete}><Trash2 size={15} />Remove from cast</button> : <span className="footer-left" />}<button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy ? <LoaderCircle size={15} className="spin" /> : <UserRound size={16} />}{character ? "Save character" : "Add to cast"}</button></div></form></Modal>;
}

export function BrainstormDialog({ node, others = [], onClose, onSave, onDelete }: { node?: BrainstormNode; others?: BrainstormNode[]; onClose: () => void; onSave: (node: BrainstormNode) => Promise<boolean>; onDelete?: () => void }) {
  const [draft, setDraft] = useState<BrainstormNode>(node || { id: crypto.randomUUID(), x: 80, y: 40, title: "", content: "", color: "sage", tags: [], connections: [], createdAt: new Date().toISOString() });
  const [tagInput, setTagInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const colors: BrainstormNode["color"][] = ["sage", "sand", "rose", "clay", "ink"];
  const existing = !!node && others.some(o => o.id === node.id);

  function addTag() {
    const value = tagInput.trim();
    if (!value) return;
    if (draft.tags.length >= 6) { setError("Six tags is plenty for one idea."); return; }
    if (draft.tags.some(t => t.toLowerCase() === value.toLowerCase())) { setTagInput(""); return; }
    setDraft(prev => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) { setError("Every idea needs a title."); return; }
    setBusy(true); setError("");
    const pending = tagInput.trim();
    const tags = pending && draft.tags.length < 6 ? [...draft.tags, pending] : draft.tags;
    if (await onSave({ ...draft, title: draft.title.trim(), content: draft.content.trim(), tags })) onClose();
    else setError("Couldn't save. Please try again.");
    setBusy(false);
  }

  return <Modal title={existing ? "A thought, expanded." : "Make room for an idea."} subtitle="Every connection starts somewhere." onClose={onClose}><form onSubmit={submit}><div className="modal-body form-stack"><Field label="Title"><input autoFocus required maxLength={200} placeholder="What is this idea about?" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Why it matters"><textarea rows={3} maxLength={3000} placeholder="What does it connect to in the bigger story?" value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} /></Field><Field label="Tags" hint="Type a tag and press Enter to add it."><div className="tag-input-row"><input maxLength={25} placeholder="e.g. Setting, Prop, Theme..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} /><button type="button" className="button" onClick={addTag} disabled={!tagInput.trim()}><Plus size={15} />Add</button></div><div className="chip-row">{draft.tags.map(tag => <span key={tag} className="chip">{tag}<button type="button" aria-label={`Remove tag ${tag}`} onClick={() => setDraft(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}><X size={12} /></button></span>)}{draft.tags.length === 0 && <span className="chip-hint">No tags yet</span>}</div></Field>{others.filter(o => o.id !== draft.id).length > 0 && <div className="field"><span>Connected ideas</span><div className="chip-row">{others.filter(o => o.id !== draft.id).map(o => { const active = draft.connections.includes(o.id) || o.connections.includes(draft.id); const locked = o.connections.includes(draft.id) && !draft.connections.includes(o.id); return <button key={o.id} type="button" className={`chip chip-toggle ${active ? "chip-active" : ""}`} title={locked ? "Linked from the other idea" : undefined} onClick={() => { if (locked) return; setDraft(prev => ({ ...prev, connections: active ? prev.connections.filter(id => id !== o.id) : [...prev.connections, o.id] })); }}>{o.title}{active && <Check size={12} />}</button>; })}</div><small className="chip-hint">Tip: on the map you can also drag the link port from one idea onto another.</small></div>}<Field label="Node color"><div className="note-colors"><span>Pick a shade</span>{colors.map(color => <button key={color} type="button" className={`color-choice ${color} ${draft.color === color ? "selected" : ""}`} onClick={() => setDraft({ ...draft, color })}>{draft.color === color && <Check size={15} />}</button>)}</div></Field></div>{error && <p className="form-error">{error}</p>}<div className="modal-footer">{existing && onDelete ? <button type="button" className="button button-ghost danger-text footer-left" onClick={onDelete}><Trash2 size={15} />Delete idea</button> : <span className="footer-left" />}<button type="button" className="button" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={busy}>{busy ? <LoaderCircle size={15} className="spin" /> : <Sparkles size={15} />}{existing ? "Save idea" : "Keep this thought"}</button></div></form></Modal>;
}
