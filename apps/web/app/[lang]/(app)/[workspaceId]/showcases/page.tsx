'use client';

import React from 'react';
import ShowcaseListPage from '@/modules/showcase/showcase-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <ShowcaseListPage params={props.params} />;
}
