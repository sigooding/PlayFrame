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

/** Replace a broken image with the placeholder exactly once. */
export function applyImageFallback(el: HTMLImageElement) {
  if (el.dataset.fallback === "1") return;
  el.dataset.fallback = "1";
  el.src = MISSING_IMAGE;
}

/** Use as onError={onImageError} on client-rendered images. */
export function onImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  applyImageFallback(event.currentTarget);
}

/**
 * Inline script for the document <head>. Image errors on server-rendered markup fire before React hydrates,
 * so a React onError alone would miss them. This captures them at the document level from the very first byte.
 */
export const IMAGE_FALLBACK_SCRIPT = `(function(){var P=${JSON.stringify(MISSING_IMAGE)};function fix(el){if(!el||el.tagName!=="IMG"||el.dataset.fallback==="1")return;el.dataset.fallback="1";el.src=P;}document.addEventListener("error",function(e){fix(e.target);},true);document.addEventListener("DOMContentLoaded",function(){var imgs=document.images;for(var i=0;i<imgs.length;i++){if(imgs[i].complete&&imgs[i].naturalWidth===0&&imgs[i].getAttribute("src"))fix(imgs[i]);}});})();`;
