import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailMagicGuard extends AuthGuard('email-magic') {}
