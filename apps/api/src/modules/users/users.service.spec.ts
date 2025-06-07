import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import {UsersService} from "./users.service";
import {PrismaModule} from "../prisma/prisma.module";
import {CreateUserDto} from "@repo/api/users/dto/create-user.dto";

describe('LinksService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        PrismaModule,
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    const dto : CreateUserDto ={
      provider: 'github',
      providerAccountId: '123456789013',
      name: 'Test User',
      email: 'test@gmail.com',
      image: 'https://example.com/image.jpg',
    }
    const result = await service.create(dto)
  },100000);
});
