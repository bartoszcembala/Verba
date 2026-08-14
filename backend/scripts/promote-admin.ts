import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require("postgres");
import { users } from "../src/storage/schema";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run user:promote -- admin@example.com");
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

async function main() {
  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    const [user] = await db
      .update(users)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning({ email: users.email });

    if (!user) {
      console.error(`No user found with email ${email}`);
      process.exitCode = 1;
    } else {
      console.log(`${user.email} is now an administrator`);
    }
  } finally {
    await client.end({ timeout: 5 });
  }
}

void main();
