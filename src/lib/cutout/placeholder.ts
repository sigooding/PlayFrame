/**
 * A built-in ORIGINAL placeholder rig for testing — no South Park art, audio,
 * characters, or proprietary material is referenced. The character is drawn from
 * simple shapes in the renderer at runtime.
 */

import type { CutoutRig, CutoutClip, LipSyncTrack, Viseme } from "./types";
import { buildBlinkClip, buildIdleClip, buildTalkClip, buildWalkClip } from "./walk";

/**
 * Builds a small bipedal "Stick" placeholder rig — body/head/limbs/mouth/eyes/brows.
 * The pivot points are placed at natural joints (shoulder, hip, neck, wrist, etc.).
 */
export function buildPlaceholderRig(): CutoutRig {
  const parts = [
    // Root anchor — an invisible part at the character's feet.
    {
      id: "root", name: "Root", parentId: null,
      position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 0, y: 0 }, order: 0, flipX: false, flipY: false, visible: true,
      opacity: 0, // invisible anchor
    },
    // Legs (pivot at hip)
    {
      id: "leftLeg", name: "Left Leg", parentId: "root",
      position: { x: -8, y: -52 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 9, y: 0 }, order: 1, flipX: false, flipY: false, visible: true,
      sprite: "leg",
    },
    {
      id: "rightLeg", name: "Right Leg", parentId: "root",
      position: { x: 8, y: -52 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 9, y: 0 }, order: 2, flipX: false, flipY: false, visible: true,
      sprite: "leg",
    },
    {
      id: "leftFoot", name: "Left Foot", parentId: "leftLeg",
      position: { x: 0, y: 46 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 13, y: 7 }, order: 3, flipX: false, flipY: false, visible: true,
      sprite: "foot",
    },
    {
      id: "rightFoot", name: "Right Foot", parentId: "rightLeg",
      position: { x: 0, y: 46 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 13, y: 7 }, order: 4, flipX: false, flipY: false, visible: true,
      sprite: "foot",
    },
    // Torso (pivot at hip/center)
    {
      id: "body", name: "Body", parentId: "root",
      position: { x: 0, y: -56 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 22, y: 50 }, order: 5, flipX: false, flipY: false, visible: true,
      sprite: "body",
    },
    // Arms (pivot at shoulder = top of torso)
    {
      id: "leftArm", name: "Left Arm", parentId: "body",
      position: { x: 2, y: 4 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 8, y: 2 }, order: 6, flipX: false, flipY: false, visible: true,
      sprite: "arm",
    },
    {
      id: "rightArm", name: "Right Arm", parentId: "body",
      position: { x: 42, y: 4 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 8, y: 2 }, order: 7, flipX: true, flipY: false, visible: true,
      sprite: "arm",
    },
    // Head (pivot at neck = bottom-center of head)
    {
      id: "head", name: "Head", parentId: "body",
      position: { x: 22, y: -6 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 24, y: 54 }, order: 10, flipX: false, flipY: false, visible: true,
      sprite: "head",
    },
    // Hair (front tuft)
    {
      id: "hair", name: "Hair", parentId: "head",
      position: { x: -3, y: -6 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 27, y: 8 }, order: 11, flipX: false, flipY: false, visible: true,
      sprite: "hair",
    },
    // Eyes (grouped under a parent so brow/eye move together)
    {
      id: "eyes", name: "Eyes", parentId: "head",
      position: { x: 10, y: 18 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 0, y: 0 }, order: 12, flipX: false, flipY: false, visible: true,
    },
    {
      id: "leftEye", name: "Left Eye", parentId: "eyes",
      position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 6, y: 6 }, order: 13, flipX: false, flipY: false, visible: true,
      sprite: "eye",
    },
    {
      id: "rightEye", name: "Right Eye", parentId: "eyes",
      position: { x: 18, y: 0 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 6, y: 6 }, order: 14, flipX: false, flipY: false, visible: true,
      sprite: "eye",
    },
    {
      id: "brows", name: "Brows", parentId: "head",
      position: { x: 8, y: 10 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 0, y: 0 }, order: 15, flipX: false, flipY: false, visible: true,
    },
    {
      id: "leftBrow", name: "Left Brow", parentId: "brows",
      position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 6, y: 2 }, order: 16, flipX: false, flipY: false, visible: true,
      sprite: "brow",
    },
    {
      id: "rightBrow", name: "Right Brow", parentId: "brows",
      position: { x: 18, y: 0 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 6, y: 2 }, order: 17, flipX: false, flipY: false, visible: true,
      sprite: "brow",
    },
    // Mouth — pivot centred so viseme shapes stay aligned.
    {
      id: "mouth", name: "Mouth", parentId: "head",
      position: { x: 14, y: 34 }, rotation: 0, scale: { x: 1, y: 1 },
      pivot: { x: 10, y: 6 }, order: 18, flipX: false, flipY: false, visible: true,
      sprite: "mouth:neutral",
    },
  ];
  return {
    id: "stick",
    name: "Stick (placeholder)",
    parts,
    rootPartId: "root",
    spriteSheet: {
      // No images — every sprite uses fallback procedural drawing.
      // Artists can add entries here to replace with PNGs.
    },
    facialSlots: {
      mouthPartId: "mouth",
      eyesPartId: "eyes",
      browsPartId: "brows",
      extras: ["hair"],
    },
    attachmentSlots: [
      { id: "hand_right", partId: "rightArm", offset: { x: 0, y: 40 } },
      { id: "hand_left",  partId: "leftArm",  offset: { x: 0, y: 40 } },
    ],
  };
}

export function buildPlaceholderClips(): CutoutClip[] {
  const partMap = {
    body: "body",
    head: "head",
    leftLeg: "leftLeg",
    rightLeg: "rightLeg",
    leftArm: "leftArm",
    rightArm: "rightArm",
    eyes: "eyes",
    brows: "brows",
  };
  const walk = buildWalkClip({
    id: "walk", name: "Walk",
    cycleHz: 1.8, visualFps: 12,
    legSwing: 22, armSwing: 18, bodyBob: 3, headNod: 1.5,
    parts: partMap, interpolation: "step",
  });
  const run = buildWalkClip({
    id: "run", name: "Run",
    cycleHz: 3.2, visualFps: 12,
    legSwing: 32, armSwing: 28, bodyBob: 5, headNod: 2.5,
    parts: partMap, run: true, interpolation: "step",
  });
  const idle = buildIdleClip({
    id: "idle", name: "Idle", parts: { body: "body", head: "head" }, visualFps: 4, bob: 1.5,
  });
  const talk = buildTalkClip({
    id: "talk", name: "Talk", parts: { head: "head" }, visualFps: 12,
  });
  const blink = buildBlinkClip({ id: "blink", name: "Blink", parts: { eyes: "eyes", brows: "brows" } });
  // A trivial fallback "mumble" lip clip — viseme events are driven by the lip-sync
  // system (manual/imported/auto) on the lip layer, not by this clip.
  const mumble: CutoutClip = {
    id: "mumble", name: "Mumble (fallback)", layer: "lip",
    duration: 0.4, loop: true, visualFps: 10, defaultInterpolation: "step",
    speed: 1,
    tracks: [{
      partId: "mouth",
      keyframes: [
        { t: 0, sprite: "mouth:closed", interpolation: "step" },
        { t: 0.1, sprite: "mouth:open", interpolation: "step" },
        { t: 0.2, sprite: "mouth:closed", interpolation: "step" },
        { t: 0.3, sprite: "mouth:wide", interpolation: "step" },
        { t: 0.4, sprite: "mouth:closed", interpolation: "step" },
      ],
    }],
  };
  return [walk, run, idle, talk, blink, mumble];
}

/**
 * Build an editable demo lip-sync track for testing — a short scripted sequence of
 * visemes that the demo page can play against a generated tone (or silently).
 * No copyrighted audio is bundled; the demo synthesizes a simple waveform at runtime.
 */
export function buildDemoLipSync(): LipSyncTrack {
  const events: { t: number; viseme: Viseme }[] = [
    { t: 0.00, viseme: "closed" },
    { t: 0.12, viseme: "wide" },
    { t: 0.28, viseme: "open" },
    { t: 0.42, viseme: "round" },
    { t: 0.58, viseme: "closed" },
    { t: 0.70, viseme: "narrow" },
    { t: 0.82, viseme: "teeth" },
    { t: 0.98, viseme: "FV" },
    { t: 1.12, viseme: "wide" },
    { t: 1.28, viseme: "open" },
    { t: 1.42, viseme: "round" },
    { t: 1.58, viseme: "wide" },
    { t: 1.72, viseme: "closed" },
    { t: 1.88, viseme: "open" },
    { t: 2.05, viseme: "neutral" },
  ];
  return {
    id: "demo-lipsync",
    audio: "synthetic:demo",
    duration: 2.4,
    source: "manual",
    events,
    language: "en",
  };
}
