import { Controller, UseGuards, Get, Req, Res, Logger, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GithubOauthGuard } from '@src/modules/auth/guards/github-oauth.guard';
import { EmailMagicGuard } from '@src/modules/auth/guards/email-magic.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Get('signOut')
  async singOut(@Res() res: Response) {
    this.logger.debug('Sign Out');
    res.clearCookie('access_token', {
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('callback/google')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const jwtPayload = req.user;
    const token = this.authService.generateJwt(jwtPayload);
    this.logger.debug('Google Auth Callback', jwtPayload, token);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 1000,
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @UseGuards(GithubOauthGuard)
  @Get('github')
  async githubAuth() {}

  @UseGuards(GithubOauthGuard)
  @Get('callback/github')
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    this.logger.debug('Github Auth Callback', token);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 1000,
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @Post('send-magic-link')
  async sendLink(@Body('email') email: string) {
    return this.authService.sendMagicLink(email);
  }

  @UseGuards(EmailMagicGuard)
  @Get('magic-login')
  async loginWithMagic(@Req() req, @Res() res: Response) {
    this.logger.debug('Magic Login Callback', req.user);
    const jwtPayload = req.user;
    const token = this.authService.generateJwt(jwtPayload);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 1000,
      sameSite: 'lax', // 'none' 'lax' 有巨大区别， 'none' 需要 https, 'lax' 不需要
      secure: false,
    });
    return res.redirect(`${process.env.APP_URL}`);
  }
}
