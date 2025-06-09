import { $Enums } from '@repo/database/generated/client';
import ShowcaseType = $Enums.ShowcaseType;

export class CreateShowcaseDto {
  workspaceId: string;
  name: string;
  type: ShowcaseType
}
