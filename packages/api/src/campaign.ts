import { z } from 'zod';

export const createCampaignSchema = z.object({
  productId: z.string().min(1, 'ProductId is required'),
  formId: z.string().min(1, 'Form ID is required'),
  formShortId: z.string().min(1, 'Form short ID is required'),
  name: z.string().min(1, 'Campaign name is required'),
  fromName: z.string().min(1, 'From name is required'),
  fromEmail: z
    .string()
    .email('Invalid email format')
    .min(1, 'From email is required'),
  toEmails: z
    .array(z.string().email('Invalid email format'))
    .min(1, 'At least one recipient email is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  isTest: z.boolean().optional().default(false),
  buttonText: z.string().optional().default('Leave a testimonial'),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

export const campaignEntitySchema = z.object({
  id: z.string().min(1, 'Campaign ID is required'),
  userId: z.string().min(1, 'Campaign ID is required'),
  productId: z.string(),
  formId: z.string(),
  formShortId: z.string(),
  name: z.string(),
  fromName: z.string(),
  fromEmail: z.string().email('Invalid email format'),
  toEmails: z.array(z.string().email('Invalid email format')),
  subject: z.string(),
  content: z.string(),
  isTest: z.boolean().default(false),
  buttonText: z.string().optional().default('Leave a testimonial'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CampaignEntity = z.infer<typeof campaignEntitySchema>;

export const findAllCampaignsRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type FindAllCampaignsRequest = z.infer<
  typeof findAllCampaignsRequestSchema
>;
