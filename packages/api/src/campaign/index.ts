import { z } from 'zod';

export const createCampaignSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace is required'),
  formId: z.string().min(1, 'Form ID is required'),
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
  workspaceId: z.string(),
  formId: z.string(),
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
