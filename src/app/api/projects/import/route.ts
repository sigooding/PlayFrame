import { NextResponse } from "next/server";
import { importProject } from "@/lib/projects";
import { sanitizeImport } from "@/lib/validation";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    const text = await request.text();
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "That file isn't valid JSON. Export a project backup from frame. and upload that file." }, { status: 400 });
  }
  // Accept both a bare project object and the wrapper used by older backups.
  const payload = raw && typeof raw === "object" && "project" in (raw as Record<string, unknown>) ? (raw as { project: unknown }).project : raw;
  let clean;
  try {
    clean = sanitizeImport(payload);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "This file couldn't be imported." }, { status: 400 });
  }
  try {
    const created = await importProject(clean);
    return NextResponse.json({ ...created, imported: { scenes: clean.scenes?.length || 0, frames: clean.frames?.length || 0, characters: clean.characters?.length || 0, notes: clean.notes?.length || 0, ideas: clean.brainstorm?.length || 0, boards: clean.moodboards?.length || 0 } }, { status: 201 });
  } catch (error) {
    console.error("Import project:", error);
    return NextResponse.json({ error: "The project couldn't be imported. Please try again." }, { status: 500 });
  }
}
