import { WallOfLovePage } from '@/modules/wall-of-love/wall-of-love-page';
import { use } from 'react';

export default function Page(props: {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}) {
  const { lang, slug } = use(props.params);
  return <WallOfLovePage
    lang={lang}
    slug={slug}
  />;
}
