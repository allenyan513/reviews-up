export class CreateReviewDto {
  workspaceId: string;
  formId: string;

  reviewerName: string;
  reviewerImage: string;
  reviewerEmail: string;
  rating: number;
  text: string;
  imageUrl: string;
  videoUrl: string;
  twitterUrl: string;
  status: string;
}
