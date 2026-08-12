import { Controller, Get, UseGuards } from "@nestjs/common";
import type { AuthUser } from "../common/auth/auth-user";
import { CurrentUser } from "../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import { ProgressService } from "./progress.service";

@UseGuards(JwtAuthGuard)
@Controller("progress")
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Get("me")
  async findCurrent(@CurrentUser() user: AuthUser) {
    return apiResponse(await this.service.findByUser(user.email));
  }
}
