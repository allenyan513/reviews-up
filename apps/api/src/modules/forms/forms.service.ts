import { Injectable, Logger } from '@nestjs/common';
import {
  CreateFormDto,
  UpdateFormDto,
  FormEntity,
  FormConfig,
} from '@reviewsup/api/forms';
import { PrismaService } from '../prisma/prisma.service';
import { generateShortId } from '@src/libs/shortId';

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
    const config: FormConfig = {
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
        shortId: generateShortId(),
        userId: uid,
        productId: createFormDto.productId,
        name: createFormDto.name,
        config: config,
      },
    });
  }

  async findAll(uid: string, productId: string) {
    const forms = await this.prismaService.form.findMany({
      where: {
        userId: uid,
        productId: productId,
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      include: {
        reviews: {
          select: {
            id: true,
          },
        },
      },
    });
    return forms.map((form) => ({
      ...form,
      //todo
      reviewCount: 0,
      isBindProduct: false,
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

  /**
   * find form by shortId or id
   * @param shortId
   */
  async findOneByShortId(shortId: string) {
    return this.prismaService.form.findFirst({
      where: {
        OR: [{ shortId: shortId }, { id: shortId }],
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
    const form = await this.prismaService.form.findFirst({
      where: {
        id: id,
        userId: uid,
      },
    });

    if (!form) {
      throw new Error('Form not found or does not belong to the user');
    }

    const [, deletedForm] = await this.prismaService.$transaction([
      this.prismaService.campaign.deleteMany({
        where: {
          formId: id,
        },
      }),
      this.prismaService.form.delete({
        where: {
          id: id,
        },
      }),
    ]);
    return deletedForm;
  }
}
