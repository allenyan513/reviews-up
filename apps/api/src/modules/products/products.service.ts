import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CrawlProductResponse,
  CreateProductRequest,
  FindAllRequest,
  ProductEntity,
  UpdateProductRequest,
} from '@reviewsup/api/products';
import slugify from 'slugify';
import { $Enums } from '@reviewsup/database/generated/client';
import ProductStatus = $Enums.ProductStatus;
import ProductCategory = $Enums.ProductCategory;
import { OrdersService } from '../orders/orders.service';
import { RRResponse } from '@reviewsup/api/common';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';
import { BrowserlessService } from '@src/modules/browserless/browserless.service';
import { S3Service } from '@src/modules/s3/s3.service';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { hash } from '@src/libs/utils';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    private prismaService: PrismaService,
    private orderService: OrdersService,
    private browserlessService: BrowserlessService, // Assuming BrowserService is defined elsewhere
    private s3Service: S3Service, // Assuming S3Service is defined elsewhere
  ) {}

  async crawlProductInfo(userId: string, url: string) {
    this.logger.debug(
      `Crawling product info for user ${userId} with URL: ${url}`,
    );
    const validatedUrl = new URL(url);
    const { title, description, faviconFilePath, screenshotFilePath } =
      await this.browserlessService.extract(validatedUrl.href);
    this.logger.debug(`Extracted Result:`, {
      title,
      description,
      faviconFilePath,
      screenshotFilePath,
    });
    const faviconKey = `${hash(Date.now().toString())}${mime.lookup(faviconFilePath)}`;
    await this.s3Service.uploadFile(
      faviconKey,
      fs.readFileSync(faviconFilePath),
      mime.lookup(faviconFilePath) || 'image/png',
    );
    const screenshotKey = `${hash(Date.now().toString())}${mime.lookup(screenshotFilePath)}`;
    await this.s3Service.uploadFile(
      screenshotKey,
      fs.readFileSync(screenshotFilePath),
      mime.lookup(screenshotFilePath) || 'image/png',
    );
    return {
      title: title,
      description: description,
      faviconUrl: this.s3Service.getUrl(faviconKey),
      screenshotUrl: this.s3Service.getUrl(screenshotKey),
    } as CrawlProductResponse;
  }

  /**
   * 申请创建一个产品
   * 分成多种提交方式：1）免费提交 2）付费提交
   * 付费提交需要检查用户是否有足够的余额，没有的话就返回支付链接,如果有余额的话就直接创建产品
   * @param uid
   * @param dto
   */
  async create(
    uid: string,
    dto: CreateProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> {
    this.logger.debug(`Creating review for user ${uid}`, dto);
    if (dto.submitOption === 'paid-submit') {
      return this.createPaidSubmit(uid, dto);
    } else if (dto.submitOption === 'free-submit') {
      return this.createFreeSubmit(uid, dto);
    } else {
      this.logger.error(`Unknown submit option: ${dto.submitOption}`);
      return {
        code: 400,
        message: 'Unknown submit option',
        data: null,
      };
    }
  }

  /**
   * 创建一个付费提交的产品
   * @param uid
   * @param dto
   */
  async createPaidSubmit(
    uid: string,
    dto: CreateProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> {
    // Check if the user has enough balance for paid submission
    const user = await this.prismaService.user.findUnique({
      where: { id: uid },
      select: { balance: true },
    });
    if (!user) {
      throw new Error(`User with ID ${uid} not found`);
    }
    const stripeProductId = process.env.STRIPE_PAID_SUBMIT_PRODUCT_ID;
    const stripeProductPriceDecimal =
      await this.orderService.getProductPriceDecimal(stripeProductId);
    if (user.balance.lt(stripeProductPriceDecimal)) {
      this.logger.debug(
        `User ${uid} does not have enough balance for paid submission`,
      );
      const session = await this.orderService.createOneTimePayment(uid, {
        productId: stripeProductId,
      });
      // save product as a draft
      // await this.save(uid, dto);
      // Return the session for payment
      return {
        code: 600,
        message: 'Insufficient balance for paid submission',
        data: session as CreateOneTimePaymentResponse,
      };
    } else {
      this.logger.debug(`User ${uid} has enough balance for paid submission`);
      // Deduct the balance from the user
      await this.prismaService.user.update({
        where: { id: uid },
        data: {
          balance: {
            decrement: stripeProductPriceDecimal,
          },
        },
      });
      // Create the product directly
      const product = await this.prismaService.product.create({
        data: {
          workspaceId: dto.workspaceId,
          formId: dto.formId,
          name: dto.name,
          url: dto.url,
          status: 'listing', // Set status to 'listing' for paid submissions
          featured: true, // Mark as featured, because it's a paid submission
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
          taskReviewCount: 0,
          submitReviewCount: 0,
          receiveReviewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return {
        code: 200,
        message: 'Product created successfully',
        data: product as ProductEntity,
      };
    }
  }

  /**
   * 创建一个免费提交的产品
   * @param uid
   * @param dto
   */
  async createFreeSubmit(
    uid: string,
    dto: CreateProductRequest,
  ): Promise<RRResponse<ProductEntity>> {
    const pendingTasks = await this.prismaService.product.count({
      where: {
        status: {
          in: ['pendingForReceive', 'pendingForSubmit', 'listing'], // Only count products that are pending or under review
        },
        userId: {
          not: uid,
        },
      },
    });
    const taskReviewCount = Math.min(10, pendingTasks);
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
    return {
      code: 200,
      message: 'Product created successfully',
      data: product,
    };
  }

  // /**
  //  * 创建一个免费提交的产品
  //  * @param uid
  //  * @param dto
  //  */
  // async save(
  //   uid: string,
  //   dto: CreateProductRequest,
  // ): Promise<RRResponse<ProductEntity>> {
  //   const product = await this.prismaService.product.create({
  //     data: {
  //       workspaceId: dto.workspaceId,
  //       formId: dto.formId,
  //       name: dto.name,
  //       url: dto.url,
  //       status: 'draft',
  //       icon: dto.icon,
  //       screenshot: dto.screenshot,
  //       category: dto.category as ProductCategory,
  //       description: dto.description,
  //       longDescription: dto.longDescription,
  //       features: dto.features,
  //       useCase: dto.useCase,
  //       howToUse: dto.howToUse,
  //       faq: dto.faq,
  //       //-----------//
  //       userId: uid,
  //       slug: slugify(dto.name, {
  //         lower: true,
  //         strict: true,
  //       }),
  //       taskReviewCount: 0,
  //       submitReviewCount: 0,
  //       receiveReviewCount: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     },
  //   });
  //   return {
  //     code: 200,
  //     message: 'Product created successfully',
  //     data: product,
  //   };
  // }

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
      take: request.pageSize || 10,
      skip: (request.page - 1) * (request.pageSize || 10),
      // include:{
      //   form: true, // Include the form relation
      // }
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        description: true,
        featured: true,
        formId: true,
        form: {
          select: {
            id: true,
            name: true,
            Review: true,
          },
        },
        icon: true,
        screenshot: true,
        taskReviewCount: true,
        submitReviewCount: true,
        receiveReviewCount: true,
      },
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

  async update(uid: string, id: string, dto: UpdateProductRequest) {
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        icon: dto.icon,
        screenshot: dto.screenshot,
        category: dto.category as ProductCategory,
        description: dto.description,
        longDescription: dto.longDescription,
        features: dto.features,
        useCase: dto.useCase,
        howToUse: dto.howToUse,
        faq: dto.faq,
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

  async findBySlug(slug: string) {
    this.logger.debug(`Finding product by slug: ${slug}`);
    const product = await this.prismaService.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        form: {
          select: {
            id: true,
            name: true,
            Review: true, // Include reviews related to the form
          },
        }
      },
    });
    if (!product) {
      this.logger.warn(`Product with slug ${slug} not found`);
      return null;
    }
    return product;
  }
}
