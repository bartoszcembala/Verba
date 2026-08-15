import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginInput, SignupInput } from "./auth.types";

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @UseGuards(ThrottlerGuard)
  async signup(@Body() body: SignupInput, @Res({ passthrough: true }) response: Response) {
    return { success: true, data: { user: await this.authService.signup(body, response) } };
  }

  @Post("login")
  @UseGuards(ThrottlerGuard)
  async login(@Body() body: LoginInput, @Res({ passthrough: true }) response: Response) {
    return { success: true, data: { user: await this.authService.login(body, response) } };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
    return { message: "Logged out successfully" };
  }

}
