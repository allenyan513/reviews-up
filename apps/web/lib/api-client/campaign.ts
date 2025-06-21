import {CreateFormDto} from '@repo/api/forms/dto/create-form.dto';
import {Form} from '@repo/database/generated/client/client';
import {FormEntity} from '@repo/api/forms/entities/form.entity';
import {UpdateFormDto} from '@repo/api/forms/dto/update-form.dto';
import {authFetch} from './auth-fetch';
import {CampaignEntity, CreateCampaignDto, UpdateCampaignDto} from "@repo/api/campaign/index";

export const campaign = {
  findAll: (workspaceId: string): Promise<CampaignEntity[]> =>
    authFetch(`/campaigns/workspaceId/${workspaceId}`, 'GET', {}),

  findOne: (id: string): Promise<CampaignEntity> =>
    authFetch(`/campaigns/${id}`, 'GET', {}),

  create: (dto: CreateCampaignDto): Promise<CampaignEntity> =>
    authFetch('/campaigns', 'POST', dto),

  update: (id: string, dto: UpdateCampaignDto) =>
    authFetch(`/campaigns/${id}`, 'PATCH', dto),

  deleteOne: (id: string) => authFetch(`/campaigns/${id}`, 'DELETE', {}),
};
