import { ValidationPipe } from "@nestjs/common";

export function createAppValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
    whitelist: true,
  });
}
