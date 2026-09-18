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

export const toneLabel: Record<"kin" | "warm" | "cool" | "tense", string> = {
  kin: "Family", warm: "Warm", cool: "Work & guidance", tense: "Friction",
};

/** The other side of a relationship, so "Thomas is Ella's parent" comes back as "Ella is Thomas's child". */
export const converseRelation: Record<RelationKind, RelationKind> = {
  Parent: "Child", Child: "Parent", Sibling: "Sibling", Grandparent: "Grandchild", Grandchild: "Grandparent",
  Partner: "Partner", Spouse: "Spouse", Friend: "Friend", "Best friend": "Best friend",
  Mentor: "Student", Student: "Mentor", Colleague: "Colleague", Rival: "Rival", Enemy: "Enemy",
  Ally: "Ally", Neighbour: "Neighbour", Estranged: "Estranged",
};

/** Words that read naturally in both directions, e.g. "Ella and Thomas are siblings". */
const pluralNoun: Partial<Record<RelationKind, string>> = {
  Sibling: "siblings", Partner: "partners", Spouse: "married", Friend: "friends", "Best friend": "best friends",
  Colleague: "colleagues", Rival: "rivals", Enemy: "enemies", Ally: "allies", Neighbour: "neighbours",
};

/** The wording shown to the person the link points at: "You are Thomas Voss's child." */
export const relationPhrase = (owner: Character, relation: CharacterRelation, target: Character) =>
  `${target.name} is ${owner.name}'s ${relationNoun[relation.kind]}`;

/** The same link read from the other side: what it says about the person holding it. */
export const incomingPhrase = (owner: Character, relation: CharacterRelation) =>
  `You are ${owner.name}'s ${relationNoun[relation.kind]}`;

export interface CastRelationView { relation: CharacterRelation; target: Character }

export interface CastLinkLabel { owner: Character; kind: RelationKind; note?: string }

/** One link between two people, whichever card (or cards) it was written on. */
export interface CastLink {
  id: string;
  a: Character;
  b: Character;
  labels: CastLinkLabel[];
  /** the kinds that describe the pair, in the order they should be shown */
  kinds: RelationKind[];
  /** a sentence a reader instantly understands: "Ella is Thomas's child" */
  gist: string;
  /** true when the link only exists on one of the two cards */
  oneSided: boolean;
  notes: string[];
  tone: "kin" | "warm" | "cool" | "tense";
}

export const pairKey = (a: string, b: string) => [a, b].sort().join("|");

/**
 * Every relationship in a cast, exactly once per pair of people, whichever way it was written.
 * Both cards normally carry the link (a parent on one, the child on the other); when they disagree
 * or only one side exists, the link is marked one-sided so the UI can say so instead of hiding it.
 */
export function castLinks(characters: Character[]): CastLink[] {
  const byId = new Map(characters.map(c => [c.id, c]));
  const links = new Map<string, CastLink>();
  for (const owner of characters) {
    for (const relation of owner.relations || []) {
      const target = byId.get(relation.targetId);
      if (!target || target.id === owner.id) continue;
      const key = pairKey(owner.id, target.id);
      const [first, second] = owner.id < target.id ? [owner, target] : [target, owner];
      const link = links.get(key) || { id: key, a: first, b: second, labels: [], kinds: [], gist: "", oneSided: true, notes: [], tone: relationTone[relation.kind] };
      if (!link.labels.some(l => l.owner.id === owner.id && l.kind === relation.kind)) link.labels.push({ owner, kind: relation.kind, note: relation.note });
      if (!link.kinds.includes(relation.kind)) link.kinds.push(relation.kind);
      if (relation.note && !link.notes.includes(relation.note)) link.notes.push(relation.note);
      links.set(key, link);
    }
  }
  for (const link of links.values()) {
    const aSays = link.labels.find(l => l.owner.id === link.a.id);
    const bSays = link.labels.find(l => l.owner.id === link.b.id);
    // Two sides are consistent when each one says the converse of the other.
    link.oneSided = !(aSays && bSays);
    // a's card holds a's wording, which describes b: "Thomas is Ella's parent".
    const fromA = aSays ? `${link.b.name} is ${link.a.name}'s ${relationNoun[aSays.kind]}` : "";
    const fromB = bSays ? `${link.a.name} is ${link.b.name}'s ${relationNoun[bSays.kind]}` : "";
    // Prefer one sentence. Symmetrical relationships read best as "A and B are siblings".
    const shared = aSays && bSays && aSays.kind === bSays.kind ? pluralNoun[aSays.kind] : undefined;
    link.gist = shared
      ? `${link.a.name} and ${link.b.name} are ${shared}`
      : aSays && bSays && converseRelation[aSays.kind] === bSays.kind
        ? fromA
        : [fromA, fromB].filter(Boolean).join(" · ") || `${link.a.name} and ${link.b.name}`;
    link.tone = relationTone[link.kinds[0]];
  }
  return [...links.values()].sort((x, y) => x.a.name.localeCompare(y.a.name) || x.b.name.localeCompare(y.b.name));
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

export interface RelatedPerson {
  character: Character;
  /** who that person is to this character, in this character's own words */
  noun: string;
  tone: "kin" | "warm" | "cool" | "tense";
  note?: string;
  /** true when the link was written on the other card and this one has not mirrored it yet */
  fromOtherCard: boolean;
}

/**
 * Everyone this character is connected to, read from either card. The cast cards use this so a
 * relationship always shows up on both people, even if only one card has been filled in.
 */
export function relatedCast(characterId: string, characters: Character[]): RelatedPerson[] {
  const byId = new Map(characters.map(c => [c.id, c]));
  const self = byId.get(characterId);
  if (!self) return [];
  const people: RelatedPerson[] = [];
  const seen = new Set<string>();
  for (const relation of self.relations || []) {
    const target = byId.get(relation.targetId);
    if (!target || target.id === characterId || seen.has(target.id)) continue;
    seen.add(target.id);
    people.push({ character: target, noun: relationNoun[relation.kind], tone: relationTone[relation.kind], note: relation.note, fromOtherCard: false });
  }
  for (const owner of characters) {
    if (owner.id === characterId || seen.has(owner.id)) continue;
    const relation = (owner.relations || []).find(r => r.targetId === characterId);
    if (!relation) continue;
    seen.add(owner.id);
    // The other card says who this character is to them — the converse is who they are to us.
    people.push({ character: owner, noun: relationNoun[converseRelation[relation.kind]], tone: relationTone[relation.kind], note: relation.note, fromOtherCard: true });
  }
  return people;
}

/** How many distinct pairs of people are linked. */
export const linkCount = (characters: Character[]) => castLinks(characters).length;

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
      const pair = pairKey(owner.id, relation.targetId);
      if (seen.has(pair)) continue;
      seen.add(pair);
      const target = people.find(p => p.id === relation.targetId) as Character;
      lines.push(relationPhrase(owner, relation, target));
      if (lines.length >= limit) return lines;
    }
  }
  return lines;
}
