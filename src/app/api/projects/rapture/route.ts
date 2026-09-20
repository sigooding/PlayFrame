import { NextResponse } from "next/server";
import { openRaptureProject } from "@/lib/projects";

/** Explicit opt-in for an existing workspace. Repeated clicks never overwrite a user's edits. */
export async function POST() {
  try {
    return NextResponse.json(await openRaptureProject());
  } catch (error) {
    console.error("Open Rapture workspace:", error);
    return NextResponse.json({ error: "The series workspace couldn't be opened. Please try again." }, { status: 500 });
  }
}
