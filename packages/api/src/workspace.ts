import { PartialType } from '@nestjs/mapped-types';
import { userEntitySchema } from './users';
import { z } from 'zod';

export class CreateWorkspaceDto {
  name: string;
}

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

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
