export class ReviewMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  reviewId?: string;
  createdAt: Date;
  updatedAt: Date;
}
