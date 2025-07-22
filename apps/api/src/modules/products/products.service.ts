import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CrawlProductResponse,
  CreateProductRequest,
  FindAllRequest,
  ProductEntity,
  SubmitProductRequest,
  UpdateProductRequest,
} from '@reviewsup/api/products';
import slugify from 'slugify';
import { $Enums } from '@reviewsup/database/generated/client';
import ProductStatus = $Enums.ProductStatus;
import ProductCategory = $Enums.ProductCategory;
import { OrdersService } from '../orders/orders.service';
import {
  PaginateRequest,
  PaginateResponse,
  RRResponse,
} from '@reviewsup/api/common';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';
import { BrowserlessService } from '@src/modules/browserless/browserless.service';
import { S3Service } from '@src/modules/s3/s3.service';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { hash } from '@src/libs/utils';
import { defaultUserData } from '@src/modules/users/default-data';
import { FormsService } from '../forms/forms.service';
import { WidgetsService } from '../widgets/widgets.service';
import { WidgetEntity } from '@reviewsup/api/widgets';
import ReactDOMServer from 'react-dom/server';
import { BadgeSvg } from './badge.svg';
import * as React from 'react';
import * as cheerio from 'cheerio';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    private prismaService: PrismaService,
    private orderService: OrdersService,
    private browserlessService: BrowserlessService,
    private s3Service: S3Service,
    private formsService: FormsService,
    private widgetsService: WidgetsService,
  ) {}

  /**
   * @param uid
   * @param dto
   */
  async create(uid: string, dto: CreateProductRequest) {
    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });
    //check if the product with the same slug already exists
    const existingProduct = await this.prismaService.product.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existingProduct) {
      this.logger.error(
        `Product with slug ${slug} already exists for user ${uid}`,
      );
      throw new BadRequestException(`Product with slug ${slug} already exists`);
    }
    const creator = await this.prismaService.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    if (!creator) {
      this.logger.error(`User with ID ${uid} not found`);
      throw new BadRequestException(`User with ID ${uid} not found`);
    }
    const newProduct = await this.prismaService.product.create({
      data: {
        userId: uid,
        name: dto.name,
        slug: slug,
        tagline: dto.tagline,
        url: dto.url,
        status: 'pendingForSubmit',
        icon: dto.icon,
        screenshots: dto.screenshots || [],
        description: dto.description,
        tags: dto.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const defaultForm = await this.formsService.create(uid, {
      name: defaultUserData.form,
      productId: newProduct.id,
    });
    if (!defaultForm) {
      throw new Error('Unable to create default workspace');
    }
    for (const review of defaultUserData.reviews) {
      await this.prismaService.review.create({
        data: {
          productId: newProduct.id,
          formId: defaultForm.id,
          reviewerName: review.reviewerName,
          reviewerImage: review.reviewerImage,
          reviewerTitle: review.reviewerTitle,
          rating: review.rating,
          text: review.text,
          status: review.status,
        },
      });
    }
    //add user's first review
    if (dto.firstReview) {
      await this.prismaService.review.create({
        data: {
          productId: newProduct.id,
          formId: defaultForm.id,
          reviewerName: creator.name,
          reviewerImage: creator.avatarUrl,
          reviewerTitle: '',
          rating: 5,
          text: dto.firstReview,
          status: 'public', // 默认状态为 public
        },
      });
    }

    //创建两个默认的widget，一个是badge类型，一个是
    const protectedBadgeWidget = await this.widgetsService.create(uid, {
      productId: newProduct.id,
      name: defaultUserData.widget,
      isProtected: true,
      config: {
        type: 'badge',
      },
    });
    const defaultWidget = await this.widgetsService.create(uid, {
      productId: newProduct.id,
      name: defaultUserData.widget,
    });
    if (!defaultWidget || !protectedBadgeWidget) {
      throw new Error('Unable to create default showcase');
    }
    return newProduct as ProductEntity;
  }

  async crawlProductInfo(userId: string, url: string) {
    this.logger.debug(
      `Crawling product info for user ${userId} with URL: ${url}`,
    );
    const validatedUrl = new URL(url);
    const { title, description, content, faviconFilePath, screenshotFilePath } =
      await this.browserlessService.extract(validatedUrl.href, {
        contentEnable: false,
        faviconEnable: true,
        screenshotEnable: true,
      });
    this.logger.debug(`Extracted Result:`, {
      title,
      description,
      faviconFilePath,
      screenshotFilePath,
    });

    let faviconUrl = '';
    if (fs.existsSync(faviconFilePath)) {
      const faviconKey = `${hash(Date.now().toString())}${mime.lookup(faviconFilePath)}`;
      await this.s3Service.uploadFile(
        faviconKey,
        fs.readFileSync(faviconFilePath),
        mime.lookup(faviconFilePath) || 'image/png',
      );
      faviconUrl = this.s3Service.getUrl(faviconKey);
    }

    let screenshotUrl = '';
    if (fs.existsSync(screenshotFilePath)) {
      const screenshotKey = `${hash(Date.now().toString())}${mime.lookup(screenshotFilePath)}`;
      await this.s3Service.uploadFile(
        screenshotKey,
        fs.readFileSync(screenshotFilePath),
        mime.lookup(screenshotFilePath) || 'image/png',
      );
      screenshotUrl = this.s3Service.getUrl(screenshotKey);
    }
    return {
      title: title,
      description: description,
      faviconUrl: faviconUrl,
      screenshotUrl: screenshotUrl,
    } as CrawlProductResponse;
  }

  /**
   * 申请创建一个产品
   * 分成多种提交方式：1）免费提交 2）付费提交
   * 付费提交需要检查用户是否有足够的余额，没有的话就返回支付链接,如果有余额的话就直接创建产品
   * @param uid
   * @param dto
   */
  async submit(
    uid: string,
    dto: SubmitProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> {
    if (dto.submitOption === 'paid-submit') {
      return this.createPaidSubmit(uid, dto);
    } else if (dto.submitOption === 'free-submit') {
      return this.createFreeSubmit(uid, dto);
    }
    // else if (dto.submitOption === 'verify-submit') {
    //   return this.createVerifySubmit(uid, dto);
    // }
    else {
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
    dto: SubmitProductRequest,
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
      const product = await this.prismaService.product.update({
        where: {
          id: dto.id,
        },
        data: {
          status: 'listing',
          bindingFormId: dto.bindingFormId,
          featured: true,
          taskReviewCount: 0,
          submitReviewCount: 0,
          receiveReviewCount: 0,
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

  async getTaskReviewCount(uid: string): Promise<RRResponse<number>> {
    const pendingTasks = await this.prismaService.product.count({
      where: {
        status: {
          in: ['pendingForReceive', 'listing'], // Only count products that are pending or under review
        },
        userId: {
          not: uid,
        },
      },
    });
    return {
      code: 200,
      message: 'Task review count retrieved successfully',
      data: Math.min(1, pendingTasks), // Limit to a maximum of 10
    };
  }

  /**
   * 创建一个免费提交的产品
   * @param uid
   * @param dto
   */
  async createFreeSubmit(
    uid: string,
    dto: SubmitProductRequest,
  ): Promise<RRResponse<ProductEntity>> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: {
        id: dto.id,
      },
    });
    if (!existingProduct) {
      this.logger.error(`Product with ID ${dto.id} not found for user ${uid}`);
      return {
        code: 404,
        message: `Product with ID ${dto.id} not found`,
        data: null,
      };
    }
    if (dto.skipVerify === false) {
      const targets = [process.env.NEXT_PUBLIC_WWW_URL];
      const verifyResult = await this.verifyEmbedCode(
        targets,
        existingProduct.url,
      );
      if (verifyResult.code !== 200 || !verifyResult.data) {
        this.logger.error(
          `Widget embedding verification failed for user ${uid} with URL: ${existingProduct.url}`,
        );
        return {
          code: 400,
          message: 'Widget embedding verification failed',
          data: null,
        };
      }
    }
    const taskReviewCountResult = await this.getTaskReviewCount(uid);
    const taskReviewCount = taskReviewCountResult.data || 0;
    const status = taskReviewCount > 0 ? 'pendingForReceive' : 'listing';
    const product = await this.prismaService.product.update({
      where: {
        id: dto.id,
      },
      data: {
        status: status,
        bindingFormId: dto.bindingFormId,
        taskReviewCount: taskReviewCount,
        submitReviewCount: 0,
        receiveReviewCount: 0,
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
  //  * 创建一个验证提交的产品
  //  * @param uid
  //  * @param dto
  //  */
  // async createVerifySubmit(
  //   uid: string,
  //   dto: UpdateProductRequest,
  // ): Promise<RRResponse<ProductEntity>> {
  //   // step1. verify if the widget is embedded in the url website
  //   const verifyResult = await this.widgetsService.verifyWidgetEmbedding(uid, {
  //     url: dto.url,
  //   });
  //   if (verifyResult.code !== 200 || !verifyResult.data) {
  //     this.logger.error(
  //       `Widget embedding verification failed for user ${uid} with URL: ${dto.url}`,
  //     );
  //     return {
  //       code: 400,
  //       message: 'Widget embedding verification failed',
  //       data: null,
  //     };
  //   }
  //   const product = await this.prismaService.product.update({
  //     where: {
  //       id: dto.id,
  //     },
  //     data: {
  //       status: 'listing',
  //       bindingFormId: dto.bindingFormId,
  //       featured: true,
  //       taskReviewCount: 0,
  //       submitReviewCount: 0,
  //       receiveReviewCount: 0,
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
  ): Promise<PaginateResponse<ProductEntity>> {
    this.logger.debug('request to findAll products', request);
    const { status } = request;
    const whereCondition: any = {
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
      ...(request.tags &&
        request.tags.length > 0 && {
          tags: {
            hasSome: request.tags, // Filter by tags if provided
          },
        }),
    };
    const total = await this.prismaService.product.count({
      where: {
        ...whereCondition,
      },
    });
    const items = await this.prismaService.product.findMany({
      where: {
        ...whereCondition,
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      take: request.pageSize || 10,
      skip: (request.page - 1) * (request.pageSize || 10),
      include: {
        user: true,
        reviews: true,
      },
    });
    const map = {};
    for (const item of items) {
      //所有status=public 的review
      const publicReviews = item.reviews.filter(
        (review) => review.status === 'public',
      );
      const reviewCount = publicReviews.length;
      const reviewRating =
        publicReviews.reduce((sum, review) => sum + review.rating, 0) /
        (reviewCount || 1);
      map[item.id] = {
        reviewCount: reviewCount,
        reviewRating: reviewRating,
        reviewRatingStr: reviewRating.toFixed(1),
      };
    }

    return {
      items: items.map((item) => {
        const finalItem = {
          ...item,
          reviewCount: map[item.id]?.reviewCount || 0,
          reviewRating: map[item.id]?.reviewRating || 0,
          reviewRatingStr: map[item.id]?.reviewRatingStr || '0.0',
        };
        delete finalItem.reviews; // Remove reviews from the response
        return finalItem;
      }),
      meta: {
        page: request.page,
        pageSize: request.pageSize || 10,
        total: total,
        pageCount: Math.ceil(total / (request.pageSize || 10)),
      },
    };
  }

  /**
   *
   * @param id or slug
   */
  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.prismaService.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        reviews: true,
      },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${id} not found`);
    }
    //所有status=public 的review
    const publicReviews = product.reviews.filter(
      (review) => review.status === 'public',
    );
    const reviewCount = publicReviews.length;
    const reviewRating =
      publicReviews.reduce((sum, review) => sum + review.rating, 0) /
      (reviewCount || 1);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: product.userId,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    return {
      ...product,
      user: user,
      reviews: publicReviews,
      reviewCount: reviewCount,
      reviewRating: reviewRating,
      reviewRatingStr: reviewRating.toFixed(1),
    } as ProductEntity;
  }

  /**
   * 根据productId 查询返回 reviewCount,reviewRating,reviewRatingStr
   */
  // async findOneWithReviewInfo(productId: string): Promise<{
  //   reviewCount: number;
  //   reviewRating: number;
  //   reviewRatingStr: string;
  // }> {
  //   const product = await this.prismaService.product.findUnique({
  //     where: {
  //       id: productId,
  //     },
  //     include: {
  //       reviews: true,
  //     },
  //   });
  //   if (!product) {
  //     throw new BadRequestException(`Product with ID ${productId} not found`);
  //   }
  //   //所有status=public 的review
  //   const publicReviews = product.reviews.filter(
  //     (review) => review.status === 'public',
  //   );
  //   const reviewCount = publicReviews.length;
  //   const reviewRating =
  //     publicReviews.reduce((sum, review) => sum + review.rating, 0) /
  //     (reviewCount || 1);
  //   return {
  //     reviewCount: reviewCount,
  //     reviewRating: reviewRating,
  //     reviewRatingStr: reviewRating.toFixed(1),
  //   };
  // }

  async update(uid: string, id: string, dto: UpdateProductRequest) {
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        icon: dto.icon,
        screenshots: dto.screenshots || [],
        description: dto.description,
        tagline: dto.tagline,
        tags: dto.tags || [],
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
  async onReviewSubmitted(reviewId: string) {
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
    if (review.reviewerId === review.ownerId) {
      this.logger.debug(
        `Reviewer and owner are the same for reviewId: ${reviewId}`,
      );
      return;
    }
    if (review.reviewerId) {
      //todo 如何用户有多个products,提交的review算到哪个产品上？
      //提交评价用户, 查询处于pendingForReceive的产品，给它的submitReviewCount + 1
      const product = await this.prismaService.product.findFirst({
        where: {
          userId: review.reviewerId,
          status: {
            in: ['pendingForReceive'], // Only count products that are pending or under review
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
      }
      // else if (newSubmitReviewCount > product.receiveReviewCount) {
      //   newStatus = 'pendingForReceive'; // 提交评价计数超过接收评价计数，切换到 pendingForReceive 状态
      // }
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
    // if (review.ownerId) {
    //   //update review owner
    //   const product = await this.prismaService.product.findFirst({
    //     where: {
    //       userId: review.ownerId,
    //       status: {
    //         in: ['pendingForReceive', 'listing'], // Only count products that are pending or under review
    //       },
    //     },
    //     select: {
    //       id: true,
    //       status: true,
    //       submitReviewCount: true,
    //       receiveReviewCount: true,
    //     },
    //   });
    //   if (!product) {
    //     this.logger.debug(
    //       `No product found for user ${review.ownerId} with status pendingForReceive, pendingFroSubmit or listing`,
    //     );
    //     return;
    //   }
    //   //如果 status 是 listing, 则不需要更新status
    //   const newReceiveReviewCount = product.receiveReviewCount + 1;
    //   let newStatus = product.status;
    //   if (
    //     newStatus !== 'listing' && // 如果当前状态不是 listing
    //     newReceiveReviewCount >= product.submitReviewCount
    //   ) {
    //     newStatus = 'pendingForSubmit'; // 达到接收评价计数，切换到 pendingFroSubmit 状态
    //   }
    //   // 更新被提交人产品的接收评价计数
    //   await this.prismaService.product.update({
    //     where: {
    //       id: product.id,
    //     },
    //     data: {
    //       receiveReviewCount: newReceiveReviewCount,
    //       status: newStatus,
    //       updatedAt: new Date(),
    //     },
    //   });
    // }
    this.logger.debug(`onReviewSubmitted completed for reviewId: ${reviewId}`);
  }

  async generateProductBadgeSvg(id: string, theme: 'light' | 'dark') {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    const el = React.createElement(BadgeSvg, {
      averageRating: product.reviewRating,
      totalReviews: product.reviewCount,
      theme: theme,
    });
    const svgString = ReactDOMServer.renderToStaticMarkup(el);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;
  }

  /**
   * @param targets
   * @param url
   */
  async verifyEmbedCode(
    targets: string[],
    url: string,
  ): Promise<RRResponse<boolean>> {
    const { content } = await this.browserlessService.extract(url, {
      contentEnable: true,
      faviconEnable: false,
      screenshotEnable: false,
    });
    if (!content) {
      this.logger.error(`No content found for URL: ${url}`);
      return {
        code: 400,
        message: 'No content found for the provided URL',
        data: false,
      };
    }
    const $ = cheerio.load(content);
    let linkExists = false;
    for (const target of targets) {
      const linkSelector = `a[href*="${target}"]`;
      if ($(linkSelector).length > 0) {
        linkExists = true;
        break; // 如果找到一个匹配的链接，就可以停止检查
      }
    }
    return {
      code: linkExists ? 200 : 400,
      message: linkExists
        ? 'Widget embedding verified successfully!'
        : 'Widget embedding verification failed',
      data: linkExists,
    } as RRResponse<boolean>;
  }
}
