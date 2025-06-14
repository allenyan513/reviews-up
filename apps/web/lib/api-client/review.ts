import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { PaginateResponse } from '@repo/api/common/paginate';
import { FindAllReviewRequest } from '@repo/api/reviews/find-all-review.dto';
import { authFetch } from './auth-fetch';

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

  /**
   * submit 是一个公开接口，用于提交评论
   * @param dto
   */
  submitReview: (dto: CreateReviewDto): Promise<ReviewEntity> =>
    authFetch('/reviews/submit', 'POST', dto),
  updateReview: (id: string, dto: UpdateReviewDto) =>
    authFetch(`/reviews/${id}`, 'PATCH', dto),
  deleteReview: (id: string) => authFetch(`/reviews/${id}`, 'DELETE', {}),
};
