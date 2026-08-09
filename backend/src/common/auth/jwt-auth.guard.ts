import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { UsersRepository } from "../../users/users.repository";
import { toPublicUser } from "../../users/users.types";
import type { AuthUser, JwtPayload } from "./auth-user";

type AuthenticatedRequest = Request & { user?: AuthUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.jwt as string | undefined;

    if (!token) throw new UnauthorizedException("Unauthorized - No Token Provided");

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersRepository.findById(payload.id);
      if (!user) throw new UnauthorizedException("User not found");
      request.user = toPublicUser(user);
      return true;
    } catch {
      throw new UnauthorizedException("Unauthorized - Invalid Token");
    }
  }
}
