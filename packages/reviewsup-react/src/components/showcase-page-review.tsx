import FlowLayoutServer from './layout/flow-layout-server';
import { ReviewItem } from './review-item';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';

export async function ShowcasePageReview(props: { showcase: ShowcaseEntity }) {
  const reviews = props.showcase.reviews;
  const config = props.showcase.config as ShowcaseConfig;
  const {
    type,
    flow,
    isSourceEnabled,
    isVideoEnabled,
    isImageEnabled,
    isDateEnabled,
    isRatingEnabled,
  } = (config || {}) as ShowcaseConfig;
  if (!reviews) {
    return null;
  }

  return (
    <div>
      {type === 'flow' && (
        <FlowLayoutServer
          items={reviews}
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
          columns={flow.columns || 3}
        />
      )}
    </div>
  );
}
