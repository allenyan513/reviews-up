'use client';

import {CampaignProvider} from '@/modules/campaign/context/campaign-provider';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <CampaignProvider>{props.children}</CampaignProvider>;
}
