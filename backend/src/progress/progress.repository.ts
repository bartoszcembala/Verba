import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { progress } from "../storage/schema";

@Injectable()
export class ProgressRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  findByUserName(userName: string) { return this.db.select().from(progress).where(eq(progress.userName, userName)); }
}
