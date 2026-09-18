import { NextResponse } from "next/server";
import { shareProject } from "@/lib/projects";
import { isUuid } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  try {
    const { enabled } = await request.json();
    if (typeof enabled !== "boolean") return NextResponse.json({ error: "Choose a sharing setting." }, { status: 400 });
    const project = await shareProject(id, enabled);
    return project ? NextResponse.json(project) : NextResponse.json({ error: "Project not found." }, { status: 404 });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Unable to change sharing settings." }, { status: 500 }); }
}
