import { Inject, Injectable } from "@nestjs/common";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { lessons } from "../storage/schema";

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

@Injectable()
export class LessonsRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  findAll() { return this.db.select().from(lessons); }
  async create(input: LessonInput) { const [row] = await this.db.insert(lessons).values(input).returning(); return row; }
}
