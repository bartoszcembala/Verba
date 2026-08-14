import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { LearningModulesController } from "./learning-modules.controller";
import { LearningModulesRepository } from "./learning-modules.repository";
import { LearningModulesService } from "./learning-modules.service";

@Module({
  imports: [UsersModule],
  controllers: [LearningModulesController],
  providers: [LearningModulesRepository, LearningModulesService],
})
export class LearningModulesModule {}
