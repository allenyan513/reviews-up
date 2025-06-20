import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from '@src/modules/auth/strategies/github.strategy';
import { FormsModule } from '@src/modules/forms/forms.module';
import { ShowcasesModule } from '@src/modules/showcases/showcases.module';
import { FormsService } from '@src/modules/forms/forms.service';
import { ShowcasesService } from '@src/modules/showcases/showcases.service';
import { EmailMagicStrategy } from '@src/modules/auth/strategies/email-magic.strategy';
import { TwitterStrategy } from '@src/modules/auth/strategies/twitter.strategy';

@Global()
@Module({
  imports: [FormsModule, ShowcasesModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    EmailMagicStrategy,
    TwitterStrategy,
    FormsService,
    ShowcasesService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
