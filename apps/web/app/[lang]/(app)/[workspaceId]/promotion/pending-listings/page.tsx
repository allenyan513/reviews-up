'use client';

import React, { use } from 'react';
import { PromotionProductListings } from '@/modules/promotion/promotion-product-listings';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  return (
    <PromotionProductListings
      lang={lang}
      workspaceId={workspaceId}
      status={'pendingForReceive'}
    />
  );
}
