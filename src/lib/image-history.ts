import type { StoryFrame } from "./types";

const MAX_IMAGE_HISTORY = 20;

/**
 * Change a frame's keyframe while retaining its first pre-change image and recent selections.
 * The first original is stable across later swaps; selecting it again does not erase the
 * alternates that were tried along the way.
 */
export function selectFrameImage(frame: StoryFrame, image: string): StoryFrame {
  if (frame.image === image) return frame;

  const imageOriginal = frame.imageOriginal || frame.image || undefined;
  const history = [...(frame.imageHistory || []), frame.image]
    .filter((src): src is string => Boolean(src) && src !== image && src !== imageOriginal);
  const imageHistory = [...new Set(history)].slice(-MAX_IMAGE_HISTORY);

  return {
    ...frame,
    image,
    imageOriginal,
    imageHistory: imageHistory.length ? imageHistory : undefined,
  };
}
