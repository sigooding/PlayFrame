import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";
import { isUuid } from "@/lib/validation";
import { parseAnimaticOptions } from "@/lib/animatic-options";
import { AnimaticError, startAnimaticJob } from "@/lib/animatic-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Rendering needs FFmpeg and a disk that outlives one request: a serverless host (Vercel) has neither.
  if (process.env.VERCEL) return NextResponse.json({ error: "MP4 export can't run on Vercel (no FFmpeg, and each request may land on a different instance). Run the app on your own machine or a server with FFmpeg (npm run build && npm start), or use npm run animatic:neonoire." }, { status: 501 });
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  try {
    const project = await getProject(id);
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    let options;
    try { options = parseAnimaticOptions(await request.json(), project); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid export settings." }, { status: 400 }); }
    const job = await startAnimaticJob(project, options);
    return NextResponse.json(job, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AnimaticError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Animatic export:", error);
    return NextResponse.json({ error: "The animatic could not be started. Please try again." }, { status: 500 });
  }
}
