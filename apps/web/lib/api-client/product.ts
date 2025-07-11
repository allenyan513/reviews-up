import { authFetch } from './auth-fetch';
import {
  ProductEntity,
  FindAllRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CrawlProductResponse,
} from '@reviewsup/api/products';
import { RRResponse } from '@reviewsup/api/common';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';

export const product = {
  findAll: (request: FindAllRequest): Promise<ProductEntity[]> =>
    authFetch(`/products/findAll`, 'POST', request),
  crawlOne: (url: string): Promise<CrawlProductResponse> =>
    authFetch('/products/crawl', 'POST', { url }),
  findOne: (id: string): Promise<ProductEntity> =>
    authFetch(`/products/${id}`, 'GET', {}),
  createOne: (
    dto: CreateProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> =>
    authFetch('/products/create', 'POST', dto),
  updateOne: (id: string, dto: UpdateProductRequest) =>
    authFetch(`/products/${id}`, 'PATCH', dto),
  deleteOne: (id: string) => authFetch(`/products/${id}`, 'DELETE', {}),
  taskReviewCount: (): Promise<RRResponse<number>> =>
    authFetch('/products/taskReviewCount', 'GET', {}),
};
