import { Injectable, Logger } from '@nestjs/common';
import {
  CreateReviewDto,
  UpdateReviewDto,
  FindAllReviewRequest,
} from '@repo/api/reviews';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateResponse } from '@repo/api/common';
import { NotificationsService } from '../notifications/notifications.service';
import { ReviewSource, ReviewStatus } from '@repo/database/generated/client';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService');

  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async create(uid: string, dto: CreateReviewDto) {
    this.logger.debug(`Creating review for user ${uid}`, dto);
    const review = await this.prismaService.review.create({
      data: {
        workspaceId: dto.workspaceId,
        formId: dto.formId,
        userId: uid,
        reviewerId: dto.reviewerId || uid, // Use userId if reviewerId is not provided
        reviewerName: dto.fullName,
        reviewerImage: dto.avatarUrl,
        reviewerEmail: dto.email,
        reviewerUrl: dto.userUrl,
        rating: dto.rating,
        text: dto.message,
        tweetId: dto.tweetId,
        status: 'pending',
        source: (dto.source as ReviewSource) || 'manual', // Default to 'manual' if not provided
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (dto.imageUrls && dto.imageUrls.length > 0) {
      for (const imageUrl of dto.imageUrls) {
        await this.prismaService.reviewMedia.create({
          data: {
            reviewId: review.id,
            type: 'image',
            url: imageUrl,
          },
        });
      }
    }
    if (dto.videoUrl) {
      await this.prismaService.reviewMedia.create({
        data: {
          reviewId: review.id,
          type: 'video',
          url: dto.videoUrl,
        },
      });
    }
    // notify the creator of the form
    this.notificationService
      .onReviewSubmitted(review.id)
      .then(() => {
        this.logger.debug(`Notification sent for review ${review.id}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to send notification for review ${review.id}`,
          error,
        );
      });
    return review;
  }

  async findAll(request: FindAllReviewRequest) {
    this.logger.debug('Fetching reviews with pagination', request);
    if (!request.workspaceId) {
      throw new Error('Workspace ID is required to fetch reviews');
    }
    const total = await this.prismaService.review.count({
      where: {
        workspaceId: request.workspaceId, // Filter by workspace if provided
      },
    });
    const items = await this.prismaService.review.findMany({
      where: {
        workspaceId: request.workspaceId, // Filter by workspace if provided
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      include: {
        medias: true,
      },
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
    });
    return {
      items: items,
      meta: {
        page: request.page,
        pageSize: request.pageSize,
        total: total,
        pageCount: Math.ceil(total / request.pageSize),
      },
    } as PaginateResponse<any>;
  }

  async findOne(id: string) {
    return this.prismaService.review.findFirst({
      where: {
        id: id,
      },
      include: {
        medias: true,
      },
    });
  }

  async update(uid: string, id: string, updateReviewDto: UpdateReviewDto) {
    return this.prismaService.review.update({
      where: {
        id: id,
      },
      data: {
        ...updateReviewDto,
        source: updateReviewDto.source as ReviewSource,
        status: updateReviewDto.status as ReviewStatus,
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.review.delete({
      where: {
        id: id,
      },
    });
  }

  async notifyFormCreator(reviewId: string, dto: UpdateReviewDto) {}
}
