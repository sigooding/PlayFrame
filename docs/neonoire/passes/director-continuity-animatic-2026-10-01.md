# Nobody's Witness — selected main shots, drawer/run corrections and MP4 export

**Director instruction, 1 October 2026:** the images created in the preceding delivery are the main shots, with no further review requested. They now have **Ready** status, not Draft/Needs review. The corrected sequence below is also selected as main coverage. Historical evaluations remain archived, not actionable flags. The separate 16 older rewrite pins are not changed by this instruction.

## Main images and replacements

The preceding **298, 299, 300, 302, 310, 311, 313, 314, 320** are Ready/main images. Their active production notes have no pending-approval or full-size-review warnings.

Seven fresh replacement JPEGs are installed at the original 1920×1080 paths:

| Scene | Stable asset / frame ID suffix | Main image |
| --- | --- | --- |
| 7 | 64 | `s7/64-the-bottom-drawer.jpg` — attached deep lowest drawer; two upper drawers closed |
| 7 | 65 | `s7/65-the-evidence-bag.jpg` — brown purse and torn coiled strap together inside one sealed clear bag, inside the drawer |
| 7 | 67 | `s7/67-drawer-closed.jpg` — all drawers closed; evidence hidden |
| 73 | 69 | `s73/69-vera-runs.jpg` — hotel behind her, running right |
| 73 | 70 | `s73/70-not-elegantly-badly.jpg` — approaching the machine, still ahead on the right |
| 73 | 71 | `s73/71-the-machine-glows.jpg` — clearly beyond it, machine behind on the left |
| 75 | 80 | `s75/80-the-machine-waits.jpg` — empty machine with the onward route extending right |

The **73/72 one-shoe exit and 75/77 matching shoe still are retained** as the selected main images. They preserve the established RIGHT bare / LEFT shoe state and matched puddle. The new candidates for those two images were not installed: the proposed exit reversed the shoe side, and the proposed pillow shot read as daylight. Ten generation calls were used, including the corrective 64; the generation limit was reached. No new generation/review request remains for the selected images.

The three initial drawer shots used Ishida's sheets (65 has no cast); the three new run shots used Vera's face sheet; the empty machine is text-only. The 64 corrective edit used the two freshly generated drawer/evidence images. No old canonical frame was cropped into a replacement. Raw candidates remain in ignored `artifacts/director-corrections/`.

## Authorised screenplay clarification

Only four action sentences changed, at the director's explicit permission:

- **7:** the two drawers above the bottom drawer stay closed; the purse and torn strap are explicitly sealed together inside the drawer.
- **73 (the running approach before 75's returns):** she keeps going after the vending machine, which falls behind her; the crossing is just beyond it.

The run now has a readable progression rather than alternating facing directions around one machine. Scene 75 still contains no people; it is not another lap of Vera's run. No dialogue, voice file, score cue, scene number, shot identity or filename changed. Generated screenplay pages and the bundle reflect the source Fountain. Bible Part 9 item 11 records the change.

Saved default workspaces receive the authorised script clarification and main-image notes/status updates. Checksum guards preserve independently edited scripts/descriptions/notes and custom images; within-scene edits and deliberate blanks are preserved.

## Animatic playback export

**Export → Animatic playback → Render animatic MP4 → Download MP4.**

- Whole project, one scene or scene range (including inserted scene labels).
- Full HD 1080p or faster 720p, 24 fps.
- Match storyboard holds by default; optional tight timing.
- Recorded dialogue on its offsets, optional subtitles and configured score.
- Real asynchronous FFmpeg rendering with progress, cancellation, resumable dialog status and download.
- Current saved project snapshot, not a stale bundled project; manual within-scene order retained.
- **Static means static.** The old renderer matched "tracking" inside "no tracking" prose and alternated pan directions. It no longer infers motion from prose; optional CLI `--camera` only simulates an explicitly moving shot.
- Uploads are materialised inside the export's private media directory; remote images must be uploaded before MP4 rendering. Paths are confined to media folders and caller-supplied commands/filenames are rejected.

CLI remains available:

```bash
npm run animatic:neonoire -- --scene 73 --hold --no-camera --no-subs --no-music
npm run animatic:neonoire -- --from 73 --to 75 --resolution 720p --hold --no-camera
```

Requires FFmpeg (`FFMPEG=/path/to/ffmpeg` or PATH) and a persistent Node server with writable local export storage, not a short-lived serverless runtime. MP4s, snapshots and work files are ignored under `exports/animatics/` or `exports/neonoire/`. Temporary segments/upload copies are removed after rendering. No NPM dependencies or voice credentials were added to the project.

## Verification

- `verify:neonoire`: source pages, shot identities/order, all 297 images, 18 selected Ready/main images, 7 fresh replacements and 331 existing dialogue clips pass.
- `verify:shot-order`: labels, imports, migration safety, real rendered views and exports pass.
- `verify:animatic`: options, bounded scope, main-shot approval, static-camera behaviour, CLI/app order and protected script updates pass.
- `verify:animatic:browser`: real desktop/mobile export, progress, MP4 download/header/container, reopening, scene range, cancellation, cross-project denial, unsafe options and uploaded-image rendering pass.
- CLI scene 7: 6 shots / 42 seconds, 720p MP4; forward run: 4 shots / 44 seconds, 1080p MP4. No artificial camera movement. A combined 1080p demonstration (`exports/neonoire/nobodys-witness-corrected-scenes.mp4`) contains scenes 7, 73 and 75: 16 shots / 140 seconds.
- `verify:rapture`: unrelated series still passes; 903/903 assets present.

- Production `npm run build` and TypeScript pass. ESLint: zero errors, the 21 existing img performance warnings only.
- Both `verify:animatic:browser` and `verify:shot-order:browser` pass on the live app; MP4 export also passes against the production build.
- `verify:features:live`: prompt/style/undo/scene-map suites and HTTP screenplay rendering pass.
- A real voiced MP4 with timed burned-in subtitles renders successfully; the uploaded one-second silent MP4 also passes (the legacy silent loudness-normalisation NaN bug is fixed).
- Decoded static holds differ only by normal lossy codec noise, with no translation/zoom.
- `git diff --check` is clean; only the four authorised Fountain action sentences changed, and audio/package-lock are untouched.

The production preview is live on port 3000 with FFmpeg configured.
