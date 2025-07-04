import { userEntitySchema } from './users';
import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
});
export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;

export const workspaceEntitySchema = z.object({
  id: z.string(),
  shortId: z.string(),
  name: z.string().min(1, 'Workspace name is required'),
  userId: z.string().min(1, 'User ID is required'),
  user: z.lazy(() => userEntitySchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WorkspaceEntity = z.infer<typeof workspaceEntitySchema>;
