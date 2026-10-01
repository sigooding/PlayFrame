import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";
import { isUuid } from "@/lib/validation";
import { AnimaticError, animaticDownload } from "@/lib/animatic-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; jobId: string }> }) {
  const { id, jobId } = await params;
  if (!isUuid(id) || !isUuid(jobId)) return NextResponse.json({ error: "Export not found." }, { status: 404 });
  try {
    if (!(await getProject(id))) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    const file = await animaticDownload(id, jobId);
    const stream = Readable.toWeb(createReadStream(file.path)) as ReadableStream<Uint8Array>;
    return new Response(stream, { headers: {
      "Content-Type": "video/mp4", "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AnimaticError ? error.message : "Unable to download the export." }, { status: error instanceof AnimaticError ? error.status : 500 });
  }
}
