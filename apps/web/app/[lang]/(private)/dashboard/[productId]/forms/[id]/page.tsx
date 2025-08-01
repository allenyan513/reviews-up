'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const { id, lang, productId } = use(props.params);
  if (!id || !lang || !productId) {
    return null;
  }
  redirect(`/${lang}/${productId}/forms/${id}/default`);
}
