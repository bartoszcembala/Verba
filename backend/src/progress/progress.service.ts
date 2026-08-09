import { Injectable, NotFoundException } from "@nestjs/common";
import { ProgressRepository, type ProgressInput } from "./progress.repository";

@Injectable()
export class ProgressService {
  constructor(private readonly repository: ProgressRepository) {}
  private serialize(row: { id: string; userName: string; moduleName: string; learned: [string, string][] }) { return { _id: row.id, __v: 0, userName: row.userName, moduleName: row.moduleName, learned: row.learned }; }
  async findAll() { return (await this.repository.findAll()).map((row) => this.serialize(row)); }
  async create(body: ProgressInput) { return this.serialize(await this.repository.create(body)); }
  async update(id: string, body: Partial<ProgressInput>) { const row = await this.repository.update(id, body); if (!row) throw new NotFoundException("Wrong id"); return this.serialize(row); }
  delete(id: string) { return this.repository.delete(id); }
}
