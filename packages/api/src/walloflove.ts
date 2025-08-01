import { z } from 'zod';
import { productSchema } from './products';
import { reviewEntitySchema } from './reviews';

export const wallOfLoveConfigSchema = z.object({
  backgroundUrl: z.string().url().optional(),
  title: z.string().min(1, 'Title is required').optional(),
  subtitle: z.string().min(1, 'Subtitle is required').optional(),
  ctaButtonHidden: z.boolean().default(false),
  ctaButtonText: z.string().min(1, 'CTA button text is required').default('Submit your testimonial'),
});
export type WallOfLoveConfig = z.infer<typeof wallOfLoveConfigSchema>;

export const createWallOfLoveSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'wall of love name is required'),
  config: z.lazy(() => wallOfLoveConfigSchema).optional(),
});

export type CreateWallOfLoveDto = z.infer<typeof createWallOfLoveSchema>;
export type UpdateWallOfLoveDto = Partial<CreateWallOfLoveDto>;

export const wallOfLoveEntitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  name: z.string().min(1, 'Wall of love name is required'),
  config: z.optional(z.lazy(() => wallOfLoveConfigSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z.lazy(() => productSchema).optional(),
  reviews: z.lazy(() => z.array(reviewEntitySchema)).optional(),
});
export type WallOfLoveEntity = z.infer<typeof wallOfLoveEntitySchema>;
