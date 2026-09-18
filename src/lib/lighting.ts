import type { Lighting } from "./types";

export interface LightingGuideEntry {
  image: string;
  /** gradient shown in its place if the photograph is not on disk */
  swatch: string;
  summary: string;
  useFor: string;
  /** written into the AI video prompts */
  prompt: string;
}

export const lightingGuide: Record<Lighting, LightingGuideEntry> = {
  "Natural daylight": {
    image: "/images/lighting/natural-daylight.jpg",
    swatch: "linear-gradient(135deg,#f2f4e8,#dfe6d3 58%,#c9d5c2)",
    summary: "Even, unbiased light with soft grounded shadows.",
    useFor: "Honest coverage, daylight interiors, a world observed not performed.",
    prompt: "natural daylight, even unbiased exposure, soft grounded shadows, true skin tones",
  },
  "Golden hour": {
    image: "/images/lighting/golden-hour.jpg",
    swatch: "linear-gradient(135deg,#f7e2b6,#e8b567 55%,#b9834a)",
    summary: "Low warm sun, long shadows, honeyed skin tones.",
    useFor: "Nostalgia, romance, the last scene of the day.",
    prompt: "golden hour light, low warm sun near the horizon, long raking shadows, warm rim light and amber haze",
  },
  "Blue hour": {
    image: "/images/lighting/blue-hour.jpg",
    swatch: "linear-gradient(135deg,#c9d6e8,#8fa3c4 55%,#4c5f80)",
    summary: "Cool twilight after sunset, before the lamps take over.",
    useFor: "Melancholy, quiet transitions, coastlines and streets at dusk.",
    prompt: "blue hour light, deep blue ambient twilight, cool key light with faint warm practical accents",
  },
  "Overcast soft": {
    image: "/images/lighting/overcast-soft.jpg",
    swatch: "linear-gradient(135deg,#e7eae1,#cdd3cb 60%,#aab2ab)",
    summary: "A flat cloud ceiling: no shadows, gentle falloff.",
    useFor: "Grey days, understated drama, continuity that cuts together.",
    prompt: "overcast soft light, flat cloud ceiling, shadowless wraparound illumination, desaturated cool tones",
  },
  "Low key": {
    image: "/images/lighting/low-key.jpg",
    swatch: "linear-gradient(135deg,#4b4f45,#22261f 60%,#0d0f0c)",
    summary: "Mostly darkness, one source carving out the subject.",
    useFor: "Threat, secrecy, a confession we can barely see.",
    prompt: "low key lighting, deep blacks and withheld detail, a single hard side light, high contrast chiaroscuro",
  },
  "High key": {
    image: "/images/lighting/high-key.jpg",
    swatch: "linear-gradient(135deg,#fbfaf3,#f0f0e4 60%,#e2e4d6)",
    summary: "Bright, airy, almost shadowless and pale.",
    useFor: "Comedy, hope, memory, a room that feels safe.",
    prompt: "high key lighting, bright airy near-shadowless exposure, luminous pale tones, soft even fill",
  },
  "Practical night": {
    image: "/images/lighting/practical-night.jpg",
    swatch: "linear-gradient(135deg,#3a3a30,#7a5a2c 45%,#0c0e10)",
    summary: "Only what lives in the scene: lamps, fires, screens.",
    useFor: "Night interiors, real locations, period detail, cold opens.",
    prompt: "night scene lit by practical sources only, warm pools of lamplight falling into darkness, deep shadow",
  },
  "Backlit silhouette": {
    image: "/images/lighting/backlit-silhouette.jpg",
    swatch: "linear-gradient(135deg,#2b2f2c,#8d8a6f 62%,#f0e3bd)",
    summary: "The light sits behind them: shape over detail.",
    useFor: "Departures, secrecy, a figure on the horizon.",
    prompt: "strong backlight, subject rendered as a near-black silhouette with a glowing rim, hazy flare, veiled contrast",
  },
};

/** Falls back to a plain description if a lighting is ever set outside the library. */
export const lightingPrompt = (lighting: Lighting | undefined) => (lighting ? lightingGuide[lighting]?.prompt || `${lighting.toLowerCase()} lighting` : "");

export const lightingImage = (lighting: Lighting | undefined) => (lighting ? lightingGuide[lighting]?.image || "" : "");
