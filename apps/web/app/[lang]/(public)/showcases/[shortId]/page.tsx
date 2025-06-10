'use client';
import { api } from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import toast from 'react-hot-toast';
import ShowcasePageReview from '@/app/[lang]/(private)/[workspaceId]/showcases/[id]/page-review';

export default function Page(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  const [showcase, setShowcase] = useState<ShowcaseEntity>();

  useEffect(() => {
    props.params.then((params) => {
      api
        .getShowcaseByShortId(params.shortId, {
          session: null,
        })
        .then((response) => {
          setShowcase(response);
        })
        .catch((error) => {
          toast.error(error.message);
        });
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
