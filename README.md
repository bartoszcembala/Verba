# 🇪🇸 Verba — Learn Spanish

> A web app for learning Spanish through interactive exercises, daily quests, and XP progression.

[Live Demo](https://verba-ebon.vercel.app) • [Report Bug](...)

![screenshot](.//assets/image.png)

## Features

- 📚 Structured lessons by difficulty level
- ✏️ Translation and fill-in-the-blank exercises
- 🔥 Daily streak tracking
- 🏆 XP system with levels
- ✅ Daily quests
- 💳 Premium membership via Stripe

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, TanStack Query

**Backend:** NestJS, TypeScript, Drizzle ORM, PostgreSQL

**Auth:** JWT + HTTP-only cookies

**Payments:** Stripe

## Local setup

Make sure Node.js 20+, npm, Docker, and OpenSSL are installed, then run:

```bash
./setup.sh
```

The setup script creates missing environment files, installs frontend and backend dependencies, starts PostgreSQL, applies Drizzle migrations, verifies both builds, and runs the frontend and backend. Existing `.env` files and database data are preserved. Press Ctrl+C to stop both application processes.

## Stripe webhooks

Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `backend/.env`. Configure Stripe to send `checkout.session.completed` and `checkout.session.async_payment_succeeded` events to:

```text
https://your-api-domain/api/checkout/webhook
```

For local development, forward Stripe events to the backend and copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:5001/api/checkout/webhook
```

## Backend tests

Run the authentication and progression end-to-end suite with:

```bash
cd backend && npm run test:e2e
```

The runner starts a disposable PostgreSQL container on an automatically assigned local port, applies migrations, runs the API tests, and stops the test database. Set `TEST_DATABASE_URL` to use a dedicated external test database instead.

## Administrator access

New accounts have the `user` role. After applying database migrations, promote an existing account from the backend directory:

```bash
npm run user:promote -- admin@example.com
```

Only administrators can create, update, or delete learning modules and lessons. Reading learning content remains public.
