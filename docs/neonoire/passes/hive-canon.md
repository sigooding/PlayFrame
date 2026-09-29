# NEONOIRE — the Hive canon: one building, one look file (28 September 2026)

**Scope:** no shots generated the canon pass beyond the six canon sheets; the retakes queued as the next generation pass (thirty-four frames, one call each) have since been broken into the director's tiers — the seven wrong-building exteriors were retaken on 29 September 2026 (below), twenty-seven frames remain queued. The deliverable is [`scripts/neonoire/hive-canon-look.mjs`](../../../scripts/neonoire/hive-canon-look.mjs): the canonical geometry, the six sheet prompts with their reference chain, the shared negative prompt, the NIGHT and DAY look sections, the standing rules, and the retake queue.

**The problem.** The Hive was boarded across five sessions from five look files, and each described the building differently: s15/184 a squat 6–7-storey block on a plaza; s59/226 a tall narrow tower on a tight street; s92/135 a nine-storey slab by a viaduct pillar; s97 a five-storey block with the railway at height; s99/156 an ordinary apartment block. Inside, s55/221 drew the counter as a white-tiled corridor with the 金子 sign ON the counter, s68/235 gave the storeroom shelving and a teal doorway, and s85/119 drew the passage three abreast where the draft says single file. The draft itself contradicts itself: "eleven storeys", yet scene 90 jumps from the roof onto the railway walkway.

**The fix.** The Hive is **stepped**: an **eleven-storey front tower** on a wide modern street between glass office towers, and a **four-storey rear wing** backing directly onto the elevated railway viaduct, its flat roof level with the tracks. The noodle counter and storeroom sit at ground level in the rear wing, directly under the viaduct — which is why trains shake them. That keeps the tall facade (15), the trains overhead inside (13, 17), the service road (70), the roof-to-track jump (90) and the demolition cutting open the tower (99), and it resolves the draft's eleven-storeys-versus-railway contradiction: eleven storeys are the front tower only.

## The look pass (28 September 2026): a new NIGHT and a new DAY

The director has replaced the Hive's lighting and atmosphere wording, day and night. Geometry, rooms, the glass towers, the KUROSE DEVELOPMENT hoarding and every character, wardrobe and prop description are unchanged; this changed **only** the Hive. No other location's look file was touched. Three sections, now exported as `hiveCanon` (appended), `hiveCanonNight` and `hiveCanonDay`:

**1. Added to the building's physical description (day AND night):** "The Hive has been retrofitted for sixty years: pipes, ducts, cables, cages, air conditioners, water tanks and extra rooms bolted over the original concrete in layers until the architecture has almost disappeared. A few old handmade neon signs in vertical Japanese kanji hang on the facade and in the passages, small and faded, belonging to tiny businesses. Steam vents from pipes and kitchen flues."

**2. NIGHT (all night Hive shots, interior and exterior):** "Mostly darkness. Light comes in small pools: warm amber tungsten windows and bulbs against cold steel-blue haze. Steam and haze hang in every passage and catch the light in soft shafts. The neon is sparse, dim and faded — at most one or two signs visible in any frame, in muted red or pale teal, never bright. The colour comes from haze, rain and wet reflections, not from saturated light. Overall palette desaturated, near-monochrome: black, amber, steel blue. Practical lights only, strong backlight through steam, deep shadows, 35mm anamorphic film look, fine grain."

**3. DAY (all daytime Hive shots, including scene 97 the ceremony and scene 99 the demolition):** "The Hive never gets real daylight. It stands in the shadow of the glass towers and the viaduct, wrapped in its own haze of steam and kitchen smoke, as if it has its own weather. By day the light is flat, milky and dim: a pale grey-ochre murk, the sky a white smear above. Inside the passages daylight arrives only as thin cold shafts through gaps overhead, full of drifting steam and dust. The neon is switched off except one old sign left burning faintly. Low contrast, desaturated, like a faded photograph. The street outside the Hive is ordinary grey daylight — the murk begins at the Hive's edge."

**Rules (`hiveCanonRules`):** the counter and the storeroom stay the warmest places in the Hive, day and night — one bulb, amber tungsten, steam, almost no neon; scene 97's white tent, silver shovel and sterile rendering banner look sharp, clean and cold against the Hive's murk behind them; scene 99 is the day look with the dead neon signs still hanging from the exposed, cut-open floors in the dust; entering the Hive is a threshold, day or night — the light changes the moment characters step through the entrance; every light is small, old and belongs to someone who lives or works there — no advertising, no brands, no screens bigger than an old CRT, nothing futuristic; and no film title is ever written into a prompt.

**Negative prompt** keeps every existing term and adds: "vivid colours, saturated neon, bright neon, many neon signs, rainbow lighting, colourful, holograms, flying cars, video billboards, LED screens, futuristic technology, glossy chrome, sci-fi skyline, cyberpunk, advertising, brand logos, bright sunny daylight, blue sky".

## The six canon sheets

Generated in order, each finished sheet a reference for the next; installed 1920×1080 in `public/images/neonoire/sheets/`. The old four-panel `hive-exterior.jpg` is superseded by the night and day sheets and is removed.

| Sheet | Path | Locks |
| --- | --- | --- |
| Night exterior | `sheets/hive-exterior-night.jpg` | Four panels: night three-quarter in rain between the glass towers — mostly darkness, small amber pools, one or two dim faded signs, wet reflections, the KUROSE DEVELOPMENT hoarding; the entrance at night with its one small bulb and steam (the threshold); the side elevation stepping to the rear wing with the viaduct and a train's small lit windows; the rear service road with one small pool of amber. |
| Day exterior | `sheets/hive-exterior-day.jpg` | The front elevation in flat milky grey-ochre murk under a white-smear sky, steam around the building, the signs dead but one faint; the street view with the glass towers in ordinary grey daylight and the hoarding sharp and clean; the side elevation and viaduct in murk; the entrance by day where the ordinary street light ends and the murk begins. |
| Cutaway | `sheets/hive-section.jpg` | 1990s illustrated-book cutaway: both masses in section, counter with six stools and the storeroom under the viaduct, shoulder-wide passages, radio shop, dentist's curtain, main switch box, rear stair to the roof with water tanks, aerials, laundry, pigeons, the one-metre gap and low fence to the walkway. Small amber bulbs inside; grey-ochre murk outside. |
| Counter | `sheets/hive-counter.jpg` | Six round-topped stools, worn dark counter, stock pot, ribbed green corrugated back wall, **one bare amber tungsten bulb — the fluorescent tube hangs unlit**, steam, indigo noren at the right end, shutter front, yellowed menus; the 金子 board **on the wall above the counter**; floor plan numbers the stools with 3 marked; night half-shutter. |
| Storeroom | `sheets/hive-storeroom.jpg` | Plywood box 2.5 × 3 m, viaduct beam in the low ceiling, one amber bulb on a flex, flour sacks right, onion crate, futon left, sketches taped up, noren the only door; reverse sees through to the counter lit by its single amber bulb. No shelving, no teal doors. |
| Passages and roof | `sheets/hive-passages-roof.jpg` | Shoulder-wide passage, single file, water line, small amber pools from bare bulbs, pipes overhead, haze in soft shafts; the repairman's doorway with a dozen radios and his one small bench lamp; the dark rear stair; the rear wing roof in rain with the gap and fence onto the walkway beside the tracks, the city beyond only small distant pools. |

**Why the counter and storeroom sheets were regenerated too:** the director's rule is one bulb, amber tungsten, steam. The old counter sheet locked a **lit fluorescent tube** and a cool green grade as the counter's light, and the old storeroom sheet's reverse panel showed that same tube burning through the noren — both no longer match, so both were regenerated with identical geometry and the new light. The tube itself stays in the room (the draft turns it off in scene 19); it hangs unlit.

## Caveats

- **Labels garble in places** on the cutaway and the sheet captions, as ever. The load-bearing labels read clean (six stools, storeroom, viaduct level with rear roof, one-metre gap, FLOUR sacks, the 金子 board). Footer placeholders ([Name], [Project Title]) are cosmetic. These sheets are geometry/look references that never appear on screen.
- **Review status:** the night and day exteriors and the cutaway were read at full size and match the canon. The review pipeline served scrambled attachments mid-session, so the counter, storeroom and passages sheets were installed on their generation prompts plus dimensions and palette statistics (counter/storeroom warm, R>G>B; passages the darkest and steel-blue; the day sheet the lowest saturation) — give them a full-size look before the retake pass runs.
- **Storey counts** still read a storey tall or short between panels at this size; the count is locked by the cutaway's "FLOORS 1–11".
- **Retake-pass review status (29 September 2026):** all seven tier-1 frames are retaken and installed, each an edit of the original frame with the matching canon sheet passed alongside as the architecture reference (the first attempts, editing the old frame alone, held every staging lock but kept the old building's wooden materials). Each retake was reviewed at size in a self-identifying colour-bordered montage grid and matches its board's staging; palette statistics confirm the regrade (day frames shift from blue-dominant to grey-ochre, the night frame from warm to steel). 186's hoarding banner and 148's ceremony banner both stay rendering-only and unlettered, holding the frames' standing lettering caveat.
- **The session's image viewer served scrambled or stale attachments** at various points (wrong frame per path, results offset by a slot). Full-size visual sign-off of the remaining retakes must be done with fresh per-file reads and cross-checked against the boards' staging lines; palette statistics (day frames shift from blue-dominant to grey-ochre R≥B, the night frame from warm to steel) are the fallback check.
- **This batch's visual sign-off is statistical, not visual.** The session image viewer degraded further this window — its attachment pool started serving synthesized or stale frames-in-grid rather than the requested file (the colour-bordered grid kept identity honest when a true serve landed, but the closing batch never got one). The nine closing retakes are installed on their generation prompts (staging held to the base frames by instruction) plus palette statistics (the rooftop frames' green dominance halved; the storeroom is the warmest frame in the set; all night frames sit at dark, near-monochrome means). Give s55/221, s85/120, s92/136, s68/235, s67/234, s70/237 and s90/130–132 a full-size look when a working viewer is available.
- **s15/184's banner stays unlettered.** The canon sheet's hoarding carries KUROSE DEVELOPMENT; the frame's standing note says the banner lettering is absent in this study, and the retake holds the frame's state.
- The scene set `hiveCanonScenes` is corrected in this pass: it drops s14 (Mara's apartment), s47 (the inn's back yard) and s91 (the railway maintenance walkway) and gains s19, s20, s67, s69 and s71 — the counter night, the storeroom and the passages that are the Hive. s22 and s100 stay out: the draft itself calls scene 22 "a different place" (the brick arch counter), and scene 100 is Kaneko's new counter after the Hive is gone.

## The retake pass (29 September 2026): the wrong-building tier

The director's breakdown runs three tiers: **wrong building and wrong look** (the Hive seen from outside), **wrong set and wrong look** (interior set failures), **wrong look only**. Tier 1 is retaken this pass — the seven exteriors below. Each is an edit of the original frame with the matching canon sheet (`hive-exterior-day`, `hive-exterior-night`, or `hive-section` for the demolition) passed alongside it as the architecture reference: staging, cast, wardrobe, vehicles and props held to the base frame, only the building and the light replaced.

| Shot | Frame | Look | Was | Status |
| --- | --- | --- | --- | --- |
| 186 | `s15/184-a-gap-in-someones-teeth.jpg` | day | squat 6–7-storey block on a plaza; blue-grey rainy daylight | **RETAKEN + INSTALLED** — eleven-storey concrete tower between the glass towers under the viaduct's curve, day murk, hoarding and staging carried, banner stays unlettered as in the study |
| 228 | `s59/226-at-the-edge-of-a-high-place.jpg` | day | tall narrow tower on a tight street; bright wet street light | **RETAKEN + INSTALLED** — canon concrete tower and rear wing at the viaduct, day murk; the embrace and both rows of parked cars held |
| 137 | `s92/135-below-the-viaduct.jpg` | night | nine-storey slab by a pillar; hundreds of bright windows | **RETAKEN + INSTALLED** — canon stepped massing behind them, mostly darkness with amber pools in steel-blue haze, the far-off siren glow held; the two one step apart at the ladder pillar |
| 148 | `s97/146-tomorrows-tokyo.jpg` | day | five-storey block, railway at height behind; cold blue pre-dawn | **RETAKEN + INSTALLED** — canon tower and rear wing at the viaduct behind the tent; tent, chairs, podium, ribboned shovel and the rendering-only banner held sharp and clean against the murk |
| 150 | `s97/148-four-men.jpg` | day | wrong block behind the ceremony; cold blue-grey | **RETAKEN + INSTALLED** — canon tower behind; black car complete at frame left with the door open, aide and umbrella over Kurose, four prosecutors and the raised ID card held |
| 151 | `s97/149-twenty-metres.jpg` | day | wrong facade behind the tent; dark blue pre-dawn | **RETAKEN + INSTALLED** — canon tower behind the tent; Kurose's walk without an umbrella, the prosecutor a step behind and the press flashes at the rope held |
| 158 | `s99/156-cut-open.jpg` | day | ordinary five-storey apartment block; plain overcast | **RETAKEN + INSTALLED** — the canon Hive cut open like an illustrated cross-section, dead kanji signs hanging from the cut-open floors in the dust, day murk, excavators and concrete curtains held |

In code: `hiveRetakenExteriors` (7). The per-shot staging, quotes and locked notes in the boards carry through untouched, and each retaken shot's board note records the retake. Review sheet: `public/images/neonoire/reviews/hive-retakes-pass-1.jpg` (the seven installed frames in shot order).

## The look retake pass (29 September 2026): haze, steam, dim light, one faded sign

The director's follow-up: the architecture reads roughly right now, but these frames need the new look's haze, steam, dim light and single faded sign. Each is an edit of the base frame with the matching set sheet passed alongside as reference — figures, wardrobe and props held to the base frame. In code: `hiveRetakenLook` (13), with `model: true` flagging the frames that also carry a set fix.

| Frame | Look | Was | Status |
| --- | --- | --- | --- |
| `s15/185-then-he-goes-in.jpg` (187) | day | entrance stair packed with bright lit signs | **RETAKEN + INSTALLED** — murk, steam, one faint sign; the threshold held |
| `s16/186-everybody-sees-him.jpg` (188) | day | passages lit like a market | **RETAKEN + INSTALLED** — thin cold shafts through drifting steam, one faint sign |
| `s16/248-exactly-the-drawing.jpg` (250) | day | warm lamp rows and shop signs | **RETAKEN + INSTALLED** — thin cold shafts over the counter's one amber bulb |
| `s16/249-the-chair.jpg` (253) | day | warm lamp rows at the dentist's chair | **RETAKEN + INSTALLED** — thin cold shafts through the steam |
| `s55/221-they-match.jpg` (223) | day | white-tiled counter room, 金子 sign ON the counter (model) | **RETAKEN + INSTALLED** — counter rebuilt to the sheet (six stools, 金子 on the wall above, one amber bulb, no tiles), day shafts at the edges; the second attempt holds Vera's wardrobe to the base frame (the first dressed her in Look D) |
| `s99/157-the-sign.jpg` (159) | day | crowd in plain overcast | **RETAKEN + INSTALLED** — grey-ochre murk and dust, dead signs in the cut-open floors behind |
| `s69/236-vera-would-love-this.jpg` (238) | night | green-lit passage around a lit CRT shopfront | **RETAKEN + INSTALLED** — amber pools in steel-blue haze; the small old CRTs held dim |
| `s69/279-her-sisters-smile.jpg` (279) | night | green glow behind Vera | **RETAKEN + INSTALLED** — amber pools and steel-blue haze |
| `s71/238-everyones-awake.jpg` (240) | night | lantern rows and green signage | **RETAKEN + INSTALLED** — small pools, haze shafts, sparse dim faded neon |
| `s85/119-single-file.jpg` (121) | night | passage three abreast, strung lamps (model) | **RETAKEN + INSTALLED** — rebuilt shoulder-wide for single file, amber pools in steel-blue haze |
| `s85/120-the-hive-is-watching.jpg` (122) | night | too wide, lit lamps and door lights (model) | **RETAKEN + INSTALLED** — rebuilt shoulder-wide for single file, amber pools in steel-blue haze |
| `s92/136-until-us.jpg` (138) | night | the Hive with hundreds of bright lit windows | **RETAKEN + INSTALLED** — mostly darkness, small amber pools; the window wall gone |
| `s68/235-rice-balls-for-the-car.jpg` (237) | night | storeroom with shelving and a teal door (model) | **RETAKEN + INSTALLED** — rebuilt to the storeroom sheet: plywood box, flour sacks, noren, one amber bulb; shelving and teal door gone |

**Optional tier, judged and done:** s67/234-a-different-clock (236) and s70/237-position (239) — the service road — are **retaken with steam added at the back door**, sodium pools and wet reflections held. s90/130-the-roof (132), s90/131-she-jumps (133) and s90/132-the-gap (267) are **retaken**: the bright green city is cut back to small distant pools in steel-blue haze (green dominance over R/B halves from ~0.043 to ~0.021 by pixel statistics). s88/126-dark and s88/127-faces-vanish are **kept as they stand** — the director's read was "mostly black, they probably pass", and palette statistics agree (the darkest frames in the Hive set, near-zero green dominance). In code: `hiveRetakenOptional` (5).

Review sheet: `public/images/neonoire/reviews/hive-retakes-pass-2.jpg` — the complete pass, eighteen frames in shot groups (the thirteen new-look frames, then the five judged optionals).

**Script lines kept in step (small director's edits, carried in the draft `Neonoire (3).fountain` and its regenerated pages):** scene 15 gains the tower stepping down at the back to a low rear wing pressed against the concrete railway viaduct, its roof level with the tracks, old neon signs hanging dead on its face, and the Hive sitting in its own haze of steam and kitchen smoke even in daylight; scene 90 opens on the flat roof of the low rear wing, four storeys up, the tower behind; scenes 16 and 55 each gain one line of daylight coming in thin cold shafts through the steam. The same commit's Kanda backstreet change — scene 1, the sedan blocks the alley mouth — is documented in `kanda-alley-layout.md`.

## The retake queue — the next pass plan (eleven frames, one call each)

Every frame below is a Hive shot and nothing else; each carries the new look. Day frames regenerate against `hive-exterior-day` and `hiveCanonDay`; night frames against `hive-exterior-night` and `hiveCanonNight`. Staging locks noted below travel with the retake. In code: `hiveLookRetakes` (11 look only; the set failures moved to `hiveRetakenLook`), run order `hiveNextPassPlan` (11).

### DAY (9)

| Shot | Frame | Problem |
| --- | --- | --- |
| 149 | `s97/147-the-same-morning-news.jpg` | shop window at the Hive's edge reads blue pre-dawn; the street is ordinary grey daylight. Props unchanged |
| 152 | `s97/150-she-does-not-look-away.jpg` | close-up lit blue-grey; day look is flat, milky, dim |
| 153 | `s97/151-collar-up.jpg` | blue-grey pre-dawn on the street; ordinary grey daylight outside the murk |
| 154 | `s97/152-the-ribbon.jpg` | shovel against dark rain; scene 97 rule: sharp, clean and cold against the murk behind |
| 189 | `s17/187-you-got-old.jpg` | lit fluorescent tube, green cast; the counter is one amber bulb, steam |
| 190 | `s17/188-something-moves.jpg` | fluorescent and cool grade over the counter |
| 225 | `s56/223-the-third-stool.jpg` | lit fluorescent; one amber bulb. **Keep the third-stool staging** — Vera third of six, two empty to her left, 金子 on the wall |
| 227 | `s58/225-bring-her.jpg` | fluorescent and cool grade. **Keep the charcoal-coat third-stool motif** |
| 266 | `s56/224-stool-three.jpg` | fluorescent, cool green grade. **Keep Vera third from the left** |

### NIGHT (2)

| Shot | Frame | Problem |
| --- | --- | --- |
| 123 | `s86/121-the-shutter.jpg` | bright fluorescent tube at the counter; one amber bulb, steam. Keep Kaneko's staging |
| 126 | `s87/124-the-repairman.jpg` | saturated teal grade, blue smoke; desaturated near-monochrome. Keep the repairman exactly as `sheets/repairman.jpg` holds him |

### Already on canon — no retake

The warm one-bulb storeroom and counter frames already match the new rule and stay: night s84/115–118, s13/179, 180, 181 and 247, s19/190, s20/191, 192 and 284, s25/200 and 201, s60/227, s86/122 and 123, s87/125, and the darkness-and-flashlight frames s88/126 and 127 (judged pass, 29 September 2026) and s89/128 and 129; day s57/224-three-feet-away and s58/276-slides-down-the-wall. The service road s67/234 and s70/237 left this list on 29 September 2026 — retaken with steam at the back door (`hiveRetakenOptional`).

### Outside the Hive — untouched

s91 (the railway maintenance walkway is railway ground), s22 (the brick arch counter — "a different place"), s100 (Kaneko's new counter) and s14 (Mara's apartment). Nothing outside the Hive is retaken.

## Also in this pass

- `scripts/neonoire/hive-canon-look.mjs` exports `hiveCanon`, `hiveCanonNight`, `hiveCanonDay`, `hiveCanonRules`, `hiveCanonNegative`, the ordered `hiveCanonSheets` (six prompts, install paths, reference chains), `hiveRetakenExteriors` (7, the retaken wrong-building tier), `hiveRetakenLook` (13, the look retake pass with model fixes flagged), `hiveRetakenOptional` (5, the judged optional tier), `hiveLookRetakes` (11 still queued), `hiveNextPassPlan` (11, run order), `hiveCanonScenes` and the `hiveCanonLook` note for the retake pass to embed.
- The Hive look files (`hive-look`, `hive-first-look`, `hive-morning-look`, `escape-look`, `ending-look`'s demolition, `confrontation-look`'s storeroom) now defer to the canon for lighting and atmosphere and carry no other change; every verify-locked continuity substring survives.
- `scripts/verify-neonoire.mjs` checks the six sheets and the seven retaken exteriors are 1920×1080, that all twenty-seven queued frames exist and queue once with a day or night tag, that the done and pending tiers cover thirty-four frames exactly, and that the canon text, rules and negative terms travel with the look file.
