'use client';

import {CampaignCreatePage} from "@/modules/campaign/create";

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
  searchParams: Promise<{
    formId?: string;
  }>
}) {
  return <CampaignCreatePage
    params={props.params}
    searchParams={props.searchParams}
  />;
}
