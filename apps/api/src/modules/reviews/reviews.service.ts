import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(uid: string, createReviewDto: CreateReviewDto) {
    // Ensure formId is belonging to the user
    const form = await this.prismaService.form.findFirst({
      where: {
        id: createReviewDto.formId,
        userId: uid, // Check if the form belongs to the user
      },
    });
    if (!form) {
      throw new Error('Form not found or does not belong to the user');
    }
    return this.prismaService.review.create({
      data: {
        workspaceId: createReviewDto.workspaceId,
        formId: createReviewDto.formId,
        reviewerName: createReviewDto.reviewerName,
        reviewerImage: createReviewDto.reviewerImage,
        reviewerEmail: createReviewDto.reviewerEmail,
        rating: createReviewDto.rating,
        text: createReviewDto.text,
        twitterUrl: createReviewDto.twitterUrl,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async createPublic(createReviewDto: CreateReviewDto) {
    return this.prismaService.review.create({
      data: {
        workspaceId: createReviewDto.workspaceId,
        formId: createReviewDto.formId,
        reviewerName: createReviewDto.reviewerName,
        reviewerImage: createReviewDto.reviewerImage,
        reviewerEmail: createReviewDto.reviewerEmail,
        rating: createReviewDto.rating,
        text: createReviewDto.text,
        twitterUrl: createReviewDto.twitterUrl,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(workspaceId: string | null) {
    return this.prismaService.review.findMany({
      where: {
        workspaceId: workspaceId, // Filter by workspace if provided
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
    });
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
