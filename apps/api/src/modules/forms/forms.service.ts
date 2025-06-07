import { Injectable } from '@nestjs/common';
import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prismaService: PrismaService) {}

  async create(uid: string, createFormDto: CreateFormDto) {
    return this.prismaService.form.create({
      data: {
        ...createFormDto,
        userId: uid, // Assuming the form is associated with a user
      },
    });
  }

  async findAll(uid: string, workspaceId: string | null) {
    return this.prismaService.form.findMany({
      where: {
        userId: uid,
        workspaceId: workspaceId, // Filter by workspace if provided
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
    });
  }

  async findOne(uid: string, id: string) {
    return this.prismaService.form.findFirst({
      where: {
        id: id,
        userId: uid,
      },
    });
  }

  async findOnePublic(id: string) {
    return this.prismaService.form.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(uid: string, id: string, updateFormDto: UpdateFormDto) {
    return this.prismaService.form.update({
      where: {
        id: id,
        userId: uid,
      },
      data: updateFormDto,
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.form.delete({
      where: {
        id: id,
      },
    });
  }

}
