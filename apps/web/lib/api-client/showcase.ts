import { PaginateResponse } from '@repo/api/common/paginate';
import { CreateShowcaseDto } from '@repo/api/showcases/dto/create-showcase.dto';
import { Form, Showcase } from '@repo/database/generated/client/client';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import { UpdateShowcaseDto } from '@repo/api/showcases/dto/update-showcase.dto';
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
