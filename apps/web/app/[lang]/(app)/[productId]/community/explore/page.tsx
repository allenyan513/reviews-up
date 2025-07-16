'use client';

import React, { use } from 'react';
import ExplorePage from '@/modules/community/explore-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return <ExplorePage lang={lang} productId={productId} />;
}
