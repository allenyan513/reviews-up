import { Suspense } from 'react';
import { api } from '../api';
import { ShowcasePageReviewClient } from './showcase-page-review-client';
import { RequestOptions } from '../api/request-options';

export async function ShowcaseContent(props: {
  showcaseId: string;
  options?: RequestOptions;
}) {
  const { showcaseId, options } = props;
  if (!showcaseId) {
    return <div>No showcase ID provided.</div>;
  }
  let error;
  let showcase = await api.showcase
    .getShowcaseByShortId(showcaseId, options)
    .catch((err) => {
      console.error(err);
      error = err;
    });
  if (!showcase) {
    return (
      <div>Error loading showcase: {error?.message || 'Unknown error'}</div>
    );
  }

  return <ShowcasePageReviewClient showcase={showcase} />;
}

export async function ShowcaseServer(props: {
  showcaseId: string;
  options?: RequestOptions;
  fallback?: React.ReactNode;
}) {
  const { fallback, showcaseId } = props;
  return (
    <Suspense fallback={fallback}>
      <ShowcaseContent showcaseId={showcaseId} options={props.options} />
    </Suspense>
  );
}
