'use client';
import ShowcaseShortIdPage from '@/modules/showcase/showcase-shortid-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  return <ShowcaseShortIdPage params={props.params} />;
}
