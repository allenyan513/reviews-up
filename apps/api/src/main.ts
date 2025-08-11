import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SlackService } from './modules/slack/slack.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const slackService = app.get(SlackService);
  app.useGlobalFilters(new AllExceptionsFilter(slackService));
  app.enableCors({
    origin: '*',
  });
  await app.listen(5500);
}

bootstrap();
