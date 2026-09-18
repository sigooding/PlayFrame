export const IMAGE_TYPES = /^image\/(jpeg|png|webp)$/;

/** Reads an image file and returns a downscaled JPEG data URL that is safe to store. */
export function resizeImage(file: File, maxSize = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Image processing unavailable.");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (error) { reject(error); }
      finally { URL.revokeObjectURL(url); }
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That image couldn't be opened.")); };
    image.src = url;
  });
}

/** Unique images a project already owns — storyboard frames and mood board items. */
export function projectImages(project: { frames: { image: string }[]; moodboards?: { items: { image: string }[] }[] }, limit = 14): string[] {
  const seen: string[] = [];
  const push = (value: string) => {
    if (!value) return;
    if (value.startsWith("/images/shots/")) return;
    if (!seen.includes(value)) seen.push(value);
  };
  for (const frame of project.frames) push(frame.image);
  for (const board of project.moodboards || []) for (const item of board.items) push(item.image);
  return seen.slice(0, limit);
}

export const initials = (name: string) => name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();


/** Inline SVG placeholder shown when an image file is missing (e.g. after a repo upload that dropped binaries). */
export const MISSING_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9eee1"/><stop offset="1" stop-color="#d5ddcb"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><g fill="none" stroke="#8fa47c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="230" y="120" width="180" height="120" rx="10"/><circle cx="275" cy="160" r="12"/><path d="M240 225l50-50 35 35 30-25 45 40"/></g><text x="320" y="285" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="16" fill="#6f8360">image not found</text><text x="320" y="308" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#93a586">add it to public/images or upload a new one</text></svg>'
);

/**
 * Pictures that older versions of Frame referenced but that are no longer shipped. Projects saved
 * before the switch still point at them, so every render resolves through here and the app never
 * shows a broken frame just because the library moved on.
 */
const RETIRED_IMAGES: Record<string, string> = {
  "/images/woman-car.jpg": "/images/shots/medium-close-up.jpg",
  "/images/coastal-road.jpg": "/images/shots/establishing.jpg",
  "/images/lighthouse.jpg": "/images/shots/extreme-wide.jpg",
  "/images/cliffside.jpg": "/images/shots/wide.jpg",
  "/images/lighthouse-path.jpg": "/images/shots/full.jpg",
  "/images/shots/low-key.jpg": "/images/lighting/practical-night.jpg",
  "/images/shots/natural-daylight.jpg": "/images/lighting/natural-daylight.jpg",
  "/images/shots/golden-hour.jpg": "/images/lighting/golden-hour.jpg",
};

export const resolveImage = (src?: string) => (src && RETIRED_IMAGES[src]) || src || "";

/** Rewrites retired image paths anywhere in a project. Pure, so server and client agree. */
export function healProjectImages<T extends { coverImage?: string; frames?: { image: string }[]; characters?: { image?: string }[]; moodboards?: { items: { image: string }[] }[] }>(project: T): T {
  const cover = resolveImage(project.coverImage);
  return {
    ...project,
    coverImage: cover || project.coverImage,
    frames: project.frames?.map(frame => frame.image === resolveImage(frame.image) ? frame : { ...frame, image: resolveImage(frame.image) }),
    characters: project.characters?.map(character => character.image && character.image !== resolveImage(character.image) ? { ...character, image: resolveImage(character.image) } : character),
    moodboards: project.moodboards?.map(board => ({ ...board, items: board.items.map(item => item.image === resolveImage(item.image) ? item : { ...item, image: resolveImage(item.image) }) })),
  } as T;
}

/** True once React has hydrated. Guards DOM writes so server HTML and client markup stay identical. */
let hydrated = false;
export const markHydrated = () => { hydrated = true; };

/** Replace a broken image with the placeholder exactly once — only after hydration has finished. */
export function applyImageFallback(el: HTMLImageElement) {
  if (!hydrated || el.dataset.fallback === "1") return;
  el.dataset.fallback = "1";
  el.src = MISSING_IMAGE;
}

/** Use as onError={onImageError} on client-rendered images. */
export function onImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  applyImageFallback(event.currentTarget);
}

/**
 * Images that failed before React took over still need fixing. Run this once on mount:
 * an image whose bytes already arrived broken is `complete` with no intrinsic width.
 */
export function sweepBrokenImages(root: ParentNode = document) {
  if (typeof document === "undefined") return;
  markHydrated();
  for (const node of Array.from(root.querySelectorAll("img"))) {
    if (node.complete && node.naturalWidth === 0 && node.getAttribute("src")) applyImageFallback(node);
  }
}
