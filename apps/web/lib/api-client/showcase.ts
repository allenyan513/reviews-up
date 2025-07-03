import { PaginateResponse } from '@repo/api/common';
import { CreateShowcaseDto } from '@repo/api/showcases';
import { Form, Showcase } from '@repo/database/generated/client/client';
import { ShowcaseEntity } from '@repo/api/showcases';
import { UpdateShowcaseDto } from '@repo/api/showcases';
import { authFetch } from './auth-fetch';

// Define your API methods, each accepting the session object
export const showcase = {
  getShowcases: (workspaceId: string): Promise<PaginateResponse<Showcase>> =>
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
