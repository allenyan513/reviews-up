
export class ReviewMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}
