# The TVs are never static — director's rule (26 September 2026)

Director's note, verbatim: *"there should alway be sometghing on tv never just static."*

Interpretation of record: every **switched-on** screen in every installed keyframe carries real
broadcast content — the channel already established for that room. `Neonoire (3).fountain` is never
edited, so where the draft writes "static" the **page keeps its words** and the **frame shows a
programme**; the override lives in the board NOTEs, this ledger, and craft rule 12 in `handoff.md`.
Draft-explicit **OFF** sets stay dark, because *off is not static*: scene 8 (midday bar, CRT dark)
and scene 64 (late Okada, CRT off).

## Audit method

Every fountain line naming a TV/CRT/static was mapped to its scene, then every installed frame with
a screen was reviewed full-size and in crop montages (`artifacts/tv*.jpg` in the working session).
Screens already carrying content were left alone.

## Frames fixed (composite, zero regenerations)

Each fix pastes a screen cropped from a good frame into the measured CRT rectangle, slight blur and
lift, then re-saves 1920×1080 q90. No frame was regenerated, so no character or set drift was
risked.

| Frame | Shot | Scene | Draft says | Frame now shows | Content source |
|---|---|---|---|---|---|
| `s2/20-the-journalist.jpg` | 20 | 2 | variety show | variety show (was pale blank glow) | `s2/26` CRT |
| `s2/21-mara-bursts-in.jpg` | 21 | 2 | variety show | variety show (was pale blank glow) | `s2/26` CRT |
| `s2/22-not-his-business.jpg` | 22 | 2 | variety show | variety show (was pale blank glow) | `s2/26` CRT |
| `s18/189-after-the-last-train.jpg` | 191 | 18 | "static" | muted B&W samurai film, office channel | `s10/166` CRT |
| `s29/204-the-tea-she-does-not-want-to-pour.jpg` | 206 | 29 | TV sound off | muted daytime variety audience | `s2/26` CRT, desaturated |
| `s45/178-thank-you-very-much.jpg` | 180 | 45 | "blue, flickering" | inn baseball channel (was dark CRT) | `s35/207` CRT |
| `s75/81-static-in-a-window.jpg` | 83 | 75 | "static" | cheerful late-night variety audience | `s2/26` CRT |
| `s77/85-the-desk-lamp.jpg` | 87 | 77 | "static" | muted B&W samurai film, office channel | `s10/166` CRT |

## Frames audited and left as-is (already carrying content)

`s2/19`, `s2/26` (variety), `s4/33`, `s4/40` (weather announcer), `s10/164`, `s10/166` (samurai),
`s16/186` (family TV), `s32` baseball lobby (`s35/207`), `s69/236`, `s82/104` (newsroom three
channels), `s97/146` (ceremony screen).

## Left OFF by the draft (off ≠ static)

Scene 8 midday bar CRT dark; scene 64 `s64/231-the-last-okada.jpg` CRT off. Both stay dark on the
board and in the frames.

## Locks

- Board NOTEs on shots 20, 21, 22, 191, 206, 180, 83, 87 carry the phrase **"never static"**;
  `scripts/verify-neonoire.mjs` asserts it for shots 20, 191, 206, 180, 83, 87.
- `handoff.md` craft rule 12 states the rule and the composite fix method for the next AI.
