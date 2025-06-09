import { ReviewSource} from '@repo/database/generated/client/index'
export class CreateReviewDto {
  workspaceId?: string;
  formId?: string;
  reviewerName: string;
  reviewerImage?: string;
  reviewerEmail?: string;
  rating?: number;
  text?: string;
  tweetId?: string;
  source?: ReviewSource;
  mediaIds?: string[];
}
