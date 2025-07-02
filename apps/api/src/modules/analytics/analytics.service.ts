import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from '@src/modules/notifications/notifications.service';

@Injectable()
export class AnalyticsService {
  private logger = new Logger(AnalyticsService.name);

  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  //每天中午12点执行
  @Cron('0 12 * * *')
  async dailyAnalytics() {
    this.logger.log('Running daily analytics job');
    try {
      // 在这里添加你的分析逻辑
      // 例如，计算用户活跃度、表单提交统计等
      const totalUsers = await this.prismaService.user.count();
      const totalAccount = await this.prismaService.account.count();
      const totalForms = await this.prismaService.form.count();
      const totalShowcase = await this.prismaService.showcase.count();
      const totalWorkspace = await this.prismaService.workspace.count();
      const totalReview = await this.prismaService.review.count();
      const totalReviewMedia = await this.prismaService.reviewMedia.count();
      const totalCampaign = await this.prismaService.campaign.count();
      const result = {
        totalUsers,
        totalAccount,
        totalForms,
        totalShowcase,
        totalWorkspace,
        totalReview,
        totalReviewMedia,
        totalCampaign,
      };
      console.log('Daily analytics result:', result);
      this.logger.log('Daily analytics result:', result);
      await this.notificationsService.onDailyAnalytics(result);
      // 可以将结果存储到数据库或发送通知等
    } catch (error) {
      this.logger.error('Error running daily analytics job', error);
    }
  }
}
