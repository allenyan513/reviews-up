import { Global, Module } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';

@Global()
@Module({
  controllers: [WidgetsController],
  providers: [WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
