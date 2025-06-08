export class CreateReviewMediaDto {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  reviewId?: string;
}
