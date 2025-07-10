import { Global, Module } from '@nestjs/common';
import { BrowserlessService } from './browserless.service';

@Global()
@Module({
  providers: [BrowserlessService],
  exports: [BrowserlessService],
})
export class BrowserlessModule {}
