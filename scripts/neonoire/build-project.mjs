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
import { apartmentBuildingLook, apartmentLook } from "./apartment-look.mjs";
import { interviewLook } from "./interview-look.mjs";
import { detectivesLook } from "./detectives-look.mjs";
import { coldOpenLook, coldOpenCompletedThrough, isColdOpenScene } from "./cold-open-look.mjs";
import { coldOpenFreshLook, coldOpenFreshCompleted } from "./cold-open-fresh-look.mjs";
import { aftermathLook, streetsLook, streetsPassTwoImages, streetsScenes } from "./streets-look.mjs";
import { dawnLook, dawnScenes, jackRecastDone, jackRecastDoneNote, jackRecastNote, jackRecastPending, policeDayLook, policeDayScenes } from "./dawn-look.mjs";
import { confrontationScenes, kuroseOfficeLook, storeroomLook } from "./confrontation-look.mjs";
import { hiveLook, hiveScenes } from "./hive-look.mjs";
import { escapeLook, escapeScenes } from "./escape-look.mjs";
import { ishidaEndLook, ishidaEndScenes } from "./ishida-end-look.mjs";
import { hiveMorningLook, hiveMorningScenes, veraLookDSheet } from "./hive-morning-look.mjs";
import { kandaReturnLook, kandaReturnScenes } from "./kanda-return-look.mjs";
import { hiveFirstLook, hiveFirstScenes } from "./hive-first-look.mjs";
import { innColdLook, innScenes, innWarmLook, innWarmScenes } from "./inn-look.mjs";
import { demolitionLook, endingScenes, newCounterLook, rooftopLook, veraLookESheet } from "./ending-look.mjs";
import { rewritePending, rewritePendingNote } from "./rewrite-pending.mjs";
import { remainingBoardsCompleted, remainingBoardsLook, remainingBoardsQueued } from "./remaining-boards.mjs";
import { remainingBoardsFinalLook, remainingBoardsFinalShots } from "./remaining-boards-final.mjs";
import { rewriteSlots, rewriteSlotsDelivered, rewriteSlotsLook } from "./rewrite-slots.mjs";
import { reliefSlots, reliefSlotsDelivered, reliefSlotsLook } from "./animatic-relief.mjs";
import { coverageNextSlots, coverageNextSlotsDelivered, coverageNextLook } from "./coverage-next.mjs";
import { attachAudio, readManifest } from "./voice.mjs";
import { inStoryOrder } from "./story-order.mjs";
import { directorApprovedMainIds, directorMainImageNote, directorContinuityLook, approvedProductionNote } from "./director-corrections.mjs";
import { barDayLook, newsroomLook, witnessNeedsReview, witnessScenes } from "./witness-look.mjs";
import { kandaBarLook, kandaBarScenes, kandaBarSheet } from "./bar-look.mjs";
import { officeLayoutLock, officeLayoutLook, officeLayoutQueued, officeLayoutScenes, officeRoomMaster } from "./office-layout-look.mjs";

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
  s2: "Cold and quiet: a gap between crates and an ice bin, a laugh track, and a young woman understanding she is inside something.",
  s3: "Dusk going blue, laundry nobody is coming back for, one lit window.",
  s4: "Rain-grey glass, muted amber lamplight, two cups and an apology left on voicemail.",
  s5: "Institutional, polite, a decade out of step; a name arriving on a monitor.",
  s6: "Two people being careful with each other, in Japanese, over tea going cold.",
  s7: "An empty office, one decision already made, and a clock a minute fast.",
  s72: "Tokyo Story in colour: still pretty, dry and carefully made-up; the room keeps playing while her world stops.",
  s73: "A still camera, a woman who cannot be still: rain begins to undo her makeup, and one red shoe stays behind.",
  s74: "Tokyo Story in colour: observe, do not console. Grief plays in the distance, then in a huge empty street.",
  s75: "Still frames with the people removed: the night’s objects keep glowing after it is over, and one signal turns green for no one.",
  s76: "A dark apartment, a number she presses, a dented steel lighter opening and closing, and crying without making a sound.",
  s77: "One lamp, a television full of static, dirty hands and an envelope that never gets a name.",
  s78: "Grey dawn, dripping railings, an unslept woman in last night's dress, and a name she has not seen in twenty years.",
  s79: "Dawn in the room from the beginning of the film: two empty cups, a father's handwriting, and Jack taken away in the same hour.",
  s80: "A full room by daylight holding its breath: a blow that never comes, and the first fear on a kind man's face.",
  s81: "Grey daylight in a bar where someone died: a tape out of a cash drawer, a question with no answer, two glasses and no toast.",
  s82: "Fluorescent hum, three channels at once, a voice twenty years old, and a silent man finally talking behind glass.",
  s83: "Forty floors of rain-grey glass, a courteous old man, an envelope she does not look at, and a daughter who only came to see his face.",
  s84: "One bare bulb, a drawing of the back of her head, three feet that neither of them crosses, and a voice under the train.",
  s85: "Four men in single file down a passage too narrow for anything else, and a building quietly closing its doors on them.",
  s86: "A shutter crashing down, a tube going out, a gas flame, and an old woman who will not leave.",
  s87: "Valve radios, a green lamp, boots in the corridor, and one old hand on the main switch.",
  s88: "Total dark and tight white beams: pipes, laundry, and faces that are gone before the light arrives.",
  s89: "Black, a hand on the wall, and a lighter held over a wheel that never sparks.",
  s90: "Rain and wind across a forest of tanks and aerials, the city indifferent, and one metre of nothing to jump.",
  s91: "Rails singing, a wall of lit windows a metre away, nobody watching, and she doesn't pull away.",
  s92: "Soaked, one step apart, a building full of light behind them, and nothing that can be said tonight.",
  s93: "Rain on a man without an umbrella, an engine running, and a door that opens from inside.",
  s94: "Warm amber and cream leather, the rain suddenly far away, a cup of tea handed across, and a car that never moves.",
  s95: "Red taillights smearing down a wet road, exactly as they did at the very beginning.",
  s96: "Grey morning, a cardboard box, an empty drawer, and a clock that is still a minute fast.",
  s98: "The first dry sky of the film, trains at eye level, and a red bird clip on an open palm.",
  s8: "A bar that looks smaller without the night, a mop that avoids a mat, and a pale blue umbrella left on purpose.",
  s9: "Rain, an old man out of breath, and a red bird clip on a wet palm.",
  s10: "A green lamp, a silent sword on a small TV, and a photograph held by its edges.",
  s11: "Past midnight, a dusty box, and two men laughing under a noodle-shop sign twenty years ago.",
  s12: "The cold open's street four days on, a clear umbrella, and a twist of torn strap at knee height.",
  s14: "Clothes on every surface, walls of sketches, and a suitcase packed for a flight.",
  s14a: "Rain on glass, a red clip swinging on a string, one rice ball eaten and one not, and a lane watched in the dark.",
  s15: "A glass tower block with one low patched building in its shadow, and a rusted stair climbing into the past.",
  s16: "Doors open on other lives, radios murmuring, dust sifting through bulb light.",
  s17: "One fluorescent tube, steam, and money left far beyond the price of a bowl.",
  s18: "Static for a lamp, rain on the blinds, and a voice that knows his name.",
  s19: "One bulb left burning in a counter that has closed, and a curtain lifted aside.",
  s20: "A voicemail played twice in the dark, a sketchbook on a flour sack, and the knife that is no longer in the scene.",
  s21: "Grey daylight, two coffees, and a lie she chooses to believe.",
  s22: "A brick arch where the cups tremble with every train, and she sleeps at last.",
  s23: "Red lanterns and charcoal smoke under the bridge, and an old debt spoken quietly.",
  s25: "One bulb, a cold bowl of rice, and 114 on a worn key tag.",
  s25a: "Fogged glass, a siphon flame, and a plate she didn't ask for.",
  s26: "A green train circling the city like a second hand, and a lighter passed hand to hand.",
  s27: "One small umbrella, two wet shoulders, and the city's old song on green.",
  s27a: "Daylight in a bar where someone died, and a woman crouching where her sister hid.",
  s28: "Grey sea, grey sky, salt-scoured paint, and stone steps going down to the water.",
  s29: "A kotatsu, a dead television, and tea poured for a guest nobody wants.",
  s30: "Black fields, one dim headlight, and a sign with half its bulbs dead.",
  s33: "Steam, a swollen window, and a man who notices everything.",
  s35: "Night baseball, a sleeping innkeeper, and a pink payphone feeding on coins.",
  s36: "A dark apartment, a small warm screen, and two people not hanging up.",
  s37: "A cigarette under the eave, and a truck with the keys in it.",
  s42: "Steam gone cold, a cracked frame, and boots in the corridor.",
  s43: "Wet tin, a gutter caught mid-slide, rain sparking in the dark.",
  s44: "One bulb, a steel counter, and a whisper: stay, whatever you hear.",
  s46: "A pantry door closing on a clutching old couple, and an apology in the dark.",
  s48: "Keys in the ignition exactly where she said, and a windscreen cracking starwise.",
  s49: "Eight masked men in eight headlight beams, watching one red taillight shrink.",
  s50: "The drained dawn: blood, soaked receipts, and two names counted silently.",
  s51: "Dawn on a model of tomorrow on the fortieth floor, and a hand lifting the Hive off its plaza.",
  s52: "A knock at dawn, a sweater, a bloodied face, and an arm pulled inside.",
  s53: "Pink water in a white bowl, and a look that measures the face behind the cloth.",
  s54: "A photograph held to kiosk glass, and a smile with all his remaining teeth.",
  s55: "Bare bulbs by day, and a photograph held beside the real thing: they match.",
  s47: "Mud, a collapsed wheel, and a door yanked open flat along the seat.",
  s56: "Lunchtime steam, and a woman at the pot frozen for just a second.",
  s57: "Three feet of curtain between two sisters, and a hand that lifts and drops.",
  s58: "She eats all of it, laughs once at nothing, and pays too much.",
  s59: "Her glow in the rain; his eyes on every parked car.",
  s60: "A swollen face, a crouched man, and a key held out: I want my sister.",
  s61: "Two profiles, a dash glow, and a pause that is the tell.",
  s62: "The same crossing at night, the same melody, and her arm in his.",
  s63: "Grey steel rows under an arch, and twenty years of Januaries in a taped envelope.",
  s63a: "A sedan at walking pace, a wall of steel balls, and a tape he cannot carry another day.",
  s53a: "Three channels at once, a photograph of a dead reporter, and a detective who promised a car that never came.",
  s82a: "A bar of light under the page, her father's handwriting flashing white, and a folder that will walk into Kurose's office.",
  s99a: "Winter light on pale paving, a strip of new grass, and nothing, nothing that marks where anything was.",
  s64: "A cassette under the cash tray, behind the counter, like the girl's clip.",
  s65: "Dust on the lid, TOKYO in marker, and a dress that makes her someone else for a moment.",
  s66: "Amber, brass and a pianist in white: the warmest room in the film, and a stool kept for nobody.",
  s67: "A different clock: one sodium lamp, a row of pillars, and an engine left running.",
  s68: "Rice balls in newspaper, a bow too deep, and a hand on the head like a grandmother's.",
  s69: "Bare bulbs, dripping pipes, and every open door a life Mara is memorising.",
  s70: "One word into a sleeve, and twenty metres of wet asphalt becoming a trap.",
  s71: "A thousand windows waking, pages soaking in a thin shining stream, and the last thing Mara sees.",
  s31: "A tin roof, one car in a gravel lot, and warm amber windows in the rain.",
  s32: "A pink payphone, night baseball, a heavy key, and steep wooden stairs up to safety.",
  s34: "Tatami, one lamp, rain on tin, and twenty years of receipts.",
  s38: "The warmth goes out: four black sedans and xenon beams full of rain.",
  s39: "A lifted curtain corner, a slash of headlight white, and eight men who do not rush.",
  s40: "Plaster falling through headlight glare while the baseball plays on.",
  s41: "The same stairs, now cold, and boots coming up.",
  s45: "Dark, a blue flicker, and a vending machine that says thank you.",
  s100: "One warm bulb in a brick arch, steam, the evening news at sound down, and a third stool.",
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
  assert.equal(lines[0], "NOBODY'S WITNESS", `${file} must open with the film's title`);
  assert(lines[3].startsWith(`${scene.location} - ${scene.time}`), `${file} must put the scene's own slugline at line 4: got "${lines[3]}"`);
  assert.equal(pageBody(pageText(scene, slices[i])), slices[i].join("\n"), `${file} must carry the draft's own bytes below its header`);
}
const rebuilt = feature.map((scene, i) => pageBody(pageText(scene, slices[i]))).join("\n");
assert.equal(rebuilt, fountain, `The ${feature.length} pages must rebuild ${FOUNTAIN} exactly`);

// ---------------------------------------------------------------- the numbered shot boards
const boards = SCENES.map(scene => parseBoard(readBoard(root, scene), scene));
// The first boarding stays 1..240 in SCENES order. Coverage shots (241+) keep the numbers they
// were given, even when a later pass adds one to an earlier scene. These are production identities,
// not playback positions: the final bundle interleaves coverage by scene and quoted script beat.
const PRIMARY_SHOTS = 240;
const primary = [];
const coverage = [];
for (const sceneShots of boards) {
  for (const shot of sceneShots) (shot.n <= PRIMARY_SHOTS ? primary : coverage).push(shot);
}
// The 30 September 2026 revision retires individual frames (and whole scenes), and nothing is
// renumbered: retired numbers stay retired. So the first boarding runs 1..${PRIMARY_SHOTS} with
// legal skips, coverage runs on from ${PRIMARY_SHOTS + 1} likewise — what must hold is that every
// number is used once, primary never exceeds the ceiling, and each block ascends in scene order.
// Rehomed restored boards retain their production numbers, not the plan's append order.
primary.sort((a, b) => a.n - b.n);
assert.ok(primary.every((shot, i) => shot.n >= 1 && shot.n <= PRIMARY_SHOTS && (i === 0 || shot.n > primary[i - 1].n)), `The first boarding must ascend through 1..${PRIMARY_SHOTS}; found ${primary.map(shot => shot.n).join(", ")}`);
assert.equal(new Set(primary.map(shot => shot.n)).size, primary.length, "Primary shot numbers repeat");
coverage.sort((a, b) => a.n - b.n);
assert.ok(coverage.every((shot, i) => shot.n > PRIMARY_SHOTS && (i === 0 || shot.n > coverage[i - 1].n)), `Coverage shots must ascend beyond ${PRIMARY_SHOTS}; found ${coverage.map(shot => shot.n).join(", ")}`);
assert.equal(new Set(coverage.map(shot => shot.n)).size, coverage.length, "Coverage shot numbers repeat");
const shots = [...primary, ...coverage];
const totalShots = shots.length;
assert.equal(shots.length, new Set(shots.map(shot => shot.image)).size, "Two shots claim the same keyframe filename");
assert.equal(shots.length, new Set(shots.map(shot => shot.id)).size, "Stable frame IDs must be unique when the board is reordered or expanded");
const missing = shots.filter(shot => !existsSync(resolve(root, `public${imagePath(shot.scene, shot)}`)));
// A frame whose study has not been generated yet is an honest placeholder, exactly as the series
// workspace does it: it holds its slot and names the missing file instead of borrowing a neighbour.
// The final screenplay's frame rule is 16:9 for every image: a frame still holding a 2.39:1 study
// is pending revision, not approved coverage. The check reads the JPEG bytes themselves — scene 3
// was rebuilt 16:9 on 26 September 2026 and no longer qualifies, and any future legacy frame is
// caught by its own dimensions rather than by a stale scene key.
const jpegDimensions = file => {
  const bytes = readFileSync(file);
  for (let offset = 2; offset + 8 < bytes.length;) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  return null;
};
const awaitingAspect = shot => {
  const file = resolve(root, `public${imagePath(shot.scene, shot)}`);
  if (!existsSync(file)) return false;
  const dim = jpegDimensions(file);
  return !dim || dim[0] !== 1920 || dim[1] !== 1080;
};
const frames = shots.map(shot => {
  const path = imagePath(shot.scene, shot);
  const absent = missing.includes(shot);
  return {
    id: shot.id,
    shotNumber: shot.n,
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
    status: !absent && directorApprovedMainIds.has(shot.id) ? "Ready" : absent || awaitingAspect(shot) || jackRecastPending.has(shot.id) || witnessNeedsReview.has(shot.id) || rewritePending.has(shot.id) || (isColdOpenScene(shot.scene.key) && shot.n <= PRIMARY_SHOTS && shot.n > coldOpenCompletedThrough) ? "Needs review" : isColdOpenScene(shot.scene.key) && coldOpenFreshCompleted.includes(shot.n) ? "Ready" : "Draft",
    transition: shot.n === 1 ? "Fade in" : shot.id === "neonoire-shot-305" ? "Dissolve" : "Cut",
    mood: MOODS[shot.scene.key],
    characters: shot.cast.map(name => characters.find(c => c.name === name).id),
    notes: [
      !absent && directorApprovedMainIds.has(shot.id) ? directorMainImageNote : absent
        ? `KEYFRAME MISSING — ${path} is not in public/images/neonoire/${shot.scene.key}, so this card holds slot ${shot.n} of ${totalShots} until pass ${passOf(shot.n)} is generated.`
          : shot.n >= 369
        ? `Image: AI-generated coverage-pass frame (4 October 2026), one of the ${coverageNextSlots.length} new frames in shots ${coverageNextSlots[0]}–${coverageNextSlots.at(-1)} — boards ${coverageNextSlotsDelivered.join(", ")} installed. ${coverageNextLook} Production approval pending.`
        : shot.n >= 364
        ? `Image: AI-generated relief-pass frame (4 October 2026), one of the ${reliefSlots.length} new frames the voiced-animatic coverage list opened (364–368) — boards ${reliefSlotsDelivered.join(", ")} installed. ${reliefSlotsLook} Production approval pending.`
          : shot.n >= 354
        ? `Image: AI-generated coverage frame (4 October 2026) — the long-hold pass, shot ${shot.n}. The second long-hold pass's ten new keys for its three holds (scene 29's 53 seconds, scene 17's 46, scene 14's 42), generated from each scene's own delivered masters with the cast sheets attached and installed at 1920×1080; nothing renumbered and no frame on disk written over. The caveats are in the board notes. Production approval pending.`
          : shot.n >= 344
        ? `Image: AI-generated coverage frame (4 October 2026) — the long-hold pass, shot ${shot.n}. Ten new keys for the three scenes the voiced animatic had to carry on one board each (scene 23's 95 seconds, scene 22's 64, scene 20's 55), generated from each scene's own delivered masters with the cast sheets attached and installed at 1920×1080; nothing renumbered and no frame on disk written over. The caveats are in the board notes. Production approval pending.`
          : shot.n >= 321
        ? (rewriteSlotsDelivered.includes(shot.n)
          ? `Image: AI-generated rewrite-pass frame (3 October 2026), one of the ${rewriteSlots.length} slots the 2 October 2026 rewrites opened (321–343) — boards ${rewriteSlotsDelivered.join(", ")} installed. ${rewriteSlotsLook} Production approval pending.`
          : "Image slot opened by the 2 October 2026 rewrites (scene 6's 321–327, scene 1's 328–333, scene 14A's 334–343); this card holds an honest placeholder naming the file it awaits, and never borrows a neighbour's picture. Generation runs in screenplay order, ten frames at a time; the delivered boundary and the queued order live in scripts/neonoire/rewrite-slots.mjs. Production approval pending.")
        : shot.n >= 308
        ? `Image: AI-generated 30 September 2026 revision board (shots 308–320), delivered in the remaining-boards pass — boards ${remainingBoardsCompleted.filter(n => n >= 308).sort((a, b) => a - b).join(", ")} of the block installed. ${remainingBoardsLook} Production approval pending.`
        : shot.n >= 297
        ? (remainingBoardsCompleted.includes(shot.n)
          ? `Image: AI-generated story pass 2 boarding (29 September 2026), delivered in the remaining-boards pass — boards ${remainingBoardsCompleted.filter(n => n >= 297 && n < 308).sort((a, b) => a - b).join(", ")} installed (the plaza's three views are generated together from the re-pinned text: no fountain, no hoarding, no gardener). ${remainingBoardsLook} Production approval pending.`
          : "Image: AI-generated story pass 2 boarding (29 September 2026) — Vera at the Toto Shimbun (53A), the notebook photocopied (82A), the phone call and the Ishida crawl (96) and the finished plaza (99A), numbered in boarding order after coverage 296. This session's ten generation calls went first to the six escape retakes (one close-up drifted and was retaken in the same session) and then to the hero frames of 53A, 82A and 99A; the studies still to come hold honest placeholder slots with pass briefs in scripts/neonoire/remaining-boards.mjs. Production approval pending.")
        : shot.n >= 287
        ? "Image: AI-generated first boarding of scenes 25A, 27A and 63A (29 September 2026) — ten shots, ten generations, numbered in boarding order after coverage 286; each scene's master generated first with the Vera, Jack and Okada sheets attached, the remaining shots derived from those masters, the scene 8 bar, the scene 2 floor, the scene 63 locker room, the scene 1 sedan and the SHIOHAMA cassette. Production approval pending."
        : coldOpenFreshCompleted.includes(shot.n) && shot.n > PRIMARY_SHOTS
          ? "Image: regenerated in the cold-open fresh pass (30 September 2026) from the screenplay text with CHARACTER SHEETS ONLY attached — no scene masters, no layout sheet, no earlier frame; see scripts/neonoire/cold-open-fresh-look.mjs. Approved by the director on 30 September 2026 as the film's main images; status Ready."
        : shot.n > PRIMARY_SHOTS
        ? "Image: AI-generated coverage study (28 September 2026) — the letter rewrite pass — generated from each scene's masters with the cast sheets and the new prop master `props/sakai-letter.jpg` attached; each passed the standing perspective check or carries its flaw in the board note. Production approval pending."
        : streetsScenes.has(shot.scene.key)
          ? (streetsPassTwoImages.includes(path)
              ? "Image: AI-generated Tokyo Story colour revision, session two (25 September 2026). The six pending replacements plus the lost-heel and twenty-metre continuity replacements used eight image-generation calls; two slots were held back. Replaces the earlier image, never uses it as a reference. Production approval pending."
              : "Image: AI-generated Tokyo Story colour revision, session one (25 September 2026). Nine new shot studies plus Jack's identity sheet used ten image-generation calls. Replaces the earlier image, never uses it as a reference. Production approval pending.")
          : hiveFirstScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 14–17 (26 September 2026, as re-run after the 30 September revision cut scene 13), the Hive first seen, generated with the Mara, Vera and Jack sheets, the scene 84–86 Hive masters, Kaneko's scene 86 frame and the key from scene 1 as references; each passed the standing perspective check or carries its flaw. Production approval pending."
          : innScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of the roadside inn (26 September 2026), scenes 31, 32, 34, 38–41 and 45, boarded out of order for the stairway motif and the colour change; each cold frame was generated from its warm counterpart, with the recast Jack sheet, the inn key and the cold-open masked men as references. Production approval pending."
          : kandaReturnScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 8–12 (26 September 2026), Kanda revisited and Jack's office, generated with the Vera and Jack sheets, the scene 81 bar master, the scene 77 office, scene 1's street and scene 4's photograph as references. Production approval pending."
          : endingScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 98–100 (26 September 2026), the rooftop, the demolition and the new counter, generated with the Vera Look E sheet, the recast Jack sheet, Kaneko's scene 86 frames, the repairman's scene 87 frame and keys/06-the-block.jpg as references. Production approval pending."
          : hiveMorningScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scene 97 (26 September 2026), the ground-breaking at the Hive, generated from the scene master with the Vera Look D sheet, the Kurose scene 83 master, Kaneko's scene 86 frame and the recast Jack sheet attached. Production approval pending."
          : ishidaEndScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 93–96 (26 September 2026), Ishida's last night and the cleared desk, generated with the Ishida sheet, the Kurose scene 83 master and scene 1 and scene 7 frames as references. Production approval pending."
          : escapeScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 89–92 (26 September 2026), the escape from the Hive, generated from each location's master with the Vera Look C and recast Jack sheets attached. Production approval pending."
          : hiveScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 85–88 (26 September 2026), the raid on the Hive, generated from each location's master with the masked-man, Vera Look C and recast Jack references attached. Kaneko and the radio repairman have no sheets yet. Production approval pending."
          : confrontationScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 83–84 (26 September 2026), generated from each scene's master with the Vera and recast Jack sheets attached. Kurose has no sheet yet and is held to the scene 83 master; the storeroom master is new. Production approval pending."
          : witnessScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 81–82 (25 September 2026), generated from each scene's master with the recast Jack sheet attached, scene 2's bar and journalist frames as references. Okada and Harada were originally held to their scene masters; identity sheets were added later. Production approval pending."
          : policeDayScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scene 80 (25 September 2026), generated from scene 7's room master with the Ishida and recast Jack sheets attached. Production approval pending."
          : dawnScenes.has(shot.scene.key)
            ? "Image: AI-generated first boarding of scenes 77–79 (25 September 2026), generated with the recast Jack sheet and Vera's sheet attached. Production approval pending."
            : `Image: AI-generated storyboard study from pass ${passOf(shot.n)}; continuity, framing and production approval pending — check the wardrobe against the cast sheets before approving.`,
      ...(jackRecastPending.has(shot.id) ? [jackRecastNote] : []),
      ...(rewritePending.has(shot.id) ? [rewritePendingNote] : []),
      ...(jackRecastDone.has(shot.id) ? [jackRecastDoneNote] : []),
      ...(isColdOpenScene(shot.scene.key) && shot.n <= PRIMARY_SHOTS ? [coldOpenFreshCompleted.includes(shot.n)
        ? `Cold-open fresh pass: ${coldOpenFreshLook}`
        : shot.n <= coldOpenCompletedThrough
          ? `Cold-open visual revision: ${coldOpenLook}`
          : `COLD OPEN REVISION PENDING — shot ${shot.n} retains its previous 2.39:1 image. Only shots 1–${coldOpenCompletedThrough} have been rebuilt in 16:9; follow scripts/neonoire/cold-open-look.mjs for the next batch. This legacy frame is not revised coverage.`] : []),
      ...(awaitingAspect(shot) ? [`16:9 REVISION PENDING — shot ${shot.n} is not yet 1920×1080. From the final screenplay onward every image in this film is 16:9 full-bleed (1920×1080): regenerate this frame against its scene key; never crop a scope study into it.`] : []),
      ...(shot.scene.key === "s7" ? [`Visual revision (25 September 2026): ${detectivesLook}`] : []),
      ...(shot.scene.key === "s6" ? [`Visual revision (25 September 2026): ${interviewLook}`] : []),
      ...(shot.scene.key === "s3" ? [`Scene 3 — Vera's apartment building (retaken 29 September 2026): ${apartmentBuildingLook}`] : []),
      ...(shot.scene.key === "s4" ? [`Visual revision (25 September 2026): ${apartmentLook}`] : []),
      ...(shot.scene.key === "s5" ? [`Visual revision (25 September 2026): ${frontCounterLook}`] : []),
      ...(streetsScenes.has(shot.scene.key) ? [`Scenes 72–75 — Tokyo Story in colour (25 September 2026): ${streetsLook}`] : []),
      ...(shot.scene.key === "s76" ? [aftermathLook] : []),
      ...(policeDayScenes.has(shot.scene.key) ? [`Scene 80 — the detectives' room by day (25 September 2026): ${policeDayLook}`] : []),
      ...(hiveFirstScenes.has(shot.scene.key) ? [`Scenes 13–17 — the Hive, first seen (26 September 2026): ${hiveFirstLook}`] : []),
      ...(innScenes.has(shot.scene.key) ? [`The roadside inn (26 September 2026): ${innWarmScenes.has(shot.scene.key) ? innWarmLook : innColdLook}`] : []),
      ...(kandaReturnScenes.has(shot.scene.key) ? [`Scenes 8–12 — Kanda revisited (26 September 2026): ${kandaReturnLook}`] : []),
      ...(officeLayoutScenes.has(shot.scene.key) ? [`Jack's office — ${officeLayoutLock}: ${officeLayoutLook}`] : []),
      ...(shot.scene.key === "s98" ? [`Scene 98 — the rooftop by day (26 September 2026): ${rooftopLook}`] : []),
      ...(shot.scene.key === "s99" ? [`Scene 99 — the Hive coming down (26 September 2026): ${demolitionLook}`] : []),
      ...(shot.scene.key === "s100" ? [`Scene 100 — Kaneko's new counter (26 September 2026): ${newCounterLook}`] : []),
      ...(hiveMorningScenes.has(shot.scene.key) ? [`Scene 97 — the Hive by morning (26 September 2026): ${hiveMorningLook}`] : []),
      ...(ishidaEndScenes.has(shot.scene.key) ? [`Scenes 93–96 — Ishida's last night (26 September 2026): ${ishidaEndLook}`] : []),
      ...(escapeScenes.has(shot.scene.key) ? [`Scenes 89–92 — the escape (26 September 2026): ${escapeLook}`] : []),
      ...(hiveScenes.has(shot.scene.key) ? [`Scenes 85–88 — the raid on the Hive (26 September 2026): ${hiveLook}`] : []),
      ...(shot.scene.key === "s83" ? [`Scene 83 — Kurose's office by day (26 September 2026): ${kuroseOfficeLook}`] : []),
      ...(shot.scene.key === "s84" ? [`Scene 84 — the Hive storeroom (26 September 2026): ${storeroomLook}`] : []),
      ...(kandaBarScenes.has(shot.scene.key) ? [`Kanda bar location continuity: ${kandaBarLook}`] : []),
      ...(shot.scene.key === "s81" ? [`Scene 81 — the bar by day (25 September 2026): ${barDayLook}`] : []),
      ...(shot.scene.key === "s82" ? [`Scene 82 — the newsroom (25 September 2026): ${newsroomLook}`] : []),
      ...(dawnScenes.has(shot.scene.key) ? [`Scenes 77–79 — the envelope and the notebook (25 September 2026): ${dawnLook}`] : []),
      ...(remainingBoardsFinalShots.some(study => study.n === shot.n) ? [remainingBoardsFinalLook] : []),
      ...(directorApprovedMainIds.has(shot.id) ? [directorContinuityLook] : []),
      shot.note,
      shot.script ? `SCRIPT — the draft's own words for this shot:\n"${shot.script}"` : "SCRIPT — no dialogue; the shot is carried by the frame and the sound.",
      shot.scene.grammar,
      grammar,
      `Timing: ${shot.duration}s is a working estimate for animatic playback. The draft locks no durations.`,
      `Generation Pass ${passOf(shot.n)} of ${Math.ceil(Math.max(...shots.map(s => s.n)) / passSize)} — ten keyframes at a time, numbered in boarding order. Stable Shot ${shot.n}; ${totalShots} active shots (retired numbers remain gaps); display and playback follow screenplay scene order.`,
    ].map(note => directorApprovedMainIds.has(shot.id) ? approvedProductionNote(note) : note).join("\n\n"),
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
    content: `NOBODY'S WITNESS (working repository name: NEONOIRE) — the final feature screenplay (September 2026). 103 numbered pages in the Screenplay tab — scenes 1–100 with 14A, 25A, 27A, 53A, 63A, 82A and 99A, after the 30 September revision retired scenes 13, 24, 97 and 99 — carried page by page straight from the draft, every one of them boarded. The first boarding runs shots 1–240 minus what the revision retired inside scenes 1, 13, 24, 51, 97 and 99 — those numbers stay retired and nothing is renumbered, the coverage passes are shots 241–320, the story pass 2 boards are 297–307, the 30 September revision boards are 308–320, the 2 October rewrite slots are 321–343, the 4 October long-hold passes are 344–363, the relief frames 364–368 and the second coverage pass 369–376 — 19 cast cards, keyframes generated ten at a time. Nothing is renumbered: a number retired by a rewrite stays retired, and new frames keep their assigned production numbers. Display and playback now follow screenplay scene order, with coverage inserted at its quoted beat; labels are identities, not running-order counters. Every numbered scene of the screenplay is boarded, and coverage shots keep their scene. Each page still carries the draft verbatim under its own header.\n\nThe draft at the repository root (\`${FOUNTAIN}\`) is the source of truth, and the Screenplay tab shows it one page per scene — the draft's own words under a production header — so what you edit in the app is what the draft says. Nothing is explained in this film and the workspace does not explain it either.\n\n**Boarding status**\n${passTable}\n\nEvery keyframe is an **AI-generated image**. The director selected the final nine and the corrected drawer/run sequence as **Ready main shots on 1 October 2026, with no further review requested** (scripts/neonoire/director-corrections.mjs). Other studies retain their existing status — except the cold open (scene 1's sixteen remaining frames and scene 2's original ten), which the director approved on 30 September 2026 as the film's main images at status Ready, regenerated in the fresh pass from the screenplay text with character sheets only. ${rewritePending.size ? `The 30 September revision's ${rewritePending.size} still-outdated images — the studies whose beats the rewrite moved or cut — stand under RETAKE PENDING notes (pinned in scripts/neonoire/rewrite-pending.mjs)` : `The 30 September revision's retake queue is closed: every study whose beat the rewrite moved or cut has been regenerated onto the rewritten text, the last ten of them on 4 October 2026, and scripts/neonoire/rewrite-pending.mjs now stands empty — one line in it re-pins any of them`}}, and the twenty frames the revision and story pass 2 still owe are generated under the same character-sheets-only rule (scripts/neonoire/remaining-boards.mjs records the delivered set; the final nine were installed on 1 October 2026, ${remainingBoardsQueued.length} missing-image slots remain. The additional 305 entry is a plaza retake, not an extra missing slot). Continuity is carried by identity sheets for Mara, Vera, Jack, Ishida, the young officer and Vera's mother, used as references whenever they appear; the notes on each frame name the sheet. **From the final screenplay onward every image is 16:9 full-bleed (1920×1080)** — see the frame-format note.`,
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
    content: `**Mara Voss (24)** and **Vera Voss (29)** are American sisters: ash-blonde hair, pale blue eyes, distinct faces locked to sheets/mara.jpg and sheets/vera.jpg and their face crops. Mara's longer wavy hair is soaked flat in the opening; her cheap red-bird clip slides loose between the crates in scene 2 and is gone from that beat on. The final scene gives the clip to Vera.\n\nVera's opening wardrobe is charcoal wool coat, cream knit, navy trousers and brown boots. In scenes 72–75 she wears her mother's wine-red silk dress, broad straps, modest cowl neckline and calf-length bias-cut skirt. Her makeup is pretty, carefully applied and INTACT in the hotel, with dry groomed hair. Only rain in scene 73 washes it into thin mascara trails and plasters her fringe. Both red court shoes remain until the skid: thereafter RIGHT foot bare, LEFT shoe on. No coat or umbrella on the street; the folded pale-blue umbrella stays by the hotel stool.\n\n**Jack (48)** is the private investigator and former police detective, not her father and never Jack Voss. The screenplay supplies no surname. Recast on 25 September 2026 as a white American, following the regenerated sheets/jack.jpg and jack-face.jpg: lean, long angular face, deep-set grey-green eyes, dark brown hair greying at the temples, salt-and-pepper stubble, a good badly kept charcoal overcoat over an off-white open-collar shirt. In the confrontation he is soaked, hands dark, no tie or weapon; he takes the blows and kneels apart after she pushes him away. Scene 74's three Jack frames have been regenerated with the recast (JACK RECAST APPLIED); every Jack frame now matches the new sheet. In scene 77 he is still in the wet coat, hands unwashed.\n\nIn scenes 78–79 Vera is barefoot, still in the creased red dress, hair dried, mascara dried; the umbrella stand is empty and both cups are empty. Daniel's notebook: small, worn dark-green cloth cover, DANIEL VOSS inside the cover.\n\n**Daniel Voss (41, twenty years ago)** is the American father in the family photograph, identified by the scene 11 clipping. Daniel, not Jack, holds nine-year-old Vera's and four-year-old Mara's hands outside the noodle shop. The photograph asset itself is unchanged; the incorrect cast label and parent links are corrected.\n\nThe masked men never receive faces. The old man and journalist remain unnamed. Ishida and the young officer keep their existing sheets. Scene 75 has no people anywhere, including reflections.`,
  },
  {
    id: "neonoire-language", title: "Language — English, Japanese, and the subtitles", color: "sand", createdAt,
    tags: ["Language", "Continuity"], connections: [],
    content: `The Voss sisters speak **English** to each other — including on the phone, including the answerphone message Vera cannot bring herself to answer.\n\nDialogue marked *(in Japanese)* is spoken in Japanese and subtitled in English, and it is never used for local colour: Mara's Japanese is halting and she is understood just barely; Vera's is fluent, careful and slightly formal, learned as a child and relearned as an adult; Ishida's English is excellent and she refuses it anyway, which is the only line either of them draws in the interview room. The old man's "twenty years" and "don't let them have it" are Japanese, and the masked man's two position reports are Japanese into a radio.\n\nThe audience is never told what the key opens, what the position reports are counting towards, or why the journalist had a notebook. Nothing is explained — that is the film's rule, and it is also the workspace's.`,
  },
  {
    id: "neonoire-keyframes", title: "What the keyframes are, and what they are not", color: "rose", createdAt,
    tags: ["Images", "Review"], connections: [],
    content: `**Format: every image is 16:9 full-bleed, 1920×1080 JPEG, no letterbox** \u2014 the final screenplay's rule for this film. Frames already on disk that were made at 2.39:1 (the older style keys only, which stay 2.39:1 references by design) are legacy studies awaiting that revision, not a licence to crop; regenerate, never reframe by cropping. Every frame in this storyboard is a **draft AI study** standing in for a shot that has not been photographed. They are generated in passes of ten, in screenplay order, from the boards in \`docs/neonoire/scenes/\` with the cast sheets attached as references.\n\nThey are useful for: framing, lens, blocking, light direction, wardrobe continuity, and seeing whether the scene plays in order in the animatic.\n\nThey are not: approved coverage, a lighting plan, a cast approval, or a licence to stop checking. Faces drift between passes more than anything else — if a study of Mara or Vera does not match her sheet, mark the frame **Needs review** and regenerate it. Each frame's notes carry the pass it came from.`,
  },
  {
    id: "neonoire-frame-format", title: "Frame format — images are 16:9", color: "sand", createdAt,
    tags: ["Images", "Format"], connections: [],
    content: `From the final screenplay (\`${FOUNTAIN}\`) onward, **every image in this film is 16:9 full-bleed, 1920\u00d71080 JPEG, no letterbox** \u2014 including every keyframe generated for scenes 8\u2013100 as the board reaches them.\n\nThe studio look keeps its film character at the new shape: 35mm Kodak Vision3 500T grain, halation, crushed blacks, practical light \u2014 the Neo-Noir Tokyo style block in the app's library now opens with \"16:9 full-bleed widescreen\" instead of scope.\n\n**Legacy exceptions: none remain in the numbered board.** As of 26 September 2026 every frame of every boarded scene \u2014 cold open, feature, scene 3 \u2014 is 16:9 full-bleed 1920\u00d71080; only the older style keys 1\u20133 and 6\u20139 stay 2.39:1 references by design. Regenerate those in 16:9; never crop a revised frame back to scope, and never letterbox 16:9 content to fake it.\n\nNormalise a fresh 16:9 frame with:

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
  boardOf("neonoire-look-tokyo-story", "Tokyo Story in colour — scenes 72–75", "All fourteen 16:9 draft studies across both sessions: dry pretty makeup in the hotel, rain washing it away on the run, the twenty-metre stop, the blow and folding, the distant aftermath, the almost-reflection, and the empty pillow shots. Low level static cameras; one normal-lens face shot, then a withheld extreme wide.", framesOf(["neonoire-s72", "neonoire-s73", "neonoire-s74", "neonoire-s75"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}, ${frame.angle}. AI-generated revision study.` }))),
  boardOf("neonoire-look-dawn", "The envelope and the notebook — scenes 77–79", "Eleven 16:9 draft studies: Jack's office under one lamp and a TV full of static, the envelope with no name, the grey dawn walkway, DANIEL VOSS inside the cover, the scene 4 room at dawn with two empty cups, the letter returned, smoothed flat beside them, and the revision's scene 78 board — Daniel's notebook set down on the mat and squared to the third-floor door.", framesOf(["neonoire-s77", "neonoire-s78", "neonoire-s79"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}, ${frame.angle}. AI-generated study.` }))),
  boardOf("neonoire-look-kanda", "Kanda, night — sodium and green", "Ten shots of the cold open and the bar: sodium orange against sick fluorescent green, cold steady rain, black reflective asphalt, the vending machine the brightest light in the film.", framesOf(["neonoire-s1", "neonoire-s2"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
  boardOf("neonoire-look-kanda-bar", "Okada’s bar — night to day", "Location continuity across scenes 2, 8, 27A, 64 and 81. The 2×2 sheet uses established storyboard studies, not a newly invented room. Night: CRT variety show on; day and later night: CRT off, cleanup mat and stools up by day. Okada has a separate cast sheet. Draft studies, not approved coverage.", [
    { image: kandaBarSheet, caption: "Kanda bar set sheet: upper left, scene 2 night before the shooting; upper right, aftermath; lower left, scene 8 daylight; lower right, scene 81 across the counter." },
    { image: "/images/neonoire/sheets/okada.jpg", caption: "Okada — white rolled sleeves and navy apron in every visit." },
  ]),
  boardOf("neonoire-look-sisters", "Three days later — grey rain light", "Vera's thread: blue hour on the block, rain-grey glass and muted amber practical light inside the revised apartment, a bone-dry pale-blue umbrella and a faded warm family photograph.", framesOf(["neonoire-s3", "neonoire-s4"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
  boardOf("neonoire-look-station", "The police station — a decade out of step", "Fluorescent tubes with one flickering, faded posters, a fax machine beside a flat monitor, a clock a minute fast, and a paper cup of tea nobody drinks.", framesOf(["neonoire-s5", "neonoire-s6", "neonoire-s7", "neonoire-s80"]).map(frame => ({ image: frame.image, caption: `${frame.title} — ${frame.shotType}, ${frame.lens}. AI-generated study.` }))),
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
    { image: "/images/neonoire/sheets/vera-look-c.jpg", caption: "Vera Voss — costume Look C, from scene 83 on (26 September 2026): ink-navy single-breasted wool coat, dove-grey crew-neck over a white collar, charcoal trousers, black ankle boots, hair in a low loose knot. The same face as her sheet." },
    { image: veraLookDSheet, caption: "Vera Voss — costume Look D, retired with scene 97 by the 30 September 2026 revision (it opened 26 September 2026): dark olive-green wool coat, charcoal roll-neck, black trousers and boots, black umbrella, hair loose. Every later change gets a new coat coloured for its scene." },
    { image: veraLookESheet, caption: "Vera Voss — costume Look E, scene 98 (26 September 2026): a short boxy oatmeal car coat with a funnel collar, pale blue shirt collar, blue jeans, white trainers, hair dry. A different garment, not a recolour; scene 100's Look F is a deep teal peacoat (shot 160 is its master)." },
    { image: "/images/neonoire/sheets/mara-face.jpg", caption: "Mara — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/sheets/vera-face.jpg", caption: "Vera — the face crop attached as a reference to every shot she appears in." },
    { image: "/images/neonoire/sheets/jack.jpg", caption: "Jack (48) — recast 25 September 2026 as a white American: charcoal overcoat, off-white open collar, dark brown hair greying at the temples, grey-green eyes. Not Daniel Voss." },
    { image: "/images/neonoire/sheets/jack-face.jpg", caption: "Jack — face crop of the same generation, attached to every shot he appears in from scene 77." },
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
    id: scene.id, number: scene.label, title: scene.title, location: scene.location, time: scene.time,
    description: scene.description, characters: [...new Set(own.flatMap(shot => shot.cast.map(name => characters.find(c => c.name === name).id)))],
    actId: ACT.id, partId: scene.partId, kind: scene.kind || "Standard",
    ...(scene.lighting ? { lighting: scene.lighting } : {}),
    ...(scene.lightingNotes ? { lightingNotes: scene.lightingNotes } : {}),
    style: "neonoire",
  };
});

// Recorded dialogue (docs/neonoire/voice/manifest.json) rides on the frames it plays over.
const voicedLines = attachAudio(frames, readManifest(root), root);

const project = {
  id: projectId,
  title: "Nobody's Witness",
  description: `The final feature screenplay (September 2026): 103 numbered pages — scenes 1–100 with 14A, 25A, 27A, 53A, 63A, 82A and 99A, after the 30 September revision retired 13, 24, 97 and 99 — all boarded, ${totalShots} keyframes. Shots are listed in screenplay scene order, with later coverage inserted at its quoted beat. Production numbers and filenames stay stable, not sequential playback counters: 8, 11, 219, 274, 280–282 and the cut scenes’ frames stay retired gaps. The opening seven (66 shots), the hotel and Tokyo streets (69–86), the envelope and the notebook (87–95), Jack and Ishida (96–101), the cassette and the witness (102–110), Kurose and the storeroom (111–120), the raid (121–129), the escape (130–138), Ishida’s last night (139–147), the ending and the counter (155–161), Kanda revisited (162–170), the roadside inn (171–180), the Hive first seen (181–190), scenes 18–71 (191–240), the coverage passes (241–296), the story pass 2 boards (297–307), the 30 September revision boards (308–320), the 2 October rewrite slots (321–343), the 4 October long-hold passes (344–363), relief pass (364–368) and second coverage pass (369–376) — every keyframe 16:9 (1920×1080). The Screenplay tab carries the whole draft page by page; no scene is left unboarded. Tokyo as a memory that is still happening — sodium orange against sick fluorescent green, cold patient rain, and nothing explained`,
  genre: "Neo-noir",
  format: "Feature",
  status: "In development",
  coverImage: "/images/neonoire/s1/01-backstreet.jpg",
  acts: [ACT], scenes, frames: inStoryOrder(frames, scenes, root), characters, notes, brainstorm, moodboards,
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
assert.equal(characters.length, 19);

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
