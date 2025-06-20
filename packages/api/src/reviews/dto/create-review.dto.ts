import { z } from 'zod';
import { ReviewSource, ReviewStatus } from '@repo/database/generated/client';

export const createReviewSchema = z.object({
  userId: z.string().optional(),
  workspaceId: z.string().min(1, 'Workspace is required'),
  formId: z.string(),
  rating: z.number().min(1).max(5).optional(),
  message: z.string().optional(),
  reviewerId: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().optional(),
  userUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  tweetId: z.string().optional(),
  source: z.nativeEnum(ReviewSource).default(ReviewSource.manual).optional(),
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.pending).optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
