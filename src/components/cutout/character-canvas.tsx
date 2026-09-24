"use client";

import { useEffect, useRef } from "react";
import type { CutoutCharacter } from "@/lib/cutout/character";
import { renderPose, type SpriteResolver } from "@/lib/cutout/render";
import type { CutoutDebugFlags } from "@/lib/cutout/types";

interface Props {
  character: CutoutCharacter;
  width?: number;
  height?: number;
  /** Per-frame input callback — return velocity, facing override, voice playback, etc. */
  update: (dt: number) => void;
  resolver?: SpriteResolver;
  background?: string;
  debug?: CutoutDebugFlags;
  /** Optional label to draw in corner. */
  label?: string;
}

/**
 * Canvas renderer that drives a CutoutCharacter in a requestAnimationFrame loop.
 * The caller owns the character instance; update() is called each frame to feed
 * input (velocity, voice-over state, position) to the character.
 */
export function CharacterCanvas({
  character, width = 520, height = 360, update, resolver, background = "#f3f4ee", debug, label,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      const pose = character.lastPose;
      // Clear
      ctx.save();
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Ground line
      ctx.strokeStyle = "#d7dbc9"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, canvas.height - 40); ctx.lineTo(canvas.width, canvas.height - 40); ctx.stroke();
      // Translate so character feet sit on the ground line if the character doesn't set position itself.
      if (character.position.x === 0 && character.position.y === 0) {
        ctx.translate(canvas.width / 2, canvas.height - 40);
      } else {
        ctx.translate(0, 0);
      }
      renderPose(ctx, character.rig, pose, resolver ?? (() => null), {
        debug: {
          showPivots: debug?.showPivots,
          label: debug?.showStateLabel ? `${character.currentState}  f=${character.facing}  lip=${currentViseme(character)}` : undefined,
        },
      });
      if (debug?.showHierarchy) drawHierarchy(ctx, character);
      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, background, resolver, debug, label]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ borderRadius: 8, display: "block" }} />;
}

function currentViseme(c: CutoutCharacter): string {
  if (!c.voiceTrack || !c.voicePlayback) return "—";
  const t = c.voicePlayback.currentTime;
  const ev = c.voiceTrack.events.slice().reverse().find(e => e.t <= t);
  return ev?.viseme ?? "neutral";
}

function drawHierarchy(_ctx: CanvasRenderingContext2D, _c: CutoutCharacter) {
  // Small debug overlay — implemented as simple lines from parent→child pivots.
  // Kept minimal; the editor view exposes a richer one.
}
