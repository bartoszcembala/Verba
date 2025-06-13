import Stripe from "stripe";
import { User } from "../models/user.module.js";

const stripe = new Stripe(
  "sk_test_51RTgPpEJx6hC03kLLlUs8R3xied4RJw75WVIY1YS5JPqQJGWS81oQEAaC39OAHAIQgcfnwuMnmmIvVwoKoR903SU009NOnSydv"
);

export async function getCheckoutSession(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:5173/?premium=true`,
      cancel_url: `http://localhost:5173/`,
      customer_email: req.user.email,
      client_reference_id: "ref",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Membership",
              description: "Premium membership",
            },
            unit_amount: 1000, // 10 USD = 1000 cents
          },
          quantity: 1,
        },
      ],
    });

    await User.findByIdAndUpdate(
      req.params.id,
      { premium: true },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function createBookingCheckout(req, res, next) {
  const { premium } = req.query;
  if (!premium) return next();
  await User.findByIdAndUpdate(req.params.id, { premium: true }, { new: true });

  res.redirect(req.originalUrl.split("?")[0]);
}
