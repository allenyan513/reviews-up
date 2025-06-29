import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCampaignDto,
  createCampaignSchema,
  FindAllCampaignsRequest,
  UpdateCampaignDto,
} from '@repo/api/campaign/index';
import { ResendEmailService } from '@src/modules/email/resend-email.service';
import { render } from '@react-email/render';
import * as React from 'react';
import CampaignEmail from '@src/emails/campaign-email';
import { PaginateResponse } from '@repo/api/common/paginate';

@Injectable()
export class CampaignsService {
  private logger = new Logger('CampaignsService');

  constructor(
    private prismaService: PrismaService,
    private emailService: ResendEmailService,
  ) {}

  async create(uid: string, dto: CreateCampaignDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: uid,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.subscriptionTier == 'free' && dto.isTest == false) {
      throw new HttpException(
        'Free users can only send test campaigns. Please upgrade your plan to send real campaigns.',
        403,
      );
    }
    const validatedDto = createCampaignSchema.parse(dto);
    const form = await this.prismaService.form.findUnique({
      where: {
        id: validatedDto.formId,
      },
    });
    if (!form || form.userId !== uid) {
      throw new Error('Form not found or does not belong to the user');
    }
    let html = await render(
      React.createElement(CampaignEmail, {
        content: validatedDto.content,
        formUrl: `${process.env.APP_URL}/forms/${form.shortId}`,
        buttonText: validatedDto.buttonText,
      }),
    );
    const from = `${validatedDto.fromName} <${validatedDto.fromEmail}>`;
    const to = validatedDto.isTest ? [user.email] : validatedDto.toEmails;
    for (const item in to) {
      const toName = to[item].split('@')[0] || 'Reviewsup.io User';
      const replacedSubject = validatedDto.subject.replace(/{{name}}/g, toName);
      const replacedHtml = html.replace(/{{name}}/g, toName);
      const res = await this.emailService.send({
        from: from,
        to: to[item],
        subject: replacedSubject,
        html: replacedHtml,
      });
      this.logger.debug(`Email sent to ${to[item]}: ${res}`);
    }
    //save campaign to database
    return this.prismaService.campaign.create({
      data: {
        userId: uid,
        workspaceId: validatedDto.workspaceId,
        formId: validatedDto.formId,
        name: validatedDto.name,
        fromName: validatedDto.fromName,
        fromEmail: validatedDto.fromEmail,
        toEmails: to,
        subject: validatedDto.subject,
        content: validatedDto.content,
        isTest: validatedDto.isTest,
        buttonText: validatedDto.buttonText,
        status: 'sent',
      },
    });
  }

  async findAll(request: FindAllCampaignsRequest) {
    this.logger.debug('Fetching campaigns with pagination', request);
    if (!request.workspaceId) {
      throw new Error('Workspace ID is required to fetch reviews');
    }
    const total = await this.prismaService.campaign.count({
      where: {
        workspaceId: request.workspaceId,
      },
    });
    const items = await this.prismaService.campaign.findMany({
      where: {
        workspaceId: request.workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
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
      },
    } as PaginateResponse<any>;
  }

  async findOne(uid: string, id: string) {
    const campaign = await this.prismaService.campaign.findUnique({
      where: {
        id: id,
      },
    });
    if (!campaign || campaign.userId !== uid) {
      throw new Error('Form not found or does not belong to the user');
    }
    return campaign;
  }

  async update(uid: string, id: string, dto: UpdateCampaignDto) {
    this.logger.debug(`Updating campaign with id: ${id} for user: ${uid}`);
    return this.prismaService.campaign.update({
      where: {
        id: id,
        userId: uid,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.campaign.delete({
      where: {
        id: id,
        userId: uid,
      },
    });
  }
}
