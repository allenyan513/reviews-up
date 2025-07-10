import { z } from 'zod';

export const OrderStatus = {
  pending: 'pending',
  completed: 'completed',
};
export const PaymentStatus = {
  pending: 'pending',
  paid: 'paid',
  unpaid: 'unpaid',
  noPaymentRequired: 'no_payment_required',
};

export const createOrderDtoSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  productId: z.string(),
  product: z.any(),
  priceId: z.string(),
  price: z.any(),
});
export type CreateOrderDto = z.infer<typeof createOrderDtoSchema>;
export type UpdateOrderDto = Partial<CreateOrderDto>;

export const createPaymentEventDtoSchema = z.object({
  eventId: z.string(),
  eventType: z.string(),
  data: z.any(),
});
export type CreatePaymentEventDto = z.infer<typeof createPaymentEventDtoSchema>;

export const createOneTimePaymentDtoSchema = z.object({
  productId: z.string(),
});
export type CreateOneTimePaymentDto = z.infer<
  typeof createOneTimePaymentDtoSchema
>;

export const createOneTimePaymentResponseSchema = z.object({
  sessionUrl: z.string().url(),
  sessionId: z.string(),
});
export type CreateOneTimePaymentResponse = z.infer<
  typeof createOneTimePaymentResponseSchema
>;

export const orderEntitySchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  productId: z.string(),
  product: z.any(),
  priceId: z.string(),
  price: z.any(),
  paymentStatus: z.nativeEnum(OrderStatus),
  orderStatus: z.nativeEnum(PaymentStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type OrderEntity = z.infer<typeof orderEntitySchema>;
export const paymentEventEntitySchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventType: z.string(),
  data: z.any(),
});
export type PaymentEventEntity = z.infer<typeof paymentEventEntitySchema>;
