// src/auth/dto/github-callback.dto.ts
import { IsString, IsEmail, IsOptional, IsISO8601 } from 'class-validator';

export class AuthProviderCallbackDto {
  @IsString()
  provider: string; // Provider name, e.g., 'github'

  @IsString()
  providerAccountId: string; // Provider's unique account ID, e.g., GitHub ID

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsISO8601()
  loginTime: string;
}
