import { Injectable } from "@nestjs/common";
import { LessonsRepository, type LessonInput } from "./lessons.repository";

@Injectable()
export class LessonsService {
  constructor(private readonly repository: LessonsRepository) {}

  async findAll() {
    return (await this.repository.findAll()).map(this.serialize);
  }

  async create(body: LessonInput) {
    return this.serialize(await this.repository.create(body));
  }

  private serialize(row: Awaited<ReturnType<LessonsRepository["create"]>>) {
    return {
      _id: row.id,
      __v: 0,
      title: row.title,
      number: row.number,
      displayTitle: row.displayTitle,
      html: row.html,
      relatedExercises: row.relatedExercises,
      type: row.type,
      level: row.level,
    };
  }
}
