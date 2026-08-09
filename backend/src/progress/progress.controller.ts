import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { apiResponse } from "../common/http/api-response";
import type { ProgressInput } from "./progress.repository";
import { ProgressService } from "./progress.service";

@Controller("progress")
export class ProgressController {
  constructor(private readonly service: ProgressService) {}
  @Get() async findAll() { return apiResponse(await this.service.findAll()); }
  @Post() async create(@Body() body: ProgressInput) { return apiResponse({ module: await this.service.create(body) }); }
  @Patch(":id") async update(@Param("id") id: string, @Body() body: Partial<ProgressInput>) { return apiResponse(await this.service.update(id, body)); }
  @Delete(":id") async delete(@Param("id") id: string) { await this.service.delete(id); return { success: true, message: "Progress deleted" }; }
}
