import {
  CAMERA_ANGLES, CAMERA_MOVEMENTS, LENSES, LIGHTING, RELATION_KINDS, SCENE_KINDS, SHOT_TYPES, TRANSITIONS,
  type Act, type ActPart, type BrainstormNode, type CameraAngle, type CameraMovement, type Character, type CharacterRelation, type FrameAudio, type Lens, type Lighting, type MoodBoard, type ProjectNote, type ProjectPatch, type RelationKind, type Scene, type SceneKind, type ShotType, type StoryFrame, type Transition,
} from "./types";

// Collection ceilings. validatePatch rejects anything above them and sanitizeImport truncates to
// them, so the two must never disagree. MAX_FRAMES is 1000 rather than 500 because a whole-series
// storyboard is legitimately that long: the bundled Let the Raptures Commence workspace carries 525
// numbered shots and legacy reference boards across eight episodes, and silently truncating it on
// import would drop the tail of the season.
export const MAX_ACTS = 20;
export const MAX_SCENES = 500;
export const MAX_FRAMES = 1000;

export const MAX_NOTES = 500;

const frameStatuses = ["Draft", "Ready", "Needs review"];
const noteColors = ["sage", "sand", "rose"];
const entityColors = ["sage", "sand", "rose", "clay"];
const nodeColors = ["sage", "sand", "rose", "clay", "ink"];

export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const string = (value: unknown, max = 20000): value is string => typeof value === "string" && value.length <= max;
const audioSrc = (value: unknown): value is string => string(value, 300) && /^\/audio\/[A-Za-z0-9._\/-]+\.(mp3|wav|m4a|ogg)$/.test(value) && !value.includes("..");
const audioOk = (a: FrameAudio) => a && string(a.id, 100) && string(a.character, 120) && string(a.text, 2000) && audioSrc(a.src) && Number.isFinite(a.offset) && a.offset >= 0 && a.offset <= 3600 && (a.duration === undefined || (Number.isFinite(a.duration) && a.duration > 0 && a.duration <= 600)) && (a.voice === undefined || string(a.voice, 100)) && (a.model === undefined || string(a.model, 100));
const image = (value: unknown): value is string => string(value, 6_000_000) && (value.startsWith("/images/") || /^https?:\/\//i.test(value) || /^data:image\/(jpeg|png|webp);base64,/.test(value) || value === "");
const optionalIn = (value: unknown, list: readonly string[]) => value === undefined || value === "" || value === null || (typeof value === "string" && list.includes(value));
const optionalId = (value: unknown) => value === undefined || value === null || value === "" || string(value, 100);
const strings = (value: unknown, max = 100) => value === undefined || value === null || (Array.isArray(value) && value.every(v => string(v, max)));

const sceneOk = (s: Scene) => s && (s.number === undefined || (string(s.number, 20) && /^\d+[A-Z]?$/i.test(s.number))) && string(s.id, 100) && string(s.title, 300) && string(s.location, 300) && string(s.time, 100) && string(s.description) && strings(s.characters) && optionalId(s.actId) && optionalId(s.partId) && optionalIn(s.kind, SCENE_KINDS) && optionalIn(s.lighting, LIGHTING) && (s.lightingNotes === undefined || string(s.lightingNotes, 1000)) && (s.style === undefined || string(s.style, 60));
const actOk = (a: Act) => a && string(a.id, 100) && string(a.title, 120) && a.title.trim() && string(a.description, 2000) && (a.parts === undefined || (Array.isArray(a.parts) && a.parts.length <= 30 && a.parts.every((p: ActPart) => p && string(p.id, 100) && string(p.title, 160) && p.title.trim() && string(p.description, 1000))));
const frameOk = (f: StoryFrame) => f && (f.shotNumber === undefined || (Number.isSafeInteger(f.shotNumber) && f.shotNumber > 0 && f.shotNumber <= 1_000_000)) && string(f.id, 100) && string(f.sceneId, 100) && string(f.title, 300) && string(f.description) && image(f.image) && SHOT_TYPES.includes(f.shotType) && CAMERA_MOVEMENTS.includes(f.movement) && frameStatuses.includes(f.status) && Number.isFinite(f.duration) && f.duration > 0 && f.duration <= 3600 && string(f.notes) && strings(f.characters) && optionalIn(f.angle, CAMERA_ANGLES) && optionalIn(f.lens, LENSES) && optionalIn(f.lighting, LIGHTING) && (f.lightingNotes === undefined || string(f.lightingNotes, 1000)) && (f.durationIsEstimate === undefined || typeof f.durationIsEstimate === "boolean") && optionalIn(f.transition, TRANSITIONS) && (f.style === undefined || string(f.style, 60)) && (f.mood === undefined || string(f.mood, 300)) && (f.audio === undefined || (Array.isArray(f.audio) && f.audio.length <= 40 && f.audio.every(audioOk)));
const noteOk = (n: ProjectNote) => n && string(n.id, 100) && string(n.title, 300) && string(n.content) && noteColors.includes(n.color) && string(n.createdAt, 100) && strings(n.tags, 40) && (n.connections === undefined || (Array.isArray(n.connections) && n.connections.every(c => c && string(c.targetId, 100) && string(c.label, 80))));
const relationOk = (r: CharacterRelation) => r && string(r.id, 100) && string(r.targetId, 100) && RELATION_KINDS.includes(r.kind) && (r.note === undefined || string(r.note, 120));
const characterOk = (c: Character) => c && string(c.id, 100) && string(c.name, 120) && c.name.trim() && string(c.role, 80) && string(c.age, 40) && string(c.description, 700) && Array.isArray(c.traits) && c.traits.every(t => string(t, 50)) && entityColors.includes(c.color) && (c.image === undefined || image(c.image)) && (c.relations === undefined || (Array.isArray(c.relations) && c.relations.length <= 40 && c.relations.every(relationOk))) && string(c.createdAt, 100);
const nodeOk = (b: BrainstormNode) => b && string(b.id, 100) && string(b.title, 200) && string(b.content, 3000) && nodeColors.includes(b.color) && Array.isArray(b.tags) && b.tags.every(t => string(t, 40)) && Array.isArray(b.connections) && b.connections.every(id => string(id, 100)) && Number.isFinite(b.x) && Number.isFinite(b.y) && Math.abs(b.x) < 20000 && Math.abs(b.y) < 20000 && string(b.createdAt, 100);
const boardOk = (m: MoodBoard) => m && string(m.id, 100) && string(m.title, 200) && m.title.trim() && string(m.description, 2000) && optionalId(m.actId) && optionalId(m.sceneId) && string(m.createdAt, 100) && Array.isArray(m.items) && m.items.length <= 40 && m.items.every(i => i && string(i.id, 100) && image(i.image) && string(i.caption, 300));

export function validatePatch(input: Record<string, unknown>): ProjectPatch {
  const patch: ProjectPatch = {};
  for (const key of ["title", "description", "genre", "format", "status", "script"] as const) {
    if (input[key] !== undefined) {
      const max = key === "script" ? 500000 : key === "title" ? 180 : ["genre", "format", "status"].includes(key) ? 80 : 20000;
      if (!string(input[key], max)) throw new Error(`Invalid ${key}. Please shorten this field.`);
      if (key === "title" && !input[key].trim()) throw new Error("Give your project a title.");
      patch[key] = input[key];
    }
  }
  if (input.coverImage !== undefined) {
    if (!image(input.coverImage)) throw new Error("Invalid cover image.");
    patch.coverImage = input.coverImage;
  }
  if (input.acts !== undefined) {
    if (!Array.isArray(input.acts) || input.acts.length > MAX_ACTS || !input.acts.every(actOk)) throw new Error("Please check your act and sequence details.");
    patch.acts = input.acts as Act[];
  }
  if (input.scenes !== undefined) {
    if (!Array.isArray(input.scenes) || input.scenes.length > MAX_SCENES || !input.scenes.every(sceneOk)) throw new Error("Please check your scene details.");
    patch.scenes = input.scenes as Scene[];
  }
  if (input.frames !== undefined) {
    if (!Array.isArray(input.frames) || input.frames.length > MAX_FRAMES || !input.frames.every(frameOk)) throw new Error("Please check your frame details. Duration must be between 1 and 3,600 seconds.");
    patch.frames = input.frames as StoryFrame[];
  }
  if (input.notes !== undefined) {
    if (!Array.isArray(input.notes) || input.notes.length > MAX_NOTES || !input.notes.every(noteOk)) throw new Error("Please check your note details.");
    patch.notes = input.notes as ProjectNote[];
  }
  if (input.characters !== undefined) {
    if (!Array.isArray(input.characters) || input.characters.length > 200 || !input.characters.every(characterOk)) throw new Error("Please check your character details.");
    patch.characters = input.characters as Character[];
  }
  if (input.brainstorm !== undefined) {
    if (!Array.isArray(input.brainstorm) || input.brainstorm.length > 150 || !input.brainstorm.every(nodeOk)) throw new Error("Please check your brainstorm nodes.");
    patch.brainstorm = input.brainstorm as BrainstormNode[];
  }
  if (input.moodboards !== undefined) {
    if (!Array.isArray(input.moodboards) || input.moodboards.length > 40 || !input.moodboards.every(boardOk)) throw new Error("Please check your mood board details. Use JPG, PNG, WebP or an image URL, and up to 40 images per board.");
    patch.moodboards = input.moodboards as MoodBoard[];
  }
  return patch;
}

/* ---------------------------------- import ---------------------------------- */

const text = (value: unknown, max: number, fallback = "") => (typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback);
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const id = (value: unknown) => (typeof value === "string" && value.length <= 100 && value ? value : crypto.randomUUID());
const sanitizeAudio = (value: unknown): FrameAudio[] | undefined => {
  const clips = list(value).slice(0, 40).map((raw): FrameAudio | null => {
    const a = (raw || {}) as Record<string, unknown>;
    const offset = Number(a.offset);
    const duration = Number(a.duration);
    if (!audioSrc(a.src) || !Number.isFinite(offset) || offset < 0) return null;
    return {
      id: id(a.id), character: text(a.character, 120, "Unknown"), text: text(a.text, 2000), src: a.src,
      textJa: text(a.textJa, 2000) || undefined, language: text(a.language, 12) || undefined,
      offset: Math.min(3600, Math.round(offset * 100) / 100),
      duration: Number.isFinite(duration) && duration > 0 ? Math.min(600, Math.round(duration * 100) / 100) : undefined,
      voice: text(a.voice, 100) || undefined, model: text(a.model, 100) || undefined,
    };
  }).filter((a): a is FrameAudio => a !== null);
  return clips.length ? clips : undefined;
};
const ids = (value: unknown, limit = 60) => list(value).filter((v): v is string => typeof v === "string" && v.length <= 100).slice(0, limit);

/** Tolerant conversion of an uploaded project file (or JSON blob) into a validated patch. */
export function sanitizeImport(raw: unknown): ProjectPatch & { title: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("That file doesn't contain a project.");
  const input = raw as Record<string, unknown>;
  const acts: Act[] = list(input.acts).slice(0, 20).map(a => {
    const act = (a || {}) as Record<string, unknown>;
    return {
      id: id(act.id),
      title: text(act.title, 120, "Act"),
      description: text(act.description, 2000),
      parts: list(act.parts).slice(0, 30).map(p => {
        const part = (p || {}) as Record<string, unknown>;
        return { id: id(part.id), title: text(part.title, 160, "Sequence"), description: text(part.description, 1000) };
      }),
    };
  });
  const actIds = new Set(acts.map(a => a.id));
  const partIds = new Set(acts.flatMap(a => (a.parts || []).map(p => p.id)));

  const scenes: Scene[] = list(input.scenes).slice(0, MAX_SCENES).map(s => {
    const sc = (s || {}) as Record<string, unknown>;
    const kind = SCENE_KINDS.includes(sc.kind as SceneKind) ? (sc.kind as SceneKind) : undefined;
    return {
      id: id(sc.id),
      number: typeof sc.number === "string" && /^\d+[A-Z]?$/i.test(sc.number) && sc.number.length <= 20 ? sc.number : undefined,
      title: text(sc.title, 300, "Untitled scene"),
      location: text(sc.location, 300, "EXT. LOCATION").toUpperCase(),
      time: text(sc.time, 100, "DAY").toUpperCase(),
      description: text(sc.description, 20000),
      characters: ids(sc.characters),
      actId: typeof sc.actId === "string" && actIds.has(sc.actId) ? sc.actId : undefined,
      partId: typeof sc.partId === "string" && partIds.has(sc.partId) ? sc.partId : undefined,
      kind,
      lighting: LIGHTING.includes(sc.lighting as Lighting) ? (sc.lighting as Lighting) : undefined,
      lightingNotes: text(sc.lightingNotes, 1000) || undefined,
      style: text(sc.style, 60) || undefined,
    };
  });

  const sceneIds = new Set(scenes.map(s => s.id));
  const frames: StoryFrame[] = list(input.frames).slice(0, MAX_FRAMES).map(f => {
    const f_ = (f || {}) as Record<string, unknown>;
    const duration = Number(f_.duration);
    return {
      id: id(f_.id),
      shotNumber: typeof f_.shotNumber === "number" && Number.isSafeInteger(f_.shotNumber) && f_.shotNumber > 0 && f_.shotNumber <= 1_000_000 ? f_.shotNumber : undefined,
      sceneId: typeof f_.sceneId === "string" && sceneIds.has(f_.sceneId) ? f_.sceneId : (scenes[0]?.id || ""),
      title: text(f_.title, 300, "Untitled frame"),
      description: text(f_.description, 20000),
      image: image(f_.image) ? (f_.image as string) : "",
      shotType: SHOT_TYPES.includes(f_.shotType as ShotType) ? (f_.shotType as ShotType) : "Wide",
      movement: CAMERA_MOVEMENTS.includes(f_.movement as CameraMovement) ? (f_.movement as CameraMovement) : "Static",
      angle: CAMERA_ANGLES.includes(f_.angle as CameraAngle) ? (f_.angle as CameraAngle) : undefined,
      lens: LENSES.includes(f_.lens as Lens) ? (f_.lens as Lens) : undefined,
      lighting: LIGHTING.includes(f_.lighting as Lighting) ? (f_.lighting as Lighting) : undefined,
      lightingNotes: text(f_.lightingNotes, 1000) || undefined,
      durationIsEstimate: typeof f_.durationIsEstimate === "boolean" ? f_.durationIsEstimate : undefined,
      style: text(f_.style, 60) || undefined,
      transition: TRANSITIONS.includes(f_.transition as Transition) ? (f_.transition as Transition) : undefined,
      mood: text(f_.mood, 300) || undefined,
      duration: Number.isFinite(duration) && duration > 0 ? Math.min(3600, Math.round(duration)) : 5,
      status: frameStatuses.includes(f_.status as string) ? (f_.status as StoryFrame["status"]) : "Draft",
      notes: text(f_.notes, 20000),
      characters: ids(f_.characters),
      audio: sanitizeAudio(f_.audio),
    };
  });

  const notes: ProjectNote[] = list(input.notes).slice(0, MAX_NOTES).map(n => {
    const n_ = (n || {}) as Record<string, unknown>;
    return {
      id: id(n_.id),
      title: text(n_.title, 300, "Note"),
      content: text(n_.content, 20000),
      color: noteColors.includes(n_.color as string) ? (n_.color as ProjectNote["color"]) : "sage",
      createdAt: typeof n_.createdAt === "string" ? n_.createdAt : new Date().toISOString(),
      tags: ids(n_.tags, 20).map(t => t.slice(0, 40)),
      connections: list(n_.connections).slice(0, 40).map(c => {
        const cc = (c || {}) as Record<string, unknown>;
        return { targetId: id(cc.targetId), label: text(cc.label, 80) };
      }),
    };
  });

  const characters: Character[] = list(input.characters).slice(0, 200).map(c => {
    const c_ = (c || {}) as Record<string, unknown>;
    return {
      id: id(c_.id),
      name: text(c_.name, 120, "Unnamed"),
      role: text(c_.role, 80, "Supporting"),
      age: text(c_.age, 40),
      description: text(c_.description, 700),
      traits: list(c_.traits).filter((t): t is string => typeof t === "string").slice(0, 5).map(t => t.slice(0, 50)),
      color: entityColors.includes(c_.color as string) ? (c_.color as Character["color"]) : "sage",
      image: image(c_.image) ? (c_.image as string) : undefined,
      relations: list(c_.relations).slice(0, 40).map(r => {
        const r_ = (r || {}) as Record<string, unknown>;
        return {
          id: id(r_.id),
          targetId: text(r_.targetId, 100),
          kind: RELATION_KINDS.includes(r_.kind as RelationKind) ? (r_.kind as RelationKind) : "Friend",
          note: text(r_.note, 120) || undefined,
        };
      }).filter(r => r.targetId),
      createdAt: typeof c_.createdAt === "string" ? c_.createdAt : new Date().toISOString(),
    };
  });

  const brainstorm: BrainstormNode[] = list(input.brainstorm).slice(0, 150).map(b => {
    const b_ = (b || {}) as Record<string, unknown>;
    return {
      id: id(b_.id),
      x: Number.isFinite(Number(b_.x)) ? Math.max(0, Math.min(12000, Math.round(Number(b_.x)))) : 60,
      y: Number.isFinite(Number(b_.y)) ? Math.max(0, Math.min(12000, Math.round(Number(b_.y)))) : 60,
      title: text(b_.title, 200, "Idea"),
      content: text(b_.content, 3000),
      color: nodeColors.includes(b_.color as string) ? (b_.color as BrainstormNode["color"]) : "sage",
      tags: ids(b_.tags, 6).map(t => t.slice(0, 40)),
      connections: ids(b_.connections, 20),
      createdAt: typeof b_.createdAt === "string" ? b_.createdAt : new Date().toISOString(),
    };
  });

  const moodboards: MoodBoard[] = list(input.moodboards).slice(0, 40).map(m => {
    const m_ = (m || {}) as Record<string, unknown>;
    return {
      id: id(m_.id),
      title: text(m_.title, 200, "Mood board"),
      description: text(m_.description, 2000),
      actId: typeof m_.actId === "string" && actIds.has(m_.actId) ? m_.actId : undefined,
      sceneId: typeof m_.sceneId === "string" && sceneIds.has(m_.sceneId) ? m_.sceneId : undefined,
      items: list(m_.items).slice(0, 40).map(i => {
        const i_ = (i || {}) as Record<string, unknown>;
        return { id: id(i_.id), image: image(i_.image) ? (i_.image as string) : "", caption: text(i_.caption, 300) };
      }).filter(i => i.image),
      createdAt: typeof m_.createdAt === "string" ? m_.createdAt : new Date().toISOString(),
    };
  });

  if (!scenes.length && !frames.length && !notes.length && !brainstorm.length && !characters.length && !moodboards.length && !text(input.script, 10)) {
    throw new Error("That file has no scenes, shots, notes or ideas to import.");
  }

  return {
    title: text(input.title, 180, "Imported project"),
    description: text(input.description, 20000, "Imported from a project file."),
    genre: text(input.genre, 80, "Drama"),
    format: text(input.format, 80, "Short film"),
    status: text(input.status, 80, "In development"),
    coverImage: image(input.coverImage) && (input.coverImage as string) ? (input.coverImage as string) : (frames.find(f => f.image)?.image || "/images/coastal-road.jpg"),
    script: text(input.script, 500000, `${text(input.title, 180, "IMPORTED PROJECT").toUpperCase()}\n\nImported\n\n\nFADE IN:\n`),
    acts, scenes, frames, notes, characters, brainstorm, moodboards,
  };
}
