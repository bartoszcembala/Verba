import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { UsersModule } from "../users/users.module";
import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({ imports: [UsersModule], controllers: [CheckoutController], providers: [CheckoutService, JwtAuthGuard] })
export class CheckoutModule {}
