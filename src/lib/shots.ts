import type { CameraAngle, CameraMovement, ShotType, StoryFrame } from "./types";

export interface ShotGuideEntry {
  image: string;
  /** true when the reference is a framing diagram rather than photographic footage */
  diagram?: boolean;
  /** optional framing diagram shown beside the summary when the thumbnail is a photograph */
  framing?: string;
  summary: string;
  useFor: string;
  prompt: string;
}

export const shotGuide: Record<ShotType, ShotGuideEntry> = {
  "Establishing": { image: "/images/shots/establishing.jpg", summary: "Shows the whole location before the action begins.", useFor: "Opening a scene, telling the audience where we are.", prompt: "establishing shot showing the full location and its geography" },
  "Extreme wide": { image: "/images/shots/extreme-wide.jpg", summary: "The subject is tiny inside a vast environment.", useFor: "Scale, isolation, a character dwarfed by the world.", prompt: "extreme wide shot, the subject is very small within a vast landscape" },
  "Wide": { image: "/images/shots/wide.jpg", summary: "Full body visible with plenty of environment around.", useFor: "Blocking, movement through space, context.", prompt: "wide shot, full body visible with the surrounding environment clearly in frame" },
  "Full": { image: "/images/shots/full.jpg", summary: "Head to toe, the whole figure inside the space.", useFor: "Costume, posture, physical performance.", prompt: "full shot, the subject framed head to toe" },
  "Medium wide": { image: "/images/shots/medium-wide.jpg", summary: "Cut at mid-thigh. Also called the cowboy shot.", useFor: "Groups, gestures, keeping some environment.", prompt: "medium wide (cowboy) shot framed from mid-thigh up" },
  "Medium": { image: "/images/shots/medium.jpg", summary: "Framed from the waist up.", useFor: "Conversation, natural everyday coverage.", prompt: "medium shot framed from the waist up" },
  "Medium close-up": { image: "/images/shots/medium-close-up.jpg", summary: "Chest up. Intimate, but still reads body language.", useFor: "Emotional dialogue, reactions.", prompt: "medium close-up framed from the chest up" },
  "Close-up": { image: "/images/shots/close-up.jpg", summary: "The face fills the frame from the shoulders up.", useFor: "Emotion, key reactions, important moments.", prompt: "close-up on the face, shoulders up, shallow depth of field" },
  "Extreme close-up": { image: "/images/shots/extreme-close-up.jpg", summary: "A single detail: eyes, hands, an object.", useFor: "Tension, intimacy, revealing a detail.", prompt: "extreme close-up on a single detail, macro framing" },
  "Over the shoulder": { image: "/images/shots/over-the-shoulder.jpg", framing: "/images/shots/over-the-shoulder.svg", summary: "Looking past one character's shoulder at another.", useFor: "Dialogue coverage, connecting two people.", prompt: "over-the-shoulder shot, foreground shoulder soft, the other character in focus" },
  "Two-shot": { image: "/images/shots/two-shot.jpg", framing: "/images/shots/two-shot.svg", summary: "Two characters share the frame equally.", useFor: "Relationships, shared moments.", prompt: "two-shot with both characters framed together" },
  "POV": { image: "/images/shots/pov.svg", diagram: true, summary: "The camera becomes the character's eyes.", useFor: "Subjectivity, discovery, what they see.", prompt: "first-person point-of-view shot from the character's eyes" },
  "Insert": { image: "/images/shots/insert.jpg", summary: "A tight shot of an object or detail that matters.", useFor: "Props, letters, hands, clues.", prompt: "insert shot, a tight detail of an important object" },
  "Aerial": { image: "/images/shots/aerial.svg", diagram: true, summary: "High above, looking down. Usually a drone.", useFor: "Geography, journeys, grand transitions.", prompt: "high aerial drone shot looking down over the landscape" },
};

export const isShotReference = (image: string) => image.startsWith("/images/shots/");

/** Change a frame's shot type and, when it is using a shot reference image (or none), swap the image to match. */
export function applyShotType(frame: StoryFrame, shotType: ShotType): StoryFrame {
  const usesReference = !frame.image || isShotReference(frame.image);
  return { ...frame, shotType, image: usesReference ? shotGuide[shotType].image : frame.image };
}

export const movementDescriptions: Record<CameraMovement, string> = {
  "Static": "locked-off static camera",
  "Pan": "slow horizontal pan",
  "Tilt": "gentle vertical tilt",
  "Tracking": "smooth tracking shot following the subject",
  "Dolly in": "slow dolly push in toward the subject",
  "Dolly out": "slow dolly pull back away from the subject",
  "Crane up": "crane rising upward to reveal",
  "Crane down": "crane descending toward the subject",
  "Handheld": "subtle handheld camera with organic movement",
  "Steadicam": "fluid steadicam glide",
  "Orbit": "slow orbit around the subject",
  "Zoom in": "slow zoom in",
  "Zoom out": "slow zoom out",
};

export const angleDescriptions: Record<CameraAngle, string> = {
  "Eye level": "eye-level camera",
  "Low angle": "low angle looking up, making the subject feel powerful",
  "High angle": "high angle looking down, making the subject feel small",
  "Dutch angle": "tilted dutch angle for unease",
  "Bird's eye": "directly overhead bird's-eye view",
  "Worm's eye": "extreme low worm's-eye view from the ground",
};

/** MiniMax Hailuo bracketed camera commands */
export const hailuoCommands: Record<CameraMovement, string> = {
  "Static": "[Static shot]", "Pan": "[Pan left]", "Tilt": "[Tilt up]", "Tracking": "[Tracking shot]", "Dolly in": "[Push in]", "Dolly out": "[Pull out]", "Crane up": "[Pedestal up]", "Crane down": "[Pedestal down]", "Handheld": "[Shake]", "Steadicam": "[Tracking shot]", "Orbit": "[Truck left]", "Zoom in": "[Zoom in]", "Zoom out": "[Zoom out]",
};
