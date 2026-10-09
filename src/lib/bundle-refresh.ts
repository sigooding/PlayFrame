import { createHash } from "node:crypto";
import { framesInSceneOrder } from "./frame-order";
import type { FilmProject, FrameAudio, ProjectPatch } from "./types";
import directorSync from "./neonoire-director-sync.json";
import restorationSync from "./neonoire-restoration-sync.json";
import scene6Sync from "./neonoire-scene6-sync.json";
import coverageSync from "./neonoire-coverage-sync.json";
import voiceSync from "./neonoire-voice-sync.json";
import textSync from "./neonoire-text-sync.json";

const digest = (text: string) => createHash("sha256").update(text).digest("hex");
const notesDigest = (text: string) => digest(text.replace(/(?:Generation )?Pass \d+ of \d+[^\n]*/g, "").trim());
const directorDefaults = directorSync.frames as Record<string, { notesHash: string; descriptionHash: string; image: string }>;
const sceneDefaults = directorSync.scenes as Record<string, string>;

// Notes from the last default pending cards. Replace them only if untouched; a director can add
// instructions while leaving the missing-image markers in place. The 2 October 2026 slots (321–343)
// joined the map on 3 October 2026, when the ten frames of the first rewrite pass arrived: a saved
// workspace on the 2 October default that still holds the untouched card gets the picture, the
// title, the status and the note; an edited card keeps its words and only gains the image.
const pendingNotesHashes: Record<string, string> = {
  "neonoire-shot-321": "c451adb59fba300b2b276f1b585147021acb7c23abff0d65afc1a6599d497ccc",
  "neonoire-shot-322": "6a886c0679dc60d4f4b3312d52307ece138474924fbf0897938c872ebdaab2e4",
  "neonoire-shot-323": "e9610ae879caafe74e758037c7b3c3fa709847d67bbfdd7372ed545603fcf475",
  "neonoire-shot-324": "9d61b9751f6d361d89add3e07120759c5e3e3dcf56fd0e21d6c6fbe19269d02f",
  "neonoire-shot-325": "2089259bea00186cc4320a8e52c549ac8e22f3fc41a6671513f24a4d09eda4b8",
  "neonoire-shot-326": "14fd444d4651a5a4b13852f576e558252ea5941b22c95c7e3bef317af93b106c",
  "neonoire-shot-327": "97d1ed38c068115d856be1c0d463774fdb3d96e53ace1d0ca948e1bc7ee9425d",
  "neonoire-shot-328": "4c05ce7dfdc26ee142ac4e789b251300f0b75b53a7b2b6383bd452aa18ace655",
  "neonoire-shot-329": "f5bbc901d188cbaf36cf292a7fefb13fbd1af67d8daaab8472edd1126c8228fd",
  "neonoire-shot-330": "04a8d2bb70c287d6cc43c9400dbeaedf6e7064ce86e29cc9871c44b81383fc72",
  "neonoire-shot-331": "bed9dc1d1549e4ffee4221af06a5f448e84a446e0858d9de535655d8d19b621b",
  "neonoire-shot-332": "d931b4c77efd079806dfb96e9203b908d8f278ef6a4cbc39e83157cb3d7ec3cb",
  "neonoire-shot-333": "02b5724ff3124d9f69bc4d1c0078a541e577b0ce297edb2fce98f007b419be2a",
  "neonoire-shot-334": "9d3e7b8f511ad1ff8f556db717ab2f18c5cd96d8d9f2cfacc357fa62444c2a52",
  "neonoire-shot-335": "afed61af295faa448fe488f3b5acfff02a7b0c56689855dc08741e242d93c001",
  "neonoire-shot-336": "22100a43c2d693ca50700040240f6c9b078e94218405388db8e8393226645619",
  "neonoire-shot-337": "75711d925a8df145361224e88fe244d98bdcb2352ad20340bab50335977d29b4",
  "neonoire-shot-338": "ad1670ba86255412b86f2ee3e0675836e4ca658e6e4889bcb60b17a3e4bbc416",
  "neonoire-shot-339": "403bf6911cef1df0114d3e710944842983b183d0f8ef11a021fe7366369957ac",
  "neonoire-shot-340": "bec60ee888837c7759b7fcf4793d4178ba5cd84adc26b4220368c2877b778775",
  "neonoire-shot-341": "90440faef42a6b6fc478145d221a89b134ff1cad85a624bedf4dd58539c3b596",
  "neonoire-shot-342": "a9f5f813b691af6b65684c5a3a5f8f18877f7a67bceed2de610ef23aed755775",
  "neonoire-shot-343": "d7f5fbfef5af7c554da00aecd3f304c05adc179d0404b685d2a96b5f4ac359a0",
  "neonoire-shot-298": "4e09581870d03c30fc6c864d522a1e836cf2c3f37038b3416e89d672ed4ad219",
  "neonoire-shot-299": "7de9dcd3dee77512884f97900be1d937b25972ca922ccfcf524da5ad47b7e193",
  "neonoire-shot-300": "ada2941f77ece1a37838837b1185aa045537b8c83a08b852426568f892974fc0",
  "neonoire-shot-302": "6e29ebf564d51768a6632ae74cd91bdbdd44471475b1c65714a15cdf27e49d4e",
  "neonoire-shot-310": "383ad501f9375a8344f048e482442b75654db83d50a25e07824c13b44d1f12af",
  "neonoire-shot-311": "1d4cfe53d1bf01f461fe4de80a63f49698b5f9b33801538f91cbecb7702a2108",
  "neonoire-shot-313": "a86933ed196d8ce0e1654a5d48b72ca1ec59ab815e252357422cf83703c04762",
  "neonoire-shot-314": "c77534bc34f20ed9a9ab6ba1c568930f19221a8952d7fe606ea4952251ccad77",
  "neonoire-shot-320": "7290623c4a0797d5006cf5db094fb6fce7bc4e93d14180f7ca32e8b5f8283d90"
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
  // 8–9 October 2026: a line of the screenplay changed (scene 86). A workspace still on the default text just before it is treated as
  // current, exactly as it was the day before, and takes the new text (scripts/neonoire/sync-text.mjs records those defaults).
  const onCurrentText = existing.script === bundle.script || textSync.priorScriptHashes.includes(digest(existing.script));
  // 2 October 2026: the interview scene (6) was rewritten. A workspace still on the default text before it, or already on
  // the new text, gets the new shot text, recorded dialogue and the seven new placeholder slots; edited fields stay.
  const onPriorDefault = scene6Sync.priorScriptHashes.includes(digest(existing.script));
  const scene6Current = onPriorDefault || onCurrentText;
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
  const restoreDefaults = knownRestorationScript || onCurrentText || scene6Sync.priorScriptHashes.includes(digest(existing.script));
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
    // 7 October 2026: the recorded dialogue grew from 417 to 563 lines. A frame with no dialogue gets the bundle's; a frame still
    // holding exactly the dialogue an earlier bundle shipped (its digest is in the voice sync) takes the new takes and offsets; a frame
    // whose dialogue the writer edited keeps it. Either way the frame is lengthened, never shortened, so every line fits.
    const voiced = (voiceSync.frames as Record<string, { audio: string | string[] }>)[frame.id];
    if ((!frame.audio?.length && arrived.audio?.length) || (voiced && frame.audio?.length && ([] as string[]).concat(voiced.audio).includes(fieldDigest(frame.audio)) && JSON.stringify(arrived.audio) !== JSON.stringify(frame.audio))) {
      next = { ...next, audio: arrived.audio, duration: Math.max(frame.duration, arrived.duration) };
    }
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
    // 9 October 2026: corrected shot wording (scenes 1 and 2 rewritten to their pictures and the current screenplay). A title,
    // description or note still exactly as an earlier bundle shipped it takes the bundle's; one the writer changed is kept.
    const retold = (textSync.frames as Record<string, Partial<Record<"title" | "description" | "notes", string[]>>>)[frame.id];
    if (retold) for (const key of ["title", "description", "notes"] as const) {
      if (retold[key]?.includes(fieldDigest(next[key])) && next[key] !== arrived[key]) next = { ...next, [key]: arrived[key] };
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
  // 4 October 2026: the long-hold, relief and second coverage passes added frames 344–376 without changing
  // the script. A saved workspace still on a known default receives each untouched batch at its bundle
  // positions — right after the nearest earlier bundle frame it already has. Arrival is all-or-nothing per
  // batch: a workspace that holds any of a batch has had it, so a frame the director deleted is not reinstated,
  // and a workspace whose script was edited receives none of the new frames.
  const coverageBatches = ((coverageSync as { batches?: string[][] }).batches || [coverageSync.newFrameIds]) as string[][];
  const coverageCurrent = onCurrentText
    || scene6Sync.priorScriptHashes.includes(digest(existing.script))
    || (coverageSync.priorScriptHashes as string[]).includes(digest(existing.script));
  for (const coverageIds of coverageBatches) {
    if (coverageCurrent && coverageIds.length && coverageIds.every(id => !existing.frames.some(frame => frame.id === id))) {
      const have = new Set(frames.map(frame => frame.id));
      const order = bundle.frames.map(frame => frame.id);
      for (const id of coverageIds.filter(id => !have.has(id))) {
        const arrival = bundled.get(id);
        if (!arrival) continue;
        if (!scenesNow.some(scene => scene.id === arrival.sceneId)) continue;
        let at = -1;
        for (let i = order.indexOf(id) - 1; i >= 0 && at < 0; i--) at = frames.findIndex(frame => frame.id === order[i]);
        // A frame that opens its scene in the bundle (the prologue, 377) goes before the scene's first saved frame.
        const opensScene = at < 0 && !order.slice(0, order.indexOf(id)).some(prior => bundled.get(prior)?.sceneId === arrival.sceneId);
        const sceneStart = opensScene ? frames.findIndex(frame => frame.sceneId === arrival.sceneId) : -1;
        if (sceneStart >= 0) { frames.splice(sceneStart, 0, arrival); have.add(id); continue; }
        if (at < 0) at = frames.map(frame => frame.sceneId).lastIndexOf(arrival.sceneId);
        frames.splice(at < 0 ? frames.length : at + 1, 0, arrival);
        have.add(id);
      }
    }
  }
  if (wasBoardingOrder) {
    const rank = new Map(bundle.frames.map((frame, index) => [frame.id, index]));
    frames.sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
  }
  // 9 October 2026: a scene whose frames still run in exactly an order an earlier bundle shipped takes the bundle's order (scene 2:
  // shot 24, the journalist still on his stool, now plays before the two shots). A scene the director reordered keeps its order.
  for (const [sceneId, priorOrders] of Object.entries(textSync.sceneOrders as Record<string, string[][]>)) {
    const slots = frames.flatMap((frame, index) => frame.sceneId === sceneId ? [index] : []);
    const saved = slots.map(index => frames[index].id);
    const wanted = bundle.frames.filter(frame => frame.sceneId === sceneId).map(frame => frame.id);
    if (!priorOrders.some(ids => JSON.stringify(ids) === JSON.stringify(saved))) continue;
    if (saved.length !== wanted.length || [...saved].sort().join() !== [...wanted].sort().join()) continue;
    const byId = new Map(slots.map(index => [frames[index].id, frames[index]]));
    frames = frames.map((frame, index) => frame.sceneId === sceneId ? byId.get(wanted[slots.indexOf(index)])! : frame);
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
    // 9 October 2026: a scene description still exactly as an earlier bundle shipped it takes the bundle's (scene 78: the envelope,
    // not the notebook, goes on the mat). One the writer changed is kept.
    const retoldScene = (textSync.scenes as Record<string, { description?: string[] }>)[scene.id];
    if (arrived && retoldScene?.description?.includes(fieldDigest(next.description)) && next.description !== arrived.description) next = { ...next, description: arrived.description };
    const prior = restoredScenes[scene.id];
    if (restoreDefaults && prior && arrived) for (const key of ["description", "location", "title", "time", "characters"] as const) {
      if (prior[key] && fieldDigest(scene[key]) === prior[key] && JSON.stringify(next[key]) !== JSON.stringify(arrived[key])) next = { ...next, [key]: arrived[key] };
    }
    return next;
  });
  const patch: ProjectPatch = {};
  if (bundle.script !== undefined && existing.script !== bundle.script && (knownRestorationScript || onCurrentText || digest(existing.script) === directorSync.scriptHash || scene6Sync.priorScriptHashes.includes(digest(existing.script)))) patch.script = bundle.script;
  if (frames.length !== existing.frames.length || frames.some((frame, index) => frame !== existing.frames[index])) patch.frames = frames;
  if (scenes.length !== existing.scenes.length || scenes.some((scene, index) => scene !== existing.scenes[index])) patch.scenes = scenes;
  return Object.keys(patch).length ? patch : null;
}

/** Sound-effect entries carry an id that starts `sfx-` (scripts/hangar/sound.mjs, scripts/rapture/sound.mjs); dialogue ids never do. */
const isEffect = (clip: FrameAudio) => clip.id.startsWith("sfx-");

/**
 * 8 October 2026: recorded dialogue and sound effects reaching a saved workspace (the Rapture series: episode one's two verbatim boards, then
 * the twelve boards of episodes two to five, then its sound effects; the cold open's voices and effects). A frame that has no audio yet takes
 * the bundle's and is lengthened, never shortened, so the takes fit. A frame that has dialogue but none of the bundle's `sfx-` entries takes
 * those, sorted in by offset, and keeps its own length (effects never lengthen a frame). A frame the bundle has no audio for, a frame whose
 * audio the writer has already got effects in, and everything else the writer changed are left alone, and a second read changes nothing.
 */
export function bundledAudioUpdates(existing: FilmProject, bundle: Pick<FilmProject, "frames">): ProjectPatch | null {
  const bundled = new Map(bundle.frames.map(frame => [frame.id, frame]));
  let changed = false;
  const frames = existing.frames.map(frame => {
    const arrived = bundled.get(frame.id);
    if (!arrived?.audio?.length) return frame;
    if (!frame.audio?.length) {
      changed = true;
      return { ...frame, audio: arrived.audio, duration: Math.max(frame.duration, arrived.duration) };
    }
    const effects = arrived.audio.filter(isEffect);
    if (!effects.length || frame.audio.some(isEffect)) return frame;
    changed = true;
    return { ...frame, audio: [...frame.audio, ...effects].sort((a, b) => a.offset - b.offset) };
  });
  return changed ? { frames } : null;
}

/**
 * 8 October 2026 (night): pictures reaching a saved workspace. A saved frame that is still a "keyframe missing" card, whose bundled
 * counterpart now has a picture (a study laid on the shot: the St Jude's, mugging and washing-up cards took existing studies), takes the
 * picture, loses the suffix on its title and takes the bundle's status and notes, unless the writer has rewritten the card: its saved notes
 * (the placeholder paragraph aside) must still begin the way the bundle's do. Everything else is left alone and a second read changes nothing.
 */
export function bundledPictureUpdates(existing: FilmProject, bundle: Pick<FilmProject, "frames">): ProjectPatch | null {
  const bundled = new Map(bundle.frames.map(frame => [frame.id, frame]));
  let changed = false;
  const frames = existing.frames.map(frame => {
    const arrived = bundled.get(frame.id);
    if (!arrived?.image || !isAwaitingKeyframe(frame)) return frame;
    changed = true;
    const rest = frame.notes.replace(/^KEYFRAME MISSING[^\n]*\n\n/, "");
    const unedited = rest.slice(0, 60) === arrived.notes.slice(0, 60);
    return {
      ...frame, image: arrived.image, title: frame.title.replace(/\s*\(keyframe missing\)$/, ""),
      status: frame.status === "Needs review" ? arrived.status : frame.status, notes: unedited ? arrived.notes : frame.notes,
    };
  });
  return changed ? { frames } : null;
}
