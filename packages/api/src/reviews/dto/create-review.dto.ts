export class CreateReviewDto {
  workspaceId: string;
  formId?: string;
  reviewerName: string;
  reviewerImage?: string;
  reviewerEmail?: string;
  rating?: number;
  text?: string;
  twitterUrl?: string;
  status: string;
  mediaIds?: string[];
}
