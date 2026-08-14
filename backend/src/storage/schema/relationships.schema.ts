import { sql } from "drizzle-orm";
import { check, index, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { learningModules, lessons } from "./content.schema";
import { users } from "./users.schema";

export const userFriends = pgTable(
  "user_friends",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    friendId: text("friend_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.friendId] }),
    index("user_friends_friend_id_idx").on(table.friendId),
    check("user_friends_not_self", sql`${table.userId} <> ${table.friendId}`),
  ],
);

export const userLessonCompletions = pgTable(
  "user_lesson_completions",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.lessonId] }),
    index("user_lesson_completions_lesson_id_idx").on(table.lessonId),
  ],
);

export const lessonRelatedExercises = pgTable(
  "lesson_related_exercises",
  {
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    learningModuleId: text("learning_module_id").notNull().references(() => learningModules.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.lessonId, table.learningModuleId] }),
    index("lesson_related_exercises_module_id_idx").on(table.learningModuleId),
  ],
);
