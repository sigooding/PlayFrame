"use client";

import { ArrowUpRight, Link2, Plus, UserCircle } from "lucide-react";
import type { Character, Scene } from "@/lib/types";
import { CastAvatar, RelationChips } from "./relations";
import { relatedCast } from "@/lib/relations";

export function CharactersView({ project, characters, scenes, onEdit, onAdd, onRelate }: { project: { title: string; format: string }; characters: Character[]; scenes: Scene[]; onEdit: (c: Character) => void; onAdd?: () => void; onRelate?: () => void }) {
  const getScenePresence = (charId: string) => scenes.filter(s => s.characters?.includes(charId)).length;
  const links = characters.reduce((sum, character) => sum + relatedCast(character.id, characters).length, 0) / 2;
  return <section className="view-enter"><div className="section-heading"><div><div className="section-title-row"><h2>The Cast</h2><span className="count-badge">{characters.length}</span></div><p>The people who make this film matter.</p></div><div className="section-actions">{onRelate && characters.length > 1 && <button className="button" onClick={onRelate}><Link2 size={15} />Relationships{links ? ` · ${links}` : ""}</button>}{onAdd && <button className="button button-primary" onClick={onAdd}><Plus size={16} />Add character</button>}</div></div>
    {characters.length === 0 ? (
      <div className="empty-state"><span className="empty-icon"><UserCircle size={30} strokeWidth={1.2} /></span><h3>Every great story starts with someone.</h3><p>Build your cast. Define their roles. See which scenes they live in.</p></div>
    ) : (
      <div className="notes-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
        {characters.map(char => (
          <button key={char.id} className="note-card cast-card" onClick={() => onEdit(char)}>
            <div className="note-card-top cast-card-top">
              <span className={`cast-portrait ${char.color}`}><CastAvatar character={char} /></span>
              <span className="cast-card-role" style={{ fontSize: 10, letterSpacing: 1.1, color: char.color === "rose" ? "#b89a86" : char.color === "clay" ? "#967a55" : char.color === "sand" ? "#b0a378" : "#8aa671", fontWeight: 500 }}>{char.role.toUpperCase()}</span>
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 27, lineHeight: 1.15, color: char.color === "rose" ? "#8a7166" : char.color === "clay" ? "#967a55" : char.color === "sand" ? "#978555" : "#607d50" }}>{char.name}</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              <span style={{ fontSize: 9.5, padding: "2px 5px", background: "#f0f2e6", borderRadius: 3, color: "#788758" }}>{char.age}</span>
              <span style={{ fontSize: 9.5, padding: "2px 5px", background: char.color === "rose" ? "#f7ebe8" : char.color === "clay" ? "#ebe5da" : char.color === "sand" ? "#f5efe3" : "#edf3e5", borderRadius: 3, color: char.color === "rose" ? "#9a6c55" : char.color === "clay" ? "#967a55" : char.color === "sand" ? "#978555" : "#678154", border: `1px solid ${char.color === "rose" ? "#e2cdc8" : char.color === "clay" ? "#d9ccc0" : char.color === "sand" ? "#e5d8bc" : "#d0dfc4"}` }}>{char.traits.join(", ")}</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: char.color === "rose" ? "#b09086" : char.color === "clay" ? "#a08c78" : char.color === "sand" ? "#b8a57c" : "#8ca372", marginTop: 14, whiteSpace: "pre-wrap" }}>{char.description}</p>
            <RelationChips character={char} characters={characters} />
            <div className="note-card-bottom" style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #eae8d3", marginTop: 16, fontSize: 8.5, color: char.color === "rose" ? "#c2a898" : char.color === "clay" ? "#bcae9a" : char.color === "sand" ? "#c4bc9e" : "#b5c6a2" }}>
              <span>Present in {getScenePresence(char.id)} scenes</span>
              <ArrowUpRight size={13} />
            </div>
          </button>
        ))}
      </div>
    )}
  </section>;
}
