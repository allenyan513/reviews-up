import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as cookie from 'cookie';
import { JwtPayload } from '@src/common/types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');

  constructor(private prismaService: PrismaService) {
    const extractJwtFromCookieOrBearerToken = (req) => {
      let cookieToken = null;
      if (req && req.headers && req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        cookieToken = cookies['access_token'];
      }
      const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      return cookieToken || bearerToken;
    };
    super({
      jwtFromRequest: extractJwtFromCookieOrBearerToken,
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
