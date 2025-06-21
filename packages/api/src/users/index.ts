import { Workspace } from '../workspaces/entities/workspace.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { PartialType } from '@nestjs/mapped-types';
import { SubscriptionTier } from '@repo/database/generated/client';

export class User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  subscriptionTier: SubscriptionTier;
  Workspace?: Workspace[];
  Review?: ReviewEntity[]; // Adjust type as needed

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class CreateUserDto {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export class CreateAccountDto {
  email: string;
  provider: string;
  providerAccountId: string;
  name?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
