import { authFetch } from './auth-fetch';
import {
  CampaignEntity,
  CreateCampaignDto,
  FindAllCampaignsRequest,
  UpdateCampaignDto,
} from '@reviewsup/api/campaign';
import { PaginateResponse } from '@reviewsup/api/common';

export const campaign = {
  findAll: (
    request: FindAllCampaignsRequest,
  ): Promise<PaginateResponse<CampaignEntity>> =>
    authFetch(`/campaigns/productId/${request.productId}`, 'GET', {
      page: request.page,
      pageSize: request.pageSize,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder,
    }),

  findOne: (id: string): Promise<CampaignEntity> =>
    authFetch(`/campaigns/${id}`, 'GET', {}),

  create: (dto: CreateCampaignDto): Promise<CampaignEntity> =>
    authFetch('/campaigns', 'POST', dto),

  update: (id: string, dto: UpdateCampaignDto) =>
    authFetch(`/campaigns/${id}`, 'PATCH', dto),

  deleteOne: (id: string) => authFetch(`/campaigns/${id}`, 'DELETE', {}),
};
