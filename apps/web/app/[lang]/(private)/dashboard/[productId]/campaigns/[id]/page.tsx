'use client';

import { use } from 'react';
import { CampaignIdPage } from '@/modules/campaign/id';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const { id, lang, productId } = use(props.params);
  if (!id || !lang || !productId) {
    return null;
  }
  return <CampaignIdPage params={props.params} />;
}
