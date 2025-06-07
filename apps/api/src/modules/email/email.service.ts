import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');
  private transporter: nodemailer.Transporter;
  private templatesDir = path.join(__dirname, 'template');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: `${process.env.EMAIL_PORT}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
  }

  async send(options: Options) {
    try {
      return await this.transporter.sendMail(options);
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
