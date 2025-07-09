import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewEntity,
  FindAllReviewRequest,
} from '@reviewsup/api/reviews';
import { authFetch } from './auth-fetch';
import { ProductEntity, FindAllRequest } from '@reviewsup/api/products';

export const product = {
  findAll: (request: FindAllRequest): Promise<ProductEntity[]> =>
    authFetch(`/products/findAll`, 'POST', request),
  findOne: (id: string) => authFetch(`/products/${id}`, 'GET', {}),
  createOne: (dto: CreateReviewDto): Promise<ReviewEntity> =>
    authFetch('/products/create', 'POST', dto),
  updateOne: (id: string, dto: UpdateReviewDto) =>
    authFetch(`/products/${id}`, 'PATCH', dto),
  deleteOne: (id: string) => authFetch(`/products/${id}`, 'DELETE', {}),
};
