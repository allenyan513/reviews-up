import { PartialType } from '@nestjs/mapped-types';
import { z } from 'zod';

export class CreateFormDto {
  workspaceId: string;
  name: string;
  config?: FormConfig;
}

export class UpdateFormDto extends PartialType(CreateFormDto) {}

export const formEntitySchema = z.object({
  id: z.string(),
  shortId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1, 'Form name is required'),
  reviewCount: z.number().optional(),
  config: z.optional(z.lazy(() => formConfigSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
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
