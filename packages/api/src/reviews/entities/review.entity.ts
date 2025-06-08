import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Form } from '../../forms/entities/form.entity';
import { ReviewMedia } from './review-media.entity';

export class Review {
  workspace: Workspace;
  form?: Form;
  reviewerName: string;
  reviewerImage?: string;
  reviewerEmail?: string;
  rating?: number;
  text?: string;
  twitterUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  medias?: ReviewMedia[];
}
