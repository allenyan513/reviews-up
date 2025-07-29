'use client';

import React from 'react';
import WidgetListPage from '@/modules/widget/widget-list-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  return <WidgetListPage params={props.params} />;
}
