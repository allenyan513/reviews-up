import { PaginateResponse } from '@reviewsup/api/common';
import { CreateShowcaseDto } from '@reviewsup/api/showcases';
import { ShowcaseEntity } from '@reviewsup/api/showcases';
import { UpdateShowcaseDto } from '@reviewsup/api/showcases';
import { authFetch } from './auth-fetch';

// Define your API methods, each accepting the session object
export const showcase = {
  getShowcases: (workspaceId: string): Promise<PaginateResponse<ShowcaseEntity>> =>
    authFetch(`/showcases/workspaceId/${workspaceId}`, 'GET', {}),
  getShowcase: (id: string): Promise<ShowcaseEntity> =>
    authFetch(`/showcases/${id}`, 'GET', {}),
  getShowcaseByShortId: (shortId: string): Promise<ShowcaseEntity> =>
    authFetch(`/showcases/shortId/${shortId}`, 'GET', {}),
  createShowcase: (dto: CreateShowcaseDto) =>
    authFetch('/showcases', 'POST', dto),
  updateShowcase: (id: string, dto: UpdateShowcaseDto) =>
    authFetch(`/showcases/${id}`, 'PATCH', dto),
  deleteShowcase: (id: string) => authFetch(`/showcases/${id}`, 'DELETE', {}),
};
