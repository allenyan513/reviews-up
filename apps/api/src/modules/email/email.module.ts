import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendEmailService } from '@src/modules/email/resend-email.service';

@Global()
@Module({
  providers: [EmailService, ResendEmailService],
  exports: [EmailService, ResendEmailService],
})
export class EmailModule {}
