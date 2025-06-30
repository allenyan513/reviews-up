'use client';

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ReviewItem } from '../item/review-item';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { RatingSummary } from '../rating-summary';
import { useBreakpoints } from '../../hooks/use-breakpoints';

interface FlowLayoutClientProps {
  items: ReviewEntity[];
  config: ShowcaseConfig;
  breakpoints?: { [key: string]: number }; // e.g., { sm: 1, md: 2, lg: 3 }
  defaultColumns?: number;
}

export function FlowLayoutClient({ items, config }: FlowLayoutClientProps) {
  const columns = useBreakpoints(config.breakpoints);

  const renderItem = (
    review: ReviewEntity,
    config: ShowcaseConfig,
    idx: number,
  ) => {
    return (
      <ReviewItem
        isSourceEnabled={config.isSourceEnabled}
        isVideoEnabled={config.isVideoEnabled}
        isImageEnabled={config.isImageEnabled}
        isDateEnabled={config.isDateEnabled}
        isRatingEnabled={config.isRatingEnabled}
        key={review.id}
        review={review}
      />
    );
  };

  const renderedColumns: ReactNode[][] = Array(columns)
    .fill(null)
    .map(() => []);

  items.forEach((item, idx) => {
    renderedColumns[idx % columns].push(renderItem(item, config, idx));
  });

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div style={{ display: 'flex', gap: '16px' }}>
        {renderedColumns.map((colItems, colIdx) => (
          <div key={colIdx} style={{ flex: 1 }}>
            {colItems.map((child, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
    </div>
  );
}
