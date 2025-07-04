import { z } from 'zod';
import { PartialType } from '@nestjs/mapped-types';

export const ReviewStatus = {
  pending: 'pending',
  public: 'public',
  hidden: 'hidden',
};

export const ReviewSource = {
  manual: 'manual',
  json: 'json',
  twitter: 'twitter',
  google: 'google',
  facebook: 'facebook',
  trustpilot: 'trustpilot',
};

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
  title: z.string().optional(),
  tweetId: z.string().optional(),
  source: z.nativeEnum(ReviewSource).default(ReviewSource.manual).optional(),
  sourceUrl: z.string().url().optional(),
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.pending).optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;

export const findAllReviewRequestSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace is required'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type FindAllReviewRequest = z.infer<typeof findAllReviewRequestSchema>;

export type UpdateReviewDto = Partial<CreateReviewDto>;

export const reviewEntitySchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  formId: z.string().optional(),
  userId: z.string().optional(),
  reviewerId: z.string().optional(),
  reviewerName: z.string().min(1, 'Reviewer name is required'),
  reviewerImage: z.string().url().optional(),
  reviewerEmail: z.string().email('Invalid email format').optional(),
  reviewerUrl: z.string().url().optional(),
  reviewerTitle: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  text: z.string().optional(),
  tweetId: z.string().optional(),
  source: z.nativeEnum(ReviewSource).default(ReviewSource.manual),
  sourceUrl: z.string().url().optional(),
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.pending),
  createdAt: z.date(),
  updatedAt: z.date(),
  medias: z.array(z.lazy(() => reviewMediaEntitySchema)).optional(),
});

export type ReviewEntity = z.infer<typeof reviewEntitySchema>;

export class CreateReviewMediaDto {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  reviewId?: string;
}

export class UpdateReviewMediaDto extends PartialType(CreateReviewMediaDto) {}

export const reviewMediaEntitySchema = z.object({
  id: z.string().min(1, 'Media ID is required'),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  reviewId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type ReviewMediaEntity = z.infer<typeof reviewMediaEntitySchema>;
