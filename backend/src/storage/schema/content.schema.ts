import { integer, jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { WordPair } from "./types";

export const learningModules = pgTable(
  "learning_modules",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    title: text("title").notNull(),
    displayName: text("display_name").notNull(),
    words: jsonb("words").$type<WordPair[]>().notNull().default([]),
    level: text("level"),
  },
  (table) => [
    uniqueIndex("learning_modules_title_unique").on(table.title),
    uniqueIndex("learning_modules_display_name_unique").on(table.displayName),
  ],
);

export const lessons = pgTable(
  "lessons",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    title: text("title").notNull(),
    number: integer("number").notNull(),
    displayTitle: text("display_title").notNull(),
    html: text("html").notNull(),
    type: text("type"),
    level: text("level"),
  },
  (table) => [uniqueIndex("lessons_title_unique").on(table.title)],
);

export type LessonRow = typeof lessons.$inferSelect;
