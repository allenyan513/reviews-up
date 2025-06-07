import { User } from '../../users/entities/user.entity';

export class Workspace{
  id: string;
  name: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
