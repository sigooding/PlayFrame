import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSchema } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    await ensureSchema();
    const [{ count }] = (await db.execute(sql`select count(*)::int as count from film_projects`)).rows as { count: number }[];
    return Response.json({ ok: true, database: "connected", schema: "ready", projects: count });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
