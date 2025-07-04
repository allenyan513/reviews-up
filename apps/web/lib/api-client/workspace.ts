import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '@repo/api/workspace';
import { WorkspaceEntity } from '@repo/api/workspace';
import { authFetch } from './auth-fetch';

export const workspace = {
  createWorkspace: (dto: CreateWorkspaceDto): Promise<WorkspaceEntity> =>
    authFetch('/workspaces', 'POST', dto),

  update: (workspaceId: string, dto: UpdateWorkspaceDto): Promise<WorkspaceEntity> =>
    authFetch(`/workspaces/${workspaceId}`, 'PATCH', dto),
};
