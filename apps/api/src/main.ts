import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5510';
  const apiPort = process.env.API_PORT || 5500;
  console.log('Starting API server...', appUrl, apiPort);
  app.enableCors({
    origin: appUrl,
    credentials: true,
  });
  await app.listen(apiPort);
}

bootstrap();
