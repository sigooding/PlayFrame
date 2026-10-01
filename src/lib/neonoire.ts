import bundle from "../../public/projects/neonoire-opening.json";
import type { FilmProject } from "./types";
import { validatePatch } from "./validation";

// Generated from the revised final screenplay (102 active scenes, all 297 shots pictured in scene order)
// and the numbered shot boards by npm run build:neonoire;
// verify:neonoire checks the screenplay pages, the schema, the shot boards and the keyframes.
const project = bundle as FilmProject;
validatePatch(project as unknown as Record<string, unknown>);

// Database timestamps are assigned on insertion, not copied from the portable JSON's strings.
export const neonoireProject: Omit<FilmProject, "createdAt" | "updatedAt" | "shareId"> = {
  id: project.id,
  title: project.title,
  description: project.description,
  genre: project.genre,
  format: project.format,
  status: project.status,
  coverImage: project.coverImage,
  acts: project.acts,
  scenes: project.scenes,
  frames: project.frames,
  script: project.script,
  notes: project.notes,
  characters: project.characters,
  brainstorm: project.brainstorm,
  moodboards: project.moodboards,
};
