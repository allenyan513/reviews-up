'use client';

import { ReviewItem } from '../item/review-item';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';

interface ListLayoutClientProps {
  items: ReviewEntity[];
  config: WidgetConfig;
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
