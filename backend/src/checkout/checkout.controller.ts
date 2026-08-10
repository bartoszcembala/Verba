import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import type { AuthUser } from "../common/auth/auth-user";
import { CheckoutService } from "./checkout.service";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async create(@CurrentUser() user: AuthUser) {
    return { status: "success", session: await this.checkoutService.createSession(user) };
  }
}
