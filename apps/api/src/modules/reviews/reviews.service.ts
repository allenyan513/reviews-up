import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';
import { PaginateResponse, PaginateRequest } from '@repo/api/common/paginate';
import { Review } from '@repo/api/reviews/entities/review.entity';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService');

  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  async submit(createReviewDto: CreateReviewDto) {
    return this.prismaService.review.create({
      data: {
        workspaceId: createReviewDto.workspaceId,
        formId: createReviewDto.formId,
        reviewerName: createReviewDto.reviewerName,
        reviewerImage: createReviewDto.reviewerImage,
        reviewerEmail: createReviewDto.reviewerEmail,
        rating: createReviewDto.rating,
        text: createReviewDto.text,
        tweetId: createReviewDto.tweetId,
        status: 'pending',
        source: createReviewDto.source,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async create(uid: string, createReviewDto: CreateReviewDto) {
    return this.submit(createReviewDto);
  }

  async findAll(workspaceId: string, paginateRequest: PaginateRequest) {
    this.logger.debug(
      'Fetching reviews with pagination',
      workspaceId,
      paginateRequest,
    );
    if (!workspaceId) {
      throw new Error('Workspace ID is required to fetch reviews');
    }
    const total = await this.prismaService.review.count({
      where: {
        workspaceId: workspaceId, // Filter by workspace if provided
      },
    });
    const items = await this.prismaService.review.findMany({
      where: {
        workspaceId: workspaceId, // Filter by workspace if provided
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      skip: (paginateRequest.page - 1) * paginateRequest.pageSize,
      take: paginateRequest.pageSize,
    });
    return {
      items: items,
      meta: {
        page: paginateRequest.page,
        pageSize: paginateRequest.pageSize,
        total: total,
      },
    } as PaginateResponse<any>;
  }

  async findOne(id: string) {
    return this.prismaService.review.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(uid: string, id: string, updateReviewDto: UpdateReviewDto) {
    return this.prismaService.review.update({
      where: {
        id: id,
      },
      data: {},
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.review.delete({
      where: {
        id: id,
      },
    });
  }

  async getSignedUrl(uid: string, dto: S3GetSignedUrlDto) {
    return this.s3Service.getSignedUrl(dto.fileName, dto.fileType);
  }
}
