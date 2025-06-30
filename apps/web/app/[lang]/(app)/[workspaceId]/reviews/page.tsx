'use client';

import React from 'react';
import ReviewListPage from '@/modules/review/review-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  return <ReviewListPage params={props.params}/>
}
