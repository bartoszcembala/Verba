import { jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { WordPair } from "./types";
import { learningModules } from "./content.schema";
import { users } from "./users.schema";

export const progress = pgTable(
  "progress",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    learningModuleId: text("learning_module_id").notNull().references(() => learningModules.id, { onDelete: "cascade" }),
    learned: jsonb("learned").$type<WordPair[]>().notNull().default([]),
  },
  (table) => [uniqueIndex("progress_user_module_unique").on(table.userId, table.learningModuleId)],
);
