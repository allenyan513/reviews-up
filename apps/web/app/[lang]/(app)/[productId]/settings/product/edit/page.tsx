'use client';

import React, { use } from 'react';
import ProductNewEditPage from '@/modules/product/product-new-edit-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return <ProductNewEditPage mode="edit" lang={lang} productId={productId} />;
}
