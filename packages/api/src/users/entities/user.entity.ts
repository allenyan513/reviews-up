import { Workspace } from '../../workspaces/entities/workspace.entity';
import { ReviewEntity } from '../../reviews/entities/review.entity';

export class User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  Workspace?: Workspace[];
  Review?: ReviewEntity[]; // Adjust type as needed

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
