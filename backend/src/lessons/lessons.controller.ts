import { Body, Controller, Get, Post } from "@nestjs/common";
import { apiResponse } from "../common/http/api-response";
import type { LessonInput } from "./lessons.repository";
import { LessonsService } from "./lessons.service";

@Controller("lesson")
export class LessonsController {
  constructor(private readonly service: LessonsService) {}
  @Get() async findAll() { return apiResponse(await this.service.findAll()); }
  @Post() async create(@Body() body: LessonInput) { return apiResponse({ lesson: await this.service.create(body) }); }
}
