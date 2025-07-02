import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.NEXT_PUBLIC_APP_URL, process.env.NEXT_PUBLIC_WWW_URL],
    credentials: true,
  });
  await app.listen(5500);
}

bootstrap();
