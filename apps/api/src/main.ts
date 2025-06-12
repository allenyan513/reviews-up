import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appUrl = process.env.APP_URL;
  const apiPort = process.env.API_PORT;
  if (!appUrl) {
    throw new Error('APP_URL is required');
  }
  if (!apiPort) {
    throw new Error('API_PORT is required');
  }
  app.enableCors({
    origin: appUrl,
    credentials: true,
  });
  await app.listen(apiPort)
}

bootstrap();
