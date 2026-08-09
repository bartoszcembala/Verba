import { Module } from "@nestjs/common";
import { DailyQuestsModule } from "../daily-quests/daily-quests.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";

@Module({
  imports: [UsersModule, DailyQuestsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
