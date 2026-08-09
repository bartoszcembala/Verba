import { Module } from "@nestjs/common";
import { LearningModulesController } from "./learning-modules.controller";
import { LearningModulesRepository } from "./learning-modules.repository";
import { LearningModulesService } from "./learning-modules.service";

@Module({ controllers: [LearningModulesController], providers: [LearningModulesRepository, LearningModulesService] })
export class LearningModulesModule {}
