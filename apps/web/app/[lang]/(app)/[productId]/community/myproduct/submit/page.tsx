'use client';

import React, { use } from 'react';
import { LaunchSubmitOrEditPage } from '@/modules/community/launch-submit-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return (
    <LaunchSubmitOrEditPage lang={lang} productId={productId} mode={'new'} />
  );
}
