import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { JwtPayload } from '@src/common/types/jwt-payload';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';

// import { User } from '@repo/api/users/entities/user.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Jwt() jwt: JwtPayload) {
    this.logger.log(`Fetching profile for user.`, jwt);
    return this.usersService.getProfile(jwt.userId);
  }
}
