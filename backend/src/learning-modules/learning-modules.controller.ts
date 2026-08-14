import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/auth/admin.guard";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import type { LearningModuleInput } from "./learning-modules.repository";
import { LearningModulesService } from "./learning-modules.service";

@Controller("modules")
export class LearningModulesController {
  constructor(private readonly service: LearningModulesService) {}

  @Get()
  async findAll() { return apiResponse(await this.service.findAll()); }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() body: LearningModuleInput) { return apiResponse({ module: await this.service.create(body) }); }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param("id") id: string, @Body() body: Partial<LearningModuleInput>) { return apiResponse(await this.service.update(id, body)); }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param("id") id: string) { await this.service.delete(id); return { success: true, message: "Module deleted" }; }
}
