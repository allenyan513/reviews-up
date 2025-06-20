import {CreateReviewDto} from '@repo/api/reviews/dto/create-review.dto';
import {UpdateReviewDto} from '@repo/api/reviews/dto/update-review.dto';
import {ReviewEntity} from '@repo/api/reviews/entities/review.entity';
import {PaginateResponse} from '@repo/api/common/paginate';
import {FindAllReviewRequest} from '@repo/api/reviews/dto/find-all-review.dto';
import {authFetch} from './auth-fetch';
import {YtDlpRequest} from '@repo/api/yt-dlp/yt-dlp-request.dto';
import {YtDlpResponse} from '@repo/api/yt-dlp/yt-dlp-response.dto';

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
