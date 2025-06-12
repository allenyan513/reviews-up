import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { authFetch } from './auth-fetch';

export const workspace = {
  createWorkspace: (dto: CreateWorkspaceDto): Promise<Workspace> =>
    authFetch('/workspaces', 'POST', dto),
};
