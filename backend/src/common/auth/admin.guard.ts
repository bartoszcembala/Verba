import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import type { AuthUser } from "./auth-user";

type AuthenticatedRequest = Request & { user?: AuthUser };

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user?.role !== "admin") {
      throw new ForbiddenException("Administrator access is required");
    }
    return true;
  }
}
