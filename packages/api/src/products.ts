import { z } from 'zod';

export const ProductCategory = {
  workProductivity: 'Work & Productivity',
  engineeringDevelopment: 'Engineering & Development',
  designCreative: 'Design & Creative',
  finance: 'Finance',
  socialCommunity: 'Social & Community',
  marketing_features: 'Marketing Features',
  ai: 'AI',
  healthFitness: 'Health & Fitness',
  travel: 'Travel',
  platforms: 'Platforms',
  productAddOns: 'Product Add-ons',
  web3: 'Web3',
  physicalProducts: 'Physical Products',
  ecommerce: 'Ecommerce',
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
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be less than 32 characters'),
  slug: z.string().optional(),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .max(64, 'Tagline must be less than 64 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(260, 'Description must be less than 260 characters'),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  tags: z.array(z.string()).optional(),
  submitOption: z
    .enum(['free-submit', 'paid-submit', 'crawl-product-info', 'update'])
    .optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export const submitProductSchema = z.object({
  id: z.string().optional(),
  bindingFormId: z.string().optional(),
  submitOption: z
    .enum(['free-submit', 'paid-submit', 'crawl-product-info', 'update'])
    .optional(),
});
export type SubmitProductRequest = z.infer<typeof submitProductSchema>;

export const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(24, 'Name must be less than 24 characters'),
  tagline: z.string().min(1, 'Tagline is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(48, 'Slug must be less than 48 characters'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  status: z
    .nativeEnum(ProductStatus)
    .default(ProductStatus.pendingForReceive)
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
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bindingFormId: z.string().optional(),
  reviews: z.array(z.any()).optional(),
  reviewCount: z.number().int().default(0).optional(),
  reviewRating: z.number().min(0).max(5).default(0).optional(),
  reviewRatingStr: z.string().optional(),
});
export type ProductEntity = z.infer<typeof productSchema>;

export const findAllRequestSchema = z.object({
  status: z.array(z.nativeEnum(ProductStatus)).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type FindAllRequest = z.infer<typeof findAllRequestSchema>;

export const crawlProductResponseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  faviconUrl: z.string().url('Invalid URL').optional(),
  screenshotUrl: z.string().url('Invalid URL').optional(),
});
export type CrawlProductResponse = z.infer<typeof crawlProductResponseSchema>;
