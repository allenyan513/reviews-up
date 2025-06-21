'use client';

import {CampaignCreatePage} from "@/modules/campaign/create";

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <CampaignCreatePage params={props.params}/>;
}
