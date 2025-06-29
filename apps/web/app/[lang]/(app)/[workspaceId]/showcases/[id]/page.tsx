'use client';

import ShowcaseIdPage from '@/modules/showcase/showcase-id-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  return <ShowcaseIdPage params={props.params}/>;
}
