import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { eq, inArray } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { learningModules, lessonRelatedExercises, lessons, type LessonRow } from "../storage/schema";

export type LessonInput = {
  id?: string;
  title: string;
  number: number;
  displayTitle: string;
  html: string;
  relatedExercises?: string[];
  type?: string | null;
  level?: string | null;
};

export type LessonWithRelationships = LessonRow & { relatedExercises: string[] };

@Injectable()
export class LessonsRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findAll(): Promise<LessonWithRelationships[]> {
    return this.hydrate(await this.db.select().from(lessons));
  }

  async create(input: LessonInput): Promise<LessonWithRelationships> {
    const { relatedExercises = [], ...lessonInput } = input;
    const row = await this.db.transaction(async (transaction) => {
      const [created] = await transaction.insert(lessons).values(lessonInput).returning();
      const uniqueTitles = [...new Set(relatedExercises)];
      if (uniqueTitles.length === 0) return created;

      const modules = await transaction
        .select({ id: learningModules.id })
        .from(learningModules)
        .where(inArray(learningModules.title, uniqueTitles));
      if (modules.length !== uniqueTitles.length) {
        throw new BadRequestException("One or more related exercises do not exist");
      }
      await transaction.insert(lessonRelatedExercises).values(
        modules.map(({ id }) => ({ lessonId: created.id, learningModuleId: id })),
      );
      return created;
    });
    return { ...row, relatedExercises: [...new Set(relatedExercises)] };
  }

  async update(id: string, input: Partial<LessonInput>): Promise<LessonWithRelationships | undefined> {
    const { id: _ignoredId, relatedExercises, ...lessonInput } = input;
    const row = await this.db.transaction(async (transaction) => {
      const [updated] = await transaction
        .update(lessons)
        .set(lessonInput)
        .where(eq(lessons.id, id))
        .returning();
      if (!updated || relatedExercises === undefined) return updated;

      const uniqueTitles = [...new Set(relatedExercises)];
      const modules = uniqueTitles.length === 0
        ? []
        : await transaction
          .select({ id: learningModules.id })
          .from(learningModules)
          .where(inArray(learningModules.title, uniqueTitles));
      if (modules.length !== uniqueTitles.length) {
        throw new BadRequestException("One or more related exercises do not exist");
      }

      await transaction.delete(lessonRelatedExercises).where(eq(lessonRelatedExercises.lessonId, id));
      if (modules.length > 0) {
        await transaction.insert(lessonRelatedExercises).values(
          modules.map(({ id: learningModuleId }) => ({ lessonId: id, learningModuleId })),
        );
      }
      return updated;
    });
    return row ? (await this.hydrate([row]))[0] : undefined;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db.delete(lessons).where(eq(lessons.id, id)).returning({ id: lessons.id });
    return deleted.length > 0;
  }

  private async hydrate(rows: LessonRow[]): Promise<LessonWithRelationships[]> {
    if (rows.length === 0) return [];
    const related = await this.db
      .select({ lessonId: lessonRelatedExercises.lessonId, moduleTitle: learningModules.title })
      .from(lessonRelatedExercises)
      .innerJoin(learningModules, eq(lessonRelatedExercises.learningModuleId, learningModules.id))
      .where(inArray(lessonRelatedExercises.lessonId, rows.map(({ id }) => id)));
    return rows.map((lesson) => ({
      ...lesson,
      relatedExercises: related
        .filter(({ lessonId }) => lessonId === lesson.id)
        .map(({ moduleTitle }) => moduleTitle),
    }));
  }
}
