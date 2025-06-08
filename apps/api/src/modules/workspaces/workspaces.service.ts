import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from '@repo/api/workspaces/dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '@repo/api/workspaces/dto/update-workspace.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prismaService: PrismaService) {}

  async create(uid: string, dto: CreateWorkspaceDto) {
    return this.prismaService.workspace.create({
      data: {
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

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
