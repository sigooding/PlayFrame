/**
 * Procedural walk / run generator.
 *
 * Given a rig (with named parts expected to exist: leftLeg, rightLeg, leftArm,
 * rightArm, body, head), produces a CutoutClip with a four-pose cycle:
 *   A → B → C → D → A
 * where A/C are contact poses and B/D are the opposite cross-step.
 *
 * None of these part names are hard-coded in the engine; callers supply a mapping
 * telling the generator which part-ids correspond to which role. Pass `null` for
 * any slot the rig doesn't have and that limb is simply not animated.
 */

import type { CutoutClip, PartKeyframe, PartTrack } from "./types";

export interface WalkParams {
  /** Id for the generated clip. */
  id: string;
  name: string;
  /** Cycles per second at speed=1. */
  cycleHz: number;
  /** Visual FPS for the clipped stepped look (e.g. 12). */
  visualFps: number;
  /** Max leg rotation away from vertical (degrees). */
  legSwing: number;
  /** Max arm counter-swing (degrees). */
  armSwing: number;
  /** Vertical body bob (pixels). */
  bodyBob: number;
  /** Horizontal head nod (pixels, subtle). */
  headNod: number;
  /** Part-id mapping — rig-specific. */
  parts: {
    body?: string | null;
    head?: string | null;
    leftLeg?: string | null;
    rightLeg?: string | null;
    leftArm?: string | null;
    rightArm?: string | null;
  };
  /** If true, makes bigger strides and more bob. */
  run?: boolean;
  /** Interpolation between the four stepped poses — usually "step". */
  interpolation?: "step" | "linear" | "easeIn" | "easeOut" | "easeInOut";
}

/**
 * Build a generic A→B→C→D→A walk/run clip.
 *
 * Leg and arm swing alternate so left leg forward ↔ right arm forward (cross-body).
 */
export function buildWalkClip(params: WalkParams): CutoutClip {
  const dur = 1 / Math.max(0.01, params.cycleHz);
  const legs = params.run ? params.legSwing * 1.4 : params.legSwing;
  const arms = params.run ? params.armSwing * 1.2 : params.armSwing;
  const bob = params.run ? params.bodyBob * 1.6 : params.bodyBob;
  const nod = params.headNod;
  const kf = (t: number, rot: Record<string, number>, pos: Record<string, [number, number]> = {}): PartKeyframe => ({
    t,
    rotation: 0,
    interpolation: params.interpolation ?? "step",
    ...(Object.keys(rot).length ? {} : {}),
    // We'll fill per-track below; this is a placeholder to keep the shape.
  });
  // Build four contact/cross/contact/cross poses evenly spaced.
  const times = [0, dur * 0.25, dur * 0.5, dur * 0.75];
  const tracks: PartTrack[] = [];
  const addTrack = (partId: string | null | undefined, keyframes: PartKeyframe[]) => {
    if (!partId) return;
    tracks.push({ partId, keyframes });
  };

  // Helper for rotation-only tracks with four poses.
  const rotTrack = (partId: string | null | undefined, rots: [number, number, number, number]) => {
    addTrack(partId, [
      { t: times[0], rotation: rots[0], interpolation: params.interpolation ?? "step" },
      { t: times[1], rotation: rots[1], interpolation: params.interpolation ?? "step" },
      { t: times[2], rotation: rots[2], interpolation: params.interpolation ?? "step" },
      { t: times[3], rotation: rots[3], interpolation: params.interpolation ?? "step" },
    ]);
  };

  // Left leg forward at t=0; right leg forward at t=0.5.
  rotTrack(params.parts.leftLeg,  [ legs,  legs * 0.2, -legs, -legs * 0.2]);
  rotTrack(params.parts.rightLeg, [-legs, -legs * 0.2,  legs,  legs * 0.2]);
  // Arms counter-rotate to the opposite leg.
  rotTrack(params.parts.leftArm,  [-arms, -arms * 0.2,  arms,  arms * 0.2]);
  rotTrack(params.parts.rightArm, [ arms,  arms * 0.2, -arms, -arms * 0.2]);

  // Body bob: down on contacts (A, C), up on crosses (B, D) — subtle.
  if (params.parts.body) {
    addTrack(params.parts.body, [
      { t: times[0], position: { x: 0, y: bob }, interpolation: "step" },
      { t: times[1], position: { x: 0, y: 0 },   interpolation: "step" },
      { t: times[2], position: { x: 0, y: bob }, interpolation: "step" },
      { t: times[3], position: { x: 0, y: 0 },   interpolation: "step" },
    ]);
  }
  // Head counter-bob for organic feel.
  if (params.parts.head) {
    addTrack(params.parts.head, [
      { t: times[0], position: { x: 0, y: -nod }, interpolation: "step" },
      { t: times[1], position: { x: 0, y: 0 }, interpolation: "step" },
      { t: times[2], position: { x: 0, y: -nod }, interpolation: "step" },
      { t: times[3], position: { x: 0, y: 0 }, interpolation: "step" },
    ]);
  }

  return {
    id: params.id,
    name: params.name,
    layer: "base",
    duration: dur,
    loop: true,
    visualFps: params.visualFps,
    defaultInterpolation: params.interpolation ?? "step",
    tracks,
    speed: 1,
  };
}

/** Build an idle "breathing" clip — very subtle bob. */
export function buildIdleClip(params: {
  id: string;
  name: string;
  parts: { body?: string | null; head?: string | null };
  visualFps?: number;
  bob?: number;
}): CutoutClip {
  const bob = params.bob ?? 2;
  const dur = 2.4;
  const tracks: PartTrack[] = [];
  if (params.parts.body) {
    tracks.push({
      partId: params.parts.body,
      keyframes: [
        { t: 0, position: { x: 0, y: 0 }, interpolation: "easeInOut" },
        { t: dur * 0.5, position: { x: 0, y: -bob }, interpolation: "easeInOut" },
        { t: dur, position: { x: 0, y: 0 }, interpolation: "easeInOut" },
      ],
    });
  }
  if (params.parts.head) {
    tracks.push({
      partId: params.parts.head,
      keyframes: [
        { t: 0, rotation: -1, interpolation: "easeInOut" },
        { t: dur * 0.5, rotation: 1, interpolation: "easeInOut" },
        { t: dur, rotation: -1, interpolation: "easeInOut" },
      ],
    });
  }
  return {
    id: params.id, name: params.name, layer: "base",
    duration: dur, loop: true, visualFps: params.visualFps,
    defaultInterpolation: "easeInOut", tracks, speed: 1,
  };
}

/** A simple talking clip that gently rotates the jaw/head while talking. */
export function buildTalkClip(params: {
  id: string;
  name: string;
  parts: { head?: string | null };
  visualFps?: number;
}): CutoutClip {
  const dur = 1.2;
  const tracks: PartTrack[] = [];
  if (params.parts.head) {
    tracks.push({
      partId: params.parts.head,
      keyframes: [
        { t: 0, rotation: -1, interpolation: "step" },
        { t: 0.3, rotation: 1.5, interpolation: "step" },
        { t: 0.6, rotation: -0.5, interpolation: "step" },
        { t: 0.9, rotation: 1, interpolation: "step" },
        { t: dur, rotation: -1, interpolation: "step" },
      ],
    });
  }
  return {
    id: params.id, name: params.name, layer: "body",
    duration: dur, loop: true, visualFps: params.visualFps ?? 12,
    defaultInterpolation: "step", tracks, speed: 1,
  };
}

/** A blinking/eye-dart face layer clip. */
export function buildBlinkClip(params: {
  id: string;
  name: string;
  parts: { eyes?: string | null; brows?: string | null };
}): CutoutClip {
  const dur = 3.5;
  const tracks: PartTrack[] = [];
  if (params.parts.eyes) {
    tracks.push({
      partId: params.parts.eyes,
      keyframes: [
        { t: 0, scale: { x: 1, y: 1 }, interpolation: "step" },
        { t: dur - 0.15, scale: { x: 1, y: 1 }, interpolation: "step" },
        { t: dur - 0.08, scale: { x: 1, y: 0.1 }, interpolation: "step" },
        { t: dur, scale: { x: 1, y: 1 }, interpolation: "step" },
      ],
    });
  }
  return {
    id: params.id, name: params.name, layer: "face",
    duration: dur, loop: true, defaultInterpolation: "step", tracks, speed: 1,
  };
}
