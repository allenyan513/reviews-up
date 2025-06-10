import { z } from 'zod';

export const findAllReviewRequestSchema = z.object({
  uid: z.string().min(1, 'UID is required'),
  workspaceId: z.string().min(1, 'Workspace is required'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type FindAllReviewRequest = z.infer<typeof findAllReviewRequestSchema>;
