'use client';

import React from 'react';
import { PromotionNewProduct } from '@/modules/promotion/promotion-new-product';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <PromotionNewProduct params={props.params} />;
}
