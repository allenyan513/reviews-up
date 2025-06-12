import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProviderCallbackDto } from '@repo/api/auth/dto/auth-provider-callback.dto';
import { UsersService } from '../users/users.service';
import { User } from '@repo/api/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@src/common/types/jwt-payload';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.log('validateUser', { username, pass });
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  generateJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async googleSignIn(user: any) {
    this.logger.log('signIn', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      return this.registerUser(user);
    }
    return this.generateJwt({
      userId: userExists.id,
      email: userExists.email,
    } as JwtPayload);
  }

  async registerUser(user: any) {
    this.logger.log('registerUser', user);
    const newUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        providerAccountId: user.providerAccountId,
      },
    });
    return this.generateJwt({
      userId: newUser.id,
      email: newUser.email,
    } as JwtPayload);
  }

  async handleCallback(dto: AuthProviderCallbackDto) {
    this.logger.log('handleGithubCallback', dto);
    const { provider, providerAccountId, email, name, image, loginTime } = dto;
    let user = await this.usersService.findByProviderAccountId(
      provider,
      providerAccountId,
    );
    if (!user) {
      user = await this.usersService.create({
        provider: provider,
        providerAccountId: providerAccountId,
        email: email,
        name: name,
        image: image,
      });
    } else {
      // Update existing user's login time and potentially other info
      user = await this.usersService.update({
        provider: provider,
        providerAccountId: providerAccountId,
        email: email,
        name: name,
        image: image,
      });
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      idToken: user.idToken, // Return the generated idToken
    } as User;
  }

  /**
   *
   * @param idToken
   * @throws Error if user not found
   */
  async decodeIdToken(idToken: string) {
    // this.logger.debug('decodeIdToken', idToken);
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
  }
}
