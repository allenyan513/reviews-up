import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@src/common/types/jwt-payload';
import { CreateAccountDto } from '@repo/api/users/dto/create-user.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { generateShortId } from '@src/libs/shortId';
import { ShowcasesService } from '@src/modules/showcases/showcases.service';
import { FormsService } from '@src/modules/forms/forms.service';
import { EmailService } from '@src/modules/email/email.service';
import { EMAIL_FROM } from '@src/modules/email/email.constants';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private formService: FormsService,
    private showcasesService: ShowcasesService,
    private emailService: EmailService,
  ) {}

  generateJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async sendMagicLink(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const token = this.generateJwt({
      userId: user.id,
      email: user.email,
    });
    const magicLink = `${process.env.API_URL}/auth/magic-login?token=${token}`;
    await this.emailService.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Your Magic Login Link',
      html: `<p>Click the link to login: <a href="${magicLink}">${magicLink}</a></p>`,
    });
    return {
      message: 'Magic link sent successfully',
    };
  }

  async validateMagicToken(token: string) {
    const jwtPayload = this.jwtService.verify<JwtPayload>(token);
    if (!jwtPayload || !jwtPayload.userId || !jwtPayload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    const dto: CreateAccountDto = {
      email: jwtPayload.email,
      name: jwtPayload.email.split('@')[0],
      avatarUrl: '',
      provider: 'email',
      providerAccountId: generateShortId()
    };
    return this.validateOAuthLogin(dto);
  }

  async validateOAuthLogin(dto: CreateAccountDto): Promise<JwtPayload> {
    if (!dto || !dto.provider || !dto.providerAccountId || !dto.email) {
      throw new UnauthorizedException('Invalid OAuth user data');
    }
    let userExist = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!userExist) {
      userExist = await this.registerUser(dto);
    }
    let accountExist = await this.prismaService.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: dto.provider,
          providerAccountId: dto.providerAccountId,
        },
      },
    });
    if (!accountExist) {
      accountExist = await this.createAccount(dto, userExist.id);
    }
    return {
      userId: userExist.id,
      email: userExist.email,
      provider: accountExist.provider,
      providerAccountId: accountExist.providerAccountId,
    } as JwtPayload;
  }

  async registerUser(dto: CreateAccountDto) {
    this.logger.debug('registerUser', dto);
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await this.onCreateUser(newUser);
    return newUser;
  }

  async createAccount(dto: CreateAccountDto, userId: string) {
    this.logger.debug('createAccount', dto);
    return this.prismaService.account.create({
      data: {
        userId: userId,
        provider: dto.provider,
        providerAccountId: dto.providerAccountId,
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
        expiresIn: dto.expiresIn,
        tokenType: dto.tokenType,
        scope: dto.scope,
        idToken: dto.idToken,
        sessionState: dto.sessionState,
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
    this.logger.debug(`Creating default workspace and form for user: ${user.id}`);
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
