"""Pitch, pace, brightness and level of a speech clip, to choose between voice-design previews without listening.

  FFMPEG=/path/to/ffmpeg python3 -I scripts/rapture/voice-measure.py clip.mp3 [words]
    -> json {centroid_hz, median_hz, p10_hz, p90_hz, voiced, active_s, dur_s, level_db, wps}

median_hz is the median fundamental over voiced frames (autocorrelation, 70-420 Hz; a man in his forties sits near 90-130, a woman near 150-230);
p10_hz..p90_hz the pitch range (a narrow one is a flat, deadpan delivery); `voiced` the share of active frames that are voiced (low = breathy or
rough); centroid_hz the brightness (the median spectral centroid of the active frames: a light voice sits higher than a dark one); active_s the
time with speech energy; wps the words per second of active time when `words` is given; level_db the mean frame level of the speech (frames
within 30 dB of the peak), the recipe the NEONOIRE level checks use.
"""
import json, os, subprocess, sys
import numpy as np

FF = os.environ.get("FFMPEG", "ffmpeg")
SR = 16000


def load(path):
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<i2").astype(np.float64) / 32768.0


def analyse(path, words=None):
    x = load(path)
    dur = len(x) / SR
    win, hop = int(0.04 * SR), int(0.01 * SR)
    lo, hi = int(SR / 420), int(SR / 70)
    rms = np.array([np.sqrt(np.mean(x[i:i + win] ** 2) + 1e-12) for i in range(0, len(x) - win, hop)])
    db = 20 * np.log10(rms + 1e-9)
    peak = db.max()
    active = db > peak - 30
    f0s = []
    for k, i in enumerate(range(0, len(x) - win, hop)):
        if not active[k]:
            continue
        seg = x[i:i + win] - np.mean(x[i:i + win])
        ac = np.correlate(seg, seg, mode="full")[win - 1:]
        if ac[0] <= 0:
            continue
        ac = ac / ac[0]
        lag = lo + int(np.argmax(ac[lo:hi]))
        if ac[lag] > 0.45:
            f0s.append(SR / lag)
    f0s = np.array(f0s)
    frames = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + int(0.02 * SR)] ** 2) + 1e-12) for i in range(0, len(x) - int(0.02 * SR), int(0.02 * SR))]) + 1e-9)
    fpeak = frames.max()
    act20 = frames[frames > fpeak - 30]
    active_s = float(np.sum(db > peak - 30) * 0.01)
    # brightness: mean spectral centroid of the active frames (a light, young voice sits higher than a dark one)
    cents = []
    for k, i in enumerate(range(0, len(x) - win, hop * 3)):
        kk = i // hop
        if kk >= len(active) or not active[kk]:
            continue
        seg = x[i:i + win] * np.hanning(win)
        spec = np.abs(np.fft.rfft(seg, 1024))
        freqs = np.fft.rfftfreq(1024, 1 / SR)
        if spec.sum() > 0:
            cents.append(float((spec * freqs).sum() / spec.sum()))
    out = {
        "centroid_hz": round(float(np.median(cents)), 0) if cents else None,
        "median_hz": round(float(np.median(f0s)), 1) if len(f0s) else None,
        "p10_hz": round(float(np.percentile(f0s, 10)), 1) if len(f0s) else None,
        "p90_hz": round(float(np.percentile(f0s, 90)), 1) if len(f0s) else None,
        "voiced": round(len(f0s) / max(1, int(active.sum())), 2),
        "active_s": round(active_s, 2), "dur_s": round(dur, 2),
        "level_db": round(float(act20.mean()), 1),
    }
    if words:
        out["wps"] = round(words / max(active_s, 0.01), 2)
    return out


if __name__ == "__main__":
    print(json.dumps(analyse(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else None)))
