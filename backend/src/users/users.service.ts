import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { UsersRepository } from "./users.repository";
import type { CreateUserInput, PublicUser, UpdateUserInput } from "./users.types";
import { toPublicUser } from "./users.types";

type RawCreateUserBody = Omit<CreateUserInput, "passwordHash"> & {
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.repository.findAll();
    return users.map(toPublicUser);
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return toPublicUser(user);
  }

  async create(input: RawCreateUserBody): Promise<PublicUser> {
    const { password, ...rest } = input;
    const passwordHash = await bcrypt.hash(password, 12);
    return toPublicUser(await this.repository.create({ ...rest, passwordHash }));
  }

  async update(id: string, input: Record<string, unknown>): Promise<PublicUser> {
    const allowed: UpdateUserInput = {};
    const keys: (keyof UpdateUserInput)[] = [
      "name", "email", "avatar",
    ];
    for (const key of keys) {
      if (input[key] !== undefined) Object.assign(allowed, { [key]: input[key] });
    }
    if (typeof input.password === "string") allowed.passwordHash = await bcrypt.hash(input.password, 12);
    let user = await this.repository.update(id, allowed);
    if (!user) throw new NotFoundException("User not found");

    if (input.friends !== undefined) {
      if (!Array.isArray(input.friends) || input.friends.some(
        (friend) => !friend || typeof friend !== "object" || typeof (friend as { friendId?: unknown }).friendId !== "string",
      )) throw new BadRequestException("Friends must contain valid user references");
      const friendIds = input.friends.map((friend) => (friend as { friendId: string }).friendId);
      if (!await this.repository.replaceFriends(id, friendIds)) {
        throw new BadRequestException("One or more friends do not exist");
      }
      user = await this.repository.findById(id);
      if (!user) throw new NotFoundException("User not found");
    }
    return toPublicUser(user);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
