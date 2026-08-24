import { Inject, Injectable } from "@nestjs/common";
import { eq, inArray } from "drizzle-orm";
import { DB } from "../storage/db/db.constants";
import type { Database } from "../storage/db/db.types";
import { userFriends, userLessonCompletions, users, type UserRow } from "../storage/schema";
import type { CreateUserInput, UpdateUserInput, UserWithRelationships } from "./users.types";

@Injectable()
export class UsersRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findAll(): Promise<UserWithRelationships[]> {
    return this.hydrate(await this.db.select().from(users));
  }

  async findById(id: string): Promise<UserWithRelationships | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ? (await this.hydrate([user]))[0] : undefined;
  }

  async findByEmail(email: string): Promise<UserWithRelationships | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return user ? (await this.hydrate([user]))[0] : undefined;
  }

  async findEmailById(id: string): Promise<string | undefined> {
    const [user] = await this.db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user?.email;
  }

  async create(input: CreateUserInput): Promise<UserWithRelationships> {
    const [user] = await this.db.insert(users).values({ ...input, email: input.email.toLowerCase() }).returning();
    return { ...user, finishedLessons: [], friends: [] };
  }

  async update(id: string, input: UpdateUserInput): Promise<UserWithRelationships | undefined> {
    const values = {
      ...input,
      ...(input.email ? { email: input.email.toLowerCase() } : {}),
      updatedAt: new Date(),
    };
    const [user] = await this.db.update(users).set(values).where(eq(users.id, id)).returning();
    return user ? (await this.hydrate([user]))[0] : undefined;
  }

  async replaceFriends(userId: string, friendIds: string[]): Promise<boolean> {
    return this.db.transaction(async (transaction) => {
      const uniqueFriendIds = [...new Set(friendIds)].filter((friendId) => friendId !== userId);
      const existingFriends = uniqueFriendIds.length === 0
        ? []
        : await transaction.select({ id: users.id }).from(users).where(inArray(users.id, uniqueFriendIds));
      if (existingFriends.length !== uniqueFriendIds.length) return false;

      await transaction.delete(userFriends).where(eq(userFriends.userId, userId));
      if (uniqueFriendIds.length > 0) {
        await transaction.insert(userFriends).values(
          uniqueFriendIds.map((friendId) => ({ userId, friendId })),
        );
      }
      return true;
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  private async hydrate(rows: UserRow[]): Promise<UserWithRelationships[]> {
    if (rows.length === 0) return [];
    const userIds = rows.map(({ id }) => id);
    const [friendRows, completionRows] = await Promise.all([
      this.db
        .select({
          userId: userFriends.userId,
          friendId: users.id,
          name: users.name,
          avatar: users.avatar,
        })
        .from(userFriends)
        .innerJoin(users, eq(userFriends.friendId, users.id))
        .where(inArray(userFriends.userId, userIds)),
      this.db
        .select({ userId: userLessonCompletions.userId, lessonId: userLessonCompletions.lessonId })
        .from(userLessonCompletions)
        .where(inArray(userLessonCompletions.userId, userIds)),
    ]);

    return rows.map((user) => ({
      ...user,
      friends: friendRows
        .filter((friend) => friend.userId === user.id)
        .map(({ friendId, name, avatar }) => ({ friendId, name, avatar })),
      finishedLessons: completionRows
        .filter((completion) => completion.userId === user.id)
        .map(({ lessonId }) => lessonId),
    }));
  }
}
