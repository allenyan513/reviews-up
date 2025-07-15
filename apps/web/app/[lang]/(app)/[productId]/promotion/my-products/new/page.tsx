'use client';

import React, { use } from 'react';
import { PromotionNewProduct } from '@/modules/promotion/promotion-new-product';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return (
    <PromotionNewProduct mode="new" lang={lang} productId={productId} />
  );
}
