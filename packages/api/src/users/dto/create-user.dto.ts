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
