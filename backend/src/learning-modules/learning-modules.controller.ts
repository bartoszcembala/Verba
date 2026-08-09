import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { apiResponse } from "../common/http/api-response";
import type { LearningModuleInput } from "./learning-modules.repository";
import { LearningModulesService } from "./learning-modules.service";

@Controller("modules")
export class LearningModulesController {
  constructor(private readonly service: LearningModulesService) {}

  @Get()
  async findAll() { return apiResponse(await this.service.findAll()); }

  @Post()
  async create(@Body() body: LearningModuleInput) { return apiResponse({ module: await this.service.create(body) }); }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: Partial<LearningModuleInput>) { return apiResponse(await this.service.update(id, body)); }

  @Delete(":id")
  async delete(@Param("id") id: string) { await this.service.delete(id); return { success: true, message: "Module deleted" }; }
}
