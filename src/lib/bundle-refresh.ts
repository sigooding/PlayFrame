import { createHash } from "node:crypto";
import { framesInSceneOrder } from "./frame-order";
import type { FilmProject, ProjectPatch } from "./types";
import directorSync from "./neonoire-director-sync.json";
import restorationSync from "./neonoire-restoration-sync.json";
import scene6Sync from "./neonoire-scene6-sync.json";

const digest = (text: string) => createHash("sha256").update(text).digest("hex");
const notesDigest = (text: string) => digest(text.replace(/(?:Generation )?Pass \d+ of \d+[^\n]*/g, "").trim());
const directorDefaults = directorSync.frames as Record<string, { notesHash: string; descriptionHash: string; image: string }>;
const sceneDefaults = directorSync.scenes as Record<string, string>;

// Notes from the last default pending cards (6f638a3). Replace them only if untouched;
// a director can add instructions while leaving the missing-image markers in place.
const pendingNotesHashes: Record<string, string> = {
  "neonoire-shot-298": "4e09581870d03c30fc6c864d522a1e836cf2c3f37038b3416e89d672ed4ad219",
  "neonoire-shot-299": "7de9dcd3dee77512884f97900be1d937b25972ca922ccfcf524da5ad47b7e193",
  "neonoire-shot-300": "ada2941f77ece1a37838837b1185aa045537b8c83a08b852426568f892974fc0",
  "neonoire-shot-302": "6e29ebf564d51768a6632ae74cd91bdbdd44471475b1c65714a15cdf27e49d4e",
  "neonoire-shot-310": "383ad501f9375a8344f048e482442b75654db83d50a25e07824c13b44d1f12af",
  "neonoire-shot-311": "1d4cfe53d1bf01f461fe4de80a63f49698b5f9b33801538f91cbecb7702a2108",
  "neonoire-shot-313": "a86933ed196d8ce0e1654a5d48b72ca1ec59ab815e252357422cf83703c04762",
  "neonoire-shot-314": "c77534bc34f20ed9a9ab6ba1c568930f19221a8952d7fe606ea4952251ccad77",
  "neonoire-shot-320": "7290623c4a0797d5006cf5db094fb6fce7bc4e93d14180f7ca32e8b5f8283d90",
  // The walk-and-the-lane round (2–3 October 2026): scene 1's six rewrite slots, hashed from the
  // placeholder notes the2 October bundle shipped them with, so a workspace still holding those
  // defaults adopts the delivered frame, its status and its note in one piece.
  "neonoire-shot-328": "4c05ce7dfdc26ee142ac4e789b251300f0b75b53a7b2b6383bd452aa18ace655",
  "neonoire-shot-329": "f5bbc901d188cbaf36cf292a7fefb13fbd1af67d8daaab8472edd1126c8228fd",
  "neonoire-shot-330": "04a8d2bb70c287d6cc43c9400dbeaedf6e7064ce86e29cc9871c44b81383fc72",
  "neonoire-shot-331": "bed9dc1d1549e4ffee4221af06a5f448e84a446e0858d9de535655d8d19b621b",
  "neonoire-shot-332": "d931b4c77efd079806dfb96e9203b908d8f278ef6a4cbc39e83157cb3d7ec3cb",
  "neonoire-shot-333": "02b5724ff3124d9f69bc4d1c0078a541e577b0ce297edb2fce98f007b419be2a"
};

/** Marked as awaiting an image, not a custom image or a deliberately blank card. */
const isAwaitingKeyframe = (frame: FilmProject["frames"][number]) =>
  !frame.image && /\(keyframe missing\)$/.test(frame.title) && frame.notes.includes("KEYFRAME MISSING");

/**
 * Bring delivered images/production labels into a saved workspace without replacing its script,
 * scenes, custom images, notes or shot edits. Migrate the old default boarding-order array only
 * when its IDs match that default exactly. A director's edited within-scene order is preserved.
 */
export function bundledFrameUpdates(existing: FilmProject, bundle: Pick<FilmProject, "frames" | "scenes"> & Partial<Pick<FilmProject, "script">>): ProjectPatch | null {
  const bundled = new Map(bundle.frames.map(frame => [frame.id, frame]));
  const knownRestorationScript = restorationSync.scriptHashes.includes(digest(existing.script))
    || digest(existing.script) === directorSync.scriptHash;
  // 2 October 2026: the interview scene (6) was rewritten. A workspace still on the default text before it, or already on
  // the new text, gets the new shot text, recorded dialogue and the seven new placeholder slots; edited fields stay.
  const onPriorDefault = scene6Sync.priorScriptHashes.includes(digest(existing.script));
  const scene6Current = onPriorDefault || existing.script === bundle.script;
  // 2 October 2026: a scene added to the screenplay (14A) reaches a saved workspace on a default text whole, once and
  // together with its slots: the scene goes right after the nearest earlier bundle scene the workspace already has.
  // A workspace already on the new text that lacks the scene deleted it, and keeps it deleted.
  const newSceneIds = new Set<string>(scene6Sync.newSceneIds);
  let scenesNow = existing.scenes;
  if (onPriorDefault) {
    for (const id of scene6Sync.newSceneIds) {
      const index = bundle.scenes.findIndex(scene => scene.id === id);
      if (index < 0 || scenesNow.some(scene => scene.id === id)) continue;
      let at = -1;
      for (let i = index - 1; i >= 0 && at < 0; i--) at = scenesNow.findIndex(scene => scene.id === bundle.scenes[i].id);
      const neighbour = scenesNow[at < 0 ? 0 : at];
      scenesNow = [...scenesNow.slice(0, at + 1), { ...bundle.scenes[index], actId: neighbour?.actId ?? bundle.scenes[index].actId }, ...scenesNow.slice(at + 1)];
    }
  }
  const scene6Frames = scene6Sync.frames as Record<string, Record<string, string>>;
  const restoreDefaults = knownRestorationScript || existing.script === bundle.script || scene6Sync.priorScriptHashes.includes(digest(existing.script));
  const restoredFrames = restorationSync.frames as Record<string, Record<string, string>>;
  const restoredScenes = restorationSync.scenes as Record<string, Record<string, string>>;
  const fieldDigest = (value: unknown) => digest(JSON.stringify(value ?? null));
  const oldDefault = [...bundle.frames].sort((a, b) => (a.shotNumber ?? 0) - (b.shotNumber ?? 0));
  const wasBoardingOrder = oldDefault.every(frame => frame.shotNumber !== undefined)
    && existing.frames.length === oldDefault.length
    && existing.frames.every((frame, index) => frame.id === oldDefault[index].id);

  let frames = existing.frames.map(frame => {
    const arrived = bundled.get(frame.id);
    if (!arrived) return frame;
    let next = frame;
    if (frame.shotNumber === undefined && arrived.shotNumber !== undefined) next = { ...next, shotNumber: arrived.shotNumber };
    if (!frame.audio?.length && arrived.audio?.length) next = { ...next, audio: arrived.audio };
    if (isAwaitingKeyframe(frame) && arrived.image) {
      const defaultNotes = pendingNotesHashes[frame.id] === createHash("sha256").update(frame.notes).digest("hex");
      next = {
        ...next, image: arrived.image, title: frame.title.replace(/\s*\(keyframe missing\)$/, ""),
        status: defaultNotes && frame.status === "Needs review" ? arrived.status : frame.status,
        notes: defaultNotes ? arrived.notes : frame.notes,
      };
    }
    const baseline = directorDefaults[frame.id];
    if (baseline && next.image === baseline.image && arrived.status === "Ready") {
      // Explicit director approval applies to the canonical image, never a custom replacement.
      next = next.status === "Ready" ? next : { ...next, status: "Ready" };
      if (notesDigest(frame.notes) === baseline.notesHash && next.notes !== arrived.notes) next = { ...next, notes: arrived.notes };
      if (digest(frame.description) === baseline.descriptionHash && frame.description !== arrived.description) next = { ...next, description: arrived.description };
    }
    const prior = restoredFrames[frame.id];
    if (restoreDefaults && prior && frame.image === prior.image) {
      for (const key of ["description", "notes", "characters", "duration", "transition", "audio"] as const) {
        if (prior[key] && fieldDigest(frame[key]) === prior[key] && JSON.stringify(next[key]) !== JSON.stringify(arrived[key])) next = { ...next, [key]: arrived[key] };
      }
    }
    const rewritten = scene6Frames[frame.id];
    if (scene6Current && rewritten) {
      for (const key of Object.keys(rewritten) as (keyof typeof arrived)[]) {
        if (fieldDigest(frame[key]) === rewritten[key] && JSON.stringify(next[key]) !== JSON.stringify(arrived[key])) next = { ...next, [key]: arrived[key] };
      }
    }
    return next;
  });
  if (scene6Current) {
    // New slots go in bundle order: each right after the nearest earlier bundle frame this workspace already has.
    const have = new Set(frames.map(frame => frame.id));
    const order = bundle.frames.map(frame => frame.id);
    for (const id of scene6Sync.newFrameIds.filter(id => !have.has(id))) {
      const arrival = bundled.get(id);
      if (!arrival) continue;
      // A new scene's slots arrive with the scene, once, and never into a scene the workspace does not have.
      if (newSceneIds.has(arrival.sceneId) && !onPriorDefault) continue;
      if (!scenesNow.some(scene => scene.id === arrival.sceneId)) continue;
      let at = -1;
      for (let i = order.indexOf(id) - 1; i >= 0 && at < 0; i--) at = frames.findIndex(frame => frame.id === order[i]);
      if (at < 0) at = frames.map(frame => frame.sceneId).lastIndexOf(arrival.sceneId);
      frames.splice(at < 0 ? frames.length : at + 1, 0, arrival);
      have.add(id);
    }
  }
  if (wasBoardingOrder) {
    const rank = new Map(bundle.frames.map((frame, index) => [frame.id, index]));
    frames.sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
  }
  const existingIds = new Set(existing.frames.map(frame => frame.id));
  if (restoreDefaults && restorationSync.priorFrameIds.every(id => existingIds.has(id))
    && bundle.scenes.every(scene => newSceneIds.has(scene.id) || scenesNow.some(old => old.id === scene.id))) {
    const arrivals = restorationSync.restoredFrameIds.filter(id => !existingIds.has(id)).map(id => bundled.get(id)).filter((frame): frame is FilmProject["frames"][number] => !!frame);
    if (arrivals.length) {
      const at = frames.findIndex(frame => frame.sceneId === "neonoire-s99a");
      frames.splice(at < 0 ? frames.length : at, 0, ...arrivals);
    }
  }
  frames = framesInSceneOrder(frames, scenesNow);
  const scenesById = new Map(bundle.scenes.map(scene => [scene.id, scene]));
  const scenes = scenesNow.map(scene => {
    const arrived = scenesById.get(scene.id);
    let next = scene.number === undefined && arrived?.number ? { ...scene, number: arrived.number } : scene;
    if (arrived && digest(scene.description) === sceneDefaults[scene.id] && arrived.description !== scene.description) next = { ...next, description: arrived.description };
    const prior = restoredScenes[scene.id];
    if (restoreDefaults && prior && arrived) for (const key of ["description", "location", "title", "time", "characters"] as const) {
      if (prior[key] && fieldDigest(scene[key]) === prior[key] && JSON.stringify(next[key]) !== JSON.stringify(arrived[key])) next = { ...next, [key]: arrived[key] };
    }
    return next;
  });
  const patch: ProjectPatch = {};
  if (bundle.script !== undefined && existing.script !== bundle.script && (knownRestorationScript || digest(existing.script) === directorSync.scriptHash || scene6Sync.priorScriptHashes.includes(digest(existing.script)))) patch.script = bundle.script;
  if (frames.length !== existing.frames.length || frames.some((frame, index) => frame !== existing.frames[index])) patch.frames = frames;
  if (scenes.length !== existing.scenes.length || scenes.some((scene, index) => scene !== existing.scenes[index])) patch.scenes = scenes;
  return Object.keys(patch).length ? patch : null;
}
