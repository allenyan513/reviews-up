import { Session } from 'next-auth';
import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { S3SignedUrlEntity } from '@repo/api/s3/entity/s3-signed-url.entity';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';
import { Review } from '@repo/api/reviews/entities/review.entity';
import { PaginateResponse } from '@repo/api/common/Paginate';
import { CreateShowcaseDto } from '@repo/api/showcases/dto/create-showcase.dto';
import { Form, Showcase } from '@repo/database/generated/client/client';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';

interface ApiOptions {
  session: Session | null;
}

// A helper function for making authenticated fetch requests
async function authFetch(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  data: Record<string, any> = {},
  options?: ApiOptions,
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    idToken: options?.session?.user?.idToken || '', // Ensure your NextAuth config provides idToken
  };
  const config: RequestInit = {
    method,
    headers,
  };

  let url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  if (method === 'GET' || method === 'DELETE') {
    const queryString = new URLSearchParams(data).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  } else if (method === 'POST'  || method === 'PATCH') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized specifically, maybe log out or redirect
        console.error('Unauthorized access. Session might be expired.');
      }
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error ${method}ing data from ${endpoint}:`, error);
    throw error;
  }
}

// Define your API methods, each accepting the session object
export const api = {
  getUserProfile: (options: ApiOptions): Promise<User> =>
    authFetch('/users/profile', 'GET', {}, options),

  createWorkspace: (
    dto: CreateWorkspaceDto,
    options: ApiOptions,
  ): Promise<Workspace> => authFetch('/workspaces', 'POST', dto, options),

  getForms: (workspaceId: string, options: ApiOptions): Promise<FormEntity[]> =>
    authFetch(`/forms/workspaceId/${workspaceId}`, 'GET', {}, options),

  getForm: (id: string, options: ApiOptions): Promise<FormEntity> =>
    authFetch(`/forms/${id}`, 'GET', {}, options),

  getFormByShortId: (
    shortId: string,
    options: ApiOptions,
  ): Promise<FormEntity> =>
    authFetch(`/forms/shortId/${shortId}`, 'GET', {}, options),

  createForm: (dto: CreateFormDto, options: ApiOptions): Promise<Form> =>
    authFetch('/forms', 'POST', dto, options),

  updateForm: (id: string, dto: UpdateFormDto, options: ApiOptions) =>
    authFetch(`/forms/${id}`, 'PATCH', dto, options),

  deleteForm: (id: string, options: ApiOptions) =>
    authFetch(`/forms/${id}`, 'DELETE', {}, options),

  getReviews: (
    workspaceId: string,
    options: ApiOptions,
  ): Promise<PaginateResponse<any>> =>
    authFetch(`/reviews/workspaceId/${workspaceId}`, 'GET', {}, options),

  getReview: (id: string, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'GET', {}, options),

  submitReview: (dto: CreateReviewDto, options: ApiOptions): Promise<Review> =>
    authFetch('/reviews/submit', 'POST', dto, options),

  updateReview: (id: string, dto: CreateReviewDto, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto, options),

  deleteReview: (id: string, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'DELETE', {}, options),

  getSignedUrl: (
    dto: S3GetSignedUrlDto,
    options: ApiOptions,
  ): Promise<S3SignedUrlEntity> =>
    authFetch('/reviews/getSignedUrl', 'POST', dto, options),

  getShowcases: (
    workspaceId: string,
    options: ApiOptions,
  ): Promise<PaginateResponse<Showcase>> =>
    authFetch(`/showcases/workspaceId/${workspaceId}`, 'GET', {}, options),
  getShowcase: (id: string, options: ApiOptions): Promise<ShowcaseEntity> =>
    authFetch(`/showcases/${id}`, 'GET', {}, options),
  getShowcaseByShortId: (
    shortId: string,
    options: ApiOptions,
  ): Promise<ShowcaseEntity> =>
    authFetch(`/showcases/shortId/${shortId}`, 'GET', {}, options),
  createShowcase: (dto: CreateShowcaseDto, options: ApiOptions) =>
    authFetch('/showcases', 'POST', dto, options),
  updateShowcase: (id: string, dto: CreateShowcaseDto, options: ApiOptions) =>
    authFetch(`/showcases/${id}`, 'PATCH', dto, options),
  deleteShowcase: (id: string, options: ApiOptions) =>
    authFetch(`/showcases/${id}`, 'DELETE', {}, options),
};
