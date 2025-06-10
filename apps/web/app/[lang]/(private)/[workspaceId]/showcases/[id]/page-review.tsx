import ListLayout from '@/components/layout/list-layout';
import { ReviewItem } from '@/components/layout/review-item';
import GridLayout from '@/components/layout/grid-layout';
import MarqueeLayout from '@/components/layout/marquee-layout';
import FlowLayout from '@/components/layout/flow-layout';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';

export default function ShowcasePageReview(props: {
  showcase: ShowcaseEntity;
  showcaseConfig: ShowcaseConfig;
}) {
  const type = props.showcaseConfig?.type;
  const reviews = props.showcase.reviews;
  if (!type || !reviews || reviews.length === 0) {
    return null;
  }
  return (
    <div className="col-span-3 bg-gray-50 p-8 border rounded shadow">
      {type === 'list' && (
        <ListLayout
          items={reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
      {type === 'grid' && (
        <GridLayout
          items={reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
      {type === 'marquee' && (
        <MarqueeLayout
          items={reviews}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
          rowsConfig={[
            { direction: 'forward', speed: 40 },
            { direction: 'forward', speed: 20 },
          ]}
        />
      )}
      {type === 'flow' && (
        <FlowLayout
          items={reviews}
          columns={3}
          renderItem={(review, idx) => (
            <ReviewItem key={review.id} review={review} />
          )}
        />
      )}
    </div>
  );
}
