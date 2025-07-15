'use client';

import React from 'react';
import { PromotionMyProducts } from '@/modules/promotion/promotion-my-products';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  return <PromotionMyProducts params={props.params} />;
}
