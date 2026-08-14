import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { AdminGuard } from "../common/auth/admin.guard";

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, JwtAuthGuard, AdminGuard],
  exports: [UsersRepository, UsersService, JwtAuthGuard, AdminGuard],
})
export class UsersModule {}
