import { PaginateResponse, RRResponse } from '@reviewsup/api/common';
import { authFetch } from './auth-fetch';
import {
  WidgetEntity,
  CreateWidgetDto,
  UpdateWidgetDto,
  VerifyWidgetEmbeddingRequest,
  FindAllWidgetDto,
} from '@reviewsup/api/widgets';

export const widget = {
  getWidgets: (
    request: FindAllWidgetDto,
  ): Promise<PaginateResponse<WidgetEntity>> =>
    authFetch(`/widgets/findAll`, 'POST', request),

  getWidget: (id: string): Promise<WidgetEntity> =>
    authFetch(`/widgets/${id}`, 'GET', {}),

  getWidgetByShortId: (shortId: string): Promise<WidgetEntity> =>
    authFetch(`/widgets/shortId/${shortId}`, 'GET', {}),
  createWidget: (dto: CreateWidgetDto) => authFetch('/widgets', 'POST', dto),
  updateWidget: (id: string, dto: UpdateWidgetDto) =>
    authFetch(`/widgets/${id}`, 'PATCH', dto),
  deleteWidget: (id: string) => authFetch(`/widgets/${id}`, 'DELETE', {}),
  verifyWidgetEmbedding: (
    request: VerifyWidgetEmbeddingRequest,
  ): Promise<RRResponse<boolean>> =>
    authFetch('/widgets/verify', 'POST', request),
};
