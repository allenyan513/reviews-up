import {
  User,
  Workspace,
  Showcase,
  Review,
} from '@repo/database/generated/client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';

export interface ShowcaseEntity extends Showcase {
  user?: User;
  workspace?: Workspace;
  reviews?: ReviewEntity[];
}

export interface ShowcaseConfig {
  type?: string;
  isRatingEnabled?: boolean;
  isSourceEnabled?: boolean;
  isDateEnabled?: boolean;
  isImageEnabled?: boolean;
  isVideoEnabled?: boolean;
  sortBy?: 'newest' | 'oldest' | 'random' | 'rating' | string
  flow?: {
    columns?: number;
  };
}
