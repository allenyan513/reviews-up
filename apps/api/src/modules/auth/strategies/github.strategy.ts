import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private logger = new Logger('GithubStrategy');

  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUBS_CLIENT_ID,
      clientSecret: process.env.GITHUBS_CLIENT_SECRET,
      callbackURL: process.env.GITHUBS_CALLBACK_URL,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    this.logger.debug('GithubStrategy validate', profile);
    const { provider, id, username, emails } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    return this.authService.validateOAuthLogin({
      provider: provider,
      providerAccountId: id,
      email: email,
      name: username || profile.displayName,
      avatarUrl: profile._json.avatar_url,
      accessToken,
      refreshToken,
    });
  }
}
