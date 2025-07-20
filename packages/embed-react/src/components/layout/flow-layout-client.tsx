'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { RatingSummary } from '../rating-summary';
import { useBreakpoints } from '../../hooks/use-breakpoints';
import { PoweredBy } from '../powered-by';
import { renderItem } from '../item';

interface FlowLayoutClientProps {
  items: ReviewEntity[];
  config: WidgetConfig;
  breakpoints?: { [key: string]: number }; // e.g., { sm: 1, md: 2, lg: 3 }
  defaultColumns?: number;
}

export function FlowLayoutClient({ items, config }: FlowLayoutClientProps) {
  const columns = useBreakpoints(config.breakpoints);

  const renderedColumns: ReactNode[][] = Array(columns)
    .fill(null)
    .map(() => []);

  items.forEach((item, idx) => {
    renderedColumns[idx % columns].push(renderItem(item, 'style', config));
  });

  return (
    <div
      // className="w-full flex flex-col justify-center items-center gap-4"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        // className="flex flex-row gap-4"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        {renderedColumns.map((colItems, colIdx) => (
          <div key={colIdx} style={{ flex: 1 }}>
            {colItems.map((child, i) => (
              <div
                key={i}
                // className="mb-4"
                style={{
                  marginBottom: '1rem',
                }}
              >
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
      {config.isPoweredByEnabled && <PoweredBy />}
    </div>
  );
}
