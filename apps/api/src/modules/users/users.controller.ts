import { Controller, Get, Logger, Req, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { JwtPayload } from '@src/common/types/jwt-payload';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Jwt() jwt: JwtPayload) {
    return this.usersService.getProfile(jwt.userId);
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return await this.usersService.findOneBySlug(slug);
  }
}
