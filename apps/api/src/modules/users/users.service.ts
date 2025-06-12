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
    return user
    // const userProfile: User = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   image: user.image,
    //   idToken: user.idToken,
    //   Workspace: user.Workspace || [],
    // };
    // return userProfile;
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

}
