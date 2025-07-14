'use client';
import React, { Suspense } from 'react';
import { ShowcaseClient, ShowcaseServer } from '@reviewsup/embed-react';

export function ProductDetailReviews(props: {
  showcaseShortId: string;
  options?: {
    url?: string;
  };
}) {
  const { showcaseShortId, options } = props;
  return (
    <ShowcaseClient
      showcaseId={showcaseShortId}
      options={{
        url: options?.url || process.env.NEXT_PUBLIC_API_URL || '',
      }}
    />
  );
}
