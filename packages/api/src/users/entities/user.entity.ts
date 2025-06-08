import { Workspace } from '../../workspaces/entities/workspace.entity';

export class User {
  id: string;
  name: string;
  email: string;
  image: string;
  idToken: string;
  Workspace?: Workspace[];
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
