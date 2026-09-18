import { NextResponse } from "next/server";
import { deleteProject, getProject, listProjects, updateProject } from "@/lib/projects";
import { isUuid, validatePatch } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  try {
    const project = await getProject(id);
    return project ? NextResponse.json(project) : NextResponse.json({ error: "Project not found." }, { status: 404 });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Unable to load project." }, { status: 500 }); }
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  try {
    const data = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return NextResponse.json({ error: "Invalid project details." }, { status: 400 });
    let patch;
    try { patch = validatePatch(data); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid details." }, { status: 400 }); }
    const project = await updateProject(id, patch);
    return project ? NextResponse.json(project) : NextResponse.json({ error: "Project not found." }, { status: 404 });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Your changes couldn't be saved. Please try again." }, { status: 500 }); }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  try {
    if ((await listProjects()).length <= 1) return NextResponse.json({ error: "Keep at least one project in your workspace. You can rename it or start a new one." }, { status: 400 });
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Unable to delete project." }, { status: 500 }); }
}
