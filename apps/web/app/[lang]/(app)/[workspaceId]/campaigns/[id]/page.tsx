'use client';

import {use} from 'react';
import {CampaignIdPage} from '@/modules/campaign/id';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const {id, lang, workspaceId} = use(props.params);
  if (!id || !lang || !workspaceId) {
    return null;
  }
  return <CampaignIdPage params={props.params}/>;
}
