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

  if (method === 'GET') {
    const queryString = new URLSearchParams(data).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  } else if (method === 'POST') {
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

  getForms: (workspaceId: string, options: ApiOptions) =>
    authFetch(`/forms/workspaceId/${workspaceId}`, 'GET', {}, options),

  getForm: (id: string, options: ApiOptions) =>
    authFetch(`/forms/${id}`, 'GET', {}, options),

  createForm: (dto: CreateFormDto, options: ApiOptions) =>
    authFetch('/forms', 'POST', dto, options),

  updateForm: (id: string, dto: CreateFormDto, options: ApiOptions) =>
    authFetch(`/forms/${id}`, 'PATCH', dto, options),

  deleteForm: (id: string, options: ApiOptions) =>
    authFetch(`/forms/${id}`, 'DELETE', {}, options),

  getReviews: (workspaceId: string, options: ApiOptions): Promise<PaginateResponse<any>> =>
    authFetch(`/reviews/workspaceId/${workspaceId}`, 'GET', {}, options),

  getReview: (id: string, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'GET', {}, options),

  createReview: (dto: CreateReviewDto, options: ApiOptions): Promise<Review> =>
    authFetch('/reviews', 'POST', dto, options),

  updateReview: (id: string, dto: CreateReviewDto, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto, options),

  deleteReview: (id: string, options: ApiOptions) =>
    authFetch(`/reviews/${id}`, 'DELETE', {}, options),

  getSignedUrl: (
    dto: S3GetSignedUrlDto,
    options: ApiOptions,
  ): Promise<S3SignedUrlEntity> =>
    authFetch('/reviews/getSignedUrl', 'POST', dto, options),
};
