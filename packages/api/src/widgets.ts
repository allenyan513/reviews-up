import { reviewEntitySchema } from './reviews';
import { z } from 'zod';

export const createWidgetSchema = z.object({
  productId: z.string().min(1, 'ProductId is required'),
  name: z.string().min(1, 'Widget name is required'),
  config: z.lazy(() => widgetConfigSchema).optional(),
});
export type CreateWidgetDto = z.infer<typeof createWidgetSchema>;
export type UpdateWidgetDto = Partial<CreateWidgetDto>;

export const widgetEntitySchema = z.object({
  id: z.string(),
  shortId: z.string(),
  userId: z.string(),
  productId: z.string(),
  name: z.string().min(1, 'Widget name is required'),
  config: z.optional(z.lazy(() => widgetConfigSchema)),
  user: z.any().optional(),
  reviews: z.array(z.lazy(() => reviewEntitySchema)).optional(),
  reviewRating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
  isBindProduct: z.boolean().optional().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type WidgetEntity = z.infer<typeof widgetEntitySchema>;

export const widgetConfigSchema = z.object({
  type: z
    .enum(['flow', 'grid', 'list', 'carousel', 'avatar-list'])
    .default('flow'),
  isRatingSummaryEnabled: z.boolean().default(true),
  isRatingEnabled: z.boolean().default(true),
  isSourceEnabled: z.boolean().default(true),
  isDateEnabled: z.boolean().default(true),
  isImageEnabled: z.boolean().default(true),
  isVideoEnabled: z.boolean().default(true),
  isPoweredByEnabled: z.boolean().default(true),
  isDoFollowEnabled: z.boolean().default(true),
  count: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['newest', 'oldest', 'random', 'rating']).default('newest'),
  flow: z
    .object({
      columns: z.number().int().min(1).max(6).default(4),
    })
    .optional(),
  breakpoints: z
    .object({
      sm: z.number().int().min(1).max(6).default(1),
      md: z.number().int().min(1).max(6).default(2),
      lg: z.number().int().min(1).max(6).default(3),
    })
    .optional(),
  rows: z.number().int().min(1).max(10).default(1),
  speed: z.number().int().min(0).max(100).default(40),
});

export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

export const verifyWidgetEmbeddingSchema = z.object({
  url: z.string().url().min(1, 'URL is required'),
  widgetShortId: z.string().min(1, 'widgetShortId is required'),
});
export type VerifyWidgetEmbeddingRequest = z.infer<typeof verifyWidgetEmbeddingSchema>;
