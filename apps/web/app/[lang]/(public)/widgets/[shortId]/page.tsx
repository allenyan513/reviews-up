'use client';
import WidgetShortidPage from '@/modules/widget/widget-shortid-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  return <WidgetShortidPage params={props.params} />;
}
