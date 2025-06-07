import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProviderCallbackDto } from '@repo/api/auth/dto/auth-provider-callback.dto';
import { UsersService } from '../users/users.service';
import { User } from '@repo/api/users/entities/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(private prismaService: PrismaService,
              private usersService: UsersService) {}

  async handleCallback(dto: AuthProviderCallbackDto) {
    this.logger.log('handleGithubCallback', dto);
    const { provider, providerAccountId, email, name, image, loginTime } = dto;
    let user = await this.usersService.findByProviderAccountId(
      provider,
      providerAccountId,
    )
    if (!user) {
      user = await this.usersService.create({
        provider: provider,
        providerAccountId: providerAccountId,
        email: email,
        name: name,
        image: image,
      })
    } else {
      // Update existing user's login time and potentially other info
      user = await this.usersService.update({
        provider: provider,
        providerAccountId: providerAccountId,
        email: email,
        name: name,
        image: image,
      })
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      idToken: user.idToken, // Return the generated idToken
    } as User
  }

  async decodeIdToken(idToken: string) {
    this.logger.log('decodeIdToken', idToken);
    try {
      const user = await this.usersService.findByIdToken(idToken);
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        idToken: user.idToken, // Return the idToken
      } as User;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
