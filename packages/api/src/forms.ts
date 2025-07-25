import { z } from 'zod';
import { reviewEntitySchema } from './reviews';

export const createFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Form name is required'),
  config: z.lazy(() => formConfigSchema).optional(),
});

export type CreateFormDto = z.infer<typeof createFormSchema>;
export type UpdateFormDto = Partial<CreateFormDto>;

/**
 *   id        String     @id @default(uuid())
 *   shortId   String     @unique
 *   userId    String
 *   productId String
 *   name      String
 *   config    Json?      @default("{}")
 *   createdAt DateTime   @default(now())
 *   updatedAt DateTime   @updatedAt
 *   user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
 *   product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
 *   reviews   Review[]
 *   campains  Campaign[]
 */
export const formEntitySchema = z.object({
  id: z.string(),
  shortId: z.string().min(1, 'Short ID is required'),
  userId: z.string(),
  productId: z.string(),
  name: z.string().min(1, 'Form name is required'),
  config: z.optional(z.lazy(() => formConfigSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
  reviewCount: z.number().optional(),
  reviews: z.lazy(() => z.array(reviewEntitySchema)).optional(),
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
