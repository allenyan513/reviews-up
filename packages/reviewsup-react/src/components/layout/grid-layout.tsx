'use client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { ReviewItem2 } from '../item/review-item-2';
import { RatingSummary } from '../rating-summary';
import React from 'react';
import { useBreakpoints } from '../../hooks/use-breakpoints';

export function GridLayout(props: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
}) {
  const { items, config } = props;
  const columns = useBreakpoints(config.breakpoints);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        className="w-full grid gap-4"
      >
        {items.map((item, idx) => (
          <ReviewItem2
            key={item.id}
            isSourceEnabled={config.isSourceEnabled}
            isVideoEnabled={config.isVideoEnabled}
            isImageEnabled={config.isImageEnabled}
            isDateEnabled={config.isDateEnabled}
            isRatingEnabled={config.isRatingEnabled}
            review={item}
          />
        ))}
      </div>
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
    </div>
  );
}
