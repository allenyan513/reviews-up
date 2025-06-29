'use client';
import {api} from '@/lib/api-client';
import {Suspense, use, useEffect, useState} from 'react';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import toast from 'react-hot-toast';
import {ShowcasePageReviewClient} from '@reviewsup/embed-react';

export default function ShowcaseShortIdPage(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  const {lang, shortId} = use(props.params);
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
    <ShowcasePageReviewClient
      showcase={showcase}
      showcaseConfig={showcase.config as ShowcaseConfig}
    />
  );
}
