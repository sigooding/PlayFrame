"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, Link2, Pencil, Plus, Trash2, UserRound, X } from "lucide-react";
import { RELATION_KINDS, type Character, type CharacterRelation, type FilmProject, type RelationKind } from "@/lib/types";
import { castLinks, castRelations, converseRelation, linkCount, relatedCast, relationNoun, relationTone, toneLabel, type CastLink } from "@/lib/relations";
import { initials } from "@/lib/image";

const uid = () => crypto.randomUUID();

/** Character avatar: the uploaded photo if there is one, otherwise initials. Never a broken image. */
export function CastAvatar({ character, className = "" }: { character: Character; className?: string }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(character.image) && !failed;
  return <span className={`relation-avatar ${character.color} ${className}`}>
    {showPhoto ? <img src={character.image} alt="" onError={() => setFailed(true)} /> : initials(character.name)}
  </span>;
}

/** A sentence that describes one link, in the holder's own words. */
const linkSentence = (owner: Character, target: Character, kind: RelationKind) => `${target.name} is ${owner.name}'s ${relationNoun[kind]}`;

/** Relationship editor used inside the character dialog. Writes what this person calls everyone else. */
export function RelationEditor({ character, characters, onChange }: { character: Character; characters: Character[]; onChange: (relations: CharacterRelation[]) => void }) {
  const relations = character.relations || [];
  const others = characters.filter(c => c.id !== character.id);
  // One link per pair of people: if the other card already holds it, it is edited from there.
  const linked = new Set([
    ...relations.map(r => r.targetId),
    ...characters.flatMap(c => (c.relations || []).filter(r => r.targetId === character.id).map(r => (r.id === character.id ? "" : c.id))),
  ]);
  const available = others.filter(c => !linked.has(c.id));
  const [targetId, setTargetId] = useState("");
  const [kind, setKind] = useState<RelationKind>("Friend");
  const incoming = castRelations(characters, character.id).incoming;
  const first = relations[0] ? characters.find(c => c.id === relations[0].targetId) : undefined;

  const set = (next: CharacterRelation[]) => onChange(next);
  const add = () => {
    if (!targetId) return;
    set([...relations, { id: uid(), targetId, kind }]);
    setTargetId("");
  };

  return <div className="relation-editor">
    <p className="chip-hint">{character.name ? `${character.name} — ` : ""}the wording below is what <strong>{character.name || "this character"}</strong> calls each person.</p>
    {others.length === 0 && <p className="chip-hint">Add another person to the cast and you can connect them here.</p>}

    {relations.length > 0 && <ul className="relation-list">
      {relations.map(relation => {
        const target = characters.find(c => c.id === relation.targetId);
        if (!target) return null;
        return <li key={relation.id} className={`relation-row tone-${relationTone[relation.kind]}`}>
          <span className="relation-person"><CastAvatar character={target} />{target.name}</span>
          <select aria-label={`Relationship with ${target.name}`} value={relation.kind} onChange={e => set(relations.map(r => r.id === relation.id ? { ...r, kind: e.target.value as RelationKind } : r))}>
            {RELATION_KINDS.map(k => <option key={k}>{k}</option>)}
          </select>
          <input aria-label={`How ${target.name} and ${character.name} play on screen`} maxLength={120} placeholder="How it plays on screen (optional)" value={relation.note || ""} onChange={e => set(relations.map(r => r.id === relation.id ? { ...r, note: e.target.value } : r))} />
          <button type="button" className="icon-button danger-hover" aria-label={`Remove relationship with ${target.name}`} onClick={() => set(relations.filter(r => r.id !== relation.id))}><Trash2 size={13} /></button>
        </li>;
      })}
    </ul>}

    {relations.length > 0 && first && <p className="relation-reads-as"><ArrowLeftRight size={13} />Reads as: <strong>{linkSentence(character, first, relations[0].kind)}</strong> — and {first.name}&apos;s card will say “{character.name} is {first.name}&apos;s {relationNoun[converseRelation[relations[0].kind]]}”.</p>}

    <div className="relation-add">
      <select aria-label="Add a relationship with" value={targetId} onChange={e => setTargetId(e.target.value)} disabled={available.length === 0}>
        <option value="">{available.length > 0 ? "Choose someone…" : "Everyone in cast is already linked"}</option>
        {available.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select aria-label="They are this character's" value={kind} onChange={e => setKind(e.target.value as RelationKind)} disabled={available.length === 0}>
        {RELATION_KINDS.map(k => <option key={k}>{k}</option>)}
      </select>
      <button type="button" className="button button-small" onClick={add} disabled={!targetId}><Plus size={14} />Link</button>
      {targetId && <span className="chip-hint">{linkSentence(character, characters.find(c => c.id === targetId) as Character, kind)}</span>}
    </div>
    {others.length > 0 && available.length === 0 && <p className="chip-hint">Everyone else is already linked — {linked.size === 1 ? "that link is" : "those links are"} held on the other card{linked.size === 1 ? "" : "s"}.</p>}

    {incoming.length > 0 && <div className="relation-incoming"><span className="eyebrow">SET FROM THE OTHER SIDE</span><div className="chip-row">{incoming.map(({ relation, owner }) => <span key={`${owner.id}-${relation.id}`} className={`chip chip-static tone-${relationTone[relation.kind]}`} title={`${owner.name} lists ${character.name || "this character"} as their ${relationNoun[relation.kind]}`}>{character.name || "This character"} is {owner.name}&apos;s {relationNoun[relation.kind]}<Check size={12} /></span>)}</div></div>}
  </div>;
}

/** Compact relationship chips for a cast card: who these people are to this character. */
export function RelationChips({ character, characters, limit = 4 }: { character: Character; characters: Character[]; limit?: number }) {
  const people = relatedCast(character.id, characters);
  if (!people.length) return <div className="relation-chips relation-chips-empty"><span className="relation-chip tone-more">No links yet</span></div>;
  return <div className="relation-chips">
    {people.slice(0, limit).map(person => <span key={person.character.id} className={`relation-chip tone-${person.tone}`} title={`${person.character.name} is ${character.name}'s ${person.noun}${person.note ? ` — ${person.note}` : ""}`}><Link2 size={10} />{person.character.name} <i>· {person.noun}</i></span>)}
    {people.length > limit && <span className="relation-chip tone-more">+{people.length - limit} more</span>}
  </div>;
}

/**
 * Where each person sits on the map.
 *
 * Up to six people go round a single circle, which reads like a story. Past that the cast moves to
 * evenly spaced rows, because rows are the one layout that cannot collide however many names there
 * are: the rows are far enough apart that two of them never share a vertical band (40% of the map
 * height is more than a name is tall), and inside a row everyone is a clear node-width apart.
 * Positions are pure maths on the cast list, so the server and the browser always agree.
 */
const CIRCLE_RADIUS = 0.31;
const ROW_LAYOUTS: Record<number, number[]> = { 2: [30, 70], 3: [21, 50, 79], 4: [17, 39, 61, 83] };
const ROW_X_START = 15;
const ROW_X_SPAN = 70;

export function mapPositions<T>(items: T[]) {
  const count = Math.max(items.length, 1);
  if (count <= 6) {
    return items.map((item, index) => {
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
      return { item, x: 50 + Math.cos(angle) * CIRCLE_RADIUS * 100, y: 50 + Math.sin(angle) * CIRCLE_RADIUS * 100 };
    });
  }
  // Never more than four names in a row: that keeps a clear node-width between them even on a phone.
  const rows = Math.min(4, Math.ceil(count / 4));
  const perRow = Math.ceil(count / rows);
  return items.map((item, index) => {
    const row = Math.floor(index / perRow);
    const inRow = Math.min(perRow, count - row * perRow);
    const column = index - row * perRow;
    const x = inRow === 1 ? 50 : ROW_X_START + (ROW_X_SPAN * column) / (inRow - 1);
    const y = (ROW_LAYOUTS[rows] || ROW_LAYOUTS[2])[row];
    return { item, x, y };
  });
}

/** Short label for a link so the map can be read without hovering: "siblings", "parent", "rivals". */
function shortLinkLabel(link: CastLink): string {
  const shared = link.labels.length === 2 && link.labels[0].kind === link.labels[1].kind && link.labels[0].kind !== "Estranged";
  if (shared) {
    const noun = relationNoun[link.labels[0].kind];
    return ["Parent", "Child", "Grandparent", "Grandchild", "Mentor", "Student"].includes(link.labels[0].kind) ? noun : `${noun}s`;
  }
  return relationNoun[link.kinds[0]];
}

function ConnectPanel({ characters, preset, onLink, onClose }: { characters: Character[]; preset?: { a?: string; b?: string }; onLink: (aId: string, bId: string, kind: RelationKind, note?: string) => void; onClose: () => void }) {
  const [aId, setAId] = useState(preset?.a || characters[0]?.id || "");
  const [bId, setBId] = useState(preset?.b || characters.find(c => c.id !== (preset?.a || characters[0]?.id))?.id || "");
  const [kind, setKind] = useState<RelationKind>("Sibling");
  const [note, setNote] = useState("");
  const a = characters.find(c => c.id === aId);
  const b = characters.find(c => c.id === bId);
  const ready = Boolean(a && b && a.id !== b.id);
  return <div className="relation-connect" role="group" aria-label="Add a relationship">
    <div className="relation-connect-row">
      <select aria-label="First character" value={aId} onChange={e => setAId(e.target.value)}>{characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select aria-label="Who the second person is to the first" value={kind} onChange={e => setKind(e.target.value as RelationKind)}>{RELATION_KINDS.map(k => <option key={k}>{k}</option>)}</select>
      <select aria-label="Second character" value={bId} onChange={e => setBId(e.target.value)}>{characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
    </div>
    <input aria-label="How it plays on screen" maxLength={120} placeholder="How it plays on screen (optional)" value={note} onChange={e => setNote(e.target.value)} />
    <div className="relation-connect-foot">
      <p>{ready ? <><strong>{b!.name}</strong> is <strong>{a!.name}</strong>&apos;s {relationNoun[kind].toLowerCase()} — and {a!.name} is {b!.name}&apos;s {relationNoun[converseRelation[kind]].toLowerCase()}. Both cards get the link.</> : "Pick two different people."}</p>
      <div className="relation-connect-actions">
        <button type="button" className="button" onClick={onClose}>Done</button>
        <button type="button" className="button button-primary" disabled={!ready} onClick={() => { if (ready) { onLink(a!.id, b!.id, kind, note.trim() || undefined); setNote(""); } }}><Link2 size={15} />Link them</button>
      </div>
    </div>
  </div>;
}

/**
 * Every relationship in the cast: a readable map, one card per pair, and each character's storyline.
 * Links are written on both cards, so the map cannot drift out of step with the cast.
 */
export function RelationsMap({ project, onOpen, onAdd, onLink, onUnlink }: {
  project: FilmProject;
  onOpen: (character: Character) => void;
  onAdd: () => void;
  onLink: (aId: string, bId: string, kind: RelationKind, note?: string) => void;
  onUnlink: (aId: string, bId: string) => void;
}) {
  const characters = project.characters;
  const links = useMemo(() => castLinks(characters), [characters]);
  const [focus, setFocus] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [preset, setPreset] = useState<{ a?: string; b?: string } | undefined>(undefined);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const total = linkCount(characters);
  const openConnect = (next?: { a?: string; b?: string }) => { setPreset(next); setConnecting(true); setFocus(null); };

  if (characters.length < 2) return <section className="view-enter cast-relations"><div className="section-heading"><div><div className="section-title-row"><h2>Relationships</h2><span className="count-badge">0</span></div><p>Who knows who, and what they owe each other.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} />{characters.length ? "Add another character" : "Add character"}</button></div>
    <div className="empty-state"><span className="empty-icon"><Link2 size={29} strokeWidth={1.3} /></span><h3>Two people make a relationship.</h3><p>{characters.length ? "Add one more person to your cast, then link them here — or from their character card." : "Build your cast, then connect them. Parent, rival, mentor — the links shape the drama."}</p></div></section>;

  const placed = mapPositions(characters);
  const position = new Map(placed.map(p => [p.item.id, p]));
  const visibleLinks = focus ? links.filter(link => link.a.id === focus || link.b.id === focus) : links;
  const mapHeight = characters.length > 10 ? 520 : characters.length > 6 ? 460 : 380;

  return <section className="view-enter cast-relations">
    <div className="section-heading"><div><div className="section-title-row"><h2>Relationships</h2><span className="count-badge">{links.length}</span></div><p>Who knows who, and what they owe each other. Links inform every AI prompt for a shot.</p></div><div className="section-actions">{total > 0 && <button className="button" onClick={() => setFocus(null)} disabled={!focus}><X size={14} />Clear focus</button>}<button className="button button-primary" onClick={() => (connecting ? setConnecting(false) : openConnect())} aria-expanded={connecting}><Plus size={16} />Add a relationship</button></div></div>

    {connecting && <ConnectPanel characters={characters} preset={preset} onLink={(aId, bId, kind, note) => onLink(aId, bId, kind, note)} onClose={() => setConnecting(false)} />}

    <div className="cast-map-card">
      <div className="cast-map" style={{ height: mapHeight }}>
        <svg className="cast-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(link => {
            const a = position.get(link.a.id)!; const b = position.get(link.b.id)!;
            const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
            const cx = 50 + (mx - 50) * 0.45; const cy = 50 + (my - 50) * 0.45;
            const dim = (focus && link.a.id !== focus && link.b.id !== focus) ? " dim" : "";
            return <path key={link.id} data-relation-pair={link.id} className={`cast-link tone-${link.tone}${dim}`} d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} />;
          })}
        </svg>
        {links.length > 0 && links.length <= 6 && links.map(link => {
          const a = position.get(link.a.id)!; const b = position.get(link.b.id)!;
          const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
          const cx = 50 + (mx - 50) * 0.45; const cy = 50 + (my - 50) * 0.45;
          const t = 0.5;
          const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
          const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
          return <span key={`l-${link.id}`} className={`cast-link-label tone-${link.tone}`} style={{ left: `${x}%`, top: `${y}%` }}>{shortLinkLabel(link)}</span>;
        })}
        {placed.map(({ item, x, y }) => {
          const isFocused = focus === item.id;
          const related = !focus || isFocused || links.some(l => (l.a.id === focus && l.b.id === item.id) || (l.b.id === focus && l.a.id === item.id));
          return <button key={item.id} data-cast-node={item.id} className={`cast-node ${item.color} ${isFocused ? "focused" : ""} ${related ? "" : "dim"}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => onOpen(item)} title={`Open ${item.name}'s character card`} aria-pressed={isFocused}>
            <CastAvatar character={item} />
            <strong>{item.name}</strong>
            <small>{item.role}</small>
          </button>;
        })}
      </div>
      {links.length === 0 ? <p className="cast-map-empty">No links yet — choose <strong>Add a relationship</strong>, or open a character card and say who everyone is to them.</p>
        : <div className="cast-map-foot">
          <div className="relation-legend">{(Object.keys(toneLabel) as (keyof typeof toneLabel)[]).map(tone => <span key={tone} className={`relation-legend-item tone-${tone}`}><i />{toneLabel[tone]}</span>)}</div>
          <p>{focus ? <>Showing <strong>{characters.find(c => c.id === focus)?.name}</strong>&apos;s links. <button className="text-button" onClick={() => onOpen(characters.find(c => c.id === focus)!)}>Open their card</button></> : "Click any character node to open their details."}</p>
        </div>}
    </div>

    {links.length > 0 && <div className="relations-section">
      <div className="relations-section-head"><h3>Who knows who</h3><span>{links.length} {links.length === 1 ? "link" : "links"}</span></div>
      <div className="cast-link-list">
        {visibleLinks.map(link => <article key={link.id} className={`relation-card cast-link-row tone-${link.tone}`} data-relation-card={link.id}>
          <div className="relation-card-people">
            <button className="cast-link-person" onClick={() => onOpen(link.a)} title={`Open ${link.a.name}`}><CastAvatar character={link.a} />{link.a.name}</button>
            <Link2 size={14} className="relation-card-tie" />
            <button className="cast-link-person" onClick={() => onOpen(link.b)} title={`Open ${link.b.name}`}><CastAvatar character={link.b} />{link.b.name}</button>
          </div>
          <p className="relation-card-gist" data-relation-gist={link.gist}>
            {link.kinds.map(kind => <span key={kind} className={`relation-chip tone-${relationTone[kind]}`}>{relationNoun[kind]}</span>)}
            {link.gist}
          </p>
          {link.sentences && link.sentences.length > 1 && (
            <div className="relation-card-sentences" style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: "11px", color: "#7a8d6e" }}>
              {link.sentences.map((s, idx) => (
                <span key={idx} className="relation-sentence-item">{s}</span>
              ))}
            </div>
          )}
          {link.oneSided && <p className="relation-card-warn">Only one card carries this link — the map shows it, but the other card is empty. <button className="text-button" onClick={() => onLink(link.a.id, link.b.id, link.labels[0].kind, link.labels[0].note)}>Write it on both cards</button></p>}
          {link.notes.length > 0 && editingNote !== link.id && <p className="relation-card-note">“{link.notes[0]}”</p>}
          {editingNote === link.id
            ? <div className="relation-card-note-edit">
              <input aria-label={`Note for ${link.a.name} and ${link.b.name}`} maxLength={120} placeholder="How it plays on screen…" value={noteDraft} onChange={e => setNoteDraft(e.target.value)} autoFocus />
              <button className="button button-small button-primary" onClick={() => { onLink(link.a.id, link.b.id, link.kinds[0], noteDraft.trim() || undefined); setEditingNote(null); }}>Save note</button>
              <button className="button button-small" onClick={() => setEditingNote(null)}>Cancel</button>
            </div>
            : <div className="relation-card-actions">
              <button className="text-button" onClick={() => { setEditingNote(link.id); setNoteDraft(link.notes[0] || ""); }}><Pencil size={12} />{link.notes.length ? "Edit note" : "Add a note"}</button>
              <button className="text-button danger-text" onClick={() => onUnlink(link.a.id, link.b.id)}><Trash2 size={12} />Remove link</button>
            </div>}
        </article>)}
      </div>
    </div>}

    <div className="relations-section">
      <div className="relations-section-head"><h3>Every storyline</h3><span>{characters.length} people</span></div>
      <div className="storyline-grid">
        {characters.map(character => {
          const people = relatedCast(character.id, characters);
          return <article key={character.id} className={`storyline-card ${focus === character.id ? "focused" : ""}`}>
            <header>
              <button className="cast-link-person" onClick={() => onOpen(character)} title={`Open ${character.name}`}><CastAvatar character={character} /><span><strong>{character.name}</strong><small>{character.role}</small></span></button>
              <button className="icon-button" aria-label={`Add a relationship for ${character.name}`} title="Add a relationship" onClick={() => openConnect({ a: character.id })}><Plus size={14} /></button>
            </header>
            {people.length === 0 ? <p className="storyline-empty">No links yet.</p>
              : <ul className="storyline-list">{people.map(person => <li key={person.character.id} className={`tone-${person.tone}`}>
                <button className="storyline-person" onClick={() => onOpen(person.character)}>
                  <CastAvatar character={person.character} />
                  <span><strong>{person.character.name}</strong> is {character.name}&apos;s {person.noun}{person.note && <em>{person.note}</em>}</span>
                </button>
              </li>)}</ul>}
          </article>;
        })}
      </div>
    </div>

    <div className="field-tip"><UserRound size={17} /><p>Relationships are stored on both cards, saved with the project, and exported in your project backup. AI prompts name them whenever two linked people share a shot.</p></div>
  </section>;
}
