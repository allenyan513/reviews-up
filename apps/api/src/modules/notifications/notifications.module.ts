import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
