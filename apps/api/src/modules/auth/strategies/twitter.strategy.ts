import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-twitter';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  private logger = new Logger('TwitterStrategy');

  constructor(private authService: AuthService) {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    });
  }

  async validate(...args: any[]): Promise<any> {
    this.logger.debug('Arguments received in TwitterStrategy validate:', args);
    const { accessToken, refreshToken, profile }: any = args;
    const {
      provider,
      id,
      displayName,
      email,
      email_verified,
      verified,
      picture,
    } = profile;
    return this.authService.validateOAuthLogin({
      provider: provider,
      providerAccountId: id,
      email: email,
      name: displayName,
      avatarUrl: picture,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
