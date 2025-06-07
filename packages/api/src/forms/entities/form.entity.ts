import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

export class Form {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  workspace?: Workspace;

  constructor(partial: Partial<Form>) {
    Object.assign(this, partial);
  }
}
