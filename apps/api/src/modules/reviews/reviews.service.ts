import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateResponse, PaginateRequest } from '@repo/api/common/paginate';
import { FindAllReviewRequest } from '@repo/api/reviews/dto/find-all-review.dto';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService');

  constructor(private prismaService: PrismaService) {}

  async create(uid: string, createReviewDto: CreateReviewDto) {
    return this.submit({
      ...createReviewDto,
      userId: uid, // Set the user ID from the JWT token
    });
  }

  async submit(dto: CreateReviewDto) {
    const review = await this.prismaService.review.create({
      data: {
        workspaceId: dto.workspaceId,
        formId: dto.formId,
        userId: dto.userId,
        reviewerName: dto.fullName,
        reviewerImage: dto.avatarUrl,
        reviewerEmail: dto.email,
        reviewerUrl: dto.userUrl,
        rating: dto.rating,
        text: dto.message,
        tweetId: dto.tweetId,
        status: 'pending',
        source: dto.source || 'manual',
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
        userId: uid,
      },
      data: {
        ...updateReviewDto,
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
}
