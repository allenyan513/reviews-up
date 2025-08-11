import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException, Logger,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {SlackService} from '../modules/slack/slack.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptionsFilter');

  constructor(private readonly slackService: SlackService) {
  }

  // 忽略的 HTTP 状态码
  private ignoreStatusCodes = [
    HttpStatus.UNAUTHORIZED, // 401
  ];

  // 忽略的异常类型
  private ignoreExceptionTypes = [
    UnauthorizedException,
    // MyCustomException, // 以后可以加
  ];

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    // 检查是否需要忽略
    const shouldIgnore =
      this.ignoreStatusCodes.includes(status) ||
      this.ignoreExceptionTypes.some((type) => exception instanceof type);
    if (shouldIgnore) {
      return response.status(status).json({
        statusCode: status,
        message,
      });
    }

    // 发送到 Slack
    const errorMessage = `🚨 *NestJS Error*  
*URL:* ${request.url}  
*Method:* ${request.method}  
*Status:* ${status}  
*Message:* ${JSON.stringify(message)}`;
    await this.slackService.sendMessage(errorMessage);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
