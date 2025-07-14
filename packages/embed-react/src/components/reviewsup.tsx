'use client';

import { RequestOptions } from '../api/request-options';
import { useShowcase } from '../hooks/use-showcase';
import { ShowcasePageReviewClient } from './showcase-page-review-client';

export interface ReviewsUpProps {
  showcaseId: string;
  formId?: string;
  options?: RequestOptions;
}

export function ReviewsUp(props: ReviewsUpProps) {
  const { showcaseId, formId, options } = props;
  const { showcase, error } = useShowcase(showcaseId, options);

  if (!showcase) {
    return (
      <blockquote
        className="reviewsup-embed"
        cite={`https://app.reviewsup.io/showcases/${showcaseId}`}
        data-widget-id={showcaseId}
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
      cite={`https://app.reviewsup.io/showcases/${showcaseId}`}
      data-widget-id={showcaseId}
    >
      <ShowcasePageReviewClient showcase={showcase} />;
    </blockquote>
  );
}
