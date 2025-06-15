import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EMAIL_FROM } from '@src/modules/email/email.constants';
import { ResendEmailService } from '../email/resend-email.service';
import { render } from '@react-email/render';
import * as React from 'react';
import { StripeWelcomeEmail } from '@src/emails/welcome';

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(
    private prismaService: PrismaService,
    private emailService: ResendEmailService,
  ) {}

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
      React.createElement(StripeWelcomeEmail, {
        brand: 'Reviewsup.io',
      }),
    );
    // const html = await render(
    //   React.createElement(MyEmail, {
    //     url: 'https://www.google.com'
    //   }),
    // )
    await this.emailService.send({
      from: EMAIL_FROM,
      to: owner.email,
      subject: 'New Review Submitted',
      html: html,
    });
  }
}
