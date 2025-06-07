import { Workspace } from '../../workspaces/entities/workspace.entity';

export class CreateWidgetDto {
  workspace: Workspace;
  name: string;
  type: string;
}
