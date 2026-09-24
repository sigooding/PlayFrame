# NEONOIRE — the studio brief

The look the film is generated in, kept with the project rather than in a chat window: the style
block, the negative prompt, the nine studio shot prompts, and the tip for when a generation drifts
towards cyberpunk. This block is also the `neonoire` entry in the app's visual-style library
(**Neo-Noir Tokyo**, `src/lib/styles.ts`), so the prompt studio writes it into every batch.

## Style block

> Cinematic film still, 2.39:1 anamorphic widescreen, shot on 35mm Kodak Vision3 500T film, visible
> fine grain, soft halation glow around every light source, slightly crushed blacks, muted
> desaturated palette. Neo-noir Tokyo at night that feels like a memory rather than a specific year:
> Showa-era vending machines, hand-painted shop signs, tangled overhead power lines, old CRT
> televisions alongside modern details. Cold steady rain, wet black asphalt with long mirror
> reflections. Lit almost entirely by practical light sources: cold white vending machine glow,
> sodium-vapor orange streetlights, sickly fluorescent green from shop windows, no moonlight. Wide,
> patient composition with the figure small in the frame, lots of negative space, quiet and
> melancholic, nostalgic, restrained, lonely. Ordinary city life hinted at in the background: one
> lit apartment window, laundry on a balcony, a distant train.

## Negative prompt

> lightning, dramatic storm, glossy cyberpunk, holograms, flying cars, heavy neon overload,
> oversaturated colors, clean digital look, HDR, sharp CGI, bokeh overload, close-up portrait,
> fashion pose, smiling, text, watermark, anime style

## Pass tip

If a frame comes out too cyberpunk, drop "neon" from the prompt and add **1990s**, **ordinary**,
**worn**, **documentary realism**.

## The nine keys

Generated from the prompts below, at 2.39:1, into `public/images/neonoire/keys/`. They are the style
board for the film and the reference set for later passes — each one is attached to its scene's
mood board in the workspace.

| # | key | prompt |
| --- | --- | --- |
| 1 | `01-the-doorway.jpg` | A young American woman in her twenties, soaked hair, no umbrella, pressed into the dark recessed doorway of a closed barbershop with a still, unlit striped pole. A narrow empty backstreet of shuttered shops, a single vending machine at the corner lighting the rain in white columns. Seen from across the street, the woman small in the frame. |
| 2 | `02-the-key.jpg` | Extreme close-up of a woman's wet, trembling hand in rain, holding a small numbered coin-locker key on a worn plastic tag. Orange streetlight reflected in the puddle below, blurred vending machine glow behind. |
| 3 | `03-the-bar.jpg` | Low angle from the floor behind a small bar counter: a crate of empty bottles, the underside of the counter, a man's shoes beneath a bar stool. Blue flicker from an old CRT television on a high shelf lights the ceiling. Amber bottle glow. Tense, claustrophobic, quiet. |
| 4 | `04-veras-apartment.jpg` | A small tidy Tokyo apartment at dusk, grey rain-streaked window, a woman in her late twenties sitting alone at a low table with two teacups, one empty and clean. An old boxy television glowing in the corner, a faded framed family photograph on a shelf, a pale blue umbrella standing dry by the door. An elevated train passing outside, its lit windows blurred. |
| 5 | `05-the-police-station.jpg` | Fluorescent-lit Japanese police station front counter at night, one flickering tube, faded public safety posters, an old fax machine beside a modern flat monitor. A woman standing at the counter holding a closed, dripping pale blue umbrella. Institutional, cold, slightly dated. |
| 6 | `06-the-block.jpg` | A dense, self-built Tokyo apartment enclave at night, stacked balconies, air conditioners, laundry, hand-painted signs, bare bulbs in narrow passages, rain dripping through gaps in the roofing. An elevated train passing very close overhead. Hundreds of small lit windows, each with a different life inside. |
| 7 | `07-the-rain-scene.jpg` | Extreme wide shot of an empty Tokyo street at night, a woman collapsed and sitting on the wet pavement, a man in a dark coat kneeling a few feet away, not touching her. The street lit only by vending machines. Above them, an elevated train passes, a ribbon of lit windows with oblivious passengers. The figures tiny in the frame, the city huge and indifferent. |
| 8 | `08-ozu-cutaway.jpg` | Still life, no people: a single woman's shoe lying in a puddle on an empty rainy street, a vending machine glowing beyond it, a bicycle chained to a pole with rain dripping from the seat. Low camera, static, quiet. |
| 9 | `09-the-roadside-inn.jpg` | A faded Showa-era roadside inn at night in the countryside, tin roof, a beer vending machine by the entrance, a pink public payphone visible through the lobby glass. Four black sedans parked in the rain with headlights on, masked men in black standing still. Seen from an upstairs window through a curtain gap. |

## How the prompts are used

The style block is not pasted into each shot by hand. It is the project's own look:

- every scene and every frame in the bundle carries the style id `neonoire`, so the **prompt studio**
  (Storyboard → Prompts, or any frame's AI-prompt tab) writes the block and its negative prompt into
  every prompt it generates, for all thirty-one styles' worth of models — video and image alike;
- the board's own grammar (shot type, lens, angle, movement, lighting, cast, the draft's words) is
  added on top, so a frame's prompt is the brief plus that shot's direction;
- the negative prompt is attached to the `neonoire` style, which means it travels with any style the
  app renders for this project rather than living in a chat window.

## How the keys relate to the numbered board

The nine keys are the look; the 65 numbered shots are the film. Where they overlap, the board wins
and the key is the reference:

| key | board shots |
| --- | --- |
| 1 the doorway | 6 barbershop doorway (the framing is the key's) |
| 2 the key | 16 the key (extreme close-up, hand only) |
| 3 the bar | 24 from the floor, 26 the variety show |
| 4 Vera's apartment | 33–42, scene 4 entire |
| 5 the police station | 43–50, scene 5 entire |
| 6 the block | scene 3 (the block at dusk) and the Kanda streets |
| 7 the rain scene | 14 she kneels, and the street's indifference in 11–13 |
| 8 Ozu cutaway | 17 she runs (the purse and the puddle), 32 laundry in the rain |
| 9 the roadside inn | not yet boarded — it is the sequence after the opening's `CUT TO:` |
