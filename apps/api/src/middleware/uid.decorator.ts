import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Uid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['userId'];
  },
);
