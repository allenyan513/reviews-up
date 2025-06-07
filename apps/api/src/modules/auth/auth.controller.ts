import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviderCallbackDto } from '@repo/api/auth/dto/auth-provider-callback.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('callback')
  async authCallback(@Body() dto: AuthProviderCallbackDto) {
    return this.authService.handleCallback(dto);
  }
}
