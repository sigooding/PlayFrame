import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";
import { isUuid } from "@/lib/validation";
import { AnimaticError, cancelAnimaticJob, getAnimaticJob } from "@/lib/animatic-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string; jobId: string }> };

async function status(context: Context, cancel = false) {
  const { id, jobId } = await context.params;
  if (!isUuid(id) || !isUuid(jobId)) return NextResponse.json({ error: "Export not found." }, { status: 404 });
  try {
    if (!(await getProject(id))) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    const job = cancel ? await cancelAnimaticJob(id, jobId) : await getAnimaticJob(id, jobId);
    return NextResponse.json(job, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AnimaticError ? error.message : "Unable to load the export." }, { status: error instanceof AnimaticError ? error.status : 500 });
  }
}
export async function GET(_request: Request, context: Context) { return status(context); }
export async function DELETE(_request: Request, context: Context) { return status(context, true); }
