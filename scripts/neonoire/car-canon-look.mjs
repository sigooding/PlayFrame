// THE CARS, LOCKED (4 October 2026). Scene 14A put three cars on a wet road at night and the board
// held them only in prose: Jack's worn silver-grey sedan, Vera's rented maroon hatchback and the
// watcher's small white car. Prose alone drifted the way prose always drifts here — 336's first
// landscape study drew Vera an SUV, 343's first study turned the following sedan nose-on to the
// camera, and every 14A interior reads newer than the scene-31 car the scene inherits. So the cars
// get what the people and the Hive already had: a canon lock in one file, and sheets in `sheets/`
// that every car frame from now on attaches. Two sheets were generated on 4 October 2026
// (jacks-car, vera-hatchback), each a four-panel canon of ONE vehicle, identical panel to panel;
// the watcher's white car and the two greys stay prose-only locks held to their delivered frames,
// because each appears in this film for at most three shots and a sheet would out-rank them.
//
// The geometry rule below is the one pass four wrote down after refusing 343's first study: a car
// that FOLLOWS another car is seen from BEHIND. It is asserted by verify:neonoire on the board and
// repeated here so no prompt can forget it.
export const carCanonSheets = {
  jacksCar: "sheets/jacks-car.jpg",
  veraHatchback: "sheets/vera-hatchback.jpg",
};

// Frames that stand as the reference for a vehicle with no sheet of its own.
export const carCanonFrames = {
  watcherWhiteCar: "s14a/340-the-shuttered-door.jpg",
  coldOpenSedan: "s1/332-the-sedan-blocks-the-lane.jpg",
  ishidaGreyCar: "s61/228-nine-oclock.jpg",
};

export const carCanonLook =
  "CAR CANON (4 October 2026) — one vehicle per sheet, never redrawn from memory. " +
  "JACK'S CAR (sheets/jacks-car.jpg, master s31/169-the-only-car.jpg): a boxy early-1980s four-door Japanese sedan, " +
  "worn SILVER-GREY paint gone flat and patchy at the panels, dulled chrome bumpers, black steel wheels with small " +
  "hubcaps, a thin radio aerial on the nearside front wing; ONE headlight dimmer than the other (the nearside lamp is " +
  "the dim one, scenes 30-31) whenever its lights are on, and its rear shows plain rectangular red tail lights and a " +
  "blank plate. INSIDE: bare period-worn cabin, cracked dark-grey dash with nothing on it, manual window winders, " +
  "worn grey cloth bench-style seats, ONE rear-view mirror on a stalk carrying the red enamel bird clip on a knotted " +
  "loop of string (this scene only; Jack gives the clip to Mara in scene 20), no screens, no modern headrests, no " +
  "centre console. Never a clean or modern interior; never mirrored left-to-right. " +
  "VERA'S CAR (sheets/vera-hatchback.jpg): a small boxy MAROON three-door rental hatchback, black bumpers and side " +
  "trim, steamed glass, a plain white rental sticker at the foot of the windscreen; never grey, never an SUV, never " +
  "larger than Jack's sedan. " +
  "THE WATCHER'S CAR (held to s14a/340-the-shuttered-door.jpg): a small plain WHITE car parked further up the road; " +
  "never black (the killers' sedans), never grey (the two greys below), plate never legible. " +
  "THE COLD-OPEN SEDAN (held to s1/332-the-sedan-blocks-the-lane.jpg): a BLACK sedan, the killers', the film's only " +
  "black car; it blocks the lane with its beams down it and backs out on white reverse lamps (s1/13). " +
  "ISHIDA'S DRIVER'S CAR (scenes 61-70): the film's OTHER grey, a darker formal grey town car with a driver; never " +
  "mistaken for Jack's worn silver-grey. " +
  "GEOMETRY: a following car is seen from BEHIND — its rear, its tail lights, its dipped glow thrown forward up the " +
  "road; a car facing the camera is not following anything. Forty metres of wet asphalt is the scene's unit of " +
  "distance. Number plates are blank or suppressed in every frame, never legible. No lanterns ever hang in the Kanda " +
  "lane; its only lights are the vending machine's cold white at the corner and the wordless amber bar sign at the " +
  "far end. AI-generated draft studies, not approved coverage.";

// The two canon sheets generated on 4 October 2026, in the order they were made: Jack's sedan first
// (it is the older lock, inherited from scenes 30-31), then Vera's hatchback against it so the two
// cars never share a silhouette or a colour.
export const carCanonDelivered = ["sheets/jacks-car.jpg", "sheets/vera-hatchback.jpg"];
