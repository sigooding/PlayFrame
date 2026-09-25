// Builds public/projects/neonoire-opening.json from the draft and the numbered shot boards.
//
//   npm run build:neonoire            write the bundle
//   node scripts/neonoire/build-project.mjs --check   fail if the bundle has drifted
//
// Nothing is retyped: the Screenplay tab's pages are the draft's own bytes under a production
// header, every frame's script quote has to be found in the draft, and every keyframe path has to
// be a real file. Passes are ten shots at a time, which is how the keyframes are generated.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACT, FOUNTAIN, ORDER, SCENES, brainstorm, characters, cleanScript, containsText, countMarkers,
  createdAt, grammar, imagePath, pageBody, pageText, pages, parseBoard, projectId, readBoard,
  readFountain,
} from "./plan.mjs";

import { frontCounterLook } from "./front-counter-look.mjs";
import { apartmentLook } from "./apartment-look.mjs";
import { interviewLook } from "./interview-look.mjs";
import { detectivesLook } from "./detectives-look.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = file => readFileSync(resolve(root, file), "utf8");

const fountain = readFountain(root);
const slices = pages(fountain);
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
};

// ---------------------------------------------------------------- the screenplay pages
// A page is verbatim draft text under an injected production header, so the header is the only
// thing the builder may remove, and what is left has to rebuild the draft byte for byte.
for (const [i, scene] of SCENES.entries()) {
  const file = `docs/neonoire/screenplay/${ORDER[i]}`;
  assert(existsSync(resolve(root, file)), `Missing screenplay page: ${file} — run node scripts/neonoire/split-opening.mjs`);
  assert.equal(read(file), pageText(scene, slices[i]), `${file} has drifted from ${FOUNTAIN} — regenerate it with node scripts/neonoire/split-opening.mjs`);
  const lines = pageText(scene, slices[i]).split("\n");
  assert.equal(lines[0], "NEONOIRE", `${file} must open with the film's title`);
  assert(lines[3].startsWith(`${scene.location} - ${scene.time}`), `${file} must put the scene's own slugline at line 4: got "${lines[3]}"`);
  assert.equal(pageBody(pageText(scene, slices[i])), slices[i].join("\n").trim(), `${file} must carry the draft's own bytes below its header`);
}
const rebuilt = SCENES.map((scene, i) => pageBody(pageText(scene, slices[i]))).join("\n\n") + "\n";
assert.equal(rebuilt, fountain, `The seven pages must rebuild ${FOUNTAIN} exactly`);

// ---------------------------------------------------------------- the numbered shot boards
const boards = SCENES.map(scene => parseBoard(readBoard(root, scene), scene));
const shots = boards.flat();
assert.equal(shots.length, 68, `The opening is 68 numbered shots; the boards carry ${shots.length}`);
shots.forEach((shot, i) => assert.equal(shot.n, i + 1, `Shot numbering must run 1..68 across the seven scenes; found ${shot.n} at ${i + 1}`));
assert.equal(shots.length, new Set(shots.map(shot => shot.image)).size, "Two shots claim the same keyframe filename");
const missing = shots.filter(shot => !existsSync(resolve(root, `public${imagePath(shot.scene, shot)}`)));
// A frame whose study has not been generated yet is an honest placeholder, exactly as the series
// workspace does it: it holds its slot and names the missing file instead of borrowing a neighbour.
const frames = shots.map(shot => {
  const path = imagePath(shot.scene, shot);
  const absent = missing.includes(shot);
  return {
    id: `neonoire-shot-${String(shot.n).padStart(2, "0")}`,
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
    status: absent ? "Needs review" : "Draft",
    transition: shot.n === 1 ? "Fade in" : "Cut",
    mood: MOODS[shot.scene.key],
    characters: shot.cast.map(name => characters.find(c => c.name === name).id),
    notes: [
      absent
        ? `KEYFRAME MISSING — ${path} is not in public/images/neonoire/${shot.scene.key}, so this card holds slot ${shot.n} of 68 until pass ${passOf(shot.n)} is generated.`
        : `Image: AI-generated storyboard study from pass ${passOf(shot.n)}; continuity, framing and production approval pending — check the wardrobe against the cast sheets before approving.`,
      ...(shot.scene.key === "s7" ? [`Visual revision (25 September 2026): ${detectivesLook}`] : []),
      ...(shot.scene.key === "s6" ? [`Visual revision (25 September 2026): ${interviewLook}`] : []),
      ...(shot.scene.key === "s4" ? [`Visual revision (25 September 2026): ${apartmentLook}`] : []),
      ...(shot.scene.key === "s5" ? [`Visual revision (25 September 2026): ${frontCounterLook}`] : []),
      shot.note,
      shot.script ? `SCRIPT — the draft's own words for this shot:\n"${shot.script}"` : "SCRIPT — no dialogue; the shot is carried by the frame and the sound.",
      shot.scene.grammar,
      grammar,
      `Timing: ${shot.duration}s is a working estimate for animatic playback. The draft locks no durations.`,
      `Pass ${passOf(shot.n)} of 7 — ten keyframes at a time, in screenplay order. Shot ${shot.n} of 68.`,
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
    content: `NEONOIRE — the opening scenes, first draft (September 2026). 7 scenes, 68 numbered shots, 8 cast cards, and keyframes generated ten at a time in screenplay order.\n\nThe draft at the repository root (\`${FOUNTAIN}\`) is the source of truth. The Screenplay tab carries it page by page — one page per scene, the draft's own words under a production header — so what you edit in the app is what the draft says. Nothing is explained in this film and the workspace does not explain it either.\n\n**Boarding status**\n${passTable}\n\nEvery keyframe is an **AI-generated draft study**, not approved coverage. Continuous and wardrobe continuity is carried by two identity sheets (Mara, Vera) used as the reference for every frame they appear in; the notes on each frame name the sheet.`,
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
    content: `**Mara Voss (24)** and **Vera Voss (29)** are both American, both blonde with pale blue eyes, and they must read as sisters while still being told apart at a glance: Mara's hair is longer, wavier and soaked flat for the whole opening, held back by a cheap enamel clip shaped like a small red bird; the clip remains pinned through the bar scene. Vera's hair is shoulder length with a fringe and never wet — she is inside, or under cover, or has the umbrella.\n\nWardrobe is locked per sheet:\n- Mara: indigo denim jacket, heather-grey tee, black jeans, white trainers, black cord necklace, small studs and the cheap red-bird hair clip. Soaked from scene 1 until she is behind the bar counter.\n- Vera: charcoal wool coat over a cream high-neck knit, navy trousers, brown ankle boots, gold ring on the right hand, black strap watch. Carries Mara's pale blue umbrella — bone dry in the apartment, dripping on police linoleum.\n\nJack Voss, the girls' father, exists in this opening only inside one framed photograph on Vera's shelf: a rumpled suit, a smile, both daughters' hands in his, a Tokyo noodle-shop sign behind them, twenty years ago, colours gone warm and faded. He is the only saturated warm colour in the film so far and he is never spoken about.\n\nThe men in masks are never given faces: eyes above the mask, gloved hands, wet black shoes. The old man and the journalist are unnamed on purpose. Detective Ishida and the young officer are the only police with faces, and the young officer's face changes after the monitor does.`,
  },
  {
    id: "neonoire-language", title: "Language — English, Japanese, and the subtitles", color: "sand", createdAt,
    tags: ["Language", "Continuity"], connections: [],
    content: `The Voss sisters speak **English** to each other — including on the phone, including the answerphone message Vera cannot bring herself to answer.\n\nDialogue marked *(in Japanese)* is spoken in Japanese and subtitled in English, and it is never used for local colour: Mara's Japanese is halting and she is understood just barely; Vera's is fluent, careful and slightly formal, learned as a child and relearned as an adult; Ishida's English is excellent and she refuses it anyway, which is the only line either of them draws in the interview room. The old man's "twenty years" and "don't let them have it" are Japanese, and the masked man's two position reports are Japanese into a radio.\n\nThe audience is never told what the key opens, what the position reports are counting towards, or why the journalist had a notebook. Nothing is explained — that is the film's rule, and it is also the workspace's.`,
  },
  {
    id: "neonoire-keyframes", title: "What the keyframes are, and what they are not", color: "rose", createdAt,
    tags: ["Images", "Review"], connections: [],
    content: `Every frame in this storyboard is a **draft AI study** standing in for a shot that has not been photographed. They are generated in passes of ten, in screenplay order, from the boards in \`docs/neonoire/scenes/\` with the cast sheets attached as references.\n\nThey are useful for: framing, lens, blocking, light direction, wardrobe continuity, and seeing whether the scene plays in order in the animatic.\n\nThey are not: approved coverage, a lighting plan, a cast approval, or a licence to stop checking. Faces drift between passes more than anything else — if a study of Mara or Vera does not match her sheet, mark the frame **Needs review** and regenerate it. Each frame's notes carry the pass it came from.`,
  },
];

// ---------------------------------------------------------------- mood boards
const boardOf = (id, title, description, list) => ({
  id, title, description, actId: ACT.id, createdAt,
  items: list.map((item, i) => ({ id: `${id}-item-${i + 1}`, image: item.image, caption: item.caption })),
});
const framesOf = keys => frames.filter(frame => frame.image && keys.includes(frame.sceneId));
const allBoards = [
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
  boardOf("neonoire-look-cast", "Continuity — Mara, Vera and Jack", "The two identity sheets every frame of the sisters is generated against, plus the face crops used as references. Any study that does not match these gets regenerated.", [
    { image: "/images/neonoire/sheets/mara.jpg", caption: "Mara Voss — wardrobe and continuity sheet: indigo denim jacket, grey tee, black jeans, black cord necklace." },
    { image: "/images/neonoire/sheets/vera.jpg", caption: "Vera Voss — wardrobe and continuity sheet: charcoal wool coat, cream high-neck knit, navy trousers, brown boots." },
    { image: "/images/neonoire/sheets/mara-face.jpg", caption: "Mara — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/sheets/vera-face.jpg", caption: "Vera — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/s1/01-backstreet.jpg", caption: "The backstreet itself: the vending machine, the wires, the rain, and nobody in frame." },
  ].filter(item => existsSync(resolve(root, `public${item.image}`)))),
];
// A board is only carried once it has something on it: an empty board is a dead card in the app,
// and the keyframes arrive pass by pass, so the missing boards appear as their shots are generated.
const moodboards = allBoards.filter(board => board.items.length);

// ---------------------------------------------------------------- the screenplay
// The workspace's script is the whole draft with its seven scene-number markers removed, so each
// scene selects its own slugline exactly; nothing else about the text changes.
const markers = countMarkers(fountain);
assert.equal(markers, SCENES.length, `${FOUNTAIN} should carry one #n# scene marker per scene; found ${markers}`);
const script = cleanScript(fountain);
for (const scene of SCENES) assert(script.includes(`${scene.location} - ${scene.time}`), `${scene.title} must keep its slugline in the workspace script`);

// Every frame's quoted dialogue has to be in the draft — a quote that drifts is a bug, not a typo.
for (const shot of shots) {
  if (!shot.script) continue;
  assert(containsText(fountain, shot.script), `Scene ${shot.scene.n} shot ${shot.n} quotes text that is not in ${FOUNTAIN}: "${shot.script.slice(0, 80)}"`);
}

const scenes = SCENES.map(scene => {
  const own = shots.filter(shot => shot.scene.key === scene.key);
  return {
    id: scene.id, title: scene.title, location: scene.location, time: scene.time,
    description: scene.description, characters: [...new Set(own.flatMap(shot => shot.cast.map(name => characters.find(c => c.name === name).id)))],
    actId: ACT.id, partId: scene.partId, kind: scene.kind, lighting: scene.lighting,
    lightingNotes: scene.lightingNotes, style: "neonoire",
  };
});

const project = {
  id: projectId,
  title: "NEONOIRE",
  description: `The opening scenes, first draft (September 2026): 7 scenes and 68 numbered shots from a Kanda backstreet to a detectives' room three days later. The screenplay tab carries the draft page by page; the storyboard is generated in passes of ten keyframes, with Mara and Vera held to their continuity sheets. Tokyo as a memory that is still happening — sodium orange against sick fluorescent green, cold patient rain, and nothing explained.`,
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
assert.equal(scenes.length, 7);
assert.equal(frames.length, 68);
assert.equal(characters.length, 8);

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
