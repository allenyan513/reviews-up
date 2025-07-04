'use client';

import { ReviewItem } from '../item/review-item';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { ShowcaseConfig } from '@reviewsup/api/showcases';

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
          key={item.id}
          review={item}
          config={config}
        />
      ))}
    </div>
  );
}
