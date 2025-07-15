import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from '@src/modules/auth/strategies/github.strategy';
import { EmailMagicStrategy } from '@src/modules/auth/strategies/email-magic.strategy';
import { TwitterStrategy } from '@src/modules/auth/strategies/twitter.strategy';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    EmailMagicStrategy,
    TwitterStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
