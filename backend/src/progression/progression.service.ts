import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DEFAULT_QUESTS } from "../daily-quests/daily-quests.types";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import {
  dailyQuestProgress,
  learningModules,
  lessons,
  progress,
  userLessonCompletions,
  users,
  type DailyQuestKey,
  type UserRow,
  type WordPair,
} from "../storage/schema";
import { UsersRepository } from "../users/users.repository";
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

type DbTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

@Injectable()
export class ProgressionService {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly usersRepository: UsersRepository,
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

    await this.db.transaction(async (transaction) => {
      const [user] = await transaction
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update");
      if (!user) throw new NotFoundException("User not found");

      const [lesson] = await transaction
        .select({ id: lessons.id })
        .from(lessons)
        .where(eq(lessons.id, normalizedLessonId))
        .limit(1);
      if (!lesson) throw new NotFoundException("Lesson not found");

      const [completion] = await transaction
        .select({ lessonId: userLessonCompletions.lessonId })
        .from(userLessonCompletions)
        .where(and(
          eq(userLessonCompletions.userId, userId),
          eq(userLessonCompletions.lessonId, normalizedLessonId),
        ))
        .limit(1);
      if (completion) return;

      const streak = this.withToday(user.streak);
      await transaction.insert(userLessonCompletions).values({ userId, lessonId: normalizedLessonId });
      await transaction
        .update(users)
        .set({ streak, exp: user.exp + this.reward(30, streak), updatedAt: new Date() })
        .where(eq(users.id, userId));
      await this.updateQuestInTransaction(transaction, userId, { key: "complete_lesson", increment: 1 });
    });
    return this.currentUser(userId);
  }

  async submitExerciseAnswer(
    userId: string,
    input: RecordExerciseAnswerInput,
  ): Promise<PublicUser> {
    const moduleName = input.moduleName?.trim();
    const word = input.word?.trim();
    const answer = input.answer?.trim();
    if (!moduleName || !word || !answer) {
      throw new BadRequestException("Module, word and answer are required");
    }

    await this.db.transaction(async (transaction) => {
      const [user] = await transaction
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update");
      if (!user) throw new NotFoundException("User not found");

      const [learningModule] = await transaction
        .select()
        .from(learningModules)
        .where(eq(learningModules.title, moduleName))
        .limit(1);
      if (!learningModule) throw new NotFoundException("Learning module not found");

      const canonicalPair = learningModule.words.find(([candidate]) => candidate === word);
      if (!canonicalPair || answer !== canonicalPair[0]) {
        throw new BadRequestException("Incorrect exercise answer");
      }

      const [userProgress] = await transaction
        .select()
        .from(progress)
        .where(and(
          eq(progress.userId, userId),
          eq(progress.learningModuleId, learningModule.id),
        ))
        .for("update");
      const learned = userProgress?.learned ?? [];
      const learnedNewWord = !learned.some(([learnedWord]) => learnedWord === canonicalPair[0]);
      if (!learnedNewWord) return;

      const updatedLearned: WordPair[] = [...learned, canonicalPair];
      if (userProgress) {
        await transaction
          .update(progress)
          .set({ learned: updatedLearned })
          .where(eq(progress.id, userProgress.id));
      } else {
        await transaction.insert(progress).values({
          userId,
          learningModuleId: learningModule.id,
          learned: updatedLearned,
        });
      }

      const streak = this.withToday(user.streak);
      const [updatedUser] = await transaction
        .update(users)
        .set({
          streak,
          exp: user.exp + this.reward(10, streak),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
      if (!updatedUser) throw new NotFoundException("User not found");

      await this.updateQuestInTransaction(transaction, userId, {
        key: "learn_words",
        increment: 1,
      });
    });
    return this.currentUser(userId);
  }

  async resetExerciseProgress(userId: string, moduleName: string): Promise<PublicUser> {
    const normalizedModuleName = moduleName.trim();
    if (!normalizedModuleName) throw new BadRequestException("Module is required");

    await this.db.transaction(async (transaction) => {
      const [user] = await transaction
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update");
      if (!user) throw new NotFoundException("User not found");

      const [learningModule] = await transaction
        .select({ id: learningModules.id })
        .from(learningModules)
        .where(eq(learningModules.title, normalizedModuleName))
        .limit(1);
      if (!learningModule) throw new NotFoundException("Learning module not found");

      await transaction
        .update(progress)
        .set({ learned: [] })
        .where(and(
          eq(progress.userId, userId),
          eq(progress.learningModuleId, learningModule.id),
        ));
    });
    return this.currentUser(userId);
  }

  async completeDailyQuiz(userId: string, input: CompleteDailyQuizInput): Promise<PublicUser> {
    if (!Array.isArray(input.answers) || input.answers.length !== 5) {
      throw new BadRequestException("Invalid daily quiz result");
    }

    const uniqueWords = new Set(input.answers.map(({ word }) => word));
    if (uniqueWords.size !== 5) throw new BadRequestException("Daily quiz words must be unique");

    const today = this.today();
    const result = await this.mutateUser(userId, (user) => {
      if (user.quiz.finished && user.quiz.date === today) return {};
      const streak = this.withToday(user.streak);
      return {
        streak,
        exp: user.exp + this.reward(30, streak),
        quiz: { finished: true, date: today },
      };
    }, { key: "daily_quiz", increment: 1 }, async (transaction, user) => {
      const learnedRows = await transaction
        .select({ learned: progress.learned })
        .from(progress)
        .where(eq(progress.userId, user.id));
      const learnedWords = new Set(
        learnedRows.flatMap(({ learned }) => learned.map(([word]) => word)),
      );
      const correctAnswers = input.answers.filter(
        ({ word, answer }) => learnedWords.has(word) && answer.trim() === word,
      ).length;
      if (correctAnswers < 4) throw new BadRequestException("Daily quiz was not passed");
    });
    return result.user;
  }

  private async mutateUser(
    userId: string,
    mutation: (user: UserRow) => UpdateUserInput,
    questUpdate?: QuestUpdate,
    validate?: (transaction: DbTransaction, user: UserRow) => Promise<void>,
  ): Promise<ProgressionResult> {
    const changed = await this.db.transaction(async (transaction) => {
      const [user] = await transaction
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update");
      if (!user) throw new NotFoundException("User not found");

      if (validate) await validate(transaction, user);

      const values = mutation(user);
      if (Object.keys(values).length === 0) return false;

      const [updated] = await transaction
        .update(users)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      if (!updated) throw new NotFoundException("User not found");

      if (questUpdate) await this.updateQuestInTransaction(transaction, userId, questUpdate);
      return true;
    });
    return { user: await this.currentUser(userId), changed };
  }

  private async updateQuestInTransaction(
    transaction: DbTransaction,
    userId: string,
    questUpdate: QuestUpdate,
  ): Promise<void> {
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
    const questProgress = Math.min(
      definition.toObtain,
      Math.max(questRow?.progress ?? 0, requestedProgress),
    );

    if (questRow) {
      await transaction
        .update(dailyQuestProgress)
        .set({ progress: questProgress, updatedAt: new Date() })
        .where(eq(dailyQuestProgress.id, questRow.id));
    } else {
      await transaction.insert(dailyQuestProgress).values({
        userId,
        day,
        questKey: questUpdate.key,
        progress: questProgress,
      });
    }
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

  private async currentUser(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    return toPublicUser(user);
  }
}
