import { Suspense } from 'react';
import { api } from '../api';
import { ShowcasePageReview } from './showcase-page-review';

export type ShowcaseContentProps = Omit<ShowcaseProps, 'fallback'>;
export type ShowcaseProps = {
  fallback?: React.ReactNode;
  showcaseId?: string;
};

export async function ShowcaseContent({ showcaseId }: ShowcaseContentProps) {
  if (!showcaseId) {
    return <div>No showcase ID provided.</div>;
  }
  let error;
  let showcase = await api.showcase
    .getShowcaseByShortId(showcaseId)
    .catch((err) => {
      console.error(err);
      error = err;
    });

  if (!showcase) {
    return (
      <div>Error loading showcase: {error?.message || 'Unknown error'}</div>
    );
  }

  return <ShowcasePageReview showcase={showcase} />;
}

export async function Showcase({
  fallback = <div>Loading...</div>,
  ...props
}: ShowcaseProps) {
  return (
    <Suspense fallback={fallback}>
      <ShowcaseContent {...props} />
    </Suspense>
  );
}
