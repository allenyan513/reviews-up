export class CreateUserDto {
  provider: string;
  providerAccountId: string;
  name?: string;
  email?: string;
  image?: string;
}
