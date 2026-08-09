import { Injectable, NotFoundException } from "@nestjs/common";
import type { WordPair } from "../storage/schema";
import { LearningModulesRepository, type LearningModuleInput } from "./learning-modules.repository";

type LearningModuleRow = { id: string; title: string; displayName: string; words: WordPair[]; level: string | null };

@Injectable()
export class LearningModulesService {
  constructor(private readonly repository: LearningModulesRepository) {}

  async findAll() {
    return (await this.repository.findAll()).map(this.serialize);
  }

  async create(body: LearningModuleInput) {
    return this.serialize(await this.repository.create(body));
  }

  async update(id: string, body: Partial<LearningModuleInput>) {
    const row = await this.repository.update(id, body);
    if (!row) throw new NotFoundException("Wrong id");
    return this.serialize(row);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  private serialize(row: LearningModuleRow) {
    return { _id: row.id, __v: 0, title: row.title, displayName: row.displayName, words: row.words, level: row.level };
  }
}
