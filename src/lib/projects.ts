import { db } from "@/db";
import { ensureSchema } from "@/db/bootstrap";
import { filmProjects } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { starterProjects } from "./seed";
import { raptureProject } from "./rapture";
import { neonoireProject } from "./neonoire";
import { deliveredHangarImageUpdates, hangarProject } from "./hangar";
import type { FilmProject, ProjectPatch } from "./types";
import type { sanitizeImport } from "./validation";
import { bundledFrameUpdates } from "./bundle-refresh";

function serialize(row: typeof filmProjects.$inferSelect): FilmProject {
  return { ...row, moodboards: row.moodboards ?? [], createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

export async function listProjects() {
  await ensureSchema();
  let rows = await db.select().from(filmProjects).orderBy(asc(filmProjects.createdAt), asc(filmProjects.id));
  if (rows.length === 0) {
    // Single-row inserts also work with the local JSON adapter, which does not implement batch VALUES.
    for (const project of starterProjects) {
      await db.insert(filmProjects).values(project).onConflictDoNothing();
    }
    rows = await db.select().from(filmProjects).orderBy(asc(filmProjects.createdAt), asc(filmProjects.id));
  }
  return Promise.all(rows.map(row => refreshBundledProject(serialize(row))));
}

/** Opt-in workspace for the animated cold open; never replaces edits (the second insert is a no-op). */
export async function openHangarProject() {
  await ensureSchema();
  await db.insert(filmProjects).values(hangarProject).onConflictDoNothing();
  const project = await getProject(hangarProject.id);
  if (!project) throw new Error("The cold-open project was not created.");
  return project;
}

/** Opt-in for existing databases; never reseed on every page load or replace edited material. */
export async function openRaptureProject() {
  await ensureSchema();
  await db.insert(filmProjects).values(raptureProject).onConflictDoNothing();
  const project = await getProject(raptureProject.id);
  if (!project) throw new Error("The series project was not created.");
  return project;
}

/** Delivered images and default-order migrations never replace a writer's screenplay or shot edits. */
async function refreshNeonoireFrames(existing: FilmProject): Promise<FilmProject> {
  if (existing.id !== neonoireProject.id) return existing;
  const patch = bundledFrameUpdates(existing, neonoireProject);
  if (!patch) return existing;
  const [row] = await db.update(filmProjects).set({ ...patch, updatedAt: new Date() }).where(eq(filmProjects.id, existing.id)).returning();
  return row ? serialize(row) : existing;
}

/** Add newly delivered Hangar pictures only to untouched missing-image cards; custom work survives. */
async function refreshHangarImages(existing: FilmProject): Promise<FilmProject> {
  if (existing.id !== hangarProject.id) return existing;
  const patch = deliveredHangarImageUpdates(existing);
  if (!patch) return existing;
  const [row] = await db.update(filmProjects).set({ ...patch, updatedAt: new Date() }).where(eq(filmProjects.id, existing.id)).returning();
  return row ? serialize(row) : existing;
}

async function refreshBundledProject(existing: FilmProject): Promise<FilmProject> {
  return refreshNeonoireFrames(await refreshHangarImages(existing));
}

/** Opt-in workspace; subsequent reads fill untouched placeholders and migrate only the old default order. */
export async function openNeonoireProject() {
  await ensureSchema();
  await db.insert(filmProjects).values(neonoireProject).onConflictDoNothing();
  const existing = await getProject(neonoireProject.id);
  if (!existing) throw new Error("The NEONOIRE project was not created.");
  return existing;
}

export async function getProject(id: string) {
  await ensureSchema();
  const [row] = await db.select().from(filmProjects).where(eq(filmProjects.id, id)).limit(1);
  return row ? refreshBundledProject(serialize(row)) : null;
}

export async function getSharedProject(token: string) {
  await ensureSchema();
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
  const [row] = await db.select().from(filmProjects).where(eq(filmProjects.shareId, token)).limit(1);
  return row ? refreshBundledProject(serialize(row)) : null;
}

export async function createProject(input: { title: string; description?: string; genre?: string; format?: string; template?: string }) {
  await ensureSchema();
  const template = input.template === "short-film";
  const acts = [
    { id: crypto.randomUUID(), title: "Act I — Setup", description: "Introduce the world, the character, and what they want." },
    { id: crypto.randomUUID(), title: "Act II — Confrontation", description: "Obstacles rise. The character is tested and changed." },
    { id: crypto.randomUUID(), title: "Act III — Resolution", description: "The final choice, and what it costs." },
  ];
  const [row] = await db.insert(filmProjects).values({
    title: input.title,
    description: input.description || "Every great film starts with an idea.",
    genre: input.genre || "Drama",
    format: input.format || "Short film",
    acts: template ? acts : [],
    scenes: template ? [
      { id: crypto.randomUUID(), title: "The opening", location: "EXT. LOCATION", time: "DAY", description: "Establish the world and introduce your character.", actId: acts[0].id },
      { id: crypto.randomUUID(), title: "The turning point", location: "INT. LOCATION", time: "DAY", description: "Something changes. What does your character want?", actId: acts[1].id },
      { id: crypto.randomUUID(), title: "The resolution", location: "EXT. LOCATION", time: "SUNSET", description: "Bring the emotional journey full circle.", actId: acts[2].id },
    ] : [],
    script: `${input.title.toUpperCase()}\n\nWritten by\n\n\nFADE IN:\n\n1. EXT. LOCATION - DAY\n\nYour story begins here.\n`,
  }).returning();
  return serialize(row);
}

export async function updateProject(id: string, patch: ProjectPatch) {
  await ensureSchema();
  const [row] = await db.update(filmProjects).set({ ...patch, updatedAt: new Date() }).where(eq(filmProjects.id, id)).returning();
  return row ? serialize(row) : null;
}

export async function deleteProject(id: string) {
  await ensureSchema();
  await db.delete(filmProjects).where(eq(filmProjects.id, id));
}

export async function shareProject(id: string, enabled: boolean) {
  await ensureSchema();
  const existing = await getProject(id);
  if (!existing) return null;
  const [row] = await db.update(filmProjects).set({ shareId: enabled ? existing.shareId || crypto.randomUUID() : null, updatedAt: new Date() }).where(eq(filmProjects.id, id)).returning();
  return serialize(row);
}

/** Creates a project from an uploaded project file (already sanitized on the way in). */
export async function importProject(clean: ReturnType<typeof sanitizeImport>) {
  await ensureSchema();
  const [row] = await db.insert(filmProjects).values({
    title: clean.title,
    description: clean.description || "Imported from a project file.",
    genre: clean.genre || "Drama",
    format: clean.format || "Short film",
    status: clean.status || "In development",
    coverImage: clean.coverImage || "/images/coastal-road.jpg",
    script: clean.script || "",
    acts: clean.acts || [],
    scenes: clean.scenes || [],
    frames: clean.frames || [],
    notes: clean.notes || [],
    characters: clean.characters || [],
    brainstorm: clean.brainstorm || [],
    moodboards: clean.moodboards || [],
  }).returning();
  return serialize(row);
}
