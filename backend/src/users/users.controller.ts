import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import type { AuthUser } from "../common/auth/auth-user";
import { CurrentUser } from "../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import { UsersService } from "./users.service";
import { UpdateCurrentUserDto } from "./users.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return apiResponse(await this.usersService.findAll());
  }

  @Get("me")
  current(@CurrentUser() user: AuthUser) {
    return apiResponse(user);
  }

  @Patch("me")
  async updateCurrent(@CurrentUser() user: AuthUser, @Body() body: UpdateCurrentUserDto) {
    return apiResponse(await this.usersService.update(user._id, body));
  }

  @Delete("me")
  async deleteCurrent(@CurrentUser() user: AuthUser) {
    await this.usersService.delete(user._id);
    return { success: true, message: "User deleted" };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return apiResponse(await this.usersService.findOne(id));
  }

}
