'use client';
import { use } from 'react';
import { WallOfLoveIdPage } from '@/modules/wall-of-love/wall-of-love-id-page';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  return <WallOfLoveIdPage lang={lang} productId={productId} />;
}
