'use client';

import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { ReviewItem2 } from '../item/review-item-2';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { RatingSummary } from '../RatingSummary';
import { useBreakpoints } from '../../hooks/use-breakpoints';

export function FixRowLayout(props: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
}) {
  const { items, config } = props;
  const columns = useBreakpoints(config.breakpoints);
  const limitedItems = items.slice(0, columns);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
          padding: '16px',
        }}
      >
        {limitedItems.map((item, index) => (
          <ReviewItem2
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
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
    </div>
  );
}
