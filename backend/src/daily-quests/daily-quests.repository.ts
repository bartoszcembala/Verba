import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { dailyQuestProgress, type DailyQuestKey } from "../storage/schema";

@Injectable()
export class DailyQuestsRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  findForDay(userId: string, day: string) {
    return this.db
      .select()
      .from(dailyQuestProgress)
      .where(and(eq(dailyQuestProgress.userId, userId), eq(dailyQuestProgress.day, day)));
  }

  async ensureForDay(userId: string, day: string, questKeys: DailyQuestKey[]) {
    await this.db
      .insert(dailyQuestProgress)
      .values(questKeys.map((questKey) => ({ userId, day, questKey })))
      .onConflictDoNothing();
    return this.findForDay(userId, day);
  }
}
