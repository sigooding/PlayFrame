# NEONOIRE — the rewrite slots, pass four: the last frame, and the geometry written down (3 October 2026)

**One generation, one frame installed, one study thrown away — and the film is complete.** 343 *Forty metres back*
was the last placeholder on the board; its first study had already been refused in pass three for contradicting the
scene's geometry, so this pass generated the frame against the corrected brief and the board now reads
**322 of 322 keyframes on disk, zero placeholder cards**.

## Installed

| # | file | what the study is now | why the brief was changed first |
| --- | --- | --- | --- |
| 343 | `s14a/343-forty-metres-back.jpg` | the camera **behind both cars**: the old silver-grey sedan in the near right foreground seen from its **rear**, red tail lights lit and its dipped glow thrown forward up the wet asphalt; the small boxy maroon hatchback far up the road showing only its two tail lights; the centre line, sodium lamps and shuttered low buildings either side; nobody else on the road | the first study had been taken nose-on, which is what pass three refused — see below |

## Thrown away, with the reason (nothing wrong was installed)

- **343, first study** — it put the following **silver-grey sedan nose-on to the camera** while the maroon hatchback
  ahead showed its tail lights. A car that faces us cannot be following a car that is driving away: the frame
  contradicted the whole geometry of the shot. Not installed (recorded in
  [the pass-three ledger](rewrite-slots-3-2026-10-03.md)); instead the geometry was written down on the board as a
  rule — *the camera is behind both cars, so the sedan shows its REAR, its dim nearside headlight throwing light
  forward up the road rather than at us; forty metres of shining wet asphalt separate it from the hatchback's tail
  lights; nothing else is on the road* — and the second study is exactly that.

## The decision made by scene logic (the director's standing instruction, applied)

1. **343's follower stays behind.** The shot's whole content is *following at forty metres*: the pursuer is seen from
   behind, its lamps lighting the road ahead, the followed car reduced to two red points far up the lane. The first
   study's nose-on follower inverted the scene and was left uninstalled rather than fudged.

## Unclosed caveats, carried (all in the board note)

343 the gap reads long rather than exactly forty metres · both cars' number plates are visible as small blanks and
should be suppressed before print · the dim-nearside-headlight lock cannot be judged from behind, which is also the
caveat 335 carries.

## Release semantics

343 is **`Draft`**. With the placeholder card gone, no frame in the film sits at `Needs review` for a missing image;
nothing was pinned or released, and no `RETAKE PENDING` frame is involved in this pass.

## The checks

`npm run build:neonoire` (**322/322 keyframes on disk, 0 placeholder cards**), `npm run verify:neonoire`,
`npm run verify:shot-order`, `npm run verify:revision:neonoire`, `npm run check:assets` (929 references, all present),
`npm run typecheck` and the production build all pass. `verify:neonoire` now reads **owed = [], queued = [],
delivered = 321–343 (23 IDs)** and asserts that no placeholder card is left at all; `rewrite-slots.mjs` carries the
empty queue; `plan.mjs` reads 14A as **all ten on disk**.

**Pass files:** with the queue empty, `pass-prompts.mjs` regenerates only the index — `docs/neonoire/passes/README.md`
now reads **322 of 322 keyframes on disk** — while `pass-35.md` stands, like the older pass files, as a historical
brief rather than a request to regenerate 343.

**Saved workspaces:** the placeholder note 343 was still holding at 321-of-322 entered `pendingNotesHashes` in
`src/lib/bundle-refresh.ts` (23 digests, 321–343), so a workspace left on the 2 October default receives the last
picture, its title, status and note on its untouched card — nothing else changes, and an edited card keeps its words.
`src/lib/neonoire-scene6-sync.json` was **not** regenerated: the current bundle already contains scene 14A and must
never be shipped as an intermediate.
