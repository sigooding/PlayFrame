// 25 September 2026 — Tokyo Story in colour, scenes 72–75.
// This revision deliberately ignores the superseded street studies. Session one: the nine first shot
// images and Jack's new identity sheet used all ten generation slots. Session two delivered the six
// pending replacements plus two continuity replacements (lost-heel geometry, twenty-metre distance)
// in eight calls, completing every scene 72–75 keyframe. Scene 76 is outside this pass.
export const streetsScenes = new Set(["s72", "s73", "s74", "s75"]);

export const streetsLook = "TOKYO STORY IN COLOUR — 16:9 full-bleed (1920×1080), no letterbox. Ozu-inspired restraint, NOT black and white: static low-set LEVEL camera, verticals straight, frontal architecture, normal 50mm lens; 35mm only for the aftermath extreme wide. Low camera height never means an upward heroic angle. No tracking, push-in, handheld, Dutch tilt, glamour or action coverage. Modest 35mm Kodak Vision3 500T grain and halation; muted olive, tobacco amber, ivory practicals and wine red. VERA VOSS: preserve sheets/vera.jpg and vera-face.jpg identity, age 29, pale blue eyes, shoulder-length ash-blonde hair with soft fringe. Tonight's wardrobe is her mother's wine-red silk 1990 dress: broad straps, modest draped cowl neck, bias-cut calf-length skirt, no slit; wine-red closed-toe court shoes, low 5cm heels. No coat or handbag on the street. MAKEUP STATES: scene 72 is DRY, carefully groomed and pretty, intact eyeliner/mascara and muted rose-red lipstick, no tear tracks; rain does NOT damage makeup until she steps outside in scene 73. Through the run hair becomes plastered, silk darkens and mascara washes into thin natural trails; retain her face, never horror makeup or a different actress. SHOE LOCK: both shoes until the skid (board shot 74, asset s73/72-the-lost-heel.jpg); thereafter RIGHT foot bare, LEFT red shoe retained. This side is the visual continuity choice, not specified by the screenplay. JACK (48): the private investigator, NOT Daniel Voss and never called Jack Voss. RECAST 25 September 2026 as a white American — follow the regenerated sheets/jack.jpg and jack-face.jpg: tall lean build, long angular face, hollow cheeks, deep-set tired grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble, good but badly kept charcoal knee-length overcoat over open-neck off-white shirt, black trousers and shoes. No tie, hat, gun or cigarette. Coat soaked, hands dark and unwashed after the Hive, non-graphic. He takes the blow, never retaliates, and stops touching her when pushed away. HOTEL LOCK: s72/69-the-wait.jpg — walnut slatted bar, brass rail, oxblood stools, olive wall, piano at left, rain window, amber table lamp; folded pale-blue umbrella remains against the empty neighbouring stool after Vera leaves. STREET LOCK: s73/70-not-elegantly-badly.jpg — ivory vending machine with muted red side panel and right payment panel, dull-green shutter, riveted railway, shallow gutter and drain grate. CONFRONTATION LOCK: s74/74-twenty-metres-apart.jpg — two machines left, awning right, Vera screen-left of Jack until she approaches; cold machine-light and patient rain, no sky fill. Cover the distant stop, approach, chest blow, folding, rejection and final separated kneeling tableau in that order. Reflection is ambiguous, a pale-blue umbrella shape in water only, no resolved ghost or face. Scene 75 has NO PEOPLE, including reflections: same shoe, same puddle; same empty hotel and abandoned umbrella; intact closed Hive, empty vending machine, CRT static. No invented plot text, subtitles or watermarks. All are AI-generated draft studies, not approved coverage.";

// Actual generation calls, not crops or a contact sheet. Keep these audit lists at their entries.
// Session one (ten calls): Jack's sheet plus nine shot studies; six slots stayed honest placeholders.
export const streetsPassOneImages = [
  "/images/neonoire/sheets/jack.jpg",
  "/images/neonoire/s72/69-the-wait.jpg",
  "/images/neonoire/s72/70-the-call.jpg",
  "/images/neonoire/s73/70-not-elegantly-badly.jpg",
  "/images/neonoire/s73/72-the-lost-heel.jpg",
  "/images/neonoire/s74/74-twenty-metres-apart.jpg",
  "/images/neonoire/s74/75-one-desperate-blow.jpg",
  "/images/neonoire/s74/73-two-small-figures.jpg",
  "/images/neonoire/s75/77-the-red-shoe.jpg",
  "/images/neonoire/s75/78-the-empty-lounge.jpg",
];

// Session two (eight calls): the six pending replacements, plus two continuity replacements —
// the lost-heel keyframe was regenerated to match shot 79's locked puddle/drain geometry, and the
// twenty-metre keyframe was regenerated so the scripted separation distance is actually on screen.
// Two generation slots were deliberately held back. All cameras remain static, low and level.
export const streetsPassTwoImages = [
  "/images/neonoire/s73/69-vera-runs.jpg",
  "/images/neonoire/s73/71-the-machine-glows.jpg",
  "/images/neonoire/s73/72-the-lost-heel.jpg",
  "/images/neonoire/s74/74-twenty-metres-apart.jpg",
  "/images/neonoire/s74/76-the-reflection.jpg",
  "/images/neonoire/s75/79-the-hive-shut.jpg",
  "/images/neonoire/s75/80-the-machine-waits.jpg",
  "/images/neonoire/s75/81-static-in-a-window.jpg",
];

export const aftermathLook = "Scene 76 is unchanged by the scenes 72–75 revision. 16:9 full-bleed (1920×1080). The revised apartment of scene 4 in darkness: s4/33-the-apartment.jpg geometry, NO paper pendant, two cups, window-grey and landing spill only. Vera remains in the ruined wine-red dress, one shoe, dried mascara. The old lighter is Jack's small dented brushed-steel lighter, no readable engraving. Jack is not her father; Daniel Voss is the man in the family photograph.";
