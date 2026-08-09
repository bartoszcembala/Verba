import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { dailyQuests, type DailyQuestItem } from "../storage/schema";
import type { CreateDailyQuestInput } from "./daily-quests.types";

@Injectable()
export class DailyQuestsRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(dailyQuests);
  }

  async findByUserId(userId: string) {
    const [row] = await this.db.select().from(dailyQuests).where(eq(dailyQuests.userId, userId)).limit(1);
    return row;
  }

  async create(input: CreateDailyQuestInput) {
    const [row] = await this.db.insert(dailyQuests).values(input).returning();
    return row;
  }

  async update(userId: string, values: { day?: string; quests?: DailyQuestItem[] }) {
    const [row] = await this.db.update(dailyQuests).set(values).where(eq(dailyQuests.userId, userId)).returning();
    return row;
  }

  async delete(userId: string) {
    await this.db.delete(dailyQuests).where(eq(dailyQuests.userId, userId));
  }

  async resetAll(day: string) {
    const rows = await this.findAll();
    await Promise.all(rows.map((row) => this.update(row.userId, {
      day,
      quests: row.quests.map((quest) => ({ ...quest, progress: 0, completed: false })),
    })));
  }
}
