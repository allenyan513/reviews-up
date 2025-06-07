import { Workspace } from '../../workspaces/entities/workspace.entity';

export class Widget {
  id: string;
  workspace: Workspace;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;


}
