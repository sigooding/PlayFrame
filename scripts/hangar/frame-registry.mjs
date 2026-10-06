// The cold open's delivered pictures — the single source of truth for what is on disk.
//
//   npm run build:hangar      reads this file, so the bundle and the board can never drift from the
//                             pictures that exist on disk
//   npm run verify:hangar      checks every entry here against the disk, its shot and its caveat
//
// Rules that bind this file (CLAUDE.md, "never overwrite an image", applied to the cold open from
// its first picture):
//
//   1. A picture belongs to a shot's NUMBER. Numbers are production identity: never reused, never
//      renumbered, never pointed at another shot's file.
//   2. A retake is a NEW file at a new path. If a picture must replace a shot's own file in place,
//      the old file is copied to public/images/hangar/archive/<scene>/<name>--v<N>.jpg and committed
//      BEFORE the new one is installed; the archive is append-only.
//   3. A shot with no picture yet keeps image "" and status "Needs review". A shot with a picture
//      is "Ready" — the app's word for a card that is not missing anything — and its `note` carries
//      the honest word about the study, including that it is a draft awaiting the director's eye.
//
// `note` is appended to the shot's own notes by build-project.mjs (its own line, after the Style
// line), so the caveat travels with the card, the prompt and the animatic rather than living only
// in a document somebody has to remember to open.

/** The seven cast of the open. A sheet is a picture of a character, not of a shot. */
export const CAST = {
  airman: {
    image: "/images/hangar/sheets/airman.jpg",
    note: "Cast sheet for the Airman: neat civilian clothes, 1975. He is the only one who hears the clicks at the end.",
  },
  sergeant: {
    image: "/images/hangar/sheets/sergeant.jpg",
    note: "Cast sheet for the Sergeant: faded olive work uniform, the chipped mug, the hand he rests on the lid.",
  },
  trucker: {
    image: "/images/hangar/sheets/trucker.jpg",
    note: "Cast sheet for the Trucker: denim over plaid, plain dark cap, a man who has signed a thousand clipboards without looking up.",
  },
  mom: {
    image: "/images/hangar/sheets/mom.jpg",
    note: "Cast sheet for the Nurse: white cap, navy coat, hospital ID badge — the cap and the badge are the evidence seed of scene 6.",
  },
  agent: {
    image: "/images/hangar/sheets/agent.jpg",
    note: "Cast sheet for the two Agents: plain dark suits, narrow ties, identical bearing, two slightly different ages. The second man is the older one; keep them near-identical on purpose.",
  },
};

/**
 * Delivered shot pictures, keyed by shot number.
 * `image` — the file on disk; `note` — the caveat that travels on the card.
 */
export const FRAMES = {
  1: {
    image: "/images/hangar/s1/01-black-the-radio.jpg",
    note: "Black plate by design: this frame is pure black, 1920×1080, exactly as the screenplay asks. Nothing fades up and nothing is hinted at.",
  },
  2: {
    image: "/images/hangar/s1/02-three-quick-one-slow.jpg",
    note: "Black plate by design: still pure black. The signature sound lives here and nowhere in the picture.",
  },
  3: {
    image: "/images/hangar/s1/03-gunfire-then-silence.jpg",
    note: "Black plate by design: black through the gunfire and the silence. What he shot is never shown, so the frame stays black.",
  },
  4: {
    image: "/images/hangar/s2/04-wright-patterson-at-night.jpg",
    note: "Delivered as a study, awaiting the director's eye: the hangar, the crate line, the flag and the lit guard booth all read; the airmen are small by design, and the crate marked INERT sits in the load without being singled out.",
  },
  11: {
    image: "/images/hangar/s3/11-into-the-hills.jpg",
    note: "Delivered as a study, awaiting the director's eye: the layered blue ridgelines and the fog in the hollows carry the Ghibli depth; the sedan's headlights read as two pinpricks far behind the truck. Painted, but the foliage runs close to photographic — the next visit to this frame should push visible brushwork.",
  },
  12: {
    image: "/images/hangar/s3/12-the-cab.jpg",
    note: "A study with one honest fault: the trucker and the airman read correctly in the cab, dash amber on both faces with fog and night beyond the glass, but the cab has no windscreen frame or roof drawn over them, and the radio carries a green display 1975 never had. This frame is the head of the next pass's retake queue; its replacement gets a new filename and this file is archived first.",
  },
  16: {
    image: "/images/hangar/s4/16-headlights-round-the-bend.jpg",
    note: "Delivered as a study, awaiting the director's eye: the wagon is over the centre line a beat too long and its beam flares into the lens, fog going white.",
  },
  17: {
    image: "/images/hangar/s4/17-two-more-miles.jpg",
    note: "Delivered as a study, awaiting the director's eye: the cap, the coat and the ID badge are all readable, the slow blink is caught mid-drop, and the first white glare of oncoming headlights crosses her eyes at the frame edge. She reads older than the brief's thirty-four; exhaustion is the intent, but a retake could pull her closer to the age.",
  },
};

/** The next number free for a new picture's production identity. */
export const nextFreeNumber = 40;
