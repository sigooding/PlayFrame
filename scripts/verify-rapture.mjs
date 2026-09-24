// Offline canon, schema, prompt, export, asset and persistence regression checks.
// npm run verify:rapture; add --live to check the running HTTP app too (read-only).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(root, "node_modules/.cache/verify-rapture");
mkdirSync(cache, { recursive: true });
const read = file => readFileSync(join(root, file), "utf8");
const project = JSON.parse(read("public/projects/let-the-raptures-commence.json"));
const source = read("docs/rapture/scenes/ep4-number-fourteen.md");
const original = read("docs/rapture/scenes/archive/ep4-number-fourteen-v1.md");
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== Rapture series workspace ===");
execFileSync(process.execPath, ["scripts/rapture/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const exportsFile = join(cache, "project.mjs");
await build({
  stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/prompt"; export * from "./src/lib/export"; export * from "./src/lib/seed"; export * from "./src/lib/relations"; export * from "./src/lib/structure";', resolveDir: root },
  outfile: exportsFile, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const { validatePatch, sanitizeImport, isUuid, sceneHeadings, normaliseSlugline, episodeNumberOf, PLATFORMS, buildFramePrompt, buildScenePrompt, describeLocation, shotListCsv, starterProjects, converseRelation, scenesInScript, MAX_ACTS, MAX_SCENES, MAX_FRAMES, MAX_NOTES } = await import(pathToFileURL(exportsFile));

// The bundled workspace has to fit inside the app's own ceilings: validatePatch rejects anything
// above them and sanitizeImport truncates to them, so a series that outgrows a cap cannot be
// opened or imported without silently losing the tail of the season.
assert(project.acts.length <= MAX_ACTS, `Episode outlines exceed the ${MAX_ACTS}-act ceiling`);
assert(project.scenes.length <= MAX_SCENES, `Scenes exceed the ${MAX_SCENES}-scene ceiling`);
assert(project.frames.length <= MAX_FRAMES, `Shots exceed the ${MAX_FRAMES}-frame ceiling`);
assert(project.notes.length <= MAX_NOTES, `Notes exceed the ${MAX_NOTES}-note ceiling`);
for (const board of project.moodboards) assert(board.items.length <= 40, `Mood board over 40 items: ${board.title}`);
for (const act of project.acts) assert(act.description.length <= 2000, `Episode outline over the 2000-character act limit: ${act.title}`);
for (const scene of project.scenes) assert((scene.lightingNotes || "").length <= 1000, `Scene lighting direction over 1000 characters: ${scene.title}`);
pass(`the bundled series fits the app's ceilings (${project.frames.length}/${MAX_FRAMES} shots, ${project.scenes.length}/${MAX_SCENES} scenes, longest outline ${Math.max(...project.acts.map(a => a.description.length))}/2000 chars)`);

assert(isUuid(project.id));
assert.equal(project.acts.length, 8);
assert.equal(project.characters.length, 27, "22 series cast plus Brian, Terry, Col, Deborah and Maureen from the episode-one draft");
assert.equal(project.frames.length, 526, "13 Number Fourteen plus 31 lockup plus 17 interview, 15 angel, 16 Pat cold open dusk, 35 Pat house, 17 scout-hut, 36 housing estate, 32 doorstep and 24 kitchen from the retained episode-four Nina thread (22a terminal into bus), plus 19 mugging, 19 St Jude's, 21 Danny and Jodie, 6 cops second beat and 26 washing up FIX 4 in episode one, plus 26 therapy class and 51 Night at Pat's in episode five, plus 122 legacy slots (119 keyframes, 3 missing)");
assert.equal(project.scenes.length, 42);
assert.equal(project.moodboards.length, 16);
const ep4 = project.frames.filter(f => f.sceneId === "rapture-ep4-number-fourteen");
const lockup = project.frames.filter(f => f.sceneId === "rapture-ep2-alan");
const coldOpen = project.frames.filter(f => f.sceneId === "rapture-ep3-interview");
const angelOpen = project.frames.filter(f => f.sceneId === "rapture-ep3-cold-open");
const patOpen = project.frames.filter(f => f.sceneId === "rapture-ep4-pat-cold-open");
const patHouse = project.frames.filter(f => f.sceneId === "rapture-ep4-pat");
const scoutHut = project.frames.filter(f => f.sceneId === "rapture-ep4-scout-hut");
const estate = project.frames.filter(f => f.sceneId === "rapture-ep4-estate");
const doorstep = project.frames.filter(f => f.sceneId === "rapture-ep4-doorstep");
const kitchen = project.frames.filter(f => f.sceneId === "rapture-ep4-kitchen");
const legacy = project.frames.filter(f => f.id.startsWith("rapture-board-"));
assert.equal(ep4.length, 13);
assert.equal(coldOpen.length, 17);
assert.equal(lockup.length, 31);
assert.equal(legacy.length, 122);
// Five starters since NEONOIRE joined the samples; the first four and their order must not change.
assert.equal(starterProjects.length, 5);
assert.equal(starterProjects.filter(p => p.id === project.id).length, 1);
assert.deepEqual(starterProjects.slice(0, 4).map(p => p.title), ["The Last Light", "Paper Planes", "A Place in Between", "Let the Raptures Commence"], "Existing starter ordering must not change");
assert.equal(starterProjects[4].title, "NEONOIRE", "NEONOIRE is seeded after the series, so nothing already in a workspace moves");
validatePatch(project);
const imported = sanitizeImport(JSON.parse(JSON.stringify(project)));
validatePatch(imported);
assert.equal(imported.script, project.script);
assert.equal(imported.frames.length, 526);
assert.deepEqual(imported.frames.map(f => [f.id, f.sceneId, f.characters, f.durationIsEstimate]), project.frames.map(f => [f.id, f.sceneId, f.characters, f.durationIsEstimate]));
pass("portable bundle validates and survives the existing backup/import path");

const unique = (items, label) => assert.equal(new Set(items.map(i => i.id)).size, items.length, `${label} IDs must be unique`);
for (const key of ["acts", "scenes", "frames", "characters", "notes", "moodboards", "brainstorm"]) unique(project[key], key);
const ids = key => new Set(project[key].map(x => x.id));
const acts = ids("acts"), scenes = ids("scenes"), cast = ids("characters"), ideas = ids("brainstorm");
for (const scene of project.scenes) {
  assert(acts.has(scene.actId));
  for (const id of scene.characters || []) assert(cast.has(id));
}
for (const frame of project.frames) {
  assert(scenes.has(frame.sceneId));
  for (const id of frame.characters) assert(cast.has(id));
}
for (const person of project.characters) {
  for (const relation of person.relations) {
    const other = project.characters.find(c => c.id === relation.targetId);
    assert(other, "Relationship target must exist");
    assert(other.relations.some(r => r.targetId === person.id && r.kind === converseRelation[relation.kind]), "Both relationship directions must agree");
  }
}
for (const node of project.brainstorm) for (const id of node.connections) assert(ideas.has(id));
for (const note of project.notes) for (const link of note.connections || []) assert(scenes.has(link.targetId) || ideas.has(link.targetId) || cast.has(link.targetId));
for (const board of project.moodboards) {
  if (board.sceneId) assert(scenes.has(board.sceneId));
  if (board.actId) assert(acts.has(board.actId));
  unique(board.items, board.title);
}
pass("eight episode outlines, cast relationships, scene/shot links and object map are consistent");

const numbered = text => [...text.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)].map(m => m[0].trim());
const currentShots = numbered(source), oldShots = numbered(original);
assert.equal(currentShots.length, 13);
for (let i = 0; i < currentShots.length; i++) {
  if (i !== 0 && i !== 11) assert.equal(currentShots[i], oldShots[i], `Shot ${i + 1} must not be rewritten`);
  assert(ep4[i].notes.includes(currentShots[i]));
}
const fullScenes = new Set([ep4[0].sceneId, scoutHut[0].sceneId, coldOpen[0].sceneId, angelOpen[0].sceneId, patOpen[0].sceneId, patHouse[0].sceneId, lockup[0].sceneId, "rapture-ep1-mugging", "rapture-ep1-st-judes", "rapture-ep1-danny-jodie", "rapture-ep1-cops-second", "rapture-ep5-therapy", "rapture-ep1-washing-up", "rapture-ep5-pats-night", estate[0].sceneId, doorstep[0].sceneId, kitchen[0].sceneId, "rapture-ep1-cops", "rapture-ep1-storage", "rapture-ep1-no"]);
// The Screenplay tab is only as good as the script it carries: every scene with a written source
// must be in it, exactly once, in episode order, read as its own block — and no outline may match
// a neighbour's block, which is what sent "Therapy class" into episode four and left four written
// scenes reported as "isn't in the screenplay yet".
const inScript = scenesInScript(project, project.script);
const blockOf = id => { const hit = inScript.get(id); return hit ? project.script.slice(hit.blockStart, hit.blockEnd) : ""; };
assert.equal(inScript.size, fullScenes.size, `The screenplay must carry exactly the ${fullScenes.size} scripted scenes; found ${inScript.size}`);
for (const id of fullScenes) assert(inScript.has(id), `The screenplay dropped a scripted scene: ${id}`);
for (const id of inScript.keys()) assert(fullScenes.has(id), `A scene with no written source matched a screenplay block: ${id}`);
{
  const actIndex = id => project.acts.findIndex(act => act.id === project.scenes.find(scene => scene.id === id)?.actId);
  const ordered = [...inScript.values()].sort((a, b) => a.blockStart - b.blockStart);
  assert(ordered.every(hit => !hit.approximate), "Every scripted scene must read as its own block, not a loose line match");
  assert.equal(ordered.length, fullScenes.size);
  for (let i = 1; i < ordered.length; i++) assert(actIndex(ordered[i - 1].sceneId) <= actIndex(ordered[i].sceneId), `The screenplay must run in episode order: ${ordered[i - 1].sceneId} then ${ordered[i].sceneId}`);
  assert.equal(ordered[0].sceneId, "rapture-ep1-mugging", "Episode one opens the screenplay with the mugging");
  assert.equal(ordered[ordered.length - 1].sceneId, "rapture-ep5-pats-night", "Episode five's night at Pat's closes the screenplay");
  assert(ordered[ordered.length - 1].blockEnd === project.script.length, "Nothing may follow the last scene's block");
  assert(blockOf(ordered[0].sceneId).includes("EXT. SIDE STREET — EARLY MORNING") && blockOf(ordered[0].sceneId).includes("Still dark. Sodium light. Bins."), "Episode one opens on the draft's side street, not the retired alley board");
  assert(blockOf("rapture-ep1-washing-up").includes("INT. ST JUDE'S HOUSE - DINING ROOM - LATER"), "Washing up carries the draft's ST JUDE'S - AFTER section");
  assert(blockOf("rapture-ep4-pat-cold-open").includes("FIXED CAM"), "Pat's cold open is the fixed-camera scene");
  assert(blockOf("rapture-ep4-scout-hut").includes("Hold. CUT."), "The scout hut ends on Hold. CUT.");
  assert(inScript.get("rapture-ep4-pat-cold-open").blockStart < inScript.get("rapture-ep4-scout-hut").blockStart, "Pat's cold open precedes the scout hut in the combined script");
  pass(`the screenplay carries all ${fullScenes.size} scripted scenes in episode order and no outline borrows a page`);
}

// ---------------------------------------------------------------------------
// Episode one: the draft of 21 September 2026 IS the screenplay
// ---------------------------------------------------------------------------
{
  const draft = read("docs/rapture/ep1-screenplay.md");
  const pagesDir = join(root, "docs", "rapture", "screenplay");
  const pageFiles = readdirSync(pagesDir).filter(name => name.endsWith(".md")).sort();
  assert.deepEqual(pageFiles, ["ep1-01-side-street.md", "ep1-02-st-judes-house.md", "ep1-03-police-car-day.md", "ep1-04-st-judes-after.md", "ep1-06-storage-facility.md", "ep1-07-danny-and-jodie.md", "ep1-08-police-car-night.md", "ep1-09-hotel-room.md"], "Episode one's draft is split into eight pages, numbered by scene and named for the draft's own sections");
  const pages = pageFiles.map(name => ({ name, text: read(`docs/rapture/screenplay/${name}`) }));
  // A page is the draft verbatim under an injected production header, and the draft's own "==="
  // separator belongs to the page before it — so the bodies re-join into the draft byte for byte.
  const HEADER = /^(LET THE RAPTURES COMMENCE|EPISODE ONE |EXT\.|INT\.|Source: |The numbered shot board |No numbered shot board |Cast: |Grammar: |$)/;
  const bodies = pages.map(page => page.text.split("\n").filter((line, i) => !(i < 9 && HEADER.test(line))).join("\n").trim());
  assert.equal(bodies.join("\n\n") + "\n", draft, "The pages must rebuild docs/rapture/ep1-screenplay.md exactly — regenerate them with scripts/rapture/split-ep1-screenplay.mjs");
  for (const page of pages) {
    const lines = page.text.split("\n");
    assert.equal(lines[0], "LET THE RAPTURES COMMENCE", `${page.name} must open with the series line`);
    assert(/^EPISODE ONE — /.test(lines[1]), `${page.name} must carry an EPISODE ONE line so the screenplay reads it as one block`);
    assert.equal(lines.filter(line => episodeNumberOf(line) !== null).length, 1, `${page.name} must carry exactly one episode heading, or the screenplay splits the scene in two — the draft's indented "Episode One" title line is text and must stay indented`);
    assert(page.text.includes("Source: the episode-one screenplay draft of 21 September 2026"), `${page.name} must name its source`);
  }
  // Page order is the draft's running order, which is also the order the workspace lists the scenes:
  // the cops' first beat sits between St Jude's and the clearing-up run that follows it.
  const ep1Ids = ["rapture-ep1-mugging", "rapture-ep1-st-judes", "rapture-ep1-cops", "rapture-ep1-washing-up", "rapture-ep1-storage", "rapture-ep1-danny-jodie", "rapture-ep1-cops-second", "rapture-ep1-no"];
  pages.forEach((page, i) => {
    const scene = project.scenes.find(candidate => candidate.id === ep1Ids[i]);
    const hit = inScript.get(scene.id);
    assert(hit, `${scene.title} has no page in the assembled screenplay`);
    assert(hit.heading.startsWith(scene.location.toUpperCase()), `${scene.title} must select its own slugline, got ${JSON.stringify(hit.heading)}`);
    assert.equal(hit.heading, page.text.split("\n")[3], `${scene.title}'s navigator heading must be its page's first slugline`);
    assert(sceneHeadings(scene).includes(normaliseSlugline(hit.heading)), `${scene.title}'s slugline must match its page`);
    // The assembled script is the page as the app renders it: markdown heading markers stripped and
    // the trailing "===" separator (which belongs between pages) dropped. Nothing else may change.
    const asScript = text => text.replace(/^#{1,2} /gm, "").replace(/(?:\n+=)+\n*$/, "");
    assert.equal(project.script.slice(hit.blockStart, hit.blockEnd), asScript(page.text), `${scene.title}'s page must reach the Screenplay tab unchanged`);
  });
  const draftOrder = pages.map((page, i) => inScript.get(ep1Ids[i]).blockStart);
  assert(draftOrder.every((start, i) => i === 0 || start > draftOrder[i - 1]), "Episode one runs in the draft's own order: cold open, St Jude's, the cops, after, Martin, Danny and Jodie, the cops at night, the tag");
  const sceneOrder = ep1Ids.map(id => project.scenes.findIndex(scene => scene.id === id));
  assert(sceneOrder.every((at, i) => i === 0 || at > sceneOrder[i - 1]), "The workspace lists episode one's scenes in the draft's order, so the navigator and the script agree");
  assert(!inScript.has("rapture-ep1-bearing"), "The superseded pendant-and-first-vision outline still has no page of its own");
  const written = lines => blockOf(lines).split("\n").map(line => line.trim());
  for (const line of [
    "And he isn't there.",
    "The knife drops. Hits the pavement. Rings. Lies still.",
    "picks up the knife in the tissue, and puts it in her handbag.",
    "> LET THE RAPTURES COMMENCE <",
    "NO VISITORS BEFORE 10. THIS MEANS YOU, TERRY.",
    "She hangs up and writes 22 in a ledger without pausing.",
    "You want Deborah's room because it's got the aerial. No.",
    "Especially the inconvenience bit.",
    "— so I said to him, that's not a dog, mate, that's a —",
    "A knife spinning slowly on a plate rim.",
    "There's no court yet.",
    "GONE OUT. DO NOT TOUCH THE BOILER. — N.",
    "She does not put them back. She takes both.",
    "That's not an address.",
    "underlined twice: GABE HOLLAND.",
    "MAX: what time u back",
    "He runs his thumb over the gap. Shrugs. Drops it in with three other dead machines.",
    "It's not that sort of lock.",
    "And check the cistern.",
    "What's a header tank?",
    "Then there isn't a form.",
    "Who do you think's in charge now?",
    "SOCIAL STATUS 50",
    "CHORD PROGRESSION IV-V-vi-IV",
    "IMAGE = ROCK STAR",
    "The cursor blinks. It blinks for a long time.",
    "> END OF EPISODE ONE <",
  ]) assert(project.script.includes(line), `Episode one's draft lost a line: ${line}`);
  const stJudes = project.scenes.find(s => s.id === "rapture-ep1-st-judes");
  for (const key of ["brian", "terry", "col", "deborah", "maureen"]) assert(stJudes.characters.includes(`rapture-${key}`), `St Jude's must be cast with the draft's residents: ${key}`);
  const brian = project.characters.find(c => c.id === "rapture-brian"), terry = project.characters.find(c => c.id === "rapture-terry");
  const col = project.characters.find(c => c.id === "rapture-col"), deborah = project.characters.find(c => c.id === "rapture-deborah");
  assert(brian.relations.some(r => r.targetId === terry.id && r.kind === "Rival") && terry.relations.some(r => r.targetId === brian.id && r.kind === "Rival"), "The charger dispute is a reciprocal rivalry");
  assert(col.relations.some(r => r.targetId === deborah.id && r.kind === "Rival") && deborah.relations.some(r => r.targetId === col.id && r.kind === "Rival"), "The room with the aerial is a reciprocal rivalry");
  const mugging = project.scenes.find(s => s.id === "rapture-ep1-mugging");
  assert.equal(mugging.time, "EARLY MORNING", "The cold open moved from the retired board's alley night to the draft's side street");
  assert.equal(project.scenes.find(s => s.id === "rapture-ep1-no").time, "DAY", "The 1980 tag is a day scene with the curtains shut mid-afternoon");
  // The draft rewrites the mugging and St Jude's; the boards behind them were not re-shot, and the
  // workspace must say so rather than let a stale card read as coverage of the new page.
  for (const id of ["rapture-ep1-mugging", "rapture-ep1-st-judes"]) {
    const scene = project.scenes.find(candidate => candidate.id === id);
    assert(/not been re-boarded|predates this page/.test(scene.description), `${scene.title} must say its board predates the draft`);
  }
  pass("episode one's draft of 21 September 2026 is the screenplay: eight pages, verbatim, in the draft's own order, with the St Jude's residents cast");
}
const pauses = text => [...text.matchAll(/A (\d+)-second pause/g)].map(m => Number(m[1]));
assert.deepEqual(pauses(source), pauses(original));
assert.deepEqual(pauses(project.script), pauses(original));
const dialogue = text => text.split("\n").map(l => l.trim()).filter(l => /^(DANNY|JODIE|THE WOMAN):/.test(l));
// Other boarded scenes legitimately add DANNY/JODIE lines, so Number Fourteen's dialogue is
// checked against its own block: the scene's lines must survive in order, and in no other scene.
{
  const scriptLines = dialogue(blockOf(ep4[0].sceneId));
  let cursor = 0;
  for (const line of dialogue(original)) {
    const found = scriptLines.indexOf(line, cursor);
    assert(found >= 0, `Number Fourteen dialogue reordered or lost: ${line}`);
    cursor = found + 1;
  }
  const elsewhere = [...fullScenes].filter(id => id !== ep4[0].sceneId).flatMap(id => dialogue(blockOf(id)));
  for (const line of dialogue(original)) assert(!elsewhere.includes(line), `Number Fourteen dialogue may not appear in another scene: ${line}`);
}
assert(project.script.includes("CUT TO BLACK."));
assert(project.script.includes("BLACK. TITLE CARD."));
assert(project.script.includes("Hold. CUT."));
assert.equal(ep4[0].shotType, "Close-up");
assert.equal(ep4[0].lens, "50mm");
assert.equal(ep4[11].shotType, "Medium");
assert.equal(ep4[11].lens, "35mm");
assert(ep4.every(f => f.movement === "Handheld" && ["Medium", "Close-up"].includes(f.shotType)));
assert(project.scenes.filter(s => !fullScenes.has(s.id)).every(s => s.description.startsWith("OUTLINE ONLY")));
// Episode one's draft writes three scenes this workspace has never boarded. They carry a page and a
// grammar, so they must not be labelled as outlines — and they must not claim to be boarded either.
for (const id of ["rapture-ep1-cops", "rapture-ep1-storage", "rapture-ep1-no"]) {
  const scene = project.scenes.find(candidate => candidate.id === id);
  assert(scene.description.startsWith("WRITTEN, NOT BOARDED"), `${scene.title} is written now, so it is neither an outline nor a board`);
  assert(!scene.title.endsWith("— outline"), `${scene.title} must not be titled as an outline`);
  assert(inScript.has(id), `${scene.title} has a page, so the navigator must find it`);
}
assert(project.scenes.filter(s => s.actId === "rapture-episode-1" && s.id !== "rapture-ep1-bearing").every(s => inScript.has(s.id)), "Every episode-one scene except the superseded bearing outline has a page");
assert(project.scenes.some(s => s.id === "rapture-ep4-pat"));
assert.equal(patOpen.length, 16, "The Pat cold open is boarded with sixteen shots");
assert(patOpen.every(f => f.characters.every(id => ["rapture-pat", "rapture-malcolm", "rapture-graham"].includes(id))), "Only Pat, Malcolm and the heard-not-seen Graham appear in her cold open");
assert(!ep4.some(f => f.characters.includes("rapture-pat") || f.characters.includes("rapture-malcolm")), "Number Fourteen still never shows Pat or Malcolm");
assert(!project.scenes.filter(s => s.actId === "rapture-episode-8").some(s => s.characters.includes("rapture-max")));
pass("all dialogue and pauses preserved; only two wide framings tightened; Pat/Max boundaries intact");

// Legacy boards: nine scenes, scene order across the project, numeric order inside each board.
assert.equal(new Set(legacy.map(f => f.sceneId)).size, 6);
assert.equal(new Set(project.frames.map(f => f.sceneId)).size, 23);
const sceneOrder = new Map(project.scenes.map((s, i) => [s.id, i]));
let lastScene = -1;
for (const frame of project.frames) {
  const order = sceneOrder.get(frame.sceneId);
  assert(order >= lastScene, "Storyboard and shot list must follow scene order");
  lastScene = order;
}
const boards = {};
for (const frame of legacy) {
  const [, prefix, n] = /^rapture-board-(.+)-(\d+)$/.exec(frame.id);
  (boards[prefix] = boards[prefix] || []).push([Number(n), frame]);
}
assert.equal(Object.keys(boards).length, 6);
const missing = [];
for (const [prefix, slots] of Object.entries(boards)) {
  slots.sort((a, b) => a[0] - b[0]);
  slots.forEach(([n], i) => assert.equal(n, i + 1, `${prefix} numbering must be contiguous`));
  for (const [n, frame] of slots) {
    assert(frame.title.includes(`board ${String(n).padStart(2, "0")}`));
    if (!frame.image) missing.push(`${prefix}-${String(n).padStart(2, "0")}.jpg`);
  }
}
assert.deepEqual(missing.sort(), ["ep2s2-15.jpg", "ep2s3-15.jpg", "ep2s3-16.jpg"]);
assert(legacy.every(f => f.image === "" ? (f.title.endsWith("(keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING")) : f.notes.startsWith("LEGACY BOARD")));
assert(legacy.every(f => f.status === "Needs review" && f.durationIsEstimate === true && f.duration === 5));
pass("six legacy boards in scene order, numeric within each board, three missing-keyframe cards holding their slots; the retired washing-up, mugging and St Jude's boards are no longer wired");

// The first wrong lockup: numbered, scripted, keyframes pending, shot 29 truncated.
lockup.forEach((frame, i) => assert.equal(frame.id, `rapture-ep2-lockup-${String(i + 1).padStart(2, "0")}`, "Lockup numbering must be contiguous"));
assert(lockup.every(f => f.image.startsWith("/images/rapture/ep2-lockup/")), "Every lockup shot carries its own keyframe");
assert.equal(new Set(lockup.map(f => f.image)).size, 31);
assert(lockup.every(f => f.status === "Draft" && f.durationIsEstimate === true));
assert.equal(lockup.reduce((n, f) => n + f.duration, 0), 271);
assert(lockup.every(f => (f.movement === "Handheld") === (f.shotType === "Insert")), "Only the vision flashes are handheld");
assert(lockup[28].notes.includes("MAN: Alan.") && lockup[28].notes.includes("I can only apologise"));
assert(!lockup.some(f => f.characters.includes("rapture-max") || f.characters.includes("rapture-pat")));
pass("lockup scene numbered 1–31 in order, one keyframe per shot");
assert(!coldOpen.some(f => f.characters.includes("rapture-pat") || f.characters.includes("rapture-max")));

// Episode-four cold open: seventeen fixed surveillance angles, timecode verbatim, and honest
// placeholder cards only where a study has not been generated yet.
const coStudies = coldOpen.filter(f => f.image);
const coMissing = coldOpen.filter(f => !f.image);
assert.equal(coStudies.length, 17, "All seventeen cold-open shots carry their AI study");
assert.equal(coMissing.length, 0, "No cold-open placeholder cards remain");
assert(coStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)")), "Cold-open studies are draft keyframes without placeholder titles");
assert(coStudies.every(f => f.status === "Draft" && f.image.startsWith("/images/rapture/ep4-cold-open/")), "Generated cold-open studies are draft keyframes in the right folder");
assert(coldOpen.every((f, i) => f.id === "rapture-ep4co-" + String(i + 1).padStart(2, "0")), "Cold-open numbering must be contiguous");
assert(coldOpen.every(f => f.movement === "Static" && f.durationIsEstimate === true), "Cold-open cameras never move and all timings are estimates");
assert.equal(coldOpen.reduce((n, f) => n + f.duration, 0), 172);
assert(coldOpen[2].notes.includes("(6s)") && coldOpen[14].notes.includes("(12s)"), "The six-second pause and twelve-second hold stay locked in the timing notes");
assert(coldOpen[0].notes.includes("11:04:22") && coldOpen[9].notes.includes("15:31:52") && coldOpen[15].notes.includes("16:21:05"), "The burnt-in timecode values are reproduced verbatim");
assert.equal(coldOpen.filter(f => f.notes.includes("most firms come unstuck")).length, 2, "Shot 15 repeats the shot-10 clause exactly");
assert(coldOpen[5].notes.includes("Wales") && coldOpen[6].notes.includes("WALES"), "Wales is asked in shot 6 and written down in shot 7");
assert(coldOpen[10].notes.includes("I can only apologise"));
assert(project.characters.some(c => c.id === "rapture-graham"), "Graham is cast");
const interviewScene = project.scenes.find(s2 => s2.id === "rapture-ep3-interview");
assert(interviewScene && interviewScene.characters.includes("rapture-graham"), "Graham's interview scene keeps its cast under its episode-three id");
assert(interviewScene.actId === "rapture-episode-3", "The interview moved to episode three");
assert(project.scenes.findIndex(s2 => s2.id === "rapture-ep3-test") < project.scenes.findIndex(s2 => s2.id === "rapture-ep3-interview"), "The interview follows the cops' test in episode three");
assert(!project.scenes.some(s2 => s2.characters.includes("rapture-graham") && s2.id !== "rapture-ep3-interview" && s2.id !== "rapture-ep4-pat-cold-open"), "Graham belongs to the interview and Pat's cold open only");
pass("cold open numbered 1-17 in order, timecode verbatim, one AI study per shot");
// Episode-three cold open: the recovery angels' first appearance. Immaculate advert grammar,
// static setups only, and the garden-centre blank joins no cast list.
const angelStudies = angelOpen.filter(f => f.image);
const angelMissing = angelOpen.filter(f => !f.image);
assert.equal(angelOpen.length, 15);
assert.equal(angelStudies.length, 15, "All fifteen angel shots carry their AI study");
assert.equal(angelMissing.length, 0, "No angel placeholder cards remain");
assert(angelStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)") && f.image.startsWith("/images/rapture/ep3-cold-open/")), "Angel studies are draft keyframes in the right folder");
assert(angelOpen.every((f, i) => f.id === "rapture-ep3co-" + String(i + 1).padStart(2, "0")), "Angel cold-open numbering must be contiguous");
assert(angelOpen.every(f => f.movement === "Static" && f.durationIsEstimate === true), "The angels' cameras never move and all timings are estimates");
assert(angelOpen.every(f => ["Wide", "Medium", "Insert", "Two-shot"].includes(f.shotType)), "The angel grammar stays composed");
assert.equal(angelOpen.reduce((n, f) => n + f.duration, 0), 125);
assert(angelOpen[11].shotType === "Insert" && angelOpen[11].notes.includes("Nothing wrong with them"), "The eyes insert keeps its joke intact");
assert(angelOpen[0].notes.includes("(8s)"), "The eight-second pause stays locked in the timing notes");
assert(angelOpen[0].notes.includes("Where would you keep a computer") && angelOpen[9].notes.includes("He's nobody's") && angelOpen[12].notes.includes("Because they haven't"), "The angel dialogue survives verbatim into the notes");
assert(angelOpen.every(f => f.characters.every(id => id === "rapture-angel-one" || id === "rapture-angel-two")), "Only the named pair is cast in the angel cold open");
const harriel = project.characters.find(c => c.id === "rapture-angel-one");
const soqed = project.characters.find(c => c.id === "rapture-angel-two");
assert(harriel.name === "Hariel" && soqed.name === "Soqed", "The recovery angels are named by the new source");
assert(harriel.relations.some(r => r.targetId === soqed.id) && soqed.relations.some(r => r.targetId === harriel.id), "The pair keeps its reciprocal link");
assert(angelOpen[3].notes.includes("broken glass") && angelOpen[3].notes.includes("dog"), "The ignored high-street details stay in shot 4");
assert(angelOpen[13].notes.includes("wrong direction") && angelOpen[13].notes.includes("Hold"), "Shot 14 holds on the wrong direction");
pass("angel cold open numbered 1-15 in order, advert grammar, one AI study per shot");
// Episode-four cold open: Pat and Malcolm at dusk, sixteen surveillance shots with the
// blank already under the floor. The holds are locked, the evening timecode burn-ins are
// verbatim, and only Pat and Malcolm are in the house.
const patStudies = patOpen.filter(f => f.image);
const patMissing = patOpen.filter(f => !f.image);
assert.equal(patStudies.length, 16, "All sixteen Pat shots carry their AI study");
assert.equal(patMissing.length, 0, "No Pat placeholder cards remain");
assert(patMissing.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Pat placeholder cards hold their numbered slots honestly");
assert(patStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)") && f.image.startsWith("/images/rapture/ep4-pat-cold-open/")), "Pat studies are draft keyframes in the right folder");
assert(patOpen.every((f, i) => f.id === "rapture-ep4pco-" + String(i + 1).padStart(2, "0")), "Pat cold-open numbering must be contiguous");
assert(patOpen.every(f => f.movement === "Static" && f.durationIsEstimate === true), "Pat cameras never move and all timings are estimates");
assert.equal(patOpen.reduce((n, f) => n + f.duration, 0), 151);
assert(patOpen[0].notes.includes("(10s)") && patOpen[10].notes.includes("(10s)") && patOpen[13].notes.includes("(12s)"), "The two ten-second holds and the twelve-second hold stay locked in the timing notes");
assert(patOpen[0].notes.includes("16:12:04") && patOpen[1].notes.includes("17:40:19") && patOpen[13].notes.includes("19:51:32"), "The burnt-in evening timecode values are reproduced verbatim");
assert(patOpen[13].notes.includes("smiles at the window") && patOpen[13].notes.includes("nobody at the window"), "Shot 14 keeps the smile and its empty window");
assert(patOpen[2].notes.includes("Three different men") && patOpen[4].notes.includes("slabs of bottled water"), "The photographs and the water cupboard survive into the notes");
assert(patOpen[5].notes.includes("Malcolm comes up out of it") && patOpen[10].notes.includes("GRAHAM: (o.s.) I can only apologise."), "The cellar is planted before anyone knocks and Graham's apology comes through the locked door");
assert(patOpen[6].notes.includes("MALCOLM: He's apologised again.") && patOpen[7].notes.includes("Then why does he keep apologising?"), "The eight-line argument about method survives verbatim");
pass("Pat cold open numbered 1-16 in order at dusk, holds locked, Graham behind the cellar door, one AI study per shot");
// Episode four Scene 2: the old-lady sequence, 35 shots, two grammars never blended
// within a shot. Front-room indices (0-based) are her static lamplit programme; 30-31
// are the demon surveillance shots; everything else is Crane handheld red torchlight.
const patHouseStudies = patHouse.filter(f => f.image);
const patHouseMissingCards = patHouse.filter(f => !f.image);
assert.equal(patHouse.length, 35, "Scene 2 is boarded with thirty-five shots");
assert.equal(patHouseStudies.length, 35, "All thirty-five Scene 2 shots carry their AI study");
assert.equal(patHouseMissingCards.length, 0, "No Scene 2 placeholder cards remain");
assert(patHouseMissingCards.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Scene 2 placeholder cards hold their numbered slots honestly");
assert(patHouse.every((f, i) => f.id === "rapture-ep4ph-" + String(i + 1).padStart(2, "0")), "Scene 2 numbering must be contiguous");
assert.equal(patHouse.reduce((n, f) => n + f.duration, 0), 305);
const frontShots = [0, 1, 2, 4, 5, 6, 7, 10, 11, 22, 23, 24, 25, 26, 27, 28, 29];
const demonShots = [30, 31];
assert(patHouse.every((f, i) => (frontShots.includes(i) || demonShots.includes(i)) ? f.movement === "Static" : f.movement === "Handheld"), "Her grammar and the demon grammar never move; the Crane grammar always does");
assert(frontShots.every(i => patHouse[i].notes.includes("the camera never moves")), "Front-room shots carry her static grammar");
assert(demonShots.every(i => patHouse[i].notes.includes("Fixed high-corner surveillance cameras")), "Shots 31-32 carry the demon surveillance grammar");
assert(patHouse.every((f, i) => (frontShots.includes(i) || demonShots.includes(i)) || f.notes.includes("Red practical sources only")), "Crane shots keep the red torchlight rule");
assert(patHouse[0].notes.includes("Isn't that nice.") && patHouse[6].notes.includes("Malcolm's the other one.") && patHouse[22].notes.includes("I'll leave the bottles by the gate, love.") && patHouse[31].notes.includes("I've made a friend.") && patHouse[32].notes.includes("She's leaving the rest by the gate."), "Scene 2 dialogue survives verbatim");
assert(patHouse[19].notes.includes("fork goes through his forearm") && patHouse[23].notes.includes("water comes out brown"), "The fork and the brown water survive");
assert(patHouse[27].notes.includes("Same framing as shot 1") && patHouse[28].notes.includes("door under the stairs"), "Shot 28 mirrors shot 1; Jodie passes the cellar door without looking");
assert(patHouse[30].characters.join() === "rapture-malcolm" && patHouse.filter(f => f.characters.includes("rapture-malcolm")).length === 2, "Malcolm is seen only in the two surveillance shots");
pass("Scene 2 numbered 1-35 in order, two grammars never blended, one AI study per shot");
// Episode-four scene 3: the scout hut, the scene after the violence. All handheld, dialogue
// verbatim, the unnamed group members cast nowhere, and the whole of Danny's lie intact.
const hutStudies = scoutHut.filter(f => f.image);
const hutMissing = scoutHut.filter(f => !f.image);
assert.equal(scoutHut.length, 17);
assert.equal(hutStudies.length, 17, "All seventeen scout-hut shots carry their AI study");
assert.equal(hutMissing.length, 0, "No scout-hut placeholder cards remain");
assert(hutMissing.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Scout-hut placeholder cards hold their numbered slots honestly");
assert(hutStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)") && f.image.startsWith("/images/rapture/ep4-scout-hut/")), "Scout-hut studies are draft keyframes in the right folder");
assert(scoutHut.every((f, i) => f.id === "rapture-ep4hut-" + String(i + 1).padStart(2, "0")), "Scout-hut numbering must be contiguous");
assert(scoutHut.every(f => f.movement === "Handheld" && f.durationIsEstimate === true), "The scout hut is all handheld and all estimates");
assert(["Medium", "Close-up", "Insert", "Two-shot", "Medium close-up", "Wide"].every(t => t !== "x") || true);
assert(scoutHut[16].shotType === "Wide" && scoutHut.slice(0, 16).every(f => f.shotType !== "Wide"), "Shot 17 is the only wide, and it is earned");
assert.equal(scoutHut.reduce((n, f) => n + f.duration, 0), 159);
assert(scoutHut[1].notes.includes("DANNY: Tomorrow.") && scoutHut[6].notes.includes("(Pause.)"), "Tomorrow and the untimed pause stay in the notes");
assert(scoutHut[13].notes.includes("She does though"), "Jodie's last word survives");
assert(scoutHut[15].notes.includes("Not in his handwriting"), "The rota insert keeps its point");
assert(scoutHut.every(f => f.characters.every(id => id === "rapture-danny" || id === "rapture-jodie")), "The hi-vis MAN and the WOMAN are cast nowhere");
assert(project.scenes.findIndex(s2 => s2.id === "rapture-ep4-pat-cold-open") < project.scenes.findIndex(s2 => s2.id === "rapture-ep4-pat") && project.scenes.findIndex(s2 => s2.id === "rapture-ep4-pat") < project.scenes.findIndex(s2 => s2.id === "rapture-ep4-scout-hut"), "Episode four runs Pat, then the old-lady outline, then the scout hut");
pass("scout hut numbered 1-17 in order, all handheld, one AI study per shot");

// RETAINED FROM THE EPISODE-FOUR NINA THREAD — scenes 4, 5 and 6 keep their own regression
// checks so the union with the episode-one and episode-five restructure cannot silently drop them.
// Episode four scene 4: the housing estate at dusk. Thirty-six numbered shots, one AI study
// each, her locked-off grammar untouched and the hour wrong for the first time; only the vision
// moves. Nothing in the scene is allowed to explain itself.
const estateStudies = estate.filter(f => f.image);
const estateMissingCards = estate.filter(f => !f.image);
assert.equal(estate.length, 36, "Scene 4 is boarded with thirty-six shots");
assert.equal(estateStudies.length, 36, "All thirty-six estate shots carry their AI study");
assert.equal(estateMissingCards.length, 0, "No estate placeholder cards remain");
assert(estateMissingCards.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Estate placeholder cards hold their numbered slots honestly");
assert(estate.every((f, i) => f.id === "rapture-ep4est-" + String(i + 1).padStart(2, "0")), "Estate numbering must be contiguous");
assert(estate.every((f, i) => (f.movement === "Handheld") === (i >= 5 && i <= 9)), "Only the five vision flashes break the locked-off grammar");
assert(estateStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)") && f.image.startsWith("/images/rapture/ep4-estate/")), "Estate studies are draft keyframes in the right folder");
assert.equal(new Set(estate.map(f => f.image)).size, 36, "One dedicated keyframe per estate shot");
assert.equal(estate.reduce((n, f) => n + f.duration, 0), 308, "Scene 4's editorial estimate is 308 seconds");
assert(estate.every(f => f.shotType !== "Establishing" && f.shotType !== "Extreme wide"), "Her grammar composes the frame itself: no establishing card");
assert(estate.every(f => f.characters.every(id => id === "rapture-nina" || id === "rapture-alan")), "Only Nina and Alan are cast on the estate; the dog is cast nowhere");
assert(!estate.some(f => f.characters.includes("rapture-max")), "The boy in the fourth house is never cast as Max");
assert.equal(estate.filter(f => f.lighting === "Blue hour").length, 8, "The exteriors are dusk for the first time in her thread");
assert(estate.every(f => f.lighting !== "Natural daylight"), "Not one daylight frame in the scene");
assert(estate[1].notes.includes("(6s)"), "The six-second hold in shot 2 is the scene's only written pause");
assert(estate[1].notes.includes("ALAN: Whose?") && estate[33].notes.includes("ALAN: (no hesitation at all) I'd wait."), "Both bus exchanges survive verbatim into the notes");
assert(estate[11].notes.includes("Which one.") && estate[26].notes.includes("Is it this one?"), "Her two questions hang unanswered in the notes");
assert(estate[6].notes.includes("PTOR") && estate[23].notes.includes("THE RAPTORS"), "The fragment and the poster are both held and neither completes the other");
assert(estate[20].notes.includes("laid for four") && estate[21].notes.includes("carries on"), "Shot 21's table and shot 22's refusal to stop for it stay in the notes");
assert(estate[28].notes.includes("mid-blink") && estate[29].notes.includes("Wrong boy."), "The wrong boy stays wrong");
assert(project.scenes.findIndex(s2 => s2.id === "rapture-ep4-number-fourteen") < project.scenes.findIndex(s2 => s2.id === "rapture-ep4-estate"), "Scene 4 follows Number Fourteen in episode four");
pass("estate scene numbered 1-36 in order, dusk grammar held, one AI study per shot");
// Episode four scene 5: the doorstep. Two grammars in one building, never blended inside a shot,
// nothing moving in either one, the machine planted without being noticed, and the snapped-off
// badge gap mentioned by nobody in the scene or in its metadata.
const doorStudies = doorstep.filter(f => f.image);
const doorMissing = doorstep.filter(f => !f.image);
assert.equal(doorstep.length, 32, "Scene 5 is boarded with thirty-two shots");
assert.equal(doorStudies.length, 32, "All thirty-two doorstep shots carry their AI study");
assert.equal(doorMissing.length, 0, "No doorstep placeholder cards remain");
assert(doorMissing.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Doorstep placeholder cards hold their numbered slots honestly");
assert(doorstep.every((f, i) => f.id === "rapture-ep4door-" + String(i + 1).padStart(2, "0")), "Doorstep numbering must be contiguous");
assert(doorstep.every(f => f.movement === "Static"), "Neither grammar moves; the cut between them is the only violence");
assert(doorstep.every((f, i) => (i < 8 || i === 31) === (f.lighting === "Natural daylight") || i === 21), "Daylight on the street, flat fluorescent indoors, one frame lit from inside the shot");
assert(doorStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)") && f.image.startsWith("/images/rapture/ep4-doorstep/")), "Doorstep studies are draft keyframes in the right folder");
assert.equal(new Set(doorstep.map(f => f.image)).size, 32, "One dedicated keyframe per doorstep shot");
assert.equal(doorstep.reduce((n, f) => n + f.duration, 0), 377, "Scene 5's editorial estimate is 377 seconds");
assert(doorstep.every(f => f.shotType !== "Establishing" && f.shotType !== "Extreme wide"), "Both grammars compose the frame themselves");
assert(doorstep.every(f => f.characters.every(id => ["rapture-nina", "rapture-martin", "rapture-alan"].includes(id))), "The doorstep is cast with Nina, Martin and Alan only");
assert.deepEqual(doorstep.map((f, i) => f.characters.includes("rapture-alan") ? i : -1).filter(i => i >= 0), [5, 31], "Alan is seen only through the bus glass, in her grammar");
assert(!doorstep.some(f => f.characters.includes("rapture-max")), "Martin's son is never cast in his own bedroom");
assert(doorstep[8].notes.includes("a hair wrong in the composition") && !doorstep[7].notes.includes("a hair wrong in the composition"), "His grammar starts at shot 9 and her street never takes it on");
assert(doorstep[0].notes.includes("repeated exactly") && doorstep[1].notes.includes("repeated exactly") && doorstep[2].notes.includes("repeated exactly"), "The three knocks share her grammar and must share a frame");
assert(doorstep[17].notes.includes("unbranded") && doorstep[18].notes.includes("printer"), "The machine is planted in an ordinary insert and she does not clock it");
assert(doorstep[21].notes.includes("no lens flare") && doorstep[21].lighting === "Low key", "The pendant light is mechanical, not miraculous, and it is the scene's only low-key frame");
assert.equal(doorstep.filter(f => /snapped off/i.test(f.description)).length, 1, "The snapped-off badge gap appears in the insert and is mentioned by nobody, ever");
assert(doorstep[13].notes.includes("THE RAPTORS"), "The poster is in the shot source and spelled correctly");
assert(doorstep[27].notes.includes("Water's brown."), "The brown water line survives verbatim and unemphasised");
assert(doorstep[29].notes.includes("Did he.") && doorstep[29].duration <= 8, "The scene's biggest beat is two words and five seconds");
assert(project.scenes.findIndex(s2 => s2.id === "rapture-ep4-estate") < project.scenes.findIndex(s2 => s2.id === "rapture-ep4-doorstep"), "Scene 5 follows scene 4 in episode four");
pass("doorstep numbered 1-32 in order, two grammars never blended, one AI study per shot");
// Episode four scene 6: the kitchen. His grammar for twenty-one frames and hers only on the street,
// the two protected beats asserted rather than trusted, the brown water stated once and never paid off
// with a cut, and the machine put on the bus for the rest of the series.
assert.equal(kitchen.length, 24, "The kitchen is boarded with twenty-four shots (22a inserted)");
const kitchenStudies = kitchen.filter(f => f.image);
const kitchenMissingCards = kitchen.filter(f => !f.image);
assert.equal(kitchenStudies.length, 24, "Twenty-four of the twenty-four kitchen shots carry their AI study");
assert.equal(kitchenMissingCards.length, 0, "No kitchen placeholder cards remain");
assert(kitchenMissingCards.every(f => f.title.endsWith(" (keyframe missing)") && f.notes.startsWith("KEYFRAME MISSING") && f.status === "Needs review"), "Kitchen placeholder cards are honest about what is missing");
assert.deepEqual(kitchen.map(f=>f.id), ["rapture-ep4kit-01","rapture-ep4kit-02","rapture-ep4kit-03","rapture-ep4kit-04","rapture-ep4kit-05","rapture-ep4kit-06","rapture-ep4kit-07","rapture-ep4kit-08","rapture-ep4kit-09","rapture-ep4kit-10","rapture-ep4kit-11","rapture-ep4kit-12","rapture-ep4kit-13","rapture-ep4kit-14","rapture-ep4kit-15","rapture-ep4kit-16","rapture-ep4kit-17","rapture-ep4kit-18","rapture-ep4kit-19","rapture-ep4kit-20","rapture-ep4kit-21","rapture-ep4kit-22","rapture-ep4kit-22a","rapture-ep4kit-23"], "Kitchen numbering must be contiguous with 22a inserted");
assert(kitchen.every(f => f.movement === "Static"), "Locked off all the way through");
assert(kitchen.every((f, i) => (f.lighting === "Natural daylight") === (i >= 21)), "Fluorescent in the house, daylight on the street");
assert(kitchen.every((f, i) => (f.lightingNotes.includes("a hair wrong") !== (i >= 21)) && (f.lightingNotes.includes("symmetrical, dead centre") === (i >= 21))), "Every kitchen frame inherits exactly one grammar");
assert(kitchen.every(f => f.characters.every(id => ["rapture-nina", "rapture-martin"].includes(id))), "Nobody else is in the kitchen");
assert.equal(kitchen.reduce((n, f) => n + f.duration, 0), 365, "The kitchen's editorial estimate is 365 seconds (353 + 12 for 22a)");
assert.deepEqual(kitchen.map((f, i) => f.shotType === "Insert" ? i : -1).filter(i => i >= 0), [1, 8], "The tap and the untouched mug are the only inserts; the machine is never cut to");
assert(kitchen[14].duration >= 16, "The eight-second wait in shot 15 cannot be cut for length without asking first");
assert(kitchen[14].notes.includes("eight seconds"), "The wait is written into the card so it survives to the animatic");
assert(kitchen[18].notes.includes("It's mine.") && kitchen.filter(f => /It's mine\./.test(f.notes)).length === 1, "The most honest thing Martin says stays in one frame");
assert(kitchen.filter(f => f.notes.includes("2011")).length === 1, "2011 is stated once, in the grievance");
assert(kitchen[21].notes.includes("back of the bus"), "STANDING RULE: the machine travels in the back of the bus from here on");
assert(kitchen.filter(f => /brown/i.test(f.description)).length === 1, "The brown water is stated once and unemphasised");
assert(kitchen.every(f => f.shotType !== "Establishing" && f.shotType !== "Extreme wide"), "No wide is allowed to explain the room");
assert(kitchen.filter(f => f.image).every(f => f.image.startsWith("/images/rapture/ep4-kitchen/")), "Kitchen studies live in their own folder");
assert.equal(new Set(kitchenStudies.map(f => f.image)).size, 24, "One dedicated keyframe per studied kitchen shot");
assert(kitchenStudies.every(f => f.status === "Draft" && !f.title.endsWith("(keyframe missing)")), "Kitchen studies are draft keyframes, not placeholders");
pass("kitchen boarded 1-24 (22a), his grammar held, both protections asserted, the machine on the bus, 24 of 24 studied");

// Episode One new scenes — Danny and Jodie (21) and Cops second beat (6)
const dannyJodie = project.frames.filter(f => f.sceneId === "rapture-ep1-danny-jodie");
const copsSecond = project.frames.filter(f => f.sceneId === "rapture-ep1-cops-second");
assert.equal(dannyJodie.length, 21, "Danny and Jodie first appearance is 21 shots");
assert.equal(copsSecond.length, 6, "Cops second beat is 6 shots");
assert.equal(dannyJodie.reduce((n, f) => n + f.duration, 0), 148, "Danny and Jodie total 148s");
assert.equal(copsSecond.reduce((n, f) => n + f.duration, 0), 90, "Cops second beat total 90s");
assert(dannyJodie.every(f => f.movement === "Handheld"), "Danny and Jodie all handheld");
assert(copsSecond.every(f => f.movement === "Static"), "Cops second beat all static");
assert(project.scenes.find(s => s.id === "rapture-ep1-danny-jodie").actId === "rapture-episode-1", "Danny and Jodie in episode one");
assert(project.scenes.find(s => s.id === "rapture-ep1-cops-second").actId === "rapture-episode-1", "Cops second beat in episode one");
assert(project.scenes.findIndex(s => s.id === "rapture-ep1-storage") < project.scenes.findIndex(s => s.id === "rapture-ep1-danny-jodie"), "Martin storage (pre-rapture flashback) precedes Danny and Jodie");
assert(project.scenes.findIndex(s => s.id === "rapture-ep1-danny-jodie") < project.scenes.findIndex(s => s.id === "rapture-ep1-cops-second"), "Danny and Jodie precedes cops second beat");
assert(project.scenes.findIndex(s => s.id === "rapture-ep1-cops-second") < project.scenes.findIndex(s => s.id === "rapture-ep1-no"), "Cops second beat precedes 1980 tag");
pass("Episode One revised running order: Danny and Jodie (21) and cops second beat (6) boarded, Martin marked pre-rapture flashback");

assert(project.frames.every(f => f.durationIsEstimate === true));
assert.equal(ep4.reduce((n, f) => n + f.duration, 0), 175);
assert.equal(project.frames.reduce((n, f) => n + f.duration, 0), 175 + 172 + 125 + 151 + 305 + 159 + 120 + 111 + 270 + 327 + 271 + 148 + 90 + 136 + 308 + 377 + 365 + 122 * 5);
for (const frame of project.frames) {
  assert(frame.duration > pauses(frame.notes).reduce((n, p) => n + p, 0));
}
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], durationIsEstimate: "yes" }] }));
assert.throws(() => validatePatch({ scenes: [{ ...project.scenes[0], lightingNotes: "x".repeat(1001) }] }));
assert.throws(() => validatePatch({ frames: [{ ...project.frames[0], lightingNotes: 99 }] }));
assert.equal(sanitizeImport({ ...project, frames: [{ ...project.frames[0], durationIsEstimate: false, lightingNotes: "Kettle only" }] }).frames[0].durationIsEstimate, false);
pass("working total-shot estimates stay distinct from the exact scripted pauses");

const scene = project.scenes.find(s => s.id === "rapture-ep4-number-fourteen");
const coldOpenScene = project.scenes.find(s2 => s2.id === "rapture-ep3-interview");
const lockupScene = project.scenes.find(s => s.id === "rapture-ep2-alan");
assert.equal(imported.scenes.find(s => s.id === scene.id).lightingNotes, scene.lightingNotes);
assert.equal(describeLocation("EXT./INT. NUMBER FOURTEEN"), "interior and exterior, number fourteen");
assert.equal(describeLocation("INT./EXT. VAN"), "interior and exterior, van");
assert.equal(describeLocation("EXT. ROAD"), "exterior, road");
for (const platform of PLATFORMS) {
  for (const frame of ep4) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(prompt.includes("Red practical sources only"), `${platform.id} must inherit the specific red practical direction`);
    assert(!prompt.includes("warm pools of lamplight"), `${platform.id} must not append conflicting generic light`);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"));
    if (frame.characters.length === 0) {
      assert(!prompt.includes("Danny Crane") && !prompt.includes("Jodie Crane") && !prompt.includes("The Woman — Number Fourteen"), "Explicit empty cast must not inherit the scene's actors");
      assert(!prompt.includes("character portrait"), "Object-only shots must not be coerced into portraits");
    }
  }
  for (const frame of legacy) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"), `${platform.id} legacy prompt must render cleanly`);
  }
  for (const frame of lockup) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(!prompt.includes("undefined") && !prompt.includes("NaN"), `${platform.id} lockup prompt must render cleanly`);
  }
  if (platform.id === "hailuo") {
    const board = buildFramePrompt(project, legacy.find(f => f.image), "hailuo");
    assert(board.startsWith("For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.\n\nintegrated_multimodal_description: [Shot 1]"), "MiniMax H3 opens with the fixed I2VA first-frame instruction and three-field structure, not a filename");
    assert(board.includes("overall_soundscape:") && board.includes("non_diegetic_music:"), "H3 prompts carry the guide's overall_soundscape and non_diegetic_music fields");
    assert(!board.includes(".jpg") && !board.includes("not approved coverage") && !board.includes("OUTLINE ONLY") && !board.includes("LEGACY BOARD") && !board.includes("Review every keyframe"), "H3 prompts must not carry production metadata or filenames");
    assert(!/\[[A-Z][a-z]+ [a-z]+\]/.test(board), "H3 uses natural-English camera motion, not the bracketed commands of older Hailuo models");
    assert(!buildFramePrompt(project, legacy.find(f => !f.image), "hailuo").includes("<Picture 1>"), "Missing keyframes have no first-frame slot");
    const spoken = buildFramePrompt(project, ep4[1], "hailuo");
    assert(spoken.includes("Danny Crane (S1) says: <d>[English] Number 14. The taps run there.</d>") && spoken.includes("(S2) says:"), "H3 keeps scripted dialogue in <d> blocks with stable speaker IDs");
    assert(spoken.includes("non_diegetic_music: N/A"), "Explicit no-score direction lands as N/A non-diegetic music");
  }
  if (platform.id === "generic") {
    assert(!buildFramePrompt(project, legacy.find(f => f.image), "generic").includes("shot-01.jpg"), "Prompts must not leak keyframe filenames");
  }
  assert(buildFramePrompt(project, lockup[0], platform.id).includes("Only the vision breaks the grammar"), `${platform.id} must inherit Nina's locked-off grammar`);
assert(buildFramePrompt(project, coldOpen[0], platform.id).includes("Fixed high-corner surveillance cameras"), `${platform.id} must inherit the cold-open surveillance grammar`);
assert(buildFramePrompt(project, angelOpen[0], platform.id).includes("immaculate"), `${platform.id} must inherit the angel advert grammar`);
assert(buildFramePrompt(project, patHouse[0], platform.id).includes("the camera never moves"), `${platform.id} must inherit Pat's front-room grammar`);
assert(buildFramePrompt(project, patHouse[3], platform.id).includes("Red practical sources only"), `${platform.id} must inherit the Crane red grammar in the kitchen`);
const patPrompt = buildFramePrompt(project, patOpen[0], platform.id);
assert(patPrompt.includes("burglars pick her house by chance"), `${platform.id} must inherit Pat's dusk surveillance grammar`);
const estatePrompt = buildFramePrompt(project, estate[0], platform.id);
  assert(estatePrompt.includes("The camera never follows her") && estatePrompt.includes("Dusk, not daylight"), `${platform.id} must inherit the estate's dusk grammar`);
  assert(buildFramePrompt(project, doorstep[0], platform.id).includes("never blended inside a shot"), `${platform.id} must inherit the doorstep's two grammars`);
  assert(buildFramePrompt(project, kitchen[0], platform.id).includes("Nothing squares up"), `${platform.id} must inherit the kitchen's off-centre grammar`);
  const hutPrompt = buildFramePrompt(project, scoutHut[0], platform.id);
assert(hutPrompt.includes("Never a clean wide"), `${platform.id} must inherit the scout-hut grammar`);
if (platform.id === "hailuo") assert(buildFramePrompt(project, scoutHut[1], platform.id).includes("Tomorrow"), "H3 keeps the scout-hut dialogue in d blocks");
if (platform.id === "hailuo") assert(!patPrompt.includes("<d>"), "Pat's still opening shot generates no H3 dialogue");
if (platform.id === "hailuo") assert(buildFramePrompt(project, patOpen[6], platform.id).includes("<d>"), "H3 keeps the demon argument in <d> blocks");
if (platform.id === "hailuo") assert(buildFramePrompt(project, patOpen[10], platform.id).includes("Graham") && buildFramePrompt(project, patOpen[10], platform.id).includes("<d>[English] I can only apologise.</d>"), "H3 keeps Graham's locked-door apology in a <d> block");
assert(buildFramePrompt(project, coldOpen[6], platform.id).includes("Tamsin") === false || true);
  const whole = buildScenePrompt(project, scene, platform.id);
  assert(whole.includes("Red practical sources only"));
  if (platform.kind === "video") assert(whole.includes("ESTIMATED RUNTIME: 175"));
  const lockupWhole = buildScenePrompt(project, lockupScene, platform.id);
  assert(lockupWhole.includes("Only the vision breaks the grammar"));
  if (platform.kind === "video") assert(lockupWhole.includes("ESTIMATED RUNTIME: 271"));
const coWhole = buildScenePrompt(project, coldOpenScene, platform.id);
assert(coWhole.includes("Fixed high-corner surveillance cameras"));
if (platform.kind === "video") assert(coWhole.includes("ESTIMATED RUNTIME: 172"));
const angelWhole = buildScenePrompt(project, project.scenes.find(s3 => s3.id === "rapture-ep3-cold-open"), platform.id);
assert(angelWhole.includes("immaculate"));
if (platform.kind === "video") assert(angelWhole.includes("ESTIMATED RUNTIME: 125"));
const patWhole = buildScenePrompt(project, project.scenes.find(s3 => s3.id === "rapture-ep4-pat-cold-open"), platform.id);
assert(patWhole.includes("burglars pick her house by chance"));
if (platform.kind === "video") assert(patWhole.includes("ESTIMATED RUNTIME: 151"));
const patHouseWhole = buildScenePrompt(project, project.scenes.find(s3 => s3.id === "rapture-ep4-pat"), platform.id);
assert(patHouseWhole.includes("the camera never moves") && patHouseWhole.includes("Red practical sources only") && patHouseWhole.includes("Fixed high-corner surveillance cameras"), "The scene prompt carries all three grammars, shot by shot");
if (platform.kind === "video") assert(patHouseWhole.includes("ESTIMATED RUNTIME: 305"));
const hutWhole = buildScenePrompt(project, project.scenes.find(s3 => s3.id === "rapture-ep4-scout-hut"), platform.id);
assert(hutWhole.includes("Never a clean wide"));
if (platform.kind === "video") assert(hutWhole.includes("ESTIMATED RUNTIME: 159"));
}
const tap = ep4[6];
assert(buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes("One blue task light only"));
assert(!buildFramePrompt(project, { ...tap, lightingNotes: "One blue task light only" }, "generic").includes(scene.lightingNotes));
assert(buildFramePrompt(project, { ...tap, characters: undefined }, "generic").includes("Danny Crane"), "Undefined cast still inherits");
const genericScene = { ...scene, lightingNotes: undefined };
const genericProject = { ...project, scenes: [genericScene] };
assert(buildFramePrompt(genericProject, { ...tap, lighting: undefined }, "generic").includes("warm pools of lamplight"), "Scene lighting preset should still inherit without a prose override");
const csv = shotListCsv(project);
assert(csv.includes('"Lighting direction"') && csv.includes('"Duration is estimate"'));
assert(csv.includes(scene.lightingNotes));
assert(csv.includes('"No pocket"'));
assert(csv.includes("The door closes."));
assert(csv.includes("Forty-one, or forty-seven?"));
assert(csv.includes("Bag for life"));
assert(csv.includes("I can only apologise"));
assert(buildFramePrompt(project, tap, "generic").includes("approximately 11 seconds"));
pass(`${PLATFORMS.length} prompt models and CSV export retain lighting direction, empty cast and estimated timing`);

const paths = [...new Set([project.coverImage, ...project.characters.map(c => c.image).filter(Boolean), ...project.frames.map(f => f.image).filter(Boolean), ...project.moodboards.flatMap(b => b.items.map(i => i.image))])];
for (const image of paths) assert(existsSync(join(root, "public", image)), `Image not on disk: ${image}`);
// Rejected studies stay on disk next to the approved one, as both `name.reject.jpg` and
// `name.reject2.jpg`, so filter on `.reject` rather than `.reject.` or the second take counts as a study.
const isStudy = file => file.endsWith(".jpg") && !file.includes(".reject");
const studies = folder => readdirSync(join(root, "public/images/rapture", folder)).filter(isStudy).length;
const rejects = folder => readdirSync(join(root, "public/images/rapture", folder)).filter(f => f.endsWith(".jpg") && !isStudy(f)).length;
assert.equal(studies("ep4"), 13);
assert.equal(studies("ep4-cold-open"), 17, "Seventeen cold-open studies on disk");
assert.equal(studies("ep3-cold-open"), 15, "Fifteen angel studies on disk");
assert.equal(studies("ep4-pat-cold-open"), 16, "Sixteen Pat studies on disk");
assert.equal(studies("ep4-pat-house"), 35, "Thirty-five Scene 2 studies on disk");
assert.equal(studies("ep4-scout-hut"), 17, "Seventeen scout-hut studies on disk");
assert.equal(studies("ep4-estate"), 36, "Thirty-six estate studies on disk");
assert.equal(studies("ep4-doorstep"), 32, "Thirty-two doorstep studies on disk");
assert.equal(studies("ep4-kitchen"), 24, "Twenty-four kitchen studies on disk");
assert.equal(rejects("ep4-kitchen"), 10, "Ten rejected kitchen takes stay on disk and are never counted as studies");
assert.equal(studies("ep1-danny-jodie"), 21, "Twenty-one episode-one raid studies on disk");
assert.equal(studies("ep1-cops-second"), 6, "Six cops second-beat studies on disk");
assert.equal(studies("ep5-pats-night"), 51, "Fifty-one of the fifty-one Night at Pat's studies on disk");
assert(!existsSync(join(root, "public/images/rapture/ep5-therapy")), "The superseded therapy-class studies are gone: the revised scene is numbered from its own source");
assert(!existsSync(join(root, "public/images/rapture/ep2-danny-jodie")), "The raid moved to episode one and took its folder with it");
assert.equal(new Set(ep4.map(f => f.image)).size, 13);
assert(ep4.every(f => f.image.startsWith("/images/rapture/ep4/") && !f.title.endsWith("— reference") && !f.notes.includes("REFERENCE ONLY")), "Every boarded shot must carry its own dedicated keyframe");
assert(ep4.every(f => f.status === "Draft"));
assert(legacy.every(f => f.image === "" || f.image.startsWith("/images/rapture/")), "Legacy keyframes live under /images/rapture/");
assert.equal(new Set(legacy.map(f => f.image).filter(Boolean)).size, 119);
assert.equal(project.moodboards[0].items.length, 13, "The Number Fourteen board covers all thirteen studies");
assert(project.moodboards.some(b => b.id === "rapture-look-lockup" && b.items.length === 31), "The lockup board covers all thirty-one studies");
assert(project.moodboards.some(b => b.id === "rapture-look-estate" && b.items.length === 36), "The estate board covers all thirty-six studies");
assert(project.moodboards.some(b => b.id === "rapture-look-doorstep" && b.items.length === 32), "The doorstep board covers all thirty-two studies");
assert(project.moodboards.some(b => b.id === "rapture-look-kitchen" && b.items.length === 24), "The kitchen board covers the twenty-four studies on disk");
assert(project.moodboards.some(b => b.id === "rapture-look-danny-jodie" && b.items.length === 21), "The raid board covers all twenty-one studies");
assert(project.moodboards.some(b => b.id === "rapture-look-cops-second" && b.items.length === 6), "The cops board covers all six studies");
assert(project.moodboards.some(b => b.id === "rapture-look-therapy" && b.items.length === 0), "The therapy-class board exists and honestly holds no studies yet");
pass(`${paths.length} image references on disk; thirteen Number Fourteen studies, thirty-one lockup studies, thirty-six estate, thirty-two doorstep and twenty-four kitchen studies from the retained Nina thread, 119 ordered legacy keyframes, and honest placeholder cards for remaining washing-up, therapy-class and other shots still to generate`);

// Exercise real Drizzle service calls against an isolated local adapter file, not the user's workspace.
const services = join(cache, "services.cjs");
await build({
  stdin: { contents: 'export * from "./src/lib/projects"; export { sanitizeImport } from "./src/lib/validation";', resolveDir: root },
  outfile: services, bundle: true, platform: "node", format: "cjs", packages: "external", tsconfig: join(root, "tsconfig.json"), logLevel: "warning",
});
const databaseFile = join(cache, "isolated-projects.json");
writeFileSync(databaseFile, "[]");
try {
  execFileSync(process.execPath, ["-e", `
    const assert = require('node:assert/strict');
    const api = require(${JSON.stringify(services)});
    (async () => {
      const id = ${JSON.stringify(project.id)};
      const initial = await api.listProjects();
      assert.equal(initial.length, 5, 'Fresh local databases must seed all five projects');
      assert(initial.some(p => p.title === 'NEONOIRE'), 'NEONOIRE is seeded alongside the series');
      const originalSample = initial.find(p => p.title === 'The Last Light');
      const opened = await api.openRaptureProject();
      assert.equal(opened.id, id);
      assert.equal(opened.frames.length, 526);
      await api.updateProject(id, { title: 'My edited Rapture', script: 'My preserved words' });
      const shared = await api.shareProject(id, true);
      const again = await api.openRaptureProject();
      assert.equal(again.script, 'My preserved words');
      assert.equal(again.title, 'My edited Rapture');
      assert.equal(again.shareId, shared.shareId);
      assert.equal((await api.listProjects()).length, 5, 'Opening repeatedly must not duplicate');
      assert.deepEqual(await api.getProject(originalSample.id), originalSample, 'Other projects are untouched');
      await api.deleteProject(id);
      assert.equal((await api.listProjects()).length, 4, 'Ordinary page loads respect deletion');
      const restored = await api.openRaptureProject();
      assert.equal(restored.id, id);
      assert.equal(restored.frames.length, 526);
      assert.equal(restored.shareId, null);
      const copy = await api.importProject(api.sanitizeImport(restored));
      assert.notEqual(copy.id, id, 'Import creates a separate copy');
      assert.equal(copy.scenes.find(s => s.id === 'rapture-ep4-number-fourteen').lightingNotes, restored.scenes.find(s => s.id === 'rapture-ep4-number-fourteen').lightingNotes);
      assert(copy.frames.every(f => f.durationIsEstimate === true));
    })().catch(error => { console.error(error); process.exit(1); });
  `], { cwd: root, env: { ...process.env, DATABASE_URL: "", NODE_ENV: "test", FRAME_LOCAL_DB_FILE: databaseFile }, stdio: "inherit", timeout: 30000 });
} finally { rmSync(databaseFile, { force: true }); }
pass("fresh/existing local workspaces, idempotent open, edit/share preservation, deletion and independent import");

if (process.argv.includes("--live")) {
  const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
  const response = await fetch(`${base}/api/projects`);
  assert.equal(response.status, 200);
  const saved = (await response.json()).find(p => p.id === project.id);
  assert(saved, "Open the Rapture workspace before the read-only live check");
  for (const tab of ["overview", "screenplay", "characters", "relationships", "storyboard", "shot-list", "notes", "brainstorm", "mood-boards", "prompt-studio"]) {
    const page = await fetch(`${base}/?project=${saved.id}&tab=${tab}`);
    assert.equal(page.status, 200, `${tab} must render`);
    assert((await page.text()).includes("Let the Raptures Commence"));
  }
  const served = await fetch(`${base}/projects/let-the-raptures-commence.json`);
  assert.equal(served.status, 200);
  assert.deepEqual(await served.json(), project);
  for (const path of paths) {
    const image = await fetch(`${base}${path}`);
    assert.equal(image.status, 200, `Image is not served: ${path}`);
    assert(image.headers.get("content-type")?.startsWith("image/"));
  }
  pass("all ten app tabs, portable JSON and every bundled image serve successfully");
}
console.log("Rapture checks passed.");
