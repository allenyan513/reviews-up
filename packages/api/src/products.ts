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
  draft: 'draft',
  waitingForAdminReview: 'waitingForAdminReview',
  rejected: 'rejected',
  pendingForSubmit: 'pendingForSubmit',
  pendingForReceive: 'pendingForReceive',
  listing: 'listing',
};

export const createProductSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  formId: z.string().min(1, 'Form ID is required'),
  formShortId: z.string().min(1, 'Form Short ID is required'),
  widgetId: z.string().min(1, 'Widget ID is required'),
  widgetShortId: z.string().min(1, 'Widget Short ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(24, 'Name must be less than 24 characters'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(160, 'Description must be less than 160 characters')
    .optional(),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshot: z
    .string()
    .url('Invalid URL')
    .min(1, 'Screenshot URL is required'),
  category: z
    .nativeEnum(ProductCategory)
    .default(ProductCategory.ai),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),

  submitOption: z
    .enum(['free-submit', 'paid-submit', 'save-draft', 'crawl-product-info'])
    .optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  formId: z.string().min(1, 'Form ID is required'),
  formShortId: z.string().min(1, 'Form Short ID is required'),
  showcaseId: z.string().min(1, 'Showcase ID is required'),
  showcaseShortId: z.string().min(1, 'Showcase Short ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(24, 'Name must be less than 24 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(48, 'Slug must be less than 48 characters'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  status: z
    .nativeEnum(ProductStatus)
    .default(ProductStatus.waitingForAdminReview)
    .optional(),
  taskReviewCount: z.number().int().default(0),
  submitReviewCount: z.number().int().default(0),
  receiveReviewCount: z.number().int().default(0),
  featured: z.boolean().default(false),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(160, 'Description must be less than 160 characters')
    .optional(),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshot: z
    .string()
    .url('Invalid URL')
    .min(1, 'Screenshot URL is required'),
  category: z
    .nativeEnum(ProductCategory)
    .default(ProductCategory.ai),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),

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
  categories: z.array(z.nativeEnum(ProductCategory)).optional().default([]),
});

export type FindAllRequest = z.infer<typeof findAllRequestSchema>;

export const crawlProductResponseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  faviconUrl: z.string().url('Invalid URL').optional(),
  screenshotUrl: z.string().url('Invalid URL').optional(),
});
export type CrawlProductResponse = z.infer<typeof crawlProductResponseSchema>;
