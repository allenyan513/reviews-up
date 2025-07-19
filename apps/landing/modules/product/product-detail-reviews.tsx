'use client';
import React, { Suspense } from 'react';
import { Widget} from '@reviewsup/embed-react';

export function ProductDetailReviews(props: {
  widgetShortId: string;
  options?: {
    url?: string;
  };
}) {
  const { widgetShortId, options } = props;
  return (
    <Widget
      id={widgetShortId}
      options={{
        url: options?.url || process.env.NEXT_PUBLIC_API_URL || '',
      }}
    />
  );
}
