'use client';
import { FlowLayoutClient } from '@reviewsup/embed-react';
import React from 'react';
import { ReviewEntity } from '@reviewsup/api/reviews';

export function FlowLayoutClientWrapper(props: {
  reviews: any[] | undefined;
  config: any;
}) {
  const { reviews, config } = props;
  return <FlowLayoutClient items={reviews as ReviewEntity[]} config={config} />;
}
