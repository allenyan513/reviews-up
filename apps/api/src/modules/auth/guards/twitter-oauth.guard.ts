import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class TwitterOauthGuard extends AuthGuard('twitter') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const { redirect } = request.query;
    if (redirect) {
      return {
        state: encodeURIComponent(redirect as string),
      };
    }
    return {};
  }
}
