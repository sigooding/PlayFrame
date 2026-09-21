import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectId, sceneId, coldOpenSceneId, ep3ColdOpenSceneId, patColdOpenSceneId, patHouseSceneId, scoutHutSceneId, estateSceneId, doorstepSceneId, kitchenSceneId, therapyClassSceneId, washingUpSceneId, patsNightSceneId, lockupSceneId, ep1DannyJodieSceneId, ep1CopsSecondBeatSceneId, muggingSceneId, stJudesSceneId, createdAt, characterId, characters, grammar, coldOpenGrammar, patColdOpenGrammar, patHouseFrontGrammar, patHouseTwoGrammar, angelGrammar, scoutHutGrammar, estateGrammar, doorstepGrammar, doorstepHerGrammar, doorstepHisGrammar, kitchenGrammar, kitchenHisGrammar, kitchenHerGrammar, therapyClassGrammar, washingUpGrammar, patsNightGrammar, lockupGrammar, dannyJodieGrammar, copsSecondBeatGrammar, muggingGrammar, stJudesGrammar, redLight, shotPlan, coldOpenPlan, ep3ColdOpenPlan, patColdOpenPlan, patHousePlan, scoutHutPlan, estatePlan, doorstepPlan, kitchenPlan, therapyClassPlan, washingUpPlan, patsNightPlan, lockupPlan, dannyJodiePlan, copsSecondBeatPlan, muggingPlan, stJudesPlan, outlinePlan, legacyBoards, referenceBoards, copsFirstBeatGrammar, storageGrammar, tagGrammar } from "./plan.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = name => readFileSync(resolve(root, name), "utf8");
const bible = read("docs/rapture/show-bible.md");
const screenplay = read("docs/rapture/scenes/ep4-number-fourteen.md");
const coldOpenScreenplay = read("docs/rapture/scenes/ep4-cold-open.md");
const ep3ColdOpenScreenplay = read("docs/rapture/scenes/ep3-cold-open.md");
const patColdOpenScreenplay = read("docs/rapture/scenes/ep4-pat-cold-open.md");
const patHouseScreenplay = read("docs/rapture/scenes/ep4-pat-house.md");
const scoutHutScreenplay = read("docs/rapture/scenes/ep4-scout-hut.md");
const estateScreenplay = read("docs/rapture/scenes/ep4-housing-estate.md");
const doorstepScreenplay = read("docs/rapture/scenes/ep4-doorstep.md");
const kitchenScreenplay = read("docs/rapture/scenes/ep4-kitchen.md");
const therapyClassScreenplay = read("docs/rapture/scenes/ep5-therapy-class.md");
const washingUpScreenplay = read("docs/rapture/scenes/ep1-washing-up.md");
const patsNightScreenplay = read("docs/rapture/scenes/ep5-pats-night.md");
const lockupScreenplay = read("docs/rapture/scenes/ep2-first-wrong-lockup.md");
const dannyJodieScreenplay = read("docs/rapture/scenes/ep1-danny-jodie.md");
const copsSecondBeatScreenplay = read("docs/rapture/scenes/ep1-cops-second-beat.md");
const muggingScreenplay = read("docs/rapture/scenes/ep1-mugging.md");
const stJudesScreenplay = read("docs/rapture/scenes/ep1-st-judes.md");

// ---------------------------------------------------------------- episode one's screenplay pages
// The episode-one draft of 21 September 2026 (docs/rapture/ep1-screenplay.md) is the Screenplay
// tab's source for all eight of the episode's written scenes. docs/rapture/scenes/ep1-*.md stay as
// they are: numbered shot boards that the storyboard is built from, and nothing else. A page is
// verbatim draft text under an injected production header, so the header is the only thing the
// builder is allowed to remove, and what is left has to rebuild the draft byte for byte.
const ep1Draft = read("docs/rapture/ep1-screenplay.md");
const ep1PageFiles = [
  "ep1-01-side-street.md", "ep1-02-st-judes-house.md", "ep1-03-police-car-day.md", "ep1-04-st-judes-after.md",
  "ep1-06-storage-facility.md", "ep1-07-danny-and-jodie.md", "ep1-08-police-car-night.md", "ep1-09-hotel-room.md",
];
// Page order is the workspace's scene order, which is the draft's own running order.
const ep1PageScenes = [muggingSceneId, stJudesSceneId, "rapture-ep1-cops", washingUpSceneId, "rapture-ep1-storage", ep1DannyJodieSceneId, ep1CopsSecondBeatSceneId, "rapture-ep1-no"];
const ep1Pages = ep1PageFiles.map((file, i) => ({ file, sceneId: ep1PageScenes[i], text: read(`docs/rapture/screenplay/${file}`) }));
const EP1_PAGE_HEADER = /^(LET THE RAPTURES COMMENCE|EPISODE ONE |EXT\.|INT\.|Source: |The numbered shot board |No numbered shot board |Cast: |Grammar: |$)/;
const ep1PageBody = page => page.text.split("\n").filter((line, i) => !(i < 9 && EP1_PAGE_HEADER.test(line))).join("\n").trim();
assert.equal(ep1Pages.map(ep1PageBody).join("\n\n") + "\n", ep1Draft, "The episode-one pages must rebuild the draft of 21 September 2026 exactly — regenerate them with scripts/rapture/split-ep1-screenplay.mjs");
for (const page of ep1Pages) {
  const lines = page.text.split("\n");
  assert.equal(lines[0], "LET THE RAPTURES COMMENCE", `${page.file} must open with the series line`);
  assert(/^EPISODE ONE — /.test(lines[1]), `${page.file} must carry an EPISODE ONE line so the screenplay reads it as its own block`);
  assert(/^(INT|EXT)\./.test(lines[3]), `${page.file} must put the scene's own slugline first: ${lines[3]}`);
  // One unindented episode line per page: a second one would split the scene into two blocks and
  // the navigator would select the stub. The draft's title page indents "EPISODE ONE" for this reason.
  assert.equal(lines.filter(line => /^\s*episode\s+(one|1)\b/i.test(line) && !/^\s/.test(line)).length, 1, `${page.file} must carry exactly one episode heading at column 0`);
}
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
// Episode-four cold open: seventeen fixed surveillance angles. The comedy's timing lives in the
// burnt-in timecode, so the timecode values are reproduced verbatim; spelled pauses are honoured.
const coldOpenBlocks = [...coldOpenScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(coldOpenBlocks.length, 17, "The cold-open source must have seventeen numbered shots");
assert.equal(coldOpenPlan.length, 17, "The cold-open plan must cover all seventeen shots");
const spelledPause = value => { const v = value.toLowerCase(); return v === "six" ? 6 : v === "eight" ? 8 : v === "ten" ? 10 : v === "twelve" ? 12 : Number(v); };
const coldOpen = coldOpenBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Cold-open shot order must be contiguous");
  const plan = coldOpenPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Cold-open duration must include action/dialogue, not just pauses");
  const firstLines = body.split("\n").map(l => l.trim());
  const description = (firstLines[0].startsWith("FIXED CAM") ? firstLines[1] || firstLines[0] : firstLines[0]);
  const file = `/images/rapture/ep4-cold-open/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4co-${String(n).padStart(2, "0")}`, sceneId: coldOpenSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens: plan.lens || "24mm",
    angle: plan.angle, lighting: plan.lighting || "Overcast soft",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, deadpan surveillance comedy; the timecode does the heavy lifting and nobody reacts except Tamsin's pen",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-cold-open, so this card holds slot ${n} of ${coldOpenPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.timecode ? `\n\nBurnt-in timecode: ${plan.timecode}${plan.camera === "held" ? ", still running" : ""}.` : ""}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${coldOpenGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
const coldOpenTotal = coldOpen.reduce((n, f) => n + f.duration, 0);
assert.equal(coldOpenTotal, 172, "Update the timing note when cold-open editorial estimates change");
// Episode-three cold open: the recovery angels' first appearance, in immaculate advert
// grammar. Static setups only; source lenses outside the library map to the closest option.
const ep3ColdOpenBlocks = [...ep3ColdOpenScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(ep3ColdOpenBlocks.length, 15, "The episode-three cold-open source must have fifteen numbered shots");
assert.equal(ep3ColdOpenPlan.length, 15, "The episode-three cold-open plan must cover all fifteen shots");
const ep3Lens = { "24mm": "24mm", "50mm": "50mm", "85mm": "85mm", "28mm": "24mm" };
const ep3ColdOpen = ep3ColdOpenBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Episode-three cold-open shot order must be contiguous");
  const plan = ep3ColdOpenPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Episode-three cold-open duration must include action/dialogue, not just pauses");
  const firstLines = body.split("\n").map(l => l.trim());
  const description = (firstLines[0].includes("—") || firstLines[0] === "BLACK. TITLE CARD." ? firstLines[1] || firstLines[0] : firstLines[0]);
  const file = `/images/rapture/ep3-cold-open/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  const lens = (plan.lens && ep3Lens[plan.lens]) || "24mm";
  assert(!plan.lens || ep3Lens[plan.lens], `No library lens mapped for the angel source lens: ${plan.lens}`);
  return {
    id: `rapture-ep3co-${String(n).padStart(2, "0")}`, sceneId: ep3ColdOpenSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens,
    angle: "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, immaculate advert comedy; tremendous composition, of no use whatsoever",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep3-cold-open, so this card holds slot ${n} of ${ep3ColdOpenPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${ep3Lens[plan.lens] === plan.lens ? "" : `\n\nSource lens: ${plan.lens}; closest library lens ${lens} shown.`}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${angelGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(ep3ColdOpen.reduce((n, f) => n + f.duration, 0), 125, "Update the timing note when angel editorial estimates change");
assert(ep3ColdOpen.every(frame => frame.movement === "Static"), "The angels' cameras never move");
assert(ep3ColdOpen.every(frame => ["Wide", "Medium", "Insert", "Two-shot"].includes(frame.shotType)), "The angel grammar stays composed: wides, mediums, inserts and two-shots only");
assert(ep3ColdOpen.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep3-cold-open/")), "Angel keyframes live under /images/rapture/ep3-cold-open/");
// Episode-four cold open: Pat and Malcolm keeping house at dusk, a blank already chained
// under the floor. Surveillance with dialogue now; the burglars pick her house by chance.
const patColdOpenBlocks = [...patColdOpenScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(patColdOpenBlocks.length, 16, "The Pat cold-open source must have sixteen numbered shots");
assert.equal(patColdOpenPlan.length, 16, "The Pat cold-open plan must cover all sixteen shots");
const patOpen = patColdOpenBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Pat cold-open shot order must be contiguous");
  const plan = patColdOpenPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Pat cold-open duration must include the hold, not only it");
  const firstLines = body.split("\n").map(l => l.trim());
  const description = (firstLines[0].startsWith("FIXED CAM") ? firstLines[1] || firstLines[0] : firstLines[0]);
  const file = `/images/rapture/ep4-pat-cold-open/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4pco-${String(n).padStart(2, "0")}`, sceneId: patColdOpenSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens: "24mm",
    angle: plan.angle, lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Domestic, immaculate and wrong at dusk: the argument about method is the whole demon plot, and the smile is the only thing that is not domestic",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-pat-cold-open, so this card holds slot ${n} of ${patColdOpenPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.timecode ? `\n\nBurnt-in timecode: ${plan.timecode}${plan.camera === "held" ? ", still running" : ""}.` : ""}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${patColdOpenGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(patOpen.reduce((n, f) => n + f.duration, 0), 151, "Update the timing note when Pat cold-open editorial estimates change");
assert(patOpen.every(frame => frame.movement === "Static"), "Pat's cameras never move");
assert(patOpen.every(frame => frame.notes.includes("The camera never moves and never gets close")), "Every Pat shot carries the surveillance grammar");
assert(patOpen.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-pat-cold-open/")), "Pat keyframes live under /images/rapture/ep4-pat-cold-open/");
assert(patOpen.every(f => f.characters.every(id => [characterId("pat"), characterId("malcolm"), characterId("graham")].includes(id))), "Only Pat, Malcolm and the heard-not-seen Graham are in Pat's cold open");
assert(patOpen.filter(f => f.characters.includes(characterId("graham"))).length === 1, "Graham is the voice behind the cellar door in exactly one shot");

// Episode four Scene 2: the old-lady sequence, numbered at last. Two grammars in one
// house — her static lamplit front room, the Cranes' tight red handheld kitchen — then
// two surveillance shots and an abrupt snap back to the Crane grammar. Never blended
// within a shot.
const patHouseBlocks = [...patHouseScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(patHouseBlocks.length, 35, "The Scene 2 source must have thirty-five numbered shots");
assert.equal(patHousePlan.length, 35, "The Scene 2 plan must cover all thirty-five shots");
const patHouseGrammarFor = g => (g === "front" ? patHouseFrontGrammar : g === "demon" ? patColdOpenGrammar : `${grammar} ${redLight}`);
const patHouse = patHouseBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Scene 2 shot order must be contiguous");
  const plan = patHousePlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Scene 2 duration must include action/dialogue, not only pauses");
  const lines = body.split("\n").map(l => l.trim());
  const description = lines.slice(1).find(l => l && !/^([A-Z][A-Z'.\-() ]{0,24}):/.test(l)) || lines[0];
  const file = `/images/rapture/ep4-pat-house/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4ph-${String(n).padStart(2, "0")}`, sceneId: patHouseSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens: plan.lens,
    angle: plan.angle, lighting: plan.lighting, lightingNotes: patHouseGrammarFor(plan.g),
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: plan.g === "front" ? "Warm, flat, tidy and lamplit — a questionnaire over squash" : plan.g === "demon" ? "Surveillance returns: the house was always Hell's programme" : "Tight, dark, red torchlight — a different programme in the same house",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-pat-house, so this card holds slot ${n} of ${patHousePlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.lensSource ? `\n\nSource lens: ${plan.lensSource}; closest library lens ${plan.lens} shown.` : ""}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${patHouseGrammarFor(plan.g)}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(patHouse.reduce((sum, f) => sum + f.duration, 0), 305, "Update the timing note when Scene 2 editorial estimates change");
assert(patHouse.every((f, i) => f.movement === (patHousePlan[i].g === "crane" ? "Handheld" : "Static")), "Her grammar and the demon grammar never move; the Crane grammar always does");
assert(patHouse.every(f => f.characters.every(id => [characterId("pat"), characterId("malcolm"), characterId("danny"), characterId("jodie")].includes(id))), "Scene 2 is cast with Pat, Malcolm, Danny and Jodie only");
assert(patHouse.every((f, i) => f.notes.includes(patHousePlan[i].g === "crane" ? "Red practical sources only" : patHousePlan[i].g === "demon" ? "Fixed high-corner surveillance cameras" : "the camera never moves")), "Every Scene 2 shot carries its own grammar");
assert(patHouse.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-pat-house/")), "Scene 2 keyframes live under /images/rapture/ep4-pat-house/");

// Episode-four scene 3: the scout hut, the scene after the violence. All handheld, tight and
// red; the hi-vis MAN and the WOMAN who once did a course are unnamed group members, not cast.
const scoutHutBlocks = [...scoutHutScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(scoutHutBlocks.length, 17, "The scout-hut source must have seventeen numbered shots");
assert.equal(scoutHutPlan.length, 17, "The scout-hut plan must cover all seventeen shots");
const scoutHutLens = { "24mm": "24mm", "28mm": "24mm", "35mm": "35mm", "50mm": "50mm", "85mm": "85mm" };
const scoutHut = scoutHutBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Scout-hut shot order must be contiguous");
  assert(scoutHutLens[scoutHutPlan[i].lens], `No library lens mapped for the scout-hut source lens: ${scoutHutPlan[i].lens}`);
  const plan = scoutHutPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Scout-hut duration must include action/dialogue, not only pauses");
  const firstLines = body.split("\n").map(l => l.trim());
  const description = (firstLines[0].startsWith("HANDHELD") || firstLines[0].startsWith("INSERT") ? firstLines[1] || firstLines[0] : firstLines[0]);
  const file = `/images/rapture/ep4-scout-hut/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4hut-${String(n).padStart(2, "0")}`, sceneId: scoutHutSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Handheld", lens: scoutHutLens[plan.lens],
    angle: "Eye level", lighting: "Practical night",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, procedural aftercare; the group only cares about the water and nobody enquires",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-scout-hut, so this card holds slot ${n} of ${scoutHutPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${scoutHutLens[plan.lens] === plan.lens ? "" : `\n\nSource lens: ${plan.lens}; closest library lens ${scoutHutLens[plan.lens]} shown.`}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${scoutHutGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none specified for this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(scoutHut.reduce((n, f) => n + f.duration, 0), 159, "Update the timing note when scout-hut editorial estimates change");
assert(scoutHut.every(frame => frame.movement === "Handheld"), "The scout hut is all handheld");
assert(scoutHut.every(frame => frame.shotType !== "Extreme wide" && frame.shotType !== "Establishing"), "Never a clean wide");
assert(scoutHut.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-scout-hut/")), "Scout-hut keyframes live under /images/rapture/ep4-scout-hut/");
assert(scoutHut.every(f => f.characters.every(id => id === characterId("danny") || id === characterId("jodie"))), "Only the Cranes are cast in the scout hut");
assert(scoutHut[1].notes.includes("MAN: How much?") && scoutHut[9].notes.includes("WOMAN: Let's have a look.") && scoutHut[10].notes.includes("WOMAN: That wants antibiotics."), "The unnamed group members' dialogue survives verbatim");
assert(scoutHut[12].notes.includes("She leaves them by the gate") && scoutHut[6].notes.includes("Window frame."), "The gate arrangement and the whole of Danny's lie stay intact");

// RETAINED FROM THE EPISODE-FOUR NINA THREAD — scenes 4, 5 and 6 stay boarded alongside the
// episode-one and episode-five restructure. The night at Pat's replaces the episode-five
// basement/rescue outlines, not Nina's audit of the estate, Martin's doorstep or his kitchen.
// Episode four scene 4: the housing estate at dusk. Nina's grammar is unchanged and the hour is
// wrong for the first time: the pendant gives her a bedroom and no address, so she works thirty
// identical houses in order. Shot 2's six-second hold is the only written pause in the scene;
// shots 6–10 are the vision and the only handheld frames. Shots 8–10 carry no lens in the source.
const estateBlocks = [...estateScreenplay.matchAll(/^(\d+)\. ([^\n]+)\n([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(estateBlocks.length, 36, "The estate source must have thirty-six numbered shots");
assert.equal(estatePlan.length, 36, "The estate plan must cover all thirty-six shots");
const estate = estateBlocks.map(([, n, header, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Estate shot order must be contiguous");
  const plan = estatePlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${header}${body ? `\n${body}` : ""}`;
  const handheld = header.startsWith("FLASH"); // the source marks the vision block handheld once, in its section line; FLASH is the per-shot flag
  assert(handheld === (i >= 5 && i <= 9), "Only the five vision flashes break the locked-off grammar");
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Estate duration must cover action and dialogue, not only the hold");
  const description = body.split("\n").map(line => line.trim()).find(line => line) || header.split(" — ")[1];
  const file = `/images/rapture/ep4-estate/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  const assumedLens = /\d+mm/.test(header) ? "" : `\n\nLens: not specified in the source; ${plan.lens} is a working choice for the study, not a script direction.`;
  return {
    id: `rapture-ep4est-${String(n).padStart(2, "0")}`, sceneId: estateSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: handheld ? "Handheld" : "Static", lens: plan.lens,
    angle: plan.angle || "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry and procedural at the wrong hour: she is unimpressed, never spooked, and the estate never explains itself",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-estate, so this card holds slot ${n} of ${estatePlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.lensSource ? `\n\nSource lens: ${plan.lensSource}; closest library lens ${plan.lens} shown.` : ""}${assumedLens}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${estateGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only written pauses are locked${pauses.length ? ` (${pauses.map(p => `${p}s`).join(" + ")})` : " (none in this shot)"}.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(estate.reduce((n, f) => n + f.duration, 0), 308, "Update the timing note when estate editorial estimates change");
assert(estate.every((f, i) => (f.movement === "Handheld") === (i >= 5 && i <= 9)), "Nina's cameras never move; only the vision does");
assert(estate.every(f => f.shotType !== "Establishing"), "Her grammar composes the frame itself: no establishing card");
assert(estate.every(f => f.characters.every(id => id === characterId("nina") || id === characterId("alan"))), "Only Nina and Alan are cast on the estate; the dog is not a cast entity");
assert(estate.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-estate/")), "Estate keyframes live under /images/rapture/ep4-estate/");
assert(estate[1].notes.includes("NINA: A bedroom.") && estate[33].notes.includes("ALAN: (warmly) Well. As long as it took."), "The bus dialogue survives verbatim into the notes");
assert(estate[11].notes.includes("Which one.") && estate[26].notes.includes("Is it this one?"), "Her two questions to the estate stay in the notes");
assert(estate[6].notes.includes("PTOR") && estate[23].notes.includes("THE RAPTORS"), "The fragment and the poster are both in the notes and neither completes the other");
assert(!estate.some(f => f.characters.includes(characterId("max"))), "The boy in the fourth house is never cast as Max");
assert(estate[1].notes.includes("(6s)"), "The six-second hold in shot 2 stays locked in the timing note");
// Episode four scene 5: the doorstep. Two grammars in one building — her flat symmetrical daylight
// on the street and at the door, his off-centre fluorescent indoors — never blended inside a shot.
// Nothing moves in either one, the machine is planted without being noticed, and the snapped-off
// badge gap is never mentioned by anybody.
const doorstepBlocks = [...doorstepScreenplay.matchAll(/^(\d+)\. ([^\n]+)\n([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(doorstepBlocks.length, 32, "The doorstep source must have thirty-two numbered shots");
assert.equal(doorstepPlan.length, 32, "The doorstep plan must cover all thirty-two shots");
const doorstepIsHers = i => i < 8 || i === 31; // the street and the door are hers, the house is his, and the road takes her back
const doorstep = doorstepBlocks.map(([, n, header, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Doorstep shot order must be contiguous");
  const plan = doorstepPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${header}${body ? `\n${body}` : ""}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Doorstep duration must cover action and dialogue, not only pauses");
  const description = body.split("\n").map(line => line.trim()).find(line => line) || header.split(" — ")[1];
  const grammarFor = doorstepIsHers(i) ? doorstepHerGrammar : doorstepHisGrammar;
  const file = `/images/rapture/ep4-doorstep/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4door-${String(n).padStart(2, "0")}`, sceneId: doorstepSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens: plan.lens,
    angle: plan.angle || "Eye level", lighting: plan.lighting,
    // The frame inherits ONE grammar, its own, so a prompt built from this card cannot receive the wrong one.
    lightingNotes: grammarFor,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: doorstepIsHers(i) ? "Plain, level, daylight; a site inspection with a stranger in the way" : "Flat, off-centre and slightly wrong; a man's house arranged around a collection",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-doorstep, so this card holds slot ${n} of ${doorstepPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.lensSource ? `\n\nSource lens: ${plan.lensSource}; closest library lens ${plan.lens} shown.` : ""}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${grammarFor}\n\n${doorstepGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only written pauses are locked${pauses.length ? ` (${pauses.map(px => `${px}s`).join(" + ")})` : " (none in this shot; every other pause in the scene is a working pause)"}\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(doorstep.reduce((sum, f) => sum + f.duration, 0), 377, "Update the timing note when doorstep editorial estimates change");
assert(doorstep.every(f => f.movement === "Static"), "Neither grammar moves: the only violence here is the cut between them");
assert(doorstep.every((f, i) => (f.lighting === "Natural daylight") === doorstepIsHers(i) || i === 21), "The street is daylight, the house is flat fluorescent, and the pendant is the one frame lit from inside the shot");
assert(doorstep.every(f => f.characters.every(id => [characterId("nina"), characterId("martin"), characterId("alan")].includes(id))), "The doorstep is cast with Nina, Martin and Alan in the bus only");
assert.deepEqual(doorstep.map((f, i) => f.characters.includes(characterId("alan")) ? i : -1).filter(i => i >= 0), [5, 31], "Alan is seen only through the bus glass: the doorstep and the last frame on the road");
assert(doorstep.every(f => f.shotType !== "Establishing"), "Both grammars compose the frame themselves: no establishing card");
assert(doorstep.every((f, i) => (f.lightingNotes === doorstepHerGrammar) === doorstepIsHers(i)), "Every doorstep frame inherits exactly one grammar, never both and never neither");
assert(doorstep[8].notes.includes("a hair wrong in the composition") && !doorstep[7].notes.includes("a hair wrong in the composition"), "His grammar starts at shot 9 and her street never takes it on");
assert(doorstep[17].notes.includes("unbranded") && doorstep[18].notes.includes("printer"), "The machine is planted in an ordinary insert and she does not clock it");
assert(doorstep[21].notes.includes("no lens flare") && doorstep[21].notes.includes("forty-five years"), "The pendant light is mechanical, not miraculous");
assert.equal(doorstep.filter(f => /snapped off/i.test(f.description)).length, 1, "The snapped-off badge gap appears in the insert and is mentioned by nobody, ever");
assert(doorstep[13].notes.includes("THE RAPTORS") && doorstep[13].notes.includes("Correctly spelled"), "The poster is in the shot source and spelled correctly, unlike the vision fragment");
assert(doorstep.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-doorstep/")), "Doorstep keyframes live under /images/rapture/ep4-doorstep/");
assert(new Set(doorstep.filter(f => f.image).map(f => f.image)).size === doorstep.filter(f => f.image).length, "One dedicated keyframe per doorstep shot");

// Episode four scene 6: the kitchen. He is told his son is in a queue, that the machine upstairs is the
// only thing that might get him out, and that the answer is his brother — the brother he has not spoken to
// since bidding against him at the same kind of auction in 2011. His grammar holds all the way through:
// fluorescent, flat, off-centre, locked off, so her symmetry never organises his house. Two protections are
// enforced below: she asks once and waits (shot 15), and "It's mine" is played with no emphasis at all
// (shot 19). From the last frame of this scene the machine travels in the back of the bus.
const kitchenBlocks = [...kitchenScreenplay.matchAll(/^(\d+[a-z]?)\. ([^\n]+)\n([\s\S]*?)(?=^\d+[a-z]?\. |$(?![\s\S]))/gm)];
assert.equal(kitchenBlocks.length, 24, "The kitchen source must have twenty-four numbered shots");
assert.equal(kitchenPlan.length, 24, "The kitchen plan must cover all twenty-four shots");
const kitchenIsHers = i => i >= 21; // the street only: the house stays his
const kitchen = kitchenBlocks.map(([, n, header, rawBody], i) => {
  const expectedOrder = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","22a","23"];
  assert.equal(n, expectedOrder[i], `Kitchen shot order must be contiguous, expected ${expectedOrder[i]} got ${n}`);
  const plan = kitchenPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${header}${body ? `\n${body}` : ""}`;
  const pauses = [...source.matchAll(/(\d+|six|eight|ten|twelve)[- ]second/gi)].map(m => spelledPause(m[1]));
  assert(plan.duration > pauses.reduce((sum, value) => sum + value, 0), "Kitchen durations must cover dialogue as well as the written pauses");
  const description = body.split("\n").map(line => line.trim()).find(line => line) || header.split(" — ")[1];
  const grammarFor = kitchenIsHers(i) ? kitchenHerGrammar : kitchenHisGrammar;
  const file = `/images/rapture/ep4-kitchen/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep4kit-${String(n).padStart(2, "0")}`, sceneId: kitchenSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description,
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens: plan.lens,
    angle: plan.angle || "Eye level", lighting: plan.lighting,
    lightingNotes: grammarFor,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: kitchenIsHers(i) ? "Squared up at last, and no better for it" : "Fluorescent, flat, a hair wrong; a kitchen that will not line up",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep4-kitchen, so this card holds slot ${n} of ${kitchenPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${plan.lensSource && plan.lensSource !== plan.lens ? `\n\nSource lens: ${plan.lensSource}; closest library lens ${plan.lens} shown.` : ""}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${grammarFor}\n\n${kitchenGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only written pauses are locked${pauses.length ? ` (${pauses.map(px => `${px}s`).join(" + ")})` : " (none in this shot)"}, and the two silences in shots 5 and 15 are not to be shortened.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(kitchen.reduce((sum, f) => sum + f.duration, 0), 365, "Update the timing note when the kitchen editorial estimates change");
assert(kitchen.every(f => f.movement === "Static"), "Locked off all the way through: the scene has no camera movement at all");
assert(kitchen.every((f, i) => (f.lighting === "Natural daylight") === kitchenIsHers(i)), "Fluorescent in the house, daylight on the street, and nothing in between");
assert(kitchen.every((f, i) => (f.lightingNotes === kitchenHerGrammar) === kitchenIsHers(i)), "Every kitchen frame inherits exactly one grammar, never both and never neither");
assert(kitchen.filter((f, i) => !kitchenIsHers(i)).every(f => f.description.length > 0), "His grammar holds even in the frames that are only furniture");
assert.deepEqual(kitchen.map((f, i) => f.shotType === "Insert" ? i : -1).filter(i => i >= 0), [1, 8], "The tap and the mug are the only inserts: the scene refuses to cut to the machine");
assert(/brown/i.test(kitchen[1].description) && /Nobody turns it off/i.test(kitchen[1].description), "The tap runs brown and the refusal to shut it off stays in shot 2, exactly where the script put it");
assert(kitchen.filter(f => /turn(?:s|ed)? it off/i.test(f.description)).length === 1 && kitchen.filter(f => /brown/i.test(f.description)).length === 1, "The brown water is stated once, unemphasised, and is never paid off with a cut");
assert(kitchen[12].description.includes("Do you know anybody who could work it?"), "She asks once");
assert(kitchen[14].notes.includes("Eight seconds") || kitchen[14].notes.includes("eight seconds"), "The eight-second wait is written into the card so it survives the animatic");
assert(kitchen[14].duration >= 16, "The wait cannot be cut for length without asking first");
assert(kitchen[18].notes.includes("It's mine.") && kitchen.filter(f => /It's mine\./.test(f.notes)).length === 1, "The most honest thing Martin says in the series sits in one frame and is quoted nowhere else");
assert(kitchen.filter(f => /2011/.test(f.description + f.notes)).length === 1, "2011 is stated once, in the grievance, and nowhere else");
assert(kitchen[16].notes.includes("bid against him"), "The auction becomes the show's engine in shot 17 and stays a family quarrel");
assert(kitchen[21].notes.includes("back of the bus") && kitchen[21].notes.includes("terminal"), "STANDING RULE: the machine travels in the back of the bus from this frame onward");
assert(kitchen[22].notes.includes("back of the bus") && /terminal/i.test(kitchen[22].notes), "22a makes explicit the terminal wrapped in the duvet going into the back between water containers");
assert(/still open/i.test(kitchen[23].description) && /Nobody shuts it/i.test(kitchen[23].description), "The house is left with its door open and the scene declines to close it");
assert(kitchen.every(f => f.characters.every(id => [characterId("nina"), characterId("martin")].includes(id))), "Nobody else is in the kitchen");
assert.deepEqual(kitchen.map((f, i) => f.characters.includes(characterId("nina")) && !f.characters.includes(characterId("martin")) ? i : -1).filter(i => i >= 0), [4, 12, 14, 17, 19], "Her alone frames are the ones where she is deciding, not reacting");
assert(kitchen.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-kitchen/")), "Kitchen keyframes live under /images/rapture/ep4-kitchen/");
assert(new Set(kitchen.filter(f => f.image).map(f => f.image)).size === kitchen.filter(f => f.image).length, "One dedicated keyframe per kitchen shot");

// Therapy class — episode five, 26 shots, handheld close faces
const therapyClassBlocks = [...therapyClassScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(therapyClassBlocks.length, 26, "Therapy class source must have 26 numbered shots");
assert.equal(therapyClassPlan.length, 26, "Therapy class plan must cover all 26 shots");
const therapyClassLens = { "35mm": "35mm", "50mm": "50mm", "28mm": "24mm" };
const therapyClass = therapyClassBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Therapy class shot order must be contiguous");
  assert(therapyClassLens[therapyClassPlan[i].lens], `No library lens mapped for therapy class source lens: ${therapyClassPlan[i].lens}`);
  const plan = therapyClassPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/ep5-therapy-class/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep5tc-${String(n).padStart(2, "0")}`, sceneId: therapyClassSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Handheld", lens: therapyClassLens[plan.lens],
    angle: "Eye level", lighting: "Practical night",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, deadpan ensemble, funniest scene reasoning backwards from dead dog to divine mandate",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep5-therapy-class, so this card holds slot ${n} of ${therapyClassPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${(plan.lensSource || plan.lens) !== therapyClassLens[plan.lens] ? `\n\nSource lens: ${plan.lensSource || plan.lens}; closest library lens ${therapyClassLens[plan.lens]} shown.` : ""}${missing ? "" : "\n\nImage: AI-generated storyboard study; continuity and production approval pending."}\n\n${therapyClassGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked (none timed except long hold in 13).\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(therapyClass.reduce((n, f) => n + f.duration, 0), 270, "Update timing when therapy class estimates change");

// Washing up — Episode One Scene 3, 26 shots, FIX 4 pendant mother's always had it
const washingUpBlocks = [...washingUpScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(washingUpBlocks.length, 26, "Washing up source must have 26 numbered shots");
assert.equal(washingUpPlan.length, 26, "Washing up plan must cover all 26 shots");
// Source lens 65mm is outside the app's library; 85mm is the closest option and the exact lens
// stays in the card notes, exactly as the lockup scene already handles it.
const washingUpLens = { "35mm": "35mm", "50mm": "50mm", "65mm": "85mm", "85mm": "85mm" };
const washingUp = washingUpBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Washing up shot order must be contiguous");
  assert(washingUpLens[washingUpPlan[i].lens], `No library lens mapped for washing up source lens: ${washingUpPlan[i].lens}`);
  const plan = washingUpPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/ep1-washing-up/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep1wu-${String(n).padStart(2, "0")}`, sceneId: washingUpSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: "Static", lens: washingUpLens[plan.lens],
    angle: "Eye level", lighting: "Natural daylight",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, procedural, daylight, locked off symmetrical; only vision handheld",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep1-washing-up, so this card holds slot ${n} of ${washingUpPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${(plan.lensSource || plan.lens) !== washingUpLens[plan.lens] ? `\n\nSource lens: ${plan.lensSource || plan.lens}; closest library lens ${washingUpLens[plan.lens]} shown.` : ""}${missing ? "" : "\n\nImage: AI-generated storyboard study; continuity and production approval pending."}\n\n${washingUpGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only pauses in script are locked.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(washingUp.reduce((n, f) => n + f.duration, 0), washingUpPlan.reduce((n, p) => n + p.duration, 0), "Update timing when washing up estimates change");

// The night at Pat's — Episode Five, 51 shots, no CCTV, two grammars only
const patsNightBlocks = [...patsNightScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(patsNightBlocks.length, 51, "Pat's night source must have 51 numbered shots");
assert.equal(patsNightPlan.length, 51, "Pat's night plan must cover all 51 shots");
// Two source lenses here are outside the app's library. 32mm — the cops' windscreen two-shot, the
// scene's stated grammar — and 28mm both map to 35mm, which is what the legacy police/car-park
// board already uses for the same static two-shot, so the cops keep one lens language across the
// series. 65mm maps to 85mm as elsewhere. Every exact source lens is carried on the card as
// lensSource, so nothing is lost by the mapping.
const patsNightLens = { "32mm": "35mm", "24mm": "24mm", "35mm": "35mm", "50mm": "50mm", "28mm": "35mm", "65mm": "85mm", "85mm": "85mm", "135mm": "135mm" };
const patsNight = patsNightBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Pat's night shot order must be contiguous");
  assert(patsNightLens[patsNightPlan[i].lens], `No library lens mapped for Pat's night source lens: ${patsNightPlan[i].lens}`);
  const plan = patsNightPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/ep5-pats-night/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep5pn-${String(n).padStart(2, "0")}`, sceneId: patsNightSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens: patsNightLens[plan.lens],
    angle: plan.angle || "Eye level", lighting: plan.lighting || "Practical night",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: plan.movement === "Static" ? "Dry, deadpan static two-shot through windscreen, five people in it now" : "Handheld close dark red torchlight, demons only ever seen in someone's torch beam",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep5-pats-night, so this card holds slot ${n} of ${patsNightPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${(plan.lensSource || plan.lens) !== patsNightLens[plan.lens] ? `\n\nSource lens: ${plan.lensSource || plan.lens}; closest library lens ${patsNightLens[plan.lens]} shown.` : ""}${missing ? "" : "\n\nImage: AI-generated storyboard study; continuity and production approval pending."}\n\n${patsNightGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert.equal(patsNight.reduce((n, f) => n + f.duration, 0), patsNightPlan.reduce((n, p) => n + p.duration, 0), "Update timing when Pat's night estimates change");




assert(coldOpen.every(frame => frame.movement === "Static"), "Cold-open cameras never move");
assert(coldOpen.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-cold-open/")), "Cold-open keyframes live under /images/rapture/ep4-cold-open/");
const lockupBlocks = [...lockupScreenplay.matchAll(/^(\d+)\. (STATIC WIDE|STATIC MEDIUM|MEDIUM|CLOSE|FLASH), (\d+mm), (locked off|static|handheld) — ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(lockupBlocks.length, 31, "The lockup source must have thirty-one numbered shots");
assert.equal(lockupPlan.length, 31, "The lockup plan must cover all thirty-one shots");
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
    image: `/images/rapture/ep2-lockup/${plan.image}`,
    shotType: lockupSetup[setup],
    movement: handheld ? "Handheld" : "Static", lens: lockupLens[lens], angle: plan.angle || "Eye level",
    lighting: plan.lighting || "Natural daylight",
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: "Draft", transition: "Cut",
    mood: "Dry and procedural; Nina is unimpressed throughout, never amazed or afraid",
    characters: plan.characters.map(characterId),
    notes: `${plan.note}\n\nImage: AI-generated storyboard study; continuity and production approval pending.${lockupLens[lens] === lens ? "" : `\n\nSource lens: ${lens}; closest library lens ${lockupLens[lens]} shown.`}\n\n${lockupGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only written pauses are locked (none are timed in this scene).\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
assert(lockupFrames.every(frame => frame.image.startsWith("/images/rapture/ep2-lockup/")), "Lockup keyframes live under /images/rapture/ep2-lockup/");
assert.equal(new Set(lockupFrames.map(frame => frame.image)).size, 31, "One dedicated keyframe per lockup shot");
const lockupTotal = lockupFrames.reduce((n, f) => n + f.duration, 0);
assert.equal(lockupTotal, 271, "Update the timing note when lockup editorial estimates change");

// Episode One new scenes — Danny and Jodie (21 shots) and Cops second beat (6 shots)
// Both use the same parsing pattern as other scenes; lenses outside library map to closest.

const dannyJodieBlocks = [...dannyJodieScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(dannyJodieBlocks.length, 21, "Danny and Jodie source must have 21 numbered shots");
assert.equal(dannyJodiePlan.length, 21, "Danny and Jodie plan must cover all 21 shots");
const dannyJodieLensMap = { "28mm": "24mm", "35mm": "35mm", "50mm": "50mm", "85mm": "85mm", "100mm": "85mm" };
const dannyJodieFrames = dannyJodieBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Danny and Jodie shot order must be contiguous");
  const plan = dannyJodiePlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/ep1-danny-jodie/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  const lens = dannyJodieLensMap[plan.lens] || plan.lens;
  return {
    id: `rapture-ep1dj-${String(n).padStart(2, "0")}`, sceneId: ep1DannyJodieSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens,
    angle: plan.angle || "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, deadpan, tight and dark; she's better at it and knows it without cruelty",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep1-danny-jodie, so this card holds slot ${n} of ${dannyJodiePlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}${dannyJodieLensMap[plan.lens] === plan.lens ? "" : `\n\nSource lens: ${plan.lens}; closest library lens ${lens} shown.`}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${dannyJodieGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked (none timed in this scene).\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
const dannyJodieTotal = dannyJodieFrames.reduce((n, f) => n + f.duration, 0);

const copsSecondBeatBlocks = [...copsSecondBeatScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(copsSecondBeatBlocks.length, 6, "Cops second beat source must have 6 numbered shots");
assert.equal(copsSecondBeatPlan.length, 6, "Cops second beat plan must cover all 6 shots");
const copsSecondBeatFrames = copsSecondBeatBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Cops second beat shot order must be contiguous");
  const plan = copsSecondBeatPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/ep1-cops-second/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep1c2-${String(n).padStart(2, "0")}`, sceneId: ep1CopsSecondBeatSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens: plan.lens,
    angle: "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, deadpan, worse note than it started; the bottle untouched",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture/ep1-cops-second, so this card holds slot ${n} of ${copsSecondBeatPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}\n\n${missing ? "" : "Image: AI-generated storyboard study; continuity and production approval pending.\n\n"}${copsSecondBeatGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked (none timed except 4s and 6s holds).\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
const copsSecondBeatTotal = copsSecondBeatFrames.reduce((n, f) => n + f.duration, 0);

const muggingBlocks = [...muggingScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(muggingBlocks.length, 19, "Mugging screenplay source must have 19 numbered shots");
assert.equal(muggingPlan.length, 19, "Mugging plan must cover all 19 shots");
const muggingFrames = muggingBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "Mugging shot order must be contiguous");
  const plan = muggingPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep1mug-${String(n).padStart(2, "0")}`, sceneId: muggingSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens: plan.lens,
    angle: "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Flat, deadpan, the camera keeps operating; the violence is texture",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture, so this card holds slot ${n} of ${muggingPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}\n\n${missing ? "" : "Image: legacy reference keyframe; review against the current grammar before production.\n\n"}${muggingGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
const muggingTotal = muggingFrames.reduce((n, f) => n + f.duration, 0);

const stJudesBlocks = [...stJudesScreenplay.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
assert.equal(stJudesBlocks.length, 19, "St Jude's screenplay source must have 19 numbered shots");
assert.equal(stJudesPlan.length, 19, "St Jude's plan must cover all 19 shots");
const stJudesFrames = stJudesBlocks.map(([, n, rawBody], i) => {
  assert.equal(Number(n), i + 1, "St Jude's shot order must be contiguous");
  const plan = stJudesPlan[i];
  const body = rawBody.trimEnd();
  const source = `${n}. ${body}`;
  const file = `/images/rapture/${plan.image}`;
  const missing = !existsSync(resolve(root, `public${file}`));
  return {
    id: `rapture-ep1stj-${String(n).padStart(2, "0")}`, sceneId: stJudesSceneId,
    title: `${plan.title}${missing ? " (keyframe missing)" : ""}`,
    description: body.split("\n")[0].trim(),
    image: missing ? "" : file,
    shotType: plan.shotType, movement: plan.movement, lens: plan.lens,
    angle: "Eye level", lighting: plan.lighting,
    style: "cinematic", duration: plan.duration, durationIsEstimate: true,
    status: missing ? "Needs review" : "Draft", transition: "Cut",
    mood: "Dry, procedural, never amazed or afraid; the rapture is texture",
    characters: plan.characters.map(characterId),
    notes: `${missing ? `KEYFRAME MISSING — ${plan.image} is not in public/images/rapture, so this card holds slot ${n} of ${stJudesPlan.length}. Add the study and rebuild.\n\n` : ""}${plan.note}\n\n${missing ? "" : "Image: legacy reference keyframe; review against the current grammar before production.\n\n"}${stJudesGrammar}\n\nTiming: ${plan.duration}s is a working total-shot estimate for animatic playback. Only the pauses in the script are locked.\n\nNUMBERED SCRIPT — dialogue and action remain in sequence:\n${source}`,
  };
});
const stJudesTotal = stJudesFrames.reduce((n, f) => n + f.duration, 0);
// Every scene maps its source lenses to the app's library; a mapping that lands outside it would
// produce a bundle the workspace refuses to open, so check all of them here rather than at runtime.
const lensLibrary = ["14mm", "24mm", "35mm", "50mm", "85mm", "135mm", "Anamorphic"];
for (const [name, map] of Object.entries({ ep3Lens, scoutHutLens, therapyClassLens, washingUpLens, patsNightLens, lockupLens, dannyJodieLensMap })) {
  for (const [source, library] of Object.entries(map)) assert(lensLibrary.includes(library), `${name} maps ${source} to ${library}, which is not in the app's lens library`);
}



// The cold open precedes Number Fourteen in episode four: five hours of fixed surveillance,
// then the water stop. Not Pat's house, and not the chained blank's cellar.
// The angels' cold open precedes the episode-three outline: immaculate, useless, in step.
// Episode One new scenes — revised running order
const dannyJodieScene = {
  id: ep1DannyJodieSceneId, title: "Danny and Jodie", location: "INT./EXT. A HOUSE", time: "DUSK",
  description: "Three weeks in, first appearance. They do this now, and she's better at it. Handheld, tight, dark, red practical light — her bike light clipped to her coat in the draft. Never a clean wide. Rules: nothing off anyone who's still alive, nothing off the dead that's got a name on it, no upstairs, and check the cistern. A going-out coat on the bannister, twenty photographs of the same two people, one dull thump, and header tank's better.",
  characters: ["danny", "jodie"].map(characterId), actId: "rapture-episode-1",
  kind: "Standard", lighting: "Practical night", lightingNotes: dannyJodieGrammar, style: "cinematic",
};
const copsSecondBeatScene = {
  id: ep1CopsSecondBeatSceneId, title: "The cops, second beat", location: "INT. POLICE CAR (PARKED)", time: "NIGHT",
  description: "Ninety seconds, written verbatim in the episode-one draft. Static two-shot from the bonnet, same bottle untouched. He'll be all right, that lad; I only tasered him; there's a form — have you got the form — no — then there isn't a form. Ends the episode's comic thread on a worse note than it started: who do you think's in charge now, Us, with no hesitation whatsoever.",
  characters: ["kath", "ray"].map(characterId), actId: "rapture-episode-1",
  kind: "Standard", lighting: "Practical night", lightingNotes: copsSecondBeatGrammar, style: "cinematic",
};
const muggingScene = {
  id: muggingSceneId, title: "The mugging", location: "EXT. SIDE STREET", time: "EARLY MORNING",
  description: "Cold open, written in the episode-one draft of 21 September 2026: still dark, sodium light, a cashpoint glowing to itself. She hands the bag over the way you'd hand over a bus pass and he isn't there mid-reach. The knife drops, rings, lies still; she looks up, is embarrassed to have done it, and bags the knife in a tissue. It starts its journey through her handbag and the support group. No mechanism revealed, no cast assigned. The nineteen-shot alley board is superseded by this page and has not been re-boarded.",
  characters: [], actId: "rapture-episode-1",
  kind: "Cold open", lighting: "Practical night", lightingNotes: muggingGrammar, style: "cinematic",
};
const stJudesScene = {
  id: stJudesSceneId, title: "St Jude's and the rapture", location: "INT./EXT. ST JUDE'S HOUSE", time: "MORNING",
  description: "Written in the episode-one draft: pebbledash, a wheelie bin on its side, and a sign that means Terry personally. The charger, four weeks Thursday, fourteen on the phone and twenty-two in the ledger, the upstairs bins already done, forty minutes of water pressure timed, and Maureen's hypothetical. Then twenty residents at breakfast and the rapture mid-anecdote — no flash, no sound, no score, the radio carries on and the dog stays under the table. All that food. The nineteen-shot board predates this page and has not been re-boarded.",
  characters: ["nina", "brian", "terry", "col", "deborah", "maureen"].map(characterId), actId: "rapture-episode-1",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: stJudesGrammar, style: "cinematic",
};
// Three scenes the episode-one draft writes that this workspace has never boarded: the cops' first
// beat, Martin at the storage facility and the 1980 tag. They get their page, their slugline and
// their grammar; their shots stay exactly as they are, which for two of them is a legacy reference
// board belonging to the older outline.
const copsFirstBeatScene = {
  id: "rapture-ep1-cops", title: "The cops — birds, arrest ourselves, the taser", location: "INT. POLICE CAR (PARKED)", time: "DAY",
  description: "WRITTEN, NOT BOARDED — no numbered shot board yet. Written in the episode-one draft: a patrol car across two bays in a car park full of abandoned cars. There's no birds; some of them'll have been in cages; we should arrest ourselves; it's what we signed up for; to teach moral justice — you did — sounds like me. Then the man in the blue coat, a quarter of a tonne of water, the taser fired at a man already stopping, the caution recited to nobody, and there's no court yet. The ordered legacy reference board (a1s4) belongs to the older outline, is not approved coverage, and stays needs review.",
  characters: ["kath", "ray"].map(characterId), actId: "rapture-episode-1",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: copsFirstBeatGrammar, style: "cinematic",
};
const storageScene = {
  id: "rapture-ep1-storage", title: "Martin at the storage facility", location: "INT. STORAGE FACILITY", time: "DAY",
  description: "WRITTEN, NOT BOARDED — no numbered shot board yet. Written in the episode-one draft as SUPER: THREE MONTHS EARLIER, a pre-rapture flashback, because the machine has to have sat in Max's room for eight weeks by the present. DECEASED ESTATE — ELECTRICALS, MISC, GABE HOLLAND underlined twice in biro; the padlock takes three attempts; the itemised 1980 hotel bill read like scripture; the tour jacket tried on, folded badly and put back; four bars of DON'T CALL ME HOME played badly; MAX: what time u back, ringing out. The unbranded beige housing with something snapped off the top goes in with three other dead machines and is never remarked on. The ordered legacy reference board (a1s4 storage facility) belongs to the older outline and stays needs review.",
  characters: ["martin"].map(characterId), actId: "rapture-episode-1",
  kind: "Flashback", lighting: "High key", lightingNotes: storageGrammar, style: "cinematic",
};
const tagScene = {
  id: "rapture-ep1-no", title: "Tag — 1980", location: "INT. HOTEL ROOM", time: "DAY",
  description: "WRITTEN, NOT BOARDED — no numbered shot board yet. Written in the episode-one draft as SUPER: 1980: an ordinary hotel room, the air distorting near the foot of the bed, a man assembling like a photograph developing. The tracker snapped off the casing and pocketed without much thought; USER PARAMETERS with SOCIAL STATUS left alone; the beard approved; the guitar arriving; four months of afternoon going dark while DON'T CALL ME HOME comes together; IMAGE = ROCK STAR; the half-second backstage flash of something fastened round a laughing young woman's neck. Months later, a different hotel, the same geometry: ERROR, UNDO?, a cursor blinking for a long time, NO. The bible's five-years-later death chronology and this page's MONTHS LATER are both recorded and not silently reconciled.",
  characters: ["absconder"].map(characterId), actId: "rapture-episode-1",
  kind: "Tag", lighting: "Practical night", lightingNotes: tagGrammar, style: "cinematic",
};

const ep3ColdOpenScene = {
  id: ep3ColdOpenSceneId, title: "Cold open — the recovery angels", location: "EXT./INT. A PARK AND A GARDEN CENTRE", time: "DAY",
  description: "Hariel and Soqed locate nothing in an advert. The unnamed blank between the pallets is nobody's and joins no cast list.",
  characters: ["angel-one", "angel-two"].map(characterId), actId: "rapture-episode-3",
  kind: "Standard", lighting: "Golden hour", lightingNotes: angelGrammar, style: "cinematic",
};
// Pat's house at dusk, before the burglars pick it by chance: the audience knows first,
// the characters never do, and the blank under the floor apologises through a locked door.
const patColdOpenScene = {
  id: patColdOpenSceneId, title: "Cold open — Pat's house", location: "INT. PAT'S HOUSE", time: "DUSK",
  description: "A demon keeping house at dusk while Graham is chained under the floor: the photographs, the sweet tin, the cupboard of water she never drinks, Malcolm washing to the elbow, Graham's apology from behind a locked door, and one smile at an empty window. She is waiting for nothing; the burglars pick her house by chance.",
  characters: [characterId("pat"), characterId("malcolm"), characterId("graham")], actId: "rapture-episode-4",
  kind: "Standard", lighting: "Blue hour", lightingNotes: patColdOpenGrammar, style: "cinematic",
};
// Scene 3: the scout hut after the violence. Nobody asks where the water came from.
const scoutHutScene = {
  id: scoutHutSceneId, title: "The scout hut", location: "INT. THE SCOUT HUT", time: "EVENING",
  description: "The scene after the violence. He is bleeding, he has to explain nothing to anyone, and the group's only interest is the water. Four holes in a row that everyone decides not to see.",
  characters: ["danny", "jodie"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Practical night", lightingNotes: scoutHutGrammar, style: "cinematic",
};
const therapyClassScene = {
  id: therapyClassSceneId, title: "Therapy class", location: "INT. THE SCOUT HUT", time: "DAY",
  description: "Revised therapy class — 26 shots, handheld close faces, circle not quite circle, red fire door light + tarpaulin, never wide. Episode five placement, water brown and rationed. Protections: shot 13 silence long, hi-vis what we're for invented on spot, Carl never says what he did.",
  characters: ["danny", "jodie"].map(characterId), actId: "rapture-episode-5",
  kind: "Standard", lighting: "Practical night", lightingNotes: therapyClassGrammar, style: "cinematic",
};
const washingUpScene = {
  id: washingUpSceneId, title: "Washing up", location: "INT./EXT. ST JUDE'S", time: "LATER",
  description: "Nina Sc 3 — the draft's ST JUDE'S - AFTER: twenty breakfasts scraped into a bin bag including Terry's, twenty covers washed up, the dog, the gas off at the meter and on again to be sure, six beds stripped, Col's drawer, Maureen's two jars, three digits and no answer, GONE OUT. DO NOT TOUCH THE BOILER. — N., the minibus catching on the second turn, weak brown water, the pendant her mother's from her own bedside drawer, the first vision in the corridor, and the road. FIX 4 stands: the pendant is her mother's and she always had it, shot 18 is cut and holds its slot, shots 23-24 are her own room and a practical decision. The 26-shot board is not yet re-ordered to this page.",
  characters: ["nina"].map(characterId), actId: "rapture-episode-1",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: washingUpGrammar, style: "cinematic",
};
const patsNightScene = {
  id: patsNightSceneId, title: "The night at Pat's", location: "EXT./INT. PAT'S ROAD AND HOUSE", time: "NIGHT",
  description: "Replaces previous Pat's house version. No CCTV anywhere. Two grammars only: cops static two-shot through windscreen 32mm locked off handheld only for violence, Danny and Jodie handheld close dark red torchlight, demons only ever seen in someone's torch beam. 51 shots: stakeout, six bottles at gate, Jodie door under stairs, Neil chained bike lock 1234 laminate, slippers tea mouth too wide, chaotic, head turned all way round, first handheld for cops, taser form, secure premises, knife fork fish slice black eyes smiling, Out, Bring my bottles back love, five people in car grammar restored, That was drugs, arrested forever, Say sorry I can only apologise first one, evidence, laminate, tiny headlights 135mm CUT.",
  characters: ["kath", "ray", "danny", "jodie", "pat", "malcolm", "rescued-blank"].map(characterId), actId: "rapture-episode-5",
  kind: "Standard", lighting: "Practical night", lightingNotes: patsNightGrammar, style: "cinematic",
};
// Scene 4: the housing estate at dusk. The pendant gives her a bedroom and no address, so she
// audits thirty identical semis the way she would check a building for a gas leak.
const estateScene = {
  id: estateSceneId, title: "The housing estate", location: "EXT./INT. A HOUSING ESTATE", time: "DUSK",
  description: "Scene 4: she is looking for a child's bedroom and has no idea whose or why. A cul-de-sac of thirty identical semis with not one light on, a vision that arrives as wallpaper and half a word, a table laid for four nobody sits at, a correctly spelled poster in the wrong house, and a passenger whose only advice is to wait as long as it takes.",
  characters: ["nina", "alan"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Blue hour", lightingNotes: "Dusk, not daylight, for the first time in her thread: flat blue hour with no warmth and no sun, the only hard sources being the bus's headlights and her own torch. Locked off, wide, deep focus, symmetrical, dead centre. The camera never follows her and long lenses hold the road. Only the vision goes handheld: broken, wrong aspect ratio, dropped frames, blown out, a hiss. Nothing about the hour is remarked upon.", style: "cinematic",
};
// Scene 5: the eleventh-morning audit ends at the wrong door on the right house.
const doorstepScene = {
  id: doorstepSceneId, title: "The doorstep", location: "EXT./INT. MARTIN'S HOUSE", time: "DAY",
  description: `Scene 5, the eleventh-morning audit ending at the wrong door on the right house: a man who has not spoken to anybody in eight weeks, a bedroom with a correctly spelled poster and a dusty beige terminal he bought at auction as a job lot, and a pendant that lights up while she is looking past it. ${doorstepGrammar}`,
  characters: ["nina", "martin", "alan"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: doorstepGrammar, style: "cinematic",
};
// Scene 6: the twelfth house opens on Martin, and the bedroom she was sent to has the machine in it.
const kitchenScene = {
  id: kitchenSceneId, title: "The kitchen", location: "INT. MARTIN'S HOUSE — KITCHEN", time: "DAY",
  description: `Scene 6, the same afternoon: a man is told his son is in a queue that is not moving, that the beige box upstairs is the only thing that might get him out, and that the only person who could work it is the brother he has not spoken to since outbidding him at an auction in 2011. ${kitchenGrammar} She asks once and then waits, and the most honest thing he says in the series is four words about a computer.`,
  characters: ["nina", "martin"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "High key", lightingNotes: kitchenGrammar, style: "cinematic",
};
const coldOpenScene = {
  id: coldOpenSceneId, title: "The interview", location: "INT. SUBURBAN FRONT ROOM", time: "DAY",
  description: "Episode three circles what a blank is from three angles and gets it wrong three times: the angels' cold open, the cops' worthless test, and Hell's five-hour interview that leaves with Wales. The comedy is in the timecode and the stillness; nothing reacts except Tamsin's pen.",
  characters: ["reek", "tamsin", "graham"].map(characterId), actId: "rapture-episode-3",
  kind: "Standard", lighting: "Overcast soft", lightingNotes: coldOpenGrammar, style: "cinematic",
};

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
// Replace Episode One outline placeholders for new scenes with detailed scene objects
{
  const wuIdx = scenes.findIndex(s => s.id === washingUpSceneId);
  if (wuIdx !== -1) scenes[wuIdx] = washingUpScene;
  const djIdx = scenes.findIndex(s => s.id === ep1DannyJodieSceneId);
  if (djIdx !== -1) scenes[djIdx] = dannyJodieScene;
  const c2Idx = scenes.findIndex(s => s.id === ep1CopsSecondBeatSceneId);
  if (c2Idx !== -1) scenes[c2Idx] = copsSecondBeatScene;
  const mgIdx = scenes.findIndex(s => s.id === muggingSceneId);
  if (mgIdx !== -1) scenes[mgIdx] = muggingScene;
  const sjIdx = scenes.findIndex(s => s.id === stJudesSceneId);
  if (sjIdx !== -1) scenes[sjIdx] = stJudesScene;
  const c1Idx = scenes.findIndex(s => s.id === copsFirstBeatScene.id);
  if (c1Idx !== -1) scenes[c1Idx] = copsFirstBeatScene;
  const stIdx = scenes.findIndex(s => s.id === storageScene.id);
  if (stIdx !== -1) scenes[stIdx] = storageScene;
  const noIdx = scenes.findIndex(s => s.id === tagScene.id);
  if (noIdx !== -1) scenes[noIdx] = tagScene;
}
// The three written-but-unboarded episode-one scenes keep any legacy reference board they arrived
// with, so their titles must not claim to be outlines and their descriptions must not claim to be
// unwritten: the page is the source, the board is reference material from the older outline.
for (const id of ["rapture-ep1-cops", "rapture-ep1-storage", "rapture-ep1-no"]) {
  const scene = scenes.find(candidate => candidate.id === id);
  assert(scene && scene.description.startsWith("WRITTEN, NOT BOARDED"), `Episode one's written scene lost its status: ${id}`);
  assert(!scene.title.endsWith("— outline"), `A written scene must not be titled as an outline: ${scene.title}`);
}
{
  const pnIdx = scenes.findIndex(s => s.id === patsNightSceneId);
  if (pnIdx !== -1) scenes[pnIdx] = patsNightScene;
}
scenes.splice(scenes.findIndex(s => s.id === "rapture-ep3-test") + 1, 0, coldOpenScene);
scenes.splice(scenes.findIndex(s => s.id === "rapture-ep3-arrivals"), 0, ep3ColdOpenScene);
// Scene 2 takes the outline's place in episode four; the cold open precedes it.
const patHouseScene = {
  id: patHouseSceneId, title: "Pat's house — the old lady", location: "INT./EXT. PAT'S HOUSE", time: "DUSK INTO NIGHT",
  description: "Scene 2, after the cold open: Jodie audited over squash in the lamplit front room while Danny finds the water cupboard by torchlight. The violence is silent and domestic — the exact rhythm of someone eating a meal — and her grammar returns mid-sentence. Malcolm comes up at the end to a cupboard ajar and I've made a friend. This is NOT Number Fourteen.",
  characters: ["pat", "malcolm", "danny", "jodie"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Practical night", lightingNotes: patHouseTwoGrammar, style: "cinematic",
};
scenes.splice(scenes.findIndex(s => s.id === "rapture-ep4-meetings"), 0, patHouseScene);
scenes.splice(scenes.findIndex(s => s.id === "rapture-ep4-pat"), 0, patColdOpenScene);
scenes.splice(scenes.findIndex(s => s.id === scoutHutSceneId), 0, scoutHutScene);
{
  const tcIdx = scenes.findIndex(s => s.id === therapyClassSceneId);
  if (tcIdx !== -1) scenes[tcIdx] = therapyClassScene;
}
scenes.splice(scenes.findIndex(s => s.id === scoutHutSceneId) + 1, 0, scene);
scenes.splice(scenes.findIndex(s => s.id === sceneId) + 1, 0, estateScene, doorstepScene, kitchenScene); // scenes 4, 5 and 6 follow Number Fourteen in episode four
const lockupScene = {
  id: lockupSceneId, title: "The first wrong lockup", location: "EXT./INT. ROADS AND AN INDUSTRIAL ESTATE", time: "DAY",
  description: `Nina drives out on a pendant bearing, opens two wrong lockups, and acquires Alan. ${lockupGrammar} The vision is the tracker's recorded view, not divine revelation.`,
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
for (const frame of [...washingUp, ...dannyJodieFrames, ...copsSecondBeatFrames, ...muggingFrames, ...stJudesFrames, ...patOpen, ...patHouse, ...scoutHut, ...therapyClass, ...patsNight, ...estate, ...doorstep, ...kitchen, ...coldOpen, ...ep3ColdOpen, ...numberFourteen, ...lockupFrames, ...legacyFrames]) {
  if (!framesByScene.has(frame.sceneId)) framesByScene.set(frame.sceneId, []);
  framesByScene.get(frame.sceneId).push(frame);
}
const frames = scenes.flatMap(s => framesByScene.get(s.id) || []);
assert.equal(frames.length, washingUp.length + dannyJodieFrames.length + copsSecondBeatFrames.length + muggingFrames.length + stJudesFrames.length + patOpen.length + patHouse.length + scoutHut.length + therapyClass.length + patsNight.length + estate.length + doorstep.length + kitchen.length + coldOpen.length + ep3ColdOpen.length + numberFourteen.length + lockupFrames.length + legacyFrames.length, "Every frame must belong to a listed scene");
const missingKeyframes = legacyFrames.filter(frame => !frame.image).map(frame => frame.description.match(/(\S+\.jpg)/)[1]);

const notes = sections.map(({ title, text }, i) => ({
  id: `rapture-bible-${i + 1}`, title: `Series bible — ${title.toLowerCase()}`,
  content: plain(text), color: i % 3 === 0 ? "sage" : i % 3 === 1 ? "sand" : "rose", createdAt,
  tags: ["Series bible", "Source"], connections: [],
}));
const legacyKeyframes = legacyFrames.filter(frame => frame.image).length;
const coldOpenMissing = coldOpen.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const patOpenMissing = patOpen.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const patHouseMissing = patHouse.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const patOpenTotal = patOpen.reduce((n, f) => n + f.duration, 0);
const patHouseTotal = patHouse.reduce((n, f) => n + f.duration, 0);
const scoutHutMissing = scoutHut.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const scoutHutTotal = scoutHut.reduce((n, f) => n + f.duration, 0);
const estateMissing = estate.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const estateTotal = estate.reduce((n, f) => n + f.duration, 0);
const doorstepMissing = doorstep.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const doorstepTotal = doorstep.reduce((n, f) => n + f.duration, 0);
const kitchenMissing = kitchen.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const kitchenTotal = kitchen.reduce((n, f) => n + f.duration, 0);
const therapyMissing = therapyClass.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const therapyTotal = therapyClass.reduce((n, f) => n + f.duration, 0);
const patsNightMissing = patsNight.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const patsNightTotal = patsNight.reduce((n, f) => n + f.duration, 0);
const washingUpMissing = washingUp.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const washingUpTotal = washingUp.reduce((n, f) => n + f.duration, 0);
const dannyJodieMissing = dannyJodieFrames.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
const copsSecondMissing = copsSecondBeatFrames.filter(frame => !frame.image).map(frame => frame.title.replace(" (keyframe missing)", ""));
notes.unshift({
  id: "rapture-read-me", title: "Start here — scope, timing and image status", color: "sage", createdAt,
  tags: ["Production", "Read first"],
  content: `8 × 45min British black comedy. Eight episode outlines and a cast bible are supplied; this is NOT eight completed 45-minute scripts.\n\n**Episode One, revised running order — roughly 42 minutes before the tag.** The mugging, St Jude's and the rapture, washing up (Nina Sc 3, ${washingUp.length} shots, ${washingUpTotal}s, FIX 4: the pendant is her mother's and she always had it, never found on Deborah's bedside; shot 18 is cut and holds its slot, shots 23-24 are her own room drawer and a practical decision)${washingUpMissing.length ? `, ${washingUpMissing.length} placeholder cards still to generate` : ", fully studied"}, the cops' first beat, the pendant and first-vision outline retained as SUPERSEDED (folded into washing up), Martin's storage unit marked PRE-RAPTURE flashback because the machine has to have sat in Max's room for eight weeks, Danny and Jodie's first appearance (${dannyJodieFrames.length} shots, ${dannyJodieTotal}s, moved here from episode two)${dannyJodieMissing.length ? `, ${dannyJodieMissing.length} placeholder cards` : ", fully studied"}, the cops' second beat (${copsSecondBeatFrames.length} shots, ${copsSecondBeatTotal}s exactly, ninety seconds as instructed)${copsSecondMissing.length ? `, ${copsSecondMissing.length} placeholder cards` : ", fully studied"}, then the 1980 tag ending on NO.\n\n**Episode Four.** The Pat-and-Malcolm dusk cold open (${patOpen.length} shots, ${patOpenTotal}-second estimate, Graham already chained under the floor)${patOpenMissing.length ? `, ${patOpen.length - patOpenMissing.length} AI studies on disk and ${patOpenMissing.length} placeholder cards` : ", fully studied"} runs continuously into Scene 2, the old-lady sequence (${patHouse.length} shots, ${patHouseTotal}-second estimate, two grammars never blended within a shot)${patHouseMissing.length ? `, ${patHouse.length - patHouseMissing.length} AI studies and ${patHouseMissing.length} placeholder cards` : ", fully studied"}; Scene 3 the scout hut (${scoutHut.length} shots, ${scoutHutTotal}-second estimate)${scoutHutMissing.length ? `, ${scoutHut.length - scoutHutMissing.length} AI studies and ${scoutHutMissing.length} placeholder cards` : ", fully studied"}; Number Fourteen (${numberFourteen.length} shots, 175-second estimate, fully boarded); then Nina's thread, retained and fully boarded — Scene 4 the housing estate at dusk (${estate.length} shots, ${estateTotal}-second estimate)${estateMissing.length ? `, ${estate.length - estateMissing.length} AI studies and ${estateMissing.length} placeholder cards` : ", every shot studied"}, the hour wrong for the first time and her grammar otherwise untouched; Scene 5 the doorstep (${doorstep.length} shots, ${doorstepTotal}-second estimate)${doorstepMissing.length ? `, ${doorstep.length - doorstepMissing.length} AI studies and ${doorstepMissing.length} placeholder cards` : ", every shot studied"}, two grammars in one building, hers on the street and his indoors, never blended inside a shot and never resolved by the film; Scene 6 the kitchen (${kitchen.length} shots, ${kitchenTotal}-second estimate)${kitchenMissing.length ? `, ${kitchen.length - kitchenMissing.length} AI studies and ${kitchenMissing.length} placeholder cards` : ", every shot studied"}, his grammar for twenty-one frames and hers only once they are outside, and it is where the 2011 auction becomes the show's engine. From the kitchen's final frame the beige terminal and CRT travel in the back of the bus with Martin's guitar case beside them, and every later bus frame has to show them.\n\n**Episode Five.** The therapy class (${therapyClass.length} shots, ${therapyTotal}-second estimate)${therapyMissing.length ? `, ${therapyClass.length - therapyMissing.length} AI studies on disk and ${therapyMissing.length} placeholder cards still to generate` : ", fully studied"}: one question, fourteen self-serving answers, and a dead dog that ends the argument, with the three protections held on the cards — the long silence at 13, the doctrine visibly invented on the spot at 14, and Carl never saying what he did. It moved from episode six so maintain-order has two episodes to harden, which pushed the episode-three meeting back to recruitment only. Then the night at Pat's (${patsNight.length} shots, ${patsNightTotal}-second estimate)${patsNightMissing.length ? `, ${patsNight.length - patsNightMissing.length} AI studies on disk and ${patsNightMissing.length} placeholder cards still to generate` : ", fully studied"}, which replaces the previous Pat's-house version and the episode-five basement, rescue and scent outlines: no CCTV anywhere, two grammars only, the cops static through the windscreen on 32mm with handheld only for violence and Danny and Jodie handheld, close, dark, red torchlight, the demons seen only ever in someone's torch beam.\n\n**Also numbered.** The mugging cold open (${muggingFrames.length} shots, ${muggingTotal}s, static locked off, sodium streetlight, the knife starts its journey); St Jude's and the rapture (${stJudesFrames.length} shots, ${stJudesTotal}s, Nina's locked-off daylight grammar, the rapture happens with no flash); the episode-three angels' cold open (${ep3ColdOpen.length} shots, 125-second estimate, immaculate advert grammar)${ep3ColdOpen.filter(f => !f.image).length ? ", with placeholder cards" : ", fully studied"}; Graham's interview, an episode-three scene since the restructure (${coldOpen.length} shots, ${coldOpenTotal}-second estimate)${coldOpenMissing.length ? `, ${coldOpen.length - coldOpenMissing.length} AI studies and ${coldOpenMissing.length} placeholder cards` : ", fully studied"}; the first wrong lockup (${lockupFrames.length} shots, ${lockupTotal}-second estimate, one dedicated keyframe per shot). Each explicit pause remains exactly as written; every other duration is a visibly marked working estimate.\n\n**Supplied fixes, recorded against the outlines.** The 1980 prologue pockets the tracker at shot 12 instead of leaving it under a radiator, adds one half-second 16mm flash as shot 24f inside the fame montage — his hands fastening something round a laughing girl's neck, the object never clear — and shot 31 is cut so the sequence runs 30 to 32, ERROR to UNDO?; the prologue therefore ends on a refusal rather than a plant. Max's machine shows ERROR and cuts straight to UNDO?. Martin's auction is marked PRE-RAPTURE. The episode-three meeting is trimmed to recruitment only, with the grandma-and-the-dog story and the nun rumour moved to the episode-five therapy class.\n\n**Legacy reference boards.** Six ordered boards (storage facility, police/car park, Limbo, first raid, Hell intake, Wave 3 night drive) are attached to their scenes as ordered keyframes, status Needs review — ${legacyKeyframes} keyframes${missingKeyframes.length ? ` plus ${missingKeyframes.length} cards holding the slots of missing files (${missingKeyframes.join(", ")})` : ""}. The washing-up board (a1s3-01 to a1s3-37) is retired: those files stay on disk unreferenced because the scene is now boarded from its own numbered source. Shot type, movement, lens and the 5s durations on the legacy boards are working placeholders; review every keyframe against the current grammar before production. Nothing outside Number Fourteen is approved coverage. Unpictured roles have deliberate initials placeholders, not missing files.\n\nThe full current source is docs/rapture/show-bible.md, indexed by docs/rapture/canon.md. The screenplay sources live in docs/rapture/scenes/: ep1-mugging.md, ep1-st-judes.md, ep1-washing-up.md, ep1-danny-jodie.md, ep1-cops-second-beat.md, ep2-first-wrong-lockup.md, ep3-cold-open.md, ep4-pat-cold-open.md, ep4-pat-house.md, ep4-scout-hut.md, ep4-number-fourteen.md, ep4-housing-estate.md, ep4-doorstep.md, ep4-kitchen.md, ep5-therapy-class.md and ep5-pats-night.md, with the original Number Fourteen and the dialogue-free Pat-alone open preserved in scenes/archive/. The bundle is generated by scripts/rapture/build-project.mjs from scripts/rapture/plan.mjs — edit the plan and the sources, then run npm run build:rapture. Use Export → Project backup to retain your edits; re-opening the bundled workspace never overwrites a saved project.`,
  connections: [{ targetId: sceneId, label: "Number Fourteen" }],
});
notes.push({
  id: "rapture-continuity", title: "Continuity decisions and open questions", color: "rose", createdAt,
  tags: ["Continuity", "Needs review"], connections: [],
  content: `The latest series prompt takes precedence over the earlier visual canon. Danny and Jodie now have no wide establishing shots, no complete-room views and no sodium/teal look. In Number Fourteen, shot 1 is a CU/50mm of the headlight switch and shot 12 a MS/35mm of the passing van panel. All dialogue, numbered beats and pauses are unchanged. White headlights are not shown. The old version remains archived.\n\nNumber Fourteen's woman is the sheet-27 house-rules character, not Pat. The new episode-four Pat sequence remains a separate outline and has not been silently replaced by this scene. No blanks or afterlife appear in Number Fourteen. No cosmology is added to its dialogue.\n\nThe woman describes a locally intermittent upstairs tap in episode four; the series-wide upstairs failure remains episode five.\n\nMax remains flashbacks only, alive and unreachable. Episode eight says he knows where the fields are; how that knowledge reaches the upstairs action is not specified, so no present-day reunion has been invented.\n\nThe cause retains 1980, death five years later and forty-five years later exactly as supplied. A present-day calendar year has not been silently inferred. Nina remains 45.\n\nThe chained/rescued blank is not silently identified as Alan. The third field officer and the recovery angels remain unnamed. The 1980 absconder's appearance is not locked. Confirm exact van plates and jacket-pocket continuity before approving images.\n\nIn the episode-four cold open Graham is the blank chained under Pat's floor: the apology he gave Hell's intake with no pause at all now arrives from behind the locked cellar door at dusk, muffled and entirely calm, heard and never seen. He remains not Alan and has no surname; whether the episode-three interview's front room is Pat's front room, and whether the blank Danny and Jodie rescue in episode five is also Graham, has not been supplied and no link is asserted. His glitch — repeating the shot-10 clause to an empty room in shot 15 — is played completely flat with no sting, no cut and no camera move; the timecode burn-in carries the five-hour jump. Reek and Tamsin keep their intake-floor surveillance grammar in the field: 4:3 high-corner framing, slight fisheye and a visible advancing timecode.\n\nThe episode-three cold open names the recovery angels Hariel and Soqed; no further backstory is supplied. Their grammar is the opposite of Hell's: immaculate, centred, advert-like, no timecode. The unnamed MAN (60s, cardigan) between the pallets of bark chippings is a blank who belongs to nobody and joins no cast list. The two cold opens never share a frame with another faction; the episode-eight collapse to neutral coverage has not happened yet.${missingKeyframes.length ? `\n\n${missingKeyframes.length} legacy keyframes are missing from disk and hold placeholder slots: ${missingKeyframes.join(", ")}.` : ""}\n\nRetained material, stated plainly so nothing is silently resolved. Episode four keeps Nina's thread as boarded on the previous workspace — the housing estate at dusk, the doorstep and the kitchen, scenes 4, 5 and 6 — while episode five takes the revised therapy class and the 51-shot night at Pat's, which replaces the earlier Pat's-house coverage and the basement, rescue and scent outlines. The two are not merged and no new scene reconciles them: the kitchen still ends with the machine going into the back of the bus, and the night at Pat's still puts Neil in the cellar under the stairs. Whether Nina's audit and the rescue run in the same week, and whether the machine that travels in the bus is the machine Max is using in the flashbacks, has not been supplied and is not asserted here. Episode one's pendant-and-first-vision outline is kept as a SUPERSEDED POSITION because the beat is now inside the boarded washing-up scene, and episode two's legacy first-raid board is reference only now the numbered Danny and Jodie scene has moved to episode one.`,
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
}, {
  id: "rapture-look-lockup", title: "The first wrong lockup — locked off daylight", sceneId: lockupSceneId, actId: "rapture-episode-2", createdAt,
  description: "Thirty-one AI-generated storyboard studies. Locked off, wide, deep focus, daylight, symmetrical; only the vision is handheld.",
  items: lockupFrames.map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-estate", title: "The housing estate — her grammar, the wrong hour", sceneId: estateSceneId, actId: "rapture-episode-4", createdAt,
  description: "Thirty-six AI-generated storyboard studies. Locked off, wide, deep focus, symmetrical, dead centre, at dusk for the first time in her thread; only the vision goes handheld.",
  items: estate.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-doorstep", title: "The doorstep — two grammars, one building", sceneId: doorstepSceneId, actId: "rapture-episode-4", createdAt,
  description: "Thirty-two AI-generated storyboard studies. Hers is symmetrical daylight on the street; his is flat, fluorescent and slightly off-centre indoors. They are never blended inside a shot.",
  items: doorstep.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-kitchen", title: "The kitchen — his grammar, and one street", sceneId: kitchenSceneId, actId: "rapture-episode-4", createdAt,
  description: "Twenty-four AI-generated storyboard studies (22a pending). Fluorescent, flat, off-centre and locked off inside; symmetrical daylight only once they reach the street.",
  items: kitchen.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-danny-jodie", title: "Danny and Jodie — the raid, red and handheld", sceneId: ep1DannyJodieSceneId, actId: "rapture-episode-1", createdAt,
  description: "Twenty-one AI-generated storyboard studies. Handheld, tight, dark, one red practical, never a clean wide.",
  items: dannyJodieFrames.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-cops-second", title: "The cops, second beat — locked off in a lit box", sceneId: ep1CopsSecondBeatSceneId, actId: "rapture-episode-1", createdAt,
  description: "Six AI-generated storyboard studies. The same two-shot three times, the same wide twice, one insert of a bottle nobody has drunk.",
  items: copsSecondBeatFrames.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-therapy", title: "The therapy class — one question, one red bulb", sceneId: therapyClassSceneId, actId: "rapture-episode-5", createdAt,
  description: "Twenty-six numbered shots. Handheld and inside two metres, lit by a fire-door red and a tarpaulin, with exactly one wide in the scene and it is the last one.",
  items: therapyClass.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, ...referenceBoards.map(board => ({
  id: `rapture-look-${board.id}`, title: board.title, description: board.description, createdAt,
  items: board.items.map(([image, caption], i) => ({ id: `rapture-${board.id}-ref-${i + 1}`, image, caption })),
}))];

// ---------------------------------------------------------------- the screenplay
// The Screenplay tab is the project's own running order: every scene that has a written source
// contributes its text, in episode order and then the order the workspace lists the scenes, so
// the scene navigator, the storyboard and the episode export all walk the script the same way.
// A source document that is never joined here is a scene the app reports as missing — washing
// up, Pat's house Scene 2, the therapy class and the night at Pat's were exactly that.
const asScreenplay = text => text.replace(/^#{1,2} /gm, "").replace(/^Scene: /m, "").replace(/\n---\n/g, "\n").trim();
// Episode one is carried by its screenplay pages; every other episode is carried by the numbered
// scene document its storyboard was built from.
const screenplayByScene = new Map([
  [washingUpSceneId, washingUpScreenplay],
  [muggingSceneId, muggingScreenplay],
  [stJudesSceneId, stJudesScreenplay],
  [ep1DannyJodieSceneId, dannyJodieScreenplay],
  [ep1CopsSecondBeatSceneId, copsSecondBeatScreenplay],
  [lockupSceneId, lockupScreenplay],
  [ep3ColdOpenSceneId, ep3ColdOpenScreenplay],
  [coldOpenSceneId, coldOpenScreenplay],
  [patColdOpenSceneId, patColdOpenScreenplay],
  [patHouseSceneId, patHouseScreenplay],
  [scoutHutSceneId, scoutHutScreenplay],
  [sceneId, screenplay],
  [estateSceneId, estateScreenplay],
  [doorstepSceneId, doorstepScreenplay],
  [kitchenSceneId, kitchenScreenplay],
  [therapyClassSceneId, therapyClassScreenplay],
  [patsNightSceneId, patsNightScreenplay],
  // Episode one's pages go last so they win: the draft, not the numbered board, is the script.
  ...ep1Pages.map(page => [page.sceneId, page.text]),
]);
for (const page of ep1Pages) {
  const scene = scenes.find(candidate => candidate.id === page.sceneId);
  assert(scene, `An episode-one page has no scene to belong to: ${page.sceneId}`);
  assert.equal(screenplayByScene.get(page.sceneId), page.text, `Episode one's page must be the screenplay source for ${scene.title}, not its numbered board`);
  const slugline = page.text.split("\n")[3];
  assert(slugline.startsWith(`${scene.location} — ${scene.time}`), `${page.file} must open with ${scene.title}'s own slugline so the navigator selects it; got "${slugline}"`);
}
for (const id of screenplayByScene.keys()) assert(scenes.some(scene => scene.id === id), `A screenplay source has no scene to belong to: ${id}`);
const actOrder = new Map(acts.map((act, i) => [act.id, i]));
// Episode order, then the order the scenes are listed in — the same order the screenplay
// navigator reads them in, so clicking a scene never jumps backwards through the script.
const scriptedScenes = scenes
  .map((scene, index) => ({ scene, index }))
  .filter(({ scene }) => screenplayByScene.has(scene.id))
  .sort((a, b) => (actOrder.get(a.scene.actId) ?? acts.length) - (actOrder.get(b.scene.actId) ?? acts.length) || a.index - b.index);
const script = scriptedScenes.map(({ scene }) => asScreenplay(screenplayByScene.get(scene.id))).join("\n\n");
for (const [id, text] of screenplayByScene) assert(script.includes(asScreenplay(text)), `The screenplay dropped the scene: ${id}`);
assert.equal(scriptedScenes.length, screenplayByScene.size, "Each scripted scene must bring exactly one screenplay source");
for (let i = 1; i < scriptedScenes.length; i++) {
  const before = actOrder.get(scriptedScenes[i - 1].scene.actId), after = actOrder.get(scriptedScenes[i].scene.actId);
  assert(before !== undefined && after !== undefined && before <= after, "The screenplay must run in episode order");
}

const project = {
  id: projectId, title: "Let the Raptures Commence",
  description: "8 × 45min British black comedy. Four billion people sorted by a child's layout decision. Eight episode outlines, and Episode One is now written: docs/rapture/ep1-screenplay.md (draft of 21 September 2026) is carried page by page in docs/rapture/screenplay/ and is what the Screenplay tab shows — cold open on the side street, St Jude's and the rapture at breakfast, the cops' first beat in the supermarket car park, ST JUDE'S - AFTER, Martin at the storage facility three months earlier, Danny and Jodie, the cops at night and the 1980 tag. The mugging (19 shots), St Jude's (19) and washing up (26, FIX 4 — the pendant is her mother's, she always had it) boards predate that page and are not re-boarded; the cops' first beat, Martin and the tag are written and not boarded at all. Also in the revised 42-minute order: Danny and Jodie (21) and the cops' second beat (6); ep3 cold open angels 15 shots; ep4 Pat cold open dusk 16 shots continuous into Scene 2 the old lady 35 shots, then Nina's thread retained and fully boarded — the housing estate (36), the doorstep (32) and the kitchen (24); ep5 therapy class 26 shots and the night at Pat's 51 shots, no CCTV, two grammars only. Fixes: prologue 12 pockets the tracker plus the 24f flash, shot 31 cut ERROR to UNDO?, Ep1 Sc3 shot 18 cut with 23-24 in her own room, Martin's auction marked pre-rapture, Ep3 meeting trimmed to recruitment only.",
  genre: "Comedy", format: "Series", status: "In development", coverImage: "/images/rapture/ep4/04-mid-sentence.jpg",
  acts, scenes, frames, characters, notes, brainstorm, moodboards,
  script,
  shareId: null, createdAt, updatedAt: createdAt,
};

const imagePaths = new Set([project.coverImage, ...frames.map(f => f.image).filter(Boolean), ...characters.map(c => c.image).filter(Boolean), ...moodboards.flatMap(b => b.items.map(i => i.image))]);
for (const image of imagePaths) assert(existsSync(resolve(root, `public${image}`)), `Missing image: ${image}`);
for (const c of characters) assert(c.description.length <= 700, `Shorten character description: ${c.name}`);
// The app's own ceilings, checked here rather than at runtime: validatePatch rejects the bundle.
for (const c of characters) {
  assert(c.role.length <= 80 && c.name.length <= 120 && (c.age || "").length <= 40, `Cast field over the app's limit: ${c.name}`);
  for (const relation of c.relations || []) assert((relation.note || "").length <= 120, `Shorten relationship note: ${c.name} → ${relation.targetId}`);
}
for (const scene of scenes) assert(scene.title.length <= 300 && scene.location.length <= 300 && scene.time.length <= 100, `Scene field over the app's limit: ${scene.title}`);
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
