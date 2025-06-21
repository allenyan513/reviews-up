import { User } from '../../users/index';

export class Workspace {
  id: string;
  name: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
