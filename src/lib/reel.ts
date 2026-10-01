import type { FilmProject } from "./types";

export interface ReelOptions { width: number; quality: number; audio: boolean }
type Progress = (done: number, total: number, what: string) => void;

const toDataUri = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error || new Error("Couldn't read a file."));
  reader.readAsDataURL(blob);
});

async function fetchBlob(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Couldn't load ${src} (${response.status}).`);
  return response.blob();
}

/** width 0 = embed the untouched original. Otherwise re-encode as JPEG no wider than `width`. */
async function embedImage(src: string, options: ReelOptions): Promise<string> {
  if (src.startsWith("data:")) return src;
  const blob = await fetchBlob(src);
  if (!options.width) return toDataUri(blob);
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, options.width / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return toDataUri(blob);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const jpeg = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", options.quality));
  return jpeg ? toDataUri(jpeg) : toDataUri(blob);
}

async function mapLimit<T>(items: T[], limit: number, work: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) await work(items[next++]);
  }));
}

/**
 * One self-contained file: the project with every image embedded (so it still imports as a normal project backup),
 * plus, optionally, the recorded dialogue embedded under `reel.audio` keyed by the clip's app path.
 */
export async function buildReel(project: FilmProject, options: ReelOptions, onProgress: Progress = () => {}) {
  const imagePaths = new Set<string>();
  const add = (value?: string) => { if (value) imagePaths.add(value); };
  add(project.coverImage);
  project.frames.forEach(frame => add(frame.image));
  project.characters.forEach(character => add(character.image));
  project.moodboards.forEach(board => board.items.forEach(item => add(item.image)));
  const audioPaths = options.audio ? [...new Set(project.frames.flatMap(frame => (frame.audio || []).map(clip => clip.src)))] : [];
  const total = imagePaths.size + audioPaths.length;
  let done = 0;

  const images = new Map<string, string>();
  await mapLimit([...imagePaths], 6, async path => {
    images.set(path, await embedImage(path, options));
    onProgress(++done, total, "Embedding images");
  });
  const audio: Record<string, string> = {};
  await mapLimit(audioPaths, 6, async path => {
    audio[path] = await toDataUri(await fetchBlob(path));
    onProgress(++done, total, "Embedding dialogue");
  });

  const swap = (value?: string) => (value ? images.get(value) || value : value);
  return {
    ...project,
    coverImage: swap(project.coverImage) as string,
    frames: project.frames.map(frame => ({ ...frame, image: swap(frame.image) as string })),
    characters: project.characters.map(character => ({ ...character, image: swap(character.image) })),
    moodboards: project.moodboards.map(board => ({ ...board, items: board.items.map(item => ({ ...item, image: swap(item.image) as string })) })),
    reel: {
      format: "playframe-reel", version: 1, generatedAt: new Date().toISOString(),
      note: "Self-contained: images are embedded as data URIs in the project fields, dialogue clips are embedded under audio keyed by their app path. Importing this file as a project keeps the images; dialogue stays linked by path.",
      images: { count: images.size, maxWidth: options.width || "original" }, audio,
    },
  };
}
