import { PaginateResponse, RRResponse } from '@reviewsup/api/common';
import { authFetch } from './auth-fetch';
import {
  WidgetEntity,
  CreateWidgetDto,
  UpdateWidgetDto,
  VerifyWidgetEmbeddingRequest,
} from '@reviewsup/api/widgets';

export const widget = {
  getWidgets: (productId: string): Promise<PaginateResponse<WidgetEntity>> =>
    authFetch(`/widgets/productId/${productId}`, 'GET', {}),
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
