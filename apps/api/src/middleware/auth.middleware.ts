import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthFilterMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthFilterMiddleware.name);
  private skipPaths: string[] = [
    '/auth/callback',
    '/health',
    '/strapi/webhook',
    '/crawler/cron',
  ];
  private streamPaths = ['/docs/chat'];

  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // this.logger.debug(`req.baseUrl: ${req.baseUrl}`);
    let idToken: string | null = req.get('idToken') || null;
    const baseUrl = req.baseUrl;
    if (this.streamPaths.includes(baseUrl)) {
      idToken = req.query.idToken as string;
    }

    const isSkipPath = this.skipPaths.some((path) => {
      const { regexp } = pathToRegexp(path);
      return regexp.test(baseUrl);
    });

    if (idToken == null) {
      if (isSkipPath) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    } else {
      try {
        // this.logger.debug(`idToken: ${idToken}`);
        const user = await this.authService.decodeIdToken(idToken);
        if (!user) {
          res.status(401).send('Unauthorized');
        } else {
          req.headers['userId'] = user.id;
          req['userId'] = user.id;
          next();
        }
      } catch (error) {
        this.logger.error(error);
        res.status(401).send('Unauthorized');
      }
    }
  }
}
