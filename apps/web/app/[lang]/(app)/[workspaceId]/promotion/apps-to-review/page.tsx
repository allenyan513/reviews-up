'use client';

import React from 'react';
import { PromotionAppsToReview } from '@/modules/promotion/promotion-apps-to-review';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <PromotionAppsToReview params={props.params} />;
}
