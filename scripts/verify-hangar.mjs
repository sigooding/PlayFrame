// npm run verify:hangar: the cold-open workspace's schema, ceilings, source fidelity and isolation.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(join(root, file), "utf8");
const project = JSON.parse(read("public/projects/hangar-cold-open.json"));
const pass = message => console.log(`  PASS  ${message}`);
console.log("=== The cold-open workspace ===");
execFileSync(process.execPath, ["scripts/hangar/build-project.mjs", "--check"], { cwd: root, stdio: "inherit" });

const cache = join(root, "node_modules/.cache/verify-hangar");
mkdirSync(cache, { recursive: true });
const lib = join(cache, "lib.mjs");
await build({ stdin: { contents: 'export * from "./src/lib/validation"; export * from "./src/lib/frame-order"; export * from "./src/lib/prompt"; export * from "./src/lib/styles"; export * from "./src/lib/types"; export { hangarUpdates } from "./src/lib/hangar";', resolveDir: root }, outfile: lib, bundle: true, platform: "node", format: "esm", tsconfig: join(root, "tsconfig.json"), logLevel: "warning" });
const { validatePatch, isUuid, MAX_FRAMES, MAX_SCENES, framesInSceneOrder, buildFramePrompt, buildScenePrompt, visualStyle, VISUAL_STYLES, TRANSITIONS, PLATFORMS, hangarUpdates } = await import(`file://${lib}`);

assert(isUuid(project.id));
validatePatch(project);
pass("the bundle is a valid project");
assert(project.frames.length <= MAX_FRAMES && project.scenes.length <= MAX_SCENES);
assert.equal(project.scenes.length, 8);
assert.equal(project.frames.length, 39);
assert.deepEqual(framesInSceneOrder(project.frames, project.scenes).map(f => f.id), project.frames.map(f => f.id), "frames are already in scene order");
for (const f of project.frames) {
  assert(f.image.startsWith("/images/hangar/") && existsSync(join(root, "public", f.image.slice(1))), `shot ${f.shotNumber} keeps its painted board on disk under public/images/hangar/`);
  assert.equal(f.status, "Draft", "every board lands as a draft for the director's review");
}
for (const c of project.characters) {
  if (c.image) assert(existsSync(join(root, "public", c.image.slice(1))), `${c.id}'s continuity sheet is on disk`);
}
assert(existsSync(join(root, "public", project.coverImage.slice(1))), "the cover key art is on disk");
assert(existsSync(join(root, "public/images/styles/painted-americana-75.jpg")), "the style picker example for Painted Americana '75 is on disk");
assert(project.frames.every(f => project.scenes.some(s => s.id === f.sceneId)), "every frame belongs to a scene");
assert.equal(new Set(project.frames.map(f => f.shotNumber)).size, project.frames.length, "shot numbers are unique");
pass("8 scenes, 39 shots, in order, every board painted on disk under public/images/hangar/");

const text = project.script;
for (const word of ["alien", "robot", "UFO"]) {
  const lines = text.split("\n").filter(line => new RegExp(`\\b${word}\\b`, "i").test(line) && !line.includes("never says") && !line.includes("Nobody in this film"));
  assert.equal(lines.length, 0, `nobody says "${word}" in the open`);
}
assert(!project.frames.some(f => /\b(alien|robot|ufo)\b/i.test(f.description + f.title)), "no shot names it");
assert(project.frames.filter(f => /flare/i.test(f.description)).length >= 3 && !/(?<!not )flashlight/i.test(project.frames.map(f => f.description).join(" ")), "flares, never flashlights");
pass("nothing is ever named, and the light outdoors is flares");


// The house style and the shot details: every scene and shot carries the style, a mood, a lighting
// direction and a deliberate transition, and the prompts built from them stay clean.
const style = visualStyle("hangar");
assert.equal(style.id, "hangar", "the Painted Americana '75 style exists in the library");
assert.equal(VISUAL_STYLES.filter(entry => entry.id === "hangar").length, 1);
assert(!style.photoreal && /gouache/.test(style.prompt) && /Iron Giant/.test(style.prompt) && /Ghibli/.test(style.prompt), "the style is the painted, weighty look from the brief");
assert(project.scenes.every(scene => scene.style === "hangar" && scene.lightingNotes && scene.lightingNotes.length <= 1000), "every scene carries the style and a lighting direction");
assert(project.frames.every(frame => frame.style === "hangar"), "every shot carries the style");
assert(project.frames.every(frame => frame.mood && frame.mood.length <= 300), "every shot has a mood");
assert(project.frames.every(frame => frame.lightingNotes && frame.lightingNotes.length <= 1000 && frame.lighting), "every shot has a lighting direction");
assert(project.frames.every(frame => frame.notes.includes("\nFraming: ") && frame.notes.startsWith("Sound: ")), "every shot carries framing and sound direction");
assert(project.frames.every(frame => TRANSITIONS.includes(frame.transition)), "every transition is one the app knows");
assert.equal(project.frames[3].transition, "Fade in", "the hangar fades up out of the black, as the screenplay says");
assert(project.frames.filter(frame => frame.transition !== "Cut").length >= 6, "the non-cut transitions are chosen, not left to default");
assert.equal(project.notes.find(note => /visual|look|style|palette|cinematograph/i.test(`${note.title} ${(note.tags || []).join(" ")}`)).id, "hangar-note-look", "the prompt's palette line comes from the look note, not a rules note");
pass("every scene and shot carries the house style, a mood, a lighting direction and a chosen transition");

const bad = /\b(alien|robot|ufo|saucer|spaceship)\b/i;
for (const platform of PLATFORMS) {
  for (const frame of project.frames) {
    const prompt = buildFramePrompt(project, frame, platform.id);
    assert(prompt.length > 80, `${platform.id}: shot ${frame.shotNumber} builds a prompt`);
    assert(!bad.test(prompt), `${platform.id}: shot ${frame.shotNumber}'s prompt names the thing in the crate`);
    assert(/gouache/i.test(prompt), `${platform.id}: shot ${frame.shotNumber}'s prompt carries the style`);
  }
}
for (const scene of project.scenes) assert(!bad.test(buildScenePrompt(project, scene, "generic")), `scene ${scene.number}'s prompt names it`);
const image = buildFramePrompt(project, project.frames[17], "midjourney");
assert(/Painted, not photographed/.test(image) && /strobing/.test(image) && /Panic, then nothing/.test(image), "an image prompt carries the look note, the lighting direction and the mood");
const video = buildFramePrompt(project, project.frames[17], "generic");
assert(/handheld/i.test(video) && /strobing/.test(video), "a video prompt carries the camera and the lighting");
const talk = buildFramePrompt(project, project.frames[11], "hailuo");
assert(/Trucker \(S1\) says in a dry manner: <d>\[English\] Thirty years driving/.test(talk), "the cue lines in a shot's notes become spoken lines in a video prompt");
assert(!/Framing \(S\d\) says|Sound \(S\d\) says/.test(talk), "the notes' labels are not mistaken for speakers");
assert(/AM radio low under it/.test(talk), "the sound line becomes the soundscape");
pass(`prompts for ${PLATFORMS.length} platforms × ${project.frames.length} shots carry the style and never name the thing`);

const neonoire = JSON.parse(read("public/projects/neonoire-opening.json"));
assert.notEqual(project.id, neonoire.id);
assert(!project.script.includes("Nobody's Witness") && !JSON.stringify(project).includes("/images/neonoire/"), "nothing leaks across from the other project");
pass("isolated from Nobody's Witness: its images, ids and script are untouched");

// Review fixes (7 October 2026): the descriptions that stop the next pass repeating the first pass's mistakes.
{
  const framesText = number => project.frames[number - 1].notes;
  assert(/LEFT/.test(framesText(12)) && /LEFT/.test(framesText(14)), "the US truck's driver sits on the left");
  assert(/head-on/.test(framesText(18)) && /alone/.test(framesText(18)), "the swerve is head-on and the nurse is alone");
  assert(/No limbs, fur, head or tail/.test(framesText(32)), "the hollow is only a dent, never a body");
  assert(/never a flashlight/.test(framesText(34)) && /never a flashlight/.test(framesText(36)), "the marks are lit by a flare");
  assert(/reversed up to the doors/.test(framesText(4)), "the truck is backed to the hangar door");
  assert(/red band/.test(framesText(28)) && /round chrome/.test(framesText(28)), "the cap and mirror are named exactly");
  assert(project.scenes.slice(2).every(scene => /hardwood/.test(scene.description)), "the outdoor scenes say Ohio hardwoods in leaf");
}

// A saved copy refreshes to the current bundle, but keeps whatever its owner wrote.
{
  const old = JSON.parse(execFileSync("git", ["show", "59631f1:public/projects/hangar-cold-open.json"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 }));
  old.frames[11].notes = `${old.frames[11].notes}\nMY OWN LINE`;
  old.frames[0].title = "My title for shot 1";
  old.frames[3].image = "/images/mine/custom.jpg";
  const patch = hangarUpdates(old);
  assert(patch, "an old saved copy is refreshed");
  assert(patch.frames[11].notes.includes("MY OWN LINE") && patch.frames[0].title === "My title for shot 1" && patch.frames[3].image === "/images/mine/custom.jpg", "the owner's edits survive the refresh");
  assert.equal(patch.frames[5].image, project.frames[5].image, "an untouched card gets its picture");
  assert.equal(patch.frames[17].notes, project.frames[17].notes, "an untouched card gets the fixed notes");
  assert.equal(patch.scenes[2].description, project.scenes[2].description, "an untouched scene gets the fixed description");
  assert.equal(hangarUpdates({ ...old, ...patch }), null, "refreshing twice changes nothing");
  assert.equal(hangarUpdates(project), null, "the current bundle needs no refresh");
}

// Voices and sound (8 October 2026): 17 spoken lines in American voices, the shared sound-effect library on the frames.
{
  const manifest = JSON.parse(read("docs/hangar/voice/manifest.json"));
  const nw = JSON.parse(read("docs/neonoire/voice/voices.json")).characters;
  const library = JSON.parse(read("docs/sfx/library.json"));
  const effects = new Map(library.effects.map(e => [e.id, e]));
  assert.equal(manifest.lines.length, 17, "all 17 spoken lines are recorded");
  assert.deepEqual(Object.keys(manifest.voices), ["RED TWO", "RED LEADER", "TV", "AIRMAN", "TRUCKER", "MOM", "AGENT"], "seven speakers");
  assert.equal(manifest.voices.TRUCKER.voiceId, nw.JACK.voiceId, "the Trucker is NEONOIRE's Jack");
  assert.equal(manifest.voices.MOM.voiceId, nw.VERA.voiceId, "Mom is NEONOIRE's Vera");
  assert.equal(manifest.voices["RED LEADER"].voiceId, nw.DANIEL.voiceId, "Red Leader is NEONOIRE's Daniel");
  for (const [who, v] of Object.entries(manifest.voices)) {
    assert(/^saved|^stock \(characters_animation/.test(v.kind), `${who}: a saved voice or a stock voice of the character type`);
    assert(v.voiceId && v.name && v.why.length > 40, `${who}: voice id, name and the reason for the pick`);
  }
  assert(new Set(manifest.lines.filter(l => l.shot === 29).map(l => l.voiceId)).size === 2, "the roadside scene's two speakers have two voices");
  assert(new Set(manifest.lines.filter(l => l.shot <= 2).map(l => l.voiceId)).size === 2, "the cockpit's two speakers have two voices");
  assert(manifest.lines.every(l => !/quiet|soft|weak|whisper|murmur|hush/i.test(l.direction)), "no hush words in a direction (the NEONOIRE finding: they read as whispers)");
  assert(manifest.lines.filter(l => l.text.split(/\s+/).length <= 3).every(l => !l.direction.includes(",")), "a line of three words or fewer has a one-word direction (a longer one repeats it)");
  assert(manifest.lines.every(l => l.phrases <= l.expected && l.model === "eleven_v4" && l.generation?.id), "no take repeats its words; each records its generation");
  assert.equal([...new Set(manifest.lines.filter(l => l.fx).map(l => l.speaker))].sort().join(), "RED LEADER,RED TWO,TV", "the radio and the television carry an fx name");
  let spoken = 0, effectsOn = 0;
  const ids = new Set();
  for (const frame of project.frames) {
    const audio = frame.audio || [];
    for (const clip of audio) {
      assert(!ids.has(clip.id), `${clip.id} is unique`);
      ids.add(clip.id);
      assert(existsSync(join(root, "public", clip.src)), `${clip.id}: ${clip.src} is on disk`);
      assert(clip.offset >= 0 && clip.offset < frame.duration, `${clip.id}: starts inside shot ${frame.shotNumber}`);
      if (clip.character === "SFX") {
        const effect = [...effects.values()].find(e => e.file === clip.src);
        assert(effect && effect.projects.hangar, `${clip.id}: a library effect tagged for the Hangar`);
        assert(clip.id.startsWith("sfx-") && clip.text === "" && clip.gain >= 0.1 && clip.gain <= 1, `${clip.id}: an sfx- id, no subtitle text, a level under speech`);
        effectsOn++;
      } else {
        assert(clip.gain === undefined && clip.text, `${clip.id}: speech at its own level with its text`);
        assert(clip.offset + clip.duration + 0.6 <= frame.duration + 0.001, `${clip.id}: the last word has 0.6 s of air (frames are lengthened, never shortened)`);
        spoken++;
      }
    }
    const speech = audio.filter(c => c.character !== "SFX");
    for (let i = 1; i < speech.length; i++) assert(speech[i].offset >= speech[i - 1].offset + speech[i - 1].duration, `shot ${frame.shotNumber}: lines do not overlap`);
  }
  assert.equal(spoken, 17, "17 spoken lines on frames");
  assert.equal(project.frames.filter(f => f.audio?.some(c => c.character !== "SFX")).length, 11, "11 frames speak");
  assert(effectsOn >= 40 && project.frames.filter(f => f.audio?.some(c => c.character === "SFX")).length >= 30, "effects on at least 30 frames");
  assert.equal(project.frames[0].audio.filter(c => c.character === "SFX").length, 2, "the cockpit drone covers the 40-second black screen in two plays");
  assert(project.frames[2].audio.length === 1 && project.frames[2].audio[0].offset >= 3, "shot 3 is a long silence, then the gunfire, then nothing");
  pass(`17 lines in 7 American voices (Jack, Vera and Daniel reused; four stock character voices), ${effectsOn} shared effects on the frames`);

  // a saved copy from before the voices takes them on its next read, once; an owner's own audio is kept
  const before = JSON.parse(execFileSync("git", ["show", "f924eb3:public/projects/hangar-cold-open.json"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 }));
  before.frames[8].audio = [{ id: "mine", character: "Me", text: "my line", src: "/audio/mine.mp3", offset: 0.5 }];
  const patch = hangarUpdates(before);
  assert(patch, "a copy from before the voices is refreshed");
  assert.equal(patch.frames[0].audio.length, project.frames[0].audio.length, "an untouched frame gets the voices and effects");
  assert.equal(patch.frames[0].duration, project.frames[0].duration, "and the length the voices need");
  assert.deepEqual(patch.frames[8].audio.map(c => c.id).filter(id => !id.startsWith("sfx-")), ["mine"], "an owner's own audio on a frame is kept");
  assert(patch.frames[8].audio.some(c => c.id.startsWith("sfx-")), "and the frame still gets the effects");
  assert.equal(hangarUpdates({ ...before, ...patch }), null, "refreshing twice changes nothing");
  pass("a saved copy takes the voices and effects on its next read, once, and keeps its owner's audio");
}

console.log("\nAll cold-open checks passed.");
