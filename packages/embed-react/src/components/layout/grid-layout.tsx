'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { RatingSummary } from '../rating-summary';
import React from 'react';
import { useBreakpoints } from '../../hooks/use-breakpoints';
import { PoweredBy } from '../powered-by';
import { renderItem } from '../item';

export function GridLayout(props: {
  items: ReviewEntity[];
  config: WidgetConfig;
}) {
  const { items, config } = props;
  const columns = useBreakpoints(config.breakpoints);

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
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          display: 'grid',
          gap: '1rem',
          width: '100%',
        }}
      >
        {items.map((item, idx) => {
          return renderItem(item, 'style-1', config, '100%', '300px');
        })}
      </div>
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
      {config.isPoweredByEnabled && <PoweredBy />}
    </div>
  );
}
