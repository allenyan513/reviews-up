import { Global, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Module({
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
