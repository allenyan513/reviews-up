export class CreateReviewDto {
  workspaceId?: string;
  formId?: string;
  rating: number;
  message: string;
  fullName: string;
  email: string;
  imageUrls: string[];
  videoUrl: string;
  tweetId: string;
}
