'use client';
import { RequestOptions } from '../api/request-options';
import { useShowcase } from '../hooks/use-showcase';
import { ShowcasePageReviewClient } from './showcase-page-review-client';

export function ShowcaseClient(props: {
  showcaseId: string;
  options?: RequestOptions;
}) {
  const { showcaseId, options } = props;
  const { showcase, error } = useShowcase(showcaseId, options);

  if (!showcase) {
    return null;
  }

  return <ShowcasePageReviewClient showcase={showcase} />;
}
