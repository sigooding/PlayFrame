// Builds public/projects/hangar-cold-open.json from docs/hangar/cold-open.fountain.
//
//   npm run build:hangar              write the bundle
//   node scripts/hangar/build-project.mjs --check   fail if the bundle has drifted
//
// The screenplay is the single source: the Screenplay tab carries it byte for byte, and every
// shot's script quote has to be found in it. The pictures are read from scripts/hangar/frame-registry.mjs:
// a shot with a delivered picture carries its path and the status Ready, a shot still waiting carries
// image "" and the status Needs review. Nothing here borrows a picture from another project.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CAST, FRAMES } from "./frame-registry.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const out = resolve(root, "public/projects/hangar-cold-open.json");
const script = readFileSync(resolve(root, "docs/hangar/cold-open.fountain"), "utf8");
const createdAt = "2026-10-07T00:00:00.000Z";
export const projectId = "74a9cb34-9e80-4a04-a614-000000000070";
const ACT = "hangar-act-cold-open";
// The house style (src/lib/styles.ts): painted gouache Ohio, hand-drawn characters with weight.
const STYLE = "hangar";

const cast = [
  ["red-two", "Red Two", "Pilot (voice)", "1944", "A fighter pilot over Europe, heard and never seen. He sounds amazed, not scared. He does not want to fire.", ["Amazed", "Obedient"], "sand"],
  ["red-leader", "Red Leader", "Flight leader (voice)", "1944", "Gives the order. Assumes a trick from the Germans (\"a Jerry trick\").", ["Clipped", "Certain"], "clay"],
  ["airman", "Airman", "Young airman", "22", "Sent along in civilian clothes to see the load safely off the base. He is the first to notice the knocks are a rhythm, and the only one who hears the clicks at the end.", ["Observant", "Curious"], "sage"],
  ["sergeant", "Sergeant", "Old sergeant", "58", "Has watched these crates for decades. Sets his coffee on the lid out of habit, then rests his hand flat on it, the way you would steady a sleeping animal. Did he know it was awake?", ["Quiet", "Habitual"], "sand"],
  ["trucker", "Trucker", "Civilian driver", "50", "Thirty years on the road. Signs for AGRICULTURAL EQUIPMENT without looking up. The only joke in the open is his.", ["Dry", "Incurious"], "clay"],
  ["mom", "Mom", "The nurse, the boy's mother", "34", "Coming off a double shift, window down to stay awake, nodding off at the wheel. Never stops. Never knows what she nearly hit, or what she left behind: her side mirror and her cap.", ["Exhausted", "Kind"], "rose"],
  ["agent", "Agent", "Two men in suits", "40s", "Arrive in an unmarked sedan. One pockets the nurse's cap and the snapped-off mirror: the thread to the boy's house.", ["Methodical", "Cold"], "clay"],
].map(([id, name, role, age, description, traits, color]) => ({ id: `hangar-${id}`, name, role, age, description, traits, color, image: CAST[id]?.image, createdAt, relations: [] }));
const who = (...ids) => ids.map(id => `hangar-${id}`);

const sceneLight = {
  "1": "No picture. Pure black while a radio talks; nothing is lit and nothing fades up.",
  "2": "Sodium-yellow work lamps under the hangar roof, wet concrete, the guard booth's blue television glow, one bare lamp over the lone crate; cold blue night at the open doors.",
  "3": "Warm amber dashboard glow on faces, a green radio dial, deep blue night through the windshield; headlight cones lifting fog in the hollows; the sedan's headlights tiny and white far behind.",
  "4": "Only the two vehicles' headlights sweeping the trunks, brake-light red flashes, dust and fog; no other light.",
  "5": "Almost none: moonlight in slats between the trunks, flashes of pale sky through the crate's cracks; black tree verticals.",
  "6": "Red road flares are the only key light: hard crimson, sparks, red-lit fog; the sedan's white headlights as backlight; no flashlight beams.",
  "7": "A hand-held flare, crimson, raking across scratched wood; the creek reflecting red; the far corner left in darkness.",
  "8": "The last dying orange of a flare against a moonlit tree line, then total black.",
};

// Each scene's heading is "location — time", the same pair its slugline carries in the screenplay.
const scenes = [
  ["1", "Over Europe, 1944", "INT. COCKPIT, OVER EUROPE", "1944", "The cockpit of a fighter over Europe, 1944, heard and never seen: engine drone, radio hiss and two voices. The screen stays black.", "Cold open", "Low key", ["red-two", "red-leader"]],
  ["2", "Hangar 18", "INT. HANGAR 18, WRIGHT-PATTERSON", "NIGHT, 1975", "Hangar 18 at Wright-Patterson Air Force Base, night, 1975: airmen quietly emptying the hangar under sodium lamps while a Senate hearing murmurs from a guard-booth television. One crate sits apart from the rest.", "Standard", "Practical night", ["airman", "sergeant", "trucker"]],
  ["3", "The back road", "EXT./INT. TRUCK, BACK ROAD", "NIGHT", "A truck and trailer on a twisting two-lane in the Ohio hills, around 1 a.m.: fog in the hollows, warm dashboard light against the blue night, an unmarked sedan a quarter mile behind. A civilian trucker and a young airman in civilian clothes sit in the cab.", "Standard", "Practical night", ["airman", "trucker"]],
  ["4", "The swerve", "EXT. THE BEND, BACK ROAD", "NIGHT", "A blind bend on the back road at night: the truck and trailer meeting a station wagon driven by a nurse coming off a double shift. Headlights, fog, a gravel shoulder and a drop to one side.", "Standard", "Practical night", ["mom", "trucker", "airman"]],
  ["5", "The fall", "EXT. WOODED BANK", "NIGHT", "A wooded bank above a creek, night: moonlit trunks and ferns, a loaded crate on its way down, and the dark inside the crate.", "Standard", "Low key", []],
  ["6", "Topside", "EXT. THE ROADSIDE, ABOVE THE BANK", "NIGHT", "The back road above the bank, night, just after the bend: road flares, red-lit fog, an unmarked sedan with two men in suits, a trucker and an airman. A white nurse's cap and a snapped-off side mirror lie on the asphalt.", "Standard", "Practical night", ["agent", "trucker", "airman"]],
  ["7", "The crate", "EXT. THE CREEK BANK", "NIGHT", "The creek bank, night: a split-open crate in the shallows, a hollow in old packing straw, a board stenciled INERT, and flares held low.", "Standard", "Practical night", ["agent", "airman"]],
  ["8", "Far off in the woods", "EXT. THE WOODS ABOVE THE CREEK", "NIGHT", "The woods above the creek, night, moments later: the flare burning down, three men standing in silence, and the dark beyond the trees.", "Standard", "Low key", ["airman", "agent"]],
].map(([number, title, location, time, description, kind, lighting, chars]) => ({
  id: `hangar-s${number}`, number, title, location, time, description, characters: who(...chars), actId: ACT, kind, lighting,
  lightingNotes: sceneLight[number], style: STYLE,
}));
const sceneOf = number => `hangar-s${number}`;

// Per shot, in order: [mood, lightingNotes, framing and animation direction, sound, transition].
// The mood and lighting notes are written to be read by an image or video model; framing and sound are for the board.
const details = [
  // 1944
  ["Hushed and amazed, not afraid: a young man talking to himself over an engine.", "No light at all. A pure black frame; nothing fades up and nothing is hinted at.", "Hold black for the whole radio exchange. No title, no credit, no music.", "Engine drone, radio hiss, wind. Red Two close and breathy; Red Leader tinny and far. The clicks do not arrive until the next shot.", "Cut"],
  ["Wonder tipping into unease.", "Still pure black.", "Still black. The first thing we ever see is nothing.", "The clicks arrive in his headset: three quick, one slow, close and dry, like a relay or a tongue on teeth. This exact recording is reused in the trailer and in the woods. Filter it slightly, as if heard through a headset.", "Cut"],
  ["Dread: an order obeyed too late to be undone.", "Still pure black.", "Hold black through the exchange, the pause and the gunfire. Do not cut to a picture of what he shot, ever.", "Two short bursts, then true silence: drop the engine and the hiss out entirely for a full beat. The silence is the cut.", "Cut"],
  // Hangar
  ["Hushed bustle: a secret being cleaned up quietly, in the dark.", "Sodium-yellow work lamps strung under the hangar roof, wet concrete reflecting them, a cold blue night sky above the open doors, one lit window in the guard booth. No moon.", "Open high over the apron and crane down to the hangar doors: soldiers small against enormous doors, a flag hanging limp, crates moving out in a slow line.", "Idle generators, boots, a forklift's reversing beeper, insects. No score.", "Fade in"],
  ["Official voices explaining nothing.", "The television's blue-white flicker is the only light inside the booth; the rest of the room is dim and warm brown.", "Locked-off insert on a small curved-glass TV with rabbit ears: a committee table, a gavel. Nobody in the booth looks up.", "Muffled hearing audio from the booth's television, a gavel; the emptied hangar beyond.", "Cut"],
  ["Ordinary and ominous: a label that has done its job for thirty years.", "One bare lamp directly over the crate: hard top light, deep shadow beneath it, the rest of the floor already empty and dark.", "Low angle from the floor so the crate looms. The stencil is weathered and legible. The coffee ring in the lid is visible but not yet explained. No push-in; nobody reads it aloud.", "The echo of an emptied hangar. The crate is silent.", "Cut"],
  ["Habit, and a tenderness he would deny.", "Warm lamp light on the lid; steam from the cup backlit; the ring in the wood darker than the grain.", "Top-down insert: the cup sits exactly in the ring worn into the lid. He lifts it away as the shot ends.", "Ceramic on wood, a small tick.", "Cut"],
  ["Quiet reverence: the way you steady a sleeping animal.", "Soft warm bounce from the work lamp on the weathered back of his hand; the lid itself cool and blue.", "Hold on the hand and the lid. He does not look at the crate. Nothing answers.", "A held breath. The hangar's emptiness. No knock yet: the crate stays silent here.", "Cut"],
  ["Young curiosity against old incuriosity.", "Sodium lamp rim light on both men; the clipboard in a warm pool; the truck's red tail-lights behind them.", "Two-shot at shoulder height. The trucker never looks up from signing; the airman's eyes go past him to the crate.", "A pen scratching the clipboard; the truck idling.", "Cut"],
  // Back road
  ["Defiance in motion: the paperwork skipped.", "Headlights and the weigh station's amber floodlights sliding over the truck; deep blue night; the sign lit from below.", "Wide tracking alongside as the truck passes the sign ordering all trucks into the weigh station, and keeps going.", "Diesel, tyre hum, air brakes unused.", "Cut"],
  ["Wonder and isolation: a big dark country and one small warm light.", "Deep blue twilight sky, fog in the hollows glowing faintly, the truck's headlights and, far behind, the sedan's, as two pinpricks.", "Crane up from the road to reveal the sweep of the hills in layered painted ridgelines of blue (Ghibli depth). The trailer is a small lit box on a very large night.", "Crickets under the engine; wind swelling.", "Dissolve"],
  ["Warm, tired and wry.", "Amber dashboard glow on both faces, a green radio dial, cool blue night through the windshield, the fog beyond.", "Medium two-shot from the dash. The airman's clothes are civilian and too neat; the trucker wears a cap; the wheel is large in frame.", "AM radio low under it (an old ballad), gearbox, tyres.", "Cut"],
  ["Something small and wrong.", "Dash glow on the backs of their heads; the red of the rear-view mirror; the black trailer visible through the sliding rear window.", "Over the shoulder, looking back through the rear window at the dark trailer. The knock is heard before anyone looks.", "Knock. Knock: dull, wooden, inside the trailer.", "J-cut"],
  ["Discovery: the first person to listen.", "Dash glow on his face and hand; the knee in the foreground in warm light.", "Close on his hand tapping his knee. The taps lock to the knocks coming off-screen.", "Knocks and taps in unison: three quick, one slow.", "Cut"],
  ["Held breath.", "Faces nearly in silhouette against headlight glare; the dash glow dims.", "Extreme close-up of his raised finger, then his eyes. Hold longer than is comfortable.", "Three quick knocks. Silence where the fourth should be: take the engine down for half a second.", "Cut"],
  // Swerve
  ["Sudden, sleepy menace.", "Wagon headlights sweep across the trunks and flare into the lens; the road goes white; fog.", "Locked wide at the bend. The wagon drifts over the center line a beat too long.", "Gravel under a tyre; a ballad on the wagon's radio, faint.", "Smash cut"],
  ["Exhaustion, kindness, hanging on.", "Dash glow on her face and white cap; cold night air from the open window; oncoming headlights cross her eyes at the end of the shot.", "Close on her eyes. A slow blink; the lids drop. A hospital ID clipped to her coat, blurred but readable as a badge (the evidence seed).", "Night air through the open window, her own breath, the wagon's radio ballad.", "Cut"],
  ["Panic, then nothing.", "Headlights strobing across the windscreens; brake-lights flaring red.", "Handheld, low. The wagon's flank slides past the truck's cab by a hand's width. Draw the motion with smears, not blur; keep the weight of both vehicles.", "Horn, tyre shriek, gravel.", "Cut"],
  ["Small things that will matter.", "Red tail-light wash on the road; the cap lit white by a headlight sweep; the mirror's glass catches it.", "Insert, low: the mirror snaps off and skitters; the cap spins down onto the asphalt. Keep both clearly in frame so the audience remembers them.", "Snap of metal, a glass skitter, the cap's soft slap.", "Cut"],
  ["The weight of a truck losing the road.", "Headlights swinging across tree trunks in long ribbons; dust; brake-lights.", "Tracking wide beside the trailer as it fishtails; follow the rear doors.", "Tyre howl, chains rattling.", "Cut"],
  ["The audience cannot tell.", "The rear doors lit only by the truck's tail-lights; the interior behind them pure black.", "Medium at the trailer's rear doors. The slow knock lands from inside at the same instant the skid peaks; the latch lets go. Never show the inside. Neither a push nor a bump: it must read both ways.", "The missing fourth knock, huge and near; the metal bang of the doors bursting.", "Cut"],
  ["Gravity wins.", "Tail-lights follow the crate to the lip of the bank, then black.", "Locked wide. The crate slides; one beat of nothing; it tips and is gone.", "Wood scraping on metal, then the first crack of impact far below.", "Cut"],
  // The fall
  ["Violent, then lonely.", "Moonlight in slats between the trunks; no key light; boards flash pale blue as they fly off.", "Wide tracking down with the crate. The trees are hard dark verticals; boards peel away.", "Impacts: each tree a different thud, then splintering. No clicks.", "Cut"],
  ["Disorientation: being carried.", "Black, with stuttering slivers of moonlight through the cracks; no fill.", "POV from inside, handheld, thrown with the crate. Nothing recognizable. Never reveal what is in there.", "Muffled thumps; a rattle like breath. No click.", "Cut"],
  ["Silence, then life returning.", "Pale blue moonlight on the split boards; a glint on the creek; straw spilling out.", "Wide, locked off. Hold for five full seconds before the crickets begin.", "Silence, then crickets fading up, then the creek.", "Cut"],
  // Topside
  ["Guilt she will never feel.", "Two red taillights shrinking round the bend; blue-black trees.", "Locked wide. The wagon does not brake. The road empties.", "Her engine fading, the ballad on her radio carrying on a moment longer.", "Cut"],
  ["Red alarm.", "Road flares as the only key: hard crimson with sparks, fog lit red; the sedan's headlights as white backlight; no flashlight beams.", "Medium on the trucker's shaking hand and the flare; the sedan skids in behind him.", "Flare hiss and crackle, tyres on gravel.", "Cut"],
  ["Evidence, quietly taken.", "Red flare light on black asphalt; the cap glaringly white.", "Close, high angle. A gloved hand lifts the cap and the mirror; the pocket closes over them. Hold on the empty asphalt after.", "Gravel, the flare, a pocket button.", "Cut"],
  ["Authority meeting fear.", "Red from below; the agent's face never fully lit; the sedan's lights behind.", "Two-shot. The trucker points down the bank; the agent looks at the cap in his hand.", "Flare hiss, gravel underfoot, the sedan's engine ticking as it cools.", "Cut"],
  ["A descent into the unknown.", "Fog turned red by the flares they carry; blue-black trees; the moon lost behind cloud.", "Crane down from the road, following three figures down the bank; the flares are moving red stars.", "Boots on leaves, flare hiss, the creek growing louder.", "Cut"],
  // The crate
  ["An anticlimax that is worse than a monster.", "Flare light spills red over the split crate; the creek glints behind it.", "Medium wide. The three arrive; the lid lies in pieces; a long beat of nothing.", "The creek; one crackling flare.", "Dissolve"],
  ["Tender: something small was here.", "A flare held close throws warm red into the hollow; the straw looks like hair.", "Close, high angle into the hollow: a curled shape pressed into straw. Imply no form beyond the hollow itself.", "Straw rustling; a flare's hiss.", "Cut"],
  ["The word, proven wrong.", "The flare reflected in the creek; the stencil half under the water.", "Insert on the board bobbing in the creek: INERT. No push-in.", "Running water.", "Cut"],
  ["Dread by accumulation.", "A flare held low so red light rakes sideways across the scratches, each groove with its own black shadow; everything else falls to black.", "Extreme close tracking along the wall; the marks fill the frame edge to edge. Let the sheer number sink in: thousands.", "A flare crackle; an agent's breath. No score.", "Cut"],
  ["It was counting.", "Raking red; the newest cut is the only pale, bright wood in the frame.", "Static extreme close-up. Make the last stroke visibly new against the old marks and let the audience do the sum.", "Silence; hold.", "Cut"],
  ["The thing nobody looks at.", "The flare does not reach: a few uncrossed marks sit in near-black, barely readable.", "Locked close on the dark corner. Slowly the eye finds the few uncrossed marks. No one in frame looks here.", "The creek and the flare; nothing else.", "Cut"],
  // Far off
  ["Faint, and moving away.", "A moonlit tree line; a cold blue glow in the sky; nothing visible among the trunks.", "Wide of the woods from the crate site. The sound crosses left to right and recedes; nothing is seen.", "Three quick clicks, one slow, receding: the same recording as 1944, now with woods around it.", "J-cut"],
  ["Quiet recognition.", "Flare red on his face; the agents in shadow behind him.", "Close on the airman. His head turns a fraction toward the sound; his lips move: \"One-two-three... four.\"", "A whisper; the clicks fading beneath it.", "Cut"],
  ["Dark, then a title.", "The last orange sputter of the flare, then total black.", "Extreme close-up of the flare's end as it gutters; cut to black; hold; the title card fades up on black.", "Hiss, then silence. Option: one last click as the title lands.", "Fade out"],
];

// Dialogue in the app's "NAME: (delivery) words" cue convention, which the video prompts read.
const cues = {
  1: ["RED TWO: (hushed) Red Leader, I've got something on my right wing.", "RED LEADER: (clipped) Say again, Red Two.", "RED TWO: (hushed) No markings. It's glowing. I bank, it banks. It's copying me."],
  2: ["RED LEADER: (clipped) Could be a Jerry trick. Take it down.", "RED TWO: (hushed) It's not doing anything. It's just flying with me.", "RED LEADER: (clipped) That's an order."],
  5: ["TV: (muffled) ...the question before this committee is what else has been kept from the American people."],
  9: ["AIRMAN: Don't you want to know what's in it?", "TRUCKER: (flat) Nope."],
  12: ["TRUCKER: (dry) Thirty years driving. First time anybody paid me to skip a scale."],
  13: ["TRUCKER: (flat) Load's shifting."],
  14: ["AIRMAN: (murmured) One-two-three... four. One-two-three... four."],
  15: ["TRUCKER: (flat) There. Settled."],
  17: ["MOM: (drowsy) Come on. Two more miles."],
  29: ["AGENT: Where is it?", "TRUCKER: (shaking) Down there. Some lady in a wagon, she just came right at me."],
  38: ["AIRMAN: (barely audible) One-two-three... four."],
};

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
  ["6", "Road flares", "The trucker lights road flares; the sedan screeches up. Red light on fog.", "Medium", "Static", "Eye level", "35mm", "Practical night", 6, ["trucker", "agent"], "The Trucker lights road flares."],
  ["6", "The white cap", "An agent picks up the nurse's cap, white on the black asphalt in the red light, and the snapped-off mirror beside it. He pockets both.", "Close-up", "Static", "High angle", "85mm", "Practical night", 6, ["agent"], "picks up the nurse's cap, white on the black asphalt in the red light, and the snapped-off mirror beside it. He pockets both."],
  ["6", "Where is it?", "\"Where is it?\" The trucker, shaking, points down the bank: \"Some lady in a wagon, she just came right at me.\"", "Two-shot", "Static", "Eye level", "50mm", "Practical night", 8, ["agent", "trucker"], "Down there. Some lady in a wagon, she just came right at me."],
  ["6", "Down through red fog", "Two agents and the airman start down the bank through fog lit red by the flares. Flares, not flashlight beams: this is the film's own light.", "Wide", "Crane down", "High angle", "24mm", "Practical night", 8, ["agent", "airman"], "Then the two agents and the Airman start down the bank through red fog."],
  ["7", "Empty", "The crate, split open on the creek bank. It is empty.", "Medium wide", "Static", "Eye level", "35mm", "Practical night", 6, ["agent"], "The crate is empty."],
  ["7", "The hollow in the straw", "A small hollow pressed into thirty-year-old packing straw, where something lay curled up.", "Close-up", "Static", "High angle", "50mm", "Practical night", 6, [], "A small hollow is pressed into thirty-year-old packing straw, where something lay curled up."],
  ["7", "INERT in the creek", "A broken board stenciled INERT lies half-sunk in the water.", "Insert", "Static", "High angle", "50mm", "Practical night", 4, [], "A broken board stenciled INERT lies half-sunk in the creek."],
  ["7", "Rows of marks", "An agent holds his flare low to the inside wall. The red light rakes across rows of tiny scratched marks, thousands of them, covering every inch.", "Extreme close-up", "Tracking", "Eye level", "85mm", "Practical night", 9, ["agent"], "the light rakes across rows of tiny scratched marks, thousands of them, covering every inch."],
  ["7", "The newest stroke", "Each mark has a short stroke cut through it. The newest is bright, fresh-cut wood. It was counting.", "Extreme close-up", "Static", "Eye level", "85mm", "Practical night", 7, [], "The newest stroke is bright, fresh-cut wood."],
  ["7", "The far corner", "The flare does not reach the far corner, where a few marks are still uncrossed. Nobody looks there. Hold on the dark long enough that the audience does.", "Close-up", "Static", "Eye level", "50mm", "Low key", 8, [], "The flare does not reach the far corner, where a few marks are still uncrossed."],
  ["8", "Far off", "Faintly, three quick clicks and one slow, moving away through the trees.", "Wide", "Static", "Eye level", "35mm", "Low key", 7, [], "Far off in the woods, faintly: three quick clicks and one slow, moving away."],
  ["8", "Only the airman hears", "The agents don't notice. The airman does, his lips moving: \"One-two-three... four.\"", "Close-up", "Static", "Eye level", "85mm", "Practical night", 7, ["airman"], "The agents don't notice. The Airman does."],
  ["8", "The flare sputters out", "The flare dies. Cut to black, then the title.", "Extreme close-up", "Static", "Eye level", "85mm", "Low key", 6, [], "The flare sputters out."],
].map(([scene, title, description, shotType, movement, angle, lens, lighting, duration, chars, quote], i) => {
  assert(script.includes(quote), `shot ${i + 1} (${title}): script quote not found: ${quote}`);
  const [mood, lightingNotes, framing, sound, transition] = details[i];
  const delivered = FRAMES[i + 1];
  return {
    id: `hangar-shot-${String(i + 1).padStart(2, "0")}`, shotNumber: i + 1, sceneId: sceneOf(scene), title, description,
    image: delivered?.image ?? "", shotType, movement, angle, lens, lighting, lightingNotes, style: STYLE, mood, duration, durationIsEstimate: true,
    status: delivered ? "Ready" : "Needs review", transition, characters: who(...chars),
    // Order matters to the video prompts: the first line that mentions sound becomes the soundscape, and
    // lines of the form NAME: words are read as dialogue, so the labels here are mixed case on purpose.
    notes: [
      `Sound: ${sound}`,
      `Framing: ${framing}`,
      ...(cues[i + 1] || []),
      `Script: "${quote}"`,
      "",
      delivered
        ? "Style: Painted Americana '75 (hand-drawn characters with weight over gouache backgrounds, dashboard amber against blue night). The picture is delivered. The thing in the crate is never named, shown or described."
        : "Style: Painted Americana '75 (hand-drawn characters with weight over gouache backgrounds, dashboard amber against blue night). No picture yet: this card holds the shot's slot. The thing in the crate is never named, shown or described.",
      // The picture's own honest word, straight from the registry, so it travels with the card.
      ...(delivered?.note ? [delivered.note] : []),
    ].join("\n"),
  };
});
assert.equal(details.length, shots.length, "one set of details per shot");
const delivered = Object.keys(FRAMES).map(Number).sort((a, b) => a - b);
assert(delivered.every(n => Number.isSafeInteger(n) && n >= 1 && n <= shots.length), "a delivered picture belongs to a shot that exists");

const notes = [
  ["start-here", "Start here: what this is", "Working title only. This is the cold open of an animated 1970s feature about a boy, a small machine nobody can name, and the people hunting for it. It runs about six minutes: a pilot's voice in 1944, a hangar emptied in 1975, a truck on a back road, a near-miss, a crate that falls, and a crate that is empty. The Screenplay tab holds the pages; the Storyboard has " + shots.length + " shots, " + delivered.length + " of them with their picture so far. Acts one to three come next.", ["Read first"]],
  ["look", "The look: Painted Americana '75", "Painted, not photographed: warm dashboard amber against deep blue night, gouache fog in the hollows, soft hand-painted skies. Characters are drawn plainly and with weight, with strong silhouettes and believable acting, in the manner of 1950s to 1970s American animation (wood paneling, station wagons, diner chrome, AM radios).\n\nThe Iron Giant for the people, Studio Ghibli for the places. People and vehicles have real mass: no squash and stretch, no cartoon takes; motion is drawn with smears, not blur. Backgrounds are layered multiplane paintings with atmosphere in every layer: fog, cloud, wet leaves, weathered paint. Light always comes from something in the world: dashboard amber, hangar sodium, road-flare crimson, moon blue. Gentle film grain, soft halation on lamps, 16:9 full-bleed. The camera is patient and leaves room for silence. It is the house style 'Painted Americana '75' in every shot's style picker, and every scene and shot in this workspace already carries it.", ["Look", "Style"]],
  ["seeds", "Seeds the cold open plants", "1. The nurse's cap and the snapped-off mirror lead the agents and the detective to the boy's house by different routes.\n2. The rhythm (three quick, one slow) ties the airman, the pilot and the machine together before any character notices.\n3. The uncrossed marks in the dark corner are the act-two flip: it was not counting days served, it was counting days left. Decide the exact number now; it sets the length of the film's clock.\n4. The coffee ring leaves an open question: did the sergeant know it was awake?\n5. The airman is the only one who hears the clicks at the end: he is the government's way in to the boy, and the audience's.", ["Plot", "Setups"]],
  ["rules", "Rules and sound", "Nobody says alien, robot or UFO. Flares, not flashlight beams, outdoors. One recording of the three-quick-one-slow rhythm, used in 1944, in the trailer and in the woods. Never show what the pilot shot; never show what is in the crate. The 1975 setting is deliberate: Church Committee, post-Watergate paranoia, Blue Book already closed.", ["Rules", "Sound"]],
  ["open", "Open questions", "Title. Why does it move now, after thirty years? How many uncrossed marks (the film's clock)? Is the sergeant the old pilot? Does the airman cross sides? What is the exact count of marks the agents see? The robot's origin stays unexplained: a 1944 shoot-down, bodies and one small machine sent to Wright-Patterson.", ["Questions"]],
].map(([id, title, content, tags], i) => ({ id: `hangar-note-${id}`, title, color: ["sage", "sand", "rose", "sage", "sand"][i], createdAt, tags, connections: [], content }));

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
  description: "The cold open of an animated 1975 feature: a pilot who sounds amazed, a crate marked INERT, a truck, a near-miss, and a crate that is empty. About six minutes, " + scenes.length + " scenes, " + shots.length + " shots, almost no dialogue, in the house style Painted Americana '75. " + delivered.length + " of " + shots.length + " shots have their picture so far.",
  genre: "Animated mystery",
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
