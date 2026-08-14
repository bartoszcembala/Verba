import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { LessonsController } from "./lessons.controller";
import { LessonsRepository } from "./lessons.repository";
import { LessonsService } from "./lessons.service";

@Module({
  imports: [UsersModule],
  controllers: [LessonsController],
  providers: [LessonsRepository, LessonsService],
})
export class LessonsModule {}
