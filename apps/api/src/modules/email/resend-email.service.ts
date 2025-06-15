import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

import { CreateEmailOptions, Resend } from 'resend';

@Injectable()
export class ResendEmailService {
  private logger = new Logger('EmailService');
  private templatesDir = path.join(__dirname, 'template');
  private resend: Resend;

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

  async render(templateName: string, data: any): Promise<string> {
    const filePath = path.join(this.templatesDir, `${templateName}.ejs`);
    const template = await fs.promises.readFile(filePath, 'utf8');
    const htmlContent = ejs.render(template, data);
    return htmlContent;
  }
}
