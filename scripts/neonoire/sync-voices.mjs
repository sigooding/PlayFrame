// Writes src/lib/neonoire-voice-sync.json: the fingerprints that let a saved workspace still holding the recorded dialogue of a
// bundled frame exactly as an earlier bundle shipped it take the new dialogue (new takes, replaced takes, lines moved to another
// frame, offsets pushed along) without touching a frame whose dialogue the writer has edited.
//
//   git show <commit before the voice pass>:public/projects/neonoire-opening.json > /tmp/prior.json
//   node scripts/neonoire/sync-voices.mjs /tmp/prior.json
//
// A frame that had no dialogue at all needs no fingerprint: bundle-refresh already gives it the new dialogue. The frames that did are
// recorded here with the digest of the audio they carried. The prior audio and duration of every changed frame, voiced before or not, are also written to
// docs/neonoire/baseline/voice-pre-audit-2026-10-07.json, which scripts/verify-revision-restoration.mjs replays.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const digest = text => createHash("sha256").update(text).digest("hex");
const fieldDigest = value => digest(JSON.stringify(value ?? null));
const prior = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
const next = JSON.parse(readFileSync(resolve(root, "public/projects/neonoire-opening.json"), "utf8"));
const now = new Map(next.frames.map(frame => [frame.id, frame]));
// Merge with what earlier passes recorded: a frame changed in two passes keeps both digests (a workspace may hold either version),
// and its baseline stays the oldest one.
const syncFile = resolve(root, "src/lib/neonoire-voice-sync.json"), baselineFile = resolve(root, "docs/neonoire/baseline/voice-pre-audit-2026-10-07.json");
const earlier = existsSync(syncFile) ? JSON.parse(readFileSync(syncFile, "utf8")) : { frames: {} };
const earlierBaseline = existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, "utf8")) : { frames: {} };
const frames = { ...earlier.frames }, baseline = { ...earlierBaseline.frames };
for (const old of prior.frames) {
  const frame = now.get(old.id);
  if (!frame) continue;
  if (JSON.stringify(old.audio ?? null) === JSON.stringify(frame.audio ?? null) && old.duration === frame.duration) continue;
  baseline[old.id] ??= { ...(old.audio?.length ? { audio: old.audio } : {}), duration: old.duration };
  if (old.audio?.length) {
    const known = [].concat(frames[old.id]?.audio ?? []), digest = fieldDigest(old.audio);
    frames[old.id] = { audio: known.includes(digest) ? frames[old.id].audio : known.length ? [...known, digest] : digest };
  }
}
const arrivals = next.frames.filter(frame => frame.audio?.length && !prior.frames.find(old => old.id === frame.id)?.audio?.length).map(frame => frame.id);
writeFileSync(resolve(root, "src/lib/neonoire-voice-sync.json"), JSON.stringify({
  note: "Recorded dialogue of 7 October 2026 (the 160 lines the games read with text-to-speech). frames holds the digest of the audio each already-voiced bundle frame carried before; bundle-refresh replaces a frame's audio (and lengthens its duration to fit) only while the saved audio still matches. Frames that had no dialogue are filled by the plain rule.",
  frames,
}, null, 2) + "\n");
writeFileSync(resolve(root, "docs/neonoire/baseline/voice-pre-audit-2026-10-07.json"), JSON.stringify({
  note: "The recorded dialogue (audio, absent where the frame was silent) and duration of the bundle frames the 7 October 2026 voice pass changed; replayed by scripts/verify-revision-restoration.mjs.",
  frames: baseline,
}) + "\n");
console.log(`${Object.keys(frames).length} voiced frames changed, ${arrivals.length} frames gained their first dialogue`);
