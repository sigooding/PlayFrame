// The treatment for lines that are heard through something: a phone, a television, an old cassette.
// The manifest's `fx` field (phone | tv | tape | radio, set with `voice-ingest --fx`) names the treatment; the take on disk stays clean.
//
//   animatic.mjs     applies the chain while it mixes the cut (this is what the animatic has always done)
//   the games        the importers bake it into their own copy of the take with bakeFx(), so every engine plays the filtered line
//                    (nobodys-witness: tools/import-playframe.mjs, which scarlett-witness copies its voices from)
//
// The real treatment is done in the editor; this is a fair sketch of it. Chains are ffmpeg audio filters.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const FX = {
  phone: "highpass=f=400,lowpass=f=3000,acompressor=threshold=0.04:ratio=6,volume=1.6",
  tv: "highpass=f=300,lowpass=f=5000,aecho=0.8:0.6:35:0.25,volume=1.2",
  tape: "highpass=f=350,lowpass=f=4200,vibrato=f=5:d=0.03,volume=1.4",
  // a 1944 cockpit radio: narrow, compressed, a little rough (the Hangar cold open's Red Leader and Red Two)
  radio: "highpass=f=450,lowpass=f=2800,acompressor=threshold=0.05:ratio=8,volume=1.7",
};

const meanVolume = (ffmpeg, file) => {
  const out = spawnSync(ffmpeg, ["-hide_banner", "-i", file, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" }).stderr || "";
  const m = /mean_volume: (-?[\d.]+) dB/.exec(out);
  if (!m) throw new Error(`could not measure ${file}`);
  return Number(m[1]);
};

/**
 * Writes `dest` (mono mp3) as `src` heard through `fx`. The chains thin the voice and take energy with it (a phone line comes out
 * 6 dB down, a television 9), so the filtered line is brought back to the clean take's mean level, then limited just under full
 * scale: the treatment changes the sound of the voice, not how loud it plays against the others.
 */
export function bakeFx(ffmpeg, src, dest, fx) {
  if (!FX[fx]) throw new Error(`unknown fx "${fx}" (phone, tv, tape or radio)`);
  const dir = mkdtempSync(join(tmpdir(), "voicefx-"));
  try {
    const filtered = join(dir, "filtered.wav");
    const chain = `aresample=44100,aformat=channel_layouts=mono,${FX[fx]}`;
    execFileSync(ffmpeg, ["-y", "-v", "error", "-i", src, "-af", chain, filtered], { stdio: ["ignore", "ignore", "inherit"] });
    const gain = Math.max(-12, Math.min(14, meanVolume(ffmpeg, src) - meanVolume(ffmpeg, filtered)));
    execFileSync(ffmpeg, ["-y", "-v", "error", "-i", filtered, "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=0.89:level=0`, "-ar", "44100", "-ac", "1", "-b:a", "128k", dest],
      { stdio: ["ignore", "ignore", "inherit"] });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
