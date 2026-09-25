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

/** Frames that still show the superseded Japanese Jack design. */
export const jackRecastPending = new Set(["neonoire-shot-74", "neonoire-shot-75", "neonoire-shot-73"]);

export const jackRecastNote = "JACK RECAST PENDING — on 25 September 2026 Jack was recast as a white American (new sheets/jack.jpg, jack-face.jpg). This keyframe still shows the superseded Japanese design and must be regenerated against the new sheet, keeping its composition, Vera, the street and the blocking. Do not approve it as is.";
