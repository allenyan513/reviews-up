import { Injectable, Logger } from '@nestjs/common';
import {
  CreateWidgetDto,
  UpdateWidgetDto,
  WidgetConfig,
  WidgetEntity,
  FindAllWidgetDto,
  VerifyWidgetEmbeddingRequest,
} from '@reviewsup/api/widgets';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateResponse, RRResponse } from '@reviewsup/api/common';
import { generateShortId } from '@src/libs/shortId';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { SortBy } from '@reviewsup/api/common';
import { BrowserlessService } from '@src/modules/browserless/browserless.service';

@Injectable()
export class WidgetsService {
  private logger = new Logger('WidgetsService');
  private defaultConfig: WidgetConfig = {
    type: 'single',
    isRatingSummaryEnabled: true,
    isRatingEnabled: true,
    isSourceEnabled: true,
    isDateEnabled: true,
    isImageEnabled: true,
    isVideoEnabled: true,
    isPoweredByEnabled: true,
    isDoFollowEnabled: true,
    isMoreViewsEnabled: true,
    sortBy: SortBy.default,
    count: 20,
    flow: {
      columns: 4,
    },
    breakpoints: {
      sm: 1,
      md: 2,
      lg: 3,
    },
    rows: 1,
    speed: 40,
    avatarSize: 'md',
  };

  constructor(
    private prismaService: PrismaService,
    private browserlessService: BrowserlessService, // Assuming you have a BrowsersService for browserless operations
  ) {}

  async create(uid: string, dto: CreateWidgetDto) {
    return this.prismaService.widget.create({
      data: {
        shortId: generateShortId(),
        userId: uid,
        productId: dto.productId,
        name: dto.name,
        config: {
          ...this.defaultConfig, // Merge with any provided config
          ...dto.config,
        },
        isProtected: dto.isProtected || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(uid: string, request: FindAllWidgetDto) {
    this.logger.debug('Fetching widget for user', uid, request);
    if (!uid || !request) {
      throw new Error('Product ID is required to fetch reviews');
    }
    const total = await this.prismaService.widget.count({
      where: {
        userId: uid,
        productId: request.productId,
      },
    });
    const items = (await this.prismaService.widget.findMany({
      where: {
        userId: uid,
        productId: request.productId,
        isProtected: request.isProtected,
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
    })) as WidgetEntity[];

    return {
      items: items.map((item) => {
        return {
          ...item,
          isBindProduct: false,
        } as WidgetEntity;
      }),
      meta: {
        page: request.page,
        pageSize: request.pageSize,
        pageCount: Math.ceil(total / request.pageSize),
        total: total,
      },
    } as PaginateResponse<WidgetEntity>;
  }

  /**
   * update widget 可以修改 name 或者 config
   * @param uid
   * @param id
   * @param dto
   */
  async update(uid: string, id: string, dto: UpdateWidgetDto) {
    this.logger.debug('Updating widget', id, 'for user', uid, dto);
    return this.prismaService.widget.update({
      where: {
        id: id,
        userId: uid,
      },
      data: {
        name: dto.name,
        config: dto.config,
        updatedAt: new Date(),
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.widget.delete({
      where: {
        id: id,
        userId: uid,
      },
    });
  }

  async findOneByShortId(shortId: string) {
    this.logger.debug(`Finding widget by shortId: ${shortId}`);
    const widget = (await this.prismaService.widget.findFirst({
      where: {
        OR: [
          { shortId: shortId },
          { id: shortId }, // Allow searching by ID as well
        ],
      },
    })) as WidgetEntity;
    if (!widget) {
      throw new Error('Widget not found');
    }
    return this.findByWidget(widget);
  }

  /**
   * widget 包含一个productId
   * workspaceId 可以关联到全部的reviews, 根据widget自身的preference来筛选reviews, 需要持久化保存这些preferences, 在对外暴露的API中可以使用
   * @param uid
   * @param id
   */
  async findOne(uid: string, id: string): Promise<WidgetEntity> {
    const widget = (await this.prismaService.widget.findUnique({
      where: {
        id: id,
      },
    })) as WidgetEntity;
    if (!widget || widget.userId !== uid) {
      throw new Error('widget not found or access denied');
    }
    return this.findByWidget(widget);
  }

  /**
   *
   * @param widget
   */
  async findByWidget(widget: WidgetEntity): Promise<WidgetEntity> {
    const productId = widget.productId;
    const reviewsId = widget.config.reviewIds || undefined;
    const config = widget.config as WidgetConfig;
    const { count, sortBy = SortBy.default } = config || {};
    const whereCondition: any = {
      productId: productId,
      status: 'public',
      ...(reviewsId && reviewsId.length > 0 ? { id: { in: reviewsId } } : {}),
    };
    const queryCondition: any = {
      where: whereCondition,
      include: {
        medias: true,
      },
      take: count || 20,
    };
    // 根据 sortBy 设置排序条件
    switch (sortBy) {
      case SortBy.newest:
        queryCondition.orderBy = { createdAt: 'desc' };
        break;
      case SortBy.oldest:
        queryCondition.orderBy = { createdAt: 'asc' };
        break;
      case SortBy.rating:
        queryCondition.orderBy = { rating: 'desc' }; // 假设有 rating 字段
        break;
      case SortBy.default:
      default:
        queryCondition.orderBy = [
          { isPin: 'desc' }, // 先按是否置顶
          { createdAt: 'desc' }, // 再按创建时间
        ];
        break;
    }

    const reviews = await this.prismaService.review.findMany(queryCondition);
    const reviewCount = reviews.length;
    const reviewRating =
      reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
      (reviewCount || 1); // Avoid division by zero
    return {
      ...widget,
      reviewRating: reviewRating,
      reviewCount: reviewCount,
      reviews: reviews.map(
        (review: any) =>
          ({
            ...review,
            medias: review.medias || [],
          }) as ReviewEntity,
      ),
    } as WidgetEntity;
  }
}
