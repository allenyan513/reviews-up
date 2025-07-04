import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '@reviewsup/api/workspace';
import { WorkspaceEntity } from '@reviewsup/api/workspace';
import { authFetch } from './auth-fetch';

export const workspace = {
  createWorkspace: (dto: CreateWorkspaceDto): Promise<WorkspaceEntity> =>
    authFetch('/workspaces', 'POST', dto),

  update: (workspaceId: string, dto: UpdateWorkspaceDto): Promise<WorkspaceEntity> =>
    authFetch(`/workspaces/${workspaceId}`, 'PATCH', dto),
};
