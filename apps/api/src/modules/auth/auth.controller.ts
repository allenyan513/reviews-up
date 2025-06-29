import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Logger,
  Post,
  Body,
  Session,
} from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GithubOauthGuard } from '@src/modules/auth/guards/github-oauth.guard';
import { EmailMagicGuard } from '@src/modules/auth/guards/email-magic.guard';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { TwitterOauthGuard } from '@src/modules/auth/guards/twitter-oauth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Get('signOut')
  async singOut(@Res() res: Response) {
    this.logger.debug('Sign Out');
    res.clearCookie('access_token', {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect(`${process.env.APP_URL}`);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('callback/google')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    const redirectParam = req.query.state as string;
    let redirectUrl = `${process.env.APP_URL}/en/auth/callback?access_token=${token}`;
    if (redirectParam) {
      redirectUrl = `${redirectUrl}&redirect=${encodeURIComponent(redirectParam)}`;
    }
    return res.redirect(redirectUrl);
  }

  @UseGuards(GithubOauthGuard)
  @Get('github')
  async githubAuth() {}

  @UseGuards(GithubOauthGuard)
  @Get('callback/github')
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    const redirectParam = req.query.state as string;
    let redirectUrl = `${process.env.APP_URL}/en/auth/callback?access_token=${token}`;
    if (redirectParam) {
      redirectUrl = `${redirectUrl}&redirect=${encodeURIComponent(redirectParam)}`;
    }
    return res.redirect(redirectUrl);
  }

  @UseGuards(TwitterOauthGuard)
  @Get('twitter')
  async twitterAuth() {}

  @UseGuards(TwitterOauthGuard)
  @Get('callback/twitter')
  async twitterAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: any,
  ) {
    //todo
    session.regenerate(function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to regenerate session' });
      }
      const state = JSON.stringify(session.req.authInfo.state, undefined, 2);
      const userData = JSON.stringify(req.user, undefined, 2);
      res.end(
        `<h1>Authentication succeeded</h1> User data: <pre>${userData}</pre>
        State:
        <pre>${state}</pre>
        `
      );
    });
  }

  @Post('send-magic-link')
  async sendLink(
    @Body('email') email: string,
    @Body('redirect') redirect?: string,
  ) {
    return this.authService.sendMagicLink(email, redirect);
  }

  @UseGuards(EmailMagicGuard)
  @Get('magic-login')
  async loginWithMagic(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    const encodedRedirect = req.query.redirect as string;
    let redirectUrl = `${process.env.APP_URL}/en/auth/callback?access_token=${token}`;
    if (encodedRedirect) {
      redirectUrl = `${redirectUrl}&redirect=${encodedRedirect}`;
    }
    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSession')
  async getSession(@Jwt() jwt: JwtPayload) {
    return jwt;
  }
}
