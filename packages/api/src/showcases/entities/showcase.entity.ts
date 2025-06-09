import {
  User,
  Workspace,
  Showcase,
  Review,
} from '@repo/database/generated/client';

export interface ShowcaseEntity extends Showcase {
  user?: User;
  workspace?: Workspace;
  reviews?: Review[];
}
