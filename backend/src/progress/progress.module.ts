import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { ProgressController } from "./progress.controller";
import { ProgressRepository } from "./progress.repository";
import { ProgressService } from "./progress.service";

@Module({ imports: [UsersModule], controllers: [ProgressController], providers: [ProgressRepository, ProgressService] })
export class ProgressModule {}
