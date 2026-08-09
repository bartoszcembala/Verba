import { jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { WordPair } from "./types";

export const progress = pgTable(
  "progress",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    userName: text("user_name").notNull(),
    moduleName: text("module_name").notNull(),
    learned: jsonb("learned").$type<WordPair[]>().notNull().default([]),
  },
  (table) => [uniqueIndex("progress_user_module_unique").on(table.userName, table.moduleName)],
);
