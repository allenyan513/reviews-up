'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const { id, lang, workspaceId } = use(props.params);
  if (!id || !lang || !workspaceId) {
    return null;
  }
  redirect(`/${lang}/${workspaceId}/forms/${id}/default`);
}
