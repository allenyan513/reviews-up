import { authFetch } from './auth-fetch';
import {
  ProductEntity,
  FindAllRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CrawlProductResponse,
} from '@reviewsup/api/products';
import { PaginateResponse, RRResponse } from '@reviewsup/api/common';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';

export const product = {
  /**
   * create a new product
   * @param dto
   */
  setup: (dto: CreateProductRequest): Promise<ProductEntity> =>
    authFetch('/products/setup', 'POST', dto),
  findAll: (
    request: FindAllRequest,
  ): Promise<PaginateResponse<ProductEntity>> =>
    authFetch(`/products/findAll`, 'POST', request),
  crawlOne: (url: string): Promise<CrawlProductResponse> =>
    authFetch('/products/crawl', 'POST', { url }),
  findOne: (id: string): Promise<ProductEntity> =>
    authFetch(`/products/${id}`, 'GET', {}),
  /**
   * Submit a product for review or listing.
   * @param dto
   */
  submit: (
    dto: UpdateProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> =>
    authFetch('/products/submit', 'POST', dto),

  updateOne: (id: string, dto: UpdateProductRequest) =>
    authFetch(`/products/${id}`, 'PATCH', dto),
  deleteOne: (id: string) => authFetch(`/products/${id}`, 'DELETE', {}),
  taskReviewCount: (): Promise<RRResponse<number>> =>
    authFetch('/products/taskReviewCount', 'GET', {}),
};
