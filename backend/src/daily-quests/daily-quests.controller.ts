import { Controller, Get, UseGuards } from "@nestjs/common";
import type { AuthUser } from "../common/auth/auth-user";
import { CurrentUser } from "../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import { DailyQuestsService } from "./daily-quests.service";

@UseGuards(JwtAuthGuard)
@Controller("daily-quests")
export class DailyQuestsController {
  constructor(private readonly service: DailyQuestsService) {}

  @Get("me")
  async findCurrent(@CurrentUser() user: AuthUser) {
    return apiResponse(await this.service.findByUserId(user._id));
  }
}
