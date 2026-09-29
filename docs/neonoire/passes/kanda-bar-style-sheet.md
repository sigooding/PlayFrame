# NEONOIRE — Okada's Kanda bar, location sheet

29 September 2026. This is the **small Kanda bar**, not the hotel lounge bar. Until now it had a scene-2 key (`keys/03-the-bar.jpg`) and separate night/day shot masters, but no dedicated set sheet. `public/images/neonoire/sheets/kanda-bar.jpg` is the 1920×1080 location reference. It is a deterministic 2×2 montage of existing boarded frames, not a new rendering or a retake:

| Panel | Boarded source | What it fixes |
| --- | --- | --- |
| Upper left | `s2/19-the-bar.jpg` | Room before the killing: left shelf/counter, red-brown stools, rear CRT on, rain at right window. |
| Upper right | `s2/26-the-variety-show.jpg` | Same angle after the killing: tipped stool; CRT remains on with the same variety show. |
| Lower left | `s8/160-were-closed.jpg` | Flat grey day, chairs/stools up, CRT off, new black cleanup mat. |
| Lower right | `s81/100-the-bar-in-daylight.jpg` | The same set across the counter in day; counter and cash drawer geography, Okada and Jack. |

Build recipe (ImageMagick), each source scaled to a 960×540 cell, **no crops or new scenery**:

```bash
convert \( \( public/images/neonoire/s2/19-the-bar.jpg -resize 960x540! \) \( public/images/neonoire/s2/26-the-variety-show.jpg -resize 960x540! \) +append \) \( \( public/images/neonoire/s8/160-were-closed.jpg -resize 960x540! \) \( public/images/neonoire/s81/100-the-bar-in-daylight.jpg -resize 960x540! \) +append \) -append -strip -interlace Plane -quality 86 public/images/neonoire/sheets/kanda-bar.jpg
```

**Set lock:** six round red-brown stools along a worn counter on camera left; amber bottle shelves and handwritten menu strips behind it; rain window / door on camera right; a small CRT high at the back; crates and a cramped hiding space behind the far end of the counter. No mirror-flipped room, huge lounge, neon wash, pristine cocktail-bar furniture or invented window. Camera low, level, patient. `scripts/neonoire/bar-look.mjs` is the shared prompt lock for **2, 8, 27A, 64 and 81**. The bar is not the hotel lounge (66, 72, 75). Okada is separately locked to `sheets/okada.jpg`; the sheet does not replace a cast or prop reference.

**Time-of-day / story states:** scene 2 is the only visit with the variety-show CRT **on**, no cleanup mat, stools down. After the murder, the day visits (8, 27A, 81) have the CRT **off** (black, not static), grey window light, chairs up and a black rubber mat. Scene 64 is night *after* cleanup: mat and cash drawer remain, CRT **off**. These state changes are deliberate, not a different set.

**Review boundary:** This establishes a common reference for subsequent images, the portable project's shot notes and a Mood boards card. It does **not** assert that all existing keyframes are identical or that they were regenerated. Some close floor/reverse angles differ in materials and scale from the aisle masters; use the room layout on this sheet as the tie-breaker if any such shot is retaken. All sources and the sheet are AI-generated draft studies, not approved coverage. The screenplay is unchanged.
