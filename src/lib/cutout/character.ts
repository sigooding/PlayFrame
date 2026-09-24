/**
 * CutoutCharacter: the high-level runtime controller.
 *
 * Owns:
 *   - the rig
 *   - the clip library
 *   - per-layer playback time (so face/body/lip can scrub independently)
 *   - current gameplay state (idle/walk/run/talk/...)
 *   - a reference to a playing audio source and its timestamp (for authoritative lip-sync)
 *
 * Produces a resolved pose every frame via `tick(dt)`.
 */

import type {
  AnimLayer,
  AnimState,
  AnimStateName,
  CutoutClip,
  CutoutRig,
  FacingDirection,
  LipSyncTrack,
  ResolvedPartPose,
  Vec2,
} from "./types";
import {
  composeLayers,
  evaluateClip,
  lipDeltaForViseme,
  restPoseDelta,
  resolvePose,
  sampleTime,
  visemeAt,
} from "./runtime";

export interface CharacterOptions {
  rig: CutoutRig;
  clips?: CutoutClip[];
  initialState?: AnimStateName;
  /** The mouth sprite is keyed `mouth:<viseme>`; if your rig uses a different scheme, map it. */
  mouthSpriteKey?: (viseme: string) => string;
}

export interface AudioPlayback {
  /** Current playback time in seconds. Set by the host (e.g. HTMLAudioElement.currentTime). */
  currentTime: number;
  /** Whether audio is playing (false = paused/stopped). */
  playing: boolean;
  /** Clip duration in seconds. */
  duration: number;
}

export interface CharacterInput {
  /** World-space velocity (used to drive state selection & facing direction). */
  velocity: Vec2;
  /** Explicit facing override; if omitted, derived from velocity. */
  facingOverride?: FacingDirection;
  /** Explicit state override; if omitted, chosen from velocity. */
  stateOverride?: AnimStateName;
  /** Currently playing voice-over audio, if any. */
  voiceOver?: {
    track: LipSyncTrack;
    playback: AudioPlayback;
  };
}

const LAYER_ORDER: AnimLayer[] = ["base", "body", "face", "lip"];

export class CutoutCharacter {
  readonly rig: CutoutRig;
  private readonly clipsById = new Map<string, CutoutClip>();
  private readonly layerTime: Record<AnimLayer, number> = { base: 0, body: 0, face: 0, lip: 0 };
  private readonly layerPlaying: Record<AnimLayer, boolean> = { base: true, body: true, face: true, lip: true };
  private states: Record<AnimStateName, AnimState> = {
    idle:     { name: "idle",     baseClipId: "idle"  },
    walk:     { name: "walk",     baseClipId: "walk", locomotion: true },
    run:      { name: "run",      baseClipId: "run",  locomotion: true },
    talk:     { name: "talk",     baseClipId: "idle", bodyClipId: "talk", lipClipId: "mumble" },
    walkTalk: { name: "walkTalk", baseClipId: "walk", bodyClipId: "talk", lipClipId: "mumble", locomotion: true },
    runTalk:  { name: "runTalk",  baseClipId: "run",  bodyClipId: "talk", lipClipId: "mumble", locomotion: true },
    interact: { name: "interact", baseClipId: "interact" },
    attack:   { name: "attack",   baseClipId: "attack" },
    react:    { name: "react",    baseClipId: "react" },
  };

  /** World position of the root. This is gameplay movement — independent from pose. */
  position: Vec2 = { x: 0, y: 0 };

  /** Current high-level state. */
  currentState: AnimStateName = "idle";
  /** Current facing direction. */
  facing: FacingDirection = "front";
  /** Whether the character is currently talking (drives lip layer selection). */
  isTalking = false;
  /** Current voice-over track (for lip-sync). */
  voiceTrack: LipSyncTrack | null = null;
  /** Current audio playback handle. */
  voicePlayback: AudioPlayback | null = null;
  /** Speed multiplier for locomotion animations (1 = normal). */
  locomotionSpeedScale = 1;

  /** Most-recently computed pose, for debug/inspection. */
  lastPose: ResolvedPartPose[] = [];
  /** Last sample info per layer, for debug UI. */
  lastFrameInfo: Record<AnimLayer, { clip?: string; frame: number; frameCount: number }> = {
    base: { frame: 0, frameCount: 0 }, body: { frame: 0, frameCount: 0 },
    face: { frame: 0, frameCount: 0 }, lip: { frame: 0, frameCount: 0 },
  };

  constructor(opts: CharacterOptions) {
    this.rig = opts.rig;
    if (opts.clips) for (const c of opts.clips) this.clipsById.set(c.id, c);
    if (opts.initialState) this.currentState = opts.initialState;
  }

  /** Register or replace a clip. */
  addClip(clip: CutoutClip) { this.clipsById.set(clip.id, clip); }
  getClip(id: string) { return this.clipsById.get(id); }
  allClips() { return Array.from(this.clipsById.values()); }

  /** Register a state (or override an existing one). */
  defineState(state: AnimState) { this.states[state.name] = state; }

  /**
   * Tick the animation clock and compute a fresh pose.
   * `dt` is seconds since last tick.
   */
  tick(dt: number, input: CharacterInput): ResolvedPartPose[] {
    // --- Select state ---
    const speed = Math.hypot(input.velocity.x, input.velocity.y);
    const talking = !!input.voiceOver || this.isTalking;
    let state: AnimStateName;
    if (input.stateOverride) state = input.stateOverride;
    else if (speed > 140) state = talking ? "runTalk" : "run";
    else if (speed > 8) state = talking ? "walkTalk" : "walk";
    else state = talking ? "talk" : "idle";
    this.currentState = state;

    // --- Select direction ---
    this.facing = input.facingOverride ?? this.facing;
    if (!input.facingOverride) {
      // Face direction of movement when moving, else hold.
      if (speed > 8) this.facing = facingFromVelocityLocal(input.velocity);
    }

    // --- Voice / lip-sync binding ---
    if (input.voiceOver) {
      this.voiceTrack = input.voiceOver.track;
      this.voicePlayback = input.voiceOver.playback;
    } else {
      this.voiceTrack = null;
      this.voicePlayback = null;
    }

    // --- Advance layer clocks ---
    const active = this.states[state];
    const layerToClip = new Map<AnimLayer, CutoutClip | null>([
      ["base", this.resolveClip(active.baseClipId)],
      ["body", this.resolveClip(active.bodyClipId)],
      ["face", this.resolveClip(active.faceClipId) ?? this.findFaceBlinkClip()],
      ["lip", this.voiceTrack ? null : this.resolveClip(active.lipClipId)],
    ]);
    for (const layer of LAYER_ORDER) {
      const clip = layerToClip.get(layer) ?? null;
      if (clip && this.layerPlaying[layer]) {
        const speedScale = (layer === "base" && active.locomotion) ? this.locomotionSpeedScale : 1;
        this.layerTime[layer] += dt * (clip.speed || 1) * speedScale;
        if (!clip.loop) this.layerTime[layer] = Math.min(this.layerTime[layer], clip.duration);
      }
      const info = sampleTime({ duration: clip?.duration ?? 0, loop: clip?.loop ?? false, speed: 1, visualFps: clip?.visualFps }, this.layerTime[layer]);
      this.lastFrameInfo[layer] = { clip: clip?.id, frame: info.frame, frameCount: info.frameCount };
    }

    // --- Evaluate each layer ---
    const layerDeltas: Map<string, any>[] = [restPoseDelta(this.rig.parts)];
    for (const layer of LAYER_ORDER) {
      const clip = layerToClip.get(layer);
      if (!clip) continue;
      // Pick direction-specific variant if it exists, otherwise fall back to the clip.
      const useClip = this.pickDirectionalClip(clip);
      layerDeltas.push(evaluateClip(useClip, this.layerTime[layer]));
    }

    // --- Lip sync overrides lip layer ---
    if (this.voiceTrack && this.voicePlayback && this.rig.facialSlots?.mouthPartId) {
      // When paused, currentTime stays put so the mouth freezes (correct behaviour).
      const t = this.voicePlayback.playing ? this.voicePlayback.currentTime : this.voicePlayback.currentTime;
      const ev = visemeAt(this.voiceTrack, t);
      layerDeltas.push(lipDeltaForViseme(this.rig.facialSlots.mouthPartId, ev));
    }

    const composed = composeLayers(layerDeltas);
    this.lastPose = resolvePose(this.rig, composed, this.position, this.facing);
    return this.lastPose;
  }

  /** Reset a layer clock to zero (e.g. when triggering an attack). */
  resetLayer(layer: AnimLayer, t = 0) { this.layerTime[layer] = t; this.layerPlaying[layer] = true; }

  stopLayer(layer: AnimLayer) { this.layerPlaying[layer] = false; }
  playLayer(layer: AnimLayer) { this.layerPlaying[layer] = true; }
  setLayerTime(layer: AnimLayer, t: number) { this.layerTime[layer] = t; }
  getLayerTime(layer: AnimLayer) { return this.layerTime[layer]; }

  /** Seek the voice playback to a specific time (for scrubbing). */
  seekVoice(t: number) { if (this.voicePlayback) this.voicePlayback.currentTime = Math.max(0, Math.min(t, this.voicePlayback.duration)); }

  private resolveClip(id?: string): CutoutClip | null {
    if (!id) return null;
    return this.clipsById.get(id) ?? null;
  }

  /** If the current facing has a directional variant of `clip` registered, return it, else `clip`. */
  private pickDirectionalClip(base: CutoutClip): CutoutClip {
    // Directional variants follow the naming "<baseId>:<direction>".
    const variant = this.clipsById.get(`${base.id}:${this.facing}`);
    if (variant) return variant;
    // Fall back to axis: left/right fallback to side; back diagonals fallback to back.
    const axisFallback: Record<string, string> = {
      frontLeft: "left", frontRight: "right", backLeft: "back", backRight: "back",
    };
    const fallbackId = axisFallback[this.facing];
    if (fallbackId) {
      const fb = this.clipsById.get(`${base.id}:${fallbackId}`);
      if (fb) return fb;
    }
    return base;
  }

  private findFaceBlinkClip(): CutoutClip | null {
    return this.clipsById.get("blink") ?? null;
  }
}

/** Local helper: +x right, +y down (+y = toward camera => "front"). */
function facingFromVelocityLocal(v: Vec2): FacingDirection {
  const ax = Math.abs(v.x), ay = Math.abs(v.y);
  const thr = 1;
  if (ax < thr && ay < thr) return "front";
  const right = v.x > 0;
  const front = v.y > 0; // +y = toward camera
  if (ax > ay * 2) return right ? "right" : "left";
  if (ay > ax * 2) return front ? "front" : "back";
  if (right && front) return "frontRight";
  if (right && !front) return "backRight";
  if (!right && front) return "frontLeft";
  return "backLeft";
}
