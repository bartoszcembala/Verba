import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { DEMO_ACCOUNT_EMAIL } from "../common/auth/demo-account";
import { UsersRepository } from "./users.repository";
import type { CreateUserInput, PublicUser, UpdateUserInput } from "./users.types";
import { toPublicUser } from "./users.types";
import type { UpdateCurrentUserDto } from "./users.dto";

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

  async update(id: string, input: UpdateCurrentUserDto): Promise<PublicUser> {
    await this.assertMutableAccount(id);
    const allowed: UpdateUserInput = {};
    if (input.name !== undefined) allowed.name = input.name;
    if (input.email !== undefined) allowed.email = input.email;
    if (input.avatar !== undefined) allowed.avatar = input.avatar;
    if (typeof input.password === "string") allowed.passwordHash = await bcrypt.hash(input.password, 12);
    let user = await this.repository.update(id, allowed);
    if (!user) throw new NotFoundException("User not found");

    if (input.friends !== undefined) {
      const friendIds = input.friends.map((friend) => friend.friendId);
      if (!await this.repository.replaceFriends(id, friendIds)) {
        throw new BadRequestException("One or more friends do not exist");
      }
      user = await this.repository.findById(id);
      if (!user) throw new NotFoundException("User not found");
    }
    return toPublicUser(user);
  }

  async delete(id: string): Promise<void> {
    await this.assertMutableAccount(id);
    return this.repository.delete(id);
  }

  private async assertMutableAccount(id: string): Promise<void> {
    if (await this.repository.findEmailById(id) === DEMO_ACCOUNT_EMAIL) {
      throw new ForbiddenException("The demo account cannot be edited or deleted");
    }
  }
}
