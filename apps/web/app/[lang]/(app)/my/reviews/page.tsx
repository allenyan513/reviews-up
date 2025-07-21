'use client';

import React, { use } from 'react';
import ReviewListPage from '@/modules/review/review-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = use(props.params);
  return (
    <ReviewListPage
      lang={lang}
      productId={'1'}
      status={'all'}
      mode={'reviewerId'}
    />
  );
}
