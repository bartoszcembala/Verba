import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/auth/admin.guard";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import { CreateLessonDto, UpdateLessonDto } from "./lessons.dto";
import { LessonsService } from "./lessons.service";

@Controller("lesson")
export class LessonsController {
  constructor(private readonly service: LessonsService) {}
  @Get() async findAll() { return apiResponse(await this.service.findAll()); }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() body: CreateLessonDto) { return apiResponse({ lesson: await this.service.create(body) }); }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param("id") id: string, @Body() body: UpdateLessonDto) {
    return apiResponse(await this.service.update(id, body));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param("id") id: string) {
    await this.service.delete(id);
    return { success: true, message: "Lesson deleted" };
  }
}
