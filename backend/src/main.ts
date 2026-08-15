import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { createAppValidationPipe } from "./common/validation/app-validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(createAppValidationPipe());
  app.enableCors({
    origin: [
      config.get<string>("FRONTEND_URL", "http://localhost:5173"),
      "https://verba-ebon.vercel.app",
      "https://verba-ywgu.onrender.com",
      "https://verba-i9dm972qa-bartoszs-projects-9616a4a5.vercel.app",
    ],
    credentials: true,
  });

  const port = Number(config.get<string>("PORT", "5001"));
  await app.listen(port);
  console.log(`Started on: ${port}`);
}

void bootstrap();
