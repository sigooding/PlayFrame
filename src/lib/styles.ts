// The visual style library. A style steers how every AI model should render the shot —
// its look, its finish, and (just as importantly) what must NOT go in the negative prompt.
//
// Each entry carries an example image under public/images/styles/. If one is missing at
// runtime the picker falls back to `swatch`, mirroring the lighting library's behaviour.
import type { FilmProject } from "./types";

export interface VisualStyleEntry {
  id: string;
  name: string;
  /** example image in public/images/styles/ */
  image: string;
  /** gradient shown if the example image is not on disk */
  swatch: string;
  summary: string;
  useFor: string;
  /** look tokens written into the positive prompt */
  prompt: string;
  /** render/finish descriptor used by the image models (replaces the default photoreal finish) */
  finish: string;
  /** true when the style should keep "photorealistic / 35mm" language and its negatives */
  photoreal: boolean;
  /** negative tokens that would fight this style and must be dropped from base negatives */
  conflicts: string[];
  /** extra negative tokens that protect this style from collapsing back to realism */
  negative: string;
}

export const DEFAULT_STYLE_ID = "cinematic";

export const VISUAL_STYLES: readonly VisualStyleEntry[] = [
  {
    id: "cinematic",
    name: "Cinematic Realistic",
    image: "/images/styles/cinematic-realistic.jpg",
    swatch: "linear-gradient(135deg,#2b3440,#4a5a6b 55%,#8fa3b8)",
    summary: "Photoreal 35mm film still with true-to-life texture and colour.",
    useFor: "The default look. Grounded drama, anything that must feel real.",
    prompt: "cinematic realism, photorealistic, natural light, shallow depth of field, true skin tones",
    finish: "photorealistic, shot on 35mm film, masterclass color grading, subtle film grain, natural skin textures, optical depth of field",
    photoreal: true,
    conflicts: [],
    negative: "",
  },
  {
    id: "anime",
    name: "Anime",
    image: "/images/styles/anime.jpg",
    swatch: "linear-gradient(135deg,#f8b26a,#c06b8e 55%,#5b4b8a)",
    summary: "Hand-drawn 2D cel shading, luminous painted skies.",
    useFor: "Heightened emotion, dreamlike sequences, stylised worlds.",
    prompt: "japanese anime style, hand-drawn 2d cel animation, crisp line art, flat cel shading, luminous painted sky",
    finish: "2d anime cel animation, clean line work, cel shading, vibrant anime color grade, studio-quality key visual",
    photoreal: false,
    conflicts: ["cartoon", "anime", "illustration"],
    negative: "photorealistic, live action, real photograph, 3d render, cgi",
  },
  {
    id: "comic",
    name: "Comic Book",
    image: "/images/styles/comic-book.jpg",
    swatch: "linear-gradient(135deg,#e8d33a,#c23b2e 55%,#1f2a44)",
    summary: "Inked graphic-novel panel with halftone shading.",
    useFor: "Punchy action, stylised violence, bold graphic storytelling.",
    prompt: "american comic book style, bold ink outlines, halftone dot shading, limited print palette, graphic novel inking",
    finish: "comic book illustration, heavy black inks, ben-day halftone dots, dynamic panel linework, printed color palette",
    photoreal: false,
    conflicts: ["cartoon", "anime", "illustration"],
    negative: "photorealistic, live action, real photograph, 3d render, smooth gradients",
  },
  {
    id: "animation-3d",
    name: "3D Animation",
    image: "/images/styles/animation-3d.jpg",
    swatch: "linear-gradient(135deg,#7fb2e5,#4a7bc8 55%,#2c4a80)",
    summary: "Stylised CGI feature render with soft rounded forms.",
    useFor: "Family-friendly tone, playful characters, animated features.",
    prompt: "stylized 3d animated feature style, soft rounded forms, subsurface scattering, plush material textures, feature-quality cgi lighting",
    finish: "3d animated feature render, stylized proportions, global illumination, soft cinematic cgi lighting, high-end render quality",
    photoreal: false,
    conflicts: ["3d render", "cartoon", "anime"],
    negative: "photorealistic, live action, real photograph, uncanny, flat 2d",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    image: "/images/styles/watercolor.jpg",
    swatch: "linear-gradient(135deg,#dce8ef,#9fb6c9 55%,#6d8aa5)",
    summary: "Soft wet-on-wet washes with paper texture.",
    useFor: "Memory, tenderness, dream and flashback passages.",
    prompt: "loose watercolor painting, wet-on-wet pigment blooms, soft bleeding edges, visible paper tooth, muted washes",
    finish: "traditional watercolor on paper, granulating pigment, soft edges, white reserves, delicate color washes",
    photoreal: false,
    conflicts: ["cartoon", "anime", "illustration", "3d render"],
    negative: "photorealistic, live action, hard edges, digital 3d, sharp vector lines",
  },
  {
    id: "film-noir",
    name: "Film Noir",
    image: "/images/styles/film-noir.jpg",
    swatch: "linear-gradient(135deg,#e8e8e8,#7a7a7a 45%,#0a0a0a)",
    summary: "High-contrast black and white, hard shadows.",
    useFor: "Mystery, moral ambiguity, period thrillers.",
    prompt: "classic film noir, black and white, high contrast chiaroscuro, hard single-source key light, deep shadow, silver halide grain",
    finish: "monochrome 35mm noir cinematography, crushed blacks, hard shadows, film grain, dramatic chiaroscuro",
    photoreal: true,
    conflicts: [],
    negative: "color, saturated color, cartoon, anime, 3d render",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    image: "/images/styles/cyberpunk.jpg",
    swatch: "linear-gradient(135deg,#120b2e,#7a1fa2 45%,#00c2d1)",
    summary: "Rain-slick neon in magenta and cyan.",
    useFor: "Near-future settings, tech-noir, night city stories.",
    prompt: "cyberpunk neon aesthetic, saturated magenta and cyan light, reflective wet surfaces, volumetric haze, anamorphic lens flare",
    finish: "cinematic cyberpunk grade, neon-lit night, reflective rain-slick surfaces, atmospheric haze, anamorphic flare",
    photoreal: true,
    conflicts: [],
    negative: "cartoon, anime, 3d render, daylight, flat lighting",
  },
  {
    id: "claymation",
    name: "Claymation",
    image: "/images/styles/claymation.jpg",
    swatch: "linear-gradient(135deg,#d8b98a,#b08968 55%,#7f5539)",
    summary: "Stop-motion clay with visible fingerprint texture.",
    useFor: "Whimsy, handmade charm, tactile children's worlds.",
    prompt: "stop-motion claymation, handcrafted plasticine figures, visible fingerprint texture, miniature practical set, macro depth of field",
    finish: "aardman-style stop motion, clay and plasticine textures, miniature diorama, warm practical studio lighting",
    photoreal: false,
    conflicts: ["3d render", "cartoon", "anime"],
    negative: "photorealistic, live action, cgi smoothness, digital 3d",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    image: "/images/styles/pixel-art.jpg",
    swatch: "linear-gradient(135deg,#1a1a2e,#3d5a80 50%,#ee6c4d)",
    summary: "Chunky 16-bit pixels with a dithered palette.",
    useFor: "Retro games, nostalgic tone, lo-fi charm.",
    prompt: "16-bit pixel art, chunky visible square pixels, limited dithered palette, hard-edged color banding, snes-era game background",
    finish: "retro pixel art, crisp pixel grid, dithering, limited color palette, no anti-aliasing",
    photoreal: false,
    conflicts: ["cartoon", "anime", "illustration", "3d render", "blurry"],
    negative: "photorealistic, live action, smooth gradients, anti-aliasing, 3d render",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    image: "/images/styles/oil-painting.jpg",
    swatch: "linear-gradient(135deg,#5c4632,#8a6642 50%,#c9a227)",
    summary: "Classical impasto brushwork on linen.",
    useFor: "Period pieces, painterly lyricism, gallery-grade stills.",
    prompt: "classical impasto oil painting, thick confident brushstrokes, palette knife texture, warm chiaroscuro glazing, rich earth pigments",
    finish: "traditional oil painting on linen, visible brushwork, chiaroscuro glazing, luminous old-master light, canvas texture",
    photoreal: false,
    conflicts: ["cartoon", "anime", "illustration", "3d render"],
    negative: "photorealistic, live action, digital 3d, flat color, photograph",
  },
] as const;

export function visualStyle(id?: string): VisualStyleEntry {
  return VISUAL_STYLES.find(s => s.id === id) || VISUAL_STYLES.find(s => s.id === DEFAULT_STYLE_ID)!;
}

/** The look line written into every prompt for the chosen style. */
export function stylePromptLine(project: FilmProject, entry: VisualStyleEntry): string {
  const genre = `${project.genre.toLowerCase()} ${project.format.toLowerCase()}`;
  const paletteNote = project.notes.find(n => /visual|look|style|palette|cinematograph/i.test(`${n.title} ${(n.tags || []).join(" ")}`));
  const palette = paletteNote ? (paletteNote.content || "").split(/(?<=[.!?])\s/).slice(0, 2).join(" ").replace(/[.!?]+$/, "").trim() : "";
  return `${genre}, ${entry.prompt}${palette ? `. ${palette}` : ""}`;
}

/** Strip negative tokens that would contradict the style, then add the style's own guards. */
export function negativeFor(base: string, entry: VisualStyleEntry): string {
  if (entry.photoreal && !entry.negative) return base;
  const kept = base
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .filter(tok => !entry.conflicts.some(c => tok.toLowerCase().includes(c)));
  const extra = entry.negative ? entry.negative.split(",").map(s => s.trim()).filter(Boolean) : [];
  const merged = [...kept, ...extra];
  // de-duplicate, preserving order
  return [...new Set(merged)].join(", ");
}
