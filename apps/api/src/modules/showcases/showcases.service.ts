import { Injectable, Logger } from '@nestjs/common';
import { CreateShowcaseDto } from '@repo/api/showcases/dto/create-showcase.dto';
import { UpdateShowcaseDto } from '@repo/api/showcases/dto/update-showcase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateRequest, PaginateResponse } from '@repo/api/common/paginate';
import { Showcase } from '@repo/database/generated/client';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import { generateShortId } from '../../libs/shortId';

@Injectable()
export class ShowcasesService {
  private logger = new Logger('ShowcasesService');
  private defaultConfig = {
    type: 'list', // Default type for showcases
  };

  constructor(private prismaService: PrismaService) {}

  async create(uid: string, createShowcaseDto: CreateShowcaseDto) {
    return this.prismaService.showcase.create({
      data: {
        shortId: generateShortId(),
        userId: uid,
        workspaceId: createShowcaseDto.workspaceId,
        name: createShowcaseDto.name,
        config: this.defaultConfig,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(
    uid: string,
    workspaceId: string,
    paginateRequest: PaginateRequest,
  ) {
    this.logger.debug(
      'Fetching showcases for user',
      uid,
      workspaceId,
      paginateRequest,
    );
    if (!uid || !workspaceId || !paginateRequest) {
      throw new Error('Workspace ID is required to fetch reviews');
    }
    const total = await this.prismaService.showcase.count({
      where: {
        userId: uid,
        workspaceId: workspaceId,
      },
    });
    const items = await this.prismaService.showcase.findMany({
      where: {
        userId: uid,
        workspaceId: workspaceId,
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
    } as PaginateResponse<Showcase>;
  }

  /**
   * showcase 包含一个workspaceId
   * workspaceId 可以关联到全部的reviews, 根据showcase自身的preference来筛选reviews, 需要持久化保存这些preferences, 在对外暴露的API中可以使用
   * @param uid
   * @param id
   */
  async findOne(uid: string, id: string): Promise<ShowcaseEntity> {
    const showcase = await this.prismaService.showcase.findUnique({
      where: {
        id: id,
      },
    });
    if (!showcase || showcase.userId !== uid) {
      throw new Error('Showcase not found or access denied');
    }
    const workspaceId = showcase.workspaceId;
    const reviews = await this.prismaService.review.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      ...showcase,
      reviews: reviews,
    } as ShowcaseEntity;
  }

  /**
   * update showcase 可以修改 name 或者 config
   * @param uid
   * @param id
   * @param dto
   */
  async update(uid: string, id: string, dto: UpdateShowcaseDto) {
    this.logger.debug('Updating showcase', id, 'for user', uid, dto);
    return this.prismaService.showcase.update({
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
    return this.prismaService.showcase.delete({
      where: {
        id: id,
        userId: uid,
      },
    });
  }

  async findOneByShortId(shortId: string) {
    this.logger.debug(`Finding showcase by shortId: ${shortId}`);
    const showcase = await this.prismaService.showcase.findUnique({
      where: {
        shortId: shortId,
      },
    });
    if (!showcase) {
      throw new Error('Showcase not found');
    }
    const workspaceId = showcase.workspaceId;
    const reviews = await this.prismaService.review.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      ...showcase,
      reviews: reviews,
    } as ShowcaseEntity;
  }
}
