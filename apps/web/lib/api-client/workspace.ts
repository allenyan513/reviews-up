import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { authFetch } from './auth-fetch';
import { UpdateWorkspaceDto } from '@repo/api/workspaces/dto/update-workspace.dto';

export const workspace = {
  createWorkspace: (dto: CreateWorkspaceDto): Promise<Workspace> =>
    authFetch('/workspaces', 'POST', dto),

  update: (workspaceId: string, dto: UpdateWorkspaceDto): Promise<Workspace> =>
    authFetch(`/workspaces/${workspaceId}`, 'PATCH', dto),
};
