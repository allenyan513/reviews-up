'use client';
import React, { use } from 'react';
import ProductNewEditPage from '@/modules/product/product-new-edit-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = use(props.params);
  return <ProductNewEditPage lang={lang} mode={'new'} />;
}
