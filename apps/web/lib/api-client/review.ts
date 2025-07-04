import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewEntity,
  FindAllReviewRequest,
} from '@reviewsup/api/reviews';
import { PaginateResponse } from '@reviewsup/api/common';
import { authFetch } from './auth-fetch';
import { YtDlpRequest, YtDlpResponse } from '@reviewsup/api/yt-dlp';

export const review = {
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

  submitReview: (review: CreateReviewDto): Promise<ReviewEntity> => {
    return authFetch('/reviews/submit', 'POST', review);
  },
  /**
   * createReview 是一个受保护的接口，用于创建评论
   * @param dto
   */
  createReview: (dto: CreateReviewDto): Promise<ReviewEntity> =>
    authFetch('/reviews/create', 'POST', dto),

  updateReview: (id: string, dto: UpdateReviewDto) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto),
  deleteReview: (id: string) => authFetch(`/reviews/${id}`, 'DELETE', {}),

  parse: (request: YtDlpRequest): Promise<YtDlpResponse> =>
    authFetch('/reviews/parse', 'POST', request),
};
