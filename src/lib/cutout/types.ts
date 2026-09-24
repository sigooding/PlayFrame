/**
 * Core types for the Cutout Character animation system.
 *
 * A "cutout character" is assembled from a hierarchy of independent sprites (parts),
 * each with its own pivot, local transform, and optional sprite/image. Animations are
 * clip-based, supporting stepped (limited) interpolation as well as linear/eased curves.
 *
 * Design goals:
 *   - Framework-agnostic core. Rendering (Canvas2D / DOM SVG / WebGL) is a separate layer.
 *   - Serializable rigs, clips and lip-sync tracks — JSON round-trips work by default.
 *   - Animation Layers: higher layers only override properties they own (e.g. Lip overrides
 *     just the mouth sprite/offset while Body continues walking).
 */

/** A 2D vector. */
export interface Vec2 { x: number; y: number; }

/** Interpolation mode between keyframes. "Step" is the South Park style hold. */
export type Interpolation =
  | "step"       // hold the value until the next keyframe (stepped / limited animation)
  | "linear"     // straight lerp
  | "easeIn"
  | "easeOut"
  | "easeInOut";

/** The 8 cardinal + diagonal directions. Clips can opt-in per-direction. */
export type FacingDirection =
  | "front"
  | "back"
  | "left"
  | "right"
  | "frontLeft"
  | "frontRight"
  | "backLeft"
  | "backRight";

/** Standard viseme set. Language mappings are configurable at runtime. */
export type Viseme =
  | "neutral"
  | "closed"
  | "open"
  | "wide"
  | "round"
  | "teeth"
  | "FV"
  | "narrow";

/** Named high-level animation states the state machine can play. */
export type AnimStateName =
  | "idle"
  | "walk"
  | "run"
  | "talk"
  | "walkTalk"
  | "runTalk"
  | "interact"
  | "attack"
  | "react";

/** Layer weights / ownership. */
export const ANIM_LAYERS = ["base", "body", "face", "lip"] as const;
export type AnimLayer = (typeof ANIM_LAYERS)[number];

/**
 * A "Part" in the hierarchy. Each part has a local transform, a pivot (relative to its
 * own source sprite's top-left), and optionally a sprite key that resolves to an image
 * at render time. Children are referenced by id; the rig holds the flat list.
 */
export interface CutoutPart {
  id: string;
  /** Human-facing label, e.g. "Left Arm". */
  name: string;
  /** Parent part id; null or empty for a root-attached part. */
  parentId: string | null;
  /** Local position offset from parent, in pixels (pre-pivot). */
  position: Vec2;
  /** Local rotation in degrees. */
  rotation: number;
  /** Local scale (1 = natural). */
  scale: Vec2;
  /** Pivot/offset WITHIN this part's own sprite, in pixels (top-left = 0,0). */
  pivot: Vec2;
  /** Draw order — higher draws on top. */
  order: number;
  /** Whether the sprite is horizontally mirrored. */
  flipX: boolean;
  /** Whether the sprite is vertically mirrored. */
  flipY: boolean;
  /** Visible toggle. */
  visible: boolean;
  /**
   * Sprite key. Resolved to an image by the renderer/asset table.
   * For replaceable-part slots (e.g. mouth, eyes) this is a key like "mouth:neutral"
   * that the animator overrides at runtime.
   */
  sprite?: string;
  /** Optional tint colour, e.g. #cc3333. */
  tint?: string;
  /** Optional opacity (0..1). */
  opacity?: number;
}

/**
 * A single keyframe on one channel for one part. Unspecified channels are not
 * touched by this keyframe (so a keyframe can animate rotation-only).
 */
export interface PartKeyframe {
  /** Time in seconds. */
  t: number;
  position?: Vec2;
  rotation?: number;
  scale?: Vec2;
  /** Replaces the sprite key at this keyframe (e.g. mouth shape). */
  sprite?: string;
  visible?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  /** Interpolation from THIS keyframe to the next. Defaults to the clip's default. */
  interpolation?: Interpolation;
}

/** A set of keyframes for a single part, on a single layer. */
export interface PartTrack {
  partId: string;
  keyframes: PartKeyframe[];
}

/**
 * An animation clip. Clips can target a subset of parts (face-only clips, lip-only
 * clips, etc.), which is how layering works: a "walk" clip on the `base` layer animates
 * body/limbs, while a "talk" clip on the `lip` layer only animates the mouth part.
 */
export interface CutoutClip {
  id: string;
  name: string;
  /** Which layer this clip contributes to. */
  layer: AnimLayer;
  /** Optional direction this clip is authored for — undefined = all directions. */
  direction?: FacingDirection;
  /** Duration in seconds. Looped clips cycle modulo this. */
  duration: number;
  /** Loop the clip. */
  loop: boolean;
  /** Visual FPS for stepped sampling, e.g. 12 for a chunky walk. If undefined we sample smoothly. */
  visualFps?: number;
  /** Default interpolation for keyframes that don't specify one. */
  defaultInterpolation: Interpolation;
  /** Per-part tracks. */
  tracks: PartTrack[];
  /** Playback speed multiplier (1 = authored speed). */
  speed: number;
}

/** A reusable rig definition: parts + default sprite table + default pose. */
export interface CutoutRig {
  id: string;
  name: string;
  /** All parts, in any order. Parents are resolved at runtime. */
  parts: CutoutPart[];
  /** The id of the logical root part; if omitted the first parentless part wins. */
  rootPartId?: string;
  /**
   * Sprite catalogue — maps sprite keys (e.g. "head", "arm", "mouth:closed", ...)
   * to image URLs. The renderer resolves sprite strings against this table.
   */
  spriteSheet: Record<string, string>;
  /** Named facial slots that can be swapped at runtime (independent of body anim). */
  facialSlots?: {
    /** Part id of the mouth (for lip-sync). */
    mouthPartId?: string;
    /** Part id of the eyes group. */
    eyesPartId?: string;
    /** Part id of eyebrows. */
    browsPartId?: string;
    /** Part id of any other swap target (e.g. blush, tears). */
    extras?: string[];
  };
  /** Optional named slots like "weapon" that gameplay can attach to. */
  attachmentSlots?: { id: string; partId: string; offset: Vec2 }[];
}

/** A single viseme event in a lip-sync track. */
export interface VisemeEvent {
  /** Time in seconds from audio start. */
  t: number;
  viseme: Viseme;
  /** Optional intensity 0..1 — softens the pose when <1. */
  weight?: number;
}

/** A full lip-sync track for one line of dialogue. */
export interface LipSyncTrack {
  id: string;
  /** URL or asset key of the source audio. */
  audio: string;
  /** Duration in seconds (mirrors audio duration). */
  duration: number;
  /** How this track was produced. */
  source: "manual" | "automatic" | "imported";
  events: VisemeEvent[];
  /** Language tag (e.g. "en", "es-MX") used by phoneme→viseme mapping. */
  language?: string;
}

/** Phoneme-to-viseme mapping table. Replaceable per language. */
export interface PhonemeMap {
  language: string;
  /** ARPAbet-like phoneme symbols → Viseme. Unknown phonemes fall back to neutral. */
  phonemeToViseme: Record<string, Viseme>;
}

/** A state machine state — maps a logical state to a clip + optional face/lip overrides. */
export interface AnimState {
  name: AnimStateName;
  /** Base-layer clip (idle, walk, run). */
  baseClipId?: string;
  /** Body-layer clip (arm gestures, head bob). */
  bodyClipId?: string;
  /** Face-layer clip (expression, blink, eye darts). */
  faceClipId?: string;
  /** Lip-layer clip (jaw flap, mouth shapes); lip-sync overrides this when active. */
  lipClipId?: string;
  /** True when this state expects movement, used to pick walk vs run vs idle. */
  locomotion?: boolean;
}

/** Per-instance runtime pose of a part (resolved, world-space cached). */
export interface ResolvedPartPose {
  partId: string;
  /** Combined world position. */
  x: number;
  y: number;
  /** Combined world rotation in degrees. */
  rotation: number;
  /** Combined world scale. */
  sx: number;
  sy: number;
  /** The sprite key to draw at this frame (after layer overrides). */
  sprite?: string;
  /** Pivot in part-local sprite coords. */
  pivotX: number;
  pivotY: number;
  visible: boolean;
  flipX: boolean;
  flipY: boolean;
  order: number;
  tint?: string;
  opacity: number;
}

/** Debug flags for rendering. */
export interface CutoutDebugFlags {
  showPivots?: boolean;
  showHierarchy?: boolean;
  showBounds?: boolean;
  showStateLabel?: boolean;
}
