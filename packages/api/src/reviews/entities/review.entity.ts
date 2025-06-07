import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Form } from '../../forms/entities/form.entity';

export class Review {
  workspace: Workspace;
  form: Form;
  reviewerName: string;
  reviewerImage: string;
  reviewerEmail: string;
  rating: number;
  text: string;
  imageUrl: string;
  videoUrl: string;
  twitterUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
