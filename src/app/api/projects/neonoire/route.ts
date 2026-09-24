import { NextResponse } from "next/server";
import { openNeonoireProject } from "@/lib/projects";

/**
 * Explicit opt-in for the NEONOIRE opening-scenes workspace — the same contract the series
 * workspace has: the bundle is inserted only if it is absent, and re-opening it never overwrites
 * a writer's edits. Deleting it is respected until it is deliberately opened again.
 */
export async function POST() {
  try {
    return NextResponse.json(await openNeonoireProject());
  } catch (error) {
    console.error("Open NEONOIRE workspace:", error);
    return NextResponse.json({ error: "The NEONOIRE workspace couldn't be opened. Please try again." }, { status: 500 });
  }
}
