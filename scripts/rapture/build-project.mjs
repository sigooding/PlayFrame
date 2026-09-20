import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectId, sceneId, coldOpenSceneId, ep3ColdOpenSceneId, patColdOpenSceneId, patHouseSceneId, scoutHutSceneId, estateSceneId, doorstepSceneId, lockupSceneId, createdAt, characterId, characters, grammar, coldOpenGrammar, patColdOpenGrammar, patHouseFrontGrammar, patHouseTwoGrammar, angelGrammar, scoutHutGrammar, lockupGrammar, estateGrammar, doorstepGrammar, doorstepHerGrammar, doorstepHisGrammar, redLight, shotPlan, coldOpenPlan, ep3ColdOpenPlan, patColdOpenPlan, patHousePlan, scoutHutPlan, estatePlan, doorstepPlan, lockupPlan, outlinePlan, legacyBoards, referenceBoards } from "./plan.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = name => readFileSync(resolve(root, name), "utf8");
const bible = read("docs/rapture/show-bible.md");
const screenplay = read("docs/rapture/scenes/ep4-number-fourteen.md");
const coldOpenScreenplay = read("docs/rapture/scenes/ep4-cold-open.md");
const ep3ColdOpenScreenplay = read("docs/rapture/scenes/ep3-cold-open.md");
const patColdOpenScreenplay = read("docs/rapture/scenes/ep4-pat-cold-open.md");
const patHouseScreenplay = read("docs/rapture/scenes/ep4-pat-house.md");
const scoutHutScreenplay = read("docs/rapture/scenes/ep4-scout-hut.md");
const lockupScreenplay = read("docs/rapture/scenes/ep2-first-wrong-lockup.md");
const estateScreenplay = read("docs/rapture/scenes/ep4-housing-estate.md");
const doorstepScreenplay = read("docs/rapture/scenes/ep4-doorstep.md");
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
assert(doorstep[8].notes.includes("a hair wrong in the composition") && !doorstep[7].notes.includes("a hair wrong in the composition"), "His grammar starts at shot 9 and her street never takes it on");
assert(doorstep[17].notes.includes("unbranded") && doorstep[18].notes.includes("printer"), "The machine is planted in an ordinary insert and she does not clock it");
assert(doorstep[21].notes.includes("no lens flare") && doorstep[21].notes.includes("forty-five years"), "The pendant light is mechanical, not miraculous");
assert.equal(doorstep.filter(f => /snapped off/i.test(f.description)).length, 1, "The snapped-off badge gap appears in the insert and is mentioned by nobody, ever");
assert(doorstep[13].notes.includes("THE RAPTORS") && doorstep[13].notes.includes("Correctly spelled"), "The poster is in the shot source and spelled correctly, unlike the vision fragment");
assert(doorstep.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-doorstep/")), "Doorstep keyframes live under /images/rapture/ep4-doorstep/");
assert(new Set(doorstep.filter(f => f.image).map(f => f.image)).size === doorstep.filter(f => f.image).length, "One dedicated keyframe per doorstep shot");


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

// The cold open precedes Number Fourteen in episode four: five hours of fixed surveillance,
// then the water stop. Not Pat's house, and not the chained blank's cellar.
// The angels' cold open precedes the episode-three outline: immaculate, useless, in step.
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
// Scene 5: the twelfth house opens on Martin, and the bedroom she was sent to has the machine in it.
const doorstepScene = {
  id: doorstepSceneId, title: "The doorstep", location: "EXT./INT. MARTIN'S HOUSE", time: "DAY",
  description: `Scene 5, the eleventh-morning audit ending at the wrong door on the right house: a man who has not spoken to anybody in eight weeks, a bedroom with a correctly spelled poster and a dusty beige terminal he bought at auction as a job lot, and a pendant that lights up while she is looking past it. ${doorstepGrammar}`,
  characters: ["nina", "martin", "alan"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Natural daylight", lightingNotes: doorstepGrammar, style: "cinematic",
};
// Scene 4: the housing estate at dusk. The pendant gives her a bedroom and no address, so she
// audits thirty identical semis the way she would check a building for a gas leak.
const estateScene = {
  id: estateSceneId, title: "The housing estate", location: "EXT./INT. A HOUSING ESTATE", time: "DUSK",
  description: "Scene 4: she is looking for a child's bedroom and has no idea whose or why. A cul-de-sac of thirty identical semis with not one light on, a vision that arrives as wallpaper and half a word, a table laid for four nobody sits at, a correctly spelled poster in the wrong house, and a passenger whose only advice is to wait as long as it takes.",
  characters: ["nina", "alan"].map(characterId), actId: "rapture-episode-4",
  kind: "Standard", lighting: "Blue hour", lightingNotes: "Dusk, not daylight, for the first time in her thread: flat blue hour with no warmth and no sun, the only hard sources being the bus's headlights and her own torch. Locked off, wide, deep focus, symmetrical, dead centre. The camera never follows her and long lenses hold the road. Only the vision goes handheld: broken, wrong aspect ratio, dropped frames, blown out, a hiss. Nothing about the hour is remarked upon.", style: "cinematic",
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
scenes.splice(scenes.findIndex(s => s.id === scoutHutSceneId) + 1, 0, scene);
scenes.splice(scenes.findIndex(s => s.id === sceneId) + 1, 0, estateScene, doorstepScene); // scene 4 and scene 5 follow Number Fourteen in episode four
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
for (const frame of [...patOpen, ...patHouse, ...scoutHut, ...estate, ...doorstep, ...coldOpen, ...ep3ColdOpen, ...numberFourteen, ...lockupFrames, ...legacyFrames]) {
  if (!framesByScene.has(frame.sceneId)) framesByScene.set(frame.sceneId, []);
  framesByScene.get(frame.sceneId).push(frame);
}
const frames = scenes.flatMap(s => framesByScene.get(s.id) || []);
assert.equal(frames.length, patOpen.length + patHouse.length + scoutHut.length + estate.length + doorstep.length + coldOpen.length + ep3ColdOpen.length + numberFourteen.length + lockupFrames.length + legacyFrames.length, "Every frame must belong to a listed scene");
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
notes.unshift({
  id: "rapture-read-me", title: "Start here — scope, timing and image status", color: "sage", createdAt,
  tags: ["Production", "Read first"],
  content: `8 × 45min British black comedy. Eight episode outlines and a cast bible are supplied; this is NOT eight completed 45-minute scripts. Number Fourteen is fully boarded (13 shots, 175-second working estimate). The numbered cold opens: the episode-three angels (15 shots, 125-second estimate), Graham's interview — an episode-three scene since the restructure, circling what a blank is with the cops' test (${coldOpen.length} shots, ${coldOpenTotal}-second estimate)${coldOpenMissing.length ? `, with ${coldOpen.length - coldOpenMissing.length} AI studies on disk and ${coldOpenMissing.length} placeholder cards` : ", fully studied"}, the episode-four Pat-and-Malcolm dusk open (${patOpen.length} shots, ${patOpenTotal}-second estimate, Graham already chained under the floor)${patOpenMissing.length ? `, with ${patOpen.length - patOpenMissing.length} AI studies on disk and ${patOpenMissing.length} placeholder cards` : ", fully studied"}, the scout-hut scene 3 (${scoutHut.length} shots, ${scoutHutTotal}-second estimate)${scoutHutMissing.length ? `, with ${scoutHut.length - scoutHutMissing.length} AI studies on disk and ${scoutHutMissing.length} placeholder cards` : ", fully studied"}, and Scene 2 — the old-lady sequence — is numbered (${patHouse.length} shots, ${patHouseTotal}-second estimate), two grammars never blended within a shot${patHouseMissing.length ? `, with ${patHouse.length - patHouseMissing.length} AI studies on disk and ${patHouseMissing.length} placeholder cards` : ", fully studied"}. The first wrong lockup is numbered (${lockupFrames.length} shots, ${lockupTotal}-second estimate), boarded with AI-generated studies pending production review. Episode four's scene 4 — the housing estate at dusk (${estate.length} shots, ${estateTotal}-second estimate) — is numbered and boarded${estateMissing.length ? `, with ${estate.length - estateMissing.length} AI studies on disk and ${estateMissing.length} placeholder cards still to generate` : ", fully studied"}; the hour is the only thing about her grammar that has changed. Scene 5 — the doorstep — is numbered and boarded (${doorstep.length} shots, ${doorstepTotal}-second estimate)${doorstepMissing.length ? `, with ${doorstep.length - doorstepMissing.length} AI studies on disk and ${doorstepMissing.length} placeholder cards still to generate` : ", fully studied"}: two grammars in one building, hers on the street and his indoors, never blended inside a shot and never resolved by the film. Each explicit pause remains exactly as written.\n\nNine legacy reference boards (cold open, St Jude's, washing up, storage facility, police/car park, Limbo, first raid, Hell intake, Wave 3 night drive) are attached to their scenes as ordered keyframes, status Needs review — ${legacyKeyframes} keyframes${missingKeyframes.length ? ` plus ${missingKeyframes.length} cards holding the slots of missing files (${missingKeyframes.join(", ")})` : ""}. Shot type, movement, lens and the 5s durations on those boards are working placeholders; review every keyframe against the current grammar before production. Nothing outside Number Fourteen is approved coverage. Unpictured roles have deliberate initials placeholders, not missing files.\n\nThe full current source is docs/rapture/show-bible.md. The screenplay sources are docs/rapture/scenes/ep4-number-fourteen.md, docs/rapture/scenes/ep4-cold-open.md, docs/rapture/scenes/ep4-pat-cold-open.md, docs/rapture/scenes/ep4-pat-house.md, docs/rapture/scenes/ep4-scout-hut.md, docs/rapture/scenes/ep4-housing-estate.md, docs/rapture/scenes/ep4-doorstep.md, docs/rapture/scenes/ep2-first-wrong-lockup.md and docs/rapture/scenes/ep3-cold-open.md. The original scenes are preserved in scenes/archive/ep4-number-fourteen-v1.md and scenes/archive/ep4-pat-cold-open-v1.md (the dialogue-free Pat-alone open). Use Export → Project backup to retain your edits. Re-opening the bundled workspace never overwrites a saved project.`,
  connections: [{ targetId: sceneId, label: "Number Fourteen" }],
});
notes.push({
  id: "rapture-continuity", title: "Continuity decisions and open questions", color: "rose", createdAt,
  tags: ["Continuity", "Needs review"], connections: [],
  content: `The latest series prompt takes precedence over the earlier visual canon. Danny and Jodie now have no wide establishing shots, no complete-room views and no sodium/teal look. In Number Fourteen, shot 1 is a CU/50mm of the headlight switch and shot 12 a MS/35mm of the passing van panel. All dialogue, numbered beats and pauses are unchanged. White headlights are not shown. The old version remains archived.\n\nNumber Fourteen's woman is the sheet-27 house-rules character, not Pat. The new episode-four Pat sequence remains a separate outline and has not been silently replaced by this scene. No blanks or afterlife appear in Number Fourteen. No cosmology is added to its dialogue.\n\nThe woman describes a locally intermittent upstairs tap in episode four; the series-wide upstairs failure remains episode five.\n\nMax remains flashbacks only, alive and unreachable. Episode eight says he knows where the fields are; how that knowledge reaches the upstairs action is not specified, so no present-day reunion has been invented.\n\nThe cause retains 1980, death five years later and forty-five years later exactly as supplied. A present-day calendar year has not been silently inferred. Nina remains 45.\n\nThe chained/rescued blank is not silently identified as Alan. The third field officer and the recovery angels remain unnamed. The 1980 absconder's appearance is not locked. Confirm exact van plates and jacket-pocket continuity before approving images.\n\nIn the episode-four cold open Graham is the blank chained under Pat's floor: the apology he gave Hell's intake with no pause at all now arrives from behind the locked cellar door at dusk, muffled and entirely calm, heard and never seen. He remains not Alan and has no surname; whether the episode-three interview's front room is Pat's front room, and whether the blank Danny and Jodie rescue in episode five is also Graham, has not been supplied and no link is asserted. His glitch — repeating the shot-10 clause to an empty room in shot 15 — is played completely flat with no sting, no cut and no camera move; the timecode burn-in carries the five-hour jump. Reek and Tamsin keep their intake-floor surveillance grammar in the field: 4:3 high-corner framing, slight fisheye and a visible advancing timecode.\n\nThe episode-three cold open names the recovery angels Hariel and Soqed; no further backstory is supplied. Their grammar is the opposite of Hell's: immaculate, centred, advert-like, no timecode. The unnamed MAN (60s, cardigan) between the pallets of bark chippings is a blank who belongs to nobody and joins no cast list. The two cold opens never share a frame with another faction; the episode-eight collapse to neutral coverage has not happened yet.${missingKeyframes.length ? `\n\n${missingKeyframes.length} legacy keyframes are missing from disk and hold placeholder slots: ${missingKeyframes.join(", ")}.` : ""}\n\nEpisode four scene 4 puts Nina's locked-off grammar at dusk for the first time; nothing in the scene explains the hour, the pendant or the estate. The child inferred by shot 15 and the boy in the school photograph in shot 29 are both uncast and are deliberately not Max, and the poster in shot 24 is correctly spelled while shot 7's vision keeps only its middle letters: that near-miss is the whole scene and is never resolved. The laid table in shot 21 is not explained, is never returned to and stays four places. The dog is in the bus throughout, is cast nowhere, and the dog that barks off shot 13 is not hers.${estateMissing.length ? ` ${estateMissing.length} estate keyframes remain outstanding: ${estateMissing.join(", ")}.` : ""}${doorstepMissing.length ? ` ${doorstepMissing.length} doorstep keyframes remain outstanding: ${doorstepMissing.join(", ")}.` : ""}\n\nThe doorstep scene keeps Martin's collection, the auction terminal and the brown water exactly as the bible has them, and adds nothing: the machine is never named, the snapped-off badge gap is never mentioned by anybody in any scene, and whether the cul-de-sac she audits here is the same street as the dusk estate scene is not supplied and is not assumed. Martin's son remains alive, unreachable and unseen — the bedroom is empty, the bed is his, and no flashback is cut into the scene.`,
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
  id: "rapture-look-doorstep", title: "The doorstep — two grammars, one building", sceneId: doorstepSceneId, actId: "rapture-episode-4", createdAt,
  description: "Thirty-two AI-generated storyboard studies. Hers is symmetrical daylight on the street; his is flat, fluorescent and slightly off-centre indoors. They are never blended inside a shot.",
  items: doorstep.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, {
  id: "rapture-look-estate", title: "The housing estate — her grammar, the wrong hour", sceneId: estateSceneId, actId: "rapture-episode-4", createdAt,
  description: "Thirty-six AI-generated storyboard studies. Locked off, wide, deep focus, symmetrical, dead centre, at dusk for the first time in her thread; only the vision goes handheld.",
  items: estate.filter(frame => frame.image).map(frame => ({ id: `look-${frame.id}`, image: frame.image, caption: `${frame.title} — AI-generated study, not final coverage.` })),
}, ...referenceBoards.map(board => ({
  id: `rapture-look-${board.id}`, title: board.title, description: board.description, createdAt,
  items: board.items.map(([image, caption], i) => ({ id: `rapture-${board.id}-ref-${i + 1}`, image, caption })),
}))];

const project = {
  id: projectId, title: "Let the Raptures Commence",
  description: "8 × 45min British black comedy. Four billion people sorted by a child's layout decision. Eight episode outlines; the episode-three and episode-four cold opens (15 + 17 shots) and Number Fourteen (13 shots) are the working scenes.",
  genre: "Comedy", format: "Series", status: "In development", coverImage: "/images/rapture/ep4/04-mid-sentence.jpg",
  acts, scenes, frames, characters, notes, brainstorm, moodboards,
  script: [lockupScreenplay, ep3ColdOpenScreenplay, screenplay, coldOpenScreenplay, patColdOpenScreenplay, scoutHutScreenplay, estateScreenplay, doorstepScreenplay].map(text => text.replace(/^#{1,2} /gm, "").replace(/^Scene: /m, "").replace(/\n---\n/g, "\n").trim()).join("\n\n"),
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
