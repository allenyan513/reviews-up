'use client';

import React from 'react';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { renderItem } from '../item';
import { PoweredBy } from '../powered-by';
import styled from 'styled-components';
import { MoreReviews } from '../more-reviews';

const RootDive = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

export function SingleLayout(props: {
  items: ReviewEntity[];
  config: WidgetConfig;
  url: string,
  reviewsCount: number;
}) {
  const { config, items , url, reviewsCount} = props;
  if (!items || items.length === 0) {
    return null;
  }
  const firstReview = items[0];
  return (
    <RootDive>
      {renderItem(firstReview, 'style', config)}
      {/*{config.isMoreViewsEnabled && <MoreReviews url={url} reviewsCount={reviewsCount} />}*/}
    </RootDive>
  );
}
