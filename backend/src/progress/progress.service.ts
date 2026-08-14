import { Injectable } from "@nestjs/common";
import { ProgressRepository } from "./progress.repository";

@Injectable()
export class ProgressService {
  constructor(private readonly repository: ProgressRepository) {}
  private serialize(row: { id: string; userName: string; moduleName: string; learned: [string, string][] }) { return { _id: row.id, __v: 0, userName: row.userName, moduleName: row.moduleName, learned: row.learned }; }
  async findByUser(userId: string) {
    return (await this.repository.findByUserId(userId)).map((row) => this.serialize(row));
  }
}
