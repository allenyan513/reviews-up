import { Form } from '@repo/database/generated/client';

export interface FormEntity extends Form {
  reviewCount?: number;
}
