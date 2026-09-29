// The roadside inn: scenes 31, 32, 34 (the refuge) and 38, 39, 40, 41, 45 (they come for Jack).
// First boarding, ten shots in one session of ten calls. Boarded out of screenplay order at the
// director's request ("you choose what is visually best"), numbered in boarding order (171–180).
// Scenes 30, 33, 35–37 and 42–44, 46–49 of the sequence remain written, not boarded.
//
// Two standing visual rules, set 26 September 2026 at the director's request:
//
// 1. THE STAIRWAY MOTIF ("the ups and downs", after the stairs of Tokyo Story). Stairs are staged
//    wherever the script allows, from a LOW, LEVEL, STATIC camera square to the flight. Going UP means
//    refuge, hope or the past; coming DOWN, or something coming UP from below, means danger or loss.
//    The inn's stair frame (s32/171) is shot twice from the identical position: warm in scene 32,
//    cold in scene 41. Planned next: the Hive's outside stair (15), Jack's office stairwell (10 exit,
//    21), stone steps up from the sea wall in the fishing town (28), and the Hive stairwell (69, 71),
//    which should match scene 89's.
//
// 2. THE COLOUR CHANGE AT THE INN. Scenes 31–37 are the WARM REFUGE (tungsten amber, ivory paper,
//    tobacco wood, muted olive, a pink payphone, Tokyo Story restraint). From scene 38, when the four
//    sedans turn in, the palette changes to THE COLD: steel blue and blue-black, hard xenon-white
//    headlight beams with the rain visible only inside them, and the warm lights dead. The only warm
//    things left are small and accidental (the vending machine, the CRT). Scene 50's dawn is drained
//    blue-grey.
export const innScenes = new Set(["s31", "s32", "s34", "s38", "s39", "s40", "s41", "s45"]);
export const innWarmScenes = new Set(["s31", "s32", "s34"]);
export const innStairFrames = ["/images/neonoire/s32/171-upstairs-at-the-end.jpg", "/images/neonoire/s41/177-boots-below.jpg"];
export const innImages = [
  "/images/neonoire/s31/169-the-only-car.jpg",
  "/images/neonoire/s32/170-just-one-night.jpg",
  "/images/neonoire/s32/171-upstairs-at-the-end.jpg",
  "/images/neonoire/s34/172-twenty-years-of-januaries.jpg",
  "/images/neonoire/s34/173-no-114.jpg",
  "/images/neonoire/s38/173-four-black-sedans.jpg",
  "/images/neonoire/s39/174-he-has-heard-the-gravel.jpg",
  "/images/neonoire/s39/175-the-curtain-gap.jpg",
  "/images/neonoire/s40/176-were-closed.jpg",
  "/images/neonoire/s40/177-behind-the-counter.jpg",
  "/images/neonoire/s40/178-staff-side.jpg",
  "/images/neonoire/s41/177-boots-below.jpg",
  "/images/neonoire/s41/178-the-screens.jpg",
  "/images/neonoire/s41/179-same-wood.jpg",
  "/images/neonoire/s45/178-thank-you-very-much.jpg",
  "/images/neonoire/s45/179-it-rings.jpg",
  "/images/neonoire/s45/180-the-shoulder.jpg",
];

const innBase = "16:9 full-bleed (1920×1080), no letterbox. THE ROADSIDE INN follows the style sheet sheets/roadside-inn.jpg, keys/09-the-roadside-inn.jpg and the master s31/169-the-only-car.jpg: two storeys of weathered wood, a tin roof, a gravel lot, a beer vending machine by the entrance, a pickup parked crooked behind. THE LOBBY follows s32/170-just-one-night.jpg (pink payphone, souvenir keyring case, CRT baseball on a shelf, wooden counter, the steep staircase at the back). THE STAIRS follow s32/171-upstairs-at-the-end.jpg. JACK'S ROOM follows s34/172-twenty-years-of-januaries.jpg. JACK follows the recast sheets/jack.jpg (white American, 48, charcoal overcoat, off-white shirt). MRS. NODA and MR. NODA (70s, Japanese) have no cards. THE MASKED MEN follow s1/12-masked-man-radio.jpg and the costume sheet sheets/masked-man.jpg (black clothes, dark knit cap over a BLACK lower-face mask covering nose and mouth, gloves, compact submachine guns): never white masks, never full balaclavas, never a face under the mask. STAIRWAY MOTIF: a low, level, static camera square to the flight; going up is refuge, something coming up from below is danger.";

export const innWarmLook = `${innBase} COLOUR: THE WARM REFUGE — tungsten amber, ivory paper, tobacco wood, muted olive and the pink payphone, Tokyo Story restraint, a low static camera. AI-generated draft studies, not approved coverage.`;
export const innColdLook = `${innBase} COLOUR: THE COLD, from scene 38 — steel blue and blue-black, hard xenon-white headlight beams with the rain visible only inside them, the warm lights dead; the only warm things left are small and accidental (the vending machine, the CRT). The same camera positions as the warm frames, so the change reads. AI-generated draft studies, not approved coverage.`;
