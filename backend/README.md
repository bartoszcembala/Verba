# Verba API

NestJS and TypeScript API backed by PostgreSQL through Drizzle ORM.

## Architecture



```text
src/
  <domain>/
    <domain>.controller.ts   HTTP contract
    <domain>.service.ts      business logic
    <domain>.repository.ts   Drizzle queries
    <domain>.module.ts       Nest module boundary
  common/                    auth and response helpers
  storage/
    db/                      database providers
    schema/                  Drizzle PostgreSQL schema
```

Existing frontend endpoints and response shapes remain compatible, including Mongo-style `_id` fields.

## Local setup

From the repository root, run the complete setup:

```bash
./setup.sh
```

Then start the API with `npm run start:dev` from this directory.

The API listens on `http://localhost:5001/api` by default. Port `5001` avoids the macOS AirPlay receiver that commonly occupies port `5000`.

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

Use generated migrations for deployed environments. `db:push` is intended for local development.
