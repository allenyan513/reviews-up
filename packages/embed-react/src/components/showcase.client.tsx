'use client';
import { useShowcase } from '../hooks/use-showcase';
import { ShowcasePageReviewClient } from './showcase-page-review-client';

export function ShowcaseClient(props: { showcaseId: string }) {
  const { showcaseId } = props;
  const { showcase, error } = useShowcase(showcaseId);

  if (!showcase) {
    return null;
  }

  return <ShowcasePageReviewClient showcase={showcase} />;
}
