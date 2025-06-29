import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@src/app.types';

export const Jwt = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // req.user 是由 JwtStrategy 的 validate 方法返回的
    if (!user) {
      return null;
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
