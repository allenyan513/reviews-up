'use client';
import { WidgetProvider } from '@/modules/widget/context/widget-context';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <WidgetProvider>{props.children}</WidgetProvider>;
}
