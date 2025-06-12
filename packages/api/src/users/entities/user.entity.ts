import { Workspace } from '../../workspaces/entities/workspace.entity';

export class User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  Workspace?: Workspace[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
