import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { users, type UserRow } from "../storage/schema";
import type { CreateUserInput, UpdateUserInput } from "./users.types";

@Injectable()
export class UsersRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll(): Promise<UserRow[]> {
    return this.db.select().from(users);
  }

  async findById(id: string): Promise<UserRow | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async findByEmail(email: string): Promise<UserRow | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return user;
  }

  async create(input: CreateUserInput): Promise<UserRow> {
    const [user] = await this.db.insert(users).values({ ...input, email: input.email.toLowerCase() }).returning();
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<UserRow | undefined> {
    const values = {
      ...input,
      ...(input.email ? { email: input.email.toLowerCase() } : {}),
      updatedAt: new Date(),
    };
    const [user] = await this.db.update(users).set(values).where(eq(users.id, id)).returning();
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
