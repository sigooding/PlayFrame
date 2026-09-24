/**
 * Canvas2D renderer for cutout characters.
 *
 * Takes resolved part poses and draws them. When a part's sprite is NOT in the
 * provided sprite sheet (or no sheet is given), we fall back to a simple
 * procedurally-drawn primitive named by the sprite key. This lets us demo & test
 * without any binary art assets, while still supporting artist-supplied PNGs.
 */

import type { CutoutRig, ResolvedPartPose } from "./types";
import { deg2rad } from "./runtime";

export interface SpriteResolver {
  (spriteKey: string): HTMLImageElement | HTMLCanvasElement | null;
}

export interface RenderOptions {
  debug?: {
    showPivots?: boolean;
    showHierarchy?: boolean;
    showBounds?: boolean;
    label?: string;
  };
  /** Tint multiply — useful for damage flashes etc. */
  tint?: string;
}

/**
 * Render a resolved pose list onto a 2D canvas context.
 * Origin is the rig root position passed into resolvePose().
 */
export function renderPose(
  ctx: CanvasRenderingContext2D,
  rig: CutoutRig,
  pose: ResolvedPartPose[],
  resolver: SpriteResolver,
  options: RenderOptions = {},
) {
  ctx.save();
  for (const part of pose) {
    if (!part.visible) continue;
    ctx.save();
    ctx.translate(part.x, part.y);
    ctx.rotate(deg2rad(part.rotation));
    ctx.scale(part.sx, part.sy);
    ctx.globalAlpha = part.opacity;
    const spriteKey = part.sprite ?? `part:${part.partId}`;
    const img = resolver(spriteKey);
    if (img) {
      // Draw image centered on pivot.
      ctx.drawImage(img, -part.pivotX, -part.pivotY);
    } else {
      // Fallback procedural art.
      drawProceduralPart(ctx, spriteKey, part, rig);
    }
    if (options.tint || part.tint) {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = part.tint ?? options.tint ?? "#fff";
      ctx.fillRect(-part.pivotX - 200, -part.pivotY - 200, 400, 400);
    }
    if (options.debug?.showPivots) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#ff3366";
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (options.debug?.label) {
    const first = pose[0];
    if (first) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(first.x - 60, first.y - 150, 200, 20);
      ctx.fillStyle = "#fff";
      ctx.font = "11px DM Sans, sans-serif";
      ctx.fillText(options.debug.label, first.x - 55, first.y - 136);
    }
  }
  ctx.restore();
}

/**
 * Fallback procedural drawing. Recognises a simple naming scheme:
 *   body:rect:W:H, body:oval:W:H, body:limb:W:H, mouth:<viseme>, eye, brow, head, shoe
 * Everything else draws as a labelled placeholder.
 */
function drawProceduralPart(
  ctx: CanvasRenderingContext2D,
  key: string,
  part: ResolvedPartPose,
  _rig: CutoutRig,
) {
  // Default fill — a soft colour by part id so layers are visible.
  const palette: Record<string, string> = {
    body: "#e8c39e",      // skin/torso
    head: "#f0d0ae",
    arm: "#e8c39e",
    leg: "#4a5b7a",
    foot: "#232832",
    eye: "#ffffff",
    pupil: "#20252c",
    brow: "#3a2b20",
    mouth: "#a04a3a",
  };
  const tag = key.split(":")[0];
  const fill = palette[tag] ?? "#c8c9c1";

  // Helper: rounded rectangle
  function roundRect(w: number, h: number, r: number) {
    const x = -part.pivotX; const y = -part.pivotY;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }

  function oval(w: number, h: number) {
    const x = -part.pivotX + w / 2; const y = -part.pivotY + h / 2;
    ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = fill;
  switch (tag) {
    case "body": {
      roundRect(44, 54, 10);
      // Shirt detail
      ctx.fillStyle = "#355440"; roundRect(44, 30, 8);
      ctx.fillStyle = fill;
      return;
    }
    case "head": {
      oval(48, 54);
      return;
    }
    case "arm": {
      roundRect(16, 42, 8);
      // Hand
      ctx.fillStyle = "#f0d0ae";
      oval(16, 14);
      return;
    }
    case "leg": {
      roundRect(18, 46, 6);
      return;
    }
    case "foot":
    case "shoe": {
      roundRect(26, 14, 5);
      return;
    }
    case "eye": {
      oval(12, 12);
      ctx.fillStyle = palette.pupil;
      oval(5, 5);
      return;
    }
    case "brow": {
      ctx.strokeStyle = palette.brow;
      ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-part.pivotX, -part.pivotY + 4); ctx.lineTo(-part.pivotX + 12, -part.pivotY); ctx.stroke();
      return;
    }
    case "mouth": {
      const viseme = key.split(":")[1] ?? "neutral";
      drawMouthViseme(ctx, viseme, part);
      return;
    }
    case "hair": {
      ctx.fillStyle = "#3a2b20"; roundRect(54, 16, 8);
      return;
    }
    default: {
      // Placeholder square with label.
      ctx.fillStyle = fill; roundRect(24, 24, 4);
      ctx.fillStyle = "#000"; ctx.font = "8px sans-serif";
      ctx.fillText(key.split(":").slice(-1)[0] ?? key, -part.pivotX, -part.pivotY + 14);
    }
  }
}

function drawMouthViseme(
  ctx: CanvasRenderingContext2D,
  viseme: string,
  part: ResolvedPartPose,
) {
  const cx = -part.pivotX + 10;
  const cy = -part.pivotY + 6;
  ctx.strokeStyle = "#6b2f26";
  ctx.fillStyle = "#5c281f";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  switch (viseme) {
    case "closed":
      ctx.beginPath(); ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy); ctx.stroke();
      return;
    case "neutral":
      ctx.beginPath(); ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy + 1); ctx.stroke();
      return;
    case "open":
      ctx.beginPath(); ctx.ellipse(cx, cy + 2, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      return;
    case "wide":
      ctx.beginPath(); ctx.ellipse(cx, cy + 1, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
      return;
    case "round":
      ctx.beginPath(); ctx.ellipse(cx, cy + 2, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
      return;
    case "teeth":
      ctx.beginPath(); ctx.ellipse(cx, cy + 2, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(cx - 8, cy, 16, 2);
      return;
    case "FV":
      ctx.beginPath(); ctx.moveTo(cx - 7, cy + 2); ctx.lineTo(cx + 7, cy - 1); ctx.stroke();
      return;
    case "narrow":
      ctx.beginPath(); ctx.ellipse(cx, cy + 1, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
      return;
    default:
      ctx.beginPath(); ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy); ctx.stroke();
  }
}
