import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require("postgres");
import { DEMO_ACCOUNT_EMAIL } from "../src/common/auth/demo-account";
import {
  dailyQuestProgress,
  learningModules,
  lessons,
  progress,
  userLessonCompletions,
  users,
} from "../src/storage/schema";

const DEMO_PASSWORD = "12345678";

const databaseUrl = process.env.PRODUCTION_DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL or PRODUCTION_DATABASE_URL is required");
  process.exit(1);
}

function warsawDate(daysAgo = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(date);
}

async function main() {
  const hostname = new URL(databaseUrl).hostname;
  const client = postgres(databaseUrl, {
    max: 1,
    ...(hostname.endsWith(".render.com") ? { ssl: "require" as const } : {}),
  });
  const db = drizzle(client);

  try {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    const streak = [3, 2, 1, 0].map(warsawDate).reverse();
    const timeSpentLearning = [
      { date: warsawDate(6), value: 8 },
      { date: warsawDate(5), value: 14 },
      { date: warsawDate(4), value: 11 },
      { date: warsawDate(3), value: 18 },
      { date: warsawDate(2), value: 16 },
      { date: warsawDate(1), value: 22 },
      { date: warsawDate(), value: 10 },
    ];

    await db.transaction(async (transaction) => {
      const [firstLesson] = await transaction
        .select({ title: lessons.title, displayTitle: lessons.displayTitle })
        .from(lessons)
        .orderBy(lessons.number)
        .limit(1);

      const [existing] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, DEMO_ACCOUNT_EMAIL))
        .limit(1);

      const demoValues = {
        name: "Demo Learner",
        email: DEMO_ACCOUNT_EMAIL,
        passwordHash,
        role: "user" as const,
        latestActivity: firstLesson ? [[firstLesson.title, firstLesson.displayTitle]] : [],
        streak,
        timeSpentLearning,
        premium: true,
        exp: 260,
        avatar: "3",
        quiz: { date: "", finished: false },
        updatedAt: new Date(),
      };

      const [demoUser] = existing
        ? await transaction
          .update(users)
          .set(demoValues)
          .where(eq(users.id, existing.id))
          .returning({ id: users.id })
        : await transaction
          .insert(users)
          .values(demoValues)
          .returning({ id: users.id });

      await transaction.delete(progress).where(eq(progress.userId, demoUser.id));
      await transaction
        .delete(userLessonCompletions)
        .where(eq(userLessonCompletions.userId, demoUser.id));
      await transaction
        .delete(dailyQuestProgress)
        .where(eq(dailyQuestProgress.userId, demoUser.id));

      const moduleRows = await transaction
        .select({ id: learningModules.id, words: learningModules.words })
        .from(learningModules)
        .orderBy(learningModules.title)
        .limit(3);

      for (const moduleRow of moduleRows) {
        const learned = moduleRow.words.slice(0, 5);
        if (learned.length > 0) {
          await transaction.insert(progress).values({
            userId: demoUser.id,
            learningModuleId: moduleRow.id,
            learned,
          });
        }
      }

      const lessonRows = await transaction
        .select({ id: lessons.id })
        .from(lessons)
        .orderBy(lessons.number)
        .limit(3);
      if (lessonRows.length > 0) {
        await transaction.insert(userLessonCompletions).values(
          lessonRows.map(({ id }) => ({ userId: demoUser.id, lessonId: id })),
        );
      }

      await transaction.insert(dailyQuestProgress).values([
        { userId: demoUser.id, day: warsawDate(), questKey: "study_time", progress: 10 },
        { userId: demoUser.id, day: warsawDate(), questKey: "learn_words", progress: 5 },
        { userId: demoUser.id, day: warsawDate(), questKey: "daily_quiz", progress: 0 },
        { userId: demoUser.id, day: warsawDate(), questKey: "complete_lesson", progress: 1 },
      ]);
    });

    console.log(`Demo account seeded: ${DEMO_ACCOUNT_EMAIL}`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

void main();
