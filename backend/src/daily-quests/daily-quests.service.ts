import { Injectable, NotFoundException } from "@nestjs/common";
import type { DailyQuestItem } from "../storage/schema";
import { DailyQuestsRepository } from "./daily-quests.repository";
import { DEFAULT_QUESTS, type CreateDailyQuestInput, type DailyQuestResponse } from "./daily-quests.types";

@Injectable()
export class DailyQuestsService {
  constructor(private readonly repository: DailyQuestsRepository) {}

  async findAll(): Promise<DailyQuestResponse[]> {
    return (await this.repository.findAll()).map(this.serialize);
  }

  async findByUserId(userId: string): Promise<DailyQuestResponse> {
    const row = await this.repository.findByUserId(userId);
    if (!row) throw new NotFoundException("Daily quests not found");
    return this.serialize(row);
  }

  async create(input: CreateDailyQuestInput): Promise<DailyQuestResponse> {
    return this.serialize(await this.repository.create(input));
  }

  createDefaultForUser(userId: string): Promise<DailyQuestResponse> {
    return this.create({ userId, day: this.today(), quests: DEFAULT_QUESTS.map((quest) => ({ ...quest })) });
  }

  async update(userId: string, body: Record<string, unknown>): Promise<DailyQuestResponse> {
    const row = await this.repository.update(userId, {
      ...(typeof body.day === "string" ? { day: body.day } : {}),
      ...(Array.isArray(body.quests) ? { quests: body.quests as DailyQuestItem[] } : {}),
    });
    if (!row) throw new NotFoundException("Daily quests not found");
    return this.serialize(row);
  }

  async increment(userId: string, index: number): Promise<DailyQuestResponse> {
    const current = await this.repository.findByUserId(userId);
    if (!current) throw new NotFoundException("Daily quests not found");
    if (!current.quests[index]) throw new NotFoundException("Quest not found");
    const quests = current.quests.map((quest, questIndex) => {
      if (questIndex !== index) return quest;
      const progress = Math.min(quest.toObtain, quest.progress + 1);
      return { ...quest, progress, completed: progress >= quest.toObtain };
    });
    const row = await this.repository.update(userId, { quests });
    if (!row) throw new NotFoundException("Daily quests not found");
    return this.serialize(row);
  }

  delete(userId: string) {
    return this.repository.delete(userId);
  }

  resetAll() {
    return this.repository.resetAll(this.today());
  }

  private today() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  }

  private serialize(row: { id: string; userId: string; day: string; quests: DailyQuestItem[] }): DailyQuestResponse {
    return { _id: row.id, __v: 0, userId: row.userId, day: row.day, quests: row.quests };
  }
}
