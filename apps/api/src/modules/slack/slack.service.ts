import {Injectable} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackService {
  private webhookUrl = process.env.SLACK_WEBHOOK_URL; // 从环境变量读取
  private isProduction = process.env.NODE_ENV === 'production';


  async sendMessage(message: string) {
    if (!this.isProduction) {
      // 开发或测试环境只打印，不发 Slack
      console.log('[Slack mock]', message);
      return;
    }
    if (!this.webhookUrl) {
      console.warn('Slack Webhook URL not set');
      return;
    }
    try {
      await axios.post(this.webhookUrl, {text: message});
    } catch (err) {
      console.error('Failed to send message to Slack', err);
    }
  }
}
