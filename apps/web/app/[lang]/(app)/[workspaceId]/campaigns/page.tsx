'use client';

import CampaignListPage from '@/modules/campaign/campaign-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <CampaignListPage params={props.params} />;
}
