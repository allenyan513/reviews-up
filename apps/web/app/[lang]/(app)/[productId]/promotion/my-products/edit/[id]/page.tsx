'use client';

import React, { use } from 'react';
import { PromotionNewProduct } from '@/modules/promotion/promotion-new-product';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const { lang, productId, id } = use(props.params);
  return (
    <PromotionNewProduct
      mode="edit"
      lang={lang}
      productId={productId}
      id={id}
    />
  );
}
