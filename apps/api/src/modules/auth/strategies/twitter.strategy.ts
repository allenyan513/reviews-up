import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  private logger = new Logger('TwitterStrategy');

  constructor(private authService: AuthService) {
    super({
      clientType: 'confidential',
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    this.logger.debug('Arguments received in TwitterStrategy validate:', {
      accessToken,
      refreshToken,
      profile,
    });
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
