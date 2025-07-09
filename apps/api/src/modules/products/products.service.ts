import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductRequest,
  FindAllRequest,
  ProductEntity,
  UpdateProductRequest,
} from '@reviewsup/api/products';
import slugify from 'slugify';
import { $Enums } from '@reviewsup/database/generated/client';
import ProductStatus = $Enums.ProductStatus;
import ProductCategory = $Enums.ProductCategory;

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(private prismaService: PrismaService) {}

  async create(uid: string, dto: CreateProductRequest) {
    this.logger.debug(`Creating review for user ${uid}`, dto);
    const pendingTasks = await this.prismaService.product.count({
      where: {
        status: {
          in: ['pendingForReceive', 'pendingForSubmit'], // Only count products that are pending or under review
        },
        userId: {
          not: uid,
        },
      },
    });
    const taskReviewCount = Math.min(10, pendingTasks);
    // If there are no pending tasks, set status to 'listing' immediately
    const status = taskReviewCount > 0 ? 'pendingForSubmit' : 'listing';
    const product = await this.prismaService.product.create({
      data: {
        workspaceId: dto.workspaceId,
        formId: dto.formId,
        name: dto.name,
        url: dto.url,
        status: status,
        icon: dto.icon,
        screenshot: dto.screenshot,
        category: dto.category as ProductCategory,
        description: dto.description,
        longDescription: dto.longDescription,
        features: dto.features,
        useCase: dto.useCase,
        howToUse: dto.howToUse,
        faq: dto.faq,
        //-----------//
        userId: uid,
        slug: slugify(dto.name, {
          lower: true,
          strict: true,
        }),
        taskReviewCount: taskReviewCount,
        submitReviewCount: 0,
        receiveReviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return product;
  }

  async findAll(
    userId: string,
    request: FindAllRequest,
  ): Promise<ProductEntity[]> {
    this.logger.debug('request to findAll products', request);
    const { workspaceId, status } = request;
    const items = (await this.prismaService.product.findMany({
      where: {
        ...(workspaceId && { workspaceId: workspaceId }),
        ...(status && {
          status: {
            in: status as ProductStatus[], // Filter by status if provided
          },
        }),
        ...(request.search && {
          OR: [
            { name: { contains: request.search, mode: 'insensitive' } },
            { description: { contains: request.search, mode: 'insensitive' } },
          ],
        }),
        ...(request.categories &&
          request.categories.length > 0 && {
            category: {
              in: request.categories as ProductCategory[], // Filter by categories if provided
            },
          }),
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      include: {
        form: true,
      },
      take: request.pageSize || 10,
      skip: (request.page - 1) * (request.pageSize || 10),
    })) as ProductEntity[];
    return items;
  }

  async findOne(id: string) {
    return this.prismaService.product.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(uid: string, id: string, request: UpdateProductRequest) {
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.product.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * 当发生"评价提交"事件后，
   * 检查提交评价人
   * 1. 如果 提交人 存在一个 product， 并且它的状态是 pendingForSubmit 或 pendingForReceive. listing的，则给这个product.submitReviewCount + 1
   * 2. 如果submitReviewCount> receiveReviewCount ， 则设置为 pendingForReceive状态，apps-to-reviews 可以正常透出
   * 3. 如果submitReviewCount>=taskReviewCount , 说明已经达到listing的要求， 修改状态成 list
   * 检查提交人
   * 1. 如果被提交人，存在一个 product, 并且它的状态是 pendingForSubmit 或者 pendingForReceive，则给这个product.receiveReviewCount +1
   * 2. 如果 product.receiveReviewCount >=submitReviewCount 说明， 额度用完了，切换到 pendingForSubmit状态， 这样子在 列表中就不会被现实
   * @param reviewId
   */
  async onReviewSubmitted(reviewId: any) {
    this.logger.debug(`onReviewSubmitted: ${reviewId}`);
    const review = await this.prismaService.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        ownerId: true,
        reviewerId: true,
      },
    });
    if (!review) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    if (review.reviewerId) {
      //提交评价用户
      const product = await this.prismaService.product.findFirst({
        where: {
          userId: review.reviewerId,
          status: {
            in: ['pendingForReceive', 'pendingForSubmit', 'listing'], // Only count products that are pending or under review
          },
        },
        select: {
          id: true,
          status: true,
          submitReviewCount: true,
          receiveReviewCount: true,
          taskReviewCount: true,
        },
      });
      if (!product) {
        this.logger.debug(
          `No product found for user ${review.reviewerId} with status pendingForReceive, pendingFroSubmit or listing`,
        );
        return;
      }
      const newSubmitReviewCount = product.submitReviewCount + 1;
      let newStatus = product.status;
      if (newSubmitReviewCount >= product.taskReviewCount) {
        newStatus = 'listing'; // 达到提交评价计数，切换到 listing 状态
      } else if (newSubmitReviewCount > product.receiveReviewCount) {
        newStatus = 'pendingForReceive'; // 提交评价计数超过接收评价计数，切换到 pendingForReceive 状态
      }
      // 更新提交人产品的提交评价计数
      await this.prismaService.product.update({
        where: {
          id: product.id,
        },
        data: {
          submitReviewCount: newSubmitReviewCount,
          status: newStatus,
          updatedAt: new Date(),
        },
      });
    }
    if (review.ownerId) {
      //update review owner
      const product = await this.prismaService.product.findFirst({
        where: {
          userId: review.ownerId,
          status: {
            in: ['pendingForReceive', 'pendingForSubmit', 'listing'], // Only count products that are pending or under review
          },
        },
        select: {
          id: true,
          status: true,
          submitReviewCount: true,
          receiveReviewCount: true,
        },
      });
      if (!product) {
        this.logger.debug(
          `No product found for user ${review.ownerId} with status pendingForReceive, pendingFroSubmit or listing`,
        );
        return;
      }
      //如果 status 是 listing, 则不需要更新status

      const newReceiveReviewCount = product.receiveReviewCount + 1;
      let newStatus = product.status;
      if (
        newStatus !== 'listing' && // 如果当前状态不是 listing
        newReceiveReviewCount >= product.submitReviewCount
      ) {
        newStatus = 'pendingForSubmit'; // 达到接收评价计数，切换到 pendingFroSubmit 状态
      }
      // 更新被提交人产品的接收评价计数
      await this.prismaService.product.update({
        where: {
          id: product.id,
        },
        data: {
          receiveReviewCount: newReceiveReviewCount,
          status: newStatus,
          updatedAt: new Date(),
        },
      });
    }
    this.logger.debug(`onReviewSubmitted completed for reviewId: ${reviewId}`);
  }
}
