import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/projects";

export async function GET() {
  try { return NextResponse.json(await listProjects()); }
  catch (error) { console.error("List projects:", error); return NextResponse.json({ error: "We couldn't load your projects. Please try again." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (typeof data.title !== "string" || !data.title.trim() || data.title.length > 180) return NextResponse.json({ error: "Enter a project title (up to 180 characters)." }, { status: 400 });
    for (const key of ["description", "genre", "format", "template"]) {
      if (data[key] !== undefined && (typeof data[key] !== "string" || data[key].length > (key === "description" ? 20000 : 80))) return NextResponse.json({ error: `Invalid ${key}.` }, { status: 400 });
    }
    return NextResponse.json(await createProject({ title: data.title.trim(), description: data.description, genre: data.genre, format: data.format, template: data.template }), { status: 201 });
  } catch (error) { console.error("Create project:", error); return NextResponse.json({ error: "We couldn't create your project. Please try again." }, { status: 500 }); }
}
