import { workspaceEntitySchema } from './workspace';
import { reviewEntitySchema } from './reviews';
import { z } from 'zod';

export const SubscriptionTier = {
  free: 'free',
  pro: 'pro',
};

export const userEntitySchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  subscriptionTier: z
    .nativeEnum(SubscriptionTier)
    .default(SubscriptionTier.free),
  Workspace: z.lazy(() => z.array(workspaceEntitySchema)).optional(),
  Review: z.lazy(() => z.array(reviewEntitySchema)).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserEntity = z.infer<typeof userEntitySchema>;

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = Partial<CreateUserDto>;

export const createAccountSchema = z.object({
  email: z.string().email('Invalid email format'),
  provider: z.string(),
  providerAccountId: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  tokenType: z.string().optional(),
  scope: z.string().optional(),
  idToken: z.string().optional(),
  sessionState: z.string().optional(),
})
export type CreateAccountDto = z.infer<typeof createAccountSchema>;

