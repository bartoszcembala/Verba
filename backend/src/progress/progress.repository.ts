import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { learningModules, progress, users } from "../storage/schema";

@Injectable()
export class ProgressRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  findByUserId(userId: string) {
    return this.db
      .select({
        id: progress.id,
        userName: users.email,
        moduleName: learningModules.title,
        learned: progress.learned,
      })
      .from(progress)
      .innerJoin(users, eq(progress.userId, users.id))
      .innerJoin(learningModules, eq(progress.learningModuleId, learningModules.id))
      .where(eq(progress.userId, userId));
  }
}
