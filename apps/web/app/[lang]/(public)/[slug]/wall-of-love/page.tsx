'use client';
import { WallOfLovePage } from '@/modules/wall-of-love/wall-of-love-page';
import { use, useEffect, useState } from 'react';
import { WallOfLoveEntity } from '@reviewsup/api/walloflove';
import { api } from '@/lib/api-client';

export default function Page(props: {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}) {
  const { lang, slug } = use(props.params);
  const [wallOfLove, setWallOfLove] = useState<WallOfLoveEntity | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!slug) {
      return;
    }
    api.wallOfLove
      .findOneByProductId(slug)
      .then((wallOfLove) => {
        if (wallOfLove) {
          setWallOfLove(wallOfLove);
        } else {
          console.error('Wall of Love not found for this product.');
        }
      })
      .catch((error) => {
        console.error('Error fetching Wall of Love:', error);
      });
  }, [slug]);

  if (!wallOfLove) {
    return null;
  }

  return <WallOfLovePage lang={lang} wallOfLove={wallOfLove} />;
}
