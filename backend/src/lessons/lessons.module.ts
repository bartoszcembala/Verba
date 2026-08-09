import { Module } from "@nestjs/common";
import { LessonsController } from "./lessons.controller";
import { LessonsRepository } from "./lessons.repository";
import { LessonsService } from "./lessons.service";

@Module({ controllers: [LessonsController], providers: [LessonsRepository, LessonsService] })
export class LessonsModule {}
