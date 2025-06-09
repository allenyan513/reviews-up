import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { FormEntity } from '@repo/api/forms/entities/form.entity';

export type PageParams = {
  lang: string;
  shortId: string;
  mode: 'edit' | 'public';
  form: FormEntity;
  config: FormConfig;
};
