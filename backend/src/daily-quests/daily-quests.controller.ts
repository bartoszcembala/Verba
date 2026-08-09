import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { apiResponse } from "../common/http/api-response";
import { DailyQuestsService } from "./daily-quests.service";
import type { CreateDailyQuestInput } from "./daily-quests.types";

@Controller("daily-quests")
export class DailyQuestsController {
  constructor(private readonly service: DailyQuestsService) {}

  @Get()
  async findAll() {
    return apiResponse(await this.service.findAll());
  }

  @Post()
  async create(@Body() body: CreateDailyQuestInput) {
    return apiResponse({ dailyQuest: await this.service.create(body) });
  }

  @Patch("increment")
  async increment(@Body() body: { index: number; userId: string }) {
    const result = await this.service.increment(body.userId, body.index);
    return { success: true, quests: result.quests };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return apiResponse(await this.service.findByUserId(id));
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return apiResponse(await this.service.update(id, body));
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.service.delete(id);
    return { success: true, message: "Daily Quest deleted" };
  }
}
