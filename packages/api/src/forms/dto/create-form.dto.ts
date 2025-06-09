import { FormConfig } from '../entities/form-config.entity';

export class CreateFormDto {
  workspaceId: string;
  name: string;
  config?: FormConfig;
}
