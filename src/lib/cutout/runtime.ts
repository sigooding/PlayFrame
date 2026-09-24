/**
 * Runtime animation evaluation for CutoutCharacters.
 *
 * Pure functions — no DOM. Exposed so servers can pre-bake poses and tests can
 * exercise the system without a browser.
 */

import type {
  AnimLayer,
  CutoutClip,
  CutoutPart,
  CutoutRig,
  FacingDirection,
  Interpolation,
  LipSyncTrack,
  PartKeyframe,
  PartTrack,
  ResolvedPartPose,
  Vec2,
  Viseme,
  VisemeEvent,
} from "./types";

/* ---------- small math helpers ---------- */

export const TAU = Math.PI * 2;

export const deg2rad = (d: number) => (d * Math.PI) / 180;
export const rad2deg = (r: number) => (r * 180) / Math.PI;

export const v = (x = 0, y = 0): Vec2 => ({ x, y });
export const vadd = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const vsub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const vmul = (a: Vec2, s: number): Vec2 => ({ x: a.x * s, y: a.y * s });
export const vclone = (a: Vec2): Vec2 => ({ x: a.x, y: a.y });

function clamp01(x: number) { return x < 0 ? 0 : x > 1 ? 1 : x; }

function ease(t: number, mode: Interpolation): number {
  switch (mode) {
    case "step":      return 0;                              // hold until next key
    case "linear":    return t;
    case "easeIn":    return t * t;
    case "easeOut":   return 1 - (1 - t) * (1 - t);
    case "easeInOut": return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

/* ---------- clip timing helpers ---------- */

/**
 * Given a clip and a global local-time (seconds into the clip's playback), return
 * the effective sample time respecting loop, speed, and stepped visualFps.
 */
export function sampleTime(
  clip: Pick<CutoutClip, "duration" | "loop" | "speed" | "visualFps">,
  localTime: number,
): { t: number; frame: number; frameCount: number } {
  const scaled = localTime * (clip.speed || 1);
  let t = clip.loop ? scaled % clip.duration : Math.min(scaled, clip.duration);
  if (t < 0) t += clip.duration;
  if (clip.visualFps && clip.visualFps > 0) {
    // Quantize to visual FPS — this is what makes stepped animation "chunky".
    const step = 1 / clip.visualFps;
    t = Math.floor(t / step) * step;
  }
  const frameCount = clip.visualFps ? Math.max(1, Math.round(clip.duration * clip.visualFps)) : 0;
  const frame = frameCount > 0 ? Math.floor((t / clip.duration) * frameCount) % frameCount : 0;
  return { t, frame, frameCount };
}

/* ---------- keyframe evaluation ---------- */

function findKeyframePair(keyframes: PartKeyframe[], t: number): { a: PartKeyframe | null; b: PartKeyframe | null; lt: number } {
  if (keyframes.length === 0) return { a: null, b: null, lt: 0 };
  if (keyframes.length === 1) return { a: keyframes[0], b: keyframes[0], lt: 0 };
  let a = keyframes[0]; let b = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].t && t <= keyframes[i + 1].t) { a = keyframes[i]; b = keyframes[i + 1]; break; }
  }
  if (t < a.t) { a = keyframes[0]; b = keyframes[0]; return { a, b, lt: 0 }; }
  if (t > b.t) { a = keyframes[keyframes.length - 1]; b = keyframes[keyframes.length - 1]; return { a, b, lt: 1 }; }
  const span = b.t - a.t;
  const lt = span <= 0 ? 1 : clamp01((t - a.t) / span);
  return { a, b, lt };
}

function lerpNum(a: number | undefined, b: number | undefined, t: number, fallback: number): number {
  const av = a ?? fallback; const bv = b ?? av;
  return av + (bv - av) * t;
}

function lerpVec(a: Vec2 | undefined, b: Vec2 | undefined, t: number, fallback: Vec2): Vec2 {
  const av = a ?? fallback; const bv = b ?? av;
  return { x: av.x + (bv.x - av.x) * t, y: av.y + (bv.y - av.y) * t };
}

/**
 * The "delta" a single clip wants to apply to a single part at a local sample time.
 * A null channel means "don't override this channel".
 */
export interface PartChannelDelta {
  position?: Vec2;
  rotation?: number;
  scale?: Vec2;
  sprite?: string;
  visible?: boolean;
  flipX?: boolean;
  flipY?: boolean;
}

export function evaluatePartTrack(
  track: PartTrack | undefined,
  sampleT: number,
  defaultInterp: Interpolation,
): PartChannelDelta {
  if (!track || track.keyframes.length === 0) return {};
  const { a, b, lt } = findKeyframePair(track.keyframes, sampleT);
  if (!a) return {};
  const interpMode: Interpolation = a.interpolation ?? defaultInterp;
  if (b === a || interpMode === "step") {
    return {
      position: a.position,
      rotation: a.rotation,
      scale: a.scale,
      sprite: a.sprite,
      visible: a.visible,
      flipX: a.flipX,
      flipY: a.flipY,
    };
  }
  const t = ease(lt, interpMode);
  return {
    position: (a.position || b?.position) ? lerpVec(a.position, b?.position, t, a.position ?? b!.position!) : undefined,
    rotation: (a.rotation !== undefined || b?.rotation !== undefined) ? lerpNum(a.rotation, b?.rotation, t, a.rotation ?? 0) : undefined,
    scale: (a.scale || b?.scale) ? lerpVec(a.scale, b?.scale, t, a.scale ?? b!.scale!) : undefined,
    // Non-numeric channels step even when interp is linear:
    sprite: a.sprite,
    visible: a.visible,
    flipX: a.flipX,
    flipY: a.flipY,
  };
}

/* ---------- clip evaluation → map of partId → delta ---------- */

export function evaluateClip(clip: CutoutClip, localTime: number): Map<string, PartChannelDelta> {
  const { t } = sampleTime(clip, localTime);
  const out = new Map<string, PartChannelDelta>();
  for (const track of clip.tracks) {
    out.set(track.partId, evaluatePartTrack(track, t, clip.defaultInterpolation));
  }
  return out;
}

/* ---------- pose composition across layers ---------- */

/**
 * Compose N layers from lowest to highest. Higher layers win per-channel only when
 * they provide a value; missing channels fall through to the layer below.
 */
export function composeLayers(layers: Map<string, PartChannelDelta>[]): Map<string, PartChannelDelta> {
  const out = new Map<string, PartChannelDelta>();
  for (const layer of layers) {
    for (const [partId, delta] of layer) {
      const existing = out.get(partId) ?? {};
      out.set(partId, {
        position: delta.position ?? existing.position,
        rotation: delta.rotation ?? existing.rotation,
        scale: delta.scale ?? existing.scale,
        sprite: delta.sprite ?? existing.sprite,
        visible: delta.visible ?? existing.visible,
        flipX: delta.flipX ?? existing.flipX,
        flipY: delta.flipY ?? existing.flipY,
      });
    }
  }
  return out;
}

/** Compute a rig's "rest pose" (rest pose is whatever the rig's part definitions say). */
export function restPoseDelta(parts: CutoutPart[]): Map<string, PartChannelDelta> {
  const out = new Map<string, PartChannelDelta>();
  for (const p of parts) {
    out.set(p.id, {
      position: { ...p.position },
      rotation: p.rotation,
      scale: { ...p.scale },
      sprite: p.sprite,
      visible: p.visible,
      flipX: p.flipX,
      flipY: p.flipY,
    });
  }
  return out;
}

/* ---------- hierarchy resolution → world-space poses ---------- */

interface ResolveContext {
  partsById: Map<string, CutoutPart>;
  childrenOf: Map<string, string[]>;
  deltas: Map<string, PartChannelDelta>;
  rootOverride?: Vec2;
  facing: FacingDirection;
}

function resolvePart(
  ctx: ResolveContext,
  partId: string,
  parentX: number,
  parentY: number,
  parentRot: number,
  parentSx: number,
  parentSy: number,
  out: ResolvedPartPose[],
) {
  const part = ctx.partsById.get(partId);
  if (!part) return;
  const d = ctx.deltas.get(partId) ?? {};
  // Apply direction flips for left/right — root only so children inherit.
  let localPos = d.position ?? part.position;
  let localRot = d.rotation ?? part.rotation;
  let localSx = (d.scale?.x ?? part.scale.x);
  let localSy = (d.scale?.y ?? part.scale.y);
  const flipX = d.flipX ?? part.flipX;
  const flipY = d.flipY ?? part.flipY;
  const visible = d.visible ?? part.visible;
  const sprite = d.sprite ?? part.sprite;

  // When facing left we mirror horizontally at the root.
  // Children inherit the mirror via parentSx going negative, so authored "LeftArm"
  // doesn't have to be re-authored — the same clip works for both left & right.
  const finalSx = parentSx * localSx * (flipX ? -1 : 1);
  const finalSy = parentSy * localSy * (flipY ? -1 : 1);
  const finalRot = parentRot + localRot;

  // Position relative to parent, rotated by parent rotation.
  const cos = Math.cos(deg2rad(parentRot));
  const sin = Math.sin(deg2rad(parentRot));
  const rx = localPos.x * cos - localPos.y * sin;
  const ry = localPos.x * sin + localPos.y * cos;
  const finalX = parentX + rx * parentSx;
  const finalY = parentY + ry * parentSy;

  out.push({
    partId,
    x: finalX,
    y: finalY,
    rotation: finalRot,
    sx: finalSx,
    sy: finalSy,
    sprite,
    pivotX: part.pivot.x,
    pivotY: part.pivot.y,
    visible,
    flipX,
    flipY,
    order: part.order,
    tint: part.tint,
    opacity: part.opacity ?? 1,
  });

  const kids = ctx.childrenOf.get(partId);
  if (kids) for (const kid of kids) resolvePart(ctx, kid, finalX, finalY, finalRot, finalSx, finalSy, out);
}

/**
 * Resolve a complete pose given:
 *   - a rig (parts + hierarchy)
 *   - per-part deltas (post-layer-composition)
 *   - root world position & facing
 *
 * Returns flat list of ResolvedPartPose in draw order (sorted by `order`).
 */
export function resolvePose(
  rig: CutoutRig,
  deltas: Map<string, PartChannelDelta>,
  rootPosition: Vec2,
  facing: FacingDirection,
): ResolvedPartPose[] {
  const partsById = new Map<string, CutoutPart>();
  const childrenOf = new Map<string, string[]>();
  for (const p of rig.parts) {
    partsById.set(p.id, p);
    const pid = p.parentId ?? "__root__";
    if (!childrenOf.has(pid)) childrenOf.set(pid, []);
    childrenOf.get(pid)!.push(p.id);
  }
  // Root mirroring: if facing left/backLeft/frontLeft we flip the whole character.
  // For back we don't mirror (artist supplies back-facing sprites if available).
  // For right we don't mirror. Diagonals inherit the horizontal axis mirror.
  const rootSx = (facing === "left" || facing === "frontLeft" || facing === "backLeft") ? -1 : 1;
  const rootSy = 1;

  // Find root parts: those with no parent (or parentId === null) OR rig.rootPartId.
  let rootIds: string[] = [];
  if (rig.rootPartId && partsById.has(rig.rootPartId)) rootIds = [rig.rootPartId];
  else rootIds = childrenOf.get("__root__") ?? [];

  const flat: ResolvedPartPose[] = [];
  for (const rid of rootIds) {
    resolvePart({ partsById, childrenOf, deltas, facing }, rid, rootPosition.x, rootPosition.y, 0, rootSx, rootSy, flat);
  }
  // Draw order: sort by `order` ascending.
  flat.sort((a, b) => a.order - b.order);
  return flat;
}

/* ---------- facing from velocity ---------- */

export function facingFromVelocity(vx: number, vy: number, threshold = 0.5): FacingDirection {
  const ax = Math.abs(vx); const ay = Math.abs(vy);
  if (ax < threshold && ay < threshold) return "front";
  // 8-way: compare axes; prefer stronger axis, fall back to diagonal.
  // Note: in screen space +y is down, but for facing we treat -y as "away" (back) and +y as "towards" (front).
  // Artists that use standard game Y conventions can override this externally.
  const right = vx > 0;
  const towards = vy > 0; // +y = toward camera in our stage coordinates
  if (ax > ay * 2) return right ? "right" : "left";
  if (ay > ax * 2) return towards ? "front" : "back";
  // Diagonal
  if (right && towards) return "frontRight";
  if (right && !towards) return "backRight";
  if (!right && towards) return "frontLeft";
  return "backLeft";
}

/* ---------- viseme evaluation from lip-sync tracks ---------- */

/**
 * Given a lip-sync track and an audio playback time, find the current viseme.
 * Uses the audio timestamp as authoritative (not frame count).
 * The last event at or before `t` wins; we hold it until the next event.
 */
export function visemeAt(track: LipSyncTrack | undefined, audioTime: number): VisemeEvent | null {
  if (!track || track.events.length === 0) return null;
  if (audioTime < 0) return track.events[0] ?? null;
  if (audioTime > track.duration) return track.events[track.events.length - 1] ?? null;
  // Events are assumed sorted; do a linear scan (typical clip < 30s, < 300 events — fine).
  let current = track.events[0];
  for (const ev of track.events) {
    if (ev.t <= audioTime) current = ev;
    else break;
  }
  return current;
}

/**
 * Very lightweight "automatic" lip-sync generator.
 *
 * Real phoneme recognition is a research problem; for an editor preview / placeholder
 * we use an amplitude-envelope approach on an AudioBuffer, bouncing through a small
 * set of visemes in proportion to loudness. This gives a convincing-enough jaw flap
 * that artists can then edit by hand into a proper track.
 *
 * The result is a fully-editable VisemeEvent[] so this is one-shot analysis, cached.
 */
export function autoLipSyncFromBuffer(
  buffer: AudioBuffer,
  opts: { language?: string; fps?: number } = {},
): VisemeEvent[] {
  const fps = opts.fps ?? 24;
  const hop = Math.max(1, Math.floor(buffer.sampleRate / fps));
  const ch0 = buffer.getChannelData(0);
  const events: VisemeEvent[] = [];
  let prev: Viseme = "neutral";
  for (let i = 0; i < ch0.length; i += hop) {
    // Compute RMS over the hop window.
    let sum = 0; const end = Math.min(ch0.length, i + hop);
    for (let j = i; j < end; j++) { const s = ch0[j]; sum += s * s; }
    const rms = Math.sqrt(sum / Math.max(1, end - i));
    const loud = clamp01(rms * 4); // normalize roughly
    let vis: Viseme;
    if (loud < 0.04) vis = "neutral";
    else if (loud < 0.18) vis = "closed";
    else if (loud < 0.35) vis = "open";
    else if (loud < 0.55) vis = "wide";
    else if (loud < 0.75) vis = "round";
    else vis = "teeth";
    // De-duplicate runs of the same viseme to keep the timeline clean.
    if (vis !== prev || i === 0) {
      events.push({ t: i / buffer.sampleRate, viseme: vis, weight: Math.min(1, loud + 0.2) });
      prev = vis;
    }
  }
  return events;
}

/** Default English ARPAbet-ish phoneme → viseme mapping. User-replaceable. */
export const DEFAULT_PHONEME_MAP: Record<string, Viseme> = {
  M: "closed", B: "closed", P: "closed",
  F: "FV", V: "FV",
  S: "narrow", Z: "narrow", TH: "narrow", DH: "narrow",
  SH: "narrow", ZH: "narrow",
  AA: "open", AE: "wide", AH: "open", AO: "round", AW: "round", AY: "wide",
  EH: "wide", ER: "open", EY: "wide",
  IH: "wide", IY: "wide",
  OW: "round", OY: "round", UH: "round", UW: "round",
  W: "round", Y: "wide", R: "open", L: "open",
  K: "open", G: "open", NG: "open", N: "open", T: "open", D: "open",
  HH: "open", CH: "narrow", JH: "narrow",
  SIL: "neutral", SP: "neutral",
};

/**
 * Build a lip-sync layer delta from a viseme + a rig mouth-slot configuration.
 * Maps viseme names onto sprite keys like "mouth:closed", "mouth:wide", etc.
 */
export function lipDeltaForViseme(
  mouthPartId: string | undefined,
  ev: VisemeEvent | null,
): Map<string, PartChannelDelta> {
  const out = new Map<string, PartChannelDelta>();
  if (!mouthPartId) return out;
  const vis: Viseme = ev?.viseme ?? "neutral";
  out.set(mouthPartId, { sprite: `mouth:${vis}` });
  return out;
}
