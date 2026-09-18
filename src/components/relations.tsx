"use client";

import { useState } from "react";
import { Check, Link2, Plus, Trash2, UserRound } from "lucide-react";
import { RELATION_KINDS, type Character, type CharacterRelation, type FilmProject, type RelationKind } from "@/lib/types";
import { castLinks, castRelations, relationNoun, relationTone } from "@/lib/relations";
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

/** Relationship editor used inside the character dialog. */
export function RelationEditor({ character, characters, onChange }: { character: Character; characters: Character[]; onChange: (relations: CharacterRelation[]) => void }) {
  const relations = character.relations || [];
  const others = characters.filter(c => c.id !== character.id);
  // One link per pair of people: if the other card already holds it, it is edited from there.
  const linked = new Set([
    ...relations.map(r => r.targetId),
    ...characters.flatMap(c => (c.relations || []).filter(r => r.targetId === character.id).map(r => r.id === character.id ? "" : c.id)),
  ]);
  const available = others.filter(c => !linked.has(c.id));
  const [targetId, setTargetId] = useState("");
  const [kind, setKind] = useState<RelationKind>("Friend");
  const incoming = castRelations(characters, character.id).incoming;

  const set = (next: CharacterRelation[]) => onChange(next);
  const add = () => {
    if (!targetId) return;
    set([...relations, { id: uid(), targetId, kind }]);
    setTargetId("");
  };

  return <div className="relation-editor">
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

    {available.length > 0 && <div className="relation-add">
      <select aria-label="Add a relationship with" value={targetId} onChange={e => setTargetId(e.target.value)}>
        <option value="">Choose someone…</option>
        {available.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select aria-label="They are this character's" value={kind} onChange={e => setKind(e.target.value as RelationKind)}>
        {RELATION_KINDS.map(k => <option key={k}>{k}</option>)}
      </select>
      <button type="button" className="button button-small" onClick={add} disabled={!targetId}><Plus size={14} />Link</button>
    </div>}

    {relations.length > 0 && <p className="chip-hint">“They are this character’s…” — {relations[0] && characters.find(c => c.id === relations[0].targetId)?.name} reads as {relationNoun[relations[0].kind]} to {character.name}.</p>}

    {incoming.length > 0 && <div className="relation-incoming"><span className="eyebrow">SET FROM THE OTHER SIDE</span><div className="chip-row">{incoming.map(({ relation, owner }) => <span key={`${owner.id}-${relation.id}`} className={`chip chip-static tone-${relationTone[relation.kind]}`}>{owner.name} · {relationNoun[relation.kind]}<Check size={12} /></span>)}</div></div>}
  </div>;
}

const relationPhrase = (relation: CharacterRelation, owner: Character, target: Character) => `${target.name} is ${owner.name}'s ${relationNoun[relation.kind]}${relation.note ? ` — ${relation.note}` : ""}`;

/** Compact relationship chips for a cast card: who these people are to this character. */
export function RelationChips({ character, characters, limit = 4 }: { character: Character; characters: Character[]; limit?: number }) {
  const relations = (character.relations || []).map(relation => ({ relation, target: characters.find(c => c.id === relation.targetId) })).filter((view): view is { relation: CharacterRelation; target: Character } => Boolean(view.target));
  if (!relations.length) return null;
  return <div className="relation-chips">
    {relations.slice(0, limit).map(({ relation, target }) => <span key={relation.id} className={`relation-chip tone-${relationTone[relation.kind]}`} title={relationPhrase(relation, character, target)}><Link2 size={10} />{relation.kind} · {target.name}</span>)}
    {relations.length > limit && <span className="relation-chip tone-more">+{relations.length - limit} more</span>}
  </div>;
}

/** Every relationship in the cast, drawn once as a map and once as a list. */
export function RelationsMap({ project, onOpen, onAdd }: { project: FilmProject; onOpen: (character: Character) => void; onAdd: () => void }) {
  const characters = project.characters;
  const links = castLinks(characters);

  if (characters.length < 2) return <section className="view-enter"><div className="section-heading"><div><div className="section-title-row"><h2>Relationships</h2><span className="count-badge">0</span></div><p>Who knows who, and what they owe each other.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} />{characters.length ? "Add another character" : "Add character"}</button></div>
    <div className="empty-state"><span className="empty-icon"><Link2 size={29} strokeWidth={1.3} /></span><h3>Two people make a relationship.</h3><p>{characters.length ? "Add one more person to your cast, then link them from a character card." : "Build your cast, then connect them. Parent, rival, mentor — the links shape the drama."}</p></div></section>;

  // Lay the cast out on a circle so nobody overlaps and every link is readable.
  const radius = 0.33;
  const placed = characters.map((character, index) => {
    const angle = (index / characters.length) * Math.PI * 2 - Math.PI / 2;
    return { character, x: 50 + Math.cos(angle) * radius * 100, y: 50 + Math.sin(angle) * radius * 100 };
  });
  const position = new Map(placed.map(p => [p.character.id, p]));

  return <section className="view-enter cast-relations">
    <div className="section-heading"><div><div className="section-title-row"><h2>Relationships</h2><span className="count-badge">{links.length}</span></div><p>Who knows who, and what they owe each other. Links inform every AI prompt for a shot.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} />Add character</button></div>

    <div className="cast-map-card">
      <div className="cast-map">
        <svg className="cast-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(link => {
            const a = position.get(link.a.id)!; const b = position.get(link.b.id)!;
            const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
            const cx = 50 + (mx - 50) * 0.35; const cy = 50 + (my - 50) * 0.35;
            return <path key={link.id} className={`cast-link tone-${relationTone[link.labels[0].kind]}`} d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} />;
          })}
        </svg>
        {placed.map(({ character, x, y }) => <button key={character.id} className={`cast-node ${character.color}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => onOpen(character)} title={`Edit ${character.name}`}>
          <CastAvatar character={character} />
          <strong>{character.name}</strong>
          <small>{character.role}</small>
        </button>)}
      </div>
      {links.length === 0 && <p className="cast-map-empty">No links yet — open a character card and add who they are to someone else.</p>}
    </div>

    {links.length > 0 && <div className="cast-link-list">
      {links.map(link => <div key={link.id} className="cast-link-row">
        <button className="cast-link-person" onClick={() => onOpen(link.a)}><CastAvatar character={link.a} />{link.a.name}</button>
        <div className="cast-link-labels">
          {link.labels.map(label => {
            const other = label.owner.id === link.a.id ? link.b : link.a;
            return <span key={`${label.owner.id}-${label.kind}`} className={`relation-chip tone-${relationTone[label.kind]}`} title={label.note}><Link2 size={10} />{other.name} is {label.owner.name}&apos;s {relationNoun[label.kind]}</span>;
          })}
        </div>
        <button className="cast-link-person" onClick={() => onOpen(link.b)}><CastAvatar character={link.b} />{link.b.name}</button>
      </div>)}
    </div>}

    <div className="field-tip"><UserRound size={17} /><p>Relationships are saved with the project and exported in your project backup. Prompts mention them when two linked people share a shot.</p></div>
  </section>;
}
