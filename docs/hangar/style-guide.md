# Painted Americana '75 — reusable style guide

**Style ID:** `hangar`  
**Picker name:** Painted Americana '75  
**Reference image:** `public/images/styles/painted-americana-75.jpg`

This is a reusable visual treatment in PlayFrame's shared **Visual style** picker, not a setting or story prompt. Select it for a future project and let that project's own scene/shot descriptions define the place, period, people, and action.

## The look

- **Medium:** hand-drawn 2D feature animation; luminous gouache environments with visible brush texture and layered atmospheric depth.
- **People and vehicles:** plain, readable silhouettes with believable weight, simple confident contours, restrained cel color, and natural acting. Keep squash-and-stretch, oversized eyes, and gag expressions out of dramatic frames.
- **Light:** motivated practical sources. Pair warm amber, sodium, or flare color with cool blue/teal shadow; let fog, cloud, foliage, and weather sit in separate painted layers.
- **Finish:** tactile painted detail, restrained film grain, soft halation around real light sources, full-bleed 16:9. Keep compositions patient and leave room for silence.
- **Use it for:** period Americana, rural mysteries, nostalgic coming-of-age stories, and quietly fantastical worlds. The exact palette and props should follow the story, not this sample image.

## Reusable prompt seed

> Hand-drawn 2D feature-animation still, full-bleed 16:9. Luminous gouache-painted environments with layered atmospheric depth, tactile brush texture, and weather in the distance. Plainly drawn people and vehicles with grounded weight, strong readable silhouettes, clean contours, restrained cel color, and believable acting. Motivated practical light, warm amber against cool blue shadows, subtle film grain and soft halation. Patient cinematic composition; preserve the supplied subject, period, and continuity. No photorealism, no 3D/CGI sheen, no chibi proportions, no oversized anime eyes, no exaggerated squash-and-stretch, no captions, logos, or watermark.

Treat that paragraph as a starting point: the shared style entry in `src/lib/styles.ts` is the source PlayFrame writes into image/video prompts. Shot descriptions, lighting notes, and project look notes provide the story-specific details.

## Project-specific rules are separate

The cold open's rules (never reveal what is in the crate, never show what the pilot shot, and use road flares rather than flashlight beams) belong to *this story*, not to the reusable style. Keep such constraints in the project's screenplay, notes, and shot prompts so another story can use the same look without inheriting this plot.

## Updating the sample

The original key art lives at `public/images/styles/painted-americana-75.jpg` and is referenced by the shared style picker. Do not replace it in place; add a versioned filename and update the style entry if a new approved sample is needed. The cold-open storyboard's own images live under `public/images/hangar/` and remain **Needs review** until approved.
