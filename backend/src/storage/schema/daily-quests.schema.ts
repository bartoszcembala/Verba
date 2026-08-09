import { jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { DailyQuestItem } from "./types";

export const dailyQuests = pgTable(
  "daily_quests",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    userId: text("user_id").notNull(),
    day: text("day").notNull(),
    quests: jsonb("quests").$type<DailyQuestItem[]>().notNull().default([]),
  },
  (table) => [uniqueIndex("daily_quests_user_unique").on(table.userId)],
);
