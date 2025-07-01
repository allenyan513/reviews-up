export type JwtPayload = {
  userId: string;
  email: string;
  provider?: string;
  providerAccountId?: string;
};
