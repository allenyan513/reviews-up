'use client';
import ListLayout from '@/components/layout/list-layout';
import { ReviewItem } from '@/components/layout/review-item';
import GridLayout from '@/components/layout/grid-layout';
import MarqueeLayout from '@/components/layout/marquee-layout';
import FlowLayout from '@/components/layout/flow-layout';
import { api } from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import toast from 'react-hot-toast';

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
    <div className="bg-gray-50 p-8 border rounded shadow">
      {showcase.type=== 'list' && (
        <ListLayout
          items={showcase.reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
      {showcase.type === 'grid' && (
        <GridLayout
          items={showcase.reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
      {showcase.type === 'marquee' && (
        <MarqueeLayout
          items={showcase.reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
          rowsConfig={[
            { direction: 'forward', speed: 40 },
            { direction: 'forward', speed: 20 },
          ]}
        />
      )}
      {showcase.type === 'flow' && (
        <FlowLayout
          items={showcase.reviews}
          columns={4}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
    </div>
  );
}
