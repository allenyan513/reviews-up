import { Suspense } from 'react';
import { api } from '../api';
import { WidgetPageReviewClient } from './widget-page-review-client';
import { RequestOptions } from '../api/request-options';

export async function WidgetContent(props: {
  widgetId: string;
  options?: RequestOptions;
}) {
  const { widgetId, options } = props;
  console.log('Widget Content', widgetId);
  if (!widgetId) {
    return <div>No widget ID provided.</div>;
  }
  let error;
  let widget = await api.widget
    .getWidgetByShortId(widgetId, options)
    .catch((err) => {
      console.error(err);
      error = err;
    });
  if (!widget || error) {
    return (
      <div>Error loading widget: {error?.message || 'Unknown error'}</div>
    );
  }
  return <WidgetPageReviewClient widget={widget} />;
}

export async function WidgetServer(props: {
  widgetId: string;
  options?: RequestOptions;
  fallback?: React.ReactNode;
}) {
  const { fallback, widgetId } = props;
  return (
    <Suspense fallback={fallback}>
      <WidgetContent widgetId={widgetId} options={props.options} />
    </Suspense>
  );
}
