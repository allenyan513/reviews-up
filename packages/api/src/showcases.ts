import { reviewEntitySchema } from './reviews';
import { z } from 'zod';

export const createShowcaseSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace is required'),
  name: z.string().min(1, 'Showcase name is required'),
  config: z.lazy(() => showcaseConfigSchema).optional(),
});
export type CreateShowcaseDto = z.infer<typeof createShowcaseSchema>;
export type UpdateShowcaseDto = Partial<CreateShowcaseDto>;

export const showcaseEntitySchema = z.object({
  id: z.string(),
  shortId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1, 'Showcase name is required'),
  config: z.optional(z.lazy(() => showcaseConfigSchema)),
  user: z.any().optional(),
  workspace: z.any().optional(),
  reviews: z.array(z.lazy(() => reviewEntitySchema)).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShowcaseEntity = z.infer<typeof showcaseEntitySchema>;

export const showcaseConfigSchema = z.object({
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

export type ShowcaseConfig = z.infer<typeof showcaseConfigSchema>;
