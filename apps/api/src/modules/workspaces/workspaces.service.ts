import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '@repo/api/workspaces/dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  create(createWorkspaceDto: CreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
