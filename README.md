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

The setup script creates missing environment files, installs frontend and backend dependencies, starts PostgreSQL, applies Drizzle migrations, and verifies both builds. Existing `.env` files and database data are preserved.

After setup, start the applications in separate terminals:

```bash
cd backend && npm run start:dev
```

```bash
cd frontend && npm run dev
```
