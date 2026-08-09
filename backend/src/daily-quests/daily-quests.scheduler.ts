import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { DailyQuestsService } from "./daily-quests.service";

@Injectable()
export class DailyQuestsScheduler {
  constructor(private readonly service: DailyQuestsService) {}

  @Cron("0 0 * * *", { timeZone: "Europe/Warsaw" })
  resetDailyQuests() {
    return this.service.resetAll();
  }
}
