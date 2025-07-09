import { z } from 'zod';
import { formEntitySchema } from './forms';

export const ProductCategory = {
  ai: 'ai',
  analytics: 'analytics',
  automation: 'automation',
  crm: 'crm',
  design: 'design',
  development: 'development',
  eCommerce: 'eCommerce',
  education: 'education',
  finance: 'finance',
  health: 'health',
  marketing: 'marketing',
  productivity: 'productivity',
  projectManagement: 'projectManagement',
  security: 'security',
  socialMedia: 'socialMedia',
  tools: 'tools',
};

export const ProductStatus = {
  waitingForAdminReview: 'waitingForAdminReview',
  rejected: 'rejected',
  pendingForSubmit: 'pendingForSubmit',
  pendingForReceive: 'pendingForReceive',
  listing: 'listing',
};

export const createProductSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  formId: z.string().min(1, 'Form ID is required'),
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  description: z.string().optional(),
  icon: z.string().url('Invalid URL').optional(),
  screenshot: z.string().url('Invalid URL').optional(),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),
  category: z
    .nativeEnum(ProductCategory)
    .default(ProductCategory.ai)
    .optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  formId: z.string().min(1, 'Form ID is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  status: z
    .nativeEnum(ProductStatus)
    .default(ProductStatus.waitingForAdminReview)
    .optional(),
  taskReviewCount: z.number().int().default(0),
  submitReviewCount: z.number().int().default(0),
  receiveReviewCount: z.number().int().default(0),
  description: z.string().optional(),
  icon: z.string().url('Invalid URL').optional(),
  screenshot: z.string().url('Invalid URL').optional(),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),
  category: z
    .nativeEnum(ProductCategory)
    .default(ProductCategory.ai)
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  form: z.lazy(() => formEntitySchema).optional(),
});
export type ProductEntity = z.infer<typeof productSchema>;

export const findAllRequestSchema = z.object({
  workspaceId: z.string().nullable().optional(),
  status: z.array(z.nativeEnum(ProductStatus)).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  categories: z
    .array(z.nativeEnum(ProductCategory))
    .optional()
    .default([]),
});

export type FindAllRequest = z.infer<typeof findAllRequestSchema>;
