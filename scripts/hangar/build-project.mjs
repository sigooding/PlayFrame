// Builds public/projects/hangar-cold-open.json from docs/hangar/cold-open.fountain.
//
//   npm run build:hangar              write the bundle
//   node scripts/hangar/build-project.mjs --check   fail if the bundle has drifted
//
// The screenplay is the single source: the Screenplay tab carries it byte for byte, and every
// shot's script quote has to be found in it. The pictures do not exist yet, so every frame's
// image is "" and its status is Needs review; nothing here borrows a picture from another project.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const out = resolve(root, "public/projects/hangar-cold-open.json");
const script = readFileSync(resolve(root, "docs/hangar/cold-open.fountain"), "utf8");
const createdAt = "2026-10-07T00:00:00.000Z";
export const projectId = "74a9cb34-9e80-4a04-a614-000000000070";
const ACT = "hangar-act-cold-open";

const cast = [
  ["red-two", "Red Two", "Pilot (voice)", "1944", "A fighter pilot over Europe, heard and never seen. He sounds amazed, not scared. He does not want to fire.", ["Amazed", "Obedient"], "sand"],
  ["red-leader", "Red Leader", "Flight leader (voice)", "1944", "Gives the order. Assumes a trick from the Germans (\"a Jerry trick\").", ["Clipped", "Certain"], "clay"],
  ["airman", "The Airman", "Young airman", "22", "Sent along in civilian clothes to see the load safely off the base. He is the first to notice the knocks are a rhythm, and the only one who hears the clicks at the end.", ["Observant", "Curious"], "sage"],
  ["sergeant", "The Sergeant", "Old sergeant", "58", "Has watched these crates for decades. Sets his coffee on the lid out of habit, then rests his hand flat on it, the way you would steady a sleeping animal. Did he know it was awake?", ["Quiet", "Habitual"], "sand"],
  ["trucker", "The Trucker", "Civilian driver", "50", "Thirty years on the road. Signs for AGRICULTURAL EQUIPMENT without looking up. The only joke in the open is his.", ["Dry", "Incurious"], "clay"],
  ["mom", "The Nurse (Mom)", "The boy's mother", "34", "Coming off a double shift, window down to stay awake, nodding off at the wheel. Never stops. Never knows what she nearly hit, or what she left behind: her side mirror and her cap.", ["Exhausted", "Kind"], "rose"],
  ["agents", "The Agents", "Two men in suits", "40s", "Arrive in an unmarked sedan. One pockets the nurse's cap and the snapped-off mirror: the thread to the boy's house.", ["Methodical", "Cold"], "clay"],
].map(([id, name, role, age, description, traits, color]) => ({ id: `hangar-${id}`, name, role, age, description, traits, color, createdAt, relations: [] }));
const who = (...ids) => ids.map(id => `hangar-${id}`);

// Each scene's heading is "location — time", the same pair its slugline carries in the screenplay.
const scenes = [
  ["1", "Over Europe, 1944", "INT. COCKPIT, OVER EUROPE", "1944", "Black screen. A pilot on the radio, amazed: something is pacing his wing, copying him. A clicking in his headset: three quick, one slow. The order to fire. Gunfire, then silence. We never see what he shot.", "Cold open", "Low key", ["red-two", "red-leader"]],
  ["2", "Hangar 18", "INT. HANGAR 18, WRIGHT-PATTERSON", "NIGHT, 1975", "A Senate hearing on a guard-booth TV while airmen empty the hangar. One crate sits apart, stenciled INERT; nobody reads it aloud. The sergeant's coffee ring on its lid, his hand laid flat on it. The trucker signs for AGRICULTURAL EQUIPMENT without looking up.", "Standard", "Practical night", ["airman", "sergeant", "trucker"]],
  ["3", "The back road", "EXT./INT. TRUCK, BACK ROAD", "NIGHT", "Past the weigh station and into the Ohio hills, fog in the hollows, warm dash lights. An unmarked sedan trails. A knock from the trailer, then another; the airman taps his knee along: three quick, one slow. Three knocks. The slow one never comes.", "Standard", "Practical night", ["airman", "trucker"]],
  ["4", "The swerve", "EXT. THE BEND, BACK ROAD", "NIGHT", "A station wagon drifts over the center line; both drivers yank the wheel. The mirror snaps off, a nurse's cap flies out of the window, the trailer fishtails, the missing slow knock lands and the rear doors burst open. Skid or something inside? The crate slides over the edge.", "Standard", "Practical night", ["mom", "trucker", "airman"]],
  ["5", "The fall", "EXT. WOODED BANK", "NIGHT", "The crate tumbles down the bank, shedding boards. The camera rides inside: darkness, flashes of light through the cracks, nothing you can make out. It lands by the creek, split open. Silence. Then the crickets.", "Standard", "Low key", []],
  ["6", "Topside", "EXT. THE ROADSIDE, ABOVE THE BANK", "NIGHT", "She didn't stop. Road flares in red fog, the sedan screeching up. An agent picks up the white cap and the snapped-off mirror and pockets both. Down the bank.", "Standard", "Practical night", ["agents", "trucker", "airman"]],
  ["7", "The crate", "EXT. THE CREEK BANK", "NIGHT", "Empty. A small hollow in thirty-year-old straw. Every inch of the inside walls scratched with thousands of tiny marks, each with a stroke through it, the newest bright and fresh-cut. It was counting. The far corner, where a few marks are uncrossed, is left in the dark.", "Standard", "Practical night", ["agents", "airman"]],
  ["8", "Far off in the woods", "EXT. THE WOODS ABOVE THE CREEK", "NIGHT", "Faintly, three quick clicks and one slow, moving away. The agents do not notice; the airman does. The flare sputters out. Black, then the title.", "Standard", "Low key", ["airman", "agents"]],
].map(([number, title, location, time, description, kind, lighting, chars]) => ({
  id: `hangar-s${number}`, number, title, location, time, description, characters: who(...chars), actId: ACT, kind, lighting,
}));
const sceneOf = number => `hangar-s${number}`;

// [scene, title, description, shotType, movement, angle, lens, lighting, seconds, cast, script quote]
const shots = [
  ["1", "Black: the radio", "Black screen. Radio hiss, the drone of an engine, and a pilot who sounds amazed, not scared: \"It's copying me.\"", "Establishing", "Static", "Eye level", "50mm", "Low key", 40, ["red-two", "red-leader"], "BLACK SCREEN. Before any picture, a radio hiss and the drone of an engine."],
  ["1", "Three quick, one slow", "Still black. The clicking in the headset: three quick, one slow. This is the film's signature sound; record it once and use it everywhere.", "Establishing", "Static", "Eye level", "50mm", "Low key", 12, ["red-two"], "In his headset, a strange clicking, in a distinct rhythm: three quick, one slow."],
  ["1", "Gunfire, then silence", "A long pause. Gunfire. Silence. We never see what he shot: hold the black.", "Establishing", "Static", "Eye level", "50mm", "Low key", 14, ["red-two", "red-leader"], "A long pause. Then gunfire. Then silence."],
  ["2", "Wright-Patterson at night", "Fade up on the base: hangar doors open on yellow light, airmen moving crates in the dark, a truck backed to the door. Painted night, wet concrete, one flag.", "Establishing", "Crane down", "High angle", "24mm", "Blue hour", 10, [], "Fade up on Wright-Patterson at night."],
  ["2", "The guard-booth TV", "A small television in the guard booth: a Senate hearing, flickering. A voice: \"what else has been kept from the American people.\" Nobody in the booth looks up.", "Insert", "Static", "Eye level", "50mm", "Practical night", 6, [], "A TV in the guard booth shows a Senate hearing while airmen quietly empty the hangar."],
  ["2", "WRIGHT FIELD 1944 - INERT", "One crate sits apart from the rest, stenciled WRIGHT FIELD 1944 - INERT. Nobody reads it aloud.", "Medium wide", "Static", "Low angle", "35mm", "Practical night", 6, [], "One crate sits apart from the others, stenciled WRIGHT FIELD 1944 - INERT. Nobody reads it aloud."],
  ["2", "The coffee ring", "The sergeant sets his cup on the lid, exactly into a ring worn into the wood. Then he remembers, and picks it back up.", "Insert", "Static", "High angle", "50mm", "Practical night", 6, ["sergeant"], "sets his coffee cup on the lid, right into a ring worn into the wood."],
  ["2", "Hand flat on the lid", "On his way past, the sergeant rests his hand flat on the lid, the way you would steady a sleeping animal.", "Close-up", "Static", "Eye level", "85mm", "Practical night", 5, ["sergeant"], "he rests his hand flat on the lid, the way you would steady a sleeping animal."],
  ["2", "Don't you want to know?", "The airman holds out a clipboard. The trucker signs without looking up. AGRICULTURAL EQUIPMENT on the manifest.", "Two-shot", "Static", "Eye level", "35mm", "Practical night", 8, ["airman", "trucker"], "Don't you want to know what's in it?"],
  ["3", "Past the weigh station", "The truck blows past a sign ordering all trucks into the weigh station, and keeps going.", "Wide", "Tracking", "Eye level", "35mm", "Blue hour", 6, ["trucker"], "The truck blows past a sign ordering all trucks into the weigh station."],
  ["3", "Into the hills", "A twisting two-lane climbing into the Ohio hills. Fog in the hollows, warm dash light against the blue night, an unmarked sedan a quarter mile back.", "Extreme wide", "Crane up", "High angle", "24mm", "Blue hour", 10, [], "It turns onto a twisting two-lane and climbs into the Ohio hills"],
  ["3", "The cab", "Warm dash lights. The trucker grumbles: \"First time anybody paid me to skip a scale.\" The airman in civilian clothes, hands on his knees.", "Two-shot", "Static", "Eye level", "35mm", "Practical night", 9, ["trucker", "airman"], "First time anybody paid me to skip a scale."],
  ["3", "A knock from the trailer", "Then another. They both look back through the rear window at the dark trailer. \"Load's shifting.\"", "Over the shoulder", "Static", "Eye level", "50mm", "Practical night", 6, ["trucker", "airman"], "A knock from the trailer. Then another. They both look back."],
  ["3", "One-two-three... four", "The airman begins to tap his knee along with the knocks, under his breath: three quick, one slow.", "Close-up", "Static", "Eye level", "85mm", "Practical night", 7, ["airman"], "One-two-three... four. One-two-three... four."],
  ["3", "The slow one never arrives", "Three quick knocks. No fourth. He waits, one finger raised, in silence. \"There. Settled.\"", "Extreme close-up", "Static", "Eye level", "85mm", "Practical night", 8, ["airman"], "Three quick knocks. The slow one never arrives."],
  ["4", "Headlights round the bend", "A station wagon comes around the bend, drifting over the center line.", "Wide", "Static", "Eye level", "35mm", "Practical night", 4, ["mom"], "A station wagon comes around the bend, drifting over the center line."],
  ["4", "Two more miles", "The nurse, window down to stay awake, eyes heavy: \"Come on. Two more miles.\"", "Close-up", "Static", "Eye level", "85mm", "Practical night", 5, ["mom"], "Come on. Two more miles."],
  ["4", "Both drivers yank the wheel", "Horn and tires. The wagon scrapes past the truck's cab with inches to spare.", "Wide", "Handheld", "Low angle", "24mm", "Practical night", 4, ["mom", "trucker"], "Both drivers yank the wheel."],
  ["4", "The mirror, the cap", "Her side mirror snaps off. Her nurse's cap flies out of the window and spins down onto the asphalt.", "Insert", "Static", "Low angle", "35mm", "Practical night", 4, ["mom"], "its side mirror snaps off and her nurse's cap flies out of the window."],
  ["4", "The skid", "The trailer fishtails across the road, headlights swinging across the trees.", "Wide", "Tracking", "Eye level", "24mm", "Practical night", 4, ["trucker"], "The trailer fishtails"],
  ["4", "The missing knock", "In the middle of the skid, the slow knock lands, hard. The rear doors burst open. We cannot tell whether the skid threw them or something inside did.", "Medium", "Static", "Low angle", "35mm", "Practical night", 4, [], "the missing slow knock lands, hard."],
  ["4", "Over the edge", "The crate slides out of the trailer and over the edge of the bank.", "Wide", "Static", "Eye level", "24mm", "Practical night", 4, [], "The crate slides out and over the edge."],
  ["5", "Down the bank", "The crate tumbles through the trees, shedding boards, slamming into trunks.", "Wide", "Tracking", "Eye level", "24mm", "Low key", 7, [], "The crate tumbles down the wooded bank, slamming into trees and shedding boards."],
  ["5", "Inside the crate", "The camera rides inside with it: darkness, flashes of light through the cracks, nothing you can make out.", "POV", "Handheld", "Eye level", "14mm", "Low key", 6, [], "The camera rides inside with it: darkness, flashes of light through the cracks, nothing you can make out."],
  ["5", "By the creek", "It lands by the creek, split open. Silence. Then the crickets start up again.", "Wide", "Static", "Eye level", "35mm", "Low key", 10, [], "It lands by the creek, split open."],
  ["6", "Taillights", "The wagon's taillights disappear around the bend. She didn't stop.", "Wide", "Static", "Eye level", "50mm", "Practical night", 5, ["mom"], "The wagon's taillights disappear around the bend. She didn't stop."],
  ["6", "Road flares", "The trucker lights road flares; the sedan screeches up. Red light on fog.", "Medium", "Static", "Eye level", "35mm", "Practical night", 6, ["trucker", "agents"], "The Trucker lights road flares."],
  ["6", "The white cap", "An agent picks up the nurse's cap, white on the black asphalt in the red light, and the snapped-off mirror beside it. He pockets both.", "Close-up", "Static", "High angle", "85mm", "Practical night", 6, ["agents"], "picks up the nurse's cap, white on the black asphalt in the red light, and the snapped-off mirror beside it. He pockets both."],
  ["6", "Where is it?", "\"Where is it?\" The trucker, shaking, points down the bank: \"Some lady in a wagon, she just came right at me.\"", "Two-shot", "Static", "Eye level", "50mm", "Practical night", 8, ["agents", "trucker"], "Down there. Some lady in a wagon, she just came right at me."],
  ["6", "Down through red fog", "Two agents and the airman start down the bank through fog lit red by the flares. Flares, not flashlight beams: this is the film's own light.", "Wide", "Crane down", "High angle", "24mm", "Practical night", 8, ["agents", "airman"], "Then the two agents and the Airman start down the bank through red fog."],
  ["7", "Empty", "The crate, split open on the creek bank. It is empty.", "Medium wide", "Static", "Eye level", "35mm", "Practical night", 6, ["agents"], "The crate is empty."],
  ["7", "The hollow in the straw", "A small hollow pressed into thirty-year-old packing straw, where something lay curled up.", "Close-up", "Static", "High angle", "50mm", "Practical night", 6, [], "A small hollow is pressed into thirty-year-old packing straw, where something lay curled up."],
  ["7", "INERT in the creek", "A broken board stenciled INERT lies half-sunk in the water.", "Insert", "Static", "High angle", "50mm", "Practical night", 4, [], "A broken board stenciled INERT lies half-sunk in the creek."],
  ["7", "Rows of marks", "An agent holds his flare low to the inside wall. The red light rakes across rows of tiny scratched marks, thousands of them, covering every inch.", "Extreme close-up", "Tracking", "Eye level", "85mm", "Practical night", 9, ["agents"], "the light rakes across rows of tiny scratched marks, thousands of them, covering every inch."],
  ["7", "The newest stroke", "Each mark has a short stroke cut through it. The newest is bright, fresh-cut wood. It was counting.", "Extreme close-up", "Static", "Eye level", "85mm", "Practical night", 7, [], "The newest stroke is bright, fresh-cut wood."],
  ["7", "The far corner", "The flare does not reach the far corner, where a few marks are still uncrossed. Nobody looks there. Hold on the dark long enough that the audience does.", "Close-up", "Static", "Eye level", "50mm", "Low key", 8, [], "The flare does not reach the far corner, where a few marks are still uncrossed."],
  ["8", "Far off", "Faintly, three quick clicks and one slow, moving away through the trees.", "Wide", "Static", "Eye level", "35mm", "Low key", 7, [], "Far off in the woods, faintly: three quick clicks and one slow, moving away."],
  ["8", "Only the airman hears", "The agents don't notice. The airman does, his lips moving: \"One-two-three... four.\"", "Close-up", "Static", "Eye level", "85mm", "Practical night", 7, ["airman"], "The agents don't notice. The Airman does."],
  ["8", "The flare sputters out", "The flare dies. Cut to black, then the title.", "Extreme close-up", "Static", "Eye level", "85mm", "Low key", 6, [], "The flare sputters out."],
].map(([scene, title, description, shotType, movement, angle, lens, lighting, duration, chars, quote], i) => {
  assert(script.includes(quote), `shot ${i + 1} (${title}): script quote not found: ${quote}`);
  return {
    id: `hangar-shot-${String(i + 1).padStart(2, "0")}`, shotNumber: i + 1, sceneId: sceneOf(scene), title, description,
    image: "", shotType, movement, angle, lens, lighting, duration, durationIsEstimate: true, status: "Needs review",
    transition: i === 0 ? "Fade in" : "Cut", characters: who(...chars),
    notes: `Script: "${quote}"\n\nNo picture yet: this card holds the shot's slot. The look is painted, hand-drawn animation: warm light against blue night, fog, weight in the characters. Nothing is ever named.`,
  };
});

const notes = [
  ["start-here", "Start here: what this is", "Working title only. This is the cold open of an animated 1970s feature about a boy, a small machine nobody can name, and the people hunting for it. It runs about six minutes: a pilot's voice in 1944, a hangar emptied in 1975, a truck on a back road, a near-miss, a crate that falls, and a crate that is empty. The Screenplay tab holds the pages; the Storyboard has " + shots.length + " shots with no pictures yet. Acts one to three come next.", ["Read first"]],
  ["seeds", "Seeds the cold open plants", "1. The nurse's cap and the snapped-off mirror lead the agents and the detective to the boy's house by different routes.\n2. The rhythm (three quick, one slow) ties the airman, the pilot and the machine together before any character notices.\n3. The uncrossed marks in the dark corner are the act-two flip: it was not counting days served, it was counting days left. Decide the exact number now; it sets the length of the film's clock.\n4. The coffee ring leaves an open question: did the sergeant know it was awake?\n5. The airman is the only one who hears the clicks at the end: he is the government's way in to the boy, and the audience's.", ["Plot", "Setups"]],
  ["rules", "Rules for the look and the sound", "Nobody says alien, robot or UFO. Flares, not flashlight beams, outdoors. One recording of the three-quick-one-slow rhythm, used in 1944, in the trailer and in the woods. Never show what the pilot shot; never show what is in the crate. The 1975 setting is deliberate: Church Committee, post-Watergate paranoia, Blue Book already closed.", ["Rules"]],
  ["open", "Open questions", "Title. Why does it move now, after thirty years? How many uncrossed marks (the film's clock)? Is the sergeant the old pilot? Does the airman cross sides? What is the exact count of marks the agents see? The robot's origin stays unexplained: a 1944 shoot-down, bodies and one small machine sent to Wright-Patterson.", ["Questions"]],
].map(([id, title, content, tags], i) => ({ id: `hangar-note-${id}`, title, color: ["sage", "sand", "rose", "sage"][i], createdAt, tags, connections: [], content }));

const brainstorm = [
  ["The boy", "11. His mum works double shifts; he is alone at night and rides his bike in the woods. Both of them are waiting for someone who is not coming back. His dad left."],
  ["The machine", "Rounded, worn, nothing like a lab. It does not say what it is. It copies sounds. The clicking is its first word."],
  ["The detective", "An ex-debunker from Project Blue Book (Wright-Patterson was its headquarters). Spent a career explaining things away; now has to listen to the people he used to dismiss."],
  ["The battery", "It has been running on almost nothing for thirty years, playing dead. Being awake with the boy spends what it saved. The marks are the clock."],
  ["The government", "Do not know what they have. The scarier for it. They are about to make the same mistake as 1944: shoot first."],
].map(([title, content], i) => ({ id: `hangar-brain-${i + 1}`, x: 60 + (i % 3) * 300, y: 40 + Math.floor(i / 3) * 220, title, content, color: ["sage", "sand", "rose", "clay", "sage"][i], tags: ["Concept"], connections: i ? [`hangar-brain-${i}`] : [], createdAt }));

const project = {
  id: projectId,
  title: "Untitled (working title): the cold open",
  description: "The cold open of an animated 1975 feature: a pilot who sounds amazed, a crate marked INERT, a truck, a near-miss, and a crate that is empty. About six minutes, " + scenes.length + " scenes, " + shots.length + " shots, almost no dialogue. No pictures yet.",
  genre: "Animated feature · mystery",
  format: "Feature",
  status: "In development",
  coverImage: "",
  acts: [{ id: ACT, title: "Cold open: 1944 to the creek", description: "A pilot, a hangar, a truck, a swerve, a fall and an empty crate. Nobody says what it is." }],
  scenes, frames: shots, characters: cast, notes, brainstorm, moodboards: [], script,
  shareId: null, createdAt, updatedAt: createdAt,
};

assert(scenes.every(s => script.toUpperCase().includes(`${s.location} - ${s.time}`.toUpperCase())), "every scene's heading appears as a slugline in the screenplay");
assert.equal(script.match(/ #\d+#/g).length, scenes.length, "one #n# marker per scene");
const json = JSON.stringify(project, null, 2) + "\n";
if (process.argv.includes("--check")) {
  assert.equal(readFileSync(out, "utf8"), json, "public/projects/hangar-cold-open.json has drifted: run npm run build:hangar");
  console.log(`Hangar bundle is current (${scenes.length} scenes, ${shots.length} shots).`);
} else {
  writeFileSync(out, json);
  console.log(`Wrote ${out}: ${scenes.length} scenes, ${shots.length} shots, ${cast.length} characters.`);
}
