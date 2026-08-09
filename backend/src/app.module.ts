import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, type JwtModuleOptions } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { CheckoutModule } from "./checkout/checkout.module";
import { DailyQuestsModule } from "./daily-quests/daily-quests.module";
import { HealthModule } from "./health/health.module";
import { ExercisesModule } from "./exercises/exercises.module";
import { LearningModulesModule } from "./learning-modules/learning-modules.module";
import { LessonsModule } from "./lessons/lessons.module";
import { ProgressModule } from "./progress/progress.module";
import { DbModule } from "./storage/db/db.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const expiresIn = config.get<string>("JWT_EXPIRES_IN", "90d") as NonNullable<JwtModuleOptions["signOptions"]>["expiresIn"];
        return {
          secret: config.getOrThrow<string>("JWT_SECRET"),
          signOptions: { expiresIn },
        };
      },
    }),
    ScheduleModule.forRoot(),
    DbModule,
    AuthModule,
    UsersModule,
    ExercisesModule,
    LearningModulesModule,
    LessonsModule,
    ProgressModule,
    DailyQuestsModule,
    CheckoutModule,
    HealthModule,
  ],
})
export class AppModule {}
