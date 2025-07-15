'use client';

import { RequestOptions } from '../api/request-options';
import { useWidget } from '../hooks/use-widget';
import { WidgetPageReviewClient } from './widget-page-review-client';

export interface ReviewsUpProps {
  widgetId: string;
  formId?: string;
  options?: RequestOptions;
}

export function ReviewsUp(props: ReviewsUpProps) {
  const { widgetId, formId, options } = props;
  const { widget, error } = useWidget(widgetId, options);

  if (!widget) {
    return (
      <blockquote
        className="reviewsup-embed"
        cite={`https://app.reviewsup.io/widgets/${widgetId}`}
        data-widget-id={widgetId}
      >
        <a
          href="https://reviewsup.io"
          className="reviewsup-embed-error"
          target="_blank"
        >
          reviewsup.io
        </a>
      </blockquote>
    );
  }
  return (
    <blockquote
      className="reviewsup-embed"
      cite={`https://app.reviewsup.io/widgets/${widgetId}`}
      data-widget-id={widgetId}
    >
      <WidgetPageReviewClient widget={widget} />;
    </blockquote>
  );
}
