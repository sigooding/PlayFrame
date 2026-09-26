// 25 September 2026 — scenes 77–79: the envelope, the name, the notebook. First boarding.
// Same session: Jack is recast as a white American. His identity sheet and face crop were
// regenerated; scene 74's three Jack frames still show the superseded design and are marked
// RECAST PENDING until they are regenerated against the new sheet.
export const dawnScenes = new Set(["s77", "s78", "s79"]);

export const dawnLook = "16:9 full-bleed (1920×1080), no letterbox. Static, level cameras; 35mm for rooms, 50mm inserts, 85mm for the rare close-up. 35mm Kodak Vision3 500T grain, soft halation, blacks slightly crushed. JACK (48): white American (recast 25 September 2026) — sheets/jack.jpg and jack-face.jpg: lean, long angular face, hollow cheeks, deep-set tired grey-green eyes, dark brown hair swept back and greying at the temples, salt-and-pepper stubble; soaked charcoal knee-length overcoat over an off-white open-collar shirt; hands still dirty and unwashed from the Hive (non-graphic). Not Daniel Voss. JACK'S OFFICE MASTER s77/85-the-desk-lamp.jpg: frosted glass door lettered JACK at left, slept-on brown sofa and blanket, worn wooden desk, green-shaded brass lamp (only warm light), black rotary phone, grey filing cabinets with a small CRT showing static at right, venetian blinds over rain and the elevated railway. THE NOTEBOOK: small, worn, faded dark-green cloth cover, frayed corners, cream pages of neat slanted blue-ink handwriting, DANIEL VOSS in capitals inside the cover; the plain white envelope carries no name. VERA VOSS: sheets/vera.jpg / vera-face.jpg identity; same wine-red silk broad-strap cowl-neck calf-length dress as s72/69-the-wait.jpg, now creased, water-stained and dried stiff; hair dried tangled; faint dried mascara shadows, no fresh tears; BAREFOOT (the left shoe is off indoors from scene 78). CORRIDOR MASTER s78/88-the-walkway.jpg: third-floor open-air walkway of scene 3's old block, steel doors and meters left, rusted dripping railing right, elevated line beyond, flat grey-blue dawn. APARTMENT: s4/33-the-apartment.jpg geometry and apartmentLook, now in dawn window light only; lamp and CRT off; NO paper pendant; umbrella stand EMPTY (the umbrella is at the hotel); exactly two ivory cups, both empty. No invented text beyond the name, no subtitles or watermarks. AI-generated draft studies, not approved coverage.";

// Actual generation calls delivered as shot images (the jack sheet is a tenth asset, below).
// Rejected, not delivered: the first office wide (superseded Jack design, generated before the
// recast) and the first scene 79 wide (Vera sat on the table).
export const dawnImages = [
  "/images/neonoire/s77/85-the-desk-lamp.jpg",
  "/images/neonoire/s77/86-the-clean-envelope.jpg",
  "/images/neonoire/s77/87-he-writes-nothing.jpg",
  "/images/neonoire/s78/88-the-walkway.jpg",
  "/images/neonoire/s78/89-no-name.jpg",
  "/images/neonoire/s78/90-daniel-voss.jpg",
  "/images/neonoire/s79/91-grey-light.jpg",
  "/images/neonoire/s79/92-underlined-twice.jpg",
  "/images/neonoire/s79/93-against-her-chest.jpg",
];

export const jackRecastSheet = "/images/neonoire/sheets/jack.jpg";

/** Frames that still show the superseded Japanese Jack design. Empty since the scene 74 regeneration. */
export const jackRecastPending = new Set([]);

// Next turn (25 September 2026): scene 74's three Jack frames regenerated against the recast sheet,
// each an edit of its own existing keyframe so composition, street, Vera and blocking are unchanged.
export const jackRecastImages = [
  "/images/neonoire/s74/74-twenty-metres-apart.jpg",
  "/images/neonoire/s74/75-one-desperate-blow.jpg",
  "/images/neonoire/s74/73-two-small-figures.jpg",
];
export const jackRecastDone = new Set(["neonoire-shot-74", "neonoire-shot-75", "neonoire-shot-73"]);
export const jackRecastDoneNote = "JACK RECAST APPLIED (25 September 2026): this keyframe was regenerated from its own previous image with the recast sheets/jack.jpg (white American) attached. Composition, street, Vera, shoes and blocking are unchanged; only Jack was replaced.";

// Scene 80: first boarding, six shots in the same turn (seven calls: the clock-fix edit of shot 100
// counts). Room master s80/94-the-long-room.jpg, from scene 7's night master.
export const policeDayScenes = new Set(["s80"]);
export const policeDayImages = [
  "/images/neonoire/s80/94-the-long-room.jpg",
  "/images/neonoire/s80/95-ishida-doesnt-look-up.jpg",
  "/images/neonoire/s80/96-hands-close.jpg",
  "/images/neonoire/s80/97-where-to-find-them.jpg",
  "/images/neonoire/s80/98-past-the-clock.jpg",
  "/images/neonoire/s80/99-afraid.jpg",
];
export const policeDayLook = "16:9 full-bleed (1920×1080), no letterbox. Scene 7's detectives' room (s7/63-the-detectives-room.jpg) by DAY: flat grey window light at right mixed with green-white fluorescent tubes, detectives at their desks. Grey metal desks, brown laminate tops, manila files, square pillars, the SINGLE round black-rim white-face clock above the rear door (it runs a minute fast; never two clocks), the same wood-cased green-dial radio on Ishida's desk. Master s80/94-the-long-room.jpg; shots 96 and 100 share one locked 24mm camera down the central aisle. ISHIDA follows sheets/ishida.jpg: Japanese, fifties, salt-and-pepper hair, charcoal suit, light grey open-collar shirt, NO TIE, writing in careful longhand. JACK follows the recast sheets/jack.jpg (white American, 48): unshaven, creased off-white shirt, dry charcoal knee-length overcoat, dried blood in his knuckle creases (non-graphic). Jack stays screen-left of Ishida. He never hits him. Japanese dialogue is subtitled in the edit, never burned into frames. AI-generated draft studies, not approved coverage.";

export const jackRecastNote = "JACK RECAST PENDING — on 25 September 2026 Jack was recast as a white American (new sheets/jack.jpg, jack-face.jpg). This keyframe still shows the superseded Japanese design and must be regenerated against the new sheet, keeping its composition, Vera, the street and the blocking. Do not approve it as is.";
