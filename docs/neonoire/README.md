# NEONOIRE — the final screenplay

The final feature screenplay — **100 numbered scenes** — carried into Frame as an editable
workspace, with eleven of them boarded as **84 numbered shots** — the opening seven (shots 1–68) and the film proper's centre, the Tokyo streets of scenes 73–76 (shots 69–84). The screenplay tab is
the draft itself, one page per scene; keyframes are generated **ten at a time** against two
continuity sheets, and **every image is 16:9 full-bleed (1920×1080)**.

## Where everything lives

| what | where |
| --- | --- |
| the draft (source of truth) | [`Neonoire (3).fountain`](../../Neonoire%20(3).fountain) at the repository root — the final screenplay, 100 numbered scenes (`Neonoire_Opening.fountain` is kept only as the superseded opening extract) |
| the screenplay tab, page by page | [`docs/neonoire/screenplay/`](screenplay) — the draft's own bytes under a production header, one page per numbered scene (n01–n100); every scene outside the eleven boarded ones is written, not boarded |
| the numbered shot boards | [`docs/neonoire/scenes/`](scenes) — framing, lens, cast, light, duration, keyframe filename and notes, per shot; `n01–n07` cover the opening, `n73–n76` the streets boards of the film proper |
| the keyframes | `public/images/neonoire/keys/` (the nine style keys) and `public/images/neonoire/s1 … s7/` plus `s73 … s76/` — **the film's frame rule is 16:9 (1920×1080) for every image from the final screenplay onward**; shots 1–10, scenes 4–7 and the apartment/police-station keys are already revised, while cold-open shots 11–28 and scene 3 hold legacy 2.39:1 studies marked revision-pending — plus continuity sheets in `public/images/neonoire/sheets/` |
| the workspace bundle | [`public/projects/neonoire-opening.json`](../../public/projects/neonoire-opening.json) |

## Handing the keyframes on

[`handoff.md`](handoff.md) is what another agent (or another person) needs to finish the board:
what exists, what is missing, the look, the continuity rules, where the current frames fall short,
and what must not be touched. [`passes/`](passes) holds a self-contained brief per pass — filenames,
framing, cast sheets, a ready prompt and the negative prompt for every shot still to generate,
regenerated from the board with `node scripts/neonoire/pass-prompts.mjs`.

## Commands

```bash
npm run split:neonoire      # rewrite the 100 screenplay pages from the draft
npm run build:neonoire      # rebuild the workspace bundle (also lists every keyframe still missing)
npm run verify:neonoire     # offline: bundle in step, schema, screenplay map, lenses, CSV, prompts
npm run check:assets        # every referenced picture and font is on disk
node scripts/neonoire/pass-prompts.mjs   # rewrite the remaining-keyframe briefs in docs/neonoire/passes/
```

`npm run build:neonoire -- --check` fails if the bundle has drifted from the draft, the boards or the
keyframes on disk, which is what CI runs.

## The rules the builder enforces

1. **The draft is the script.** The 100 pages must rebuild `Neonoire (3).fountain` byte for byte
   once their headers are removed; a page is regenerated, never hand-edited.
2. **The workspace script is the draft minus its scene markers.** ` #1#` … ` #100#` are the draft's own
   numbering, and removing exactly those tokens is the only change the app makes to the text —
   which is what lets each scene select its own slugline in the script. Every heading in the draft
   must carry its marker, or the build fails rather than silently drop a scene.
3. **Nothing is retyped.** Every frame's `SCRIPT:` quote has to be found in the draft, whitespace
   aside. A quote that drifts is a build failure, not a typo.
4. **Every frame declares its grammar.** Shot type, lens, camera angle, movement, lighting, cast and a
   working duration all come off the board; the app's own libraries are the only allowed values.
5. **A missing keyframe is a placeholder, not a lie.** The card holds its slot, says
   `KEYFRAME MISSING`, names the file and the pass it belongs to, and is marked **Needs review**.

## The look

Every frame is generated with the `neonoire` style defined in [`src/lib/styles.ts`](../../src/lib/styles.ts):
the style block and negative prompt are the app's **Neo-Noir Tokyo** visual library entry, while the
nine generated keys live in `public/images/neonoire/keys/`. Every scene and frame in the bundle carries
that style id, so the prompt studio writes the look into any batch generated from this project without
anyone having to paste it again.

## Passes

Keyframes are generated ten at a time, in screenplay order, with the cast sheets attached as
references. Pass 1 is shots 1–10, pass 2 is 11–20, and so on: pass 7 is 61–70 (its last four shots are scene 73), pass 8 is 71–80 and pass 9 is 81–84. Each pass is
listed at the foot of its scene's board, and every frame's notes name the pass it came from.

## Cold-open revision status

Shots **1–10 are revised**; shots **11–28 remain legacy 2.39:1 studies**, marked Needs review. Scene 3 (shots 29–32) carries the same label: from the final screenplay onward the whole film is 16:9, so those four frames are to be regenerated, not cropped. Continue from [the revision checklist](passes/cold-open-revision.md), not from the old on-disk images as if they were new masters.

## Continuity

- **Mara Voss (24)** and **Vera Voss (29)** are both American — blonde, pale blue eyes, sisters who
  can be told apart at a glance. Mara's soaked-flat hair is held back by a cheap enamel clip shaped
  like a small red bird; in the final screenplay it slides loose between the crates inside the bar
  (scene 2) and is gone from that beat on — and it ends the film in Vera's hair at Kaneko's counter.
  Sheets: `sheets/mara.jpg`, `sheets/vera.jpg`;
  the face crops (`sheets/mara-face.jpg`, `sheets/vera-face.jpg`) are attached to every generation they appear in.
- **The Young Officer (20s)** has a canonical sheet and face crop in `sheets/young-officer.jpg` and
  `sheets/young-officer-face.jpg`: neat black hair, navy police uniform, ordinary polite face. Keep
  his appearance fixed across the front-counter shots.
- **Detective Ishida (50s)** has a canonical sheet and face crop in `sheets/ishida.jpg` and
  `sheets/ishida-face.jpg`: short salt-and-pepper hair, lean build, charcoal suit, tired kindness.
  Keep his appearance fixed across the interview and detectives' room shots.
- **Jack Voss**, their father, exists only inside the framed photograph in scene 4.
- The masked men never get faces. The old man and the journalist are unnamed on purpose.
- Language: English between the sisters; everything marked *(in Japanese)* is spoken in Japanese and
  subtitled. Mara's Japanese is halting, Vera's is fluent and formal, and Ishida offers English as a
  courtesy that Vera refuses.

## What this workspace is not

The draft contains the opening scenes only. Everything after `CUT TO:` at the end of scene 7 —
who the men are, what the key opens, what happened twenty years ago — is not in the film yet, and the
workspace does not invent it.
