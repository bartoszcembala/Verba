import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DEFAULT_QUESTS } from "../daily-quests/daily-quests.types";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { dailyQuestProgress, users, type DailyQuestKey, type UserRow } from "../storage/schema";
import { toPublicUser, type PublicUser, type UpdateUserInput } from "../users/users.types";
import type {
  CompleteDailyQuizInput,
  RecordActivityInput,
  RecordExerciseAnswerInput,
  RecordStudyTimeInput,
} from "./progression.types";

type ProgressionResult = {
  user: PublicUser;
  changed: boolean;
};

type QuestUpdate =
  | { key: DailyQuestKey; increment: number }
  | { key: DailyQuestKey; progress: number };

@Injectable()
export class ProgressionService {
  constructor(
    @Inject(DB) private readonly db: Database,
  ) {}

  recordActivity(userId: string, input: RecordActivityInput): Promise<PublicUser> {
    const path = input.path?.trim();
    const label = input.label?.trim();
    if (!path || !label) throw new BadRequestException("Activity path and label are required");

    return this.mutateUser(userId, (user) => ({
      latestActivity: [
        [path, label],
        ...user.latestActivity.filter(([activityPath]) => activityPath !== path),
      ].slice(0, 3),
    })).then(({ user }) => user);
  }

  touchStreak(userId: string): Promise<PublicUser> {
    return this.mutateUser(userId, (user) => {
      const today = this.today();
      return user.streak.includes(today) ? {} : { streak: [...user.streak, today] };
    }).then(({ user }) => user);
  }

  async recordStudyTime(userId: string, input: RecordStudyTimeInput): Promise<PublicUser> {
    if (!Number.isInteger(input.minutes) || input.minutes < 0 || input.minutes > 1440) {
      throw new BadRequestException("Minutes must be an integer between 0 and 1440");
    }

    const today = this.today();
    const result = await this.mutateUser(userId, (user) => {
      const current = user.timeSpentLearning.find((entry) => entry.date === today)?.value ?? 0;
      if (input.minutes <= current) return {};
      return {
        timeSpentLearning: [
          ...user.timeSpentLearning.filter((entry) => entry.date !== today),
          { date: today, value: input.minutes },
        ],
      };
    }, { key: "study_time", progress: input.minutes });
    return result.user;
  }

  async completeLesson(userId: string, lessonId: string): Promise<PublicUser> {
    const normalizedLessonId = lessonId.trim();
    if (!normalizedLessonId) throw new BadRequestException("Lesson id is required");

    const result = await this.mutateUser(userId, (user) => {
      if (user.finishedLessons.includes(normalizedLessonId)) return {};
      const streak = this.withToday(user.streak);
      return {
        streak,
        finishedLessons: [...user.finishedLessons, normalizedLessonId],
        exp: user.exp + this.reward(30, streak),
      };
    }, { key: "complete_lesson", increment: 1 });
    return result.user;
  }

  async recordCorrectExerciseAnswer(
    userId: string,
    input: RecordExerciseAnswerInput,
  ): Promise<PublicUser> {
    const result = await this.mutateUser(userId, (user) => {
      const streak = this.withToday(user.streak);
      return { streak, exp: user.exp + this.reward(10, streak) };
    }, input.learnedNewWord ? { key: "learn_words", increment: 1 } : undefined);
    return result.user;
  }

  async completeDailyQuiz(userId: string, input: CompleteDailyQuizInput): Promise<PublicUser> {
    if (
      !Number.isInteger(input.correctAnswers) ||
      !Number.isInteger(input.totalQuestions) ||
      input.totalQuestions !== 5 ||
      input.correctAnswers < 0 ||
      input.correctAnswers > input.totalQuestions
    ) {
      throw new BadRequestException("Invalid daily quiz result");
    }

    const today = this.today();
    const passed = input.correctAnswers >= 4;
    const result = await this.mutateUser(userId, (user) => {
      if (!passed || (user.quiz.finished && user.quiz.date === today)) return {};
      const streak = this.withToday(user.streak);
      return {
        streak,
        exp: user.exp + this.reward(30, streak),
        quiz: { finished: true, date: today },
      };
    }, { key: "daily_quiz", increment: 1 });
    return result.user;
  }

  private async mutateUser(
    userId: string,
    mutation: (user: UserRow) => UpdateUserInput,
    questUpdate?: QuestUpdate,
  ): Promise<ProgressionResult> {
    return this.db.transaction(async (transaction) => {
      const [user] = await transaction
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update");
      if (!user) throw new NotFoundException("User not found");

      const values = mutation(user);
      if (Object.keys(values).length === 0) return { user: toPublicUser(user), changed: false };

      const [updated] = await transaction
        .update(users)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      if (!updated) throw new NotFoundException("User not found");

      if (questUpdate) {
        const day = this.today();
        const definition = DEFAULT_QUESTS.find(({ key }) => key === questUpdate.key);
        if (!definition) throw new BadRequestException("Unknown daily quest");

        const [questRow] = await transaction
          .select()
          .from(dailyQuestProgress)
          .where(and(
            eq(dailyQuestProgress.userId, userId),
            eq(dailyQuestProgress.day, day),
            eq(dailyQuestProgress.questKey, questUpdate.key),
          ))
          .for("update");
        const requestedProgress = "progress" in questUpdate
          ? questUpdate.progress
          : (questRow?.progress ?? 0) + questUpdate.increment;
        const progress = Math.min(
          definition.toObtain,
          Math.max(questRow?.progress ?? 0, requestedProgress),
        );

        if (questRow) {
          await transaction
            .update(dailyQuestProgress)
            .set({ progress, updatedAt: new Date() })
            .where(eq(dailyQuestProgress.id, questRow.id));
        } else {
          await transaction.insert(dailyQuestProgress).values({
            userId,
            day,
            questKey: questUpdate.key,
            progress,
          });
        }
      }
      return { user: toPublicUser(updated), changed: true };
    });
  }

  private reward(baseXp: number, streak: string[]): number {
    return baseXp * (1 + this.currentStreak(streak) / 100);
  }

  private currentStreak(streak: string[]): number {
    const dates = new Set(streak);
    const cursor = new Date(`${this.today()}T12:00:00Z`);
    let count = 0;
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return count;
  }

  private withToday(streak: string[]): string[] {
    const today = this.today();
    return streak.includes(today) ? streak : [...streak, today];
  }

  private today(): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  }
}
