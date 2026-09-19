export const SHOT_TYPES = ["Establishing", "Extreme wide", "Wide", "Full", "Medium wide", "Medium", "Medium close-up", "Close-up", "Extreme close-up", "Over the shoulder", "Two-shot", "POV", "Insert", "Aerial"] as const;
export type ShotType = (typeof SHOT_TYPES)[number];

export const CAMERA_MOVEMENTS = ["Static", "Pan", "Tilt", "Tracking", "Dolly in", "Dolly out", "Crane up", "Crane down", "Handheld", "Steadicam", "Orbit", "Zoom in", "Zoom out"] as const;
export type CameraMovement = (typeof CAMERA_MOVEMENTS)[number];

export const CAMERA_ANGLES = ["Eye level", "Low angle", "High angle", "Dutch angle", "Bird's eye", "Worm's eye"] as const;
export type CameraAngle = (typeof CAMERA_ANGLES)[number];

export const TRANSITIONS = ["Cut", "Match cut", "Jump cut", "Smash cut", "Dissolve", "Fade in", "Fade out", "Wipe", "Whip pan", "J-cut", "L-cut"] as const;
export type Transition = (typeof TRANSITIONS)[number];

export const LENSES = ["14mm", "24mm", "35mm", "50mm", "85mm", "135mm", "Anamorphic"] as const;
export type Lens = (typeof LENSES)[number];

export const LIGHTING = ["Natural daylight", "Golden hour", "Blue hour", "Overcast soft", "Low key", "High key", "Practical night", "Backlit silhouette"] as const;
export type Lighting = (typeof LIGHTING)[number];

export const SCENE_KINDS = ["Standard", "Cold open", "Flashback", "Dream", "Montage", "Title card", "Tag"] as const;
export type SceneKind = (typeof SCENE_KINDS)[number];

/** How one character sees another. "Parent" means the linked character is this person's parent. */
export const RELATION_KINDS = [
  "Parent", "Child", "Sibling", "Grandparent", "Grandchild", "Partner", "Spouse", "Friend", "Best friend",
  "Mentor", "Student", "Colleague", "Rival", "Enemy", "Ally", "Neighbour", "Estranged",
] as const;
export type RelationKind = (typeof RELATION_KINDS)[number];

export interface CharacterRelation {
  id: string;
  /** the other character in the cast */
  targetId: string;
  /** who that person is to this character */
  kind: RelationKind;
  /** optional context — how the relationship plays on screen */
  note?: string;
}

export type FrameStatus = "Draft" | "Ready" | "Needs review";

export interface ActPart {
  id: string;
  title: string;
  description: string;
}

export interface Act {
  id: string;
  title: string;
  description: string;
  parts?: ActPart[];
}

export interface Scene {
  id: string;
  title: string;
  location: string;
  time: string;
  description: string;
  characters?: string[];
  actId?: string;
  partId?: string;
  kind?: SceneKind;
  /** the light this scene is lit in — inherited by its shots unless a shot overrides it */
  lighting?: Lighting;
  /** default visual style for this scene's shots — inherited unless a shot overrides it */
  style?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  age: string;
  description: string;
  traits: string[];
  color: "sage" | "sand" | "rose" | "clay";
  image?: string;
  relations?: CharacterRelation[];
  createdAt: string;
}

export interface StoryFrame {
  id: string;
  sceneId: string;
  title: string;
  description: string;
  image: string;
  shotType: ShotType;
  movement: CameraMovement;
  duration: number;
  status: FrameStatus;
  notes: string;
  characters?: string[];
  angle?: CameraAngle;
  lens?: Lens;
  lighting?: Lighting;
  /** the visual style this shot is rendered in — persisted so storyboards remember their look */
  style?: string;
  transition?: Transition;
  mood?: string;
}

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  color: "sage" | "sand" | "rose";
  createdAt: string;
  tags?: string[];
  connections?: { targetId: string; label: string }[];
}

export interface BrainstormNode {
  id: string;
  x: number;
  y: number;
  title: string;
  content: string;
  color: "sage" | "sand" | "rose" | "clay" | "ink";
  tags: string[];
  connections: string[];
  createdAt: string;
}

export interface MoodItem {
  id: string;
  image: string;
  caption: string;
}

export interface MoodBoard {
  id: string;
  title: string;
  description: string;
  actId?: string;
  sceneId?: string;
  items: MoodItem[];
  createdAt: string;
}

export interface FilmProject {
  id: string;
  title: string;
  description: string;
  genre: string;
  format: string;
  status: string;
  coverImage: string;
  acts: Act[];
  scenes: Scene[];
  frames: StoryFrame[];
  script: string;
  notes: ProjectNote[];
  characters: Character[];
  brainstorm: BrainstormNode[];
  moodboards: MoodBoard[];
  shareId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPatch = Partial<Pick<FilmProject, "title" | "description" | "genre" | "format" | "status" | "coverImage" | "acts" | "scenes" | "frames" | "script" | "notes" | "characters" | "brainstorm" | "moodboards">>;
