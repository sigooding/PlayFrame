import { NextResponse } from "next/server";
import { openHangarProject } from "@/lib/projects";

/** Explicit opt-in for an existing workspace. Repeated clicks never overwrite a user's edits. */
export async function POST() {
  try {
    return NextResponse.json(await openHangarProject());
  } catch (error) {
    console.error("Open the cold-open workspace:", error);
    return NextResponse.json({ error: "The cold-open workspace couldn't be opened. Please try again." }, { status: 500 });
  }
}
