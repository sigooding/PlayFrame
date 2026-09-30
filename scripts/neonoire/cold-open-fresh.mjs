// Director-ordered clean restart, 30 September 2026. Never attach existing images.
// This pass supersedes cold-open-look.mjs for scenes 1–2, including coverage 280–282.
export const freshColdOpenShots = new Set([...Array.from({ length: 28 }, (_, i) => i + 1), 280, 281, 282]);
export const freshColdOpenBatches = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 19],
  [10, 11, 12, 13, 14, 15, 16, 17, 20],
];
export const freshColdOpenGenerated = new Set(freshColdOpenBatches.flat());
export const freshColdOpenReferences = Object.freeze([]);
export const freshColdOpenRule = "FRESH COLD OPEN — 30 September 2026. Text-only generation from the screenplay and written character facts. NO image references: no existing frames, cast sheets, location sheets, style keys, crops or edit inputs. Do not use the old boards' compositions or continuity notes as visual instructions. Keep the screenplay, stable shot IDs and filenames unchanged. All images remain unapproved.";
export const freshColdOpenStyle = "Create a new photorealistic restrained Japanese crime-drama still, 16:9 landscape full bleed, 1920×1080 target. Ordinary worn Tokyo, patient rain visible only where practical light crosses it, quiet charcoal shadows, modest white and amber pools, fine 35mm grain. No glamorous storm, neon spectacle, captions, borders or watermarks. Natural anatomy and plausible geometry. No graphic wounds or blood.";
export const freshColdOpenCast = "Mara: American, 24, oval face, pale blue eyes, long wet ash-blonde hair, small red enamel bird clip at left temple, indigo denim jacket, grey tee, black jeans, white trainers, thin black cord necklace. Small dark-brown structured leather handbag with two rounded handles and intact shoulder strap until shot 17; no bag in bar. Sakai: Japanese, 70s, slender, sparse grey-white hair, cheap translucent beige raincoat hood down over brown cardigan and cream shirt, dark trousers, black shoes; no hat or umbrella. Exactly two anonymous men: black jackets, trousers, shoes, knit caps and black nose-and-mouth masks, never uncovered faces. Journalist: Japanese, early 40s, short black hair, thin metal glasses, charcoal corduroy blazer, pale blue shirt; untouched beer, closed brown pocket notebook.";
export const freshColdOpenAlley = "New text-designed set: narrow pedestrian alley too narrow for cars. Looking toward the small bar sign at the far end: recessed barbershop on RIGHT, one UNLIT striped pole, battered white vending machine opposite LEFT. Reverse these screen sides when looking toward alley mouth. Car end → Sakai → doorway/vending → bar. One ordinary black 1990s four-door sedan stops OUTSIDE at the mouth, headlights down the alley; men enter and leave on foot. No taxi, crowd, umbrella or car inside lane. Mara stays concealed during the attack and runs away from the car toward the bar. The sedan reverses out of the alley mouth, never U-turns in the lane.";
export const freshColdOpenBar = "New text-designed set: tiny six-stool bar, straight worn wooden counter RIGHT when viewed from entrance; bottle shelves behind counter; rain-streaked street window LEFT. Half-open rear service door into stockroom. CRT high on rear wall showing actual variety-show performers, never static. Amber shelves, subdued blue screen light. Journalist at far stool. Mara hides on staff side at far end with bottle crate; counter conceals her from entry. No bag; clip falls between crates at final beat. The key stays with her, tag 114 if visible.";
export const freshColdOpenBeats = new Map([
  [1, "Empty low wide along alley toward small warm bar sign. Vending pool, closed shops, overhead wires, one upstairs light; no people or car."],
  [2, "Low close view of battered off-white vending machine against left plaster wall, cold light through patient rain onto wet asphalt; no people."],
  [3, "Wide view of Mara walking fast with folded arms, no umbrella, barely holding back tears. Let the street occupy most of frame."],
  [4, "Medium side view: Mara looks down at incoming call, phone display clearly reads VERA. Natural hands, uncertain expression."],
  [5, "Waist-level insert: Mara puts phone with fully black OFF screen into open brown handbag. Shoulder strap remains attached and intact."],
  [6, "Mara presses deep into dark right-wall barbershop recess, waiting, one unlit barber pole at edge, rain outside. She is concealed, not posing on pavement."],
  [7, "Sakai passes her doorway toward bar, gives tiny flicker of recognition then looks away, one hand to side. Mara remains hidden; no added umbrella."],
  [8, "Wide reverse toward mouth: sedan outside lane, two masked men walk in, Sakai nearer camera facing AWAY from them. Mara still concealed in left recess. No crowd or taxi."],
  [9, "Medium profile of Sakai stopped and resigned, headlights behind him throwing shadow forward. Face forward, no turning to men, no extra wardrobe."],
  [10, "Distant wide of non-graphic consequence: Sakai folds to knees then side, two men calm behind him. No muzzle flash or wound. Mara remains in recess."],
  [11, "Inside recess, Mara presses both natural hands over mouth, eyes watching street, narrow edge of rainlit doorway. Keep most frame dark."],
  [12, "One masked man touches earpiece, other heads toward car at mouth. Sakai still on ground; Mara stays hidden. No additional men."],
  [13, "Wide after departure: sedan beyond mouth on cross street, rear red lights receding; alley falls dark. Sakai remains on ground and Mara in recess. No U-turn."],
  [14, "Low wide: Mara kneels in rain beside living Sakai on his side, fumbling with switched-off phone. Brown bag still with her. Non-graphic."],
  [15, "Ground-level insert of Sakai's hand closing Mara's fingers over one small key. Exactly two people's natural hands, beige raincoat sleeve and denim cuff."],
  [16, "One young woman's open palm: small silver coin-locker key, worn ivory tag legibly marked 114. No extra keys or fingers."],
  [17, "Mara runs AWAY from returning headlights toward distant bar. Brown bag strap catches on unlit barber pole and tears; bag drops into puddle, not carried away."],
  [18, "Object-only consequence insert: flashlight beam from offscreen finds abandoned brown bag in puddle beside the unlit barber pole; torn strap caught on bracket. Empty frame: no people, body, weapon or car. The surrounding screenplay retains the coat search; this image covers the purse discovery."],
  [19, "Low room-wide establishing: six stools and counter, journalist waiting at far end, beer and closed notebook, nobody behind counter; CRT variety show."],
  [20, "Journalist waits alone in bar corner, checks watch and entry. Keep charcoal blazer, pale blue shirt, glasses, beer and brown notebook."],
  [21, "Mara bursts through street door soaked and breathless; journalist half rises in recognition. No handbag; bird clip still pinned."],
  [22, "Journalist half-standing, looking at Mara with recognition; she looks back toward door as headlights sweep rainy window. He wears same blazer."],
  [23, "Mara crouches behind far staff end of counter, back against shelves, opens fist to see key then closes it. No bag, clip still in hair."],
  [24, "Mara's floor-level POV: counter underside, bottle crate, journalist's shoes attached to his legs beneath stool; blue TV glow on ceiling. No floating shoes."],
  [25, "Floor POV: exactly two pairs of wet black shoes attached to trousered men's legs enter; journalist stands. Counter hides Mara, no faces or gunfire needed."],
  [26, "After shots: tipped stool, journalist's hand visible beyond counter, CRT shows laughing human variety-show performers. No static or graphic injury."],
  [27, "Low floor POV: one masked man's attached legs beside journalist's body as gloved hand takes brown notebook; other turns toward half-open stockroom door. No disembodied footwear."],
  [28, "Mara shaking in blue TV light behind counter, hand flat on bottle crate. Red bird clip has dropped between crates, NOT still in hair. No bag. Hold frightened face."],
  [280, "Under streetlamp, Mara unfolds scrap with handwritten address and clearly legible 1:00, then checks watch. Clip and intact brown bag present."],
  [281, "Mara's POV down pedestrian lane to tiny lit bar sign at far end, opposite car end. Patient empty street, no sedan at bar."],
  [282, "Low non-graphic two-shot as kneeling Mara recognises Mr. Sakai; he looks up at her, rain between faces, no other people."],
]);
export const freshColdOpenCaveats = new Map([
  [1, "Fresh location study; not an approved continuity master."],
  [2, "Machine model/details differ from shot 1. Needs continuity review."],
  [3, "Walk is toward camera rather than requested lateral staging; face/bag vary across this text-only batch."],
  [4, "Phone caller text is malformed, not legible VERA. Needs correction."],
  [5, "A loose strap end reads as detached before the scripted snag; handbag shape varies. Needs correction."],
  [6, "Vending machine is too far down lane and model differs; recess geometry differs from 1. Needs correction."],
  [7, "Sakai turns fully toward Mara rather than flickering past; extra vending machine, opaque coat, Mara's footwear drifts. Needs correction."],
  [8, "Major staging failure: Sakai faces approaching men, invented hat/umbrella, taxi-like sedan and crowded bright cross street. Do NOT use as a master; needs fresh retake."],
  [9, "Sakai's shirt changes; background men are not clearly masked and sedan reads inside lane. Do NOT use as a master; needs fresh retake."],
  [10, "Collapse and two lower-face masks read; Mara is too exposed in doorway. Sakai and men are closer than the distant-wide brief; headlight direction not firmly established."],
  [11, "Both hands cover mouth; gaze goes screen-right rather than toward the visible alley opening. Clip side/scale drifts; thin generated black edge retained, not cropped."],
  [12, "Radio, two men, concealed Mara and body read. Car is across mouth but headlights run sideways rather than down alley; coat opacity and set details drift."],
  [13, "Car is outside mouth with red rear lights and Sakai remains visible. Mara stands exposed, footwear turns dark, bag changes shape; crossing is brighter than requested."],
  [14, "Kneeling, black phone screen, intact bag and living Sakai read. Sakai is propped high on elbow rather than lying low; face and set details vary."],
  [15, "Two natural hands and key transfer read, but fingers remain open rather than being folded closed; view reads waist-height. Tag shape differs from 16."],
  [16, "114 is legible at full size and in prop crop; one key, one tag, five fingers. Palm reads right rather than requested left; not a locked prop master."],
  [17, "Mara runs away with no bag on body; bag is caught at pole and touching water. Strap reads as a continuous hanging loop, not a clear tear; returning headlight cue is weak."],
  [19, "Journalist sits near camera rather than far corner; stool count is not fully provable. Needs staging review."],
  [20, "Watch, beer, closed brown notebook and glance toward entry read. A backed chair replaces stool, counter has an added raised tier, CRT reads presenter panel rather than clearly variety; thin generated black bars retained."],
]);
export function freshColdOpenPrompt(n) {
  if (!freshColdOpenShots.has(n)) throw new Error(`Not a cold-open shot: ${n}`);
  return [freshColdOpenRule, freshColdOpenStyle, n <= 18 || n >= 280 ? freshColdOpenAlley : freshColdOpenBar, freshColdOpenCast, `SHOT ${n}: ${freshColdOpenBeats.get(n)}`].join("\n\n");
}
export function freshColdOpenNote(n) {
  const generated = freshColdOpenGenerated.has(n);
  return [freshColdOpenRule,
    generated ? `FRESH GENERATED — batch ${freshColdOpenBatches.findIndex(batch => batch.includes(n)) + 1}. AI-generated text-only study; not approved coverage.` : "FRESH PASS PENDING — existing image retained temporarily; it is NOT part of the fresh pass and must NOT be used as a reference.",
    generated ? `REVIEW: ${freshColdOpenCaveats.get(n)}` : (n === 18 ? "Batch 2 generation was blocked; no file produced. Object-only purse-discovery reframe was not generated because the turn limit had been reached. Awaiting next batch." : "Awaiting a later text-only batch; per-turn generation limit reached."),
    `SCREENPLAY BEAT: ${freshColdOpenBeats.get(n)}`,
    "Pass ledger: docs/neonoire/passes/cold-open-fresh-2026-09-30.md. Generate next briefs with node scripts/neonoire/pass-prompts.mjs --cold-open-fresh. Old board visual instructions are superseded for this pass."
  ].join("\n\n");
}
