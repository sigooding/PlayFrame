// The recorded dialogue: docs/neonoire/voice/manifest.json is the source of truth, the mp3s live under
// public/audio/neonoire/<scene>/, and the builder attaches each line to its frame.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const MANIFEST = "docs/neonoire/voice/manifest.json";
export const VOICES = "docs/neonoire/voice/voices.json";
/** Seconds of air left after the last spoken word before the frame cuts. */
export const TAIL = 0.6;

export const readManifest = root => JSON.parse(readFileSync(resolve(root, MANIFEST), "utf8"));
export const readVoices = root => JSON.parse(readFileSync(resolve(root, VOICES), "utf8"));

/** Attaches the manifest's lines to the frames (mutating them) and returns how many were attached. */
export function attachAudio(frames, manifest, root) {
  const byId = new Map(frames.map(frame => [frame.id, frame]));
  const seen = new Set();
  let count = 0;
  for (const line of manifest.lines) {
    if (seen.has(line.id)) throw new Error(`Voice line id ${line.id} is used twice in ${MANIFEST}`);
    seen.add(line.id);
    const frame = byId.get(line.frameId);
    if (!frame) throw new Error(`Voice line ${line.id} points at ${line.frameId}, which is not a frame of the bundle`);
    if (!/^\/audio\/[A-Za-z0-9._/-]+\.(mp3|wav|m4a|ogg)$/.test(line.file)) throw new Error(`Voice line ${line.id}: ${line.file} is not an /audio/ path`);
    if (!existsSync(resolve(root, "public" + line.file))) throw new Error(`Voice line ${line.id}: public${line.file} does not exist`);
    (frame.audio ||= []).push({
      id: line.id, character: line.character, text: line.text, src: line.file, offset: line.offset,
      ...(line.duration ? { duration: line.duration } : {}),
      ...(line.textJa ? { textJa: line.textJa, language: line.language || "ja" } : {}),
      ...(line.voice ? { voice: line.voice } : {}), ...(line.model ? { model: line.model } : {}),
    });
    const needed = Math.ceil(line.offset + (line.duration || 0) + TAIL);
    if (needed > frame.duration) frame.duration = needed;
    count++;
  }
  for (const frame of frames) frame.audio?.sort((a, b) => a.offset - b.offset);
  return count;
}
