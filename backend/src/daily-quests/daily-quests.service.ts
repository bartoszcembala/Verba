import { Injectable } from "@nestjs/common";
import { DailyQuestsRepository } from "./daily-quests.repository";
import { DEFAULT_QUESTS, type DailyQuestResponse } from "./daily-quests.types";

@Injectable()
export class DailyQuestsService {
  constructor(private readonly repository: DailyQuestsRepository) {}

  async findByUserId(userId: string): Promise<DailyQuestResponse> {
    const day = this.today();
    const rows = await this.repository.ensureForDay(
      userId,
      day,
      DEFAULT_QUESTS.map(({ key }) => key),
    );

    return {
      _id: `${userId}:${day}`,
      __v: 0,
      userId,
      day,
      quests: DEFAULT_QUESTS.map((definition) => {
        const progress = rows.find((row) => row.questKey === definition.key)?.progress ?? 0;
        return {
          ...definition,
          progress,
          completed: progress >= definition.toObtain,
        };
      }),
    };
  }

  createDefaultForUser(userId: string): Promise<DailyQuestResponse> {
    return this.findByUserId(userId);
  }

  private today(): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  }
}
