import type { Character, CharacterRelation, FilmProject, RelationKind } from "./types";

/** How a relationship reads in a sentence: "Thomas Voss is Ella Voss's parent." */
export const relationNoun: Record<RelationKind, string> = {
  Parent: "parent",
  Child: "child",
  Sibling: "sibling",
  Grandparent: "grandparent",
  Grandchild: "grandchild",
  Partner: "partner",
  Spouse: "spouse",
  Friend: "friend",
  "Best friend": "best friend",
  Mentor: "mentor",
  Student: "student",
  Colleague: "colleague",
  Rival: "rival",
  Enemy: "enemy",
  Ally: "ally",
  Neighbour: "neighbour",
  Estranged: "estranged relative",
};

/** Family, warmth, work or friction — used to shade the chips so a cast reads at a glance. */
export const relationTone: Record<RelationKind, "kin" | "warm" | "cool" | "tense"> = {
  Parent: "kin", Child: "kin", Sibling: "kin", Grandparent: "kin", Grandchild: "kin",
  Partner: "warm", Spouse: "warm", Friend: "warm", "Best friend": "warm", Ally: "warm",
  Mentor: "cool", Student: "cool", Colleague: "cool", Neighbour: "cool",
  Rival: "tense", Enemy: "tense", Estranged: "tense",
};

/** The other side of a relationship, so "Thomas is Ella's parent" comes back as "Ella is Thomas's child". */
export const converseRelation: Record<RelationKind, RelationKind> = {
  Parent: "Child", Child: "Parent", Sibling: "Sibling", Grandparent: "Grandchild", Grandchild: "Grandparent",
  Partner: "Partner", Spouse: "Spouse", Friend: "Friend", "Best friend": "Best friend",
  Mentor: "Student", Student: "Mentor", Colleague: "Colleague", Rival: "Rival", Enemy: "Enemy",
  Ally: "Ally", Neighbour: "Neighbour", Estranged: "Estranged",
};

export const relationPhrase = (owner: Character, relation: CharacterRelation, target: Character) =>
  `${target.name} is ${owner.name}'s ${relationNoun[relation.kind]}`;

export interface CastRelationView { relation: CharacterRelation; target: Character }
export interface CastLinkLabel { owner: Character; kind: RelationKind; note?: string }
export interface CastLink { id: string; a: Character; b: Character; labels: CastLinkLabel[] }

/** Every relationship in a cast, once per pair of people, whichever way it was written. */
export function castLinks(characters: Character[]): CastLink[] {
  const byId = new Map(characters.map(c => [c.id, c]));
  const links = new Map<string, CastLink>();
  for (const owner of characters) {
    for (const relation of owner.relations || []) {
      const target = byId.get(relation.targetId);
      if (!target || target.id === owner.id) continue;
      const key = [owner.id, target.id].sort().join("|");
      const link = links.get(key) || { id: key, a: owner.id < target.id ? owner : target, b: owner.id < target.id ? target : owner, labels: [] };
      if (!link.labels.some(l => l.owner.id === owner.id && l.kind === relation.kind)) link.labels.push({ owner, kind: relation.kind, note: relation.note });
      links.set(key, link);
    }
  }
  return [...links.values()];
}

/** What this character says about others, and what the rest of the cast says about them. */
export function castRelations(characters: Character[], characterId: string) {
  const byId = new Map(characters.map(c => [c.id, c]));
  const outgoing: CastRelationView[] = (byId.get(characterId)?.relations || [])
    .map(relation => ({ relation, target: byId.get(relation.targetId) as Character }))
    .filter(view => view.target && view.target.id !== characterId);
  const incoming = characters
    .filter(c => c.id !== characterId)
    .flatMap(owner => (owner.relations || []).filter(r => r.targetId === characterId).map(relation => ({ relation, owner })));
  return { outgoing, incoming };
}

/** Relationship sentences for the people in a shot — used by the AI prompts. */
export function relationLines(project: FilmProject, characterIds: string[], limit = 3): string[] {
  const people = characterIds.map(id => project.characters.find(c => c.id === id)).filter((c): c is Character => Boolean(c));
  const present = new Set(people.map(p => p.id));
  const lines: string[] = [];
  const seen = new Set<string>();
  for (const owner of people) {
    for (const relation of owner.relations || []) {
      if (!present.has(relation.targetId)) continue;
      // both cards carry the link — describe each pair once
      const pair = [owner.id, relation.targetId].sort().join("|");
      if (seen.has(pair)) continue;
      seen.add(pair);
      const target = people.find(p => p.id === relation.targetId) as Character;
      lines.push(relationPhrase(owner, relation, target));
      if (lines.length >= limit) return lines;
    }
  }
  return lines;
}
