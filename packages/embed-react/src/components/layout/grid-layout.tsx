'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { ShowcaseConfig } from '@reviewsup/api/showcases';
import { RatingSummary } from '../rating-summary';
import React from 'react';
import { useBreakpoints } from '../../hooks/use-breakpoints';
import { PoweredBy } from '../powered-by';
import { renderItem } from '../item';

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
