// Builds public/projects/neonoire-opening.json from the final screenplay and the numbered shot
// boards of the opening seven scenes.
//
//   npm run build:neonoire            write the bundle
//   node scripts/neonoire/build-project.mjs --check   fail if the bundle has drifted
//
// Nothing is retyped: the Screenplay tab's pages are the draft's own bytes under a production
// header — one page per numbered scene, boarded or not — every frame's script quote has to be
// found in the draft, and every keyframe path has to be a real file. Passes are ten shots at a
// time, which is how the keyframes are generated.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACT, FOUNTAIN, SCENES, brainstorm, characters, cleanScript, containsText, countMarkers,
  createdAt, featureScenes, grammar, imagePath, pageBody, pageText, pages, parseBoard, projectId,
  readBoard, readFountain,
} from "./plan.mjs";

import { frontCounterLook } from "./front-counter-look.mjs";
import { apartmentLook } from "./apartment-look.mjs";
import { interviewLook } from "./interview-look.mjs";
import { detectivesLook } from "./detectives-look.mjs";
import { coldOpenLook, coldOpenCompletedThrough, isColdOpenScene } from "./cold-open-look.mjs";
import { aftermathLook, streetsLook, streetsScenes } from "./streets-look.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = file => readFileSync(resolve(root, file), "utf8");

const fountain = readFountain(root);
const slices = pages(fountain);
const feature = featureScenes(fountain);
const passSize = 10;
const passOf = n => Math.ceil(n / passSize);

/** The look and its negative, kept in step with the Neo-Noir Tokyo entry in src/lib/styles.ts. */
const STYLE_BLOCK = process.env.NEONOIRE_STYLE_BLOCK || readFileSync(resolve(root, "src/lib/styles.ts"), "utf8")
  .match(/id: "neonoire",[\s\S]*?prompt: "([^"]+)"/)[1].replace(/\\"/g, '"');
const STYLE_NEGATIVE = readFileSync(resolve(root, "src/lib/styles.ts"), "utf8")
  .match(/id: "neonoire",[\s\S]*?negative: "([^"]+)"/)[1].replace(/\\"/g, '"');

/** One line of tone per scene, carried on every frame so the shot list reads as a scene does. */
const MOODS = {
  s1: "Wide, patient and wet; the city does the lighting, and the violence is ordinary.",
  s2: "Cold and quiet: the floor's-eye view, a laugh track, and a young woman understanding she is inside something.",
  s3: "Dusk going blue, laundry nobody is coming back for, one lit window.",
  s4: "Rain-grey glass, muted amber lamplight, two cups and an apology left on voicemail.",
  s5: "Institutional, polite, a decade out of step; a name arriving on a monitor.",
  s6: "Two people being careful with each other, in Japanese, over tea going cold.",
  s7: "An empty office, one decision already made, and a clock a minute fast.",
  s72: "Tokyo Story in colour: still pretty, dry and carefully made-up; the room keeps playing while her world stops.",
  s73: "A still camera, a woman who cannot be still: rain begins to undo her makeup, and one red shoe stays behind.",
  s74: "Tokyo Story in colour: observe, do not console. Grief plays in the distance, then in a huge empty street.",
  s75: "Still frames with the people removed: the night's objects keep glowing after it is over.",
  s76: "A dark apartment, a dented steel lighter opening and closing, and crying without making a sound.",
};

// ---------------------------------------------------------------- the screenplay pages
// A page is verbatim draft text under an injected production header, so the header is the only
// thing the builder may remove, and what is left — every line, blank ones included — has to
// rebuild the draft byte for byte. The Screenplay tab carries the whole final screenplay.
assert.equal(slices.length, feature.length, `Every numbered scene needs a page: ${feature.length} scenes, ${slices.length} slices`);
for (const [i, scene] of feature.entries()) {
  const file = `docs/neonoire/screenplay/${scene.page}`;
  assert(existsSync(resolve(root, file)), `Missing screenplay page: ${file} — run node scripts/neonoire/split-opening.mjs`);
  assert.equal(read(file), pageText(scene, slices[i]), `${file} has drifted from ${FOUNTAIN} — regenerate it with node scripts/neonoire/split-opening.mjs`);
  const lines = pageText(scene, slices[i]).split("\n");
  assert.equal(lines[0], "NEONOIRE", `${file} must open with the film's title`);
  assert(lines[3].startsWith(`${scene.location} - ${scene.time}`), `${file} must put the scene's own slugline at line 4: got "${lines[3]}"`);
  assert.equal(pageBody(pageText(scene, slices[i])), slices[i].join("\n"), `${file} must carry the draft's own bytes below its header`);
}
const rebuilt = feature.map((scene, i) => pageBody(pageText(scene, slices[i]))).join("\n");
assert.equal(rebuilt, fountain, `The ${feature.length} pages must rebuild ${FOUNTAIN} exactly`);

// ---------------------------------------------------------------- the numbered shot boards
const boards = SCENES.map(scene => parseBoard(readBoard(root, scene), scene));
const shots = boards.flat();
const totalShots = 86;
assert.equal(shots.length, totalShots, `The boards are ${totalShots} numbered shots — the opening's 68 plus scenes 72–76's 18 — but carry ${shots.length}`);
shots.forEach((shot, i) => assert.equal(shot.n, i + 1, `Shot numbering must run 1..${totalShots} across the boarded scenes; found ${shot.n} at ${i + 1}`));
assert.equal(shots.length, new Set(shots.map(shot => shot.image)).size, "Two shots claim the same keyframe filename");
assert.equal(shots.length, new Set(shots.map(shot => shot.id)).size, "Stable frame IDs must be unique when the board is reordered or expanded");
const missing = shots.filter(shot => !existsSync(resolve(root, `public${imagePath(shot.scene, shot)}`)));
// A frame whose study has not been generated yet is an honest placeholder, exactly as the series
// workspace does it: it holds its slot and names the missing file instead of borrowing a neighbour.
// The final screenplay's frame rule is 16:9 for every image: a frame still holding a 2.39:1 study
// is pending revision, not approved coverage.
const awaitingAspect = shot => shot.scene.key === "s3";
const frames = shots.map(shot => {
  const path = imagePath(shot.scene, shot);
  const absent = missing.includes(shot);
  return {
    id: shot.id,
    sceneId: shot.scene.id,
    title: `${shot.title}${absent ? " (keyframe missing)" : ""}`,
    description: shot.description,
    image: absent ? "" : path,
    shotType: shot.shotType,
    movement: shot.movement,
    angle: shot.angle,
    lens: shot.lens,
    lighting: shot.lighting,
    style: "neonoire",
    duration: shot.duration,
    durationIsEstimate: true,
    status: absent || awaitingAspect(shot) || (isColdOpenScene(shot.scene.key) && shot.n > coldOpenCompletedThrough) ? "Needs review" : "Draft",
    transition: shot.n === 1 ? "Fade in" : "Cut",
    mood: MOODS[shot.scene.key],
    characters: shot.cast.map(name => characters.find(c => c.name === name).id),
    notes: [
      absent
        ? `KEYFRAME MISSING — ${path} is not in public/images/neonoire/${shot.scene.key}, so this card holds slot ${shot.n} of ${totalShots} until pass ${passOf(shot.n)} is generated.`
        : streetsScenes.has(shot.scene.key)
          ? "Image: AI-generated Tokyo Story colour revision, session one (25 September 2026). Nine new shot studies plus Jack's identity sheet used ten image-generation calls. Replaces the earlier image, never uses it as a reference. Production approval pending."
          : `Image: AI-generated storyboard study from pass ${passOf(shot.n)}; continuity, framing and production approval pending — check the wardrobe against the cast sheets before approving.`,
      ...(isColdOpenScene(shot.scene.key) ? [shot.n <= coldOpenCompletedThrough
        ? `Cold-open visual revision: ${coldOpenLook}`
        : `COLD OPEN REVISION PENDING — shot ${shot.n} retains its previous 2.39:1 image. Only shots 1–${coldOpenCompletedThrough} have been rebuilt in 16:9; follow scripts/neonoire/cold-open-look.mjs for the next batch. This legacy frame is not revised coverage.`] : []),
      ...(awaitingAspect(shot) ? [`16:9 REVISION PENDING — shot ${shot.n} retains its legacy 2.39:1 study. From the final screenplay onward every image in this film is 16:9 full-bleed (1920×1080): regenerate this frame against scene 3's key; never crop the scope study into it.`] : []),
      ...(shot.scene.key === "s7" ? [`Visual revision (25 September 2026): ${detectivesLook}`] : []),
      ...(shot.scene.key === "s6" ? [`Visual revision (25 September 2026): ${interviewLook}`] : []),
      ...(shot.scene.key === "s4" ? [`Visual revision (25 September 2026): ${apartmentLook}`] : []),
      ...(shot.scene.key === "s5" ? [`Visual revision (25 September 2026): ${frontCounterLook}`] : []),
      ...(streetsScenes.has(shot.scene.key) ? [`Scenes 72–75 — Tokyo Story in colour (25 September 2026): ${streetsLook}`] : []),
      ...(shot.scene.key === "s76" ? [aftermathLook] : []),
      shot.note,
      shot.script ? `SCRIPT — the draft's own words for this shot:\n"${shot.script}"` : "SCRIPT — no dialogue; the shot is carried by the frame and the sound.",
      shot.scene.grammar,
      grammar,
      `Timing: ${shot.duration}s is a working estimate for animatic playback. The draft locks no durations.`,
      `Pass ${passOf(shot.n)} of ${Math.ceil(totalShots / passSize)} — ten keyframes at a time, in screenplay order. Shot ${shot.n} of ${totalShots}.`,
    ].join("\n\n"),
  };
});

const lookNote = (() => {
  const start = fountain.indexOf(">THE LOOK<");
  const end = fountain.indexOf("===", start);
  return fountain.slice(start, end).trim();
})();
const passTable = SCENES.map(scene => {
  const own = shots.filter(shot => shot.scene.key === scene.key);
  const done = own.filter(shot => !missing.includes(shot));
  return `- **Scene ${scene.n} — ${scene.location} ${scene.time}** — ${own.length} shots, ${done.length} keyframes on disk${done.length < own.length ? `, ${own.length - done.length} placeholder cards (passes ${[...new Set(own.filter(s => missing.includes(s)).map(s => passOf(s.n)))].join(", ")})` : ""}`;
}).join("\n");

const notes = [
  {
    id: "neonoire-start-here", title: "Start here — what this workspace is", color: "sage", createdAt,
    tags: ["Production", "Read first"], connections: [],
    content: `NEONOIRE — the final feature screenplay (September 2026). 100 numbered scenes in the Screenplay tab, carried page by page straight from the draft; twelve of them are boarded — the opening seven (shots 1–68), the hotel call and Tokyo streets, scenes 72–76 (shots 69–86) — 9 cast cards, keyframes generated ten at a time in screenplay order. Every other scene is **written, not boarded**: the screenplay carries them in full and the board has simply not reached them.\n\nThe draft at the repository root (\`${FOUNTAIN}\`) is the source of truth, and the Screenplay tab shows it one page per scene — the draft's own words under a production header — so what you edit in the app is what the draft says. Nothing is explained in this film and the workspace does not explain it either.\n\n**Boarding status**\n${passTable}\n\nEvery keyframe is an **AI-generated draft study**, not approved coverage. Continuity is carried by identity sheets for Mara, Vera, Jack, Ishida and the young officer, used as references whenever they appear; the notes on each frame name the sheet. **From the final screenplay onward every image is 16:9 full-bleed (1920×1080)** — see the frame-format note.`,
  },
  {
    id: "neonoire-look", title: "The look — the draft's own words", color: "sand", createdAt,
    tags: ["Look", "Source"], connections: [],
    content: lookNote,
  },
  {
    id: "neonoire-style-block", title: "The style block — what every frame is generated with", color: "sand", createdAt,
    tags: ["Look", "Prompts"], connections: [],
    content: `Every keyframe in this workspace is generated with the same style block, attached cast sheets where the sisters appear, and the same negative prompt. The block is also the **Neo-Noir Tokyo** entry in the app's visual-style library, so the prompt studio writes it into any batch you generate from this project.\n\n**Style block**\n${STYLE_BLOCK}\n\n**Negative prompt**\n${STYLE_NEGATIVE}\n\n**If a frame comes out too cyberpunk:** drop "neon" from the prompt and add *1990s*, *ordinary*, *worn*, *documentary realism*.\n\nThe nine keys generated from the brief are on the mood board *The style block — nine keys*, and the prompts themselves are recorded in \`src/lib/styles.ts\`.`,
  },
  {
    id: "neonoire-continuity", title: "Continuity — the Voss family, and everyone else", color: "rose", createdAt,
    tags: ["Continuity", "Cast"], connections: [],
    content: `**Mara Voss (24)** and **Vera Voss (29)** are American sisters: ash-blonde hair, pale blue eyes, distinct faces locked to sheets/mara.jpg and sheets/vera.jpg and their face crops. Mara's longer wavy hair is soaked flat in the opening; her cheap red-bird clip slides loose between the crates in scene 2 and is gone from that beat on. The final scene gives the clip to Vera.\n\nVera's opening wardrobe is charcoal wool coat, cream knit, navy trousers and brown boots. In scenes 72–75 she wears her mother's wine-red silk dress, broad straps, modest cowl neckline and calf-length bias-cut skirt. Her makeup is pretty, carefully applied and INTACT in the hotel, with dry groomed hair. Only rain in scene 73 washes it into thin mascara trails and plasters her fringe. Both red court shoes remain until the skid: thereafter RIGHT foot bare, LEFT shoe on. No coat or umbrella on the street; the folded pale-blue umbrella stays by the hotel stool.\n\n**Jack (48)** is the private investigator and former police detective, not her father and never Jack Voss. The screenplay supplies no surname. His new Japanese visual casting design follows sheets/jack.jpg and jack-face.jpg: lean, angular, cool but tired, black hair with silver temples, stubble, a good badly kept charcoal overcoat over an off-white open-collar shirt. In the confrontation he is soaked, hands dark, no tie or weapon; he takes the blows and kneels apart after she pushes him away.\n\n**Daniel Voss (41, twenty years ago)** is the American father in the family photograph, identified by the scene 11 clipping. Daniel, not Jack, holds nine-year-old Vera's and four-year-old Mara's hands outside the noodle shop. The photograph asset itself is unchanged; the incorrect cast label and parent links are corrected.\n\nThe masked men never receive faces. The old man and journalist remain unnamed. Ishida and the young officer keep their existing sheets. Scene 75 has no people anywhere, including reflections.`,
  },
  {
    id: "neonoire-language", title: "Language — English, Japanese, and the subtitles", color: "sand", createdAt,
    tags: ["Language", "Continuity"], connections: [],
    content: `The Voss sisters speak **English** to each other — including on the phone, including the answerphone message Vera cannot bring herself to answer.\n\nDialogue marked *(in Japanese)* is spoken in Japanese and subtitled in English, and it is never used for local colour: Mara's Japanese is halting and she is understood just barely; Vera's is fluent, careful and slightly formal, learned as a child and relearned as an adult; Ishida's English is excellent and she refuses it anyway, which is the only line either of them draws in the interview room. The old man's "twenty years" and "don't let them have it" are Japanese, and the masked man's two position reports are Japanese into a radio.\n\nThe audience is never told what the key opens, what the position reports are counting towards, or why the journalist had a notebook. Nothing is explained — that is the film's rule, and it is also the workspace's.`,
  },
  {
    id: "neonoire-keyframes", title: "What the keyframes are, and what they are not", color: "rose", createdAt,
    tags: ["Images", "Review"], connections: [],
    content: `**Format: every image is 16:9 full-bleed, 1920×1080 JPEG, no letterbox** \u2014 the final screenplay's rule for this film. Frames already on disk that were made at 2.39:1 (cold-open shots 11\u201328, scene 3, and the older style keys) are legacy studies awaiting that revision, not a licence to crop; regenerate, never reframe by cropping. Every frame in this storyboard is a **draft AI study** standing in for a shot that has not been photographed. They are generated in passes of ten, in screenplay order, from the boards in \`docs/neonoire/scenes/\` with the cast sheets attached as references.\n\nThey are useful for: framing, lens, blocking, light direction, wardrobe continuity, and seeing whether the scene plays in order in the animatic.\n\nThey are not: approved coverage, a lighting plan, a cast approval, or a licence to stop checking. Faces drift between passes more than anything else — if a study of Mara or Vera does not match her sheet, mark the frame **Needs review** and regenerate it. Each frame's notes carry the pass it came from.`,
  },
  {
    id: "neonoire-frame-format", title: "Frame format — images are 16:9", color: "sand", createdAt,
    tags: ["Images", "Format"], connections: [],
    content: `From the final screenplay (\`${FOUNTAIN}\`) onward, **every image in this film is 16:9 full-bleed, 1920\u00d71080 JPEG, no letterbox** \u2014 including every keyframe generated for scenes 8\u2013100 as the board reaches them.\n\nThe studio look keeps its film character at the new shape: 35mm Kodak Vision3 500T grain, halation, crushed blacks, practical light \u2014 the Neo-Noir Tokyo style block in the app's library now opens with \"16:9 full-bleed widescreen\" instead of scope.\n\n**Legacy exceptions, tracked frame by frame:** cold-open shots 11\u201328 and scene 3 (shots 29\u201332) still hold 2.39:1 studies and are marked **Needs review** with \"REVISION PENDING\" in their notes; style keys 1\u20133 and 6\u20139 remain 2.39:1 references. Regenerate those in 16:9; never crop a revised frame back to scope, and never letterbox 16:9 content to fake it.\n\nNormalise a fresh 16:9 frame with:

\`convert FILE.jpg -resize \"1920x1080^\" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg\``,
  },
  {
    id: "neonoire-tokyo-story-revision", title: "Scenes 72–75 — Tokyo Story in colour", color: "sage", createdAt,
    tags: ["Revision", "Camera", "Continuity"], connections: [],
    content: `25 September 2026. Ten image-generation calls: Jack's new identity sheet plus nine shot replacements/new studies. Completed board shots: 69, 70, 72, 74, 75, 76, 77, 79, 80. Six placeholders await replacement: 71 (hotel exit), 73 (machine pass), 78 (reflection), 81 (Hive), 82 (empty machine), 83 (CRT). Their superseded pictures are removed, not relabelled as finished.\n\n${streetsLook}\n\nThe call image is a chest-up reframe of its new generation, excluding an invented second counter; the face crop and review contact sheet are derivatives, not extra generations. Exact clock hands and the initial twenty-metre blocking remain production-review checks. The approach keyframe is closer than the initial stop. Scene 76 images remain unchanged.\n\nScene 72 adds two board positions. Existing shot IDs and asset filenames are stable; their older numeric prefixes are NOT their new displayed board positions. Scene 74 now plays approach, blow/collapse, aftermath wide, reflection, with a return to the wide for the train and late score. The screenplay itself is unchanged.`,
  },
];

// ---------------------------------------------------------------- mood boards
const boardOf = (id, title, description, list) => ({
  id, title, description, actId: ACT.id, createdAt,
  items: list.map((item, i) => ({ id: `${id}-item-${i + 1}`, image: item.image, caption: item.caption })),
});
const framesOf = keys => frames.filter(frame => frame.image && keys.includes(frame.sceneId));
const allBoards = [
  boardOf("neonoire-look-tokyo-story", "Tokyo Story in colour — scenes 72–75", "Nine new 16:9 draft studies: dry pretty makeup in the hotel, rain-washed grief, the distant confrontation and empty pillow shots. Six remaining shots are placeholders, not legacy pictures. Low level static cameras; one normal-lens face shot, then a withheld extreme wide.", framesOf(["neonoire-s72", "neonoire-s73", "neonoire-s74", "neonoire-s75"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}, ${frame.angle}. AI-generated revision study.` }))),
  boardOf("neonoire-look-kanda", "Kanda, night — sodium and green", "Ten shots of the cold open and the bar: sodium orange against sick fluorescent green, cold steady rain, black reflective asphalt, the vending machine the brightest light in the film.", framesOf(["neonoire-s1", "neonoire-s2"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
  boardOf("neonoire-look-sisters", "Three days later — grey rain light", "Vera's thread: blue hour on the block, rain-grey glass and muted amber practical light inside the revised apartment, a bone-dry pale-blue umbrella and a faded warm family photograph.", framesOf(["neonoire-s3", "neonoire-s4"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
  boardOf("neonoire-look-station", "The police station — a decade out of step", "Fluorescent tubes with one flickering, faded posters, a fax machine beside a flat monitor, a clock a minute fast, and a paper cup of tea nobody drinks.", framesOf(["neonoire-s5", "neonoire-s6", "neonoire-s7"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
  boardOf("neonoire-look-style", "The style block — nine keys", "The studio brief's nine keys, with the revised apartment and police-station keys at 16:9 and the other keys at 2.39:1 from the look and negative prompt in src/lib/styles.ts, and the same block the app's Neo-Noir Tokyo style writes into every prompt batch.", [
    { image: "/images/neonoire/keys/01-the-doorway.jpg", caption: "1. The doorway — the key the film's own framing of scene 1 is measured against." },
    { image: "/images/neonoire/keys/02-the-key.jpg", caption: "2. The key — extreme close-up, hand only, number worn but legible." },
    { image: "/images/neonoire/keys/03-the-bar.jpg", caption: "3. The bar — the floor's-eye view: crate, counter underside, a man's shoes." },
    { image: "/images/neonoire/keys/04-veras-apartment.jpg", caption: "4. Vera's apartment — revised 16:9 master from appartment.png; no paper pendant, two cups, the corrected family photo and dry pale-blue umbrella." },
    { image: "/images/neonoire/keys/05-the-police-station.jpg", caption: "5. The police station — revised 16:9 location/wardrobe master from police_station.png; Vera and the young officer match their sheets." },
    { image: "/images/neonoire/keys/06-the-block.jpg", caption: "6. The block — stacked balconies, laundry, a train very close overhead." },
    { image: "/images/neonoire/keys/07-the-rain-scene.jpg", caption: "7. The rain scene — extreme wide, the figures tiny, the city indifferent." },
    { image: "/images/neonoire/keys/08-ozu-cutaway.jpg", caption: "8. Ozu-style cutaway — still life, no people: a shoe in a puddle." },
    { image: "/images/neonoire/keys/09-the-roadside-inn.jpg", caption: "9. The roadside inn — four sedans, masked men, seen from an upstairs window." },
  ].filter(item => existsSync(resolve(root, `public${item.image}`)))),
  boardOf("neonoire-look-cast", "Continuity — Mara, Vera and Jack", "Canonical identities, including Jack's new 48-year-old former-detective design, distinct from Daniel Voss in the family photograph. Any study that does not match these is reviewed.", [
    { image: "/images/neonoire/sheets/mara.jpg", caption: "Mara Voss — wardrobe and continuity sheet: indigo denim jacket, grey tee, black jeans, black cord necklace." },
    { image: "/images/neonoire/sheets/vera.jpg", caption: "Vera Voss — wardrobe and continuity sheet: charcoal wool coat, cream high-neck knit, navy trousers, brown boots." },
    { image: "/images/neonoire/sheets/mara-face.jpg", caption: "Mara — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/sheets/vera-face.jpg", caption: "Vera — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/sheets/jack.jpg", caption: "Jack (48) — new 16:9 identity sheet, charcoal overcoat, off-white open collar, black hair greying at the temples. Not Daniel Voss." },
    { image: "/images/neonoire/sheets/jack-face.jpg", caption: "Jack — face crop of the same generation, attached to his confrontation studies." },
    { image: "/images/neonoire/s4/35-the-photograph.jpg", caption: "Daniel Voss with Vera (9) and Mara (4), twenty years ago; this father is not Jack." },
  ].filter(item => existsSync(resolve(root, `public${item.image}`)))),
];
// A board is only carried once it has something on it: an empty board is a dead card in the app,
// and the keyframes arrive pass by pass, so the missing boards appear as their shots are generated.
const moodboards = allBoards.filter(board => board.items.length);

// ---------------------------------------------------------------- the screenplay
// The workspace's script is the whole final draft with its scene-number markers removed, so each
// scene selects its own slugline exactly; nothing else about the text changes.
const markers = countMarkers(fountain);
assert.equal(markers, feature.length, `${FOUNTAIN} should carry one #n# scene marker per scene; found ${markers} markers for ${feature.length} scenes`);
const script = cleanScript(fountain);
for (const scene of feature) assert(script.includes(`${scene.location} - ${scene.time}`), `${scene.title} must keep its slugline in the workspace script`);

// Every frame's quoted dialogue has to be in the draft — a quote that drifts is a bug, not a typo.
for (const shot of shots) {
  if (!shot.script) continue;
  assert(containsText(fountain, shot.script), `Scene ${shot.scene.n} shot ${shot.n} quotes text that is not in ${FOUNTAIN}: "${shot.script.slice(0, 80)}"`);
}

const scenes = feature.map(scene => {
  const own = scene.boarded ? shots.filter(shot => shot.scene.key === scene.key) : [];
  return {
    id: scene.id, title: scene.title, location: scene.location, time: scene.time,
    description: scene.description, characters: [...new Set(own.flatMap(shot => shot.cast.map(name => characters.find(c => c.name === name).id)))],
    actId: ACT.id, partId: scene.partId, kind: scene.kind || "Standard",
    ...(scene.lighting ? { lighting: scene.lighting } : {}),
    ...(scene.lightingNotes ? { lightingNotes: scene.lightingNotes } : {}),
    style: "neonoire",
  };
});

const project = {
  id: projectId,
  title: "NEONOIRE",
  description: `The final feature screenplay (September 2026): 100 numbered scenes, boarded so far in twelve of them \u2014 the opening seven (68 shots), the hotel and Tokyo streets, scenes 72\u201376 (shots 69\u201386) \u2014 every keyframe 16:9 (1920\u00d71080). The Screenplay tab carries the whole draft page by page; every other scene is written, not boarded. Tokyo as a memory that is still happening \u2014 sodium orange against sick fluorescent green, cold patient rain, and nothing explained`,
  genre: "Neo-noir",
  format: "Feature",
  status: "In development",
  coverImage: "/images/neonoire/s1/01-backstreet.jpg",
  acts: [ACT], scenes, frames, characters, notes, brainstorm, moodboards,
  script,
  shareId: null, createdAt, updatedAt: createdAt,
};

// ---------------------------------------------------------------- the app's own ceilings
const imagePaths = new Set([project.coverImage, ...frames.map(f => f.image).filter(Boolean), ...characters.map(c => c.image).filter(Boolean), ...moodboards.flatMap(b => b.items.map(i => i.image))]);
for (const image of imagePaths) assert(existsSync(resolve(root, `public${image}`)), `Missing image: ${image}`);
for (const c of characters) assert(c.description.length <= 700, `Shorten character description: ${c.name}`);
for (const board of moodboards) assert(board.items.length <= 40, `Mood board over 40 items: ${board.title}`);
assert.equal(scenes.length, feature.length, `Every numbered scene of the final screenplay belongs to the workspace`);
assert.equal(frames.length, totalShots);
assert.equal(characters.length, 9);

const output = resolve(root, "public", "projects", "neonoire-opening.json");
const encoded = JSON.stringify(project, null, 2) + "\n";
if (process.argv.includes("--check")) {
  assert(existsSync(output), "Run npm run build:neonoire first");
  assert.equal(readFileSync(output, "utf8"), encoded, "The NEONOIRE bundle has drifted. Run npm run build:neonoire and commit the result.");
  console.log(`NEONOIRE bundle current: ${scenes.length} scenes, ${frames.length} shots (${frames.length - missing.length} keyframes on disk, ${missing.length} placeholders), ${characters.length} cast, ${moodboards.length} mood boards.`);
} else {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, encoded);
  console.log(`Wrote ${output} (${Math.round(Buffer.byteLength(encoded) / 1024)} KB).`);
  console.log(`${frames.length - missing.length}/${frames.length} keyframes on disk; ${missing.length} placeholder cards hold their slots.`);
  for (const shot of missing) console.log(`  missing: public${imagePath(shot.scene, shot)} (pass ${passOf(shot.n)})`);
}
