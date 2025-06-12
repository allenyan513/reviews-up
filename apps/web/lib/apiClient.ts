import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { S3SignedUrlEntity } from '@repo/api/s3/entity/s3-signed-url.entity';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { PaginateResponse } from '@repo/api/common/paginate';
import { CreateShowcaseDto } from '@repo/api/showcases/dto/create-showcase.dto';
import { Form, Showcase } from '@repo/database/generated/client/client';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';
import { FindAllReviewRequest } from '@repo/api/reviews/find-all-review.dto';
import { UpdateShowcaseDto } from '@repo/api/showcases/dto/update-showcase.dto';
async function authFetch(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  data: Record<string, any> = {},
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  let url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  if (method === 'GET' || method === 'DELETE') {
    const queryString = new URLSearchParams(data).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  } else if (method === 'POST' || method === 'PATCH') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access. Session might be expired.');
    }
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error in authFetch:', error);
    throw error;
  }
}

// Define your API methods, each accepting the session object
export const api = {
  getUserProfile: (): Promise<User> => authFetch('/users/profile', 'GET', {}),

  createWorkspace: (dto: CreateWorkspaceDto): Promise<Workspace> =>
    authFetch('/workspaces', 'POST', dto),

  getForms: (workspaceId: string): Promise<FormEntity[]> =>
    authFetch(`/forms/workspaceId/${workspaceId}`, 'GET', {}),

  getForm: (id: string): Promise<FormEntity> =>
    authFetch(`/forms/${id}`, 'GET', {}),

  getFormByShortId: (shortId: string): Promise<FormEntity> =>
    authFetch(`/forms/shortId/${shortId}`, 'GET', {}),

  createForm: (dto: CreateFormDto): Promise<Form> =>
    authFetch('/forms', 'POST', dto),

  updateForm: (id: string, dto: UpdateFormDto) =>
    authFetch(`/forms/${id}`, 'PATCH', dto),

  deleteForm: (id: string) => authFetch(`/forms/${id}`, 'DELETE', {}),

  getReviews: (
    request: FindAllReviewRequest,
  ): Promise<PaginateResponse<ReviewEntity>> =>
    authFetch(`/reviews/workspaceId/${request.workspaceId}`, 'GET', {
      page: request.page,
      pageSize: request.pageSize,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder,
    }),

  getReview: (id: string) => authFetch(`/reviews/${id}`, 'GET', {}),
  submitReview: (dto: CreateReviewDto): Promise<ReviewEntity> =>
    authFetch('/reviews/submit', 'POST', dto),
  updateReview: (id: string, dto: UpdateReviewDto) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto),
  deleteReview: (id: string) => authFetch(`/reviews/${id}`, 'DELETE', {}),
  getSignedUrl: (dto: S3GetSignedUrlDto): Promise<S3SignedUrlEntity> =>
    authFetch('/s3/getSignedUrl', 'POST', dto),
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
