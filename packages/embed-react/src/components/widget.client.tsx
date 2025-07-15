'use client';
import { RequestOptions } from '../api/request-options';
import { useWidget } from '../hooks/use-widget';
import { WidgetPageReviewClient } from './widget-page-review-client';

export function WidgetClient(props: {
  widgetId: string;
  options?: RequestOptions;
}) {
  const { widgetId, options } = props;
  const { widget, error } = useWidget(widgetId, options);

  if (!widget) {
    return null;
  }
  return <WidgetPageReviewClient widget={widget} />;
}
