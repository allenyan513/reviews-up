import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthProviderCallbackDto } from '@repo/api/auth/dto/auth-provider-callback.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Get('signOut')
  async singOut(@Res() res: Response) {
    this.logger.log('Sign Out');
    res.clearCookie('access_token', {
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async auth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('callback/google')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.googleSignIn(req.user);
    this.logger.log('Google Auth Callback', token);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 1000,
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @Post('callback')
  async authCallback(@Body() dto: AuthProviderCallbackDto) {
    return this.authService.handleCallback(dto);
  }
}
