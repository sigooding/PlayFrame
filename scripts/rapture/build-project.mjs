import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectId, sceneId, lockupSceneId, createdAt, characterId, characters, grammar, lockupGrammar, redLight, shotPlan, lockupPlan, outlinePlan, legacyBoards, referenceBoards } from "./plan.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = name => readFileSync(resolve(root, name), "utf8");
const bible = read("docs/rapture/show-bible.md");
const screenplay = read("docs/rapture/scenes/ep4-number-fourteen.md");
const lockupScreenplay = read("docs/rapture/scenes/ep2-first-wrong-lockup.md");
const plain = value => value.replace(/\*\*/g, "").replace(/(?<!\*)\*([^*\n]+)\*/g, "$1").replace(/`/g, "");
const sections = [...bible.matchAll(/^## (.+)\n+([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(([, title, text]) => ({ title, text: text.trim() }));
const episodes = sections.find(section => section.title === "EPISODES");
assert(episodes, "Bible must contain EPISODES");
const episodeRows = [...episodes.text.matchAll(/^\*\*(\d) — (.+?)\.\*\* (.+)$/gm)];
assert.equal(episodeRows.length, 8, "Exactly eight episode outlines are required");

const acts = episodeRows.map(([, n, title, description]) => ({
  id: `rapture-episode-${n}`,
  title: `Episode ${n} — ${title[0].toUpperCase()}${title.slice(1)}`,
  description: `45-minute episode outline, not a completed shooting script.\n\n${plain(description)}`,
  parts: [],
}));
const blocks = [...screenplay.matchAll(/^(\d+)\. (CU|MS|WS), (\d+mm), (handheld) — ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(blocks.length, 13, "The source must have thirteen numbered shots");
const numberFourteen = blocks.map(([, n, type, lens, , body], i) => {
  assert.equal(Number(n), i + 1, "Shot order must be contiguous");
  const plan = shotPlan[i];
  const source = `${n}. ${type}, ${lens}, handheld — ${body.trimEnd()}`;
  const pauses = [...source.matchAll(/A (\d+)-second pause/g)].map(m => Number(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Duration must include action/dialogue, not just pauses");
  return {
    id: `rapture-ep4-shot-${String(n).padStart(2, "0")}`, sceneId,
    title: `${plan.title}${plan.reference ? " — reference" : ""}`,
    description: body.split("\n")[0].trim(),
    image: `/images/rapture/ep4/${plan.image}`,
    shotType: { CU: "Close-up", MS: "Medium", WS: "Wide" }[type],
    movement: "Handheld", lens, angle: "Eye level", lighting: "Practical night",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: plan.reference ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, deadpan, ordinary logistics; never grief or a horror performance",
    characters: plan.characters.map(characterId),
    notes: `${plan.note}\n\n${plan.reference ? "Image: reused reference, not a completed keyframe." : "Image: AI-generated storyboard study; continuity and production approval pending."}\n\n${grammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert(numberFourteen.every(frame => ["Close-up", "Medium"].includes(frame.shotType)), "Current Crane grammar prohibits wide shots");
const lockupBlocks = [...lockupScreenplay.matchAll(/^(\d+)\. (STATIC WIDE|STATIC MEDIUM|MEDIUM|CLOSE|FLASH), (\d+mm), (locked off|static|handheld) — ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(lockupBlocks.length, 29, "The lockup source must have twenty-nine numbered shots");
assert.equal(lockupPlan.length, 29, "The lockup plan must cover all twenty-nine shots");
// Source lenses outside the app's library map to the closest option; the exact lens stays in the notes.
const lockupLens = { "135mm": "135mm", "50mm": "50mm", "35mm": "35mm", "24mm": "24mm", "40mm": "35mm", "65mm": "85mm", "28mm": "24mm", "25mm": "24mm" };
const lockupSetup = { "STATIC WIDE": "Wide", "STATIC MEDIUM": "Medium", "MEDIUM": "Medium", "CLOSE": "Close-up", "FLASH": "Insert" };
const lockupFrames = lockupBlocks.map(([, n, setup, lens, movement, body], i) => {
  assert.equal(Number(n), i + 1, "Lockup shot order must be contiguous");
  assert(lockupLens[lens], `No library lens mapped for the lockup source lens: ${lens}`);
  const plan = lockupPlan[i];
  const handheld = movement === "handheld";
  assert(handheld === (setup === "FLASH"), "Only the vision flashes are handheld in the lockup grammar");
  const source = `${n}. ${setup}, ${lens}, ${movement} — ${body.trimEnd()}`;
  return {
    id: `rapture-ep2-lockup-${String(n).padStart(2, "0")}`, sceneId: lockupSceneId,
    title: plan.title,
    description: body.split("\n")[0].trim(),
    image: "",
    shotType: lockupSetup[setup],
    movement: handheld ? "Handheld" : "Static", lens: lockupLens[lens], angle: plan.angle || "Eye level",
    lighting: plan.lighting || "Natural daylight",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: "Draft", transition: "Cut",
    mood: "Dry and procedural; Nina is unimpressed throughout, never amazed or afraid",
    characters: plan.characters.map(characterId),
    notes: `${plan.note}\n\nImage: no keyframe yet — the storyboard shows the shot-type guide until one is boarded.${lockupLens[lens] === lens ? "" : `\n\nSource lens: ${lens}; closest library lens ${lockupLens[lens]} shown.`}\n\n${lockupGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only written pauses are locked (none are timed in this scene).\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert(lockupFrames.every(frame => !frame.image), "Lockup keyframes are pending; the guide fallback must show, not a blank");
const lockupTotal = lockupFrames.reduce((n, f) => n + f.duration, 0);
assert.equal(lockupTotal, 249, "Update the timing note when lockup editorial estimates change");

const scene = {
  id: sceneId, title: "Number Fourteen", location: "EXT./INT. NUMBER FOURTEEN", time: "NIGHT",
  description: `A water stop governed by house rules and an unfinished complaint to the council. ${grammar} The table set for six is not played; the listener is never shown. This is not Pat's house.`,
  characters: ["danny", "jodie", "woman-fourteen"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Practical night", lightingNotes: redLight, style: "cinematic",
};
// Legacy boards are read from disk in filename order; a missing number becomes a
// "keyframe missing" card so the board numbering stays contiguous in the app.
const boardByScene = new Map(legacyBoards.map(board => [board.scene, board]));
const boardFiles = prefix => readdirSync(resolve(root, "public/images/rapture"))
  .filter(file => new RegExp(`^${prefix}-(\\d+)\\.jpg$`).test(file))
  .map(file => Number(file.match(/-(\d+)\.jpg$/)[1]))
  .sort((a, b) => a - b);
const boardSlots = new Map(legacyBoards.map(board => {
  const numbers = boardFiles(board.prefix);
  assert(numbers.length > 0, `Legacy board has no keyframes on disk: ${board.prefix}`);
  return [board.prefix, { numbers: new Set(numbers), last: numbers[numbers.length - 1] }];
}));
const scenes = outlinePlan.map(([ep, key, title, location, time, cast, description, kind]) => {
  const id = `rapture-ep${ep}-${key}`;
  const board = boardByScene.get(id);
  const range = board ? `${board.prefix}-01 to ${board.prefix}-${String(boardSlots.get(board.prefix).last).padStart(2, "0")}` : "";
  return {
    id, title: `${title} — outline`, location, time,
    description: board
      ? `OUTLINE ONLY — ordered legacy reference board (${range}), not approved coverage. ${description} Review every keyframe against the current grammar before production.`
      : `OUTLINE ONLY — not a numbered shooting script. ${description} Location/time are provisional unless specified by the bible.`,
    characters: cast.map(characterId), actId: `rapture-episode-${ep}`, kind: kind || "Standard",
  };
});
scenes.splice(scenes.findIndex(s => s.actId === "rapture-episode-4"), 0, scene);
const lockupScene = {
  id: lockupSceneId, title: "The first wrong lockup", location: "EXT./INT. ROADS AND AN INDUSTRIAL ESTATE", time: "DAY",
  description: `Nina drives out on a pendant bearing, opens two wrong lockups, and acquires Alan. ${lockupGrammar} The vision is the tracker's recorded view, not divine revelation. Shot 29's source ends mid-line; the remainder is pending.`,
  characters: ["nina", "alan"].map(characterId), actId: "rapture-episode-2",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: "Daylight throughout, deep focus, symmetrical locked-off framings. Long lenses for the road. Only the vision breaks the grammar: handheld, broken, wrong aspect ratio, dropped frames, blown out, a hiss.", style: "cinematic",
};
scenes.splice(scenes.findIndex(s => s.id === "rapture-ep3-arrivals"), 0, lockupScene);
assert(legacyBoards.every(board => scenes.some(s => s.id === board.scene)), "Every legacy board must attach to a listed scene");

const legacyFrames = [];
for (const board of legacyBoards) {
  const { numbers, last } = boardSlots.get(board.prefix);
  for (let n = 1; n <= last; n++) {
    const slot = String(n).padStart(2, "0");
    const file = `${board.prefix}-${slot}.jpg`;
    const missing = !numbers.has(n);
    legacyFrames.push({
      id: `rapture-board-${board.prefix}-${slot}`, sceneId: board.scene,
      title: `${board.board} — board ${slot}${missing ? " (keyframe missing)" : ""}`,
      description: missing
        ? `Slot ${n} of ${last}: ${file} is not on disk. This card holds its numbered place.`
        : `Legacy reference keyframe ${n} of ${last} (${file}). ${board.review}`,
      image: missing ? "" : `/images/rapture/${file}`,
      shotType: "Medium", movement: "Static", lens: "35mm", angle: "Eye level",
      lighting: board.lighting, style: "cinematic",
      duration: 5, durationIsEstimate: true,
      status: "Needs review", transition: "Cut",
      characters: board.cast.map(characterId),
      notes: missing
        ? `KEYFRAME MISSING — ${file} is not in public/images/rapture, so this card holds slot ${n} of ${last} and the board numbering stays contiguous. Add the keyframe and rebuild, or delete this card.`
        : `LEGACY BOARD — ordered reference keyframe, not approved coverage.\n\n${board.review}\n\nFilename: ${file} (slot ${n} of ${last}). Shot type, movement, lens and the 5s duration are working placeholders — review and correct every keyframe against the current grammar before production.`,
    });
  }
}
assert(legacyFrames.every(frame => frame.status === "Needs review" && frame.durationIsEstimate === true), "Legacy boards stay estimates awaiting review");
// Storyboard and shot list follow scene order, with each board in numeric order inside its scene.
const framesByScene = new Map();
for (const frame of [...numberFourteen, ...lockupFrames, ...legacyFrames]) {
  if (!framesByScene.has(frame.sceneId)) framesByScene.set(frame.sceneId, []);
  framesByScene.get(frame.sceneId).push(frame);
}
const frames = scenes.flatMap(s => framesByScene.get(s.id) || []);
assert.equal(frames.length, numberFourteen.length + lockupFrames.length + legacyFrames.length, "Every frame must belong to a listed scene");
const missingKeyframes = legacyFrames.filter(frame => !frame.image).map(frame => frame.description.match(/(\S+\.jpg)/)[1]);

const notes = sections.map(({ title, text }, i) => ({
  id: `rapture-bible-${i + 1}`, title: `Series bible — ${title.toLowerCase()}`,
  content: plain(text), color: i % 3 === 0 ? "sage" : i % 3 === 1 ? "sand" : "rose", createdAt,
  tags: ["Series bible", "Source"], connections: [],
}));
const legacyKeyframes = legacyFrames.filter(frame => frame.image).length;
notes.unshift({
  id: "rapture-read-me", title: "Start here — scope, timing and image status", color: "sage", createdAt,
  tags: ["Production", "Read first"],
  content: `8 × 45min British black comedy. Eight episode outlines and a cast bible are supplied; this is NOT eight completed 45-minute scripts. Number Fourteen is the one fully boarded scene, with 13 shots and a 175-second working animatic estimate. The first wrong lockup is numbered (${lockupFrames.length} shots, ${lockupTotal}-second estimate) with keyframes pending; its shot 29 source ends mid-line. Each explicit pause remains exactly as written.\n\nNine legacy reference boards (cold open, St Jude's, washing up, storage facility, police/car park, Limbo, first raid, Hell intake, Wave 3 night drive) are attached to their scenes as ordered keyframes, status Needs review — ${legacyKeyframes} keyframes${missingKeyframes.length ? ` plus ${missingKeyframes.length} cards holding the slots of missing files (${missingKeyframes.join(", ")})` : ""}. Shot type, movement, lens and the 5s durations on those boards are working placeholders; review every keyframe against the current grammar before production. Nothing outside Number Fourteen is approved coverage. Unpictured roles have deliberate initials placeholders, not missing files.\n\nThe full current source is docs/rapture/show-bible.md. The screenplay source is docs/rapture/scenes/ep4-number-fourteen.md. The original scene is preserved in scenes/archive/ep4-number-fourteen-v1.md. Use Export → Project backup to retain your edits. Re-opening the bundled workspace never overwrites a saved project.`,
  connections: [{ targetId: sceneId, label: "Number Fourteen" }],
});
notes.push({
  id: "rapture-continuity", title: "Continuity decisions and open questions", color: "rose", createdAt,
  tags: ["Continuity", "Needs review"], connections: [],
  content: `The latest series prompt takes precedence over the earlier visual canon. Danny and Jodie now have no wide establishing shots, no complete-room views and no sodium/teal look. In Number Fourteen, shot 1 is a CU/50mm of the headlight switch and shot 12 a MS/35mm of the passing van panel. All dialogue, numbered beats and pauses are unchanged. White headlights are not shown. The old version remains archived.\n\nNumber Fourteen's woman is the sheet-27 house-rules character, not Pat. The new episode-four Pat sequence remains a separate outline and has not been silently replaced by this scene. No blanks or afterlife appear in Number Fourteen. No cosmology is added to its dialogue.\n\nThe woman describes a locally intermittent upstairs tap in episode four; the series-wide upstairs failure remains episode five.\n\nMax remains flashbacks only, alive and unreachable. Episode eight says he knows where the fields are; how that knowledge reaches the upstairs action is not specified, so no present-day reunion has been invented.\n\nThe cause retains 1980, death five years later and forty-five years later exactly as supplied. A present-day calendar year has not been silently inferred. Nina remains 45.\n\nThe chained/rescued blank is not silently identified as Alan. The third field officer and the recovery angels remain unnamed. The 1980 absconder's appearance is not locked. Confirm exact van plates and jacket-pocket continuity before approving images.${missingKeyframes.length ? `\n\n${missingKeyframes.length} legacy keyframes are missing from disk and hold placeholder slots: ${missingKeyframes.join(", ")}.` : ""}\n\nThe first wrong lockup's shot 29 ends mid-line in the source (MAN: Al); shot count and dialogue will grow when the remainder arrives.`,
});

const brainstorm = [
  ["knife", 60, 80, "The knife", "Cold open → old woman's handbag → support group → Jodie. A connective object, not a catch-up conversation.", "clay", ["Object", "Continuity"], ["water"]],
  ["pendant", 460, 60, "The pendant / tracker", "Nina's bearing, everyone else's tracker. Each use costs a head start. Visions are recordings, not God's plan.", "rose", ["Object", "Permissions"], ["window"]],
  ["window", 880, 80, "The minimised window", "RAPTURES → balanced stat bars → clear past attempts → minimise. The signal draws four factions to one postcode.", "sand", ["Cause", "Convergence"], ["pendant", "auction"]],
  ["water", 60, 390, "The water clock", "Ep1 pressure complaint ignored; ep3 brown; ep5 upstairs dead; ep6 dry; ep7 dull deaths. Clean water in houses drives crime and property enforcement.", "sage", ["Season clock"], ["knife", "blank"]],
  ["blank", 460, 390, "The rescued blank", "The kindest act puts the group on Hell's map. A boring man discussing laminate flooring is an unguarded window.", "clay", ["Surveillance"], ["water", "window"]],
  ["auction", 880, 390, "Correction ≠ rewind", "Nina outbids Martin for the box at auction. ENTER. No flash, sound or score. Machine unopened. Limbo queue unchanged, outside time.", "ink", ["Ending", "Permissions"], ["window"]],
].map(([key, x, y, title, content, color, tags, connections]) => ({ id: `rapture-object-${key}`, x, y, title, content, color, tags, connections: connections.map(id => `rapture-object-${id}`), createdAt }));
const moodboards = [{
  id: "rapture-look-number-fourteen", title: "Number Fourteen — red is a source", sceneId, actId: "rapture-episode-4", createdAt,
  description: "Thirteen newly generated AI storyboard studies. Red practical sources, tight handheld, never a whole room.",
  items: numberFourteen.filter((_, i) => !shotPlan[i].reference).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, ...referenceBoards.map(board => ({
  id: `rapture-look-${board.id}`, title: board.title, description: board.description, createdAt,
  items: board.items.map(([image, caption], i) => ({ id: `rapture-${board.id}-ref-${i + 1}`, image, caption })),
}))];

const project = {
  id: projectId, title: "Let the Raptures Commence",
  description: "8 × 45min British black comedy. Four billion people sorted by a child's layout decision. Eight episode outlines; Number Fourteen is the 13-shot working scene.",
  genre: "Comedy", format: "Series", status: "In development", coverImage: "/images/rapture/ep4/04-mid-sentence.jpg",
  acts, scenes, frames, characters, notes, brainstorm, moodboards,
  script: [lockupScreenplay, screenplay].map(text => text.replace(/^#{1,2} /gm, "").replace(/^Scene: /m, "").replace(/\n---\n/g, "\n").trim()).join("\n\n"),
  shareId: null, createdAt, updatedAt: createdAt,
};

const imagePaths = new Set([project.coverImage, ...frames.map(f => f.image).filter(Boolean), ...characters.map(c => c.image).filter(Boolean), ...moodboards.flatMap(b => b.items.map(i => i.image))]);
for (const image of imagePaths) assert(existsSync(resolve(root, `public${image}`)), `Missing image: ${image}`);
for (const c of characters) assert(c.description.length <= 700, `Shorten character description: ${c.name}`);
assert.equal(numberFourteen.reduce((n, f) => n + f.duration, 0), 175, "Update the timing note when editorial estimates change");
const output = resolve(root, "public/projects/let-the-raptures-commence.json");
const encoded = JSON.stringify(project, null, 2) + "\n";
if (process.argv.includes("--check")) {
  assert(existsSync(output), "Run npm run build:rapture first");
  assert.equal(readFileSync(output, "utf8"), encoded, "Bundled project has drifted. Run npm run build:rapture and commit the result.");
  console.log(`Rapture bundle current: ${acts.length} episode outlines, ${scenes.length} scenes/outlines, ${characters.length} cast, ${frames.length} shots (${numberFourteen.length} boarded, ${lockupFrames.length} lockup, ${legacyFrames.length} legacy slots), ${imagePaths.size} image references.`);
} else {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, encoded);
  console.log(`Wrote ${output} (${Math.round(Buffer.byteLength(encoded) / 1024)} KB).`);
}
