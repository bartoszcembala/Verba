import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, JwtAuthGuard],
  exports: [UsersRepository, UsersService, JwtAuthGuard],
})
export class UsersModule {}
