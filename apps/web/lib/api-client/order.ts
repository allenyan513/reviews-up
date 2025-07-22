import { authFetch } from './auth-fetch';
import {
  CreateOneTimePaymentDto,
  CreateOneTimePaymentResponse,
  OrderEntity,
} from '@reviewsup/api/orders';

export const order = {
  findAllProducts: () => authFetch(`/orders/products`, 'GET', {}),
  createOne: (
    dto: CreateOneTimePaymentDto,
  ): Promise<CreateOneTimePaymentResponse> =>
    authFetch('/orders/create', 'POST', dto),
  findAll: (): Promise<OrderEntity[]> => authFetch('/orders', 'GET', {}),
  findOne: (id: string) => authFetch(`/orders/${id}`, 'GET', {}),
  // updateOne: (id: string, dto: UpdateReviewDto) =>
  //   authFetch(`/orders/${id}`, 'PATCH', dto),
  deleteOne: (id: string) => authFetch(`/orders/${id}`, 'DELETE', {}),
};
