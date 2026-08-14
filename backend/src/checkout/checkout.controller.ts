import { BadRequestException, Controller, Get, Headers, HttpCode, Post, RawBodyRequest, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
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

  @Post("webhook")
  @HttpCode(200)
  async webhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers("stripe-signature") signature?: string,
  ) {
    if (!request.rawBody || !signature) {
      throw new BadRequestException("Missing Stripe webhook payload or signature");
    }

    await this.checkoutService.handleWebhook(request.rawBody, signature);
    return { received: true };
  }
}
