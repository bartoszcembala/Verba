import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import type { Response } from "express";
import { DailyQuestsService } from "../daily-quests/daily-quests.service";
import { UsersRepository } from "../users/users.repository";
import { toPublicUser } from "../users/users.types";
import type { LoginInput, SignupInput } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dailyQuestsService: DailyQuestsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(input: SignupInput, response: Response) {
    if (!input.name || !input.email || !input.password) throw new BadRequestException("Name, email and password are required.");
    if (input.password.length < 8) throw new BadRequestException("Password must contain at least 8 characters.");
    if (input.password !== input.passwordConfirm) throw new BadRequestException("Passwords do not match.");
    if (await this.usersRepository.findByEmail(input.email)) throw new BadRequestException("Email is already in use.");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.usersRepository.create({ name: input.name, email: input.email, passwordHash });
    await this.dailyQuestsService.createDefaultForUser(user.id);
    this.setCookie(response, user.id);
    return toPublicUser(user);
  }

  async login(input: LoginInput, response: Response) {
    if (!input.email || !input.password) throw new BadRequestException("Email and password are required.");
    const user = await this.usersRepository.findByEmail(input.email);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new UnauthorizedException("Invalid credentials.");
    this.setCookie(response, user.id);
    return toPublicUser(user);
  }

  logout(response: Response) {
    response.cookie("jwt", "", { maxAge: 0 });
  }

  private setCookie(response: Response, id: string) {
    const token = this.jwtService.sign({ id });
    const secure = this.config.get<string>("COOKIE_SECURE", "true") !== "false";
    response.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: secure ? "none" : "lax",
      secure,
    });
  }
}
