# PlayFrame

For any NEONOIRE screenplay or storyboard work, read `docs/neonoire/story-bible.md` first (story bible and decision log), then `docs/neonoire/handoff.md`.

`docs/neonoire/baseline/Neonoire_Draft1_2026-09-25.fountain` is Draft 1 as originally written. Diff it against `Neonoire (3).fountain`: any difference not listed in the bible's Part 9 was changed in PlayFrame.

Recorded dialogue and voices: `docs/neonoire/voice/README.md` (voices file, manifest, ingest and animatic scripts). Keep the script unchanged for voice work.

## Latest correction — 1 October 2026: full-page audit and restored 99A

Prior image/export work is committed as `8bfa455`. The complete pre-revision 106-scene source is preserved in `docs/neonoire/baseline/Neonoire_PreRevision_2026-09-29.fountain`; the shipped pre-restoration source is `Neonoire_PreRestoration_2026-10-01.fountain`. Read [the full-page audit](docs/neonoire/passes/revision-restoration-2026-10-01.md). **299/299 images across 102 scenes**: original demolition cards 158/159 are restored inside 99A before the dissolve to 305/306/307, never a revived separate 99. Kaneko's six old stools are explicit before the plaza; the introductions, 25 bonding exchange, 94 tea line and 98 title card are recovered. All rooftop text and the 91 train survive; 85/87/91/92 are unchanged, 86/88/90 add-only.

`verify:revision:neonoire` guards the complete pages and safe saved-template refresh. Three existing takes from 13 are re-pinned to 25; one now-false father recollection is archived, not erased. New corrected 25 speech and restored 94 tea line are unrecorded; no replacement voices were generated. The selected main-image approvals remain intact. Older draft counts/retirement notes below are historical.

## Latest session — 1 October 2026: director-selected main images and animatic export

The director selected the final nine and the corrected drawer/run sequence as **Ready/main images, with no review queue**. Seven replacements installed (7/64,65,67; 73/69,70,71; 75/80). Retain the matching one-shoe exit/puddle pair, not the rejected new shoe studies. Only the explicitly authorised drawer/forward-route sentences changed in the Fountain; dialogue and score are unchanged. See bible Part 9 item 11 and [current delivery](docs/neonoire/passes/director-continuity-animatic-2026-10-01.md).

The app now exports real MP4s through Export → Animatic playback, using the existing FFmpeg script with saved snapshots, scene/shot order, static cameras, timing/audio controls and progress/download/cancellation. `verify:animatic` and `verify:animatic:browser` cover it. Set `FFMPEG` or install FFmpeg; outputs in ignored `exports/animatics/`. Previous draft wording below is superseded for selected main images; the older rewrite pins are separate.

## Latest session — 1 October 2026: final nine images and screenplay order

**Nobody's Witness** has **297/297 shot images across 102 active scenes**, zero missing-image cards. The final nine (298/299/300/302/310/311/313/314/320) are fresh **draft** studies; 311 used a corrective retake. The **16 older rewrite retakes remain Needs review**. Read [the final pass and its full-size continuity caveats](docs/neonoire/passes/remaining-boards-final-2026-10-01.md) and the updated bible/handoff before more generation; historical missing/master queues below are superseded.

Storyboard, shot list, player, shared view, prompt batches and CSV/print are now in screenplay scene order, with quoted-beat coverage interleaved by the builder. Original shot numbers/scene insert labels/IDs/filenames remain fixed. Saved reads fill untouched marked blanks and migrate only exact legacy default ordering, preserving writer edits and intentional blanks. Cross-scene reordering is blocked; edits inside a scene persist. New/duplicate shots get distinct production numbers. The screenplay and voice files were not changed.

`npm run verify:shot-order` is the ordering/import/migration/rendered-view/export regression. The rebuilt bundle and all feature/assets/type checks pass. `verify:shot-order:browser` and `verify:features:live` also pass on the production preview (port 3000), including real desktop/mobile interactions; no screenplay or audio changes.
