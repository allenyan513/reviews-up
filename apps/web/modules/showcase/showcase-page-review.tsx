import ListLayout from '@/modules/showcase/layout/list-layout';
import { ReviewItem } from '@/modules/showcase/review-item';
import MarqueeLayout from '@/modules/showcase/layout/marquee-layout';
import FlowLayout from '@/modules/showcase/layout/flow-layout';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import PoweredBy from '@/components/powered-by';
import { CarouselLayout } from '@/modules/showcase/layout/carousel-layout';
import { SortBy } from '@/types/sortby';
import MultiCarouselLayout from '@/modules/showcase/layout/multi-carousel-layout';

export default function ShowcasePageReview(props: {
  className?: string;
  showcase: ShowcaseEntity;
  showcaseConfig: ShowcaseConfig | undefined;
}) {
  const { reviews } = props.showcase;
  const {
    type,
    flow,
    isSourceEnabled,
    isVideoEnabled,
    isImageEnabled,
    isDateEnabled,
    isRatingEnabled,
    sortBy,
  } = props.showcaseConfig || {};
  if (!reviews) {
    return null;
  }
  let sortedReviews = [...reviews];
  if (sortBy === SortBy.newest) {
    sortedReviews = [...reviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sortBy === SortBy.oldest) {
    sortedReviews = [...reviews].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  } else if (sortBy === SortBy.random) {
    sortedReviews = [...reviews].sort(() => Math.random() - 0.5);
  } else if (sortBy === SortBy.rating) {
    sortedReviews = [...reviews].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0),
    );
  } else {
    sortedReviews = reviews;
  }

  return (
    <div className={props.className}>
      {type === 'list' && (
        <ListLayout
          items={sortedReviews}
          renderItem={(review, idx) => (
            <ReviewItem
              isSourceEnabled={isSourceEnabled}
              isVideoEnabled={isVideoEnabled}
              isImageEnabled={isImageEnabled}
              isDateEnabled={isDateEnabled}
              isRatingEnabled={isRatingEnabled}
              key={review.id}
              review={review}
            />
          )}
        />
      )}
      {type === 'marquee' && (
        <MarqueeLayout
          items={sortedReviews}
          renderItem={(review, idx) => (
            <ReviewItem
              isSourceEnabled={isSourceEnabled}
              isVideoEnabled={isVideoEnabled}
              isImageEnabled={isImageEnabled}
              isDateEnabled={isDateEnabled}
              isRatingEnabled={isRatingEnabled}
              key={review.id}
              review={review}
            />
          )}
          rowsConfig={[
            { direction: 'forward', speed: 40 },
            { direction: 'forward', speed: 20 },
          ]}
        />
      )}
      {type === 'flow' && (
        <FlowLayout
          items={sortedReviews}
          columns={flow?.columns || 3}
          renderItem={(review, idx) => (
            <ReviewItem
              isSourceEnabled={isSourceEnabled}
              isVideoEnabled={isVideoEnabled}
              isImageEnabled={isImageEnabled}
              isDateEnabled={isDateEnabled}
              isRatingEnabled={isRatingEnabled}
              key={review.id}
              review={review}
            />
          )}
        />
      )}
      {type === 'carousel' && (
        <CarouselLayout
          items={sortedReviews}
          autoSlide={true}
          slideInterval={3000}
          renderItem={(review, idx) => (
            <ReviewItem
              isSourceEnabled={isSourceEnabled}
              isVideoEnabled={isVideoEnabled}
              isImageEnabled={isImageEnabled}
              isDateEnabled={isDateEnabled}
              isRatingEnabled={isRatingEnabled}
              className={'max-h-[400px]'}
              key={review.id}
              review={review}
            />
          )}
        />
      )}
      {type === 'multi-carousel' && (
        <MultiCarouselLayout
          items={sortedReviews}
          speed={40}
          direction={'forward'}
          renderItem={(review, idx) => (
            <ReviewItem
              isSourceEnabled={isSourceEnabled}
              isVideoEnabled={false}
              isImageEnabled={false}
              isDateEnabled={isDateEnabled}
              isRatingEnabled={isRatingEnabled}
              className={'max-h-[400px] w-80 h-70'}
              key={review.id}
              review={review}
            />
          )}
        />
      )}
      <PoweredBy />
    </div>
  );
}
