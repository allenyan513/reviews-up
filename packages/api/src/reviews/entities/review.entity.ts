import { ReviewMedia } from './review-media.entity';
import { Review } from '@repo/database/generated/client';

export interface ReviewEntity extends Review {
  medias?: ReviewMedia[];
}
