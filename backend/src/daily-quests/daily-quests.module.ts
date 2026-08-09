import { Module } from "@nestjs/common";
import { DailyQuestsController } from "./daily-quests.controller";
import { DailyQuestsRepository } from "./daily-quests.repository";
import { DailyQuestsScheduler } from "./daily-quests.scheduler";
import { DailyQuestsService } from "./daily-quests.service";

@Module({
  controllers: [DailyQuestsController],
  providers: [DailyQuestsRepository, DailyQuestsService, DailyQuestsScheduler],
  exports: [DailyQuestsService],
})
export class DailyQuestsModule {}
