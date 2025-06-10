import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '@repo/api/users/dto/create-user.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { generateIdToken } from '../../libs/utils';
import { UpdateUserDto } from '@repo/api/users/dto/update-user.dto';
import { generateShortId } from '../../libs/shortId';
import { FormsService } from '../forms/forms.service';
import { ShowcasesService } from '../showcases/showcases.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prismaService: PrismaService,
    private formService: FormsService,
    private showcasesService: ShowcasesService,
  ) {}

  async getProfile(userId: string): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        //how to rename Workspace to workspace?
        Workspace: true,
      },
    });
    const userProfile: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      idToken: user.idToken,
      Workspace: user.Workspace || [],
    };
    return userProfile;
  }

  async getUserByUid(uid: string) {
    this.logger.log(`Fetching user by UID: ${uid}`);
    const user = await this.prismaService.user.findUnique({
      where: { id: uid },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByIdToken(idToken: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        idToken: idToken,
      },
    });
  }

  async findByProviderAccountId(
    provider: string,
    providerAccountId: string,
  ): Promise<any> {
    this.logger.log(
      `Finding user by provider: ${provider}, accountId: ${providerAccountId}`,
    );
    const user = await this.prismaService.user.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.prismaService.user.create({
      data: {
        provider: dto.provider,
        providerAccountId: dto.providerAccountId,
        email: dto.email,
        name: dto.name,
        image: dto.image,
        lastLogin: new Date(),
        roles: ['user'],
        idToken: generateIdToken(),
      },
    });
    this.logger.log(`Created new user with ID: ${newUser.id}`);
    await this.onCreateUser(newUser);
    return newUser;
  }

  async update(dto: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        provider_providerAccountId: {
          provider: dto.provider,
          providerAccountId: dto.providerAccountId,
        },
      },
      data: {
        provider: dto.provider,
        providerAccountId: dto.providerAccountId,
        name: dto.name,
        email: dto.email,
        image: dto.image,
        lastLogin: new Date(),
        roles: ['user'],
        idToken: generateIdToken(),
      },
    });
  }

  /**
   * 当新用户创建时调用
   * 创建一个默认的workspace
   * workspace下创建一个默认的form
   * form下创建一个默认的review
   * form下创建一个默认的widget
   */
  async onCreateUser(user: User) {
    if (!user) {
      throw new Error('User is required to create default workspace and form');
    }
    this.logger.log(`Creating default workspace and form for user: ${user.id}`);
    const defaultWorkspace = await this.prismaService.workspace.create({
      data: {
        shortId: generateShortId(),
        name: 'Default Workspace',
        userId: user.id,
      },
    });
    if (!defaultWorkspace) {
      throw new Error('Unable to create default workspace');
    }
    const defaultForm = await this.formService.create(user.id, {
      name: 'Default Form',
      workspaceId: defaultWorkspace.id,
    });
    if (!defaultForm) {
      throw new Error('Unable to create default workspace');
    }
    const defaultReview = await this.prismaService.review.create({
      data: {
        workspaceId: defaultWorkspace.id,
        formId: defaultForm.id,
        reviewerName: 'Anonymous',
        reviewerImage: 'https://example.com/default-avatar.png',
        reviewerEmail: 'anonymous@gmail.com',
        rating: 5,
        text: 'This is a default review.',
        status: 'pending',
      },
    });
    if (!defaultReview) {
      throw new Error('Unable to create default workspace');
    }
    const defaultShowcase = await this.showcasesService.create(user.id, {
      workspaceId: defaultWorkspace.id,
      name: 'Default Showcase',
    });
    if (!defaultShowcase) {
      throw new Error('Unable to create default showcase');
    }
  }
}
