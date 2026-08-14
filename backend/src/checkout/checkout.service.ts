import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import type { AuthUser } from "../common/auth/auth-user";
import { UsersRepository } from "../users/users.repository";

const PREMIUM_PRICE_IN_CENTS = 1999;
const PREMIUM_CURRENCY = "usd";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createSession(user: AuthUser) {
    if (user.premium) throw new ConflictException("Premium is already active");

    const stripe = this.getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: this.config.get<string>("STRIPE_SUCCESS_URL", "http://localhost:5173/buy-premium?checkout=success"),
      cancel_url: this.config.get<string>("STRIPE_CANCEL_URL", "http://localhost:5173/buy-premium?checkout=cancelled"),
      customer_email: user.email,
      client_reference_id: user._id,
      metadata: {
        purchase: "premium_lifetime",
        userId: user._id,
      },
      line_items: [{
        price_data: {
          currency: PREMIUM_CURRENCY,
          product_data: { name: "Premium Membership", description: "Premium membership" },
          unit_amount: PREMIUM_PRICE_IN_CENTS,
        },
        quantity: 1,
      }],
    });
    return session;
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new ServiceUnavailableException("Stripe webhook is not configured");

    const stripe = this.getStripe();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new BadRequestException("Invalid Stripe webhook signature");
    }

    if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
      return;
    }

    const session = event.data.object;
    if (
      session.payment_status !== "paid"
      || session.mode !== "payment"
      || session.amount_total !== PREMIUM_PRICE_IN_CENTS
      || session.currency !== PREMIUM_CURRENCY
      || session.metadata?.purchase !== "premium_lifetime"
    ) return;

    const userId = session.metadata.userId;
    if (!userId || session.client_reference_id !== userId) {
      throw new BadRequestException("Stripe session is missing a valid user reference");
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestException("Stripe session references an unknown user");
    if (!user.premium) await this.usersRepository.update(userId, { premium: true });
  }

  private getStripe(): Stripe {
    const secret = this.config.get<string>("STRIPE_SECRET_KEY");
    if (!secret) throw new ServiceUnavailableException("Stripe is not configured");
    return new Stripe(secret);
  }
}
