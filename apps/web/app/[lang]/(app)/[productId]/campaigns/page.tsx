'use client';

import CampaignListPage from '@/modules/campaign/campaign-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  return <CampaignListPage params={props.params} />;
}
