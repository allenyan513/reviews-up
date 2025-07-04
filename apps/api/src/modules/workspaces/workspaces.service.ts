import { Injectable } from '@nestjs/common';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '@reviewsup/api/workspace';
import { PrismaService } from '../prisma/prisma.service';
import { generateShortId } from '@src/libs/shortId';

@Injectable()
export class WorkspacesService {
  constructor(private prismaService: PrismaService) {}

  async create(uid: string, dto: CreateWorkspaceDto) {
    return this.prismaService.workspace.create({
      data: {
        shortId: generateShortId(),
        name: dto.name,
        userId: uid, // Assuming uid is the user ID
      },
    });
  }

  findAll() {
    return `This action returns all workspaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  async update(
    uid: string,
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: id },
    });
    if (!workspace) {
      throw new Error(`Workspace with ID ${id} not found`);
    }
    if (workspace.userId !== uid) {
      throw new Error(`You do not have permission to update this workspace`);
    }
    return this.prismaService.workspace.update({
      where: { id: id },
      data: {
        name: updateWorkspaceDto.name,
        // Add other fields as necessary
      },
    });
  }

  async remove(uid: string, id: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: id },
    });
    if (!workspace) {
      throw new Error(`Workspace with ID ${id} not found`);
    }
    if (workspace.userId !== uid) {
      throw new Error(`You do not have permission to delete this workspace`);
    }
    return this.prismaService.workspace.delete({
      where: { id: id },
    });
  }
}
