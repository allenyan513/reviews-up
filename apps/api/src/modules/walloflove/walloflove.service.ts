import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateWallOfLoveDto,
  WallOfLoveEntity,
} from '@reviewsup/api/walloflove';

@Injectable()
export class WallOfLoveService {
  private logger = new Logger('WallOfLoveService');

  constructor(private prismaService: PrismaService) {}

  async findOneByProductId(uid: string, productIdOrSlug: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
      },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    const wallOfLove = await this.prismaService.wallOfLove.findFirst({
      where: {
        productId: product.id,
      },
      include: {
        product: true,
      },
    });
    if (!wallOfLove) {
      throw new Error('Wall of Love not found for this product');
    }
    const reviews = await this.prismaService.review.findMany({
      where: {
        productId: product.id,
      },
    });

    return {
      ...wallOfLove,
      reviews: reviews,
    } as WallOfLoveEntity;
  }

  async update(uid: string, id: string, dto: UpdateWallOfLoveDto) {
    return this.prismaService.wallOfLove.update({
      where: {
        id: id,
        userId: uid,
      },
      data: {
        ...dto,
        config: {
          ...dto.config,
        },
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.wallOfLove.delete({
      where: {
        id: id,
        userId: uid,
      },
    });
  }
}
