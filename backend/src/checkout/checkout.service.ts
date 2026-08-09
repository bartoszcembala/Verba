import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import type { AuthUser } from "../common/auth/auth-user";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createSession(userId: string, user: AuthUser) {
    const secret = this.config.get<string>("STRIPE_SECRET_KEY");
    if (!secret) throw new ServiceUnavailableException("Stripe is not configured");
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: this.config.get<string>("STRIPE_SUCCESS_URL", "http://localhost:5173/?premium=true"),
      cancel_url: this.config.get<string>("STRIPE_CANCEL_URL", "http://localhost:5173/"),
      customer_email: user.email,
      client_reference_id: "ref",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Premium Membership", description: "Premium membership" },
          unit_amount: 1999,
        },
        quantity: 1,
      }],
    });
    await this.usersRepository.update(userId, { premium: true });
    return session;
  }
}
