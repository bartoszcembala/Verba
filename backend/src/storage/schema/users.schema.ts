import { boolean, doublePrecision, jsonb, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { LatestActivity, QuizState, StudyTimeEntry } from "./types";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export type UserRole = (typeof userRole.enumValues)[number];

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("user"),
    latestActivity: jsonb("latest_activity").$type<LatestActivity>().notNull().default([]),
    streak: jsonb("streak").$type<string[]>().notNull().default([]),
    timeSpentLearning: jsonb("time_spent_learning").$type<StudyTimeEntry[]>().notNull().default([]),
    premium: boolean("premium").notNull().default(false),
    exp: doublePrecision("exp").notNull().default(0),
    avatar: text("avatar").notNull().default("1"),
    quiz: jsonb("quiz").$type<QuizState>().notNull().default({ date: "", finished: false }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
