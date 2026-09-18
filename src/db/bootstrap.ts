import { sql } from "drizzle-orm";
import { db } from "@/db";

let ready: Promise<void> | null = null;

/**
 * Creates the film_projects table (and any columns added in later versions) if they are missing.
 * Runs once per server process, so a fresh clone works with nothing more than a DATABASE_URL.
 * Idempotent and safe to run against an existing database.
 */
export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "film_projects" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "title" varchar(180) NOT NULL,
          "description" text DEFAULT '' NOT NULL,
          "genre" varchar(80) DEFAULT 'Drama' NOT NULL,
          "format" varchar(80) DEFAULT 'Short film' NOT NULL,
          "status" varchar(80) DEFAULT 'In development' NOT NULL,
          "cover_image" text DEFAULT '/images/coastal-road.jpg' NOT NULL,
          "acts" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "scenes" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "frames" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "script" text DEFAULT '' NOT NULL,
          "notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "moodboards" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "characters" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "brainstorm" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "share_id" uuid,
          "created_at" timestamptz DEFAULT now() NOT NULL,
          "updated_at" timestamptz DEFAULT now() NOT NULL,
          CONSTRAINT "film_projects_share_id_unique" UNIQUE ("share_id")
        )
      `);
      // Columns introduced after the first release — harmless if they already exist.
      for (const column of ["acts", "characters", "brainstorm", "moodboards"]) {
        await db.execute(sql.raw(`ALTER TABLE "film_projects" ADD COLUMN IF NOT EXISTS "${column}" jsonb DEFAULT '[]'::jsonb NOT NULL`));
      }
    })().catch(error => { ready = null; throw error; });
  }
  return ready;
}
