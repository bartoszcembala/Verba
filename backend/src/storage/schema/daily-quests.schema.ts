import { check, date, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.schema";

export type DailyQuestKey = "study_time" | "learn_words" | "daily_quiz" | "complete_lesson";

export const dailyQuestProgress = pgTable(
  "daily_quest_progress",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    questKey: text("quest_key").$type<DailyQuestKey>().notNull(),
    progress: integer("progress").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("daily_quest_progress_user_day_key_unique").on(table.userId, table.day, table.questKey),
    index("daily_quest_progress_user_day_idx").on(table.userId, table.day),
    check("daily_quest_progress_non_negative", sql`${table.progress} >= 0`),
  ],
);

export type DailyQuestProgressRow = typeof dailyQuestProgress.$inferSelect;
