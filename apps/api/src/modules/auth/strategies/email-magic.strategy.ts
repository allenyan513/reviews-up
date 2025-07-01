import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '@src/modules/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class EmailMagicStrategy extends PassportStrategy(
  Strategy,
  'email-magic',
) {
  private logger = new Logger('GithubStrategy');

  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any) {
    const token = req.query.token;
    return this.authService.validateMagicToken(token);
  }
}
