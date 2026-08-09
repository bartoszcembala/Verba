import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { apiResponse } from "../common/http/api-response";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return apiResponse(await this.usersService.findAll());
  }

  @Post()
  async create(@Body() body: Record<string, unknown>) {
    const user = await this.usersService.create(body as never);
    return apiResponse({ user });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return apiResponse(await this.usersService.findOne(id));
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return apiResponse(await this.usersService.update(id, body));
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.usersService.delete(id);
    return { success: true, message: "User deleted" };
  }
}
