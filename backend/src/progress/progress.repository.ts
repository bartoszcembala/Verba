import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { progress, type WordPair } from "../storage/schema";

export type ProgressInput = { id?: string; userName: string; moduleName: string; learned?: WordPair[] };

@Injectable()
export class ProgressRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  findAll() { return this.db.select().from(progress); }
  async create(input: ProgressInput) { const [row] = await this.db.insert(progress).values(input).returning(); return row; }
  async update(id: string, input: Partial<Omit<ProgressInput, "id">>) { const [row] = await this.db.update(progress).set(input).where(eq(progress.id, id)).returning(); return row; }
  async delete(id: string) { await this.db.delete(progress).where(eq(progress.id, id)); }
}
