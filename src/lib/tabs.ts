/**
 * The project sections, in the order they appear in the tab bar. Kept free of JSX and of browser
 * APIs so the server (which resolves `?tab=`) and the client share exactly one list.
 */
export const PROJECT_TABS = [
  { name: "Overview", slug: "overview" },
  { name: "Screenplay", slug: "screenplay" },
  { name: "Characters", slug: "characters" },
  { name: "Relationships", slug: "relationships" },
  { name: "Storyboard", slug: "storyboard" },
  { name: "Prompt Studio", slug: "prompt-studio" },
  { name: "Shot list", slug: "shot-list" },
  { name: "Notes", slug: "notes" },
  { name: "Brainstorm", slug: "brainstorm" },
  { name: "Mood boards", slug: "mood-boards" },
] as const;

export type ProjectTabName = (typeof PROJECT_TABS)[number]["name"];

export const tabSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const tabByName = (wanted?: string) => PROJECT_TABS.find(tab => tab.slug === wanted?.toLowerCase() || tab.name.toLowerCase() === wanted?.toLowerCase());
