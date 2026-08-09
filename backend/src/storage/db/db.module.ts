import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require("postgres");
import * as schema from "../schema";
import { DB, POSTGRES_CLIENT } from "./db.constants";

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.getOrThrow<string>("DATABASE_URL");
        return postgres(url, { max: 10 });
      },
    },
    {
      provide: DB,
      inject: [POSTGRES_CLIENT],
      useFactory: (client: ReturnType<typeof postgres>) => drizzle(client, { schema }),
    },
  ],
  exports: [DB, POSTGRES_CLIENT],
})
export class DbModule {}
