import { Injectable, Logger } from '@nestjs/common';
import { CreateEmailOptions, Resend } from 'resend';

@Injectable()
export class ResendEmailService {
  private logger = new Logger('EmailService');
  private resend: Resend | null = null;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send(createEmailOption: CreateEmailOptions) {
    try {
      return await this.resend.emails.send(createEmailOption);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
