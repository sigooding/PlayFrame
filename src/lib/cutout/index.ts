/**
 * Public API for the Cutout Character system.
 *
 * Usage overview:
 *
 *   import { CutoutCharacter } from "@/lib/cutout";
 *   import { buildPlaceholderRig, buildPlaceholderClips } from "@/lib/cutout/placeholder";
 *
 *   const rig = buildPlaceholderRig();
 *   const clips = buildPlaceholderClips();
 *   const character = new CutoutCharacter({ rig, clips });
 *
 *   // each frame:
 *   character.position.x += velocity.x * dt;
 *   const pose = character.tick(dt, { velocity });
 *   // draw `pose` with your own renderer, or use renderPose() from render.ts
 */

export * from "./types";
export * from "./runtime";
export { CutoutCharacter } from "./character";
export type { CharacterInput, CharacterOptions, AudioPlayback } from "./character";
export { renderPose } from "./render";
export type { SpriteResolver, RenderOptions } from "./render";
export { buildWalkClip, buildIdleClip, buildTalkClip, buildBlinkClip } from "./walk";
export type { WalkParams } from "./walk";
export {
  synthesizeDemoVoice, decodeAudio, autoLipSyncFromAudio, parseLipSyncJson,
  serializeLipSyncJson, BufferPlayback,
} from "./audio";
export { buildPlaceholderRig, buildPlaceholderClips, buildDemoLipSync } from "./placeholder";
