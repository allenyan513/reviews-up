'use client';

import { ReviewItem } from '../review-item';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';

interface ListLayoutClientProps {
  items: ReviewEntity[];
  config: ShowcaseConfig;
}

export function ListLayoutClient(props: ListLayoutClientProps) {
  const { items, config } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item, index) => (
        <ReviewItem
          isSourceEnabled={config.isSourceEnabled}
          isVideoEnabled={config.isVideoEnabled}
          isImageEnabled={config.isImageEnabled}
          isDateEnabled={config.isDateEnabled}
          isRatingEnabled={config.isRatingEnabled}
          key={item.id}
          review={item}
        />
      ))}
    </div>
  );
}
