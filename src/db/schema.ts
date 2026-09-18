// Keep the schema entrypoint present so models can define tables and run
// `npx drizzle-kit push` without bootstrapping Drizzle config first.
import { pgTable, uuid, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import type { Scene, StoryFrame, ProjectNote, Character, BrainstormNode, Act, MoodBoard } from "@/lib/types";

export const filmProjects = pgTable("film_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull().default(""),
  genre: varchar("genre", { length: 80 }).notNull().default("Drama"),
  format: varchar("format", { length: 80 }).notNull().default("Short film"),
  status: varchar("status", { length: 80 }).notNull().default("In development"),
  coverImage: text("cover_image").notNull().default("/images/coastal-road.jpg"),
  acts: jsonb("acts").$type<Act[]>().notNull().default([]),
  scenes: jsonb("scenes").$type<Scene[]>().notNull().default([]),
  frames: jsonb("frames").$type<StoryFrame[]>().notNull().default([]),
  script: text("script").notNull().default(""),
  notes: jsonb("notes").$type<ProjectNote[]>().notNull().default([]),
  moodboards: jsonb("moodboards").$type<MoodBoard[]>().notNull().default([]),
  characters: jsonb("characters").$type<Character[]>().notNull().default([]),
  brainstorm: jsonb("brainstorm").$type<BrainstormNode[]>().notNull().default([]),
  shareId: uuid("share_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
