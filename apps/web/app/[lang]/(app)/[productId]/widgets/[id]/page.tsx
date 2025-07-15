'use client';

import WidgetIdPage from '@/modules/widget/widget-id-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  return <WidgetIdPage params={props.params} />;
}
