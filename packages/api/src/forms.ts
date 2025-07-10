import { z } from 'zod';
import { reviewEntitySchema } from './reviews';

export const createFormSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace is required'),
  name: z.string().min(1, 'Form name is required'),
  config: z.lazy(() => formConfigSchema).optional(),
});

export type CreateFormDto = z.infer<typeof createFormSchema>;
export type UpdateFormDto = Partial<CreateFormDto>;

export const formEntitySchema = z.object({
  id: z.string(),
  shortId: z.string().min(1, 'Short ID is required'),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1, 'Form name is required'),
  reviewCount: z.number().optional(),
  config: z.optional(z.lazy(() => formConfigSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
  Review: z.any(),
});
export type FormEntity = z.infer<typeof formEntitySchema>;

export const formConfigSchema = z.object({
  brand: z
    .object({
      name: z.string().optional(),
      logo: z.string().url().optional(),
      slogan: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  welcome: z
    .object({
      title: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
  thankyou: z
    .object({
      title: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});
export type FormConfig = z.infer<typeof formConfigSchema>;
