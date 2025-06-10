import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.API_PORT;
  if (!port) {
    throw new Error('Port is required');
  }
  await app.listen(port);
}

bootstrap();
