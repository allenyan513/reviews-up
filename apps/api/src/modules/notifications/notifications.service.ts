import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { render } from '@react-email/render';
import * as React from 'react';
import { ResendEmailService } from '../email/resend-email.service';
import { EMAIL_ADMIN, EMAIL_FROM } from '../email/email.constants';
import { WelcomeEmail } from '@src/emails/welcome-email';
import { ReviewSubmitEmail } from '@src/emails/review-submitted-email';
import DailyAnalyticsEmail from '../..//emails/daily-analytics-email';
import { User } from '@reviewsup/database/generated/client';

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(
    private prismaService: PrismaService,
    private emailService: ResendEmailService,
  ) {}

  /**
   * Send a welcome email to the user when they are created.
   * @param user
   */
  async onUserCreated(user: User): Promise<void> {
    if (!user.email) {
      this.logger.warn(
        `User with ID ${user.id} has no email, skipping welcome email.`,
      );
      return;
    }
    const html = await render(
      React.createElement(WelcomeEmail, {
        userName: user.name || 'User',
      }),
    );
    await this.emailService.send({
      from: EMAIL_FROM,
      to: user.email,
      subject: `Welcome to Reviewsup.io`,
      html: html,
    });
  }

  /**
   * 当用户提交评论时触发通知，通知创建者
   * @param reviewId
   */
  async onReviewSubmitted(reviewId: string): Promise<void> {
    const review = await this.prismaService.review.findUnique({
      where: { id: reviewId },
      include: {
        form: {
          select: {
            userId: true,
            workspaceId: true,
          },
        },
      },
    });
    if (!review) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    const ownerId = review.form.userId;
    const owner = await this.prismaService.user.findUnique({
      where: { id: ownerId },
      select: { email: true },
    });
    if (!owner) {
      throw new Error(`Owner with ID ${ownerId} not found`);
    }
    const html = await render(
      React.createElement(ReviewSubmitEmail, {
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      }),
    );
    await this.emailService.send({
      from: EMAIL_FROM,
      to: owner.email,
      subject: 'New Review Submitted',
      html: html,
    });
  }

  async onDailyAnalytics(result: {
    totalUsers: number;
    totalAccount: number;
    totalForms: number;
    totalShowcase: number;
    totalWorkspace: number;
    totalReview: number;
    totalReviewMedia: number;
    totalCampaign: number;
  }) {
    const html = await render(
      React.createElement(DailyAnalyticsEmail, {
        userName: 'Admin',
        totalUsers: result.totalUsers,
        totalAccount: result.totalAccount,
        totalForms: result.totalForms,
        totalShowcase: result.totalShowcase,
        totalWorkspace: result.totalWorkspace,
        totalReview: result.totalReview,
        totalReviewMedia: result.totalReviewMedia,
        totalCampaign: result.totalCampaign,
      }),
    );
    await this.emailService.send({
      from: EMAIL_FROM,
      to: EMAIL_ADMIN,
      subject: `Daily Analytics Summary`,
      html: html,
    });
  }
}
