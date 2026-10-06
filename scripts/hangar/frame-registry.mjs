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
//      BEFORE the new one is installed; the archive is append-only. `install-picture.mjs --replace`
//      enforces this: it refuses an in-place replacement until it can see the archived predecessor.
//      Two frames have used it — 12 and 17, archived as --v1.
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
    note: "Retake (the first study, whose cab had no windscreen frame and a green display 1975 never saw, is archived as archive/s3/12-the-cab--v1.jpg): the enclosed cab now reads correctly — windshield header, roof liner, sun visor, side glass and pillars, round analog gauges and a period AM radio with a needle dial, dash amber on both faces. Two honest flaws remain: a pale band along the top right edge of the glass, and the dark trailer through the rear glass that the first study had is no longer readable.",
  },
  16: {
    image: "/images/hangar/s4/16-headlights-round-the-bend.jpg",
    note: "Delivered as a study, awaiting the director's eye: the wagon is over the centre line a beat too long and its beam flares into the lens, fog going white.",
  },
  17: {
    image: "/images/hangar/s4/17-two-more-miles.jpg",
    note: "Retake on the director's note — prettier, and full-bleed: the first study (now archive/s4/17-two-more-miles--v1.jpg) carried a printer's white frame around the picture, which is a generation artefact and is gone. She reads thirty-four and pretty now — soft regular features, dark lashes, warm face — while keeping the exhaustion in the slow blink. Cap, coat and clipped badge all read; the oncoming glare crosses her eyes at the left edge. Her hand on the wheel is a shade heavy, small in frame.",
  },
  5: {
    image: "/images/hangar/s2/05-guard-booth-tv.jpg",
    note: "Delivered as a study, awaiting the director's eye: the period set reads exactly — rabbit ears, two dials, a small curved screen carrying the committee and its raised gavel in blue-white flicker, a mug, a clipboard and a dented thermos on the shelf, the emptied hangar and its sodium lamps through the booth glass. The clipboard's writing is pseudo-hand and stays unreadable, which is what the rule asks.",
  },
  6: {
    image: "/images/hangar/s2/06-wright-field-1944-inert.jpg",
    note: "Delivered as a study, awaiting the director's eye: the stencil WRIGHT FIELD 1944 - INERT is crisply legible, one bare lamp pools hard top light onto the crate with deep shadow beneath, the coffee ring is worn into the lid and readable, the floor around it is empty and dark. Low angle so the crate looms; nobody in frame reads it aloud.",
  },
  7: {
    image: "/images/hangar/s2/07-the-coffee-ring.jpg",
    note: "Delivered as a study, awaiting the director's eye: top-down on the lid, the dark ring worn into the grain, the sergeant's chipped blue enamel mug sitting exactly in it, steam rising, his weathered hand caught lifting it off. The mug is enamel-blue per his cast sheet; the ring is the point.",
  },
  8: {
    image: "/images/hangar/s2/08-hand-flat-on-the-lid.jpg",
    note: "Delivered as a study, awaiting the director's eye: the old hand rests flat and still on the lid, warm lamp bounce on the back of the hand and on the worn wood, the face out of frame above. The fingers run a little sinewy and the faint ghost of reversed stencil on the lid reads as wear; neither fights the beat.",
  },
  23: {
    image: "/images/hangar/s5/23-down-the-bank.jpg",
    note: "Delivered as a study, and the pass's strongest: painted monochrome-blue moonlight, the crate tumbling into a trunk with boards spinning away, ferns and wet bark layered with real depth, nothing thrown clear of it and nothing visible inside. The stencil is weathered to gibberish (unreadable by design); the crate reads a little small against the trunks.",
  },
  27: {
    image: "/images/hangar/s6/27-road-flares.jpg",
    note: "Delivered as a study, awaiting the director's eye: the trucker crouches to light the flare, sparks spitting; the flatbed and trailer stand slewed across the wet road; the sedan has stopped at an angle and both agents are out, the near one already looking down the bank. The flare's crimson is the only key on the men — no flashlight anywhere. Two honest flaws: the spark burst reads closer to a firework than a road flare, and the agents' cut reads a little anachronistic against the 1975 brief.",
  },
  31: {
    image: "/images/hangar/s7/31-empty.jpg",
    note: "Delivered as a study, awaiting the director's eye: the crate lies split open in the shallows, boards scattered, straw spilled into the water, and the open interior is pure empty shadow — nothing inside, no shape, no figure. One agent stands with the flare held low, face lit hard from below; the second is a backlit dark shape. An anticlimax, not a shock. The pines around the creek read Northern European rather than Ohio; a retake should go bare deciduous.",
  },
  36: {
    image: "/images/hangar/s7/36-the-far-corner.jpg",
    note: "Delivered as a study, awaiting the director's eye: the flare's red only just reaches the nearest boards, the few tally marks sit in near-darkness with no cross-stroke through any of them, and the rest of the frame falls to black. Nobody is in shot and nobody looks here, which is the shot.",
  },
};

/** The next number free for a new picture's production identity. */
export const nextFreeNumber = 40;
