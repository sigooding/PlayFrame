/**
 * Audio helpers for the cutout system.
 *
 *  - Synthesize a short "demo voice" waveform so we can exercise lip-sync without
 *    bundling any copyrighted audio.
 *  - Load audio files into AudioBuffer (for auto-analysis).
 *  - A simple playback wrapper that exposes currentTime authoritatively.
 */

import { autoLipSyncFromBuffer, type DEFAULT_PHONEME_MAP } from "./runtime";
import type { LipSyncTrack } from "./types";

/**
 * Synthesize a short test signal that roughly mimics speech amplitude envelopes:
 *  a few voiced "syllables" at varying pitch + volume.
 * This is NOT a TTS — it is test stimulus for lip-sync timing.
 */
export function synthesizeDemoVoice(
  ctx: AudioContext,
  opts: { duration?: number } = {},
): AudioBuffer {
  const duration = opts.duration ?? 2.4;
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(1, Math.floor(sr * duration), sr);
  const data = buf.getChannelData(0);
  // Syllables as (start, end, pitch, loudness)
  const syllables: [number, number, number, number][] = [
    [0.00, 0.28, 140, 0.55],
    [0.30, 0.58, 160, 0.50],
    [0.62, 0.90, 110, 0.60],
    [0.95, 1.20, 200, 0.45],
    [1.25, 1.55, 150, 0.55],
    [1.60, 1.95, 180, 0.50],
    [2.00, 2.30, 120, 0.40],
  ];
  for (const [s, e, f0, amp] of syllables) {
    const i0 = Math.floor(s * sr), i1 = Math.floor(e * sr);
    for (let i = i0; i < i1 && i < data.length; i++) {
      const t = (i - i0) / sr;
      const len = e - s;
      // Quick attack, gentle decay envelope per syllable
      const env = Math.sin(Math.PI * Math.min(1, t / len)) * (0.85 + 0.15 * Math.sin(2 * Math.PI * 4 * t));
      // Glottal-ish signal: harmonics of f0
      const phase = 2 * Math.PI * f0 * t;
      let sample = 0;
      sample += Math.sin(phase) * 0.5;
      sample += Math.sin(phase * 2) * 0.25;
      sample += Math.sin(phase * 3) * 0.12;
      // Formant-ish ripple
      sample *= (0.9 + 0.1 * Math.sin(2 * Math.PI * 12 * t));
      data[i] += sample * env * amp * 0.4;
    }
  }
  return buf;
}

/** Load an ArrayBuffer (from fetch) into an AudioBuffer. */
export async function decodeAudio(ctx: AudioContext, bytes: ArrayBuffer): Promise<AudioBuffer> {
  return await ctx.decodeAudioData(bytes.slice(0));
}

/**
 * Given an AudioBuffer, produce a LipSyncTrack with auto-generated viseme events.
 * The result is fully editable — pass it back through the editor to refine.
 */
export function autoLipSyncFromAudio(
  buffer: AudioBuffer,
  meta: { audio: string; id?: string; language?: string },
): LipSyncTrack {
  return {
    id: meta.id ?? `auto-${meta.audio}`,
    audio: meta.audio,
    duration: buffer.duration,
    source: "automatic",
    language: meta.language ?? "en",
    events: autoLipSyncFromBuffer(buffer, { language: meta.language }),
  };
}

/**
 * Parse an imported JSON lip-sync track (as described in the spec).
 * Returns a LipSyncTrack; throws on malformed input.
 */
export function parseLipSyncJson(json: unknown): LipSyncTrack {
  if (typeof json !== "object" || json === null) throw new Error("lip-sync json must be an object");
  const j = json as { audio?: unknown; duration?: unknown; events?: unknown; language?: unknown; id?: unknown; source?: unknown };
  if (typeof j.audio !== "string") throw new Error("lip-sync json missing 'audio'");
  if (!Array.isArray(j.events)) throw new Error("lip-sync json 'events' must be an array");
  const events: LipSyncTrack["events"] = [];
  for (const ev of j.events) {
    if (typeof ev !== "object" || ev === null) throw new Error("lip-sync event must be object");
    const e = ev as { time?: unknown; viseme?: unknown; weight?: unknown };
    if (typeof e.time !== "number" || typeof e.viseme !== "string") throw new Error("lip-sync event needs numeric time and string viseme");
    events.push({ t: e.time, viseme: e.viseme as LipSyncTrack["events"][number]["viseme"], weight: typeof e.weight === "number" ? e.weight : undefined });
  }
  events.sort((a, b) => a.t - b.t);
  return {
    id: typeof j.id === "string" ? j.id : `imported-${j.audio}`,
    audio: j.audio,
    duration: typeof j.duration === "number" ? j.duration : (events[events.length - 1]?.t ?? 0) + 0.2,
    source: (j.source as LipSyncTrack["source"]) ?? "imported",
    language: typeof j.language === "string" ? j.language : undefined,
    events,
  };
}

/** Serialize a track to the documented JSON shape. */
export function serializeLipSyncJson(track: LipSyncTrack): string {
  return JSON.stringify({
    id: track.id,
    audio: track.audio,
    duration: track.duration,
    source: track.source,
    language: track.language,
    events: track.events.map(e => ({ time: e.t, viseme: e.viseme, weight: e.weight })),
  }, null, 2);
}

/**
 * An AudioPlayback shim that wraps an AudioBufferSourceNode. The AudioContext
 * clock is authoritative; we expose currentTime and expose play/pause/stop/seek
 * used by the CutoutCharacter.
 */
export class BufferPlayback {
  private ctx: AudioContext;
  private buffer: AudioBuffer;
  private source: AudioBufferSourceNode | null = null;
  private gain: GainNode;
  private startedAt = 0;
  private pausedAt = 0;
  private _playing = false;
  public onEnded?: () => void;

  constructor(ctx: AudioContext, buffer: AudioBuffer, opts: { volume?: number } = {}) {
    this.ctx = ctx;
    this.buffer = buffer;
    this.gain = ctx.createGain();
    this.gain.gain.value = opts.volume ?? 0.8;
    this.gain.connect(ctx.destination);
  }

  get playing() { return this._playing; }
  get duration() { return this.buffer.duration; }
  get currentTime() {
    if (!this._playing) return this.pausedAt;
    const t = this.ctx.currentTime - this.startedAt + this.pausedAt;
    return Math.max(0, Math.min(t, this.duration));
  }
  set currentTime(t: number) { this.seek(t); }

  play(offset?: number) {
    if (this._playing) return;
    const startOffset = offset ?? this.pausedAt;
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gain);
    this.source.onended = () => {
      if (this._playing) { this._playing = false; this.pausedAt = this.duration; this.onEnded?.(); }
    };
    this.source.start(0, Math.max(0, Math.min(startOffset, this.duration)));
    this.startedAt = this.ctx.currentTime;
    this.pausedAt = startOffset;
    this._playing = true;
  }
  pause() {
    if (!this._playing || !this.source) return;
    this.pausedAt = this.currentTime;
    try { this.source.stop(); } catch {}
    this.source.disconnect();
    this.source = null;
    this._playing = false;
  }
  stop() {
    this.pause();
    this.pausedAt = 0;
  }
  seek(t: number) {
    const wasPlaying = this._playing;
    if (wasPlaying) this.pause();
    this.pausedAt = Math.max(0, Math.min(t, this.duration));
    if (wasPlaying) this.play(this.pausedAt);
  }
}
