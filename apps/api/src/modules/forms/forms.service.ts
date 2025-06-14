import { Injectable, Logger } from '@nestjs/common';
import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateShortId } from '../../libs/shortId';
import { FormEntity } from '@repo/api/forms/entities/form.entity';

@Injectable()
export class FormsService {
  private logger = new Logger('FormsService');

  constructor(private prismaService: PrismaService) {}

  async create(uid: string, createFormDto: CreateFormDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: uid,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const config = {
      brand: {
        name: user.name,
        logo: user.avatarUrl,
        slogan: user.email,
        url: '',
      },
      welcome: {
        title: 'Would You mind to give us some feedback?',
        message:
          'We are always looking to improve our product. Your feedback is very important to us.',
      },
      thankyou: {
        title: 'Thank You for Submitting',
        message: 'We hope you found what you were looking for. Come back soon!',
      },
    };
    return this.prismaService.form.create({
      data: {
        ...createFormDto,
        shortId: generateShortId(),
        userId: uid,
        config: config,
      },
    });
  }

  async findAll(uid: string, workspaceId: string) {
    const forms = await this.prismaService.form.findMany({
      where: {
        userId: uid,
        workspaceId: workspaceId, // Filter by workspace if provided
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      include: {
        Review: {
          select: {
            id: true,
          },
        },
      },
    });
    return forms.map((form) => ({
      ...form,
      reviewCount: form.Review.length, // Add review count to each form
    })) as FormEntity[];
  }

  async findOne(uid: string, id: string) {
    const form = await this.prismaService.form.findUnique({
      where: {
        id: id,
      },
    });
    if (!form || form.userId !== uid) {
      throw new Error('Form not found or does not belong to the user');
    }
    return form;
  }

  async findOneByShortId(shortId: string) {
    return this.prismaService.form.findUnique({
      where: {
        shortId: shortId,
      },
    });
  }

  async update(uid: string, id: string, updateFormDto: UpdateFormDto) {
    this.logger.debug(
      `Updating form with ID: ${id} for user: ${uid}`,
      updateFormDto,
    );
    return this.prismaService.form.update({
      where: {
        id: id,
        userId: uid,
      },
      data: {
        ...updateFormDto,
        config: {
          ...updateFormDto.config, // Merge with default config
        },
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.form.delete({
      where: {
        id: id,
      },
    });
  }
}
