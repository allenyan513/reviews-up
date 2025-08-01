'use client';

import { Widget } from '@reviewsup/embed-react';

export function WidgetWrapper(props: { widgetId: string }) {
  const { widgetId } = props;
  return <Widget id={widgetId} />;
}
