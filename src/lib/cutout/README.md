# Cutout Character System

A reusable 2D cutout/paper-style character animation system, in the spirit of
shows/games that animate hierarchical body parts with stepped keyframes,
directional poses, independent facial layers, and audio-synchronized lip-sync.

**No copyrighted artwork, audio, characters, or extracted assets are used.** The
bundled `buildPlaceholderRig()` draws an original stick figure procedurally at
runtime so developers can iterate on the *technique* without any external art.

## Layout

| File | What it does |
|------|--------------|
| `types.ts` | All serializable data types: `CutoutRig`, `CutoutPart`, `CutoutClip`, `LipSyncTrack`, `AnimState`, `Viseme`, etc. |
| `runtime.ts` | Pure math/evaluation: keyframe interpolation (step/linear/ease*), layer composition, hierarchy resolution, velocity→facing, viseme lookup, auto-analysis envelope, default phoneme→viseme map. |
| `render.ts` | Canvas2D renderer with procedural fallback art for sprite keys the game hasn't supplied. |
| `character.ts` | `CutoutCharacter` runtime controller: state machine, per-layer clocks, gameplay-input → pose, audio-ts-driven lip-sync. |
| `walk.ts` | Generic 4-pose walk/run generator, plus idle/talk/blink clip builders. |
| `audio.ts` | Synthetic demo voice, audio decode, automatic lip-sync from `AudioBuffer`, JSON parse/serialize for imported lip-sync, `BufferPlayback` adapter. |
| `placeholder.ts` | Original placeholder rig + default clip set + demo lip-sync track. |

The interactive editor/sandbox lives at `/cutout`
(`src/app/cutout/page.tsx` and `src/components/cutout/*`).

## How to create a cutout character

1. Define a `CutoutRig` (JSON-serializable). Each part has `parentId`, local
   `position`/`rotation`/`scale`, a `pivot` (origin within its own sprite),
   `order` for draw sorting, and optional `sprite`, `flipX/Y`, `visible`.
2. Add sprite entries to `rig.spriteSheet` mapping sprite keys to image URLs.
   Any sprite that's missing falls back to simple procedural drawing.
3. Declare `facialSlots` (mouth, eyes, brows) so the lip/face layers know
   which parts to drive.
4. Build or load `CutoutClip`s (see next section).
5. Construct a `new CutoutCharacter({ rig, clips })` and call
   `character.tick(dt, { velocity, voiceOver })` each frame.

The bundled `buildPlaceholderRig()` is a working reference you can duplicate
and re-skin by swapping sprite keys / adding parts.

## How to create a walk animation

Either author keyframes by hand, or use the parameterised generator:

```ts
import { buildWalkClip } from "@/lib/cutout";
const walk = buildWalkClip({
  id: "walk", name: "Walk",
  cycleHz: 1.8,       // cycles per second at speed=1
  visualFps: 12,      // stepped animation FPS (chunky paper look)
  legSwing: 22,       // degrees
  armSwing: 18,
  bodyBob: 3,         // pixels
  headNod: 1.5,
  parts: {
    body: "torso", head: "head",
    leftLeg: "l_leg", rightLeg: "r_leg",
    leftArm: "l_arm", rightArm: "r_arm",
  },
  interpolation: "step", // "linear" | "easeIn" | "easeOut" | "easeInOut"
});
character.addClip(walk);
```

For direction-specific variants (e.g. a walk drawn explicitly for the back),
add a second clip with id `"walk:back"` — the engine picks it up automatically.

## How to attach voice-over

Provide a `LipSyncTrack` + an `AudioPlayback` each tick:

```ts
character.tick(dt, {
  velocity: playerVel,
  voiceOver: {
    track: myLipTrack,
    playback: {
      currentTime: audioEl.currentTime,
      playing: !audioEl.paused,
      duration: audioEl.duration,
    },
  },
});
```

Because the **audio element's `currentTime` is authoritative**, pause/resume/seek
all stay in sync without rebuilding the timeline. An `HTMLAudioElement` works,
as does the included `BufferPlayback` for `AudioBuffer` sources.

## How to generate / import / edit lip-sync

* **Automatic** — pass an `AudioBuffer` to `autoLipSyncFromAudio()` to produce
  an editable track using amplitude-envelope analysis. Cache the result; do not
  call this every frame.
* **Imported** — load a JSON document in the documented shape and pass it
  through `parseLipSyncJson()`:
  ```json
  { "audio": "dialogue_001.wav", "duration": 3.2, "events": [
    { "time": 0.00, "viseme": "neutral" },
    { "time": 0.08, "viseme": "closed" } ]}
  ```
* **Manual** — add or mutate events directly on the `events` array. The
  `/cutout` studio page has a scrubbable timeline (drag to move, click to
  cycle viseme, double-click to delete, viseme paint buttons at the playhead).
* **Serialize** with `serializeLipSyncJson(track)` to round-trip.

Viseme set: `neutral, closed, open, wide, round, teeth, FV, narrow`. Phoneme→
viseme mapping is data (`DEFAULT_PHONEME_MAP`) and can be replaced per language.

## Layers

Clips live on one of four layers. Higher layers override only the channels they
keyframe:

| Layer | Purpose |
|-------|---------|
| `base` | Locomotion & pose (idle/walk/run) |
| `body` | Arm gestures, head motion during talk |
| `face` | Blinks, eye darts, expression |
| `lip`  | Mouth shapes — overridden by active voice-over track |

## Performance

- Clips are sampled with quantized time according to `visualFps`, so 12 FPS
  animation costs exactly 12 pose-changes per second.
- Lip-sync is resolved with a single linear scan over sorted events using the
  audio clock — no per-frame audio analysis.
- Rigs, clips, sprite sheets and lip-sync tracks are plain JSON objects and
  can be freely reused across characters.
- The renderer is a single Canvas2D pass per character; many characters can
  share the same canvas.

## Testing

Visit `/cutout` for an interactive sandbox that exercises:

- idle / walk / run / talk / walk+talk / run+talk
- keyboard driving (WASD, Shift to run) → velocity-driven state
- direction picker (front/back/left/right; auto diagonals)
- visual-FPS slider (2–30) to demonstrate stepped vs smooth
- voice-over with play/pause/stop/seek/scrub
- manual viseme painting on the timeline
- one-click auto-analysis of the audio buffer
- debug overlay (current state, facing, viseme, pivots)
