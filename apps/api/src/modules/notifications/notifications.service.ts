import { Injectable, Logger } from '@nestjs/common';
import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateShortId } from '../../libs/shortId';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { EmailService } from '@src/modules/email/email.service';
import { EMAIL_FROM } from '@src/modules/email/email.constants';

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
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
    const html = await this.emailService.render('review-submitted', {
      reviewerName: review.reviewerName || 'Anonymous',
      reviewerEmail: review.reviewerEmail || 'N/A',
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });
    await this.emailService.send({
      from: EMAIL_FROM,
      to: owner.email,
      subject: 'New Review Submitted',
      html: html,
    });
  }
}
