// THE STAKEOUT COVERAGE — scene 14A's second boarding, 4 October 2026.
//
// The first boarding sampled the scene in ten frames (334–343) and the page still held seven beats
// it walked past: the walk back to her car, the knuckle at her window, the umbrella shaken onto his
// floor, the rice ball changing hands without a touch, the train behind them, the rice ball left on
// his dashboard, and the umbrella going up the road in his mirror. The house rule for new frames is
// unchanged — nothing is renumbered, new shots join the end of the run — so they are 344–350, and
// inside the scene they play at their quoted beats, not at their numbers (the way scene 20's 309
// plays ahead of its 193).
//
// They were generated against the scene's new CAR CANON (scripts/neonoire/car-canon-look.mjs): the
// two sheets jacks-car and vera-hatchback, the cast sheets, and the delivered 337 master for the
// cabin. Six landed. 348 did not, twice, and stays OWED with its geometry written on the board —
// the same refusal pass three made on 343: a frame that says something the scene denies is thrown
// away, not caveated. The first study put the lit train through the windscreen where the page puts
// it BEHIND them; the retake put the train correctly in the mirror but sat Vera at the wheel of
// Jack's car (Japan drives right; it is his car) and left a second train band across the lane's end
// in front. The board's note for 348 is the brief for the next generation.
export const stakeoutCoverage = [344, 345, 346, 347, 348, 349, 350];

export const stakeoutCoverageDelivered = [344, 345, 346, 347, 349, 350];

export const stakeoutCoverageOwed = stakeoutCoverage.filter(n => !stakeoutCoverageDelivered.includes(n));

export const stakeoutCoverageLook =
  "Stakeout coverage pass, 4 October 2026: 16:9 full-bleed 1920×1080, 35mm Kodak Vision3 500T grain, " +
  "muted restrained colour, practical light only, static level cameras, steady fine rain, soft halation, " +
  "crushed blacks; generated with the scene's car canon sheets sheets/jacks-car.jpg and sheets/vera-hatchback.jpg " +
  "(scripts/neonoire/car-canon-look.mjs), the cast sheets sheets/jack.jpg and sheets/vera.jpg, and the delivered " +
  "337 master for the cabin. No captions, subtitles, watermarks, legible brand names or legible number plates; " +
  "no paper lanterns in the Kanda lane, ever. Reviewed at full size before install; the caveats in the board " +
  "notes are honest and unclosed. AI-generated draft studies, not approved coverage.";

// The two studies of 348 that were generated and refused, recorded so nobody reinstalls them.
export const stakeoutCoverageRefused = [
  { n: 348, study: "first", reason: "the lit train crosses the WINDSCREEN with an empty mirror; the page puts the train behind them, arriving through the mirror's tremor" },
  { n: 348, study: "retake", reason: "Vera sits at the WHEEL of Jack's car (Japan drives right; it is his car) and a second lit train band crosses the lane's end in front" },
];
