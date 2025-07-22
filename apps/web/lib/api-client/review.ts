import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewEntity,
  FindAllReviewRequest,
} from '@reviewsup/api/reviews';
import { PaginateResponse } from '@reviewsup/api/common';
import { authFetch } from './auth-fetch';
import { YtDlpRequest, YtDlpResponse } from '@reviewsup/api/yt-dlp';
import {
  TiktokOembedRequest,
  TiktokOembedResponse,
} from '@reviewsup/api/tiktok';
import { GoogleMapRequest, GoogleMapResponse } from '@reviewsup/api/google';
import { UserEntity } from '@reviewsup/api/users';

export const review = {
  getReviews: (
    request: FindAllReviewRequest,
  ): Promise<PaginateResponse<ReviewEntity>> =>
    authFetch(`/reviews`, 'GET', {
      page: request.page,
      pageSize: request.pageSize,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder,
      ...(request.productId && {
        productId: request.productId,
      }),
    }),
  getReview: (id: string) => authFetch(`/reviews/${id}`, 'GET', {}),

  /**
   * createReview 是一个受保护的接口，用于创建评论
   * @param dto
   * @param user 可选的用户实体，如果提供，则使用该用户的身份创建评论
   */
  createReview: (
    dto: CreateReviewDto,
    user?: UserEntity | undefined | null,
  ): Promise<ReviewEntity> => {
    if (!user) {
      return authFetch('/reviews/submit', 'POST', dto);
    }
    return authFetch('/reviews/create', 'POST', dto);
  },

  updateReview: (id: string, dto: UpdateReviewDto) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto),
  updateReviewStatus: (id:string, dto: UpdateReviewDto) =>
    authFetch(`/reviews/${id}/status`, 'PATCH', dto),

  deleteReview: (id: string) => authFetch(`/reviews/${id}`, 'DELETE', {}),

  parse: (request: YtDlpRequest): Promise<YtDlpResponse> =>
    authFetch('/reviews/parse', 'POST', request),

  parseTiktok: (request: TiktokOembedRequest): Promise<TiktokOembedResponse> =>
    authFetch('/reviews/parse/tiktok', 'POST', request),

  parseGoogleMap: (request: GoogleMapRequest): Promise<GoogleMapResponse> =>
    authFetch('/reviews/parse/google', 'POST', request),

  findAllByReviewerId: (reviewerId: string): Promise<ReviewEntity[]> =>
    authFetch(`/reviews/findAllByReviewerId`, 'GET', { reviewerId }),
};
