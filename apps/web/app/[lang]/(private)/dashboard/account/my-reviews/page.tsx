import ReviewListPage from '@/modules/review/review-list-page';
import React from 'react';

export default function Page() {
  return (
    <ReviewListPage
      lang={lang}
      productId={'1'}
      status={'all'}
      mode={'reviewerId'}
    />
  );
}
