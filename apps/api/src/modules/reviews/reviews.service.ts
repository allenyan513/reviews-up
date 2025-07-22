import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateReviewDto,
  UpdateReviewDto,
  FindAllReviewRequest,
} from '@reviewsup/api/reviews';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateResponse } from '@reviewsup/api/common';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ReviewSource,
  ReviewStatus,
} from '@reviewsup/database/generated/client';
import {
  TiktokOembedResponse,
  TiktokOembedRequest,
} from '@reviewsup/api/tiktok';
import axios from 'axios';
import { PlacesClient } from '@googlemaps/places';
import {
  GoogleMapRequest,
  GoogleMapResponse,
  googleMapResponseSchema,
} from '@reviewsup/api/google';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService');

  constructor(
    private prismaService: PrismaService,
    private productsService: ProductsService,
    private notificationService: NotificationsService,
  ) {}

  async create(uid: string, dto: CreateReviewDto) {
    this.logger.debug(`Creating review for user ${uid}`, dto);
    // find out ownerId
    const owner = await this.prismaService.product.findUnique({
      where: {
        id: dto.productId,
      },
      select: {
        userId: true,
      },
    });
    if (!owner) {
      throw new HttpException(
        `Product with ID ${dto.productId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const review = await this.prismaService.review.create({
      data: {
        productId: dto.productId,
        formId: dto.formId,
        ownerId: owner.userId,
        reviewerId: dto.reviewerId || uid,
        reviewerName: dto.fullName,
        reviewerImage: dto.avatarUrl,
        reviewerEmail: dto.email,
        reviewerUrl: dto.userUrl,
        reviewerTitle: dto.title,
        rating: dto.rating,
        text: dto.message,
        tweetId: dto.tweetId,
        status: 'pending',
        source: (dto.source as ReviewSource) || 'manual', // Default to 'manual' if not provided
        sourceUrl: dto.sourceUrl || '',
        extra: {
          ...dto.extra, // Include any additional data
        },
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
    // Update the product if there is new review submitted
    await this.productsService.onReviewSubmitted(review.id);
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

  async findAll(uid: string, request: FindAllReviewRequest) {
    this.logger.debug(
      `Finding all reviews with request: ${JSON.stringify(request)}`,
    );
    const whereConditions: any = {
      ...(request.productId
        ? {
            productId: request.productId,
          }
        : {
            reviewerId: uid,
          }),
    };
    console.log('Where conditions:', whereConditions);
    const total = await this.prismaService.review.count({
      where: whereConditions,
    });
    const items = await this.prismaService.review.findMany({
      where: whereConditions,
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

  async updateStatus(uid: string, id: string, dto: UpdateReviewDto) {
    return this.prismaService.review.update({
      where: {
        id: id,
      },
      data: {
        status: dto.status as ReviewStatus,
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async update(uid: string, id: string, dto: UpdateReviewDto) {
    const updateOne = await this.prismaService.review.update({
      where: {
        id: id,
      },
      data: {
        reviewerName: dto.fullName,
        reviewerImage: dto.avatarUrl,
        reviewerEmail: dto.email,
        reviewerUrl: dto.userUrl,
        reviewerTitle: dto.title,
        rating: dto.rating,
        text: dto.message,
        updatedAt: new Date(), // Update the timestamp
      },
    });
    // Remove existing media entries for this review
    await this.prismaService.reviewMedia.deleteMany({
      where: {
        reviewId: id,
      },
    });
    if (dto.imageUrls && dto.imageUrls.length > 0) {
      for (const imageUrl of dto.imageUrls) {
        await this.prismaService.reviewMedia.create({
          data: {
            reviewId: id,
            type: 'image',
            url: imageUrl,
          },
        });
      }
    }
    if (dto.videoUrl) {
      await this.prismaService.reviewMedia.create({
        data: {
          reviewId: id,
          type: 'video',
          url: dto.videoUrl,
        },
      });
    }
    return updateOne;
  }

  async remove(uid: string, id: string) {
    return this.prismaService.review.delete({
      where: {
        id: id,
      },
    });
  }

  async parseTiktok(
    request: TiktokOembedRequest,
  ): Promise<TiktokOembedResponse> {
    const res = await axios.get(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(request.url)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (res.status !== 200) {
      throw new Error(`Failed to fetch TikTok data: ${res.statusText}`);
    }
    return {
      ...res.data,
      url: request.url,
    } as TiktokOembedResponse;
  }

  /**
   * https://developers.google.com/maps/documentation/places/web-service/data-fields?hl=zh-cn&_gl=1*1al7rgh*_up*MQ..*_ga*NjM2Mjc0MDkwLjE3NTE3NzUxNzA.*_ga_NRWSTWS78N*czE3NTE3NzUxNjkkbzEkZzEkdDE3NTE3NzUxNzAkajU5JGwwJGgw
   * @param request
   */
  async searchPlaces(
    request: GoogleMapRequest,
  ): Promise<GoogleMapResponse | null> {
    const placesClient = new PlacesClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
    const places = await placesClient
      .searchText(
        {
          textQuery: request.textQuery,
        },
        {
          otherArgs: {
            headers: {
              'X-Goog-FieldMask':
                'places.id,places.displayName,places.formattedAddress,places.reviews,places.rating,places.userRatingCount,places.reviewSummary,places.googleMapsUri,places.websiteUri',
            },
          },
        },
      )
      .then((response) => {
        if (!response || !response.length) {
          throw new Error('No results found for the given search name');
        }
        if (!response[0].places || response[0].places.length === 0) {
          throw new Error('No places found in the response');
        }
        return response[0].places;
      });
    return googleMapResponseSchema.parse({
      places: places,
    });
  }

  async findAllByReviewerId(reviewerId: string) {
    const reviews = await this.prismaService.review.findMany({
      where: {
        reviewerId: reviewerId,
      },
      select: {
        id: true,
        reviewerId: true,
        formId: true,
        form: true,
      },
    });
    return reviews.map((review) => {
      return {
        id: review.id,
        reviewerId: review.reviewerId,
        formId: review.formId,
        form: {
          shortId: review.form?.shortId,
        },
      };
    });
  }
}
