'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ReviewItem } from '../review-item';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';

interface FlowLayoutClientProps {
  items: ReviewEntity[];
  config: ShowcaseConfig;
  breakpoints?: { [key: string]: number }; // e.g., { sm: 1, md: 2, lg: 3 }
  defaultColumns?: number;
}

function getColumnsFromWidth(
  width: number,
  breakpoints: Record<string, number>,
) {
  if (width < 640) return breakpoints.sm ?? 1;
  if (width < 768) return breakpoints.md ?? 2;
  return breakpoints.lg ?? 3;
}

export function FlowLayoutClient({
  items,
  config,
  breakpoints = { sm: 1, md: 2, lg: 3 },
  defaultColumns = 3,
}: FlowLayoutClientProps) {
  const [columns, setColumns] = useState(defaultColumns);

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

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumns(getColumnsFromWidth(width, breakpoints));
    };

    updateColumns(); // run once at mount
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [breakpoints]);

  const renderedColumns: ReactNode[][] = Array(columns)
    .fill(null)
    .map(() => []);

  items.forEach((item, idx) => {
    renderedColumns[idx % columns].push(renderItem(item, config, idx));
  });

  return (
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
  );
}
