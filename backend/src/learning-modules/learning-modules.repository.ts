import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { learningModules, type WordPair } from "../storage/schema";

export type LearningModuleInput = {
  id?: string;
  title: string;
  displayName: string;
  words: WordPair[];
  level?: string | null;
};

@Injectable()
export class LearningModulesRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(learningModules);
  }

  async create(input: LearningModuleInput) {
    const [row] = await this.db.insert(learningModules).values(input).returning();
    return row;
  }

  async update(id: string, input: Partial<Omit<LearningModuleInput, "id">>) {
    const [row] = await this.db.update(learningModules).set(input).where(eq(learningModules.id, id)).returning();
    return row;
  }

  async delete(id: string) {
    await this.db.delete(learningModules).where(eq(learningModules.id, id));
  }
}
