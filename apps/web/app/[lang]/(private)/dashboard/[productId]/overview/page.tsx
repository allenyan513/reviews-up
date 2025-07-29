'use client';

import React, { use } from 'react';
import { LaunchPage } from '@/modules/product/launch-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return <LaunchPage lang={lang} productId={productId} />;
}
