'use client';
import { api } from '@/lib/api-client';
import { use, useEffect, useState } from 'react';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import toast from 'react-hot-toast';
import ShowcasePageReview from '@/app/[lang]/(app)/[workspaceId]/showcases/[id]/page-review';

export default function Page(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  const { lang, shortId } = use(props.params);
  const [showcase, setShowcase] = useState<ShowcaseEntity>();

  useEffect(() => {
    api.showcase
      .getShowcaseByShortId(shortId)
      .then((response) => {
        setShowcase(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  if (!showcase || !showcase.reviews) return null;

  return (
    <ShowcasePageReview
      showcase={showcase}
      showcaseConfig={showcase.config as ShowcaseConfig}
    />
  );
}
