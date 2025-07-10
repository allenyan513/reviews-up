'use client';

import React, { use } from 'react';
import { PromotionNewProduct } from '@/modules/promotion/promotion-new-product';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const { lang, workspaceId, id } = use(props.params);
  return (
    <PromotionNewProduct
      mode="edit"
      lang={lang}
      workspaceId={workspaceId}
      id={id}
    />
  );
}
